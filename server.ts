import express from 'express';
import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

interface Peer {
  id: string;
  clientId: string;
  ws: WebSocket;
  name: string;
  skin: number;
  avatar: string;
  frame: string;
  nameBorder: string;
  avatarPhoto: string;
  headAcc: number;
  faceAcc: number;
  monsterSkin: string;
  isDev: boolean;
  status: 'lobby' | 'playing';
  chapter: number;
  x: number;
  y: number;
  pa: number;
  crouch: boolean;
  flash: boolean;
  alive: boolean;
  roomCode: string | null;
}

interface CoopRoom {
  code: string;
  chapter: number;
  difficulty: string;
  coopMode: 'bot' | 'player';
  hunterId: string | null;
  playerTraps: Array<{ id: string; x: number; y: number; on: boolean }>;
  seed: number;
  status: 'lobby' | 'playing';
  hostId: string;
  keys: number;
  players: Map<string, Peer>;
  votes: Map<string, 'bot' | 'player'>;
  mapVotes: Map<string, number>;
  votePhase: { active: boolean; endsAt: number; timer: NodeJS.Timeout | null; launching?: boolean } | null;
  createdAt: number;
}

interface ChatMessage {
  id: string;
  authorId: string;
  author: string;
  text: string;
  avatar: string;
  frame: string;
  nameBorder?: string;
  avatarPhoto?: string;
  isDev?: boolean;
  time: number;
}

function sanitizeAvatarPhoto(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s || s.length > 24000) return '';
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(s)) return '';
  return s;
}

const rooms = new Map<string, CoopRoom>();
const peers = new Map<string, Peer>();
const chatHistory: ChatMessage[] = [
  {
    id: 'sys_1',
    authorId: 'system',
    author: 'Смотритель',
    text: 'Добро пожаловать в Не оборачивайся. Не шумите в коридорах.',
    avatar: 'ghoul',
    frame: 'frame_blood',
    time: Date.now() - 30000,
  },
];
const lastChatByPeer = new Map<string, number>();

function filterProfanity(text: string): string {
  const badWords = [/сука/gi, /блять/gi, /блядь/gi, /бля/gi, /хуй/gi, /пизд/gi, /ебат/gi, /нахуй/gi, /fuck/gi, /bitch/gi, /shit/gi];
  let filtered = text;
  for (const re of badWords) {
    filtered = filtered.replace(re, '***');
  }
  return filtered;
}

function broadcastChatMessage(msg: ChatMessage) {
  const payload = JSON.stringify({ type: 'chat_message', message: msg });
  for (const peer of peers.values()) {
    if (peer.ws.readyState === WebSocket.OPEN) {
      peer.ws.send(payload);
    }
  }
}

function broadcastRoomList() {
  const publicRooms = Array.from(rooms.values())
    .filter((r) => r.status === 'lobby' && r.players.size < 4)
    .map((r) => ({
      code: r.code,
      chapter: r.chapter,
      difficulty: r.difficulty,
      coopMode: r.coopMode,
      playerCount: r.players.size,
      maxPlayers: 4,
      hostName: r.players.get(r.hostId)?.name || 'Игрок',
    }));

  const payload = JSON.stringify({
    type: 'room_list',
    rooms: publicRooms,
    onlineCount: peers.size,
  });

  for (const peer of peers.values()) {
    if (peer.ws.readyState === WebSocket.OPEN && !peer.roomCode) {
      peer.ws.send(payload);
    }
  }
}

function broadcastToRoom(room: CoopRoom, data: any, excludeId?: string) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  for (const [id, peer] of room.players) {
    if (id !== excludeId && peer.ws.readyState === WebSocket.OPEN) {
      peer.ws.send(payload);
    }
  }
}

function serializePeer(p: Peer, room: CoopRoom) {
  return {
    id: p.id,
    clientId: p.clientId || '',
    name: p.name,
    skin: p.skin,
    avatar: p.avatar || 'survivor',
    frame: p.frame || 'frame_classic',
    nameBorder: p.nameBorder || 'none',
    avatarPhoto: p.avatarPhoto || '',
    headAcc: p.headAcc || 0,
    faceAcc: p.faceAcc || 0,
    monsterSkin: p.monsterSkin || 'maze',
    isDev: Boolean(p.isDev),
    x: p.x,
    y: p.y,
    pa: p.pa,
    crouch: p.crouch,
    flash: p.flash,
    alive: p.alive,
    isHost: p.id === room.hostId,
    isHunter: room.coopMode === 'player' && room.hunterId === p.id,
  };
}

function clearRoomVote(room: CoopRoom) {
  if (room.votePhase?.timer) {
    clearTimeout(room.votePhase.timer);
  }
  room.votePhase = null;
}

function tallyRoomVotes(room: CoopRoom) {
  let botVotes = 0;
  let playerVotes = 0;
  const voters: Array<{ id: string; name: string; choice: 'bot' | 'player' }> = [];
  for (const [id, choice] of room.votes.entries()) {
    const p = room.players.get(id);
    if (!p) continue;
    if (choice === 'player') playerVotes++;
    else botVotes++;
    voters.push({ id, name: p.name || 'Игрок', choice });
  }
  return { botVotes, playerVotes, voters };
}

function broadcastVoteUpdate(room: CoopRoom) {
  if (room.players.size < 2) return;
  const { botVotes, playerVotes, voters } = tallyRoomVotes(room);
  broadcastToRoom(room, {
    type: 'vote_update',
    active: Boolean(room.votePhase?.active),
    endsAt: room.votePhase?.endsAt || 0,
    totalPlayers: room.players.size,
    botVotes,
    playerVotes,
    voters,
  });
}

function launchRoomMatch(room: CoopRoom) {
  if (room.players.size === 0) return;
  room.status = 'playing';
  room.keys = 0;
  room.playerTraps = [];
  for (const p of room.players.values()) p.alive = true;

  if (room.players.size <= 1) {
    room.coopMode = 'bot';
    room.hunterId = null;
  } else if (room.coopMode === 'player' && (!room.hunterId || !room.players.has(room.hunterId))) {
    const ids = Array.from(room.players.keys());
    room.hunterId = ids[Math.floor(Math.random() * ids.length)] || room.hostId;
  }

  broadcastToRoom(room, {
    type: 'game_started',
    chapter: room.chapter,
    difficulty: room.difficulty,
    coopMode: room.coopMode,
    hunterId: room.hunterId,
    seed: room.seed,
  });
  broadcastRoomList();
}

function finishRoomVote(room: CoopRoom) {
  if (!room.votePhase || room.votePhase.launching) return;
  if (room.votePhase.timer) clearTimeout(room.votePhase.timer);
  room.votePhase.active = false;
  room.votePhase.launching = true;

  const { botVotes, playerVotes } = tallyRoomVotes(room);
  let winner: 'bot' | 'player' = 'bot';
  if (room.players.size >= 2) {
    if (playerVotes > botVotes) {
      winner = 'player';
    } else if (botVotes > playerVotes) {
      winner = 'bot';
    } else if (playerVotes > 0 && playerVotes === botVotes) {
      winner = Math.random() < 0.5 ? 'player' : 'bot';
    } else {
      winner = 'bot';
    }
  }

  room.coopMode = winner;
  if (winner === 'player') {
    const proPlayerIds = Array.from(room.votes.entries())
      .filter(([id, c]) => c === 'player' && room.players.has(id))
      .map(([id]) => id);
    const pool = proPlayerIds.length ? proPlayerIds : Array.from(room.players.keys());
    room.hunterId = pool[Math.floor(Math.random() * pool.length)] || room.hostId;
  } else {
    room.hunterId = null;
  }

  broadcastToRoom(room, {
    type: 'vote_ended',
    coopMode: room.coopMode,
    hunterId: room.hunterId,
    botVotes,
    playerVotes,
  });

  room.votes.clear();
  setTimeout(() => {
    clearRoomVote(room);
    if (rooms.has(room.code) && room.players.size > 0) {
      launchRoomMatch(room);
    }
  }, 1300);
}

function getRoomSnapshot(room: CoopRoom) {
  return {
    type: 'room_state',
    code: room.code,
    chapter: room.chapter,
    difficulty: room.difficulty,
    coopMode: room.coopMode,
    hunterId: room.hunterId,
    status: room.status,
    seed: room.seed,
    keys: room.keys,
    isHost: false,
    players: Array.from(room.players.values()).map((p) => serializePeer(p, room)),
  };
}

wss.on('connection', (ws: WebSocket) => {
  const peerId = 'p_' + Math.random().toString(36).substring(2, 9);
  const peer: Peer = {
    id: peerId,
    clientId: '',
    ws,
    name: 'Игрок',
    skin: 0,
    avatar: 'survivor',
    frame: 'frame_classic',
    nameBorder: 'none',
    avatarPhoto: '',
    headAcc: 0,
    faceAcc: 0,
    monsterSkin: 'maze',
    isDev: false,
    status: 'lobby',
    chapter: 1,
    x: 0,
    y: 0,
    pa: 0,
    crouch: false,
    flash: false,
    alive: true,
    roomCode: null,
  };

  peers.set(peerId, peer);

  ws.send(JSON.stringify({ type: 'connected', peerId }));
  ws.send(JSON.stringify({ type: 'chat_history', messages: chatHistory.slice(-40) }));
  broadcastRoomList();

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'send_chat') {
        const now = Date.now();
        const lastTime = lastChatByPeer.get(peerId) || 0;
        if (now - lastTime < 1000) {
          ws.send(JSON.stringify({ type: 'chat_error', message: 'Не отправляйте сообщения слишком часто' }));
          return;
        }
        const rawText = String(data.text || '').trim();
        if (!rawText) return;
        const text = filterProfanity(rawText.slice(0, 140));
        lastChatByPeer.set(peerId, now);
        const msg: ChatMessage = {
          id: 'msg_' + Math.random().toString(36).substring(2, 9),
          authorId: peer.id,
          author: peer.name || 'Игрок',
          text,
          avatar: peer.avatar || 'survivor',
          frame: peer.frame || 'frame_classic',
          nameBorder: peer.nameBorder || 'none',
          avatarPhoto: peer.avatarPhoto || '',
          isDev: Boolean(peer.isDev),
          time: now,
        };
        chatHistory.push(msg);
        if (chatHistory.length > 50) chatHistory.shift();
        broadcastChatMessage(msg);
        return;
      }

      if (data.type === 'register_client_id') {
        peer.clientId = sanitizeClientId(data.clientId);
        if (data.name) peer.name = String(data.name).slice(0, 12);
        return;
      }

      if (data.type === 'player_status_update') {
        peer.status = data.status === 'playing' ? 'playing' : 'lobby';
        peer.chapter = Math.max(1, Math.min(5, Number(data.chapter) || 1));
        return;
      }

      if (data.type === 'friend_lookup') {
        const rawIds = Array.isArray(data.clientIds) ? data.clientIds : [];
        const wanted = new Set(rawIds.map((x: unknown) => sanitizeClientId(x)).filter(Boolean));
        const statuses: Record<string, { online: boolean; status: string; chapter: number; name: string; avatar: string; frame: string; nameBorder: string; roomCode: string | null }> = {};
        for (const p of peers.values()) {
          if (p.clientId && wanted.has(p.clientId)) {
            statuses[p.clientId] = {
              online: true,
              status: p.status,
              chapter: p.chapter,
              name: p.name,
              avatar: p.avatar,
              frame: p.frame,
              nameBorder: p.nameBorder || 'none',
              roomCode: p.roomCode,
            };
          }
        }
        ws.send(JSON.stringify({ type: 'friend_status_list', statuses }));
        return;
      }

      if (data.type === 'friend_invite') {
        const targetClientId = sanitizeClientId(data.targetClientId);
        if (!targetClientId) return;
        const isChristmasEvent = Boolean(data.isChristmasEvent);
        const roomCode = String(data.roomCode || peer.roomCode || '').toUpperCase().slice(0, 8);
        const chapter = isChristmasEvent ? 5 : Math.max(1, Math.min(5, Number(data.chapter) || 1));
        for (const p of peers.values()) {
          if (p.clientId === targetClientId && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(
              JSON.stringify({
                type: 'friend_invite_received',
                fromClientId: peer.clientId,
                fromName: peer.name || 'Игрок',
                fromAvatar: peer.avatar || 'survivor',
                fromFrame: peer.frame || 'frame_classic',
                fromNameBorder: peer.nameBorder || 'none',
                roomCode,
                chapter,
                isChristmasEvent,
              })
            );
          }
        }
        return;
      }

      if (data.type === 'room_map_vote') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;
        const chNum = Math.max(1, Math.min(5, Number(data.chapter) || 1));
        room.mapVotes.set(peerId, chNum);
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const v of room.mapVotes.values()) {
          counts[v] = (counts[v] || 0) + 1;
        }
        let bestCh = room.chapter;
        let bestCnt = -1;
        for (const [k, cnt] of Object.entries(counts)) {
          if (cnt > bestCnt) {
            bestCnt = cnt;
            bestCh = Number(k);
          }
        }
        if (bestCnt > 0 && room.status === 'lobby') {
          room.chapter = bestCh;
        }
        broadcastToRoom(room, {
          type: 'room_map_vote_update',
          counts,
          winningChapter: bestCh,
          totalVotes: room.mapVotes.size,
        });
        broadcastRoomList();
        return;
      }

      if (data.type === 'set_profile') {
        peer.name = String(data.name || 'Игрок').slice(0, 12);
        peer.skin = Number(data.skin) || 0;
        peer.avatar = String(data.avatar || 'survivor').slice(0, 30);
        peer.frame = String(data.frame || 'frame_classic').slice(0, 30);
        if (data.nameBorder !== undefined) peer.nameBorder = String(data.nameBorder || 'none').slice(0, 32);
        if (data.clientId !== undefined) peer.clientId = sanitizeClientId(data.clientId);
        if (data.avatarPhoto !== undefined) peer.avatarPhoto = sanitizeAvatarPhoto(data.avatarPhoto);
        if (data.headAcc !== undefined) peer.headAcc = Math.max(0, Math.min(30, Number(data.headAcc) | 0));
        if (data.faceAcc !== undefined) peer.faceAcc = Math.max(0, Math.min(30, Number(data.faceAcc) | 0));
        if (data.monsterSkin !== undefined) peer.monsterSkin = String(data.monsterSkin || 'maze').slice(0, 20);
        if (data.isDev !== undefined) peer.isDev = Boolean(data.isDev);

        if (peer.roomCode) {
          const room = rooms.get(peer.roomCode);
          if (room) {
            broadcastToRoom(room, {
              type: 'peer_profile_updated',
              ...serializePeer(peer, room),
            });
          }
        }
        return;
      }

      if (data.type === 'get_rooms') {
        const publicRooms = Array.from(rooms.values())
          .filter((r) => r.status === 'lobby' && r.players.size < 4)
          .map((r) => ({
            code: r.code,
            chapter: r.chapter,
            difficulty: r.difficulty,
            coopMode: r.coopMode,
            playerCount: r.players.size,
            maxPlayers: 4,
            hostName: r.players.get(r.hostId)?.name || 'Игрок',
          }));

        ws.send(
          JSON.stringify({
            type: 'room_list',
            rooms: publicRooms,
            onlineCount: peers.size,
          })
        );
        return;
      }

      if (data.type === 'create_room') {
        let code = String(data.code || '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .slice(0, 6);
        if (!code || rooms.has(code)) {
          const words = ['MAZE', 'DARK', 'TOMB', 'VOID', 'FEAR', 'SOUL', 'GATE', 'ECHO', 'DEEP', 'COLD'];
          code = words[Math.floor(Math.random() * words.length)] + Math.floor(10 + Math.random() * 90);
        }

        const coopMode: 'bot' | 'player' = data.coopMode === 'player' ? 'player' : 'bot';
        const room: CoopRoom = {
          code,
          chapter: Number(data.chapter) || 1,
          difficulty: String(data.difficulty || 'easy'),
          coopMode,
          hunterId: coopMode === 'player' ? peerId : null,
          playerTraps: [],
          seed: Math.floor(Math.random() * 1000000),
          status: 'lobby',
          hostId: peerId,
          keys: 0,
          players: new Map([[peerId, peer]]),
          votes: new Map(),
          mapVotes: new Map(),
          votePhase: null,
          createdAt: Date.now(),
        };

        rooms.set(code, room);
        peer.roomCode = code;
        peer.alive = true;

        const snapshot = getRoomSnapshot(room);
        ws.send(JSON.stringify({ ...snapshot, isHost: true, type: 'room_joined' }));
        broadcastRoomList();
        return;
      }

      if (data.type === 'join_room') {
        const code = String(data.code || '')
          .toUpperCase()
          .trim();
        const room = rooms.get(code);

        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'Комната ' + code + ' не найдена' }));
          return;
        }

        if (room.players.size >= 4) {
          ws.send(JSON.stringify({ type: 'error', message: 'Комната ' + code + ' заполнена (макс. 4 игрока)' }));
          return;
        }

        peer.roomCode = code;
        peer.alive = true;
        room.players.set(peerId, peer);

        const snapshot = getRoomSnapshot(room);
        ws.send(JSON.stringify({ ...snapshot, isHost: peerId === room.hostId, type: 'room_joined' }));

        broadcastToRoom(
          room,
          {
            type: 'player_joined',
            player: serializePeer(peer, room),
          },
          peerId
        );

        if (room.players.size >= 2) {
          broadcastVoteUpdate(room);
        }
        broadcastRoomList();
        return;
      }

      if (data.type === 'leave_room') {
        handleLeaveRoom(peer);
        broadcastRoomList();
        return;
      }

      if (data.type === 'set_room_difficulty') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.hostId !== peerId || room.status !== 'lobby') return;
        const allowed = new Set(['easy', 'hard', 'extreme']);
        const nextDiff = allowed.has(String(data.difficulty)) ? String(data.difficulty) : 'easy';
        room.difficulty = nextDiff;
        const payload = JSON.stringify({ type: 'room_difficulty_updated', difficulty: nextDiff });
        for (const p of room.players.values()) {
          if (p.ws.readyState === WebSocket.OPEN) p.ws.send(payload);
        }
        broadcastRoomList();
        return;
      }

      if (data.type === 'set_room_mode') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.hostId !== peerId) return;
        const nextMode: 'bot' | 'player' = data.coopMode === 'player' ? 'player' : 'bot';
        room.coopMode = nextMode;
        if (nextMode === 'player') {
          if (!room.hunterId || !room.players.has(room.hunterId)) {
            const arr = Array.from(room.players.keys());
            room.hunterId = arr.length > 1 ? arr[arr.length - 1] : room.hostId;
          }
        } else {
          room.hunterId = null;
        }
        broadcastToRoom(room, {
          type: 'room_mode_updated',
          coopMode: room.coopMode,
          hunterId: room.hunterId,
        });
        broadcastRoomList();
        return;
      }

      if (data.type === 'set_room_hunter') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.hostId !== peerId) return;
        const targetId = String(data.hunterId || '');
        if (room.players.has(targetId)) {
          room.coopMode = 'player';
          room.hunterId = targetId;
          broadcastToRoom(room, {
            type: 'room_mode_updated',
            coopMode: room.coopMode,
            hunterId: room.hunterId,
          });
        }
        return;
      }

      if (data.type === 'cast_vote') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.players.size < 2) return;
        const choice: 'bot' | 'player' = data.choice === 'player' ? 'player' : 'bot';
        room.votes.set(peerId, choice);
        broadcastVoteUpdate(room);
        if (room.votePhase?.active && !room.votePhase.launching && room.votes.size >= room.players.size) {
          if (room.votePhase.timer) clearTimeout(room.votePhase.timer);
          room.votePhase.timer = setTimeout(() => finishRoomVote(room), 500);
        }
        return;
      }

      if (data.type === 'start_game') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.hostId !== peerId) return;
        if (room.votePhase?.active || room.votePhase?.launching) return;

        // If the player is alone in the room, skip voting completely and start with Bot
        if (room.players.size <= 1) {
          clearRoomVote(room);
          room.votes.clear();
          launchRoomMatch(room);
          return;
        }

        // 2+ players: run synchronized Bot vs Player vote at the start of the match
        clearRoomVote(room);
        room.votes.clear();
        const endsAt = Date.now() + 10000;
        room.votePhase = {
          active: true,
          endsAt,
          timer: setTimeout(() => finishRoomVote(room), 10000),
          launching: false,
        };
        broadcastToRoom(room, {
          type: 'vote_started',
          endsAt,
          totalPlayers: room.players.size,
        });
        broadcastVoteUpdate(room);
        return;
      }

      if (data.type === 'player_update') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;

        peer.x = Number(data.x) || 0;
        peer.y = Number(data.y) || 0;
        peer.pa = Number(data.pa) || 0;
        peer.crouch = Boolean(data.crouch);
        peer.flash = Boolean(data.flash);
        peer.alive = data.alive !== undefined ? Boolean(data.alive) : true;

        broadcastToRoom(
          room,
          {
            type: 'peer_moved',
            id: peerId,
            x: peer.x,
            y: peer.y,
            pa: peer.pa,
            crouch: peer.crouch,
            flash: peer.flash,
            alive: peer.alive,
            noise: data.noise || 0,
            isHunter: room.coopMode === 'player' && room.hunterId === peerId,
            monsterSkin: peer.monsterSkin || 'maze',
          },
          peerId
        );
        return;
      }

      if (data.type === 'monster_sync') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.hostId !== peerId) return;
        broadcastToRoom(
          room,
          {
            type: 'monster_state',
            m: data.m || null,
            lurk: data.lurk || null,
          },
          peerId
        );
        return;
      }

      if (data.type === 'monster_place_trap') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room || room.coopMode !== 'player' || room.hunterId !== peerId) return;
        const tx = Number(data.x);
        const ty = Number(data.y);
        if (!Number.isFinite(tx) || !Number.isFinite(ty)) return;
        const trap = {
          id: 'pt_' + Math.random().toString(36).substring(2, 8),
          x: Number(tx.toFixed(2)),
          y: Number(ty.toFixed(2)),
          on: true,
        };
        if (room.playerTraps.length >= 6) room.playerTraps.shift();
        room.playerTraps.push(trap);
        broadcastToRoom(room, {
          type: 'trap_placed',
          trap,
          hunterName: peer.name,
        });
        return;
      }

      if (data.type === 'player_caught') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;
        const targetId = String(data.targetId || peerId);
        const targetPeer = room.players.get(targetId);
        if (targetPeer) {
          targetPeer.alive = false;
          broadcastToRoom(room, {
            type: 'peer_caught',
            id: targetId,
            playerName: targetPeer.name,
            by: peer.name,
          });
        }
        return;
      }

      if (data.type === 'key_collected') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;

        room.keys = (room.keys || 0) + 1;
        broadcastToRoom(room, {
          type: 'key_found',
          totalKeys: room.keys,
          playerName: peer.name,
          keyIndex: data.keyIndex,
        });
        return;
      }

      if (data.type === 'trap_disarmed') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;

        broadcastToRoom(room, {
          type: 'trap_disarmed',
          playerName: peer.name,
          trapIndex: data.trapIndex,
          trapId: data.trapId,
        });
        return;
      }

      if (data.type === 'radio_ping') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;

        broadcastToRoom(room, {
          type: 'radio_ping',
          playerName: peer.name,
          message: String(data.message || '').slice(0, 40),
          pingType: data.pingType || 'alert',
        });
        return;
      }

      if (data.type === 'player_escaped') {
        if (!peer.roomCode) return;
        const room = rooms.get(peer.roomCode);
        if (!room) return;

        broadcastToRoom(room, {
          type: 'peer_escaped',
          playerName: peer.name,
        });
        return;
      }
    } catch (err) {
      console.error('WebSocket message parsing error', err);
    }
  });

  ws.on('close', () => {
    handleLeaveRoom(peer);
    peers.delete(peerId);
    broadcastRoomList();
  });
});

function handleLeaveRoom(peer: Peer) {
  if (!peer.roomCode) return;
  const room = rooms.get(peer.roomCode);
  if (!room) return;

  room.players.delete(peer.id);
  room.votes.delete(peer.id);
  room.mapVotes.delete(peer.id);
  peer.roomCode = null;

  if (room.players.size === 0) {
    clearRoomVote(room);
    rooms.delete(room.code);
  } else {
    if (room.hostId === peer.id) {
      const nextHost = room.players.keys().next().value;
      if (nextHost) {
        room.hostId = nextHost;
        const nextPeer = room.players.get(nextHost);
        if (nextPeer && nextPeer.ws.readyState === WebSocket.OPEN) {
          nextPeer.ws.send(JSON.stringify({ type: 'promoted_to_host' }));
        }
      }
    }
    if (room.hunterId === peer.id) {
      room.hunterId = room.coopMode === 'player' ? room.hostId : null;
    }

    broadcastToRoom(room, {
      type: 'player_left',
      id: peer.id,
      name: peer.name,
      newHostId: room.hostId,
      hunterId: room.hunterId,
    });

    if (room.players.size < 2) {
      const wasVoting = Boolean(room.votePhase?.active || room.votePhase?.launching);
      clearRoomVote(room);
      room.votes.clear();
      if (wasVoting) {
        broadcastToRoom(room, { type: 'vote_cancelled', reason: 'solo' });
        launchRoomMatch(room);
      }
    } else {
      broadcastVoteUpdate(room);
    }
  }
}

// Global Promo Code Registry (persisted to disk so per-code global caps & once-per-player limits hold)
interface PromoCodeDef {
  key:
    | 'MATRIXMAN'
    | 'FIGURAA'
    | 'COINZZZ'
    | 'USECODE 500'
    | 'GRANNYDE'
    | 'TVMAN'
    | 'EVENTUPD'
    | 'AMBUSH'
    | 'GTA VI RELEASE';
  maxUses: number | null;
  rewardType: 'monster_skin' | 'coins' | 'coin_boost' | 'car';
  rewardId?: string;
  amount?: number;
  durationMs?: number;
}

const PROMO_DEFS: Record<string, PromoCodeDef> = {
  MATRIXMAN: { key: 'MATRIXMAN', maxUses: 1, rewardType: 'monster_skin', rewardId: 'matrixman' },
  FIGURAA: { key: 'FIGURAA', maxUses: 5, rewardType: 'monster_skin', rewardId: 'figuraa' },
  COINZZZ: { key: 'COINZZZ', maxUses: null, rewardType: 'coins', amount: 1_000_000_000 },
  'USECODE 500': { key: 'USECODE 500', maxUses: 5, rewardType: 'coins', amount: 500 },
  GRANNYDE: { key: 'GRANNYDE', maxUses: 4, rewardType: 'monster_skin', rewardId: 'grannyde' },
  TVMAN: { key: 'TVMAN', maxUses: 3, rewardType: 'monster_skin', rewardId: 'tvman' },
  EVENTUPD: { key: 'EVENTUPD', maxUses: null, rewardType: 'coin_boost', durationMs: 30 * 60 * 1000 },
  AMBUSH: { key: 'AMBUSH', maxUses: null, rewardType: 'monster_skin', rewardId: 'ambush' },
  'GTA VI RELEASE': { key: 'GTA VI RELEASE', maxUses: null, rewardType: 'car', rewardId: 'gta_buffalo' },
};

const PROMO_DATA_DIR = path.resolve(__dirname, 'data');
const PROMO_DATA_FILE = path.join(PROMO_DATA_DIR, 'promo_claims.json');
const EVENT_LB_FILE = path.join(PROMO_DATA_DIR, 'event_leaderboard.json');

type PromoClaimsMap = Record<string, string[]>;

function loadPromoClaims(): PromoClaimsMap {
  const base: PromoClaimsMap = {
    MATRIXMAN: [],
    FIGURAA: [],
    COINZZZ: [],
    'USECODE 500': [],
    GRANNYDE: [],
    TVMAN: [],
    EVENTUPD: [],
    AMBUSH: [],
    'GTA VI RELEASE': [],
  };
  try {
    if (fs.existsSync(PROMO_DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(PROMO_DATA_FILE, 'utf8'));
      if (parsed && typeof parsed === 'object') {
        for (const k of Object.keys(base)) {
          if (Array.isArray(parsed[k])) {
            base[k] = parsed[k].map((x: unknown) => String(x || '').trim()).filter(Boolean);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not load promo_claims.json, using empty registry', err);
  }
  return base;
}

const promoClaims: PromoClaimsMap = loadPromoClaims();

function savePromoClaims() {
  try {
    if (!fs.existsSync(PROMO_DATA_DIR)) {
      fs.mkdirSync(PROMO_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROMO_DATA_FILE, JSON.stringify(promoClaims, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to persist promo_claims.json', err);
  }
}

interface EventLeaderboardEntry {
  clientId: string;
  name: string;
  escapes: number;
  snowflakes: number;
  bestTimeSec: number;
  updatedAt: number;
}

function loadEventLeaderboard(): EventLeaderboardEntry[] {
  try {
    if (fs.existsSync(EVENT_LB_FILE)) {
      const arr = JSON.parse(fs.readFileSync(EVENT_LB_FILE, 'utf8'));
      if (Array.isArray(arr)) return arr;
    }
  } catch (err) {
    console.warn('Could not load event_leaderboard.json', err);
  }
  return [];
}

let eventLeaderboard: EventLeaderboardEntry[] = loadEventLeaderboard();

function saveEventLeaderboard() {
  try {
    if (!fs.existsSync(PROMO_DATA_DIR)) {
      fs.mkdirSync(PROMO_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENT_LB_FILE, JSON.stringify(eventLeaderboard, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to persist event_leaderboard.json', err);
  }
}

function sanitizeClientId(raw: unknown): string {
  const s = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_.:-]/g, '')
    .slice(0, 64);
  return s;
}

// REST Healthcheck & status
app.use(express.json());

app.get('/api/coop/status', (_req, res) => {
  res.json({
    online: peers.size,
    activeRooms: rooms.size,
    status: 'online',
  });
});

app.get('/api/event/leaderboard', (_req, res) => {
  const sorted = [...eventLeaderboard]
    .sort((a, b) => b.escapes - a.escapes || b.snowflakes - a.snowflakes || (a.bestTimeSec || 9999) - (b.bestTimeSec || 9999))
    .slice(0, 20);
  res.json({ ok: true, entries: sorted });
});

app.post('/api/event/leaderboard', (req, res) => {
  const clientId = sanitizeClientId(req.body?.clientId);
  const name = String(req.body?.name || 'Выживший').trim().slice(0, 14) || 'Выживший';
  const escapesDelta = Math.max(0, Math.min(5, Number(req.body?.escapesDelta) || 0));
  const snowflakes = Math.max(0, Number(req.body?.snowflakes) || 0);
  const clearTimeSec = Math.max(0, Number(req.body?.clearTimeSec) || 0);
  if (!clientId) {
    res.status(400).json({ ok: false, message: 'clientId required' });
    return;
  }
  let entry = eventLeaderboard.find((e) => e.clientId === clientId);
  if (!entry) {
    entry = {
      clientId,
      name,
      escapes: escapesDelta,
      snowflakes,
      bestTimeSec: clearTimeSec || 0,
      updatedAt: Date.now(),
    };
    eventLeaderboard.push(entry);
  } else {
    entry.name = name;
    entry.escapes += escapesDelta;
    entry.snowflakes = Math.max(entry.snowflakes, snowflakes);
    if (clearTimeSec > 0 && (!entry.bestTimeSec || clearTimeSec < entry.bestTimeSec)) {
      entry.bestTimeSec = clearTimeSec;
    }
    entry.updatedAt = Date.now();
  }
  saveEventLeaderboard();
  const sorted = [...eventLeaderboard]
    .sort((a, b) => b.escapes - a.escapes || b.snowflakes - a.snowflakes || (a.bestTimeSec || 9999) - (b.bestTimeSec || 9999))
    .slice(0, 20);
  res.json({ ok: true, entries: sorted });
});

app.get('/api/export-html', (_req, res) => {
  const distDir = path.resolve(__dirname, 'dist');
  const distHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(distHtmlPath)) {
    res.status(503).json({
      ok: false,
      message: 'Сборка dist не найдена. Выполните npm run build перед экспортом.',
    });
    return;
  }
  try {
    let html = fs.readFileSync(distHtmlPath, 'utf8');
    // Inline stylesheets
    html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi, (full, href) => {
      const cleanPath = String(href || '').replace(/^\//, '');
      const filePath = path.join(distDir, cleanPath);
      if (fs.existsSync(filePath)) {
        const css = fs.readFileSync(filePath, 'utf8').replace(/<\/style>/gi, '<\\/style>');
        return `<style>${css}</style>`;
      }
      return full;
    });
    // Inline module scripts
    html = html.replace(/<script([^>]*)src=["']([^"']+)["']([^>]*)><\/script>/gi, (full, before, src, after) => {
      const cleanPath = String(src || '').replace(/^\//, '');
      const filePath = path.join(distDir, cleanPath);
      if (fs.existsSync(filePath)) {
        const js = fs.readFileSync(filePath, 'utf8').replace(/<\/script>/gi, '<\\/script>');
        const isModule = /type=["']module["']/i.test(before + ' ' + after);
        return `<script${isModule ? ' type="module"' : ''}>${js}</script>`;
      }
      return full;
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ne-oborachivaisya.html"');
    res.send(html);
  } catch (err) {
    console.error('Export HTML error', err);
    res.status(500).json({ ok: false, message: 'Не удалось сформировать HTML-файл.' });
  }
});

app.post('/api/codes/redeem', (req, res) => {
  const rawCode = String(req.body?.code || '').trim().replace(/\s+/g, ' ');
  const norm = rawCode.toUpperCase();
  const clientId = sanitizeClientId(req.body?.clientId);

  if (!norm) {
    res.status(400).json({ ok: false, message: 'Введи код.' });
    return;
  }

  const def = PROMO_DEFS[norm];
  if (!def) {
    res.status(404).json({ ok: false, message: 'Неизвестный код. Проверь написание.' });
    return;
  }

  if (!clientId) {
    res.status(400).json({ ok: false, message: 'Ошибка идентификатора игрока. Обнови страницу.' });
    return;
  }

  const list = (promoClaims[def.key] = promoClaims[def.key] || []);

  if (list.includes(clientId)) {
    res.status(409).json({
      ok: false,
      alreadyClaimed: true,
      codeKey: def.key,
      rewardType: def.rewardType,
      rewardId: def.rewardId,
      message: 'Ты уже использовал этот код! Повторно ввести его нельзя.',
    });
    return;
  }

  if (def.maxUses !== null && list.length >= def.maxUses) {
    res.status(410).json({
      ok: false,
      exhausted: true,
      codeKey: def.key,
      used: list.length,
      maxUses: def.maxUses,
      remaining: 0,
      message:
        def.maxUses === 1
          ? 'Код уже активирован единственным счастливчиком (лимит 1/1 исчерпан).'
          : `Лимит активаций кода исчерпан (${def.maxUses}/${def.maxUses}).`,
    });
    return;
  }

  list.push(clientId);
  savePromoClaims();

  const remaining = def.maxUses !== null ? Math.max(0, def.maxUses - list.length) : null;
  let successMsg = 'Код активирован!';
  if (def.key === 'MATRIXMAN') {
    successMsg = 'Код активирован! Разблокирован эксклюзивный скин монстра MatrixMan (1/1).';
  } else if (def.key === 'FIGURAA') {
    successMsg = `Код активирован! Разблокирован высокий скин монстра FIGURAA (осталось мест: ${remaining}).`;
  } else if (def.key === 'GRANNYDE') {
    successMsg = `Код активирован! Разблокирован секретный скин GrannyDe (осталось мест: ${remaining}).`;
  } else if (def.key === 'TVMAN') {
    successMsg = `Код активирован! Разблокирован секретный скин TVMAN (осталось мест: ${remaining}).`;
  } else if (def.key === 'USECODE 500') {
    successMsg = `Код активирован! Начислено 500 монет (осталось мест: ${remaining}).`;
  } else if (def.key === 'COINZZZ') {
    successMsg = 'Код активирован! Начислено 1 000 000 000 монет.';
  } else if (def.key === 'EVENTUPD') {
    successMsg = 'Код активирован! Активирован буст 2x МОНЕТ на 30 минут!';
  } else if (def.key === 'AMBUSH') {
    successMsg = 'Код активирован! Разблокирован эксклюзивный скин монстра Ambush!';
  } else if (def.key === 'GTA VI RELEASE') {
    successMsg = 'Код активирован! Разблокирован эксклюзивный белый спорт-седан Buffalo (Автосалон → Эксклюзивные)!';
  }

  res.json({
    ok: true,
    codeKey: def.key,
    rewardType: def.rewardType,
    rewardId: def.rewardId || null,
    amount: def.amount || 0,
    durationMs: def.durationMs || 0,
    used: list.length,
    maxUses: def.maxUses,
    remaining,
    message: successMsg,
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : NaN;
  const envPort = Number(process.env.PORT);
  const nginxPort = Number(process.env.NGINX_PORT);
  const port =
    Number.isFinite(cliPort) && cliPort > 0
      ? cliPort
      : isDev && Number.isFinite(nginxPort) && envPort === nginxPort
        ? Number(process.env.DEFAULT_APP_PORT) || 3000
        : Number.isFinite(envPort) && envPort > 0
          ? envPort
          : 3000;

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (co-op WebSocket enabled on /ws)`);
  });
}

startServer();
