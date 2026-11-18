/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Real WebSocket Cooperative Multiplayer Manager
 */

class CoopManager {
  constructor() {
    this.ws = null;
    this.peerId = null;
    this.currentRoom = null;
    this.isHost = false;
    this.peers = new Map();
    this.roomListeners = new Set();
    this.peerMoveListeners = new Set();
    this.keyListeners = new Set();
    this.gameStartListeners = new Set();
    this.errorListeners = new Set();
    this.roomListListeners = new Set();
    this.radioListeners = new Set();
    this.chatListeners = new Set();
    this.chatHistoryListeners = new Set();
    this.monsterStateListeners = new Set();
    this.trapPlacedListeners = new Set();
    this.peerCaughtListeners = new Set();
    this.roomModeListeners = new Set();
    this.voteStartListeners = new Set();
    this.voteUpdateListeners = new Set();
    this.voteEndListeners = new Set();
    this.friendLookupListeners = new Set();
    this.friendInviteListeners = new Set();
    this.mapVoteListeners = new Set();
    this.clientId = '';
    this.currentVote = null;
    this.lastRooms = [];
    this.onlineCount = 0;
    this.isConnected = false;
    this.reconnectTimer = null;
    this.lastProfilePayload = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (this.lastProfilePayload) {
          this.send(this.lastProfilePayload);
        }
        if (this.clientId) {
          this.send({ type: 'register_client_id', clientId: this.clientId });
        }
        this.fetchRooms();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {
          console.error('Failed to parse co-op WS message', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch (e) {
      console.warn('Co-op WebSocket connection error:', e);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  handleMessage(data) {
    switch (data.type) {
      case 'connected':
        this.peerId = data.peerId;
        if (this.lastProfilePayload) this.send(this.lastProfilePayload);
        if (this.clientId) this.send({ type: 'register_client_id', clientId: this.clientId });
        break;

      case 'friend_lookup_result':
        this.friendLookupListeners.forEach((fn) => fn(Array.isArray(data.results) ? data.results : []));
        break;

      case 'friend_invite_received':
        this.friendInviteListeners.forEach((fn) => fn(data));
        break;

      case 'room_map_vote_state':
        this.mapVoteListeners.forEach((fn) => fn(data));
        break;

      case 'room_list':
        this.lastRooms = data.rooms || [];
        this.onlineCount = data.onlineCount || 0;
        this.roomListListeners.forEach((fn) => fn(this.lastRooms, this.onlineCount));
        break;

      case 'room_joined':
        this.currentRoom = {
          code: data.code,
          chapter: data.chapter,
          difficulty: data.difficulty,
          coopMode: data.coopMode || 'bot',
          hunterId: data.hunterId || null,
          seed: data.seed,
          status: data.status,
          keys: data.keys,
        };
        this.isHost = Boolean(data.isHost);
        this.peers.clear();
        if (Array.isArray(data.players)) {
          data.players.forEach((p) => {
            if (p.id !== this.peerId) {
              this.peers.set(p.id, p);
            }
          });
        }
        this.notifyRoomUpdate();
        break;

      case 'player_joined':
        if (data.player && data.player.id !== this.peerId) {
          this.peers.set(data.player.id, data.player);
          this.notifyRoomUpdate();
        }
        break;

      case 'player_left':
        if (data.id) {
          this.peers.delete(data.id);
          if (data.newHostId && data.newHostId === this.peerId) {
            this.isHost = true;
          }
          if (this.currentRoom && data.hunterId !== undefined) {
            this.currentRoom.hunterId = data.hunterId;
          }
          this.notifyRoomUpdate();
        }
        break;

      case 'promoted_to_host':
        this.isHost = true;
        this.notifyRoomUpdate();
        break;

      case 'room_difficulty_updated':
        if (this.currentRoom) {
          this.currentRoom.difficulty = data.difficulty || this.currentRoom.difficulty;
          this.notifyRoomUpdate();
        }
        break;

      case 'room_mode_updated':
        if (this.currentRoom) {
          this.currentRoom.coopMode = data.coopMode || 'bot';
          this.currentRoom.hunterId = data.hunterId || null;
          this.peers.forEach((p) => {
            p.isHunter = this.currentRoom.coopMode === 'player' && p.id === this.currentRoom.hunterId;
          });
          this.roomModeListeners.forEach((fn) => fn(this.currentRoom));
          this.notifyRoomUpdate();
        }
        break;

      case 'vote_started':
        this.currentVote = {
          active: true,
          endsAt: data.endsAt || Date.now() + 10000,
          totalPlayers: data.totalPlayers || this.peers.size + 1,
          botVotes: 0,
          playerVotes: 0,
          voters: [],
        };
        this.voteStartListeners.forEach((fn) => fn(this.currentVote));
        break;

      case 'vote_update':
        this.currentVote = {
          active: Boolean(data.active),
          endsAt: data.endsAt || 0,
          totalPlayers: data.totalPlayers || this.peers.size + 1,
          botVotes: data.botVotes || 0,
          playerVotes: data.playerVotes || 0,
          voters: Array.isArray(data.voters) ? data.voters : [],
        };
        this.voteUpdateListeners.forEach((fn) => fn(this.currentVote));
        break;

      case 'vote_ended':
      case 'vote_cancelled':
        this.currentVote = null;
        if (this.currentRoom && data.coopMode) {
          this.currentRoom.coopMode = data.coopMode;
          this.currentRoom.hunterId = data.hunterId || null;
        }
        this.voteEndListeners.forEach((fn) => fn(data));
        break;

      case 'game_started':
        this.currentVote = null;
        if (this.currentRoom) {
          this.currentRoom.status = 'playing';
          this.currentRoom.seed = data.seed;
          this.currentRoom.chapter = data.chapter;
          this.currentRoom.difficulty = data.difficulty || this.currentRoom.difficulty;
          this.currentRoom.coopMode = data.coopMode || this.currentRoom.coopMode || 'bot';
          this.currentRoom.hunterId = data.hunterId !== undefined ? data.hunterId : this.currentRoom.hunterId;
          this.peers.forEach((p) => {
            p.alive = true;
            p.isHunter = this.currentRoom.coopMode === 'player' && p.id === this.currentRoom.hunterId;
          });
        }
        this.gameStartListeners.forEach((fn) => fn(data));
        break;

      case 'peer_profile_updated':
        if (data.id && data.id !== this.peerId) {
          const peer = this.peers.get(data.id) || { id: data.id };
          Object.assign(peer, data);
          this.peers.set(data.id, peer);
          this.notifyRoomUpdate();
        }
        break;

      case 'peer_moved':
        if (data.id && data.id !== this.peerId) {
          const peer = this.peers.get(data.id) || { id: data.id };
          Object.assign(peer, data);
          this.peers.set(data.id, peer);
          this.peerMoveListeners.forEach((fn) => fn(data));
        }
        break;

      case 'monster_state':
        this.monsterStateListeners.forEach((fn) => fn(data));
        break;

      case 'trap_placed':
        this.trapPlacedListeners.forEach((fn) => fn(data));
        break;

      case 'peer_caught':
        if (data.id && data.id !== this.peerId) {
          const peer = this.peers.get(data.id);
          if (peer) peer.alive = false;
        }
        this.peerCaughtListeners.forEach((fn) => fn(data));
        break;

      case 'key_found':
        if (this.currentRoom) {
          this.currentRoom.keys = data.totalKeys;
        }
        this.keyListeners.forEach((fn) => fn(data));
        break;

      case 'radio_ping':
        this.radioListeners.forEach((fn) => fn(data));
        break;

      case 'chat_message':
        this.chatListeners.forEach((fn) => fn(data.message));
        break;

      case 'chat_history':
        this.chatHistoryListeners.forEach((fn) => fn(data.messages));
        break;

      case 'error':
        this.errorListeners.forEach((fn) => fn(data.message));
        break;
    }
  }

  notifyRoomUpdate() {
    this.roomListeners.forEach((fn) => fn(this.currentRoom, Array.from(this.peers.values()), this.isHost));
  }

  setProfile(name, skin, avatar = 'survivor', frame = 'frame_classic', extras = {}) {
    const payload = {
      type: 'set_profile',
      name,
      skin,
      avatar,
      frame,
      ...(extras.nameBorder !== undefined ? { nameBorder: extras.nameBorder } : {}),
      ...(extras.avatarPhoto !== undefined ? { avatarPhoto: extras.avatarPhoto } : {}),
      ...(extras.headAcc !== undefined ? { headAcc: extras.headAcc } : {}),
      ...(extras.faceAcc !== undefined ? { faceAcc: extras.faceAcc } : {}),
      ...(extras.monsterSkin !== undefined ? { monsterSkin: extras.monsterSkin } : {}),
      ...(extras.isDev !== undefined ? { isDev: Boolean(extras.isDev) } : {}),
    };
    this.lastProfilePayload = { ...(this.lastProfilePayload || {}), ...payload };
    this.send(payload);
  }

  registerClientId(clientId) {
    this.clientId = String(clientId || '').trim();
    if (this.clientId) {
      this.send({ type: 'register_client_id', clientId: this.clientId });
    }
  }

  setPlayerStatus(status = 'В лобби', chapter = 0) {
    this.send({ type: 'player_status_update', status, chapter });
  }

  lookupFriends(ids = []) {
    this.send({ type: 'friend_lookup', ids: Array.isArray(ids) ? ids : [] });
  }

  sendFriendInvite(targetId, mode = 'room', roomCode = '', chapter = 1) {
    this.send({ type: 'friend_invite', targetId, mode, roomCode, chapter });
  }

  castMapVote(chapter = 1) {
    this.send({ type: 'room_map_vote', chapter });
  }

  fetchRooms() {
    this.send({ type: 'get_rooms' });
  }

  createRoom(chapter = 1, difficulty = 'easy', code = '', coopMode = 'bot') {
    this.connect();
    this.send({ type: 'create_room', chapter, difficulty, code, coopMode });
  }

  joinRoom(code) {
    this.connect();
    this.send({ type: 'join_room', code });
  }

  leaveRoom() {
    this.send({ type: 'leave_room' });
    this.currentRoom = null;
    this.currentVote = null;
    this.isHost = false;
    this.peers.clear();
    this.notifyRoomUpdate();
    this.fetchRooms();
  }

  setDifficulty(difficulty = 'easy') {
    if (!this.isHost || !this.currentRoom) return;
    this.send({ type: 'set_room_difficulty', difficulty });
  }

  setCoopMode(coopMode = 'bot') {
    if (!this.isHost || !this.currentRoom) return;
    this.send({ type: 'set_room_mode', coopMode });
  }

  setHunter(hunterId) {
    if (!this.isHost || !this.currentRoom) return;
    this.send({ type: 'set_room_hunter', hunterId });
  }

  castVote(choice = 'bot') {
    if (!this.currentRoom) return;
    this.send({ type: 'cast_vote', choice: choice === 'player' ? 'player' : 'bot' });
  }

  startGame() {
    if (!this.isHost || !this.currentRoom) return;
    this.send({ type: 'start_game' });
  }

  sendPlayerUpdate(x, y, pa, crouch, flash, alive = true, noise = 0) {
    if (!this.currentRoom) return;
    this.send({
      type: 'player_update',
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      pa: Number(pa.toFixed(2)),
      crouch,
      flash,
      alive,
      noise,
    });
  }

  sendMonsterState(m, lurk) {
    if (!this.currentRoom || !this.isHost) return;
    this.send({
      type: 'monster_sync',
      m: m
        ? {
            x: Number((m.x || 0).toFixed(2)),
            y: Number((m.y || 0).toFixed(2)),
            st: m.st,
            sp: Number((m.sp || 0).toFixed(2)),
            tx: Number((m.tx || 0).toFixed(2)),
            ty: Number((m.ty || 0).toFixed(2)),
            on: m.on !== false,
          }
        : null,
      lurk: lurk
        ? {
            x: Number((lurk.x || 0).toFixed(2)),
            y: Number((lurk.y || 0).toFixed(2)),
            st: lurk.st,
            sp: Number((lurk.sp || 0).toFixed(2)),
            on: Boolean(lurk.on),
          }
        : null,
    });
  }

  sendPlaceTrap(x, y) {
    if (!this.currentRoom) return;
    this.send({ type: 'monster_place_trap', x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }

  sendPlayerCaught(targetId) {
    if (!this.currentRoom) return;
    this.send({ type: 'player_caught', targetId });
  }

  sendKeyCollected(keyIndex = 0) {
    if (!this.currentRoom) return;
    this.send({ type: 'key_collected', keyIndex });
  }

  sendTrapDisarmed(trapIndex = 0, trapId = '') {
    if (!this.currentRoom) return;
    this.send({ type: 'trap_disarmed', trapIndex, trapId });
  }

  sendRadioPing(message, pingType = 'alert') {
    if (!this.currentRoom) return;
    this.send({ type: 'radio_ping', message, pingType });
  }

  sendPlayerEscaped() {
    if (!this.currentRoom) return;
    this.send({ type: 'player_escaped' });
  }

  isHunterMe() {
    return Boolean(
      this.currentRoom &&
        this.currentRoom.coopMode === 'player' &&
        this.currentRoom.hunterId &&
        this.currentRoom.hunterId === this.peerId
    );
  }

  onRoomList(fn) {
    this.roomListListeners.add(fn);
    if (this.lastRooms.length) fn(this.lastRooms, this.onlineCount);
    return () => this.roomListListeners.delete(fn);
  }

  onRoomUpdate(fn) {
    this.roomListeners.add(fn);
    return () => this.roomListeners.delete(fn);
  }

  onRoomModeUpdate(fn) {
    this.roomModeListeners.add(fn);
    return () => this.roomModeListeners.delete(fn);
  }

  onPeerMove(fn) {
    this.peerMoveListeners.add(fn);
    return () => this.peerMoveListeners.delete(fn);
  }

  onMonsterState(fn) {
    this.monsterStateListeners.add(fn);
    return () => this.monsterStateListeners.delete(fn);
  }

  onTrapPlaced(fn) {
    this.trapPlacedListeners.add(fn);
    return () => this.trapPlacedListeners.delete(fn);
  }

  onPeerCaught(fn) {
    this.peerCaughtListeners.add(fn);
    return () => this.peerCaughtListeners.delete(fn);
  }

  onKeyFound(fn) {
    this.keyListeners.add(fn);
    return () => this.keyListeners.delete(fn);
  }

  onGameStart(fn) {
    this.gameStartListeners.add(fn);
    return () => this.gameStartListeners.delete(fn);
  }

  onVoteStart(fn) {
    this.voteStartListeners.add(fn);
    return () => this.voteStartListeners.delete(fn);
  }

  onVoteUpdate(fn) {
    this.voteUpdateListeners.add(fn);
    return () => this.voteUpdateListeners.delete(fn);
  }

  onVoteEnd(fn) {
    this.voteEndListeners.add(fn);
    return () => this.voteEndListeners.delete(fn);
  }

  onError(fn) {
    this.errorListeners.add(fn);
    return () => this.errorListeners.delete(fn);
  }

  onRadio(fn) {
    this.radioListeners.add(fn);
    return () => this.radioListeners.delete(fn);
  }

  sendChatMessage(text) {
    return this.send({ type: 'send_chat', text });
  }

  onChatMessage(fn) {
    this.chatListeners.add(fn);
    return () => this.chatListeners.delete(fn);
  }

  onChatHistory(fn) {
    this.chatHistoryListeners.add(fn);
    return () => this.chatHistoryListeners.delete(fn);
  }

  onFriendLookup(fn) {
    this.friendLookupListeners.add(fn);
    return () => this.friendLookupListeners.delete(fn);
  }

  onFriendInvite(fn) {
    this.friendInviteListeners.add(fn);
    return () => this.friendInviteListeners.delete(fn);
  }

  onMapVoteState(fn) {
    this.mapVoteListeners.add(fn);
    return () => this.mapVoteListeners.delete(fn);
  }

  isCoopActive() {
    return Boolean(this.currentRoom && this.currentRoom.status === 'playing');
  }

  getPeersList() {
    return Array.from(this.peers.values());
  }
}

export const coop = new CoopManager();
