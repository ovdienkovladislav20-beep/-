import { SOCIAL_PROVIDERS, AVATAR_PRESETS, getStoredSocialAuth, setStoredSocialAuth, getAvatarSvg } from './socialAuth.js';
import { ACHIEVEMENTS, getUnlockedAchievements, unlockAchievement, showAchievementsModal } from './achievements.js';
import { getDailyQuestsState, trackDailyQuest, showDailyQuestsModal, updateQuestBadge } from './dailyQuests.js';
import { showAtmosphericLoading } from './loadingOverlay.js';
import { coop } from './coopManager.js';
import { showSocialAuthModal } from './socialAuthModal.js';
import { addXP, calculateLevel, getPhoneCase, getPhoneWallpaper, getPhoneCharm, getPhoneSticker, renderXPBarInLobby, showPhoneCustomizerModal } from './xpSystem.js';
import { getDailyStreakState, showDailyStreakModal, checkAndNotifyDailyStreak } from './dailyStreak.js';
import { getAvatar, getFrame, renderAvatarBadgeHtml, renderDeveloperBadgeHtml, showAvatarCustomizerModal } from './avatarSystem.js';
import { lobbyMusic } from './lobbyMusic.js';
import { initLobbyChat, updateLobbyChatVisibility } from './lobbyChat.js';
import horrorArtUrl from '../assets/images/horror_concept_art_1794557026381.jpg';
import doorArtUrl from '../assets/images/door_art_uploaded.jpg';
import { CAR_CATALOG, getCarSpec, getMonsterSkinSpec, drawAccessory2D, showLobbyShopModal } from './shopCatalog.js';
import { tr, trTree, trNode, getLocale, setLangGetter, clearTrCache } from './i18n.js';
import { discoverVazPart, getDiscoveredParts, mergeDiscoveredParts, normalizeDiscoveredMap, showDiscoveryJournalModal, JOURNAL_STORAGE_KEY, discoverMazeNote, getDiscoveredNotes, mergeDiscoveredNotes, normalizeDiscoveredNotes, MAZE_NOTES_CATALOG, NOTES_STORAGE_KEY } from './discoveryJournal.js';
import { openAnimatedModal, closeAnimatedModal, disposeAnimatedModal, showAnimatedPanel, hideAnimatedPanel } from './uiTransitions.js';
import { createAmbientAudioSystem, playSurfaceFootstep, playAuditoryPing } from './ambientAudio.js';
import { getChapterFog, collectWorldLights, traceSoftLightVisibility, computeWallCastShadow, drawDynamicSoftShadow, drawEnhancedSkyAndFloor, drawFloorLightPools, drawAtmosphereParticles, drawFilmGrain } from './gfxEffects.js';
import { drawProp3D } from './props3D.js';
import { createDuocaraRadio } from './duocaraRadio.js';
import { renderCarShowcase3D } from './carModels3D.js';

export function initHorrorEngine() {
  if (typeof window !== 'undefined' && window.__horrorEngineInitialized) return;
  if (typeof window !== 'undefined') window.__horrorEngineInitialized = true;
  const ambientAudio = createAmbientAudioSystem();
  const duocaraRadio = createDuocaraRadio();

const DEV_HASHES=new Set(['7e986f61488c6b2f23097d9b747c8921577131b25b23c70b8ccdc83d917a3f19','d973fb245a30b4b6de810856dafc7bbf97cf9759fcb9ee8b6b9c961ea21d9b8']);
async function sha256Hex(str){
  try{
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(str||'').trim().toLowerCase()));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }catch(e){return ''}
}
let hunterTrapCd=0,hunterCatchCd={};
const W=400,H=225,cv=document.getElementById('c'),g=cv.getContext('2d');cv.width=W;cv.height=H;
let RENDER_SCALE=1;
function syncCanvasScale(){
  const shakal=typeof SET!=='undefined'&&SET.camShakal!==undefined?SET.camShakal:1;
  const nextScale=shakal<=1?2:1;
  if(RENDER_SCALE!==nextScale||cv.width!==W*nextScale||cv.height!==H*nextScale){
    RENDER_SCALE=nextScale;
    cv.width=W*RENDER_SCALE;
    cv.height=H*RENDER_SCALE;
  }
  g.setTransform(RENDER_SCALE,0,0,RENDER_SCALE,0,0);
  g.imageSmoothingEnabled=shakal<=1;
  cv.style.imageRendering=shakal>1?'pixelated':'auto';
}
let N=21;let RN=Math.random;const rnd=n=>RN()*n|0;
let cemeteryGateOpened=false,VAZ=null,nearVaz=false,partsCarried=0,partsInstalled=0,vazBarVis=0,mechChased=false,GARAGE_BAYS=[],GARAGE_PART_SPOTS=[];
const inGarageBay=(x,y)=>ch==4&&GARAGE_BAYS.some(b=>x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1);
const vazHit=(x,y)=>{if(!(ch==3||ch==4)||!VAZ||!VAZ.on)return false;const dx=x-VAZ.x,dy=y-VAZ.y,ang=VAZ.yaw||0,ca=Math.cos(-ang),sa=Math.sin(-ang),lx=dx*ca-dy*sa,ly=dx*sa+dy*ca;return Math.abs(lx)<1.28&&Math.abs(ly)<0.64;};
const MP={on:false,room:null,swap:false,got:new Set(),alSeen:{},wSeen:{},init:0,dead:0,win:0,al:null,m:null,tp:0,l:0,code:'',seed:0,name:'',col:'#fff'};
const mul=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hs=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const COLS=['#f55','#5af','#5d5','#fd4','#d6f','#4dd'];
let map,floors,px,py,pa,hid,lx,ly,hx,hy,bat,sta,keys,flash,mon,items,ghosts,lockers,state='menu',msg='',msgT=0,bobT=0,tm=0,lightsOut=0,nextOut,nextBeat=0,deadT=0,wT=0,staLock=0,shake=0,FL=0,noise=0,lurk=0,nextBang=8,stepP=0,moving=false,sprintNow=false,crouch=false,deadTxt='ТЫ МЁРТВ',deadBySkin='',finalDone=false,ms=0,runMadeNoise=false,visitedExploredTiles=new Set(),survXpTimer=0,flCurrent=1.0,flTarget=1.0,flFlickerTimer=0,flFlickerVal=1.0,flSoundTimer=0;
let mazeNotes=[],nearMazeNote=null,lastProgressT=0,ghostHint=null,ghostHintCd=0,ch4CsT=0,ch4CsEv={},M2_LOCKERS=[],RADIO_SPOT={x:4.15,y:11.25,on:true},nearRadio=false,auditoryAlert=null,lastSprintNoiseT=0,lastNoiseMsgT=0;
const kd={};
// ---------- AUDIO ----------
let ac,mst,nb,musGain,sfxGain,muffleFilter;
function aud(){if(ac)return;ac=new(window.AudioContext||window.webkitAudioContext)();mst=ac.createGain();mst.gain.value=.9;VG=ac.createGain();VG.gain.value=SET.vol!==undefined?SET.vol:1;musGain=ac.createGain();musGain.gain.value=SET.musVol!==undefined?SET.musVol:.8;sfxGain=ac.createGain();sfxGain.gain.value=SET.sfxVol!==undefined?SET.sfxVol:.9;muffleFilter=ac.createBiquadFilter();muffleFilter.type='lowpass';muffleFilter.frequency.value=18500;muffleFilter.Q.value=0.7;musGain.connect(mst);sfxGain.connect(mst);mst.connect(muffleFilter);muffleFilter.connect(VG);VG.connect(ac.destination);
const len=ac.sampleRate*2;nb=ac.createBuffer(1,len,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
[[55,'sawtooth',.03],[58,'sawtooth',.03],[41,'sine',.12]].forEach(([f,t,v])=>{const o=ac.createOscillator(),gn=ac.createGain(),lp=ac.createBiquadFilter();o.type=t;o.frequency.value=f;gn.gain.value=v;lp.frequency.value=200;o.connect(lp);lp.connect(gn);gn.connect(musGain);o.start()});
const s=ac.createBufferSource();s.buffer=nb;s.loop=true;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=400;const gn=ac.createGain();gn.gain.value=.05;s.connect(bp);bp.connect(gn);gn.connect(musGain);s.start();
const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=.15;lg.gain.value=250;l.connect(lg);lg.connect(bp.frequency);l.start();
try{lobbyMusic.init(ac,musGain,SET.lobbyMusic!==0,(SET.musVol!==undefined?SET.musVol:.8)*0.75);lobbyMusic.updateState(state)}catch(e){}}
function pn(p){const n=ac.createStereoPanner();n.pan.value=Math.max(-1,Math.min(1,p));n.connect(sfxGain||mst);return n}
function NZ(dur,fr,vol,pan=0,type='lowpass'){if(!ac)return;const s=ac.createBufferSource();s.buffer=nb;const f=ac.createBiquadFilter();f.type=type;f.frequency.value=fr;const gn=ac.createGain(),t=ac.currentTime;gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(gn);gn.connect(pn(pan));s.start(t,Math.random());s.stop(t+dur)}
function TN(f,dur,vol,type='sine',f2=f,pan=0){if(!ac)return;const o=ac.createOscillator(),gn=ac.createGain(),t=ac.currentTime;o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(gn);gn.connect(pn(pan));o.start(t);o.stop(t+dur)}
const scream=()=>{if(!ac)return;const t=ac.currentTime;mst.gain.cancelScheduledValues(t);mst.gain.setValueAtTime(0,t);mst.gain.setValueAtTime(0,t+.09);mst.gain.linearRampToValueAtTime(1,t+.12);
setTimeout(()=>{if(!ac)return;const c=ac.currentTime;TN(56,1.2,1,'sine',22);NZ(.7,850,1);NZ(2.0,5400,.68,0,'bandpass');NZ(1.4,2400,.55,-0.5,'bandpass');NZ(1.4,2900,.55,0.5,'bandpass');
const o=ac.createOscillator(),m=ac.createOscillator(),mg=ac.createGain(),gn=ac.createGain(),ws=ac.createWaveShaper(),cu=new Float32Array(256);for(let i=0;i<256;i++)cu[i]=Math.tanh((i/128-1)*9);ws.curve=cu;
o.type='sawtooth';o.frequency.setValueAtTime(390,c);o.frequency.exponentialRampToValueAtTime(2250,c+.18);o.frequency.exponentialRampToValueAtTime(290,c+1.85);m.frequency.value=79;mg.gain.value=480;m.connect(mg);mg.connect(o.frequency);
gn.gain.setValueAtTime(.62,c);gn.gain.exponentialRampToValueAtTime(.001,c+1.95);o.connect(ws);ws.connect(gn);gn.connect(sfxGain||mst);o.start(c);m.start(c);o.stop(c+2.05);m.stop(c+2.05);
// Screeching dissonant formant pair for visceral horror sting
TN(1240,1.6,.22,'sawtooth',2450,-0.4);TN(1310,1.6,.22,'sawtooth',2590,0.4);
if(ch==2){TN(1100,1.5,.34,'sawtooth',2420);TN(2200,1.2,.18,'square',3250)}TN(2700,1.3,.16,'square',820);TN(48,1.9,.55,'sawtooth',30);setTimeout(()=>TN(3550,3.5,.055,'sine',3280),1500)},105)};
const whisper=()=>NZ(1.4,3500,.14,Math.random()*2-1,'bandpass');
const heart=v=>{TN(60,.14,v,'sine',35);setTimeout(()=>TN(55,.14,v*.7,'sine',30),170)};
// ---------- SPRITES ----------
const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return c};
const scaryNoteImg=mk(36,36,x=>{
  x.fillStyle='rgba(0,0,0,0.42)';x.beginPath();x.ellipse(18,32,12,3,0,0,7);x.fill();
  x.save();x.translate(18,18);x.rotate(-0.14);
  x.fillStyle='#dfd3b8';x.fillRect(-10,-12,20,24);
  x.fillStyle='#c5b493';x.beginPath();x.moveTo(4,-12);x.lineTo(10,-6);x.lineTo(4,-6);x.closePath();x.fill();
  x.fillStyle='#3b2a22';for(let i=0;i<5;i++)x.fillRect(-7,-8+i*3.8,11+((i*5)%4),1.4);
  x.fillStyle='rgba(155,16,20,0.85)';x.beginPath();x.arc(5,6,3.2,0,7);x.fill();x.fillRect(4,8,1.6,4);
  x.restore();
});
const crateImg=mk(44,44,x=>{
  x.fillStyle='#5c3d22';x.fillRect(4,6,36,36);
  x.fillStyle='#452b16';x.fillRect(4,6,36,4);x.fillRect(4,38,36,4);x.fillRect(4,6,4,36);x.fillRect(36,6,4,36);
  x.strokeStyle='#352010';x.lineWidth=3;x.beginPath();x.moveTo(7,9);x.lineTo(37,39);x.moveTo(37,9);x.lineTo(7,39);x.stroke();
  x.fillStyle='#2b303a';x.fillRect(4,6,5,5);x.fillRect(35,6,5,5);x.fillRect(4,37,5,5);x.fillRect(35,37,5,5);
});
const barrelImg=mk(38,48,x=>{
  x.fillStyle='rgba(0,0,0,0.45)';x.beginPath();x.ellipse(19,44,15,3,0,0,7);x.fill();
  const gr=x.createLinearGradient(6,0,32,0);gr.addColorStop(0,'#451a14');gr.addColorStop(0.45,'#991b1b');gr.addColorStop(1,'#2b0d0a');
  x.fillStyle=gr;x.fillRect(7,6,24,38);
  x.fillStyle='#fbbf24';x.fillRect(7,20,24,6);
  x.fillStyle='#1f2937';x.fillRect(6,6,26,3);x.fillRect(6,17,26,2);x.fillRect(6,30,26,2);x.fillRect(6,42,26,3);
});
const torchImg=mk(24,52,x=>{
  x.fillStyle='#27272a';x.fillRect(10,18,4,30);x.fillRect(6,16,12,5);
  x.fillStyle='rgba(255,140,20,0.35)';x.beginPath();x.arc(12,12,11,0,7);x.fill();
  x.fillStyle='#f97316';x.beginPath();x.moveTo(12,2);x.quadraticCurveTo(18,10,15,17);x.lineTo(9,17);x.quadraticCurveTo(6,10,12,2);x.fill();
  x.fillStyle='#fef08a';x.beginPath();x.arc(12,13,3,0,7);x.fill();
});
const bonePileImg=mk(48,28,x=>{
  x.fillStyle='rgba(0,0,0,0.42)';x.beginPath();x.ellipse(24,24,20,4,0,0,7);x.fill();
  x.strokeStyle='#cfc7b4';x.lineWidth=3;x.lineCap='round';
  x.beginPath();x.moveTo(8,22);x.lineTo(34,15);x.moveTo(12,14);x.lineTo(38,23);x.stroke();
  x.fillStyle='#dcd4c0';x.beginPath();x.arc(24,14,6.5,0,7);x.fill();
  x.fillStyle='#181410';x.fillRect(21,12,2,2.5);x.fillRect(25,12,2,2.5);x.fillRect(23,16,2,2);
});
const candelabraImg=mk(36,48,x=>{
  x.fillStyle='#b45309';x.fillRect(16,14,4,30);x.fillRect(10,42,16,4);x.fillRect(6,22,24,3);
  for(const cx of [7,18,29]){
    x.fillStyle='#fef3c7';x.fillRect(cx-1.5,12,3,10);
    x.fillStyle='rgba(251,191,36,0.38)';x.beginPath();x.arc(cx,8,6,0,7);x.fill();
    x.fillStyle='#fde047';x.beginPath();x.arc(cx,9,2.2,0,7);x.fill();
  }
});
const clockImg=mk(40,96,x=>{
  x.fillStyle='#3b2010';x.fillRect(6,8,28,84);x.fillStyle='#241208';x.fillRect(10,36,20,48);
  x.fillStyle='#d97706';x.fillRect(19,42,2,26);x.beginPath();x.arc(20,72,5,0,7);x.fill();
  x.fillStyle='#e5dcc5';x.beginPath();x.arc(20,22,8,0,7);x.fill();
  x.strokeStyle='#111';x.lineWidth=1.5;x.beginPath();x.moveTo(20,22);x.lineTo(20,16);x.moveTo(20,22);x.lineTo(24,24);x.stroke();
});
const urnImg=mk(36,44,x=>{
  x.fillStyle='rgba(0,0,0,0.42)';x.beginPath();x.ellipse(18,41,13,3,0,0,7);x.fill();
  x.fillStyle='#6b7280';x.fillRect(10,32,16,9);x.beginPath();x.ellipse(18,22,11,11,0,0,7);x.fill();
  x.fillStyle='#4b5563';x.fillRect(11,9,14,4);
  x.fillStyle='#d97706';x.beginPath();x.arc(13,11,3,0,7);x.arc(23,12,2.5,0,7);x.fill();
});
const tiresImg=mk(44,36,x=>{
  x.fillStyle='rgba(0,0,0,0.45)';x.beginPath();x.ellipse(22,33,18,3.5,0,0,7);x.fill();
  for(const [tx,ty] of [[22,27],[21,19],[23,11]]){
    x.fillStyle='#18181b';x.beginPath();x.ellipse(tx,ty,14,5,0,0,7);x.fill();
    x.strokeStyle='#3f3f46';x.lineWidth=1.5;x.stroke();
    x.fillStyle='#09090b';x.beginPath();x.ellipse(tx,ty,6,2,0,0,7);x.fill();
  }
});
const coneImg=mk(28,36,x=>{
  x.fillStyle='rgba(0,0,0,0.4)';x.beginPath();x.ellipse(14,33,10,3,0,0,7);x.fill();
  x.fillStyle='#ea580c';x.fillRect(5,30,18,4);
  x.beginPath();x.moveTo(8,30);x.lineTo(12,8);x.lineTo(16,8);x.lineTo(20,30);x.closePath();x.fill();
  x.fillStyle='#f8fafc';x.fillRect(10.5,16,7,4);x.fillRect(9,23,10,3.5);
});
const monImg=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';const hh=i=>{const v=Math.sin(i*127.1)*43758.5;return v-Math.floor(v)};
// Wet tangled black hair tendrils
x.strokeStyle='#030303';for(let i=0;i<18;i++){x.lineWidth=1.1+hh(i)*1.7;x.beginPath();const x0=20+i*1.35;x.moveTo(x0,4);x.bezierCurveTo(x0-9+hh(i+3)*6,28,x0-7+hh(i+7)*12,62,x0-5+(hh(i+2)-.5)*16,80+hh(i+5)*16);x.stroke()}
// Elongated spindly limbs & hooked blood-tipped claws
for(const sd of[-1,1]){x.strokeStyle='#050505';x.lineWidth=2.5;x.beginPath();x.moveTo(32+sd*8,43);x.lineTo(32+sd*27,66);x.lineTo(32+sd*25,100);x.lineTo(32+sd*28,116);x.stroke();x.lineWidth=1.1;x.beginPath();x.moveTo(32+sd*27,66);x.lineTo(32+sd*32,61);x.stroke();
for(let f=0;f<5;f++){x.strokeStyle='#cbc2aa';x.lineWidth=.75;x.beginPath();x.moveTo(32+sd*28,116);const cx2=32+sd*(28+(f-2)*2.4),cy2=127.5;x.lineTo(cx2,cy2);x.stroke();x.fillStyle='rgba(145,0,0,.9)';x.fillRect(cx2-.5,cy2-2.5,1,2.5)}}
// Gaunt charcoal torso + exposed ribs
x.fillStyle='#060607';x.beginPath();x.moveTo(24,40);x.lineTo(40,40);x.lineTo(37,72);x.lineTo(39,100);x.lineTo(36,128);x.lineTo(31,128);x.lineTo(32,100);x.lineTo(30,128);x.lineTo(25,128);x.lineTo(27,100);x.lineTo(27,72);x.closePath();x.fill();
x.strokeStyle='rgba(218,206,178,.56)';x.lineWidth=.75;for(let i=0;i<8;i++){x.beginPath();x.moveTo(27,45+i*3.4);x.quadraticCurveTo(32,48.5+i*3.4,37,45+i*3.4);x.stroke()}x.beginPath();x.moveTo(32,41);x.lineTo(32,76);x.stroke();
x.fillStyle='#786f60';x.fillRect(29.5,31,5,12);x.fillStyle='rgba(120,0,0,.65)';x.fillRect(30.5,35,3,10);
// Emaciated elongated skull-head tilted menacingly
x.save();x.translate(32,21);x.rotate(.15);const gr=x.createRadialGradient(-2,-6,2,0,0,22);gr.addColorStop(0,'#e6dfd0');gr.addColorStop(.55,'#938b78');gr.addColorStop(1,'#24201a');x.fillStyle=gr;x.beginPath();x.ellipse(0,0,11,20,0,0,7);x.fill();
// Sunken cheekbones & dark veins
x.fillStyle='rgba(12,6,6,.68)';x.beginPath();x.ellipse(-7,7,3.8,8.5,.12,0,7);x.ellipse(7,7,3.8,8.5,-.12,0,7);x.fill();
x.strokeStyle='rgba(95,8,8,.78)';x.lineWidth=.45;for(let i=0;i<10;i++){x.beginPath();x.moveTo(i<5?-5:5,-4);x.lineTo((i<5?-1:1)*(8+(i%3)*2.5),2+(i%4)*4.5);x.stroke()}
// Abyssal eye pits with glowing red pinholes & blood tears
x.fillStyle='#000';for(const sd of[-1,1]){x.beginPath();x.ellipse(sd*5.2,-4,4.5,6.8,sd*.32,0,7);x.fill();x.fillStyle='rgba(135,0,0,.85)';x.fillRect(sd*5.2-.6,2,1.2,10);x.fillStyle='#000'}
x.fillStyle='#f22';x.fillRect(-6.2,-3.8,2.2,2.2);x.fillRect(4.0,-3.8,2.2,2.2);x.fillStyle='#fff';x.fillRect(-5.6,-3.2,.8,.8);x.fillRect(4.6,-3.2,.8,.8);
x.fillStyle='#100a08';x.fillRect(-1.2,4,.8,3);x.fillRect(.4,4,.8,3);
// Unhinged gaping jaw crammed with uneven fangs
x.fillStyle='#060000';x.beginPath();x.moveTo(-10.5,8.5);x.quadraticCurveTo(0,5,10.5,8.5);x.quadraticCurveTo(9.5,24,0,26);x.quadraticCurveTo(-9.5,24,-10.5,8.5);x.fill();
x.fillStyle='#e5dcbf';for(let i=-9;i<=9;i+=1.35){x.beginPath();x.moveTo(i-.7,8.2-Math.abs(i)*.04);x.lineTo(i,13+Math.abs(Math.sin(i*3.4))*3.6);x.lineTo(i+.7,8.2);x.fill();x.beginPath();x.moveTo(i-.7,24.5-Math.abs(i)*.22);x.lineTo(i,19.2-Math.abs(Math.sin(i*2.3))*3.4);x.lineTo(i+.7,24.5-Math.abs(i)*.22);x.fill()}
x.fillStyle='rgba(145,0,0,.9)';x.fillRect(-4,24,1.3,12);x.fillRect(2.5,24,1.1,10);
x.strokeStyle='rgba(40,0,0,.75)';x.lineWidth=.6;x.beginPath();x.moveTo(-10.5,8.5);x.lineTo(-13.5,2);x.moveTo(10.5,8.5);x.lineTo(13.5,2);x.stroke();
x.restore();
x.strokeStyle='#030303';x.lineWidth=1.2;for(let i=0;i<6;i++){x.beginPath();x.moveTo(23+i*1.1,7);x.quadraticCurveTo(19+i,30,22+i*1.5,62);x.stroke();x.beginPath();x.moveTo(42-i*1.1,7);x.quadraticCurveTo(46-i,30,42-i*1.5,62);x.stroke()}});
const monImg2=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';const hh=i=>{const v=Math.sin(i*91.7)*43758.5;return v-Math.floor(v)};
x.strokeStyle='#020202';for(let i=0;i<20;i++){x.lineWidth=1.4+hh(i)*1.8;x.beginPath();const x0=20+i*1.2;x.moveTo(x0,4);x.bezierCurveTo(x0-10+hh(i+3)*8,30,x0-8+hh(i+7)*14,72,x0-6+(hh(i+2)-.5)*18,98+hh(i+5)*22);x.stroke()}
for(const sd of[-1,1]){x.strokeStyle='#c9c0ae';x.lineWidth=2.3;x.beginPath();x.moveTo(32+sd*6,42);x.quadraticCurveTo(32+sd*21,60,32+sd*18,96);x.lineTo(32+sd*19,112);x.stroke();x.lineWidth=.75;for(let f=0;f<5;f++){x.beginPath();x.moveTo(32+sd*19,112);x.lineTo(32+sd*(19+(f-2)*1.7),126+hh(f+sd*3)*3);x.stroke()}}
x.fillStyle='#100204';x.beginPath();x.moveTo(27,44);x.lineTo(37,44);x.lineTo(35,60);x.bezierCurveTo(44,80,56,104,58,128);for(let i=0;i<9;i++)x.lineTo(58-i*6.5,128-(i%2?0:5));x.bezierCurveTo(8,104,20,80,29,60);x.closePath();x.fill();
x.strokeStyle='rgba(210,200,185,.48)';x.lineWidth=.6;for(let i=0;i<6;i++){x.beginPath();x.moveTo(28.5,47+i*2.6);x.lineTo(35.5,47+i*2.6);x.stroke()}
x.beginPath();x.moveTo(35,60);x.bezierCurveTo(44,80,56,104,58,128);x.moveTo(29,60);x.bezierCurveTo(20,80,8,104,6,128);x.stroke();
x.strokeStyle='rgba(145,5,15,.8)';x.lineWidth=1.1;for(let i=0;i<5;i++){x.beginPath();x.moveTo(22+i*5,96);x.lineTo(21+i*5.5,128);x.stroke()}
x.fillStyle='#b6ae9c';x.fillRect(30,32,4,13);
x.save();x.translate(32,22);x.rotate(-.12);const gr=x.createRadialGradient(-2,-5,2,0,0,20);gr.addColorStop(0,'#eee8db');gr.addColorStop(.68,'#aaa28f');gr.addColorStop(1,'#38342c');x.fillStyle=gr;x.beginPath();x.ellipse(0,0,10.5,16.5,0,0,7);x.fill();
x.strokeStyle='rgba(20,14,10,.85)';x.lineWidth=.5;for(let i=0;i<5;i++){x.beginPath();let a=-6+i*3.4,b=-15;x.moveTo(a,b);for(let k=0;k<4;k++){a+=(hh(i*5+k)-.5)*5;b+=4+hh(i+k)*3;x.lineTo(a,b)}x.stroke()}
for(const sd of[-1,1]){x.fillStyle='#000';x.beginPath();x.ellipse(sd*4.8,-2.2,3.4,5.2,0,0,7);x.fill();x.fillStyle='rgba(120,0,0,.85)';x.fillRect(sd*4.8-.6,3,1.2,16);x.fillStyle='#d8eeff';x.fillRect(sd*4.8-.5,-2.6,1.1,1.1)}
// Wide stitched horror grin across pale mask face
x.strokeStyle='#000';x.lineWidth=1.3;x.beginPath();x.moveTo(-9,6.5);x.quadraticCurveTo(0,14.5,9,6.5);x.stroke();x.lineWidth=.55;for(let i=-8;i<=8;i+=1.3){const yy=6.5+(1-(i/9)**2)*4.4;x.beginPath();x.moveTo(i,yy-2.6);x.lineTo(i,yy+2.6);x.stroke()}
x.restore();x.strokeStyle='#020202';x.lineWidth=1.3;for(let i=0;i<7;i++){x.beginPath();x.moveTo(24+i*.8,6);x.quadraticCurveTo(21+i,22,23+i*1.4,48);x.stroke()}});
const monImg2h=mk(128,256,x=>{x.drawImage(monImg2,0,0);x.scale(2,2);x.lineCap='round';
x.save();x.translate(33,23);x.rotate(-.42);const gr=x.createRadialGradient(-2,-5,2,0,0,22);gr.addColorStop(0,'#eee8da');gr.addColorStop(.7,'#9f9785');gr.addColorStop(1,'#2c2820');x.fillStyle=gr;x.beginPath();x.ellipse(0,1,11.5,19.5,0,0,7);x.fill();
for(const sd of[-1,1]){x.fillStyle='#000';x.beginPath();x.ellipse(sd*5.2,-4.2,4.1,6.4,0,0,7);x.fill();x.fillStyle='#eef6ff';x.fillRect(sd*5.2-.9,-4.7,1.8,1.8);x.fillStyle='rgba(135,0,0,.92)';x.fillRect(sd*5.2-.6,1.5,1.3,18)}
x.fillStyle='#030000';x.beginPath();x.ellipse(0,13.5,6.8,11.5,0,0,7);x.fill();
x.fillStyle='#ebe4cf';for(let i=-5;i<=5;i+=1.5){x.beginPath();x.moveTo(i-.7,3.8);x.lineTo(i,7.8+Math.abs(Math.sin(i*2.2)));x.lineTo(i+.7,3.8);x.fill();x.beginPath();x.moveTo(i-.7,22.8);x.lineTo(i,18.8-Math.abs(Math.sin(i*3.1)));x.lineTo(i+.7,22.8);x.fill()}
x.fillStyle='rgba(140,0,0,.88)';x.fillRect(-2.2,23,1.5,17);x.fillRect(2,22,1.2,12);x.restore();
for(const sd of[-1,1]){x.strokeStyle='#cfc8b6';x.lineWidth=2.1;x.beginPath();x.moveTo(32+sd*5,44);x.lineTo(32+sd*22,38);x.lineTo(32+sd*29,20);x.stroke();x.lineWidth=.75;for(let f=0;f<5;f++){x.beginPath();x.moveTo(32+sd*29,20);x.lineTo(32+sd*(29+(f-2)*2.3),8+Math.abs(f-2));x.stroke()}}});
const monImgOld=mk(64,128,x=>{x.fillStyle='#050505';x.beginPath();x.moveTo(24,40);x.lineTo(40,40);x.lineTo(46,100);x.lineTo(40,128);x.lineTo(34,128);x.lineTo(32,90);x.lineTo(30,128);x.lineTo(24,128);x.lineTo(18,100);x.closePath();x.fill();
x.strokeStyle='#0a0a0a';x.lineWidth=3;x.beginPath();x.moveTo(24,46);x.lineTo(6,82);x.lineTo(9,120);x.moveTo(40,46);x.lineTo(58,82);x.lineTo(55,120);x.stroke();
x.lineWidth=1;for(let i=0;i<4;i++){x.beginPath();x.moveTo(9,120);x.lineTo(5+i*2,127);x.moveTo(55,120);x.lineTo(59-i*2,127);x.stroke()}
x.fillStyle='#d9d2c3';x.beginPath();x.ellipse(32,22,13,20,0,0,7);x.fill();x.fillStyle='#000';x.beginPath();x.ellipse(26,18,4,6,0,0,7);x.ellipse(38,18,4,6,0,0,7);x.fill();
x.fillStyle='#e22';x.fillRect(25,19,2,2);x.fillRect(37,19,2,2);x.fillStyle='#000';x.beginPath();x.ellipse(32,32,8,5,0,0,7);x.fill();
x.strokeStyle='#d9d2c3';for(let i=-7;i<=7;i+=2){x.beginPath();x.moveTo(32+i,28);x.lineTo(32+i,36);x.stroke()}
x.strokeStyle='#050505';x.lineWidth=2;for(let i=0;i<8;i++){x.beginPath();x.moveTo(22+i*3,4);x.quadraticCurveTo(14+i*5,40,20+i*3,70);x.stroke()}});
const keyImg=mk(32,32,x=>{x.strokeStyle='#fd4';x.lineWidth=3;x.beginPath();x.arc(16,9,6,0,7);x.moveTo(16,15);x.lineTo(16,29);x.moveTo(16,23);x.lineTo(22,23);x.moveTo(16,28);x.lineTo(21,28);x.stroke()});
const batImg=mk(32,32,x=>{x.fillStyle='#bfc7d1';x.fillRect(9,25,14,3);x.fillStyle='#1c2026';x.fillRect(9,12,14,13);x.fillStyle='#d07c20';x.fillRect(9,7,14,5);x.fillStyle='#cbd4de';x.fillRect(9,5,14,2);x.fillStyle='#f2c444';x.fillRect(13,2,6,3);x.fillStyle='#24c85a';x.fillRect(12,14,8,9);x.fillStyle='#c4ff88';x.beginPath();x.moveTo(17,15);x.lineTo(13,19);x.lineTo(16,19);x.lineTo(15,22);x.lineTo(19,18);x.lineTo(16,18);x.closePath();x.fill()});
const statImg=mk(64,128,x=>{x.fillStyle='#8a8a86';x.beginPath();x.moveTo(20,40);x.lineTo(44,40);x.lineTo(50,128);x.lineTo(14,128);x.closePath();x.fill();x.beginPath();x.ellipse(32,22,12,17,0,0,7);x.fill();x.fillStyle='#6c6c68';x.fillRect(18,16,28,14);x.fillStyle='#9a9a95';x.fillRect(20,18,10,10);x.fillRect(34,18,10,10);x.fillStyle='#555';for(let i=0;i<6;i++)x.fillRect(20+i*5,44,2,70)});
const trapImg=mk(32,32,x=>{x.strokeStyle='#3d2e26';x.lineWidth=2.5;x.beginPath();x.moveTo(2,24);x.lineTo(30,24);x.stroke();x.fillStyle='#6c543e';x.beginPath();x.ellipse(16,23,6,2.5,0,0,7);x.fill();x.strokeStyle='#8e4a28';x.lineWidth=2.4;x.beginPath();x.ellipse(16,22,12,5.5,0,0,7);x.stroke();x.fillStyle='#969fa8';for(let i=0;i<6;i++){const tx=6+i*4;x.beginPath();x.moveTo(tx-1.6,21);x.lineTo(tx,14);x.lineTo(tx+1.6,21);x.fill();x.fillStyle=i%2?'#969fa8':'#9a161a'}x.fillStyle='#b8bec6';x.fillRect(2,22,3,3);x.fillRect(27,22,3,3)});
const vazImg=mk(160,80,x=>{
  x.fillStyle='rgba(0,0,0,0.55)';x.beginPath();x.ellipse(80,74,70,6,0,0,7);x.fill();
  x.fillStyle='#181818';x.fillRect(20,56,22,18);x.fillRect(118,56,22,18);
  x.fillStyle='#b0b5ba';x.beginPath();x.arc(31,65,7,0,7);x.arc(129,65,7,0,7);x.fill();
  x.fillStyle='#333';x.beginPath();x.arc(31,65,3,0,7);x.arc(129,65,3,0,7);x.fill();
  const bg=x.createLinearGradient(0,20,0,70);bg.addColorStop(0,'#585d64');bg.addColorStop(0.4,'#484d54');bg.addColorStop(1,'#2c3035');x.fillStyle=bg;
  x.beginPath();x.moveTo(16,68);x.lineTo(144,68);x.quadraticCurveTo(148,64,147,46);x.lineTo(136,40);x.lineTo(124,22);x.lineTo(36,22);x.lineTo(24,40);x.lineTo(13,46);x.quadraticCurveTo(12,64,16,68);x.closePath();x.fill();
  x.strokeStyle='rgba(255,255,255,0.25)';x.lineWidth=1.5;x.beginPath();x.moveTo(14,46);x.lineTo(146,46);x.stroke();
  x.fillStyle='#0f1418';x.beginPath();x.moveTo(38,25);x.lineTo(122,25);x.lineTo(133,40);x.lineTo(27,40);x.closePath();x.fill();
  x.strokeStyle='rgba(200,80,60,0.3)';x.lineWidth=0.8;for(let i=28;i<=38;i+=3){x.beginPath();x.moveTo(33,i);x.lineTo(127,i);x.stroke()}
  x.fillStyle='#ff2233';x.fillRect(70,24,20,2.5);
  x.fillStyle='#3a3e43';x.fillRect(24,40,112,4);x.fillRect(36,43,6,4);x.fillRect(118,43,6,4);
  x.fillStyle='#1a0507';x.fillRect(18,47,124,11);
  x.fillStyle='#d61a29';x.fillRect(20,48,24,9);x.fillRect(116,48,24,9);
  x.fillStyle='#ea580c';x.fillRect(44,48,14,9);x.fillRect(102,48,14,9);
  x.fillStyle='#991b1b';x.fillRect(58,48,44,9);x.fillStyle='#e2e8f0';x.fillRect(66,50,10,5);x.fillRect(84,50,10,5);
  x.fillStyle='#1c1f22';x.fillRect(56,59,48,10);x.fillStyle='#f8fafc';x.fillRect(58,60,44,8);
  x.strokeStyle='#000';x.lineWidth=0.8;x.strokeRect(58,60,44,8);
  x.fillStyle='#000';x.font='bold 5.5px monospace';x.fillText('В 2112 АД 77',60,66);
  x.fillStyle='#1e2226';x.fillRect(16,68,128,4);
  x.fillStyle='#71717a';x.beginPath();x.arc(28,71,2.5,0,7);x.fill();
  x.fillStyle='#cbd5e1';x.font='bold 4px sans-serif';x.fillText('LADA 2112',20,45);x.fillText('16V',128,45);
});
const PART_NAMES=[
  'Аккумулятор','Свечи зажигания','Генератор','Ремень ГРМ','Бензонасос','Стартер','ЭБУ «Январь»',
  'Радиатор охлаждения','Катушка зажигания','Датчик ДМРВ','Диск сцепления','Тормозной цилиндр','Рулевая рейка','Глушитель основной'
];
const partImgs=[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(k=>mk(32,32,x=>{
  x.fillStyle='rgba(0,0,0,0.45)';x.beginPath();x.ellipse(16,28,11,3,0,0,7);x.fill();
  if(k===0){x.fillStyle='#1f2937';x.fillRect(6,9,20,17);x.fillStyle='#dc2626';x.fillRect(8,6,4,3);x.fillStyle='#2563eb';x.fillRect(20,6,4,3);x.fillStyle='#fbbf24';x.fillRect(14,13,4,8);}
  else if(k===1){x.fillStyle='#e2e8f0';for(let i=0;i<3;i++){x.fillRect(7+i*7,8,4,15);x.fillStyle='#94a3b8';x.fillRect(7+i*7,16,4,4);x.fillStyle='#e2e8f0';}}
  else if(k===2){x.fillStyle='#64748b';x.beginPath();x.arc(16,17,9,0,7);x.fill();x.fillStyle='#1e293b';x.beginPath();x.arc(16,17,4,0,7);x.fill();x.fillStyle='#cbd5e1';x.fillRect(14,6,4,4);}
  else if(k===3){x.strokeStyle='#18181b';x.lineWidth=4;x.beginPath();x.ellipse(16,17,10,7,0.3,0,7);x.stroke();x.strokeStyle='#f59e0b';x.lineWidth=1;x.beginPath();x.ellipse(16,17,10,7,0.3,0,7);x.stroke();}
  else if(k===4){x.fillStyle='#94a3b8';x.fillRect(10,7,12,18);x.fillStyle='#ef4444';x.fillRect(12,4,3,4);x.fillStyle='#3b82f6';x.fillRect(17,4,3,4);x.fillStyle='#334155';x.fillRect(12,12,8,6);}
  else if(k===5){x.fillStyle='#475569';x.fillRect(5,12,20,11);x.fillStyle='#b45309';x.fillRect(9,7,12,6);x.fillStyle='#cbd5e1';x.fillRect(25,14,4,6);}
  else if(k===6){x.fillStyle='#334155';x.fillRect(6,8,20,16);x.fillStyle='#22c55e';x.fillRect(9,11,5,5);x.fillStyle='#facc15';x.fillRect(17,11,6,10);}
  else if(k===7){x.fillStyle='#475569';x.fillRect(4,8,24,16);x.fillStyle='#cbd5e1';for(let rx=7;rx<=24;rx+=3)x.fillRect(rx,10,1.5,12);x.fillStyle='#eab308';x.fillRect(21,5,4,3);}
  else if(k===8){x.fillStyle='#1e293b';x.fillRect(6,14,20,11);x.fillStyle='#94a3b8';for(let cx=8;cx<=22;cx+=4.5)x.fillRect(cx,8,3,6);x.fillStyle='#38bdf8';x.fillRect(14,18,4,4);}
  else if(k===9){x.fillStyle='#1f2937';x.fillRect(5,11,22,10);x.fillStyle='#64748b';x.beginPath();x.arc(9,16,3.5,0,7);x.fill();x.fillStyle='#eab308';x.fillRect(13,7,8,4);}
  else if(k===10){x.fillStyle='#334155';x.beginPath();x.arc(16,16,10,0,7);x.fill();x.fillStyle='#475569';x.beginPath();x.arc(16,16,5.5,0,7);x.fill();x.fillStyle='#f59e0b';x.fillRect(14,10,4,2);x.fillRect(14,20,4,2);x.fillStyle='#0f172a';x.beginPath();x.arc(16,16,2.2,0,7);x.fill();}
  else if(k===11){x.fillStyle='#64748b';x.fillRect(6,15,18,8);x.fillStyle='#fef3c7';x.fillRect(10,7,10,8);x.fillStyle='#d97706';x.fillRect(11,10,8,4);}
  else if(k===12){x.fillStyle='#475569';x.fillRect(3,14,26,4);x.fillStyle='#18181b';x.fillRect(8,12,5,8);x.fillRect(19,12,5,8);x.fillStyle='#94a3b8';x.fillRect(14,8,4,6);}
  else{x.fillStyle='#64748b';x.fillRect(8,11,16,10);x.fillStyle='#94a3b8';x.fillRect(3,15,6,2.5);x.fillRect(24,15,5,2.5);x.fillRect(27,16,3,4);}
}));
// Autumn Cemetery Trees & Orthodox Chapel Dome sprites matching photo
const mkAutumnTree=(c1,c2,c3)=>mk(96,144,x=>{
  x.fillStyle='#2a1c12';x.fillRect(42,74,12,68);
  x.beginPath();x.moveTo(42,138);x.lineTo(34,143);x.lineTo(62,143);x.lineTo(54,138);x.closePath();x.fill();
  x.strokeStyle='#24170e';x.lineWidth=4;x.beginPath();x.moveTo(48,86);x.lineTo(28,62);x.moveTo(48,80);x.lineTo(68,58);x.stroke();
  const blobs=[[48,46,34,c1],[28,56,24,c2],[68,58,24,c2],[38,34,26,c3],[58,36,24,c1],[48,22,22,c3],[34,66,18,c1],[62,68,18,c3]];
  for(const[bx,by,br,bc]of blobs){x.fillStyle=bc;x.beginPath();x.arc(bx,by,br,0,7);x.fill();}
  for(let i=0;i<36;i++){
    const lx=18+((i*37)%60),ly=18+((i*53)%58);
    x.fillStyle=i%3===0?'rgba(255,220,100,0.42)':i%3===1?'rgba(140,45,10,0.35)':'rgba(245,140,20,0.38)';
    x.beginPath();x.arc(lx,ly,3.5+(i%3),0,7);x.fill();
  }
});
const autumnTreeImg1=mkAutumnTree('#c97a16','#a84c12','#e8a824');
const autumnTreeImg2=mkAutumnTree('#b54214','#88280e','#d97218');
const chapelDomeImg=mk(160,160,x=>{
  // Cream stone gable pediment & octagonal drum
  x.fillStyle='#d4c3a3';x.beginPath();x.moveTo(28,158);x.lineTo(28,118);x.lineTo(80,88);x.lineTo(132,118);x.lineTo(132,158);x.closePath();x.fill();
  x.strokeStyle='#9c8867';x.lineWidth=2;x.strokeRect(52,66,56,42);
  x.fillStyle='#dfcfaf';x.fillRect(52,66,56,42);
  // Drum arched windows
  x.fillStyle='#2a241e';
  for(const wx of[60,76,92]){x.fillRect(wx,74,8,22);x.beginPath();x.arc(wx+4,74,4,Math.PI,0);x.fill();}
  // Cornice under main onion dome
  x.fillStyle='#b7a27e';x.fillRect(48,62,64,6);
  // Dark slate Orthodox onion dome
  const dg=x.createLinearGradient(52,20,108,64);
  dg.addColorStop(0,'#4b5563');dg.addColorStop(0.55,'#272e38');dg.addColorStop(1,'#141820');
  x.fillStyle=dg;
  x.beginPath();x.moveTo(50,62);x.bezierCurveTo(44,44,64,34,80,18);x.bezierCurveTo(96,34,116,44,110,62);x.closePath();x.fill();
  // Two smaller flanking cupolas
  for(const sx of[34,126]){
    x.fillStyle='#d4c3a3';x.fillRect(sx-8,94,16,24);
    x.fillStyle='#272e38';x.beginPath();x.moveTo(sx-10,94);x.bezierCurveTo(sx-12,84,sx-4,80,sx,72);x.bezierCurveTo(sx+4,80,sx+12,84,sx+10,94);x.closePath();x.fill();
    x.fillStyle='#facc15';x.fillRect(sx-1,60,2,13);x.fillRect(sx-4,64,8,2);
  }
  // Golden Orthodox cross spire
  x.fillStyle='#fbbf24';x.fillRect(78,12,4,8);x.fillRect(79,2,2,12);x.fillRect(73,5,14,2);x.fillRect(75,9,10,1.5);
});
// 3 Uploaded Photos placed in Mansion Password Room (lab) & PC
const MANSION_PHOTOS=[
  {
    url:'/assets/aistudio/IMG_20261110_214559_785_aa7dec61.jpg',
    title:'ФОТО №1 · КОТ-ХРАНИТЕЛЬ',
    caption:'Странный кадр с проявленной плёнки. Белый кот с алыми глазами-лазерами и клинками.',
  },
  {
    url:'/assets/aistudio/file_00000000aaf48211ab7f0a413c5a5111_9bc958f1.png',
    title:'ФОТО №2 · КРИК В УШАНКЕ',
    caption:'Нечёткий снимок из секретного архива лаборатории №7. Красные лучи прожигают объектив.',
  },
  {
    url:'/assets/aistudio/file_000000007fc481f49addba8760a5ea39_5231e44c.png',
    title:'ФОТО №3 · ДЕЖУРНЫЙ ПО ЛЕСТНИЦЕ',
    caption:'Последнее фото на лестнице особняка. Сделано незадолго до инцидента 02.11.1998.',
  },
];
function mkFramedPhotoSprite(info,accent){
  const c=document.createElement('canvas');c.width=72;c.height=84;
  const x=c.getContext('2d');
  const paint=(img)=>{
    x.clearRect(0,0,72,84);
    // Stand easel legs
    x.fillStyle='#2a1a10';x.fillRect(14,56,4,26);x.fillRect(54,56,4,26);
    // Dark wood & gold portrait frame
    x.fillStyle='#3b2314';x.fillRect(6,6,60,54);
    x.strokeStyle=accent||'#d4af37';x.lineWidth=2.5;x.strokeRect(8,8,56,50);
    x.fillStyle='#0d0b0a';x.fillRect(11,11,50,44);
    if(img&&img.complete&&img.naturalWidth>0){
      x.drawImage(img,11,11,50,44);
    }else{
      x.fillStyle='#7f1d1d';x.fillRect(15,15,42,36);
      x.fillStyle='#fde047';x.font='bold 10px monospace';x.textAlign='center';x.fillText('PHOTO',36,36);
    }
  };
  paint(null);
  try{
    const img=new Image();
    img.onload=()=>{info.rawImg=img;paint(img);};
    img.src=info.url;
    info.rawImg=img;
  }catch(e){}
  return c;
}
const mansionPhotoImgs=MANSION_PHOTOS.map((p,i)=>mkFramedPhotoSprite(p,['#22c55e','#ef4444','#60a5fa'][i]));
let MANSION_PHOTO_SPOTS=[],nearPhoto=null,photoModalOpen=false,photoSel=0;
function openMansionPhotoModal(idx){
  const info=MANSION_PHOTOS[idx|0];if(!info)return;
  photoModalOpen=true;
  document.exitPointerLock&&document.exitPointerLock();
  for(const k in kd)kd[k]=0;
  let m=document.getElementById('mansion_photo_modal');
  const wasOpen=Boolean(m&&m.dataset?.uiClosing!=='1');
  if(m)disposeAnimatedModal(m);
  m=document.createElement('div');m.id='mansion_photo_modal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(7px);z-index:9920;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Georgia,serif';
  m.innerHTML=`<div style="background:#10090b;border:2px solid #d4af37;border-radius:12px;padding:18px;max-width:460px;width:100%;color:#eee;text-align:center;box-shadow:0 0 42px rgba(212,175,55,0.38)">
    <div style="font-size:15px;font-weight:bold;color:#fde68a;letter-spacing:0.06em;margin-bottom:10px">${tr(info.title)}</div>
    <div style="border:2px solid #5c3d1e;border-radius:8px;overflow:hidden;background:#050304;margin-bottom:10px">
      <img src="${info.url}" alt="${info.title}" style="width:100%;max-height:56vh;object-fit:contain;display:block"/>
    </div>
    <div style="font-size:12.5px;color:#d1d5db;font-style:italic;line-height:1.45;margin-bottom:14px">${tr(info.caption)}</div>
    <div style="display:flex;gap:8px;justify-content:center">
      ${[0,1,2].map(n=>`<button class="mp_sw" data-idx="${n}" style="margin:0;padding:6px 12px;background:${n===idx?'#92400e':'#1c1114'};border:1px solid ${n===idx?'#fbbf24':'#555'};color:#fff;border-radius:5px;cursor:pointer;font-size:12px">№${n+1}</button>`).join('')}
      <button id="mp_close" style="margin:0;padding:6px 18px;background:#7f1d1d;border:1px solid #ef4444;color:#fff;border-radius:5px;cursor:pointer;font-weight:bold;font-size:12px">${tr('Закрыть')}</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  openAnimatedModal(m,{immediate:wasOpen});
  const close=()=>{photoModalOpen=false;closeAnimatedModal(m);try{if(!isTouchDevice()&&state==='play'&&!pcOpen)cv.requestPointerLock()}catch(e){}};
  m.querySelector('#mp_close').onclick=close;
  m.onclick=e=>{if(e.target===m)close()};
  m.querySelectorAll('.mp_sw').forEach(b=>{b.onclick=()=>openMansionPhotoModal(Number(b.getAttribute('data-idx')))});
}
const monImg5=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';const hh=i=>{const v=Math.sin(i*61.9)*43758.5;return v-Math.floor(v)};
  // Grease-stained heavy jumpsuit + arterial splatter
  x.fillStyle='#10151c';x.beginPath();x.moveTo(16,39);x.lineTo(48,39);x.lineTo(51,88);x.lineTo(44,128);x.lineTo(35,128);x.lineTo(32,90);x.lineTo(29,128);x.lineTo(20,128);x.lineTo(13,88);x.closePath();x.fill();
  x.fillStyle='#212933';x.fillRect(21,41,22,34);x.fillStyle='#080a0d';x.fillRect(21,67,22,4.5);
  x.fillStyle='rgba(155,6,12,0.86)';x.fillRect(23,46,8,17);x.fillRect(34,55,7,20);x.fillRect(18,84,9,18);
  // Exposed torn chest cavity showing scarred ribs through overalls
  x.fillStyle='#1c0406';x.fillRect(26,46,12,15);
  x.strokeStyle='rgba(218,206,184,0.68)';x.lineWidth=0.8;for(let i=0;i<4;i++){x.beginPath();x.moveTo(27,48+i*3.4);x.quadraticCurveTo(32,50+i*3.4,37,48+i*3.4);x.stroke()}
  for(const sd of[-1,1]){x.strokeStyle='#151b23';x.lineWidth=4.6;x.beginPath();x.moveTo(32+sd*13,43);x.lineTo(32+sd*22,76);x.lineTo(32+sd*20,104);x.stroke();x.fillStyle='#0b0d10';x.beginPath();x.arc(32+sd*20,106,3.6,0,7);x.fill();x.strokeStyle='#b8a890';x.lineWidth=0.7;for(let f=0;f<4;f++){x.beginPath();x.moveTo(32+sd*20,107);x.lineTo(32+sd*(20+(f-1.5)*2.1),114);x.stroke()}}
  // Bloody jagged heavy pipe wrench
  x.strokeStyle='#7a8490';x.lineWidth=3.2;x.beginPath();x.moveTo(51,108);x.lineTo(58,50);x.stroke();
  x.fillStyle='#9aa4b0';x.fillRect(53,42,10,12);x.fillStyle='#111';x.fillRect(55,45,6,4.5);x.fillStyle='rgba(180,8,8,0.95)';x.fillRect(53,42,8,7);x.fillRect(55,51,1.6,12);
  // Rotted flesh neck & cracked steel welding helmet revealing bare skull/eye & jaw fangs
  x.fillStyle='#4a201d';x.fillRect(28,33,8,8);
  x.fillStyle='#242930';x.beginPath();x.roundRect?x.roundRect(18,5,28,32,5):x.fillRect(18,5,28,32);x.fill();
  x.strokeStyle='#4b545e';x.lineWidth=1.1;x.strokeRect(19,6,26,30);
  // Fractured dark visor slit — left side cracked open exposing rotting eye socket
  x.fillStyle='#060709';x.fillRect(21,13,22,9.5);
  x.fillStyle='#c4b49a';x.beginPath();x.ellipse(27,17.5,5,5.2,0,0,7);x.fill();
  x.fillStyle='#050000';x.beginPath();x.ellipse(27,17.5,3.4,3.8,0,0,7);x.fill();
  x.fillStyle='#ffb020';x.fillRect(25.8,16.4,2.6,2.6);x.fillStyle='#fff';x.fillRect(26.5,17,1,1);
  // Right burning welding ember eye behind scratched glass
  x.fillStyle='#ff7a14';x.fillRect(35,16,4.5,3.2);x.fillStyle='#fef08a';x.fillRect(36.5,16.8,1.8,1.8);
  // Snarling steel-wire & fang grin ripped through bottom of visor
  x.fillStyle='#050000';x.fillRect(22,25,20,9.5);
  x.fillStyle='#e4dcc4';for(let i=-4;i<=4;i++){const tx=32+i*2.1;x.beginPath();x.moveTo(tx-.8,25);x.lineTo(tx,29.5+hh(i)*1.8);x.lineTo(tx+.8,25);x.fill();x.beginPath();x.moveTo(tx-.8,34.5);x.lineTo(tx,30.2-hh(i+7)*1.6);x.lineTo(tx+.8,34.5);x.fill()}
  x.fillStyle='rgba(155,0,0,0.92)';x.fillRect(26,34,1.6,12);x.fillRect(35,34,1.4,16);
});
const monImgMatrix=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';
  // Neon-green glitch aura & legs
  x.fillStyle='#060809';x.fillRect(20,82,10,46);x.fillRect(34,82,10,46);
  x.strokeStyle='#22ff66';x.lineWidth=1.2;for(let i=0;i<5;i++){x.beginPath();x.moveTo(20,88+i*8);x.lineTo(30,85+i*8);x.moveTo(34,86+i*8);x.lineTo(44,89+i*8);x.stroke();}
  // Torso with glowing green/yellow exposed core & ribs
  x.fillStyle='#080b0a';x.fillRect(16,40,32,44);
  const cg=x.createRadialGradient(32,62,2,32,62,15);cg.addColorStop(0,'#fef08a');cg.addColorStop(.5,'#22ff66');cg.addColorStop(1,'#041209');
  x.fillStyle=cg;x.fillRect(21,46,22,34);
  x.strokeStyle='#050505';x.lineWidth=1.6;for(let i=0;i<4;i++){x.beginPath();x.moveTo(21,49+i*7);x.quadraticCurveTo(32,53+i*7,43,49+i*7);x.stroke();}
  // Crimson tattered scarf across chest
  x.fillStyle='#b91c1c';x.beginPath();x.moveTo(15,39);x.lineTo(49,40);x.lineTo(45,51);x.lineTo(29,56);x.lineTo(16,48);x.closePath();x.fill();
  x.fillStyle='#ef4444';x.beginPath();x.moveTo(27,49);x.lineTo(35,49);x.lineTo(32,66);x.lineTo(25,62);x.closePath();x.fill();
  // Domino shoulder plate (left)
  x.fillStyle='#22ff66';x.fillRect(42,39,10,16);x.fillStyle='#050505';x.fillRect(42,46,10,1.4);x.beginPath();x.arc(47,42.5,1.4,0,7);x.arc(45,51,1.3,0,7);x.arc(49,51,1.3,0,7);x.fill();
  // Dual dark swords with green glitch edges
  x.fillStyle='#0b0f0d';x.strokeStyle='#22ff66';x.lineWidth=1;
  x.beginPath();x.moveTo(9,48);x.lineTo(14,48);x.lineTo(12,118);x.lineTo(9,110);x.closePath();x.fill();x.stroke();
  x.beginPath();x.moveTo(51,50);x.lineTo(56,50);x.lineTo(57,118);x.lineTo(52,112);x.closePath();x.fill();x.stroke();
  // Shadowed head + Neon-Green 3-pillar Domino Crown
  x.fillStyle='#050506';x.fillRect(21,15,22,23);
  x.fillStyle='#22ff66';x.fillRect(19,12,26,5);x.fillRect(20,2,5,11);x.fillRect(39,2,5,11);x.fillRect(28,0,8,13);
  x.fillStyle='#050505';x.beginPath();x.arc(32,3.5,1.2,0,7);x.arc(30,9,1.1,0,7);x.arc(34,9,1.1,0,7);x.fill();
  // Crimson 4-point star eye flare
  x.fillStyle='#ff2233';x.beginPath();x.moveTo(28,25);x.lineTo(30,27);x.lineTo(35,28);x.lineTo(30,29);x.lineTo(28,32);x.lineTo(26,29);x.lineTo(21,28);x.lineTo(26,27);x.closePath();x.fill();
  x.fillStyle='#fff';x.fillRect(27.2,27.2,1.6,1.6);
});
const monImgFigura=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';
  // Tall meat-orange legs
  x.fillStyle='#6b2412';x.beginPath();x.moveTo(22,74);x.lineTo(31,74);x.lineTo(25,128);x.lineTo(17,128);x.closePath();x.fill();
  x.beginPath();x.moveTo(33,74);x.lineTo(42,74);x.lineTo(47,128);x.lineTo(39,128);x.closePath();x.fill();
  // Hunched torso & exposed pale bone ribcage
  x.fillStyle='#9a3412';x.beginPath();x.moveTo(19,36);x.lineTo(45,36);x.lineTo(41,76);x.lineTo(23,76);x.closePath();x.fill();
  x.fillStyle='#e7dec8';
  for(let i=0;i<4;i++){
    x.fillRect(18,40+i*6,10,3);x.fillRect(36,40+i*6,10,3);
  }
  // Extra-long double-jointed clawed arms hanging to ankles
  x.strokeStyle='#7c2d12';x.lineWidth=4.5;
  for(const sd of[-1,1]){
    x.beginPath();x.moveTo(32+sd*12,40);x.lineTo(32+sd*24,74);x.lineTo(32+sd*21,116);x.stroke();
    x.strokeStyle='#3b1208';x.lineWidth=1.8;
    x.beginPath();x.moveTo(32+sd*21,116);x.lineTo(32+sd*18,125);x.moveTo(32+sd*21,116);x.lineTo(32+sd*24,126);x.stroke();
    x.strokeStyle='#7c2d12';x.lineWidth=4.5;
  }
  // Round hooded eyeless head with glowing tooth-ringed circular mouth
  x.fillStyle='#1f1210';x.beginPath();x.arc(32,20,15,0,7);x.fill();
  const mg=x.createRadialGradient(32,20,2,32,20,12);mg.addColorStop(0,'#fef08a');mg.addColorStop(.55,'#f97316');mg.addColorStop(1,'#7c2d12');
  x.fillStyle=mg;x.beginPath();x.arc(32,20,11.5,0,7);x.fill();
  x.fillStyle='#f5ecd8';
  for(let i=0;i<10;i++){const a=i*Math.PI*2/10;x.beginPath();x.moveTo(32+Math.cos(a)*11.5,20+Math.sin(a)*11.5);x.lineTo(32+Math.cos(a+.15)*7.5,20+Math.sin(a+.15)*7.5);x.lineTo(32+Math.cos(a-.15)*7.5,20+Math.sin(a-.15)*7.5);x.fill();}
});
const monImgGrannyDe=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';
  // Long dark-grey flared buttoned granny dress
  x.fillStyle='#0c0c0e';x.beginPath();x.ellipse(32,123,19,5,0,0,7);x.fill();
  const dg=x.createLinearGradient(16,38,48,122);dg.addColorStop(0,'#64676d');dg.addColorStop(.55,'#4b4e54');dg.addColorStop(1,'#27292d');
  x.fillStyle=dg;x.beginPath();x.moveTo(20,38);x.lineTo(44,38);x.lineTo(50,122);x.lineTo(14,122);x.closePath();x.fill();
  // Front dress buttons
  x.fillStyle='#141518';for(let i=0;i<5;i++){x.beginPath();x.arc(32,45+i*6.5,1.3,0,7);x.fill();}
  // Charred arms reaching down
  x.fillStyle='#1f1f22';x.beginPath();x.moveTo(19,40);x.lineTo(12,78);x.lineTo(16,80);x.lineTo(22,44);x.closePath();x.fill();
  x.beginPath();x.moveTo(45,40);x.lineTo(52,78);x.lineTo(48,80);x.lineTo(42,44);x.closePath();x.fill();
  // Diagonal blood-stained wooden baseball bat across front
  x.save();x.translate(32,80);x.rotate(-0.62);
  x.fillStyle='#784826';x.beginPath();x.moveTo(-18,-2.5);x.lineTo(16,-5);x.lineTo(16,5);x.lineTo(-18,2.5);x.closePath();x.fill();
  x.fillStyle='#991b1b';x.beginPath();x.moveTo(2,-3.8);x.lineTo(16,-5);x.lineTo(16,5);x.lineTo(3,3.8);x.closePath();x.fill();
  x.fillStyle='#7f1d1d';x.fillRect(6,2,2.5,7);
  x.restore();
  // Grey hair tufts on sides of charred blackened head
  x.fillStyle='#9ca3af';x.beginPath();x.ellipse(21,17,4,7,.2,0,7);x.ellipse(43,17,4,7,-.2,0,7);x.fill();
  x.fillStyle='#080809';x.beginPath();x.ellipse(32,20,10.5,13.5,0,0,7);x.fill();
  // Bright glowing white horror eyes & open mouth
  x.fillStyle='#fff';x.beginPath();x.arc(28,17,2.4,0,7);x.arc(36,17,2.4,0,7);x.fill();
  x.fillStyle='#020202';x.beginPath();x.ellipse(32,27,3.5,4.5,0,0,7);x.fill();
  x.strokeStyle='#7f5848';x.lineWidth=1;x.beginPath();x.ellipse(32,27,3.5,4.5,0,0,7);x.stroke();
});
const monImgTvMan=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';
  // Dark tailored trousers & shoes
  x.fillStyle='#101216';x.fillRect(22,86,8,38);x.fillRect(34,86,8,38);
  x.fillStyle='#07080a';x.fillRect(19,122,12,5);x.fillRect(33,122,12,5);
  // Long dark double-breasted trench coat
  x.fillStyle='#1e2126';x.beginPath();x.moveTo(19,40);x.lineTo(45,40);x.lineTo(48,92);x.lineTo(16,92);x.closePath();x.fill();
  x.fillStyle='#111317';x.fillRect(28,40,8,52);
  x.fillStyle='#3a3f47';for(let i=0;i<4;i++){x.fillRect(28,46+i*10,2,2);x.fillRect(34,46+i*10,2,2);}
  // Arms & gloved hands
  x.fillStyle='#191c20';x.fillRect(13,42,6,38);x.fillRect(45,42,6,38);
  x.fillStyle='#08090b';x.fillRect(13,80,6,6);x.fillRect(45,80,6,6);
  // Bulky retro CRT television head with glowing pale static screen
  x.fillStyle='#14161a';x.fillRect(14,8,36,28);
  x.strokeStyle='#2d323a';x.lineWidth=1.5;x.strokeRect(14,8,36,28);
  const tg=x.createRadialGradient(32,22,2,32,22,16);tg.addColorStop(0,'#e2e8f0');tg.addColorStop(.65,'#94a3b8');tg.addColorStop(1,'#475569');
  x.fillStyle=tg;x.fillRect(18,12,28,20);
  x.fillStyle='rgba(15,23,42,0.28)';for(let y=13;y<32;y+=3)x.fillRect(18,y,28,1);
});
function getActiveSoloMonSkin(){
  const s=PF&&PF.eqMonSkin;
  if((s==='matrixman'||s==='figuraa'||s==='grannyde'||s==='tvman')&&Array.isArray(PF.ownedMonSkins)&&PF.ownedMonSkins.includes(s))return s;
  return '';
}
function getPromoClientId(){
  try{
    let cid=localStorage.getItem('horror_promo_cid');
    if(!cid||cid.length<6){
      const base=(ACC&&ACC.on&&ACC.k)?('acc_'+ACC.k):(UID?('uid_'+UID):'');
      const rand=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID().replace(/-/g,'').slice(0,16):(Date.now().toString(36)+Math.random().toString(36).slice(2,10));
      cid=(base||('cid_'+rand)).replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,64);
      localStorage.setItem('horror_promo_cid',cid);
    }
    return cid;
  }catch(e){return 'cid_fallback'}
}
let stat,traps;
// ---------- WORLD ----------
function gen(){
if(ch==1)N=29;else if(ch==2)N=21;else if(ch==3||ch==4)N=25;
if(typeof VIS!=='undefined'&&(!VIS||VIS.length<N*N))VIS=new Uint8Array(N*N);
RN=MP.on?mul(MP.seed):Math.random;map=[...Array(N)].map(()=>Array(N).fill(1));const st=[[1,1]];map[1][1]=0;
while(st.length){const[x,y]=st[st.length-1];const d=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>RN()-.5).filter(([a,b])=>{const nx=x+a,ny=y+b;return nx>0&&ny>0&&nx<N-1&&ny<N-1&&map[ny][nx]==1});if(!d.length){st.pop();continue}const[a,b]=d[0];map[y+b/2][x+a/2]=0;map[y+b][x+a]=0;st.push([x+a,y+b])}
for(let i=0;i<Math.floor(N*3.2);i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(map[y][x]==1&&((map[y][x-1]==0&&map[y][x+1]==0)||(map[y-1][x]==0&&map[y+1][x]==0)))map[y][x]=0}
for(let i=0;i<Math.floor(N/4);i++){const x=3+rnd(N-8),y=3+rnd(N-8);for(let a=0;a<3;a++)for(let b=0;b<3;b++)if(y+b<N-1&&x+a<N-1)map[y+b][x+a]=0}
cage={on:false,spots:[],bars:[]};srchT=0;srchS=null;pcOpen=false;photoModalOpen=false;photoSel=0;{const pmEl=document.getElementById('mansion_photo_modal');if(pmEl)disposeAnimatedModal(pmEl);}ROOM={on:false};DR={st:'open',knock:0,bang:0};DOORS=[];HRM=[];FP=[];PCS=[];CAMS=[];FRI=null;FUR=[];RM=[];csDone=0;tpk=0;STR=null;HSP=[];PAP=[];USB=null;cemeteryGateOpened=false;VAZ=null;nearVaz=false;partsCarried=0;partsInstalled=0;vazBarVis=0;mechChased=false;GARAGE_BAYS=[];GARAGE_PART_SPOTS=[];MANSION_PHOTO_SPOTS=[];nearPhoto=null;mazeNotes=[];nearMazeNote=null;ghostHint=null;ghostHintCd=12;M2_LOCKERS=[];RADIO_SPOT={x:4.15,y:11.25,on:true};nearRadio=false;auditoryAlert=null;lastSprintNoiseT=0;ambientAudio.reset();try{duocaraRadio.update({active:false,ac,dest:musGain||mst,tm})}catch(e){}
if(ch==2){if(stg=='base')base();else if(UPF)upfloor();else mansion2()}else if(ch==3)gy();else if(ch==4)gr();else{map[N-2][N-1]=3;EX=N-.5;EY=N-1.5;mkCage();mkRoom();USB={x:16.15,y:16.3,on:!PF.usb}}floors=[];for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)if(!map[y][x])floors.push([x,y]);
if(ch==1){
  const decPool=floors.filter(([x,y])=>(x>4||y>4)&&!inFP(x,y)&&(x<N-3||y<N-3));
  const decDefs=[[crateImg,'crate',0.24],[barrelImg,'barrel',0.24],[torchImg,'torch',0.36],[bonePileImg,'bonePile',0.18]];
  for(let i=0;i<22&&decPool.length;i++){
    const f=decPool.splice(rnd(decPool.length),1)[0];
    const ox=(rnd(2)?0.22:0.78),oy=(rnd(2)?0.22:0.78);
    const [img,k3,sc]=decDefs[i%decDefs.length];
    FUR.push({x:f[0]+ox,y:f[1]+oy,img,sc,kind3d:k3});
  }
  const discN=getDiscoveredNotes(PF);
  const noteIndices=MAZE_NOTES_CATALOG.map(n=>n.idx).sort((a,b)=>(!!discN[a]-!!discN[b])||(RN()-0.5));
  const notePool=floors.filter(([x,y])=>(x>4||y>4)&&!inFP(x,y));
  for(let i=0;i<6&&notePool.length&&i<noteIndices.length;i++){
    const f=notePool.splice(rnd(notePool.length),1)[0];
    mazeNotes.push({x:f[0]+0.5,y:f[1]+0.5,noteIdx:noteIndices[i],on:1});
  }
}
const far=floors.filter(f=>f[0]+f[1]>Math.floor(N*0.8));items=[];
const targetN=ch==4?NK():3;
const partOrder=ch==4?Array.from({length:PART_NAMES.length},(_,i)=>i).sort(()=>RN()-.5):[0,1,2,3,4,5,6];
if(ch==4&&GARAGE_PART_SPOTS.length){
  const byBay={};
  for(const sp of GARAGE_PART_SPOTS){const bi=sp.bay|0;(byBay[bi]=byBay[bi]||[]).push(sp);}
  const picked=[];const leftovers=[];
  const bayKeys=Object.keys(byBay).sort(()=>RN()-.5);
  for(const bk of bayKeys){const arr=byBay[bk].slice().sort(()=>RN()-.5);if(arr.length){picked.push(arr.shift());leftovers.push(...arr);}}
  leftovers.sort(()=>RN()-.5);
  const allSpots=[...picked,...leftovers];
  for(let i=0;i<targetN&&i<allSpots.length;i++){const sp=allSpots[i];items.push({x:sp.x,y:sp.y,t:'k',pIdx:partOrder[i%partOrder.length],on:1})}
}else{
  for(let i=0;i<targetN;i++){const pool=far.length?far:floors;const f=pool.splice(rnd(pool.length),1)[0];items.push({x:f[0]+.5,y:f[1]+.5,t:'k',pIdx:partOrder[i%partOrder.length],on:1})}
}
for(let i=0;i<6;i++){const f=floors[rnd(floors.length)];if((ch==4?!vazHit(f[0]+.5,f[1]+.5):(f[0]+f[1]>4)))items.push({x:f[0]+.5,y:f[1]+.5,t:'b',on:1})}
lockers=ROOM.on?hideSpots():[];for(const wl of M2_LOCKERS)lockers.push(wl);const hs0=lockers.length;const extraLck=ch==2?(stg=='base'?5:0):9;for(let i=0;i<300&&lockers.length<hs0+extraLck;i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(map[y][x]==1&&(!map[y][x-1]||!map[y][x+1]||!map[y-1][x]||!map[y+1][x])&&(x+y>5)&&(x>4||y>4)&&!inFP(x,y)&&!(ch==4&&(y>=15&&x>=8&&x<=17))){map[y][x]=2;lockers.push({x:x+.5,y:y+.5})}}
if(ch==4){px=12.5;py=2.5;pa=Math.PI/2}else{px=1.5;py=1.5;pa=map[1][2]?Math.PI/2:0}hid=false;bat=100;sta=100;keys=0;flash=true;ghosts=[];tm=0;lastProgressT=0;lightsOut=0;nextOut=30+rnd(15);nextBang=8;lurk=0;shake=0;deadT=0;wT=0;finalDone=false;deadTxt='ТЫ МЁРТВ';deadBySkin='';runMadeNoise=false;visitedExploredTiles=new Set();survXpTimer=0;flCurrent=1.0;flTarget=1.0;flFlickerTimer=0;flFlickerVal=1.0;flSoundTimer=0;lastRain=-2;
const mfList=floors.filter(f=>ch==4?(f[1]>9&&f[1]<17&&(f[0]<10||f[0]>15)):f[0]+f[1]>18);const f=mfList[0]||floors[floors.length-1];
mon={x:f[0]+.5,y:f[1]+.5,st:'patrol',tx:-1,ty:0,path:[],rp:0,lost:0,stepT:0,seen:false,cool:0};mon.off=ch==2?1:0;mon.vis=0;
traps=[];for(let i=0;i<6;i++){const q=floors[rnd(floors.length)];if((ch==4?(q[1]>4&&!vazHit(q[0]+.5,q[1]+.5)&&!(q[1]>=16&&q[0]>=9&&q[0]<=16)):(q[0]+q[1]>4&&(q[0]>4||q[1]>4)))&&!inFP(q[0],q[1]))traps.push({x:q[0]+.5,y:q[1]+.5,on:1})}if(ch==2){let kk=0;items=items.filter(i=>i.t!='k'||(stg=='base'&&kk++<1))}if(ROOM.on)mkCams();corpses=[];if(ch==2)for(let i=0;i<11;i++){const q=floors[rnd(floors.length)];if(q[0]+q[1]>6)corpses.push({x:q[0]+.5+(rnd(5)-2)*.08,y:q[1]+.5+(rnd(5)-2)*.08,k:rnd(3),f:rnd(2)})}
hunterTrapCd=0;hunterCatchCd={};
const isPMMode=MP.on&&coop.currentRoom?.coopMode==='player';
if(isPMMode){
  mon.off=1;mon.x=-99;mon.y=-99;
  if(coop.isHunterMe()){
    if(ch==4){px=12.5;py=15.5;pa=-Math.PI/2}else{const hf=floors[floors.length-1];if(hf){px=hf[0]+.5;py=hf[1]+.5}}
  }
}
const eqCarGen=getCarSpec(PF.eqCar||'vaz2112');
RN=Math.random;MP.got=new Set();MP.alSeen={};MP.wSeen={};MP.init=0;MP.dead=0;MP.win=0;MP.al=null;MP.m=null;say(isPMMode?(coop.isHunterMe()?'Вы — МОНСТР! Догоняйте выживших. [G] — поставить ловушку.':'Режим: Игрок-монстр! Один из игроков охотится за вами.'):ch==4?'Собери детали в открытых гаражах и установи на '+eqCarGen.name+' у бокса №14.':ch==1?'Ты заперт в клетке. Обыщи её и найди ключ.':MP.on?'Кооператив: найдите 3 ключа вместе.':'Найди 3 ключа. Не шуми.',6)}
const say=(t,s=4)=>{msg=t;msgT=s};
function bfs(sx,sy,tx,ty){const pv=new Int16Array(N*N).fill(-1),s=sy*N+sx,e=ty*N+tx,q=[s];pv[s]=s;while(q.length){const c=q.shift();if(c==e)break;const x=c%N,y=c/N|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*N+nx;if(map[ny]?.[nx]==0&&pv[k]<0){pv[k]=c;q.push(k)}}}
if(pv[e]<0)return[];const p=[];let c=e;while(c!=s){p.push([c%N+.5,(c/N|0)+.5]);c=pv[c]}return p.reverse()}
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=d/.15|0;for(let i=1;i<n;i++){const t=i/n;if(map[(y0+(y1-y0)*t)|0][(x0+(x1-x0)*t)|0]!=0)return false}return true}
const free=(x,y)=>[[.27,.27],[-.27,.27],[.27,-.27],[-.27,-.27]].every(([a,b])=>map[(y+b)|0][(x+a)|0]==0)&&!vazHit(x,y);
function die(){if(state!='play')return;state='dead';deadT=0;pcOpen=false;MP.dead=1;deadBySkin=MP.deadBySkin||getActiveSoloMonSkin()||'';MP.deadBySkin='';if(muffleFilter&&ac)muffleFilter.frequency.setTargetAtTime(18500,ac.currentTime,0.05);try{duocaraRadio.update({active:false,ac,dest:musGain||mst,tm})}catch(e){}pstat('deaths');try{unlockAchievement('first_blood',{PF,pWrite,ac,TN})}catch(e){}deadTxt=deadBySkin==='matrixman'?'МАТРИЦА СТЕРЛА ТЕБЯ':deadBySkin==='figuraa'?'FIGURAA ПОГЛОТИЛ ТЕБЯ':deadBySkin==='grannyde'?'БАБКА ДОГНАЛА ТЕБЯ':deadBySkin==='tvman'?'ПОМЕХИ ПОГЛОТИЛИ ТЕБЯ':ch==4?'МЕХАНИК ПОЧИНИЛ ТЕБЯ':ch==3?'ТЕБЯ ПОХОРОНИЛИ':ch==2?'ШЕЯ СЛОМАНА':'ТЫ МЁРТВ';if(MP.on){try{coop.sendPlayerCaught(coop.peerId)}catch(e){}}scream();if(ch==2)setTimeout(crack,1300);if(ch==3)setTimeout(()=>{NZ(.9,200,.9);TN(45,1.1,.9,'sine',20)},1200);if(ch==4)setTimeout(()=>{NZ(.5,1200,.9,0,'highpass');TN(110,.6,.85,'square',45)},1100);document.exitPointerLock&&document.exitPointerLock()}
// ---------- EXTREME AUDITORY ANALYZER & UPDATE ----------
function emitSuddenNoise(nx,ny,strength=0.85,tag='шум'){
  if(DIFF!=='extreme'||state!=='play'||(MP.on&&coop.isHunterMe())||!mon||mon.off||(cage.on&&nx<4&&ny<4))return;
  const d=Math.hypot(nx-mon.x,ny-mon.y);
  if(d<=strength*19){
    mon.st=(strength>=0.9||d<10)?'hunt':'invest';
    mon.tx=nx|0;mon.ty=ny|0;mon.lost=0;mon.rp=0;
    auditoryAlert={t:2.2,tag};
    try{playAuditoryPing(ac,sfxGain||mst)}catch(e){}
    if(tm-lastNoiseMsgT>5.5){lastNoiseMsgT=tm;say('⚡ ЭКСТРИМ · СЛУХ: Монстр засёк '+tag+'!',2.4)}
  }
}
let nearL=null,nearE=false;
function upd(dt){tm+=dt;if(auditoryAlert){auditoryAlert.t-=dt;if(auditoryAlert.t<=0)auditoryAlert=null}if(muffleFilter&&ac){muffleFilter.frequency.setTargetAtTime(hid?(hidSofa?(hidBed?750:950):420):18500,ac.currentTime,0.06)}try{duocaraRadio.update({active:ch==4&&state=='play'&&RADIO_SPOT.on,ac,dest:musGain||mst,px,py,pa,rx:RADIO_SPOT.x,ry:RADIO_SPOT.y,indoor:inGarageBay(px,py),tm})}catch(e){}nearRadio=ch==4&&!hid&&Math.hypot(px-RADIO_SPOT.x,py-RADIO_SPOT.y)<1.75;if(ch==4&&state=='play'&&RADIO_SPOT.on&&inGarageBay(px,py)&&Math.hypot(px-RADIO_SPOT.x,py-RADIO_SPOT.y)<3.8){try{unlockAchievement('garage_dj',{PF,pWrite,ac,TN})}catch(e){}}if(lkT>0){lkT+=dt;shake=.6;if(lkT>.55&&!lkO){lkO=1;NZ(.4,700,.95);TN(200,.3,.9,'sawtooth',70)}if(lkT>.95){lkT=0;lkO=0;mon.lk=null;hid=false;die();return}}
const sprint=(kd.ShiftLeft||kd.ShiftRight)&&sta>0&&staLock<=0;crouch=!!(kd.KeyC||kd.ControlLeft);
let mv=(kd.KeyW||kd.ArrowUp?1:0)-(kd.KeyS||kd.ArrowDown?1:0),sd=(kd.KeyD?1:0)-(kd.KeyA?1:0);
if(kd.ArrowLeft&&!pcOpen)pa-=1.9*dt;if(kd.ArrowRight&&!pcOpen)pa+=1.9*dt;if(hid)pa=Math.max(ha-.6,Math.min(ha+.6,pa));else if(pa>3.1416)pa-=6.2832;else if(pa<-3.1416)pa+=6.2832;
if(srchT>0||pcOpen){mv=0;sd=0}moving=!hid&&!!(mv||sd);sprintNow=moving&&sprint&&!crouch;noise=0;if(sprintNow)runMadeNoise=true;
if(moving){const monSp=(MP.on&&coop.isHunterMe())?getMonsterSkinSpec(PF.eqMonSkin||'maze').speedMult:1;const sp=(crouch?1.1:sprintNow?4.1:2.3)*monSp,dx=Math.cos(pa),dy=Math.sin(pa);let vx=dx*mv-dy*sd,vy=dy*mv+dx*sd;const l=Math.hypot(vx,vy)||1;vx=vx/l*sp*dt;vy=vy/l*sp*dt;
if(free(px+vx,py))px+=vx;if(free(px,py+vy))py+=vy;noise=crouch?.15:sprintNow?1:.45;bobT+=dt*(sprintNow?11:crouch?4:7);
const cTile=(py|0)*N+(px|0);if(visitedExploredTiles&&!visitedExploredTiles.has(cTile)&&map[py|0]&&map[py|0][px|0]===0){visitedExploredTiles.add(cTile);try{addXP(3,'Исследование лабиринта',{PF,pWrite,ac,TN})}catch(e){}}
stepP+=dt*sp;if(stepP>2.4){stepP=0;const surf=ch==4?(inGarageBay(px,py)?'concrete':'wet_asphalt'):ch==3?'grass':(ch==2&&stg!=='base')?'wood':'stone';try{playSurfaceFootstep(ac,nb,sfxGain||mst,{surface:surf,sprint:sprintNow,crouch})}catch(e){NZ(.09,sprintNow?420:220,sprintNow?.3:.14)}}
if(sprintNow&&tm-lastSprintNoiseT>0.72){lastSprintNoiseT=tm;emitSuddenNoise(px,py,0.86,'бег')}}
if(sprintNow){sta-=22*dt;if(sta<=0){sta=0;staLock=3;NZ(.8,800,.25,0,'bandpass')}}else sta=Math.min(100,sta+14*dt);staLock-=dt;
if(flash&&bat>0&&lightsOut<=0)bat=Math.max(0,bat-.65*dt);if(phoneUI&&bat>0)bat=Math.max(0,bat-.15*dt);lightsOut-=dt;
const dm0=mon?Math.hypot(px-mon.x,py-mon.y):99;
const isLightOn=flash&&bat>0&&lightsOut<=0&&!hid;
if(isLightOn){
  const batFactor=bat<25?(0.35+0.65*(bat/25)):1.0;
  const emiDist=11.5;
  const emiFactor=Math.max(0,Math.min(1,(emiDist-dm0)/emiDist));
  const proxDim=1.0-emiFactor*0.62;
  const flickerDanger=emiFactor*1.45+(bat<18?0.45:0);
  if(flFlickerTimer>0){
    flFlickerTimer-=dt;
  }else{
    const triggerChance=0.003+flickerDanger*0.24+(emiFactor>0.55?0.18:0);
    if(Math.random()<triggerChance){
      flFlickerTimer=0.035+Math.random()*(0.07+emiFactor*0.16);
      flFlickerVal=Math.max(0.02,Math.random()*Math.max(0.05,1.0-flickerDanger*0.88));
      if(flickerDanger>0.35&&flSoundTimer<=0){
        flSoundTimer=0.12+Math.random()*0.2;
        try{
          NZ(0.03,1900+Math.random()*1200,0.05+Math.min(0.2,emiFactor*0.22),0,'highpass');
          if(emiFactor>0.4)TN(75+Math.random()*40,0.04,0.06+emiFactor*0.1,'sawtooth',50);
        }catch(e){}
      }
    }else{
      flFlickerVal=1.0;
    }
  }
  if(flSoundTimer>0)flSoundTimer-=dt;
  const targetFL=batFactor*proxDim*flFlickerVal;
  const lerpSpeed=flFlickerVal<flCurrent?40:20;
  flCurrent+=(targetFL-flCurrent)*Math.min(1,lerpSpeed*dt);
  FL=Math.max(0.01,flCurrent);
}else{
  flFlickerTimer=0;
  flFlickerVal=1.0;
  flCurrent=0;
  FL=(phoneUI&&bat>0&&!hid)?0.1:0;
}
for(const i of items)if(i.on&&Math.hypot(i.x-px,i.y-py)<.6){if(MP.on&&coop.isHunterMe()&&i.t=='k')continue;i.on=0;lastProgressT=tm;ghostHint=null;
if(i.t=='b'){bat=Math.min(100,bat+45);say('Батарейка +',2);TN(600,.2,.2,'sine',900)}
else{keys++;if(ch==4)partsCarried++;pstat('keys');pstat('coins',10);TN(900,.4,.3,'triangle',1400);whisper();
try{addXP(50,ch==4?'Найдена деталь':'Найден ключ',{PF,pWrite,ac,TN})}catch(e){}
if(MP.on){try{coop.sendKeyCollected(items.indexOf(i))}catch(e){}}
try{trackDailyQuest('keys',1,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}
if(keys>=3&&ch!=4)try{unlockAchievement('keymaster',{PF,pWrite,ac,TN})}catch(e){}
if(ch==4){
  const pIdx=(i.pIdx||0)%PART_NAMES.length;
  const pName=PART_NAMES[pIdx];
  const eqCarName=getCarSpec(PF.eqCar||'vaz2112').name;
  try{discoverVazPart(pIdx,PF,pWrite,{ac,TN})}catch(e){}
  say(keys>=NK()?'Найдена деталь: '+pName+'. Неси всё к '+eqCarName+'!':'Взята деталь: '+pName+' ('+keys+'/'+NK()+')',4.5);
}else{
  say(ch==2&&stg=='base'?'Ты нашёл отмычку!':['«Она слышит бег. Ползи, если хочешь жить.»','«Шкафы безопасны. Пока она не начнёт считать.»','«Выход открыт. Она уже знает.»'][keys-1],5);
}
lightsOut=Math.max(lightsOut,4);TN(120,.5,.5,'square',40);mon.st='hunt';mon.tx=px|0;mon.ty=py|0;mon.lost=0;MP.al=[px|0,py|0,Date.now(),1];shake=.4;
if(keys==NK()){scream();}}}
if(ch==4){const totP=Math.max(1,NK()),fndP=Math.min(totP,partsInstalled+partsCarried);vazBarVis+=(fndP/totP-vazBarVis)*Math.min(1,dt*7)}
// interact prompts
nearL=null;for(const l of lockers){const d=Math.hypot(l.x-px,l.y-py);if(d<1.5&&((l.x-px)*Math.cos(pa)+(l.y-py)*Math.sin(pa))/d>.5)nearL=l}
nearE=ch==4?false:ch==3?(!cemeteryGateOpened&&Math.hypot(px-EX,py-EY)<1.7):Math.hypot(px-EX,py-EY)<1.7;nearVaz=(ch==3&&cemeteryGateOpened||ch==4)&&!!VAZ&&VAZ.on&&Math.hypot(px-VAZ.x,py-VAZ.y)<2.5;let dPc=9,dDr=9;nearPC=null;nearD=null;if(!hid){for(const pc of PCS){const dd=Math.hypot(px-pc.x,py-pc.y);if(dd<dPc){dPc=dd;nearPC=pc}}for(const d of DOORS){if(d.st=='broken')continue;const dd=Math.hypot(px-d.cx-.5,py-d.cy-.5);if(dd<dDr){dDr=dd;nearD=d}}if(dPc>=1.6||dPc>dDr)nearPC=null;if(dDr>=1.7||dDr>=dPc)nearD=null}let dPh=9;nearPhoto=null;if(ch==2&&UPF&&!hid&&!nearPC&&!nearD){for(const ph of MANSION_PHOTO_SPOTS){const dd=Math.hypot(px-ph.x,py-ph.y);if(dd<dPh){dPh=dd;nearPhoto=ph}}if(dPh>=1.45)nearPhoto=null}nearPaper=ROOM.on&&!hid&&!nearPC&&!nearD&&Math.hypot(px-15.45,py-15.55)<1.1;nearSt=ch==2&&!!STR&&(stg=='post'||stg=='surv')&&!hid&&Math.hypot(px-STR.x,py-STR.y)<1.6;nearPap=null;for(const p of PAP)if(!hid&&Math.hypot(px-p.x,py-p.y)<1.1)nearPap=p;nearUsb=!!USB&&USB.on&&!hid&&Math.hypot(px-USB.x,py-USB.y)<1.1;nearMazeNote=null;if(!hid&&!nearPC&&!nearD)for(const mn of mazeNotes)if(mn.on&&Math.hypot(px-mn.x,py-mn.y)<1.25){nearMazeNote=mn;break}if(tpk>0){tpk-=dt;if(tpk<=0&&state=='play')die()}if(JY>0||jv!=0){JY+=jv*dt;jv-=520*dt;if(JY<=0){JY=0;jv=0;noise=Math.max(noise,.5);NZ(.06,200,.2);emitSuddenNoise(px,py,0.96,'прыжок')}}if(STF>0){STF-=dt;if(STF<=0&&STR){mon.off=0;mon.x=STR.x+(UPF?.5:.3);mon.y=STR.y;mon.st='hunt';mon.lost=0;mon.path=[];mon.tx=px|0;mon.ty=py|0;NZ(.4,200,.6);TN(70,.5,.7,'sawtooth',40);shake=.5}}if(ch==2&&stg=='main'&&FRI&&!csDone&&Math.hypot(px-FRI.x,py-FRI.y)<1.7)startCS();if(ch==2&&(stg=='main'||stg=='surv'||stg=='post')){const rn=(()=>{for(const m of RM)if(px>=m.x0&&px<=m.x1+1&&py>=m.y0&&py<=m.y1+1)return m.k;return UPF?(py>=9&&py<=12?'cor':''):(px>=9&&px<=12?'hall':'')})();if(rn!==rmLast){rmLast=rn;if(rn)say(NMS[rn]||'Холл',2)}}if(ch==2&&stg=='surv'){survShow+=dt;if(survShow>=3.5){survT-=dt;if(survT<=0&&stg=='surv'){endSurv()}}}if(pcOpen){pcT+=dt;visT-=dt;if(visT<=0&&pcSt=='cams'){visT=.25;camVis()}}BA+=((moving?(sprintNow?3:1.5):0)-BA)*Math.min(1,dt*10);CY+=((crouch?-10:0)-CY)*Math.min(1,dt*10);nearSp=null;if(cage.on)for(const s of cage.spots)if(!s.done&&Math.hypot(s.x-px,s.y-py)<1.3)nearSp=s;if(srchT>0){srchT+=dt;noise=Math.max(noise,.5);if(srchT>1.3)finishSearch()}
if(MP.on)mpTick(dt);else if(!mon.off)monUpd(dt);if(state=='play'&&!(MP.on&&coop.isHunterMe()))trapUpd();
const dm=mon?Math.hypot(px-mon.x,py-mon.y):99;
if(ch==2&&dm<10&&tm>nextHum){nextHum=tm+1.05;const hf=HUM[humI++%HUM.length];TN(hf,1,.07*(1-dm/10),'sine',hf*.985,((mon.x-px)*-Math.sin(pa)+(mon.y-py)*Math.cos(pa))/Math.max(.1,dm));TN(hf*2.005,1,.025*(1-dm/10),'triangle',hf*2)}if(ch==2&&mon.st=='hunt'&&Math.random()<dt*.5)whisper();
// Ghostly hints ("призрачные подсказки") when stuck looking for item or exit
if(ghostHint){ghostHint.t+=dt;if(ghostHint.t>=ghostHint.maxT)ghostHint=null;}
if(ghostHintCd>0)ghostHintCd-=dt;
if(state=='play'&&!(MP.on&&coop.isHunterMe())&&!pcOpen&&!hid&&tm-lastProgressT>=30&&ghostHintCd<=0&&!ghostHint){
  let tgt=null,kind='item';
  if(cage.on){
    const ks=cage.spots.find(s=>!s.done&&s.key)||cage.spots.find(s=>!s.done);
    if(ks){tgt={x:ks.x,y:ks.y};kind='cage';}
  }else if(ch==4&&(partsInstalled>=NK()||(partsCarried>0&&partsInstalled+partsCarried>=NK()))&&VAZ&&VAZ.on){
    tgt={x:VAZ.x,y:VAZ.y};kind='car';
  }else if(ch!=4&&keys>=NK()){
    if(ch==3&&cemeteryGateOpened&&VAZ&&VAZ.on){tgt={x:VAZ.x,y:VAZ.y};kind='car';}
    else if(EX>0&&EY>0){tgt={x:EX,y:EY};kind='exit';}
  }else{
    let bd=999;
    for(const it of items)if(it.on&&it.t=='k'){const d=Math.hypot(it.x-px,it.y-py);if(d<bd){bd=d;tgt={x:it.x,y:it.y};kind=ch==4?'part':(ch==2&&stg=='base'?'pick':'key');}}
    if(!tgt&&EX>0&&EY>0){tgt={x:EX,y:EY};kind='exit';}
  }
  if(tgt){
    const dT=Math.hypot(tgt.x-px,tgt.y-py);
    const ang=Math.atan2(tgt.y-py,tgt.x-px);
    let diff=ang-pa;while(diff>Math.PI)diff-=Math.PI*2;while(diff<-Math.PI)diff+=Math.PI*2;
    const rel=Math.abs(diff)<0.55?'прямо впереди':Math.abs(diff)>2.5?'позади тебя':diff>0?'справа от тебя':'слева от тебя';
    const objTxt=kind=='cage'?'ключ в соломе':kind=='car'?'спасительный автомобиль':kind=='exit'?(ch==3?'ворота кладбища':'зелёный выход'):kind=='part'?'нужная деталь':kind=='pick'?'отмычка':'заветный ключ';
    const hintStr=dT<4.5?`...шёпот рядом: ${objTxt} ${rel}...`:`...холодный шёпот: ${objTxt} ждёт ${rel} (~${Math.round(dT)} м)...`;
    ghostHint={text:hintStr,t:0,maxT:7.5};
    ghostHintCd=26;
    try{whisper()}catch(e){}
  }
}
// events
if(tm>nextOut){lightsOut=3+Math.random()*4;nextOut=tm+25+Math.random()*25;TN(120,.5,.5,'square',40);NZ(.5,200,.5)}
if((ch==2||ch==4)&&tm>nextLt){nextLt=tm+(ch==4?13:15)+Math.random()*20;ltFl=1;NZ(1.6,300,.7);TN(60,1.2,.6,'sine',30)}ltFl=Math.max(0,ltFl-dt*2.5);
if(ch==4&&tm-lastRain>1.1){lastRain=tm;const ind=inGarageBay(px,py);NZ(1.25,ind?1400:3400,ind?.03:.072,0,'bandpass');NZ(1.25,ind?4200:7200,ind?.012:.035,0,'highpass')}
if(ch==2&&tm>nextMB){nextMB=tm+.55;if(Math.random()>.15)TN(MBN[mbI++%MBN.length],.9,.035,'triangle',MBN[(mbI-1)%MBN.length],Math.random()*.6-.3)}
if(tm>nextBang){nextBang=tm+22+Math.random()*24;NZ(.5,300,.45,Math.random()*2-1);TN(80,.4,.45,'sine',35,Math.random()*2-1)}
try{ambientAudio.update(dt,{ac,nb,dest:sfxGain||mst,ch,stg,indoor:ch==1||ch==2||(ch==4&&inGarageBay(px,py)),monState:mon?mon.st:'patrol',monDist:dm,px,py,pa,doors:DOORS})}catch(e){}
ghosts.forEach(h=>{h.life-=dt;if(Math.hypot(h.x-px,h.y-py)<2.5)h.life=0});ghosts=ghosts.filter(h=>h.life>0);
// heartbeat
const ten=mon.st=='hunt'?1:Math.max(0,1-dm/10);
if(tm>nextBeat){heart(.12+ten*.7);nextBeat=tm+60/(55+ten*115)}
msgT-=dt;shake=Math.max(0,shake-dt*1.5)}
function monUpd(dt){
const d=Math.hypot(px-mon.x,py-mon.y);
mon.seen=!hid&&d<(FL>0?13:7)*DFM.sight&&los(mon.x,mon.y,px,py);if(DIFF=='secret'&&ch==3&&mon.seen&&!tpk&&!MP.swap)secretTp();
if(mon.seen){if(mon.st!='hunt'){mon.st='hunt';NZ(1.2,2500,.5);TN(200,1,.4,'sawtooth',90);shake=.6;say(ch==4?'МЕХАНИК ТЕБЯ ВИДИТ':'ОНА ТЕБЯ ВИДИТ',2)}if(ch==4)mechChased=true;mon.lost=0;mon.tx=px|0;mon.ty=py|0}
else if(mon.st=='hunt'){mon.lost+=mon.lk&&hid?0:dt;if(mon.lost>6){mon.st='patrol';mon.tx=-1}}
if(!hid&&noise>0&&d<noise*11*DFM.hear&&mon.st=='patrol'&&!(cage.on&&px<4&&py<4)){mon.st='invest';mon.tx=px|0;mon.ty=py|0}
if(ch==2&&stg=='surv'&&mon.rage){mon.st='hunt';mon.lost=0;mon.trk=(mon.trk||0)-dt;if(mon.trk<=0){mon.tx=px|0;mon.ty=py|0;mon.trk=.8}}
const cx=mon.x|0,cy=mon.y|0;
if(mon.siege){const sd=DOORS[mon.siege-1];if(!sd||sd.st!='locked'){mon.siege=0;if(sd)sd.knock=0}}
if(!mon.siege&&mon.st!='patrol')for(let di=0;di<DOORS.length;di++){const dd=DOORS[di];if(dd.st!='locked'||dd.pw)continue;const mi=mon.x>=dd.rx0&&mon.x<=dd.rx1+1&&mon.y>=dd.ry0&&mon.y<=dd.ry1+1,ti=mon.tx>=dd.rx0&&mon.tx<=dd.rx1&&mon.ty>=dd.ry0&&mon.ty<=dd.ry1;if(mi!=ti&&!bfs(mon.x|0,mon.y|0,mon.tx,mon.ty).length){mon.siege=di+1;break}}
if(mon.siege){const sd=DOORS[mon.siege-1],inn=mon.x>=sd.rx0&&mon.x<=sd.rx1+1&&mon.y>=sd.ry0&&mon.y<=sd.ry1+1,ax=inn?2*sd.cx-sd.ox:sd.ox,ay=inn?2*sd.cy-sd.oy:sd.oy;if(Math.hypot(ax+.5-mon.x,ay+.5-mon.y)>.4){mon.st='hunt';mon.lost=0;mon.tx=ax;mon.ty=ay}else{mon.path=[];mon.st='hunt';mon.lost=0;sd.knock=(sd.knock||0)+dt;sd.bang=(sd.bang||0)-dt;if(sd.bang<=0){sd.bang=.6;NZ(.15,200,Math.min(.95,3/(d+1)),((mon.x-px)*-Math.sin(pa)+(mon.y-py)*Math.cos(pa))/Math.max(.1,d));TN(80,.15,.8,'square',40);shake=Math.max(shake,.4)}if(sd.knock>3.6)breakDoor(sd);return}}
if(mon.tx<0||(cx==mon.tx&&cy==mon.ty)){if(mon.st=='hunt'&&!mon.seen&&mon.lost<6){}else{const f=floors[rnd(floors.length)];mon.tx=f[0];mon.ty=f[1];mon.st='patrol'}}
mon.rp-=dt;if(mon.rp<=0){mon.path=bfs(cx,cy,mon.tx,mon.ty);mon.rp=.35;if(!mon.path.length&&!(cx==mon.tx&&cy==mon.ty)){const f=floors[rnd(floors.length)];mon.tx=f[0];mon.ty=f[1];mon.st='patrol';mon.lost=0;mon.path=[]}}
if(mon.lk&&hid&&d<1.9&&!MP.swap){lkKill();return}
if(hid&&d<2.4&&mon.cool<=0){if(ch==4)mechChased=true;lurk+=dt;if(lurk>2&&Math.random()<dt*2)NZ(.9,500,.12,0,'bandpass');
if(lurk>4&&Math.random()<dt*.35&&!MP.swap){state='play';die();return}
if(lurk>6.5){mon.cool=10;lurk=0;mon.st='patrol';mon.tx=-1;if(ch==4){try{unlockAchievement('mechanic_dodge',{PF,pWrite,ac,TN})}catch(e){}}else if(ch==2&&!hidSofa&&!hidBed){try{unlockAchievement('wardrobe_ghost',{PF,pWrite,ac,TN})}catch(e){}}say(ch==4?'Механик отошёл...':'Она ушла...',2)}return}
lurk=0;mon.cool-=dt;
let sp=(mon.st=='hunt'?2.75:mon.st=='invest'?2:1.2)*(ch==2?1.12:1)*DFM.sp;if(ch==2&&stg=='surv'&&mon.rage){sp=mon.st=='hunt'?4.6:mon.st=='invest'?3.4:2.2;if(mon.st=='hunt'){mon.hr=(mon.hr||0)+dt;if(mon.tired>0){mon.tired-=dt;sp=2.2}else if(mon.hr>7){mon.tired=3;mon.hr=0;NZ(1,1500,.5)}}else mon.hr=0}
if(mon.path.length){const[tx,ty]=mon.path[0],dx=tx-mon.x,dy=ty-mon.y,l=Math.hypot(dx,dy),s=sp*dt;if(l<s){mon.x=tx;mon.y=ty;mon.path.shift()}else{mon.x+=dx/l*s;mon.y+=dy/l*s}
mon.stepT+=sp*dt;if(mon.stepT>1.3){mon.stepT=0;const dl=Math.max(.1,d),pan=((mon.x-px)*-Math.sin(pa)+(mon.y-py)*Math.cos(pa))/dl;NZ(.12,ch==4?780:ch==2?1100:150,Math.min(.8,2.2/(dl+1)),pan);if(ch==4&&dl<12)TN(180,.06,Math.min(.25,.9/(dl+1)),'triangle',90,pan)}}
if(ch==2&&stg!='surv'&&mon.st=='hunt'&&!MP.swap){mon.tp=(mon.tp||0)-dt;const inV=(mon.x-px)*Math.cos(pa)+(mon.y-py)*Math.sin(pa)>0&&los(mon.x,mon.y,px,py);if(mon.tp<=0&&d>4&&mon.path.length>3&&!inV){mon.tp=3+Math.random()*3;const nx=mon.path[2];mon.x=nx[0];mon.y=nx[1];mon.path.splice(0,3);NZ(.3,2500,.35,((mon.x-px)*-Math.sin(pa)+(mon.y-py)*Math.cos(pa))/Math.max(.1,d));TN(900,.2,.12,'sawtooth',200)}}
if(!hid&&d<.6&&!MP.swap)die()}
function statUpd(dt){const dx=stat.x-px,dy=stat.y-py,d=Math.max(.01,Math.hypot(dx,dy));
const inView=!hid&&(dx*Math.cos(pa)+dy*Math.sin(pa))/d>.6&&los(px,py,stat.x,stat.y);
if(inView||hid)return;
stat.rp-=dt;if(stat.rp<=0){stat.path=bfs(stat.x|0,stat.y|0,px|0,py|0);stat.rp=.5}
if(stat.path.length){const[tx,ty]=stat.path[0],ex=tx-stat.x,ey=ty-stat.y,l=Math.hypot(ex,ey),s=2.2*dt;if(l<s){stat.x=tx;stat.y=ty;stat.path.shift()}else{stat.x+=ex/l*s;stat.y+=ey/l*s}
if(Math.random()<dt*3)NZ(.15,120,Math.min(.5,1.5/(d+1)),(dx*-Math.sin(pa)+dy*Math.cos(pa))/d)}
if(d<.6){deadTxt='НЕ ОТВОДИ ВЗГЛЯД';die()}}
function trapUpd(){for(const t of traps)if(t.on&&Math.hypot(t.x-px,t.y-py)<.5&&!hid&&JY<6){t.on=0;if(crouch){say('Ловушка обезврежена',2);NZ(.1,2000,.15,0,'highpass');try{trackDailyQuest('trap',1,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}try{unlockAchievement('trap_disarmer',{PF,pWrite,ac,TN})}catch(e){}try{addXP(35,'Ловушка обезврежена',{PF,pWrite,ac,TN})}catch(e){}}else{runMadeNoise=true;NZ(1,1800,.9,0,'highpass');TN(400,.6,.5,'square',90);shake=.5;say('ЛОВУШКА! Грохот разнёсся по коридорам...',3);mon.st='invest';mon.tx=px|0;mon.ty=py|0;MP.al=[px|0,py|0,Date.now(),0];emitSuddenNoise(px,py,1.15,'капкан');try{unlockAchievement('trap_victim',{PF,pWrite,ac,TN})}catch(e){}}}}
// ---------- RENDER ----------
function render(){
const ca=pa,dx=Math.cos(ca),dy=Math.sin(ca),plx=-dy*FOVK(),ply=dx*FOVK();
const ox=hid?lx+Math.cos(pa)*.48:px,oy=hid?ly+Math.sin(pa)*.48:py;
LT=SKINS[PF.skin|0].l;const hor=H/2+Math.sin(bobT)*BA*SET.bob+CY+PIT+JY+(hid&&hidSofa?(hidBed?-30:-16):0);
const camInBay=ch==4&&inGarageBay(ox,oy);
const flShakeX=CAMV?0:(sprintNow&&!hid&&FL>0?(Math.sin(tm*21)*0.032+Math.cos(tm*34)*0.018+Math.sin(bobT)*0.015):(FL>0&&!hid&&sta<26?Math.sin(tm*16)*0.008:0));
const flShakeY=CAMV?0:(sprintNow&&!hid&&FL>0?(Math.sin(tm*27)*0.020+Math.cos(tm*19)*0.012):0);
const shakal=SET.camShakal!==undefined?SET.camShakal:1;
const RW=shakal<=1?800:400,cw=W/RW,colW=cw+0.06;
g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);
drawEnhancedSkyAndFloor({g,W,H,ch,camInBay,hor,ca,fovK:FOVK(),tm,ltFl,ox,oy,FL,floorCol,hv,stg,upf:UPF,flShakeX,flShakeY});
const fog=getChapterFog(ch,camInBay,ltFl,stg,UPF);
const hideAiMon=MP.on&&coop.currentRoom?.coopMode==='player';
const lights=collectWorldLights({ch,EX,EY,keys,neededKeys:NK(),FUR,torchImg,candelabraImg,lampImg,ROOM,PCS,pcSt,VAZ,partsInstalled,tm,mon,hideAiMon});
if(ch==4&&RADIO_SPOT.on){
  const rPulse=0.78+0.22*Math.sin(tm*8);
  lights.push({x:RADIO_SPOT.x,y:RADIO_SPOT.y,r:255*rPulse,g:132*rPulse,b:44*rPulse,rad:3.2,rad2:10.24,pow:0.8,haloY:0.42});
}
const zb=new Float32Array(RW),wt=new Float32Array(RW).fill(H),barD=new Float32Array(RW),barW=new Float32Array(RW),zs=new Float32Array(RW).fill(1e9),stD=new Float32Array(RW),stW=new Float32Array(RW),stK=new Uint8Array(RW);const VF=VFK();
for(let ri=0;ri<RW;ri++){const x=ri*cw,cx=2*ri/RW-1,rx=(dx+plx*cx)||1e-9,ry=(dy+ply*cx)||1e-9;let mx=ox|0,my=oy|0;const ddx=Math.abs(1/rx),ddy=Math.abs(1/ry);let sx,sy,sdx,sdy;
if(rx<0){sx=-1;sdx=(ox-mx)*ddx}else{sx=1;sdx=(mx+1-ox)*ddx}if(ry<0){sy=-1;sdy=(oy-my)*ddy}else{sy=1;sdy=(my+1-oy)*ddy}
let side=0,t=0,it=0;while(!t&&it++<80){if(sdx<sdy){sdx+=ddx;mx+=sx;side=0}else{sdy+=ddy;my+=sy;side=1}t=map[my]?.[mx]||0;if(t==5){if(!barD[ri]){const bd=side?sdy-ddy:sdx-ddx;barD[ri]=bd;const bw=side?ox+bd*rx:oy+bd*ry;barW[ri]=bw-Math.floor(bw)}t=0}if(t==7){if(!stD[ri]){const sd2=side?sdy-ddy:sdx-ddx;stD[ri]=sd2;const sw2=side?ox+sd2*rx:oy+sd2*ry;stW[ri]=sw2-Math.floor(sw2);stK[ri]=(mx*7+my*13)%3}t=0}}if(!t)t=1;
const d=Math.max(.05,side?sdy-ddy:sdx-ddx);let wx=side?ox+d*rx:oy+d*ry;wx-=Math.floor(wx);zb[ri]=d;
const lh=H/d*VF,top=hor-lh/2,c=ri/RW-.5-flShakeX;wt[ri]=top;
const ambCh=ch==4?(camInBay?0.13:0.27)+ltFl*0.36/(1+d*d*0.03):ch==3?0.085:0.038;
const wallSh=CAMV?1:computeWallCastShadow({ox,oy,rx,ry,d,FL,mon,hideAiMon,vaz:VAZ,ch,barD,barW,ri});
const flTerm=CAMV?0:(FL*Math.exp(-c*c*10)*2.45/(1+d*d*.095)+FL*.16/(1+d*d*2.8))*wallSh;
const L=CAMV?Math.min(1,.25+.9/(1+d*d*.06)):Math.min(1,ambCh+flTerm+.055/(1+d*d)+(hid?.1/(1+d*.2):0));
const hxW=ox+d*rx,hyW=oy+d*ry;
const surfX=ox+(d-0.04)*rx,surfY=oy+(d-0.04)*ry;
let lr=0,lg2=0,lb=0;
for(let li=0;li<lights.length;li++){
  const lt=lights[li],ldx=hxW-lt.x,ldy=hyW-lt.y,ld2=ldx*ldx+ldy*ldy;
  if(ld2<lt.rad2){const vis=traceSoftLightVisibility(map,surfX,surfY,lt.x,lt.y);const att=1-Math.sqrt(ld2)/lt.rad,k=att*att*lt.pow*vis;lr+=lt.r*k;lg2+=lt.g*k;lb+=lt.b*k}
}
const distSh=1/(1+d*0.025);
const dirSh=side?.64:1;
const h=((mx*73856093^my*19349663^side*83492791)>>>0)%100,sh=dirSh*L*distSh;let r=95,gg=72,b=60;
const isChapelWall=ch==3&&t==1&&mx>=15&&mx<=20&&my>=4&&my<=8;
if(t==2){if(ch==2){r=84;gg=52;b=34}else if(ch==3){r=92;gg=92;b=96}else if(ch==4){r=70;gg=80;b=88}else{r=62;gg=86;b=96}}else if(t==3){r=0;gg=0;b=0}else if(t==4){r=20;gg=30;b=55}else if(t==6){r=96;gg=64;b=38}else if(ch==4&&t==8){
  const seam=(Math.abs(wx-.5)<.018||wx<.03||wx>.97)?0.55:1;
  const wicket=(wx>.56&&wx<.84)?((Math.abs(wx-.56)<.015||Math.abs(wx-.84)<.015)?0.52:0.93):1;
  const rib=0.84+0.16*Math.sin(wx*58);
  const rust=((wx*19|0)%3===0)?0.92:1;
  r=136*seam*wicket*rib*rust;gg=56*seam*wicket*rib*rust;b=44*seam*wicket*rib*rust;
}else if(ch==4&&t==9){
  // Orange garage (safety orange corrugated steel & weathered concrete frame)
  const rib=0.84+0.16*Math.sin(wx*54);
  const seam=(wx<.05||wx>.95||Math.abs(wx-.5)<.015)?0.62:1;
  const dirt=((wx*23|0)%5===0)?0.9:1;
  r=228*rib*seam*dirt;gg=96*rib*seam*dirt;b=24*rib*seam*dirt;
}else if(ch==4){
  const bv=(((wx*10|0)%2)?1.04:0.93)*(h<18?.91:1);
  r=172*bv;gg=176*bv;b=168*bv;
}else if(isChapelWall){
  const bv=(Math.abs(wx-.08)<.04||Math.abs(wx-.92)<.04)?0.84:(((wx*12|0)%2)?1.03:0.94);
  r=214*bv;gg=192*bv;b=150*bv;
}else if(ch==2){const v=(((wx*14|0)%2)?1:.84)*(.74+((((wx*60|0)*37+h)%10)/32));if(stg=='base'){r=72*v;gg=74*v;b=78*v}else if(UPF){r=106*v;gg=118*v;b=112*v}else{r=90*v;gg=36*v;b=42*v}}else if(ch==3){const v=.76+((wx*10|0)%3)*.12;r=106*v;gg=98*v;b=78*v}else{const bv=(((wx*8|0)%2)?1.03:.93)*(.86+((wx*16|0)*37%10)/38);r*=bv;gg*=bv;b*=bv}
const fogA=1-Math.exp(-d*fog.density);
const lightSh=Math.max(sh,Math.min(1,(lr+lg2+lb)/340)*dirSh);
if(t==3){
  const p=.62+.28*Math.sin(tm*4);
  const rim=(wx<.08||wx>.92)?.55:1;
  const er=(keys>=NK()?32:200)*p*rim,eg=(keys>=NK()?225:24)*p*rim,eb=(keys>=NK()?82:24)*p*rim;
  const tf=fogA*0.45;
  g.fillStyle=`rgb(${er*(1-tf)+fog.r*tf|0},${eg*(1-tf)+fog.g*tf|0},${eb*(1-tf)+fog.b*tf|0})`;
  g.fillRect(x,top,colW,lh+1);
  if(wx>.16&&wx<.84&&lh>12){
    g.fillStyle=`rgba(${keys>=NK()?180:255},${keys>=NK()?255:110},${keys>=NK()?210:100},${0.35*p})`;
    g.fillRect(x,top+lh*.14,colW,lh*.72);
  }
}else{
  const invF=1-fogA;
  const fr=Math.min(255,r*sh*LT[0]+(r/175)*lr*dirSh);
  const fg2=Math.min(255,gg*sh*LT[1]+(gg/175)*lg2*dirSh);
  const fb=Math.min(255,b*sh*LT[2]+(b/175)*lb*dirSh);
  g.fillStyle=`rgb(${fr*invF+fog.r*fogA|0},${fg2*invF+fog.g*fogA|0},${fb*invF+fog.b*fogA|0})`;
  g.fillRect(x,top,colW,lh+1);
}
if(isChapelWall&&lh>10){
  g.fillStyle=`rgb(${148*lightSh|0},${128*lightSh|0},${92*lightSh|0})`;
  g.fillRect(x,top,colW,lh*.08);g.fillRect(x,top+lh*.88,colW,lh*.12);
  if(wx>.32&&wx<.68){
    const arch=(wx-.5)/.18,ah=.36+.14*Math.sqrt(Math.max(0,1-arch*arch));
    g.fillStyle=`rgba(${240*Math.max(.35,lightSh)|0},${188*Math.max(.35,lightSh)|0},${86*Math.max(.35,lightSh)|0},0.85)`;
    g.fillRect(x,top+lh*(.72-ah),colW,lh*ah*.82);
  }
}else if(t==4)win4(x,top,lh,wx,colW);else if(t==6)door6(x,top,lh,lightSh,wx,colW);else if(ch==4&&lh>8&&t!=2){
  if(t==8||t==9){
    g.fillStyle=t==9?`rgb(${148*lightSh|0},${58*lightSh|0},${14*lightSh|0})`:`rgb(${165*lightSh|0},${168*lightSh|0},${162*lightSh|0})`;g.fillRect(x,top,colW,lh*.12);
    g.fillStyle=t==9?`rgb(${215*lightSh|0},${132*lightSh|0},${28*lightSh|0})`:`rgb(${112*lightSh|0},${58*lightSh|0},${42*lightSh|0})`;g.fillRect(x,top+lh*.085,colW,Math.max(1,lh*.028));
    g.fillStyle='rgba(0,0,0,.42)';g.fillRect(x,top+lh*.12,colW,Math.max(1,lh*.02));
    if(t==9&&(wx<.07||wx>.93)){
      const haz=((lh*0.18+wx*18)|0)%2===0;
      g.fillStyle=haz?`rgb(${235*lightSh|0},${172*lightSh|0},${18*lightSh|0})`:`rgb(${18*lightSh|0},${18*lightSh|0},${20*lightSh|0})`;
      g.fillRect(x,top+lh*.22,colW,lh*.68);
    }
    if(wx>.56&&wx<.84){g.fillRect(x,top+lh*.25,colW,Math.max(1,lh*.016))}
    if((Math.abs(wx-.07)<.018||Math.abs(wx-.57)<.018||Math.abs(wx-.84)<.018)){
      g.fillStyle=`rgb(${45*lightSh|0},${24*lightSh|0},${20*lightSh|0})`;
      g.fillRect(x,top+lh*.28,colW,lh*.06);g.fillRect(x,top+lh*.76,colW,lh*.06);
    }
    if(Math.abs(wx-.49)<.025){
      g.fillStyle=`rgb(${65*lightSh|0},${72*lightSh|0},${82*lightSh|0})`;g.fillRect(x,top+lh*.54,colW,lh*.07);
    }
    if(wx>.10&&wx<.18){
      g.fillStyle=`rgba(${200*lightSh|0},${188*lightSh|0},${55*lightSh|0},0.8)`;
      if((h%2===0&&wx<.14)||(h%2===1&&wx>.12))g.fillRect(x,top+lh*.18,colW,lh*.09);
    }
    if(!camInBay){
      const gh=lh*(0.035+((mx*13+(wx*24|0)*7)%5)*0.012);
      g.fillStyle=`rgb(${34*lightSh|0},${68*lightSh|0},${24*lightSh|0})`;
      g.fillRect(x,top+lh-gh,colW,gh+1);
    }
  }else{
    g.fillStyle=`rgb(${58*lightSh|0},${62*lightSh|0},${64*lightSh|0})`;g.fillRect(x,top,colW,lh*.065);
    g.fillStyle=`rgb(${112*lightSh|0},${58*lightSh|0},${42*lightSh|0})`;g.fillRect(x,top+lh*.085,colW,Math.max(1,lh*.028));
    if(Math.abs(wx-.25)<.015||Math.abs(wx-.75)<.015){
      g.fillStyle=`rgb(${88*lightSh|0},${45*lightSh|0},${34*lightSh|0})`;g.fillRect(x,top+lh*.065,colW,lh*.06);
    }
    g.fillStyle='rgba(0,0,0,.22)';
    const rows=8;for(let k=1;k<rows;k++){g.fillRect(x,top+lh*(0.12+k*0.10),colW,1)}
    const bw=(wx*12);if((bw|0)!==((wx-0.02)*12|0)){
      for(let k=0;k<rows;k++)if((k%2)===((bw|0)%2))g.fillRect(x,top+lh*(0.12+k*0.10),colW,lh*0.09);
    }
    if(!inGarageBay(mx+.5,my+.5)){
      const gh=lh*(0.032+((mx*17+(wx*20|0)*5)%5)*0.01);
      g.fillStyle=`rgb(${36*lightSh|0},${72*lightSh|0},${26*lightSh|0})`;
      g.fillRect(x,top+lh-gh,colW,gh+1);
    }
  }
}else if(lh>14&&t!=3){g.fillStyle='rgba(0,0,0,.35)';if(t==2)lockerCol(x,top,lh,wx,lightSh,colW);else if(ch==2){if(stg!='base'&&!UPF)wood(x,top,lh,lightSh,wx,h,colW);dirt(x,top,lh,lightSh,wx,h,colW)}else{for(let k=1;k<4;k++)g.fillRect(x,top+lh*k/4,colW,1);if(ch==1){const bw=(wx*6);if((bw|0)!==((wx-0.02)*6|0)){for(let k=0;k<4;k++)if((k%2)===((bw|0)%2))g.fillRect(x,top+lh*(k/4),colW,lh*0.24)}g.fillStyle='rgba(12,24,10,.32)';g.fillRect(x,top+lh*.84,colW,lh*.16)}}}
if(ch==1&&h<16&&t==1&&wx>.25&&wx<.75){g.fillStyle=`rgb(${170*Math.max(L,Math.min(1,(lr+lg2+lb)/240))|0},0,0)`;g.fillRect(x,top+lh*.1,colW,lh*(.15+.5*Math.abs(Math.sin(wx*30))))}
if(lh>6){
  const aoH=Math.min(26,Math.max(2,lh*0.14));
  g.fillStyle='rgba(0,0,0,0.26)';
  g.fillRect(x,top,colW,Math.max(1,lh*0.04));
  g.fillStyle='rgba(0,0,0,0.32)';
  g.fillRect(x,top+lh-Math.max(1,lh*0.038),colW,Math.max(1,lh*0.038));
  // Feathered 3-tier soft ambient occlusion floor contact shadow
  const f1=aoH*0.28,f2=aoH*0.62;
  g.fillStyle='rgba(0,0,0,0.34)';
  g.fillRect(x,top+lh,colW,f1);
  g.fillStyle='rgba(0,0,0,0.18)';
  g.fillRect(x,top+lh+f1,colW,f2-f1);
  g.fillStyle='rgba(0,0,0,0.07)';
  g.fillRect(x,top+lh+f2,colW,aoH-f2);
  // Soft corner crease shadow at tile edges
  if(wx<0.07||wx>0.93){
    const edgeK=wx<0.07?(1-wx/0.07):(1-(1-wx)/0.07);
    g.fillStyle=`rgba(0,0,0,${(0.22*edgeK).toFixed(3)})`;
    g.fillRect(x,top,colW,lh+1);
  }
}
}
drawFloorLightPools({g,W,H,hor,ox,oy,dx,dy,plx,ply,inv:1/(plx*dy-dx*ply),VF,zb,RW,lights});
// 3D Props, Collectibles & Sprites
const resolveKind3d=img=>{
  if(img===crateImg)return'crate';if(img===barrelImg)return'barrel';if(img===torchImg)return'torch';
  if(img===candelabraImg)return'candelabra';if(img===clockImg)return'clock';if(img===tiresImg)return'tires';
  if(img===coneImg)return'cone';if(img===urnImg)return'urn';if(img===bonePileImg)return'bonePile';
  if(img===statImg)return'stat';if(img===autumnTreeImg1||img===autumnTreeImg2)return'tree';
  if(img===chapelDomeImg)return'chapelDome';if(img===tableImg)return'table';if(img===shelfImg)return'shelf';
  if(img===sofaImg)return'sofa';if(img===bedImg)return'bed';if(img===benchImg)return'bench';
  if(img===tubImg)return'tub';if(img===stoveImg)return'stove';if(img===pcImg)return'pc';
  if(img===stairsImg)return'stairs';if(img===lampImg)return'lamp';if(img===friendImg)return'friend';
  if(img===trapImg)return'trap';if(img===paperImg||img===scaryNoteImg)return'note';
  if(img===usbImg)return'usb';if(img===pickImg)return'pick';if(img===keyImg)return'key';if(img===batImg)return'bat';
  if(mansionPhotoImgs&&mansionPhotoImgs.indexOf(img)>=0)return'photo';
  return null;
};
const S=[];items.forEach(i=>i.on&&S.push({x:i.x,y:i.y,img:i.t=='k'?(ch==4?partImgs[(i.pIdx||0)%partImgs.length]:ch==2?pickImg:keyImg):batImg,sc:ch==4&&i.t=='k'?.26:.22,it:1,kind3d:i.t=='k'?(ch==4?'part':ch==2?'pick':'key'):'bat',pIdx:i.pIdx||0}));
mazeNotes.forEach(mn=>mn.on&&S.push({x:mn.x,y:mn.y,img:scaryNoteImg,sc:.16,em:1,it:1,kind3d:'note'}));
if(!hideAiMon&&(!mon.off||mon.vis)){const monDist=Math.hypot(ox-mon.x,oy-mon.y);const monYaw=(mon.st=='hunt'||monDist<7)?Math.atan2(oy-mon.y,ox-mon.x):(mon.path&&mon.path.length?Math.atan2(mon.path[0][1]-mon.y,mon.path[0][0]-mon.x):Math.atan2(oy-mon.y,ox-mon.x));const soloSk=getActiveSoloMonSkin();const mImg=soloSk==='matrixman'?monImgMatrix:soloSk==='figuraa'?monImgFigura:soloSk==='grannyde'?monImgGrannyDe:soloSk==='tvman'?monImgTvMan:(ch==4?monImg5:ch==3?monImg4:ch==2?monImg3:monImg);const mKind=soloSk==='matrixman'?'matrixman':soloSk==='figuraa'?'figuraa':soloSk==='grannyde'?'grannyde':soloSk==='tvman'?'tvman':(ch==4?'monster5':ch==3?'monster4':ch==2?'monster3':'monster1');const mSc=soloSk==='figuraa'?1.24:soloSk==='tvman'?1.14:soloSk==='matrixman'?1.12:soloSk==='grannyde'?1.08:(ch==2?1:ch==3||ch==4?1.04:1.12);S.push({x:mon.x,y:mon.y,img:mImg,sc:mSc,mon:1,kind3d:mKind,hunting:mon.st=='hunt',faceYaw:monYaw});}if(ROOM.on){PCS.forEach(p=>S.push({x:p.x,y:p.y,img:pcImg,sc:.3,em:1,kind3d:'pc'}));S.push({x:16,y:17.1,img:sofaImg,sc:.36,kind3d:'sofa'});S.push({x:15.45,y:15.55,img:paperImg,sc:.1,em:1,kind3d:'note'});for(const r of HRM){S.push({x:r.bed.x,y:r.bed.y,img:bedImg,sc:.3,kind3d:'bed'});S.push({x:r.sofa.x,y:r.sofa.y,img:sofaImg,sc:.36,kind3d:'sofa'})}}FUR.forEach(f=>{const k3=f.kind3d||resolveKind3d(f.img);const pIdx3=k3==='photo'&&mansionPhotoImgs?Math.max(0,mansionPhotoImgs.indexOf(f.img)):0;S.push({x:f.x,y:f.y,img:f.img,sc:f.sc,noSh:f.noSh,overWall:f.overWall,kind3d:k3,treeTone:f.img===autumnTreeImg1?0:1,photoIdx:pIdx3})});PAP.forEach(p=>S.push({x:p.x,y:p.y,img:paperImg,sc:.1,em:1,kind3d:'note'}));if(USB&&USB.on)S.push({x:USB.x,y:USB.y,img:usbImg,sc:.08,em:1,kind3d:'usb'});if(STR&&ch==2&&(stg=='post'||stg=='surv'))S.push({x:STR.x,y:STR.y,img:stairsImg,sc:.45,kind3d:'stairs'});if(FRI&&ch==2)S.push({x:FRI.x,y:FRI.y,img:friendImg,sc:.28,fl:FRI.fl,kind3d:'friend'});if(ch==4)S.push({x:RADIO_SPOT.x,y:RADIO_SPOT.y,img:crateImg,sc:.28,kind3d:'radio',radioOn:RADIO_SPOT.on});cage.spots.forEach(s=>S.push({x:s.x,y:s.y,img:spotImgs[s.k],sc:.2,kind3d:'cageSpot',k:s.k}));if(ch==2)corpses.forEach(c=>S.push({x:c.x,y:c.y,img:corpseImgs[c.k],sc:.28,fl:c.f,kind3d:'corpse',corpseKind:c.k,k:c.k}));if(MP.on)mpSprites(S);traps.forEach(t=>t.on&&S.push({x:t.x,y:t.y,img:trapImg,sc:.12,kind3d:'trap'}));ghosts.forEach(q=>S.push({x:q.x,y:q.y,img:ch==2?monImg2:monImg,sc:1.05,mon:1,gh:1,kind3d:'ghost'}));
S.forEach(s=>s.d=(s.x-ox)**2+(s.y-oy)**2);S.sort((a,b)=>b.d-a.d);const inv=1/(plx*dy-dx*ply);
const drawSpriteList=list=>{for(const s of list){const ex=s.x-ox,ey=s.y-oy,tx=inv*(dy*ex-dx*ey),ty=inv*(-ply*ex+plx*ey);if(ty<.15)continue;
const scr=W/2*(1+tx/ty)+(s.mon&&!s.gh&&mon.st=='hunt'?(Math.random()-.5)*2.5:0),sh=H/ty*VF*s.sc,sw=sh*s.img.width/s.img.height,fy=s.overWall?(hor-H/ty*VF*0.42):(hor+H/ty*VF/2),top=fy-sh-(s.it?H/ty*VF*.12+Math.sin(tm*3)*2:0);
const c=scr/W-.5-flShakeX;
let pBoost=0;
for(let li=0;li<lights.length;li++){const lt=lights[li],ld2=(s.x-lt.x)**2+(s.y-lt.y)**2;if(ld2<lt.rad2)pBoost+=(1-Math.sqrt(ld2)/lt.rad)*lt.pow*0.55}
const L=CAMV?Math.min(1,.25+.9/(1+ty*ty*.06)):Math.min(1,(ch==4?.19:ch==3?.085:.035)+FL*Math.exp(-c*c*10)*2.4/(1+ty*ty*.1)+.05/(1+ty*ty)+(hid?.1/(1+ty*.2):0)+pBoost);
const fogFade=Math.max(0.28,Math.exp(-ty*fog.density*0.72));
const fogA3=fog?1-Math.exp(-ty*fog.density):0;
const invF3=1-fogA3;
const ri0=Math.max(0,((scr-sw/2)/cw)|0),ri1=Math.min(RW-1,((scr+sw/2)/cw)|0);
if(!s.noSh&&!s.gh&&!s.overWall&&fy<H&&fy>hor-2){
  drawDynamicSoftShadow({g,W,H,hor,ox,oy,dx,dy,plx,ply,inv,VF,zb,RW,cw,colW,sx:s.x,sy:s.y,scr,sw,ty,fy,isItem:!!s.it,isMon:!!s.mon,FL,lights,fogFade,ch,ltFl});
}
if(s.it&&ty<9){
  const midRi=Math.max(0,Math.min(RW-1,(scr/cw)|0));
  if(zb[midRi]>ty){
    g.save();g.globalCompositeOperation='lighter';
    const glR=Math.max(4,sh*0.7),glY=top+sh*0.5;
    const gg2=g.createRadialGradient(scr,glY,0.5,scr,glY,glR);
    const glCol=s.kind3d==='bat'?'120,255,145':s.kind3d==='pick'?'210,235,255':'255,220,120';
    gg2.addColorStop(0,`rgba(${glCol},${(0.14+0.08*Math.sin(tm*4)).toFixed(3)})`);
    gg2.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gg2;g.beginPath();g.arc(scr,glY,glR,0,7);g.fill();
    g.restore();
  }
}
const sAlpha=(s.it?.74+.26*Math.sin(tm*5):s.em?(pcSt=='off'?.35:.95):s.pl?Math.max(Math.min(1,.3+L*1.6),s.f?.8:.3):s.overWall?Math.min(1,.74+L*0.4):Math.min(1,.3+L*1.6)*(s.gh?.55+Math.random()*.3:1))*fogFade;
const rendered3D=s.kind3d?drawProp3D({g,W,H,RW,hor,VF,ox,oy,dx,dy,plx,ply,inv,zb,zs,L:Math.min(1,L*1.25),fog,fogA:fogA3,invF:invF3,alpha:sAlpha,wt,ty,tm,ch},s):false;
if(!rendered3D){
  g.globalAlpha=sAlpha;
  if(s.overWall){
    for(let ri=ri0;ri<=ri1;ri++){
      const maxBot=zb[ri]>ty?fy:Math.min(fy,wt[ri]+2);
      const visH=maxBot-top;
      if(visH>1){
        const x=ri*cw,u=Math.min(s.img.width-1,Math.max(0,((x-(scr-sw/2))/sw*s.img.width)|0));
        const srcH=s.img.height*(visH/sh);
        g.drawImage(s.img,u,0,1,srcH,x,top,colW,visH);
      }
    }
  }else{
    for(let ri=ri0;ri<=ri1;ri++)if(zb[ri]>ty){if(ty<zs[ri])zs[ri]=ty;const x=ri*cw,u=Math.min(s.img.width-1,Math.max(0,(x-(scr-sw/2))/sw*s.img.width|0));g.drawImage(s.img,s.fl?s.img.width-1-u:u,0,1,s.img.height,x,top,colW,sh)}
  }
}
if(s.pl&&!s.isHunter&&(s.headAcc||s.faceAcc)){const cp=Math.max(0,Math.min(RW-1,(scr/cw)|0));if(zb[cp]>ty){g.globalAlpha=Math.max(.55,Math.min(1,.35+L*1.6));drawAccessory2D(g,s.headAcc|0,s.faceAcc|0,scr,top+sh*.2,Math.max(2,sh*.085))}}
if(s.pl){g.globalAlpha=1;const cp=Math.max(0,Math.min(RW-1,(scr/cw)|0));if(zb[cp]>ty){g.fillStyle=s.isHunter?'#ff4757':(s.col||'#5af');g.fillRect(scr-8,top-3,16,2);g.textAlign='center';g.textBaseline='bottom';if(s.isDev){g.font='bold 5px monospace';g.fillStyle='#ff9f1a';g.fillText('DEVELOPER',scr,top-4);g.font='7px monospace';g.fillStyle=s.isHunter?'#ff8a96':'#fff';const av=getAvatar(s.avatar);g.fillText((s.isHunter?'👹 ':av?av.emoji+' ':'')+s.nm,scr,top-10)}else{g.font='7px monospace';g.fillStyle=s.isHunter?'#ff8a96':'#fff';const av=getAvatar(s.avatar);g.fillText((s.isHunter?'👹 ':av?av.emoji+' ':'')+s.nm,scr,top-4)}}}
if(s.mon&&!rendered3D){g.globalAlpha=1;const eyeCol=ch==4?'#fa2':ch==3?'#7f7':ch==2?'#cfe4ff':'#f22';const es=Math.max(1,sw*.07)*(!s.gh&&mon.st=='hunt'?1.7:1);for(const k of[-.09,.09]){const ex=scr+sw*k,eri=(ex/cw)|0;if(eri>=0&&eri<RW&&zb[eri]>ty){const ey=top+sh*(ch==2?.075:ch==3?.08:ch==4?.13:.15);g.save();g.globalCompositeOperation='lighter';const eg=g.createRadialGradient(ex,ey+es*0.5,0.2,ex,ey+es*0.5,es*2.6);eg.addColorStop(0,eyeCol);eg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=eg;g.beginPath();g.arc(ex,ey+es*0.5,es*2.6,0,7);g.fill();g.restore();g.fillStyle=eyeCol;g.fillRect(ex-es/2,ey,es,es)}}}}};
if((ch==3||ch==4)&&VAZ&&VAZ.on){
  const vd=(VAZ.x-ox)**2+(VAZ.y-oy)**2;
  drawSpriteList(S.filter(s=>s.d>vd));
  drawVaz3D(ox,oy,dx,dy,plx,ply,hor,VF,zb,zs,inv,RW,fog,lights,flShakeX);
  drawSpriteList(S.filter(s=>s.d<=vd));
}else{
  drawSpriteList(S);
}
g.globalAlpha=1;
drawBars(barD,barW,zs,hor,RW,fog,flShakeX);drawStones(stD,stW,zs,hor,stK,RW,fog,flShakeX);
if(ch==4)drawRain4(camInBay,hor);
drawAtmosphereParticles({g,W,H,ch,camInBay,hor,FL,tm,ltFl,hv,flShakeX,flShakeY});
if(hid&&hidBed)bedOv();if(hid&&!hidSofa&&lkT<=.55){const rj=lkT>0?(Math.random()-.5)*10:0;
if(ch==2){g.fillStyle='rgba(12,7,4,.62)';for(let x=rj;x<W;x+=8)g.fillRect(x,0,4,H);g.fillStyle='#140b06';g.fillRect(0,0,18,H);g.fillRect(W-18,0,18,H);g.fillRect(0,0,W,14);g.fillRect(0,H-24,W,24);g.fillStyle='rgba(120,74,38,.38)';g.fillRect(18,0,2,H);g.fillRect(W-20,0,2,H);g.fillStyle='rgba(255,215,150,.04)';g.fillRect(0,14,W,3)}
else{g.fillStyle='rgba(8,10,12,.55)';for(let x=rj;x<W;x+=7)g.fillRect(x,0,3,H);g.fillStyle='#0b1013';g.fillRect(0,0,16,H);g.fillRect(W-16,0,16,H);g.fillRect(0,0,W,12);g.fillRect(0,H-22,W,22);g.fillStyle='rgba(60,80,90,.35)';g.fillRect(16,0,2,H);g.fillRect(W-18,0,2,H);g.fillStyle='rgba(255,255,255,.04)';g.fillRect(0,12,W,3)}
g.fillStyle='rgba(0,0,0,'+(.06+.05*Math.sin(tm*2.2))+')';g.fillRect(0,0,W,H)}}
function post(){
const dm=mon?Math.hypot(px-mon.x,py-mon.y):99;
const danger=mon.st=='hunt'?1:Math.max(0,1-dm/7);
const vg=g.createRadialGradient(W/2,H/2,H*.22,W/2,H/2,W*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${(0.62+danger*0.14).toFixed(3)})`);g.fillStyle=vg;g.fillRect(0,0,W,H);
if(danger>0.05){
  const pulse=0.5+0.5*Math.sin(tm*(mon.st=='hunt'?12:6));
  const rv=g.createRadialGradient(W/2,H/2,H*.32,W/2,H/2,W*.65);
  rv.addColorStop(0,'rgba(130,0,0,0)');
  rv.addColorStop(1,`rgba(155,8,14,${((0.12+0.14*pulse)*danger).toFixed(3)})`);
  g.fillStyle=rv;g.fillRect(0,0,W,H);
}
if(ltFl>0){g.fillStyle='rgba(200,215,255,'+ltFl*.38+')';g.fillRect(0,0,W,H)}
if(ch==2&&mon.st=='hunt'&&dm<7&&Math.random()<.012)subF=2;
if(subF>0){subF--;g.globalAlpha=.5;face2(W/2,H*.5,H*1.5,.15,0);g.globalAlpha=1}
drawFilmGrain(g,W,H,mon.st=='hunt'?0.46:0.22);
cv.style.filter='contrast(1.07) saturate(1.05)';
cv.style.transform=shake>0&&SET.shake?`translate(${(Math.random()-.5)*shake*20}px,${(Math.random()-.5)*shake*20}px)`:''}
function bar(y,l,v,c){g.fillStyle='#999';g.fillText(l,6,y);g.fillStyle='#222';g.fillRect(56,y+1,48,6);g.fillStyle=c;g.fillRect(56,y+1,48*Math.max(0,Math.min(100,v))/100,6)}
function drawVazProgressBar(){
const totalParts=Math.max(1,NK()),foundParts=Math.min(totalParts,partsInstalled+partsCarried);
const instRatio=Math.min(1,partsInstalled/totalParts),foundRatio=Math.min(1,foundParts/totalParts);
const visRatio=Math.max(0,Math.min(1,vazBarVis));
const instVis=Math.min(visRatio,instRatio);
const px0=4,py0=4,pw=116,ph=51;
g.fillStyle='rgba(0,0,0,.62)';g.fillRect(px0,py0,pw,ph);
g.strokeStyle=partsInstalled>=totalParts?'rgba(74,222,128,.85)':foundParts>=totalParts?'rgba(253,212,68,.85)':'rgba(148,163,184,.35)';
g.lineWidth=1;g.strokeRect(px0+.5,py0+.5,pw-1,ph-1);
g.font='bold 7px monospace';g.textBaseline='top';g.textAlign='left';
g.fillStyle=partsInstalled>=totalParts?'#4ade80':foundParts>=totalParts?'#fde047':'#fd4';
const eqCarHdr=getCarSpec(PF.eqCar||'vaz2112');
g.fillText(eqCarHdr.name,px0+5,py0+3);
g.textAlign='right';
g.fillStyle=partsInstalled>=totalParts?'#4ade80':'#f8fafc';
g.fillText(foundParts+'/'+totalParts+(partsCarried>0?' (+'+partsCarried+')':''),px0+pw-5,py0+3);
g.textAlign='left';
const ox=px0+8,oy=py0+14;
const btHud=eqCarHdr.bodyType||'hatch';
const isVanH=btHud==='van';
const isWagonH=btHud==='wagon'||btHud==='wagon_classic'||btHud==='wagon_box'||btHud==='largus';
const isSuvH=btHud==='suv'||btHud==='crossover_niva';
const isSedanH=btHud==='kopeyka'||btHud==='box_sedan'||btHud==='chrome_sedan'||btHud==='round_sedan'||btHud==='zubilo'||btHud==='samara2_sedan'||btHud==='kalina'||btHud==='vesta'||btHud==='executive_sedan';
const isCompactH=btHud==='compact';
const traceVazSilhouette=()=>{
  g.beginPath();
  if(isVanH){
    g.moveTo(ox+5,oy+21);g.lineTo(ox+4,oy+5);g.lineTo(ox+10,oy+2);g.lineTo(ox+86,oy+2);g.lineTo(ox+94,oy+9);g.lineTo(ox+95,oy+21);
  }else if(isWagonH||isSuvH){
    g.moveTo(ox+4,oy+21);g.lineTo(ox+2.5,oy+15);g.lineTo(ox+5,oy+4);g.lineTo(ox+58,oy+3);g.lineTo(ox+74,oy+10);g.lineTo(ox+96,oy+12.5);g.lineTo(ox+98,oy+17.5);g.lineTo(ox+97,oy+21);
  }else if(isSedanH){
    g.moveTo(ox+3,oy+21);g.lineTo(ox+1.5,oy+15);g.lineTo(ox+14,oy+12.5);g.lineTo(ox+24,oy+3.2);g.lineTo(ox+56,oy+3.2);g.lineTo(ox+73,oy+10.5);g.lineTo(ox+95.5,oy+12.6);g.lineTo(ox+98.2,oy+17.5);g.lineTo(ox+97.5,oy+21);
  }else if(isCompactH){
    g.moveTo(ox+12,oy+21);g.lineTo(ox+11,oy+13);g.lineTo(ox+18,oy+3.5);g.lineTo(ox+54,oy+3.5);g.lineTo(ox+68,oy+10.5);g.lineTo(ox+87,oy+12.8);g.lineTo(ox+88.5,oy+18);g.lineTo(ox+88,oy+21);
  }else{
    g.moveTo(ox+3,oy+21);g.lineTo(ox+1.5,oy+19);g.lineTo(ox+1.5,oy+15);g.lineTo(ox+3.5,oy+13.5);g.lineTo(ox+6.5,oy+10.5);g.lineTo(ox+2.5,oy+8.2);g.lineTo(ox+2.5,oy+7);g.lineTo(ox+8.5,oy+7);g.lineTo(ox+14,oy+3.2);g.lineTo(ox+36,oy+2.5);g.lineTo(ox+56,oy+3.2);g.lineTo(ox+72.5,oy+10.2);g.lineTo(ox+95,oy+12.6);g.lineTo(ox+97.8,oy+14.5);g.lineTo(ox+98.5,oy+17.8);g.lineTo(ox+97.8,oy+21);
  }
  g.lineTo(ox+84.8,oy+21);
  g.arc(ox+79,oy+21.5,5.8,0,Math.PI,false);
  g.lineTo(ox+26.8,oy+21);
  g.arc(ox+21,oy+21.5,5.8,0,Math.PI,false);
  g.closePath();
};
g.save();
traceVazSilhouette();
g.fillStyle='rgba(20,25,32,.92)';
g.fill();
g.clip();
const fillW=100*visRatio,instW=100*instVis;
if(instW>0.2){
  const ig=g.createLinearGradient(ox,oy+2,ox,oy+27);
  ig.addColorStop(0,'#86efac');ig.addColorStop(.35,'#22c55e');ig.addColorStop(1,'#14532d');
  g.fillStyle=ig;g.fillRect(ox,oy,instW,28);
}
if(fillW>instW+0.2){
  const fg=g.createLinearGradient(ox,oy+2,ox,oy+27);
  fg.addColorStop(0,'#fef08a');fg.addColorStop(.35,'#f59e0b');fg.addColorStop(1,'#92400e');
  g.fillStyle=fg;g.fillRect(ox+instW,oy,fillW-instW,28);
}
if(visRatio>0.01&&visRatio<0.995){
  g.fillStyle='rgba(255,255,255,.75)';
  g.fillRect(ox+fillW-1,oy,1.5,28);
}
// Car silhouette windows
g.fillStyle='rgba(10,16,24,.78)';
if(isVanH){
  g.fillRect(ox+10,oy+5,22,6);g.fillRect(ox+36,oy+5,22,6);g.fillRect(ox+62,oy+5,25,6);
}else{
  const wxStart=isSedanH?23:isCompactH?19:isWagonH||isSuvH?8:14;
  g.beginPath();g.moveTo(ox+wxStart,oy+4.5);g.lineTo(ox+38,oy+4.2);g.lineTo(ox+38,oy+10.2);g.lineTo(ox+Math.max(7,wxStart-5),oy+10.2);g.closePath();g.fill();
  g.beginPath();g.moveTo(ox+40.5,oy+4.2);g.lineTo(ox+55,oy+4.5);g.lineTo(ox+68,oy+10.2);g.lineTo(ox+40.5,oy+10.2);g.closePath();g.fill();
}
if(visRatio>0.2){
  g.save();g.beginPath();g.rect(ox,oy,fillW,28);g.clip();
  g.fillStyle='rgba(125,211,252,.32)';
  if(isVanH){
    g.fillRect(ox+10,oy+5,22,6);g.fillRect(ox+36,oy+5,22,6);g.fillRect(ox+62,oy+5,25,6);
  }else{
    const wxStart=isSedanH?23:isCompactH?19:isWagonH||isSuvH?8:14;
    g.beginPath();g.moveTo(ox+wxStart,oy+4.5);g.lineTo(ox+38,oy+4.2);g.lineTo(ox+38,oy+10.2);g.lineTo(ox+Math.max(7,wxStart-5),oy+10.2);g.closePath();g.fill();
    g.beginPath();g.moveTo(ox+40.5,oy+4.2);g.lineTo(ox+55,oy+4.5);g.lineTo(ox+68,oy+10.2);g.lineTo(ox+40.5,oy+10.2);g.closePath();g.fill();
  }
  g.restore();
}
// Side molding & door seam
g.fillStyle='rgba(15,23,42,.55)';
g.fillRect(ox+5,oy+16,90,1.2);
g.fillRect(ox+50,oy+10.5,1,9.5);
// Tail light & headlight
g.fillStyle=foundParts>0?'#ef4444':'#451a1a';
g.fillRect(ox+1.5,oy+14,3.5,2.5);
g.fillStyle=foundParts>=totalParts?'#fef08a':'#334155';
g.fillRect(ox+94.5,oy+14,4,2.2);
// Wheels
for(const wx of[21,79]){
  const lit=fillW>=wx-2;
  g.fillStyle='#090d12';g.beginPath();g.arc(ox+wx,oy+21.5,5.6,0,7);g.fill();
  g.fillStyle=lit?'#cbd5e1':'#334155';g.beginPath();g.arc(ox+wx,oy+21.5,3,0,7);g.fill();
  g.fillStyle='#1e293b';g.beginPath();g.arc(ox+wx,oy+21.5,1.1,0,7);g.fill();
}
g.restore();
// Silhouette outline
traceVazSilhouette();
g.strokeStyle=partsInstalled>=totalParts?'#86efac':foundRatio>=1?'#fde047':'#94a3b8';
g.lineWidth=1;g.stroke();
// Part segments bar below silhouette
const gap=2,segW=(100-(totalParts-1)*gap)/totalParts;
for(let i=0;i<totalParts;i++){
  const sx=ox+i*(segW+gap),sy=py0+44;
  g.fillStyle=i<partsInstalled?'#22c55e':i<foundParts?'#fbbf24':'#1e293b';
  g.fillRect(sx,sy,segW,3);
}
if(foundParts>=totalParts){
  const beam=g.createLinearGradient(ox+98,oy+14,ox+108,oy+15);
  beam.addColorStop(0,'rgba(254,240,138,.55)');beam.addColorStop(1,'rgba(254,240,138,0)');
  g.fillStyle=beam;
  g.beginPath();g.moveTo(ox+98,oy+14);g.lineTo(ox+108,oy+10);g.lineTo(ox+108,oy+19);g.lineTo(ox+98,oy+16.5);g.closePath();g.fill();
}
}
function hud(){g.font='8px monospace';g.textBaseline='top';g.textAlign='left';g.fillStyle='rgba(0,0,0,.55)';g.fillRect(2,H-38,110,36);
bar(H-32,'ТЕЛЕФОН',bat,SKINS[PF.skin|0].c);bar(H-20,'СИЛЫ',sta,'#8c8');
const eqCarHud=getCarSpec(PF.eqCar||'vaz2112');
const coopPeerCnt=MP.on?(coop.getPeersList().length+1):1;
if(ch==4){drawVazProgressBar();if(MP.on){g.fillStyle='#8cf';g.font='8px monospace';g.fillText('КООП '+MP.code+' · игроков '+coopPeerCnt,6,58)}}else{g.fillStyle='#fd4';g.fillText(ch==2?(stg=='base'?'Найди отмычку: '+keys+'/1':stg=='main'?'Найди друга':stg=='post'?'Выберись из особняка':stg=='up'?'Второй этаж':''):'КЛЮЧИ '+keys+'/3',6,6);if(MP.on){g.fillStyle='#8cf';g.fillText('КООП '+MP.code+' · игроков '+coopPeerCnt,6,16)}}
if(MP.on&&coop.isHunterMe()){g.fillStyle='rgba(120,15,20,0.82)';g.fillRect(W/2-78,4,156,15);g.strokeStyle='#ff4757';g.strokeRect(W/2-78,4,156,15);g.fillStyle='#ffe4e6';g.textAlign='center';g.fillText(hunterTrapCd>0?('👹 ОХОТНИК · 🪤 '+Math.ceil(hunterTrapCd)+'с'):'👹 ОХОТНИК · [G] Ловушка',W/2,7)}
g.textAlign='center';
if(ghostHint){
  const fade=Math.min(1,ghostHint.t*1.6)*Math.min(1,(ghostHint.maxT-ghostHint.t)*1.2);
  const flk=0.45+0.55*Math.abs(Math.sin(tm*18+Math.cos(tm*7)*1.4));
  const ga=Math.max(0,Math.min(0.92,fade*flk));
  const gxOff=(Math.sin(tm*43)>0.82?(Math.random()-0.5)*3:0);
  g.save();
  g.font='italic bold 9.5px Georgia';
  g.textAlign='center';
  g.textBaseline='top';
  g.fillStyle=`rgba(56,189,248,${ga*0.38})`;
  g.fillText(ghostHint.text,W/2+gxOff-1,26);
  g.fillStyle=`rgba(244,63,94,${ga*0.28})`;
  g.fillText(ghostHint.text,W/2+gxOff+1,27);
  g.fillStyle=`rgba(224,242,254,${ga})`;
  g.fillText(ghostHint.text,W/2+gxOff,26.5);
  g.restore();
}
if(DIFF==='extreme'&&!mon.off){const al=auditoryAlert&&auditoryAlert.t>0;g.save();g.fillStyle=al?'rgba(145,12,18,0.86)':'rgba(18,6,8,0.72)';g.fillRect(W-132,4,126,15);g.strokeStyle=al?'#ff4757':'#6b1d24';g.strokeRect(W-132,4,126,15);g.fillStyle=al?'#fecaca':'#d49b9b';g.textAlign='right';g.font='bold 7px monospace';g.fillText(al?('⚡ УСЛЫШАЛ: '+auditoryAlert.tag.toUpperCase()):'👂 ЭКСТРИМ: СЛУХ АКТИВЕН',W-10,7);g.restore()}
if(msgT>0){g.fillStyle=`rgba(220,200,200,${Math.min(1,msgT)})`;g.font='10px Georgia';msg.split('|').forEach((l,i)=>g.fillText(l,W/2,H-50+i*12))}
g.font='9px monospace';g.fillStyle='#bbb';
const pr=srchT>0?'Обыскиваешь...':nearRadio?(RADIO_SPOT.on?'[E] Выключить радио · Piggy: Duocara':'[E] Включить радио · Piggy: Duocara'):nearVaz?(ch==4?(partsCarried>0?('[E] УСТАНОВИТЬ ДЕТАЛЬ НА '+eqCarHud.name):partsInstalled>=NK()?('[E] СЕСТЬ В '+eqCarHud.name+' И УЕХАТЬ'):(eqCarHud.name+': нужно деталей: '+partsInstalled+'/'+NK())):('[E] СЕСТЬ В '+eqCarHud.name)):(nearSp&&cage.on)?'[E] обыскать':nearMazeNote?'[E] прочитать страшную записку':nearPhoto?'[E] осмотреть фото':nearPC?'[E] компьютер':nearUsb?'[E] взять флешку':nearPaper||nearPap?'[E] листок':nearSt?(UPF?'[E] спуститься':'[E] подняться на 2 этаж'):nearD?(nearD.st=='locked'?'[E] отпереть дверь':nearD.st=='open'?'[E] запереть дверь':''):hid?'[E] выйти':nearL?'[E] спрятаться':nearE?(keys>=NK()?(ch==3?'[E] ОТКРЫТЬ ВОРОТА':ch==2&&stg=='base'?'[E] ВСКРЫТЬ ДВЕРЬ':'[E] ОТКРЫТЬ ВЫХОД'):(ch==3?'Ворота заперты. Нужно 3 ключа':ch==2&&stg=='base'?'Нужна отмычка':'Нужно 3 ключа')):'';if(pr)g.fillText(pr,W/2,H/2+30);if(srchT>0){g.fillStyle='#222';g.fillRect(W/2-30,H/2+40,60,6);g.fillStyle='#da8';g.fillRect(W/2-30,H/2+40,60*Math.min(1,srchT/1.3),6)}drawSurv();if(phoneUI&&!pcOpen)drawPhone();if(pcOpen){if(pcSt=='cams'&&CAMS.length)camScreen();else pcDraw()}}
const hv=i=>{const x=Math.sin(i*127.1)*43758.5;return x-Math.floor(x)};
function face(cx,cy,s,j,rot){g.save();g.translate(cx,cy);g.rotate(rot);g.scale(s/200,s/200);
g.strokeStyle='#050505';g.lineCap='round';
for(let i=0;i<22;i++){g.lineWidth=2+hv(i)*3;g.beginPath();const x0=-70+i*6.4;g.moveTo(x0,-100);g.bezierCurveTo(x0-30*(hv(i+9)-.3),-30,x0+20*(hv(i+3)-.5),60,x0*1.5+(hv(i+5)-.5)*30,170);g.stroke()}
const gr=g.createRadialGradient(0,-15,10,0,0,100);gr.addColorStop(0,'#ebe5d3');gr.addColorStop(.7,'#9d9684');gr.addColorStop(1,'#2a2822');g.fillStyle=gr;g.beginPath();g.ellipse(0,-5,64,98,0,0,7);g.fill();
g.fillStyle='rgba(20,15,10,.45)';g.beginPath();g.ellipse(-40,18,16,34,.15,0,7);g.ellipse(40,18,16,34,-.15,0,7);g.fill();
g.strokeStyle='rgba(90,10,10,.7)';g.lineWidth=.9;for(let i=0;i<14;i++){const sx=i<7?-26:26,sd=i<7?-1:1;g.beginPath();g.moveTo(sx,-30);g.quadraticCurveTo(sx+sd*(10+hv(i)*30),-10+hv(i+4)*20,sx+sd*(20+hv(i+1)*35),10+hv(i+8)*60);g.stroke()}
for(const sd of[-1,1]){g.save();g.translate(sd*27,-28);g.rotate(sd*.28);g.fillStyle='#000';g.beginPath();g.ellipse(0,0,18,24,0,0,7);g.fill();
const pg=g.createRadialGradient(0,2,0,0,2,14);pg.addColorStop(0,'rgba(255,40,30,.9)');pg.addColorStop(1,'rgba(255,0,0,0)');g.fillStyle=pg;g.beginPath();g.arc(0,2,14,0,7);g.fill();
g.fillStyle='#fff';g.fillRect(-1+(Math.random()-.5)*1.5,1,2,3);g.fillStyle='rgba(110,0,0,.85)';g.fillRect(-2,16,3,18+hv(sd+3)*30);g.restore()}
g.fillStyle='#1a1410';g.beginPath();g.ellipse(-4,10,2,5,0,0,7);g.ellipse(4,10,2,5,0,0,7);g.fill();
const mh=8+j*74,my=34;g.fillStyle='#0b0000';g.beginPath();g.moveTo(-52,my-6);g.quadraticCurveTo(0,my-16,52,my-6);g.quadraticCurveTo(46,my+mh*.9,0,my+mh);g.quadraticCurveTo(-46,my+mh*.9,-52,my-6);g.fill();
const mg=g.createRadialGradient(0,my+mh*.5,2,0,my+mh*.5,40);mg.addColorStop(0,'rgba(120,0,0,.8)');mg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=mg;g.fill();
g.fillStyle='#e6dfc4';for(let i=-10;i<=10;i++){const x=i*5,L=11+hv(i+20)*15,ty=my-11+Math.abs(x)*.12;g.beginPath();g.moveTo(x-2.4,ty);g.lineTo(x,ty+L);g.lineTo(x+2.4,ty);g.fill();
const by=my+mh*(1-(x/52)**2*.15)-1;g.beginPath();g.moveTo(x-2.4,by);g.lineTo(x,by-(10+hv(i+40)*14));g.lineTo(x+2.4,by);g.fill()}
g.fillStyle='rgba(155,0,0,.9)';for(let i=0;i<7;i++)g.fillRect(-34+i*11,my+mh*.65,2.2,24+hv(i+3)*26);
g.restore()}
function face2(cx,cy,s,j,rot,b){b=b||0;g.save();g.translate(cx,cy);g.rotate(rot);g.scale(s/200,s/200);
g.strokeStyle='#030303';g.lineCap='round';for(let i=0;i<26;i++){g.lineWidth=2+hv(i)*3;g.beginPath();const x0=-75+i*5.8;g.moveTo(x0,-100);g.bezierCurveTo(x0-30*(hv(i+9)-.3),-30,x0+20*(hv(i+3)-.5),60,x0*1.6+(hv(i+5)-.5)*30,175);g.stroke()}
const gr=g.createRadialGradient(0,-15,10,0,0,100);gr.addColorStop(0,'#f6f1e6');gr.addColorStop(.7,'#bdb5a2');gr.addColorStop(1,'#3a362e');g.fillStyle=gr;g.beginPath();g.ellipse(0,-2,58,92,0,0,7);g.fill();
g.strokeStyle='rgba(20,15,10,.85)';g.lineWidth=1.3;for(let i=0;i<11;i++){g.beginPath();let a=(hv(i)-.5)*70,b0=-85;g.moveTo(a,b0);for(let k=0;k<5;k++){a+=(hv(i*7+k)-.5)*22;b0+=14+hv(i+k)*14;g.lineTo(a,b0)}g.stroke()}
for(const sd of[-1,1]){g.fillStyle='#000';g.beginPath();g.ellipse(sd*26,-26,17,25,sd*.1,0,7);g.fill();g.fillRect(sd*26-3,-4,6,60+hv(sd+5)*40);
const pg=g.createRadialGradient(sd*26,-24,0,sd*26,-24,15);pg.addColorStop(0,'rgba(220,235,255,.95)');pg.addColorStop(1,'rgba(150,200,255,0)');g.fillStyle=pg;g.beginPath();g.arc(sd*26,-24,15,0,7);g.fill();g.fillStyle='#fff';g.fillRect(sd*26-1+(Math.random()-.5)*2,-25,2.5,3.5)}
if(b>0)for(const sd of[-1,1]){const R=14+b*14,ex=sd*26,ey=-26+b*4;g.fillStyle='#d9d3c8';g.beginPath();g.arc(ex,ey,R,0,7);g.fill();
const sg=g.createRadialGradient(ex,ey,R*.3,ex,ey,R);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(1,'rgba(170,0,0,.68)');g.fillStyle=sg;g.beginPath();g.arc(ex,ey,R,0,7);g.fill();
g.strokeStyle='rgba(175,8,8,.88)';g.lineWidth=1;for(let i=0;i<16;i++){const a=hv(i+sd*9)*6.28;g.beginPath();g.moveTo(ex+Math.cos(a)*R,ey+Math.sin(a)*R);g.lineTo(ex+Math.cos(a)*R*.42,ey+Math.sin(a)*R*.42+(hv(i)-.5)*6);g.stroke()}
g.fillStyle='#000';g.beginPath();g.arc(ex+(Math.random()-.5)*2,ey+(Math.random()-.5)*2,Math.max(1.5,R*.14),0,7);g.fill();
g.strokeStyle='rgba(130,0,0,.95)';g.lineWidth=2.6;g.beginPath();g.arc(ex,ey,R+1.5,0,7);g.stroke();g.fillStyle='rgba(140,0,0,.92)';g.fillRect(ex-3,ey+R-2,3.4,34*b)}
const mh=6+j*68;g.fillStyle='#050000';g.beginPath();g.moveTo(-52,26);g.quadraticCurveTo(0,26+mh*1.35,52,26);g.quadraticCurveTo(0,28+mh*.2,-52,26);g.fill();
if(j>.25){g.fillStyle='#e8e2d0';for(let i=-10;i<=10;i++){const x=i*4.8;g.fillRect(x-2,27+(1-(x/52)**2)*mh*.1,3.6,10+hv(i)*9);g.fillRect(x-1.8,24+mh*(1-(x/52)**2*.7),3.2,-(7+hv(i+5)*6))}}
g.strokeStyle='#000';g.lineWidth=1.5;for(let i=-24;i<=24;i++){const x=i*2,yy=26+(1-(x/50)**2)*mh*.65;g.beginPath();g.moveTo(x,yy-5.5);g.lineTo(x,yy+5.5);g.stroke()}if(ch==2){g.fillStyle='rgba(120,0,0,.35)';g.beginPath();g.ellipse(0,-2,58,92,0,0,7);g.fill();g.fillStyle='rgba(135,0,0,.86)';for(let i=0;i<11;i++)g.fillRect(-46+i*10+hv(i)*4,10+hv(i+3)*30,2.4+hv(i)*2,28+hv(i+7)*74)}
g.restore()}
function crack(){if(!ac)return;const t=ac.currentTime;NZ(.06,5000,.95,0,'highpass');NZ(.3,250,.95);TN(140,.25,.9,'square',35);setTimeout(()=>{NZ(.05,4500,.7,0,'highpass');TN(90,.2,.6,'square',30)},110);mst.gain.cancelScheduledValues(t);mst.gain.setValueAtTime(.12,t+.02);mst.gain.linearRampToValueAtTime(.9,t+1.8);setTimeout(()=>TN(3300,2.5,.06,'sine',3200),200)}
function scare2(t){g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);glt=.35;if(t<.11){cv.style.transform='';return}
let s,j=0,b=0;if(t<.38){const u=(t-.11)/.27;s=35+330*u*u*u}else{s=365+(t-.38)*65+(t>.95?Math.pow((t-.95)*4,3)*65:0);j=Math.min(1.4,(t-.38)/.42)*(.8+.2*Math.abs(Math.sin(t*42)));b=Math.min(1.4,(t-.38)/.55)}
let ang=0;if(t>1.3){const u=Math.min(1,(t-1.3)/.1);ang=u*u*1.3+(t>1.5?Math.sin(t*25)*.03:0)}
const sh=t<.38?0:1,k=t>1.3?.3:1,jx=sh?(Math.random()-.5)*30*k:0,jy=sh?(Math.random()-.5)*24*k:0;
g.save();g.translate(W/2,H/2);g.rotate(ang);g.translate(-W/2,-H/2);
if(sh&&Math.random()<0.45){g.globalAlpha=0.35;face2(W/2+jx-9,H*.52+jy+(sh?20:0),s,j,0,b);face2(W/2+jx+9,H*.52+jy+(sh?20:0),s,j,0,b);g.globalAlpha=1}
face2(W/2+jx,H*.52+jy+(sh?20:0),s,j,t>1.3?0:Math.sin(t*50)*.065*sh,b);if(t>.8&&t<1.3)hands(t);g.restore();if(t>.48&&t<1.5){const n=Math.min(80,Math.floor((t-.48)*80));for(let i=0;i<n;i++){g.fillStyle='rgba(140,0,0,'+(.4+hv(i*5)*.45)+')';g.beginPath();g.arc(hv(i*3)*W,hv(i*7+1)*H,3+hv(i)*14,0,7);g.fill()}}
if(t>.9&&t<1.3){g.fillStyle='rgba(0,0,0,'+(t-.9)*.6+')';g.fillRect(0,0,W,H*.12);g.fillRect(0,H*.88,W,H*.12)}
const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.85)');g.fillStyle=vg;g.fillRect(0,0,W,H);
const r=Math.random();if(t>.38&&t<1.3){if(r<.16){g.globalCompositeOperation='difference';g.fillStyle='#fff';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}else if(r<.32){g.fillStyle='rgba(200,0,0,.48)';g.fillRect(0,0,W,H)}}
if(t>1.3&&t<1.36){g.fillStyle='#fff';g.fillRect(0,0,W,H)}
if(t>1.36){g.fillStyle='rgba(130,0,0,'+Math.min(.5,(t-1.36)*.6)+')';g.fillRect(0,0,W,H)}
if(t>1.8){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.8)/.7);g.fillRect(0,0,W,H);g.globalAlpha=1}
for(let i=0;i<130;i++){g.fillStyle='rgba(255,255,255,'+Math.random()*.42+')';g.fillRect(rnd(W),rnd(H),1+rnd(3),1)}
cv.style.transform='translate('+(Math.random()-.5)*46*k+'px,'+(Math.random()-.5)*46*k+'px) scale('+(1+Math.random()*.08*k)+')'}
function hands(t){g.fillStyle='#cfc8b8';g.strokeStyle='#8f8878';const k=Math.min(1,(t-.3)*3);for(const sd of[-1,1]){const bx=W/2+sd*150,by=H+10,tx=W/2+sd*(95-k*25),ty=H*.62-k*40+Math.sin(t*30)*4;g.beginPath();g.moveTo(bx-sd*30,by);g.lineTo(bx+sd*12,by);g.lineTo(tx+sd*10,ty);g.lineTo(tx-sd*10,ty);g.closePath();g.fill();g.lineWidth=2;for(let f=0;f<5;f++){g.beginPath();g.moveTo(tx+(f-2)*5,ty);g.lineTo(tx+(f-2)*9-sd*6,ty-34-Math.abs(f-2)*4+Math.random()*3);g.stroke()}}}
function scare(t){g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);glt=.35;
if(t<.11){cv.style.transform='';return}
let s,j;if(t<.28){const u=(t-.11)/.17;s=35+330*u*u*u;j=0}else{s=365+(t-.28)*78+Math.sin(t*95)*8;j=.45+.65*Math.abs(Math.sin(t*36))}
const sh=t<.28?0:1,jx=sh?(Math.random()-.5)*30:0,jy=sh?(Math.random()-.5)*24:0;
if(sh&&Math.random()<0.42){g.globalAlpha=0.32;(ch==2?face2:face)(W/2+jx-10,H*.52+jy+(sh?20:0),s,j,0);(ch==2?face2:face)(W/2+jx+10,H*.52+jy+(sh?20:0),s,j,0);g.globalAlpha=1}
(ch==2?face2:face)(W/2+jx,H*.52+jy+(sh?20:0),s,j,Math.sin(t*50)*.065*sh);if(ch==2&&sh)hands(t);
const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.85)');g.fillStyle=vg;g.fillRect(0,0,W,H);
const r=Math.random();if(t>.26&&t<1.7){if(r<.16){g.globalCompositeOperation='difference';g.fillStyle='#fff';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}else if(r<.32){g.fillStyle='rgba(200,0,0,.48)';g.fillRect(0,0,W,H)}else if(r<.38){g.fillStyle='#fff';g.fillRect(0,0,W,H)}}
if(t>1.7){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.7)*3.3);g.fillRect(0,0,W,H);g.globalAlpha=1}
for(let i=0;i<130;i++){g.fillStyle='rgba(255,255,255,'+Math.random()*.42+')';g.fillRect(rnd(W),rnd(H),1+rnd(3),1)}
cv.style.transform='translate('+(Math.random()-.5)*46+'px,'+(Math.random()-.5)*46+'px) scale('+(1+Math.random()*.08)+')'}
function face4(cx,cy,s,j,rot){g.save();g.translate(cx,cy);g.rotate(rot);g.scale(s/200,s/200);
g.fillStyle='#1a1e25';g.beginPath();g.roundRect?g.roundRect(-72,-96,144,192,16):g.fillRect(-72,-96,144,192);g.fill();
g.strokeStyle='#4b5563';g.lineWidth=4;g.strokeRect(-72,-96,144,192);
// Jagged fracture in visor + hollow bloodshot skull socket on left
g.fillStyle='#07090b';g.fillRect(-58,-38,116,42);
g.fillStyle='#bfb199';g.beginPath();g.ellipse(-28,-17,24,22,0,0,7);g.fill();
g.fillStyle='#050000';g.beginPath();g.ellipse(-28,-17,15,18,0,0,7);g.fill();
for(const sd of[-1,1]){const pg=g.createRadialGradient(sd*28,-17,0,sd*28,-17,26);pg.addColorStop(0,'rgba(255,180,30,1)');pg.addColorStop(.5,'rgba(240,80,10,.72)');pg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=pg;g.beginPath();g.arc(sd*28,-17,26,0,7);g.fill();g.fillStyle='#fff';g.fillRect(sd*28-2.5,-19,5,5)}
// Ripped breathing grill showing jagged fangs beneath mask
const mh=14+j*34;
g.fillStyle='#060000';g.fillRect(-48,20,96,46+mh*0.4);
g.fillStyle='#dfd7bd';for(let i=-7;i<=7;i++){const x=i*6.4;g.beginPath();g.moveTo(x-3,20);g.lineTo(x,34+hv(i)*10);g.lineTo(x+3,20);g.fill();g.beginPath();g.moveTo(x-3,66+mh*0.4);g.lineTo(x,50-hv(i+9)*10+mh*0.4);g.lineTo(x+3,66+mh*0.4);g.fill()}
g.strokeStyle='#3f4652';g.lineWidth=3;for(let i=-4;i<=4;i+=2){g.beginPath();g.moveTo(i*10,20);g.lineTo(i*10+(hv(i)-.5)*16,66+mh*0.4);g.stroke()}
g.fillStyle='rgba(170,0,0,.9)';for(let i=0;i<10;i++)g.fillRect(-45+i*10+hv(i)*3,48+hv(i+3)*24,4.5,28+hv(i+7)*56);
g.restore()}
function scare4(t){g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);glt=.35;if(t<.11){cv.style.transform='';return}
let s,j=0;if(t<.33){const u=(t-.11)/.22;s=40+330*u*u*u}else{s=370+(t-.33)*70;j=Math.min(1.4,(t-.33)/.36)}
const sh=t<.33?0:1,jx=sh?(Math.random()-.5)*32:0,jy=sh?(Math.random()-.5)*26:0;
if(sh&&Math.random()<0.4){g.globalAlpha=0.35;face4(W/2+jx-11,H*.5+jy,s,j,0);face4(W/2+jx+11,H*.5+jy,s,j,0);g.globalAlpha=1}
face4(W/2+jx,H*.5+jy,s,j,Math.sin(t*48)*.075*sh);
if(t>.42){const sw=Math.min(1,(t-.42)*3.2);g.save();g.translate(W*.82-sw*125,H*.9-sw*75);g.rotate(-1.25+sw*1.9);g.fillStyle='#94a3b8';g.fillRect(-10,-120,20,140);g.fillStyle='#64748b';g.fillRect(-26,-150,52,34);g.fillStyle='rgba(180,0,0,0.92)';g.fillRect(-22,-150,42,20);g.restore()}
if(Math.random()<.32&&t>.33){g.fillStyle='rgba(255,160,30,0.42)';for(let i=0;i<24;i++)g.fillRect(rnd(W),rnd(H),2+rnd(6),1+rnd(2))}
if(t>.4&&t<1.7&&Math.random()<.16){g.fillStyle='rgba(210,15,15,0.42)';g.fillRect(0,0,W,H)}
const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.88)');g.fillStyle=vg;g.fillRect(0,0,W,H);
if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
cv.style.transform='translate('+(Math.random()-.5)*46+'px,'+(Math.random()-.5)*46+'px) scale('+(1+Math.random()*.09)+')'}
function scareMatrix(t){
  g.globalAlpha=1;g.fillStyle='#020804';g.fillRect(0,0,W,H);glt=.42;
  if(t<.1){cv.style.transform='';return}
  // Neon green storm lightning
  g.strokeStyle='rgba(34,255,102,0.75)';g.lineWidth=2.5;
  for(let b=0;b<3;b++){g.beginPath();let lx=W*(0.15+b*0.35)+(Math.random()-0.5)*30,ly=0;g.moveTo(lx,ly);for(let s=0;s<6;s++){lx+=(Math.random()-0.5)*36;ly+=H/6;g.lineTo(lx,ly)}g.stroke()}
  const u=t<.32?(t-.1)/.22:1,sc=40+340*u*u*u+(t>.32?(t-.32)*60:0);
  const jx=t>.25?(Math.random()-.5)*34:0,jy=t>.25?(Math.random()-.5)*26:0;
  g.save();g.translate(W/2+jx,H*.54+jy);g.scale(sc/200,sc/200);
  // Crimson scarf & obsidian torso with green matrix ribs
  g.fillStyle='#040705';g.fillRect(-75,26,150,110);
  const cg=g.createRadialGradient(0,68,4,0,68,54);cg.addColorStop(0,'#fef08a');cg.addColorStop(.5,'#22ff66');cg.addColorStop(1,'#041208');
  g.fillStyle=cg;g.fillRect(-44,40,88,68);
  g.fillStyle='#b91c1c';g.beginPath();g.moveTo(-78,24);g.lineTo(78,26);g.lineTo(62,56);g.lineTo(-10,66);g.lineTo(-70,48);g.closePath();g.fill();
  // Head & Domino Crown
  g.fillStyle='#030404';g.fillRect(-48,-52,96,82);
  g.fillStyle='#22ff66';g.fillRect(-56,-68,112,18);g.fillRect(-52,-112,20,46);g.fillRect(32,-112,20,46);g.fillRect(-16,-126,32,60);
  g.fillStyle='#020302';g.beginPath();g.arc(0,-108,5,0,7);g.arc(-7,-84,4.5,0,7);g.arc(7,-84,4.5,0,7);g.fill();
  // Blazing crimson 4-point star eye flare
  const sg=g.createRadialGradient(-14,-16,1,-14,-16,52);sg.addColorStop(0,'#ffffff');sg.addColorStop(.25,'#ff1a2c');sg.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=sg;g.beginPath();g.arc(-14,-16,52,0,7);g.fill();
  g.fillStyle='#ff1e30';g.beginPath();g.moveTo(-14,-44);g.lineTo(-7,-22);g.lineTo(36,-16);g.lineTo(-7,-10);g.lineTo(-14,14);g.lineTo(-21,-10);g.lineTo(-64,-16);g.lineTo(-21,-22);g.closePath();g.fill();
  g.restore();
  if(Math.random()<.24&&t>.32){g.fillStyle='rgba(34,255,102,0.34)';g.fillRect(0,rnd(H),W,6+rnd(18))}
  if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
  cv.style.transform='translate('+(Math.random()-.5)*48+'px,'+(Math.random()-.5)*48+'px) scale('+(1+Math.random()*.09)+')';
}
function scareFigura(t){
  g.globalAlpha=1;g.fillStyle='#080301';g.fillRect(0,0,W,H);glt=.38;
  if(t<.1){cv.style.transform='';return}
  const u=t<.3?(t-.1)/.2:1,sc=44+360*u*u*u+(t>.3?(t-.3)*75:0);
  const jx=t>.25?(Math.random()-.5)*36:0,jy=t>.25?(Math.random()-.5)*28:0;
  g.save();g.translate(W/2+jx,H*.5+jy);g.scale(sc/200,sc/200);
  // Meat-orange torso + protruding bone ribs + reaching clawed arms
  g.fillStyle='#7c2d12';g.fillRect(-62,36,124,110);
  g.fillStyle='#e7dec8';for(let i=0;i<4;i++){g.fillRect(-66,44+i*18,40,8);g.fillRect(26,44+i*18,40,8)}
  g.fillStyle='#1f100b';g.beginPath();g.arc(0,-16,74,0,7);g.fill();
  const mg=g.createRadialGradient(0,-16,6,0,-16,58);mg.addColorStop(0,'#fef08a');mg.addColorStop(.5,'#f97316');mg.addColorStop(1,'#431407');
  g.fillStyle=mg;g.beginPath();g.arc(0,-16,56,0,7);g.fill();
  g.fillStyle='#f5ecd8';
  for(let i=0;i<14;i++){const a=i*Math.PI*2/14;g.beginPath();g.moveTo(Math.cos(a)*56,-16+Math.sin(a)*56);g.lineTo(Math.cos(a+.12)*32,-16+Math.sin(a+.12)*32);g.lineTo(Math.cos(a-.12)*32,-16+Math.sin(a-.12)*32);g.fill()}
  g.restore();
  if(t>.35&&Math.random()<.22){g.fillStyle='rgba(234,88,12,0.32)';g.fillRect(0,0,W,H)}
  if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
  cv.style.transform='translate('+(Math.random()-.5)*46+'px,'+(Math.random()-.5)*46+'px) scale('+(1+Math.random()*.1)+')';
}
function scareGrannyDe(t){
  g.globalAlpha=1;g.fillStyle='#060506';g.fillRect(0,0,W,H);glt=.38;
  if(t<.1){cv.style.transform='';return}
  const u=t<.32?(t-.1)/.22:1,sc=44+355*u*u*u+(t>.32?(t-.32)*70:0);
  const jx=t>.25?(Math.random()-.5)*34:0,jy=t>.25?(Math.random()-.5)*26:0;
  g.save();g.translate(W/2+jx,H*.54+jy);g.scale(sc/200,sc/200);
  // Dark grey dress collar + charred neck
  g.fillStyle='#4b4e54';g.fillRect(-70,40,140,100);
  g.fillStyle='#141518';for(let i=0;i<3;i++){g.beginPath();g.arc(0,55+i*22,5,0,7);g.fill()}
  // Grey hair tufts + blackened head
  g.fillStyle='#9ca3af';g.beginPath();g.ellipse(-52,-20,18,32,.2,0,7);g.ellipse(52,-20,18,32,-.2,0,7);g.fill();
  g.fillStyle='#060607';g.beginPath();g.ellipse(0,-12,52,66,0,0,7);g.fill();
  // Glowing white horror eyes
  for(const sd of[-1,1]){
    const eg=g.createRadialGradient(sd*20,-24,1,sd*20,-24,22);eg.addColorStop(0,'#ffffff');eg.addColorStop(.5,'rgba(255,255,255,0.6)');eg.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=eg;g.beginPath();g.arc(sd*20,-24,22,0,7);g.fill();
  }
  // Open screaming mouth
  g.fillStyle='#020101';g.beginPath();g.ellipse(0,22,18,24,0,0,7);g.fill();
  g.strokeStyle='#7a5646';g.lineWidth=3.5;g.stroke();
  g.restore();
  // Swinging blood-stained baseball bat strike
  if(t>.36){
    const sw=Math.min(1,(t-.36)*3.6);
    g.save();g.translate(W*.82-sw*150,H*.86-sw*95);g.rotate(-1.35+sw*2.1);
    g.fillStyle='#784826';g.fillRect(-9,-145,18,160);
    g.fillStyle='#991b1b';g.fillRect(-10,-145,20,62);
    g.restore();
  }
  if(t>.4&&Math.random()<.24){g.fillStyle='rgba(175,15,15,0.38)';g.fillRect(0,0,W,H)}
  if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
  cv.style.transform='translate('+(Math.random()-.5)*46+'px,'+(Math.random()-.5)*46+'px) scale('+(1+Math.random()*.1)+')';
}
function scareTvMan(t){
  g.globalAlpha=1;g.fillStyle='#030406';g.fillRect(0,0,W,H);glt=.45;
  if(t<.1){cv.style.transform='';return}
  const u=t<.32?(t-.1)/.22:1,sc=44+350*u*u*u+(t>.32?(t-.32)*68:0);
  const jx=t>.25?(Math.random()-.5)*30:0,jy=t>.25?(Math.random()-.5)*24:0;
  g.save();g.translate(W/2+jx,H*.52+jy);g.scale(sc/200,sc/200);
  // Dark trench coat shoulders
  g.fillStyle='#14171c';g.fillRect(-78,44,156,100);
  // Bulky CRT TV bezel
  g.fillStyle='#111318';g.fillRect(-68,-64,136,106);
  g.strokeStyle='#374151';g.lineWidth=4;g.strokeRect(-68,-64,136,106);
  // Glowing pale static CRT glass screen
  const tg=g.createRadialGradient(0,-11,4,0,-11,66);tg.addColorStop(0,'#f8fafc');tg.addColorStop(.6,'#cbd5e1');tg.addColorStop(1,'#475569');
  g.fillStyle=tg;g.fillRect(-52,-50,104,78);
  g.fillStyle='rgba(15,23,42,0.45)';
  for(let y=-48;y<26;y+=6)g.fillRect(-52,y+Math.sin(t*40+y)*1.5,104,2);
  for(let i=0;i<24;i++){g.fillStyle='rgba(0,0,0,0.45)';g.fillRect(-50+rnd(95),-48+rnd(72),6+rnd(24),2+rnd(3))}
  g.restore();
  for(let i=0;i<150;i++){g.fillStyle='rgba(226,232,240,'+Math.random()*.45+')';g.fillRect(rnd(W),rnd(H),2+rnd(14),1+rnd(2))}
  if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
  cv.style.transform='translate('+(Math.random()-.5)*44+'px,'+(Math.random()-.5)*44+'px) scale('+(1+Math.random()*.08)+')';
}
function deadScr(dt){deadT+=dt;g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);
if(deadT<(ch>=2?2.7:2)){
  if(deadBySkin==='matrixman')scareMatrix(deadT);
  else if(deadBySkin==='figuraa')scareFigura(deadT);
  else if(deadBySkin==='grannyde')scareGrannyDe(deadT);
  else if(deadBySkin==='tvman')scareTvMan(deadT);
  else (ch==4?scare4:ch==3?scare3:ch==2?scare2:scare)(deadT);
}else{
cv.style.transform='';cv.style.filter='';g.fillStyle='#a11';g.font='28px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText(deadTxt,W/2,H/2-18);g.font='11px Georgia';g.fillStyle='#aaa';g.fillText('Выбери действие снизу',W/2,H/2+14);
const dUI=document.getElementById('dead_ui');if(dUI&&(dUI.style.display!=='flex'||dUI.dataset?.uiClosing==='1'))showAnimatedPanel(dUI,'flex','ui-dead-panel');
}}
let escapeSnapshot=null;
function formatElapsed(sec){const s=Math.max(0,Math.floor(sec||0));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
let _escCarCache={};
function getEsc3DCar(spec,col){
  const id=(spec&&spec.id)||'vaz2112';
  const c=col||(spec&&spec.defaultColor)||'#6f7882';
  const k=`${id}|${c}`;
  if(_escCarCache[k])return _escCarCache[k];
  const cv3=document.createElement('canvas');
  cv3.width=240;cv3.height=160;
  renderCarShowcase3D(cv3,spec,c,Math.PI*0.5,1.08,true,0.20,{transparent:true,hideLabel:true,groundShadow:true});
  if(Object.keys(_escCarCache).length>8)_escCarCache={};
  _escCarCache[k]=cv3;
  return cv3;
}
function drawEscapeRoadScene(t){
  cv.style.transform='';
  g.globalAlpha=1;
  // Night / stormy horizon gradient
  const sky=g.createLinearGradient(0,0,0,108);
  sky.addColorStop(0,ch==2?'#07050c':'#020205');
  sky.addColorStop(1,ch==2?'#1e1218':ch==4?'#0c121a':'#070b10');
  g.fillStyle=sky;g.fillRect(0,0,W,108);
  // Moon glow
  g.fillStyle='rgba(200,218,245,0.09)';g.beginPath();g.arc(325,36,24,0,7);g.fill();
  g.fillStyle='rgba(225,235,255,0.72)';g.beginPath();g.arc(325,36,7,0,7);g.fill();
  // Ground & asphalt road vanishing to horizon
  g.fillStyle='#050609';g.fillRect(0,106,W,H-106);
  const roadG=g.createLinearGradient(0,106,0,H);
  roadG.addColorStop(0,'#11141b');roadG.addColorStop(1,'#1b2028');
  g.fillStyle=roadG;
  g.beginPath();g.moveTo(W/2-18,106);g.lineTo(W/2+18,106);g.lineTo(W+30,H);g.lineTo(-30,H);g.closePath();g.fill();
  // Road side borders
  g.strokeStyle='rgba(140,160,180,0.26)';g.lineWidth=1.5;
  g.beginPath();g.moveTo(W/2-18,106);g.lineTo(-30,H);g.moveTo(W/2+18,106);g.lineTo(W+30,H);g.stroke();
  // Scrolling dashed center lane lines rushing past camera
  const scroll=(t*3.2)%1;
  for(let i=0;i<9;i++){
    const u0=(i+scroll)/9,u1=Math.min(1,u0+0.055);
    const z0=u0*u0,z1=u1*u1;
    const y0=106+z0*(H-106),y1=106+z1*(H-106);
    const w0=0.8+z0*3.5,w1=0.8+z1*3.5;
    g.fillStyle='rgba(225,230,210,'+(0.18+z0*0.45)+')';
    g.beginPath();g.moveTo(W/2-w0,y0);g.lineTo(W/2+w0,y0);g.lineTo(W/2+w1,y1);g.lineTo(W/2-w1,y1);g.closePath();g.fill();
  }
  // Passing roadside silhouettes (garages/trees/poles)
  for(let k=0;k<6;k++){
    const phase=((k/6)+(t*0.35))%1;
    const z=phase*phase*phase;
    const yy=106+z*95;
    const h=8+z*64;
    for(const sd of[-1,1]){
      const xx=W/2+sd*(24+z*185);
      g.fillStyle='rgba(8,10,14,'+(0.35+z*0.55)+')';
      if(ch==4){
        g.fillRect(xx-h*0.35,yy-h*0.7,h*0.7,h*0.7);
      }else{
        g.fillRect(xx-1.5,yy-h,3,h);
        g.beginPath();g.arc(xx,yy-h,h*0.28,0,7);g.fill();
      }
    }
  }
  // Departing 3D car matching player's equipped model & color
  const snap=escapeSnapshot||{carColor:'#6f7882',carSpec:getCarSpec(PF.eqCar||'vaz2112')};
  const carSpec=snap.carSpec||getCarSpec(PF.eqCar||'vaz2112');
  const col=snap.carColor||'#6f7882';
  const p=Math.min(1,t/7.5);
  const ease=1-Math.pow(1-p,1.65);
  const sc=1.08*(1-ease*0.86);
  const cy=146-ease*40+Math.sin(t*22)*(0.7*(1-ease*0.7));
  const cx=W/2+Math.sin(t*1.2)*(1.5*(1-ease));

  // Forward headlight cone lighting up road ahead
  if(sc>0.12){
    const beamA=Math.max(0.08,0.44*(1-ease*0.75));
    const bg=g.createLinearGradient(cx,cy-10*sc,cx,104);
    bg.addColorStop(0,'rgba(255,245,195,'+beamA+')');
    bg.addColorStop(1,'rgba(255,245,195,0)');
    g.fillStyle=bg;
    g.beginPath();
    g.moveTo(cx-24*sc,cy-12*sc);
    g.lineTo(cx+24*sc,cy-12*sc);
    g.lineTo(cx+58*sc,104);
    g.lineTo(cx-58*sc,104);
    g.closePath();g.fill();
  }

  // Animated exhaust smoke puffs drifting back from tailpipe
  if(t<7.8){
    for(let e=0;e<5;e++){
      const ep=((t*1.8+e*0.2)%1);
      const ex=cx-20*sc-(ep*10*sc);
      const ey=cy+15*sc+ep*14*sc;
      const er=(2.2+ep*6.5)*Math.max(0.25,sc);
      g.fillStyle='rgba(175,185,195,'+((1-ep)*0.24*(1-ease*0.6))+')';
      g.beginPath();g.arc(ex,ey,er,0,7);g.fill();
    }
  }

  // Wet red taillight reflection on asphalt
  g.save();
  g.translate(cx,cy);
  g.scale(sc,sc);
  const refG=g.createRadialGradient(0,22,2,0,24,52);
  refG.addColorStop(0,'rgba(255,30,40,'+(0.38*(1-ease*0.5))+')');
  refG.addColorStop(1,'rgba(255,0,0,0)');
  g.fillStyle=refG;g.fillRect(-54,12,108,26);
  const car3d=getEsc3DCar(carSpec,col);
  g.drawImage(car3d,-66,-48,132,88);
  for(const sx of[-30,30]){
    const tg=g.createRadialGradient(sx,0,1,sx,0,20);
    tg.addColorStop(0,'rgba(255,50,50,0.45)');
    tg.addColorStop(1,'rgba(255,0,0,0)');
    g.fillStyle=tg;g.beginPath();g.arc(sx,0,20,0,7);g.fill();
  }
  g.restore();

  // Rain streaks for Chapter 3 & 4
  if(ch==3||ch==4){
    g.strokeStyle='rgba(170,200,235,0.22)';g.lineWidth=1;
    for(let i=0;i<26;i++){
      const rx=((hv(i*7)*W+t*65)%W);
      const ry=((hv(i*13)*H+t*260)%H);
      g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-3,ry+9);g.stroke();
    }
  }
}
function winScr(dt){if(wT==0){document.exitPointerLock&&document.exitPointerLock();pstat('wins');pstat('coins',50);PF['w'+ch]=1;if(ch==2){PF.m2=1;PF.cemeteryUnlocked=1;try{localStorage.setItem('horror_cemetery_unlocked','1')}catch(e){}say('Глава 3 «Кладбище» открыта и сохранена!',6)}if(ch==3){PF.m3=1;PF.garagesUnlocked=1;PF.vazCh3=1;try{localStorage.setItem('horror_garages_unlocked','1')}catch(e){}say('Глава 4 «Гаражи» открыта и сохранена!',6)}if(ch==4){PF.vazCh4=1}if(!PF.best||tm<PF.best)PF.best=Math.floor(tm);pWrite();const xpGain=ch==1?300:ch==2?500:ch==3?800:1000;try{addXP(xpGain,'Побег из главы '+ch,{PF,pWrite,ac,TN})}catch(e){}try{trackDailyQuest('win',1,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}try{if(ch==1)unlockAchievement('escaped_maze',{PF,pWrite,ac,TN});else if(ch==2)unlockAchievement('escaped_mansion',{PF,pWrite,ac,TN});else if(ch==3)unlockAchievement('escaped_graveyard',{PF,pWrite,ac,TN});else if(ch==4){unlockAchievement('escaped_garages',{PF,pWrite,ac,TN});if(DIFF=='extreme')unlockAchievement('extreme_mechanic',{PF,pWrite,ac,TN})}if(PF.vazCh3&&PF.vazCh4)unlockAchievement('vaz_driver',{PF,pWrite,ac,TN});if(bat>50)unlockAchievement('battery_saver',{PF,pWrite,ac,TN});if(PF.w1&&PF.w2&&PF.w3&&PF.w4)unlockAchievement('chapter_master',{PF,pWrite,ac,TN});if(!runMadeNoise)unlockAchievement('silent_run',{PF,pWrite,ac,TN});if(tm<120)unlockAchievement('speedrunner',{PF,pWrite,ac,TN});if(DIFF=='hard'||DIFF=='extreme')unlockAchievement('extreme_survivor',{PF,pWrite,ac,TN});if(DIFF=='extreme')unlockAchievement('extreme_noise',{PF,pWrite,ac,TN});}catch(e){}
  const eqCarSpec=getCarSpec(PF.eqCar||'vaz2112');
  const eqColor=(PF.carColors&&PF.carColors[eqCarSpec.id])||eqCarSpec.defaultColor||'#6f7882';
  const foundParts=ch==4?partsInstalled:keys;
  const totalParts=NK();
  const timeSec=Math.max(0,Math.floor(tm));
  escapeSnapshot={chapter:ch,difficulty:DIFF,foundParts,totalParts,timeSec,xpGain,coinsGain:50,carSpec:eqCarSpec,carColor:eqColor};
  const escUI=document.getElementById('escape_ui');
  if(escUI){
    const chapNames={1:'Глава 1 · Лабиринт',2:'Глава 2 · Особняк',3:'Глава 3 · Кладбище',4:'Глава 4 · Гаражи'};
    const sub=document.getElementById('esc_sub');
    if(sub)sub.textContent=tr(chapNames[ch]||('Глава '+ch))+' · '+eqCarSpec.name;
    const statsEl=document.getElementById('esc_stats');
    if(statsEl){
      const partsLabel=ch==4?'🔧 Найдено деталей':'🗝 Собрано ключей';
      statsEl.innerHTML=`
        <div style="background:rgba(16,8,10,0.92);border:1px solid #4a181e;border-radius:6px;padding:8px 10px">
          <div style="font-size:11px;color:#9b8e84">${tr(partsLabel)}</div>
          <div style="font-size:16px;font-weight:bold;color:#e7dec8;margin-top:2px">${foundParts} / ${totalParts}</div>
        </div>
        <div style="background:rgba(16,8,10,0.92);border:1px solid #4a181e;border-radius:6px;padding:8px 10px">
          <div style="font-size:11px;color:#9b8e84">⏱ Затраченное время</div>
          <div style="font-size:16px;font-weight:bold;color:#d97706;margin-top:2px">${formatElapsed(timeSec)}</div>
        </div>
        <div style="background:rgba(16,8,10,0.92);border:1px solid #4a181e;border-radius:6px;padding:8px 10px">
          <div style="font-size:11px;color:#9b8e84">⚙ Сложность</div>
          <div style="font-size:14px;font-weight:bold;color:#fca5a5;margin-top:2px">${tr(diffLabel(DIFF,ch))}</div>
        </div>
        <div style="background:rgba(16,8,10,0.92);border:1px solid #4a181e;border-radius:6px;padding:8px 10px">
          <div style="font-size:11px;color:#9b8e84">🏆 Награда</div>
          <div style="font-size:14px;font-weight:bold;color:#d4af37;margin-top:2px">+50 🪙 · +${xpGain} XP</div>
        </div>
      `;
    }
    const nextBtn=document.getElementById('esc_btn_next');
    if(nextBtn){
      nextBtn.textContent=ch<4?tr('▶ СЛЕДУЮЩАЯ ГЛАВА'):tr('🔄 ИГРАТЬ СНОВА');
    }
    showAnimatedPanel(escUI,'flex','ui-modal-backdrop');
    trTree(escUI);
  }
}wT+=dt;drawEscapeRoadScene(wT)}
let iT=0,genDone=false,seen=0,ev={},lastStep=0,lastStepF=0,lastRain=0;
const once=(k,f)=>{if(!ev[k]){ev[k]=1;f()}};
function endIntro(){if(!genDone){gen();genDone=true}state='play';cv.style.filter='';cv.style.transform='';say(cage.on?'Где я?.. Это клетка! Нужен ключ.':'Где я?.. Нужно найти выход.',5)}
const fig=(x,ph,col,raise,eyes)=>{g.strokeStyle=col;g.fillStyle=col;g.lineWidth=3;g.beginPath();g.arc(x,118,5,0,7);g.fill();g.fillRect(x-4,124,8,24);const s=Math.sin(ph)*6;g.beginPath();g.moveTo(x-2,148);g.lineTo(x-2+s,165);g.moveTo(x+2,148);g.lineTo(x+2-s,165);g.stroke();
if(raise){g.lineWidth=3;g.beginPath();g.moveTo(x+3,128);g.lineTo(x+13,108);g.stroke();g.lineWidth=4;g.strokeStyle='#3a2414';g.beginPath();g.moveTo(x+13,108);g.lineTo(x+22,90);g.stroke()}
if(eyes){g.fillStyle='#e22';g.fillRect(x-3,117,2,2);g.fillRect(x+1,117,2,2)}};
function cap(s,a=1){g.globalAlpha=a;g.fillStyle='#ccc';g.font='italic 11px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText(s,W/2,H-16);g.globalAlpha=1}
function introScr(dt){iT+=dt;const t=iT;g.globalAlpha=1;cv.style.transform='';cv.style.filter='';
if(t<8.3){const off=Math.min(t,6.2)*34;
const sk=g.createLinearGradient(0,0,0,165);sk.addColorStop(0,'#04050b');sk.addColorStop(1,'#1c1522');g.fillStyle=sk;g.fillRect(0,0,W,H);
for(let k=0;k<12;k++){const bx=((k*52-off*.5)%624+624)%624-60,hh=50+((k*37)%5)*18;g.fillStyle='#08080d';g.fillRect(bx,165-hh,46,hh);for(let a=0;a<4;a++)for(let b=0;b<(hh/14|0);b++)if((k*7+a*3+b*5)%4==0){g.fillStyle='rgba(185,160,90,.5)';g.fillRect(bx+6+a*10,165-hh+6+b*14,5,7)}}
g.fillStyle='#0d0d12';g.fillRect(0,165,W,H-165);g.fillStyle='#1b1b22';g.fillRect(0,165,W,3);
for(let k=0;k<5;k++){const lx=((k*130-off)%650+650)%650-40;g.fillStyle='#000';g.fillRect(lx,95,2,70);g.fillRect(lx,95,10,2);const f=(k==2&&Math.random()<.4)?.2:1;const gr=g.createRadialGradient(lx+10,100,2,lx+10,120,70);gr.addColorStop(0,`rgba(255,220,140,${.5*f})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(lx-60,90,140,100)}
fig(150,t<6.2?t*8:0,'#3a3a48',false,false);
if(t>4)fig(Math.min(125,-30+(t-4)*(155/3.7)),t*8,'#000',t>6.9,true);
if(t>6.2){g.fillStyle='#fd4';g.font='bold 14px Georgia';g.textAlign='center';g.fillText('!',150,102)}
for(let i=0;i<80;i++){g.fillStyle='rgba(150,170,200,.25)';g.fillRect(rnd(W),rnd(H),1,6)}
if(t<6.2&&t-lastStep>.5){lastStep=t;NZ(.07,300,.12)}
if(t>4&&t<7.7&&t-lastStepF>.42){lastStepF=t;NZ(.09,220,.16,-.6)}
if(t-lastRain>1.4){lastRain=t;NZ(1.5,5000,.05,0,'highpass')}
once('hb',()=>{});if(t>6.2)once('turn',()=>heart(.5));
if(t>.5&&t<4)cap('Поздний вечер. Я почти дома.');else if(t>=4&&t<6.2)cap('…Опять эти шаги за спиной.');else if(t>=6.2&&t<7.7)cap('Кто здесь?..');
if(t>=7.7){once('hit',()=>{TN(70,.5,.9,'sine',30);NZ(.4,800,.9)});const a=1-(t-7.7)/.6;g.fillStyle='#fff';g.globalAlpha=Math.max(0,a);g.fillRect(0,0,W,H);g.globalAlpha=1;cv.style.transform=`translate(${rnd(16)-8}px,${rnd(16)-8}px)`}}
else if(t<10.5){g.fillStyle='#000';g.fillRect(0,0,W,H);once('ring',()=>TN(3200,3,.05,'sine',3000));if(t>9)once('h1',()=>heart(.3));if(t>9.9)once('h2',()=>heart(.35));if(t>8.8)cap('Голова... Холод. Пахнет сыростью.',Math.min(1,(t-8.8)))}
else{once('gen',()=>{gen();genDone=true;FL=0});render();post();const e=Math.min(1,(t-10.5)/3),open=e*(1-.35*Math.max(0,Math.sin((t-10.5)*4.5))*(t<13?1:0)),lh=H*.5*(1-open);g.fillStyle='#000';g.fillRect(0,0,W,lh);g.fillRect(0,H-lh,W,lh+1);cv.style.filter=`blur(${(1-open)*4}px)`;if(t>12)cap('Где я?..',Math.min(1,t-12));if(t>14){endIntro();return}}
if(t>1){g.font='8px monospace';g.fillStyle='#555';g.textAlign='right';g.textBaseline='middle';g.fillText('клик — пропустить',W-4,8)}}
const lo=document.createElement('canvas');lo.width=320;lo.height=180;const lg=lo.getContext('2d');let glt=0;
const p2=n=>String(Math.floor(n)).padStart(2,'0');
function osd(s,x,y,col,al){g.textAlign=al;g.fillStyle='#000';g.fillText(s,x+1,y+1);g.fillStyle=col;g.fillText(s,x,y)}
function camFx(){
const shakal=SET.camShakal!==undefined?SET.camShakal:1;
const rsc=cv.width/W;
const dm=mon?Math.hypot(px-mon.x,py-mon.y):99,pr=Math.max(0,1-dm/6)*(mon&&mon.seen?1:.4);
if(glt<=0&&Math.random()<.003+pr*.02)glt=.15+Math.random()*.35;glt-=.016;const gl=glt>0;
if(shakal>1){
const sw=shakal===3?140:240,sh=shakal===3?78:135;
if(lo.width!==sw||lo.height!==sh){lo.width=sw;lo.height=sh}
lg.drawImage(cv,0,0,cv.width,cv.height,0,0,sw,sh);g.globalAlpha=1;g.drawImage(lo,0,0,sw,sh,0,0,W,H);
}
cv.style.imageRendering=shakal>1?'pixelated':'auto';
if(shakal>0){
g.globalCompositeOperation='multiply';g.fillStyle=shakal===3?'#9fb89f':shakal===2?'#c4dccb':'#e6f0e8';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
}
const nt=gl?(shakal*2+3):(Math.random()<.05?1:0);for(let i=0;i<nt;i++){const y=rnd(H-20),h=3+rnd(gl?24:8),s=rnd(gl?50:12)-(gl?25:6);g.drawImage(cv,0,y*rsc,W*rsc,h*rsc,s,y,W,h)}
if(gl){for(let i=0;i<10;i++){const bx=rnd(W-30),by=rnd(H-20),bw=10+rnd(30),bh=6+rnd(14);g.drawImage(cv,bx*rsc,by*rsc,bw*rsc,bh*rsc,bx+rnd(11)-5,by+rnd(7)-3,bw,bh);g.fillStyle=`rgba(${rnd(255)},${rnd(255)},${rnd(255)},.12)`;g.fillRect(bx,by,bw,bh)}
g.globalCompositeOperation='difference';g.globalAlpha=.5;g.fillStyle='#fff';g.fillRect(0,rnd(H),W,2+rnd(8));g.globalCompositeOperation='source-over';g.globalAlpha=1}
if(shakal>0){
const scanAlpha=shakal===3?.22:(shakal===2?.14:.045);
const scanH=shakal===1?.5:1;
g.fillStyle=`rgba(0,0,0,${scanAlpha})`;for(let y=0;y<H;y+=2)g.fillRect(0,y,W,scanH);
const ry=(performance.now()/20)%(H+40)-20;g.fillStyle='rgba(255,255,255,.03)';g.fillRect(0,ry,W,30);
}
if(Math.random()<.25){g.fillStyle='rgba(255,255,255,.35)';g.fillRect(rnd(W-60),rnd(H),20+rnd(60),1)}
g.font='9px monospace';g.textBaseline='top';const T=state=='intro'?iT:tm;
if(Math.floor(performance.now()/600)%2){g.fillStyle='#e22';g.beginPath();g.arc(W/2-24,10,3,0,7);g.fill()}
osd('REC',W/2-17,6,'#eee','left');osd('▶ PLAY',W/2+26,6,'#eee','left');
osd('NOV 02 1998',W-8,H-25,'#ddd','right');osd('CAM 03  '+p2(T/3600)+':'+p2(T/60%60)+':'+p2(T%60),W-8,H-14,'#ddd','right');
g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=1;g.beginPath();const m=16,l=12;for(const[cx,cy,sx,sy]of[[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]]){g.moveTo(cx+sx*l,cy);g.lineTo(cx,cy);g.lineTo(cx,cy+sy*l)}g.stroke();g.textAlign='left'}
const plImg=mk(64,128,x=>{x.fillStyle='#d8d8d0';x.fillRect(22,38,20,50);x.beginPath();x.ellipse(32,24,11,13,0,0,7);x.fill();x.fillStyle='#555';x.fillRect(22,88,8,40);x.fillRect(34,88,8,40);x.fillStyle='#d8d8d0';x.fillRect(14,40,8,36);x.fillRect(42,40,8,36);x.fillStyle='#fe8';x.fillRect(44,72,12,6)});
function mpSprites(S){
  if(!MP.on)return;
  const peers=coop.getPeersList();
  for(const q of peers){
    if(q.x==null||!q.alive)continue;
    const isH=!!q.isHunter||(coop.currentRoom?.coopMode==='player'&&q.id===coop.currentRoom.hunterId);
    const peerYaw=q.a!=null?+q.a:Math.atan2(py-(+q.y||0),px-(+q.x||0));
    if(isH){
      const mSp=q.monsterSkin==='matrixman'?monImgMatrix:q.monsterSkin==='figuraa'?monImgFigura:q.monsterSkin==='grannyde'?monImgGrannyDe:q.monsterSkin==='tvman'?monImgTvMan:q.monsterSkin==='garages'?monImg5:q.monsterSkin==='graveyard'?monImg4:q.monsterSkin==='mansion'?monImg3:monImg;
      const hKind=q.monsterSkin==='matrixman'?'matrixman':q.monsterSkin==='figuraa'?'figuraa':q.monsterSkin==='grannyde'?'grannyde':q.monsterSkin==='tvman'?'tvman':q.monsterSkin==='garages'?'monster5':q.monsterSkin==='graveyard'?'monster4':q.monsterSkin==='mansion'?'monster3':'monster1';
      S.push({x:+q.x||0,y:+q.y||0,img:mSp,sc:q.monsterSkin==='figuraa'?1.24:q.monsterSkin==='tvman'?1.14:1.08,mon:1,pl:1,isHunter:true,kind3d:hKind,hunting:true,faceYaw:peerYaw,isDev:!!q.isDev,col:'#ff4757',nm:String(q.name||'Монстр').slice(0,10),avatar:q.avatar||'demon',frame:q.frame||'frame_classic'});
      continue;
    }
    const fr=getFrame(q.frame||'frame_classic');
    const jHex=SKINS[q.skin|0]?.c||'#d8d8d0';
    S.push({x:+q.x||0,y:+q.y||0,img:(skinImgs[q.skin|0]||skinImgs[0]),sc:.95,pl:1,kind3d:'player3d',jacketHex:jHex,faceYaw:peerYaw,col:fr.color||'#5af',nm:String(q.name||'Игрок').slice(0,10),avatar:q.avatar||'survivor',frame:q.frame||'frame_classic',f:q.flash,headAcc:q.headAcc|0,faceAcc:q.faceAcc|0,isDev:!!q.isDev});
  }
}
function respawn(){const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');if(MP.on&&coop.isHunterMe()){px=ch==4?12.5:1.5;py=ch==4?15.5:1.5;}else{px=ch==4?12.5:1.5;py=ch==4?2.5:1.5;}pa=ch==4?Math.PI/2:(map[1][2]?Math.PI/2:0);hid=false;srchT=0;sta=100;bat=Math.max(bat,50);flash=true;flCurrent=1.0;flTarget=1.0;flFlickerTimer=0;flFlickerVal=1.0;flSoundTimer=0;MP.dead=0;MP.win=0;MP.init=0;deadBySkin='';MP.deadBySkin='';state='play';cv.style.transform='';try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}say('Ты вернулся. Держись подальше от опасности.',4)}
function placeHunterTrap(){
  if(!MP.on||!coop.isHunterMe()||state!=='play')return;
  if(hunterTrapCd>0){say('Ловушка перезаряжается: '+Math.ceil(hunterTrapCd)+'с',1.5);return;}
  hunterTrapCd=4.0;
  try{coop.sendPlaceTrap(px,py)}catch(e){}
  TN(260,.14,.25,'square',110);NZ(.1,1400,.2);
  say('Ловушка установлена!',2);
}
function mpTick(dt){
  if(!MP.on||!coop.currentRoom)return;
  MP.tp+=dt;
  if(MP.tp>.05){
    MP.tp=0;
    coop.sendPlayerUpdate(px,py,pa,crouch||hid,(flash&&bat>0)||FL>0,state=='play',noise);
  }
  const isHost=coop.isHost;
  const peers=coop.getPeersList();
  const isPM=coop.currentRoom.coopMode==='player';
  if(isPM){
    mon.off=1;mon.vis=0;mon.st='patrol';mon.x=-99;mon.y=-99;
    if(hunterTrapCd>0)hunterTrapCd=Math.max(0,hunterTrapCd-dt);
    if(coop.isHunterMe()&&state==='play'){
      for(const q of peers){
        if(!q.alive||q.isHunter||q.x==null)continue;
        if((hunterCatchCd[q.id]||0)>0){hunterCatchCd[q.id]-=dt;continue;}
        if(Math.hypot(q.x-px,q.y-py)<0.85){
          hunterCatchCd[q.id]=2.5;
          coop.sendPlayerCaught(q.id);
          TN(880,.2,.3,'sawtooth',220);
          say('Вы поймали '+(q.name||'игрока')+'!',3);
        }
      }
    }
    return;
  }
  if(isHost){
    const C=state==='play'?[{x:px,y:py,me:1,h:hid,f:FL>0,z:noise}]:[];
    for(const q of peers){if(q.x!=null&&q.alive)C.push({x:+q.x||0,y:+q.y||0,h:!!q.crouch,f:!!q.flash,z:q.noise||0})}
    if(C.length&&!mon.off){
      let t=C[0],bd=1e9;
      for(const c of C){const d=Math.hypot(c.x-mon.x,c.y-mon.y);if(d<bd){bd=d;t=c}}
      if(t.me)monUpd(dt);
      else{const sv=[px,py,hid,FL,noise,shake,msg,msgT];px=t.x;py=t.y;hid=t.h;FL=t.f?1:0;noise=t.z;MP.swap=true;monUpd(dt);MP.swap=false;[px,py,hid,FL,noise,shake,msg,msgT]=sv}
    }
    MP.l=(MP.l||0)+dt;
    if(MP.l>.08){
      MP.l=0;
      coop.sendMonsterState({x:mon.x,y:mon.y,st:mon.st,sp:1,tx:mon.tx,ty:mon.ty,on:!mon.off},{x:mon.x,y:mon.y,st:mon.st,sp:lurk,on:!!lurk});
    }
  }else if(MP.m){
    const tx=+MP.m.x,ty=+MP.m.y;
    if(Number.isFinite(tx)&&Number.isFinite(ty)){
      if(Math.hypot(tx-mon.x,ty-mon.y)>4){mon.x=tx;mon.y=ty}
      else{const k=Math.min(1,dt*14);mon.x+=(tx-mon.x)*k;mon.y+=(ty-mon.y)*k}
    }
    mon.st=MP.m.st||'patrol';
    mon.off=MP.m.on===false?1:0;
  }
  if(!mon.off){
    const dm=Math.hypot(px-mon.x,py-mon.y);
    mon.seen=!hid&&dm<(FL>0?13:7)&&los(mon.x,mon.y,px,py);
    if(state=='play'){
      if(hid&&mon.lk&&dm<1.9)lkKill();
      if(!hid&&dm<.6)die();
    }
  }
}
const isTouchDevice = () => ((window.matchMedia && window.matchMedia('(pointer:coarse) and (hover:none)').matches) || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

function mobFs(){
  if(!isTouchDevice()) return;
  try{
    if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
    if(screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(()=>{});
  }catch(e){}
}

function pressKey(code){
  kd[code] = 1;
  window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
  setTimeout(() => {
    kd[code] = 0;
    window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
  }, 90);
}

let updateMobileActionBtn = () => {};

(()=>{
  const tc = document.createElement('div');
  tc.id = 'tc';
  tc.style.cssText = 'position:fixed;inset:0;display:none;pointer-events:none;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;z-index:25';

  tc.innerHTML = `
    <!-- Camera Look Zone (Right 55%) -->
    <div id="lz" style="position:absolute;left:45%;top:0;width:55%;height:100%;pointer-events:auto;touch-action:none"></div>

    <!-- Movement Joystick Zone (Left 45%) -->
    <div id="jz" style="position:absolute;left:0;bottom:0;width:45%;height:75%;pointer-events:auto;touch-action:none">
      <div id="jb" style="position:absolute;left:28px;bottom:28px;width:120px;height:120px;border-radius:50%;border:2px solid rgba(185,28,28,0.4);background:radial-gradient(circle, rgba(90,8,12,0.25) 0%, rgba(12,4,6,0.55) 100%);box-shadow:0 0 15px rgba(0,0,0,0.7);touch-action:none;pointer-events:none;box-sizing:border-box">
        <div id="jk" style="position:absolute;left:36px;top:36px;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle, #b91c1c 0%, #5c0a0e 100%);border:2px solid #dc2626;box-shadow:0 0 14px rgba(185,28,28,0.55);box-sizing:border-box;pointer-events:none"></div>
      </div>
    </div>

    <!-- Action Button (E) -->
    <div id="mb_action" style="position:absolute;right:calc(18px + env(safe-area-inset-right, 0px));bottom:calc(88px + env(safe-area-inset-bottom, 0px));width:66px;height:66px;border-radius:50%;background:rgba(36,8,10,0.88);border:2px solid #991b1b;color:#e7dec8;font-family:Georgia,serif;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 0 16px rgba(153,27,27,0.45);cursor:pointer;z-index:28;transition:transform 0.1s, border-color 0.15s, box-shadow 0.15s">
      <span style="font-size:16px;font-weight:bold;line-height:1">E</span>
      <span id="btn_action_lbl" style="font-size:9.5px;color:#e7dec8;letter-spacing:0.04em;margin-top:2px">ДЕЙСТВИЕ</span>
    </div>

    <!-- Phone Button (F) -->
    <div id="mb_phone" style="position:absolute;right:calc(94px + env(safe-area-inset-right, 0px));bottom:calc(88px + env(safe-area-inset-bottom, 0px));width:52px;height:52px;border-radius:50%;background:rgba(16,18,22,0.88);border:1.5px solid #64748b;color:#e7dec8;font-size:22px;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 0 12px rgba(0,0,0,0.65);cursor:pointer;z-index:28">
      📱
    </div>

    <!-- Sprint Button (Shift) -->
    <div id="mb_sprint" style="position:absolute;right:calc(18px + env(safe-area-inset-right, 0px));bottom:calc(18px + env(safe-area-inset-bottom, 0px));width:54px;height:54px;border-radius:50%;background:rgba(32,9,11,0.88);border:1.5px solid #991b1b;color:#e7dec8;font-family:Georgia,serif;font-size:12px;font-weight:bold;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;cursor:pointer;z-index:28">
      🏃 БЕГ
    </div>

    <!-- Crouch / Sneak Toggle Button (C) -->
    <div id="mb_crouch" style="position:absolute;right:calc(84px + env(safe-area-inset-right, 0px));bottom:calc(18px + env(safe-area-inset-bottom, 0px));width:54px;height:54px;border-radius:50%;background:rgba(18,24,14,0.88);border:1.5px solid #65a30d;color:#d9f99d;font-family:Georgia,serif;font-size:11.5px;font-weight:bold;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;cursor:pointer;z-index:28">
      🤫 ТИХО
    </div>

    <!-- Jump Button (Space) -->
    <div id="mb_jump" style="position:absolute;right:calc(150px + env(safe-area-inset-right, 0px));bottom:calc(18px + env(safe-area-inset-bottom, 0px));width:44px;height:44px;border-radius:50%;background:rgba(20,16,16,0.86);border:1.5px solid #574945;color:#d6ccb8;font-family:Georgia,serif;font-size:18px;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;cursor:pointer;z-index:28">
      ⤒
    </div>

    <!-- Trap Button for Player-Monster Mode (G) -->
    <div id="mb_trap" style="position:absolute;right:calc(156px + env(safe-area-inset-right, 0px));bottom:calc(88px + env(safe-area-inset-bottom, 0px));width:56px;height:56px;border-radius:50%;background:rgba(48,12,8,0.92);border:2px solid #b45309;color:#fde68a;font-family:Georgia,serif;font-size:10px;font-weight:bold;display:none;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;cursor:pointer;z-index:28;box-shadow:0 0 14px rgba(180,83,9,0.5)">
      <span style="font-size:18px;line-height:1">🪤</span>
      <span style="margin-top:2px">ЛОВУШКА</span>
    </div>
  `;

  document.body.appendChild(tc);

  const jz = tc.querySelector('#jz'), jb = tc.querySelector('#jb'), jk = tc.querySelector('#jk');
  const lz = tc.querySelector('#lz');
  const mbAct = tc.querySelector('#mb_action'), mbPh = tc.querySelector('#mb_phone');
  const mbSp = tc.querySelector('#mb_sprint'), mbCr = tc.querySelector('#mb_crouch'), mbJm = tc.querySelector('#mb_jump'), mbTrap = tc.querySelector('#mb_trap');

  let jid = null, ox = 0, oy = 0;
  let lid = null, lx = 0, ly = 0, startLx = 0, startLy = 0, startLt = 0;
  let crouchActive = false;

  const setK = (dx, dy) => {
    kd.KeyW = dy < -10 ? 1 : 0;
    kd.KeyS = dy > 10 ? 1 : 0;
    kd.KeyA = dx < -10 ? 1 : 0;
    kd.KeyD = dx > 10 ? 1 : 0;
  };

  const applyJoySize = () => {
    const size = Math.max(70, Math.min(280, SET.joySize || 120));
    if (!jb || !jk) return;
    const knobSize = Math.round(size * 0.4);
    const knobOffset = Math.round((size - knobSize) / 2);
    jb.style.width = size + 'px';
    jb.style.height = size + 'px';
    jk.style.width = knobSize + 'px';
    jk.style.height = knobSize + 'px';
    jk.style.left = knobOffset + 'px';
    jk.style.top = knobOffset + 'px';
  };
  window.__applyJoySize = applyJoySize;
  setTimeout(applyJoySize, 50);

  jz.onpointerdown = e => {
    if (jid !== null) return;
    e.preventDefault();
    jid = e.pointerId;
    try { jz.setPointerCapture(jid); } catch (err) {}
    const r = jz.getBoundingClientRect();
    ox = e.clientX;
    oy = e.clientY;
    const size = Math.max(70, Math.min(280, SET.joySize || 120));
    const half = size / 2;
    jb.style.bottom = 'auto';
    jb.style.left = Math.max(8, Math.min(r.width - size - 8, ox - r.left - half)) + 'px';
    jb.style.top = Math.max(8, Math.min(r.height - size - 8, oy - r.top - half)) + 'px';
    jk.style.transform = '';
  };

  jz.onpointermove = e => {
    if (e.pointerId !== jid) return;
    e.preventDefault();
    let dx = e.clientX - ox, dy = e.clientY - oy;
    const l = Math.hypot(dx, dy);
    const size = Math.max(70, Math.min(280, SET.joySize || 120));
    const maxR = size * 0.4;
    let kx = dx, ky = dy;
    if (l > maxR) {
      kx = (dx / l) * maxR;
      ky = (dy / l) * maxR;
    }
    jk.style.transform = 'translate(' + kx + 'px,' + ky + 'px)';
    setK(dx, dy);
    if (!crouchActive) {
      kd.ShiftLeft = l > (maxR * 0.8) ? 1 : 0;
    }
  };

  const ju = e => {
    if (jid !== null && e && e.pointerId !== undefined && e.pointerId !== jid) return;
    jid = null;
    setK(0, 0);
    kd.ShiftLeft = 0;
    if (jk) jk.style.transform = '';
    if (jb) {
      jb.style.top = 'auto';
      jb.style.left = '28px';
      jb.style.bottom = '28px';
    }
  };
  jz.onpointerup = ju;
  jz.onpointercancel = ju;

  window.addEventListener('blur', () => {
    for (const k in kd) kd[k] = 0;
    ju();
    lid = null;
  });
  window.addEventListener('pointerup', e => {
    if (jid !== null && e.pointerId === jid) ju(e);
  });
  window.addEventListener('pointercancel', e => {
    if (jid !== null && e.pointerId === jid) ju(e);
  });

  // Mobile PC Exit Button
  const mobPcClose = document.createElement('div');
  mobPcClose.id = 'mob_pc_close';
  mobPcClose.style.cssText = 'position:fixed;top:calc(12px + env(safe-area-inset-top, 0px));right:calc(12px + env(safe-area-inset-right, 0px));padding:10px 18px;background:rgba(180,20,30,0.92);color:#fff;font-family:Georgia,serif;font-size:14px;font-weight:bold;border:2px solid #ff6b81;border-radius:8px;box-shadow:0 0 16px rgba(255,0,0,0.6);z-index:9000;display:none;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;touch-action:none';
  mobPcClose.innerHTML = '✕ ВЫЙТИ';
  mobPcClose.onpointerdown = e => {
    e.preventDefault();
    e.stopPropagation();
    closePC();
  };
  document.body.appendChild(mobPcClose);

  const handlePhoneTap = (clientX, clientY) => {
    if (!phoneUI) return false;
    const r = cv.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H);
    const cx = (clientX - r.left - (r.width - W * s) / 2) / s;
    const cy = (clientY - r.top - (r.height - H * s) / 2) / s;
    const px0 = W - 122, py0 = H - 206, pw = 112, ph = 196;
    if (cx >= px0 - 10 && cx <= px0 + pw + 10 && cy >= py0 - 10 && cy <= py0 + ph + 10) {
      const sx = px0 + 9, sy = py0 + 26, sw = pw - 18, sh = ph - 72;
      if (Math.hypot(cx - (px0 + pw / 2), cy - (py0 + ph - 20)) <= 15) {
        if (phApp != 'home') phApp = 'home'; else phoneUI = false;
        TN(660, .08, .1);
        return true;
      }
      if (phApp == 'home') {
        const A = [['Фонарик', flash ? '#ffd54a' : '#555'], ['Стиль', '#8b1e25'], ['Закрыть', '#c44']];
        if (PF.radar) A.push(['Радар', '#2a9a55']);
        for (let i = 0; i < A.length; i++) {
          const bx = sx + 8 + (i % 2) * 46, by = sy + 18 + Math.floor(i / 2) * 44;
          if (cx >= bx && cx <= bx + 36 && cy >= by && cy <= by + 32) {
            phoneKey('Digit' + (i + 1));
            return true;
          }
        }
      }
      return true;
    }
    return false;
  };

  lz.onpointerdown = e => {
    if (lid !== null) return;
    if (phoneUI && handlePhoneTap(e.clientX, e.clientY)) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    lid = e.pointerId;
    lz.setPointerCapture(lid);
    lx = e.clientX;
    ly = e.clientY;
    startLx = e.clientX;
    startLy = e.clientY;
    startLt = performance.now();
  };

  lz.onpointermove = e => {
    if (e.pointerId !== lid) return;
    e.preventDefault();
    if (state == 'play') {
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      pa += dx * 0.0055 * SET.tsens * (SET.inv ? -1 : 1);
      PIT = Math.max(-75, Math.min(75, PIT - dy * 0.22 * SET.tsens));
    }
    lx = e.clientX;
    ly = e.clientY;
  };

  const lu = e => {
    if (e.pointerId !== lid) return;
    lid = null;
    const dist = Math.hypot(e.clientX - startLx, e.clientY - startLy);
    const time = performance.now() - startLt;
    if (dist < 22 && time < 450) {
      if (phoneUI) {
        if (!handlePhoneTap(e.clientX, e.clientY)) {
          // Tap outside phone closes it
          phoneUI = false;
          TN(660, .08, .1);
        }
        return;
      }
      if (pcOpen) {
        pcClick(e);
        return;
      }
      if (nearL || nearE || nearD || nearSp || nearPC || nearUsb || nearPap || nearPaper || nearSt || nearVaz || nearRadio || hid) {
        pressKey('KeyE');
      }
    }
  };
  lz.onpointerup = lu;
  lz.onpointercancel = lu;

  // Action Button
  mbAct.onpointerdown = e => {
    e.preventDefault();
    mbAct.style.transform = 'scale(0.92)';
    pressKey('KeyE');
  };
  const actRelease = () => { mbAct.style.transform = 'scale(1)'; };
  mbAct.onpointerup = actRelease;
  mbAct.onpointercancel = actRelease;

  // Phone Button
  mbPh.onpointerdown = e => {
    e.preventDefault();
    mbPh.style.transform = 'scale(0.92)';
    togglePhone();
  };
  const phRelease = () => { mbPh.style.transform = 'scale(1)'; };
  mbPh.onpointerup = phRelease;
  mbPh.onpointercancel = phRelease;

  // Sprint Button (Hold)
  mbSp.onpointerdown = e => {
    e.preventDefault();
    mbSp.setPointerCapture(e.pointerId);
    mbSp.style.background = '#8b0000';
    mbSp.style.transform = 'scale(0.92)';
    kd.ShiftRight = 1;
  };
  const spRelease = () => {
    mbSp.style.background = 'rgba(40,12,16,0.85)';
    mbSp.style.transform = 'scale(1)';
    kd.ShiftRight = 0;
  };
  mbSp.onpointerup = spRelease;
  mbSp.onpointercancel = spRelease;

  // Crouch Button (Sneak toggle)
  mbCr.onpointerdown = e => {
    e.preventDefault();
    crouchActive = !crouchActive;
    kd.KeyC = crouchActive ? 1 : 0;
    if (crouchActive) {
      mbCr.style.background = '#14532d';
      mbCr.style.borderColor = '#22c55e';
      mbCr.style.boxShadow = '0 0 14px rgba(46,213,115,0.7)';
      mbCr.style.transform = 'scale(0.95)';
    } else {
      mbCr.style.background = 'rgba(16,36,22,0.85)';
      mbCr.style.borderColor = '#2ed573';
      mbCr.style.boxShadow = 'none';
      mbCr.style.transform = 'scale(1)';
    }
  };

  // Jump Button
  mbJm.onpointerdown = e => {
    e.preventDefault();
    mbJm.style.transform = 'scale(0.92)';
    pressKey('Space');
  };
  const jmRelease = () => { mbJm.style.transform = 'scale(1)'; };
  mbJm.onpointerup = jmRelease;
  mbJm.onpointercancel = jmRelease;

  if (mbTrap) {
    mbTrap.onpointerdown = e => {
      e.preventDefault();
      mbTrap.style.transform = 'scale(0.92)';
      placeHunterTrap();
    };
    const trapRelease = () => { mbTrap.style.transform = 'scale(1)'; };
    mbTrap.onpointerup = trapRelease;
    mbTrap.onpointercancel = trapRelease;
  }

  // Dynamic label updater for Action Button
  updateMobileActionBtn = () => {
    if (mbTrap) {
      mbTrap.style.display = (MP.on && coop.isHunterMe()) ? 'flex' : 'none';
    }
    const lbl = document.getElementById('btn_action_lbl');
    if (!lbl || !mbAct) return;
    if (hid) {
      lbl.textContent = 'ВЫЙТИ';
      mbAct.style.borderColor = '#ffd700';
      mbAct.style.boxShadow = '0 0 16px rgba(255,215,0,0.75)';
    } else if (nearRadio) {
      lbl.textContent = RADIO_SPOT.on ? 'ВЫКЛ РАДИО' : 'РАДИО';
      mbAct.style.borderColor = '#d97706';
      mbAct.style.boxShadow = '0 0 16px rgba(217,119,6,0.8)';
    } else if (nearVaz) {
      const carN = getCarSpec(PF.eqCar || 'vaz2112').name;
      lbl.textContent = ch == 4 ? (partsCarried > 0 ? 'УСТАНОВИТЬ' : partsInstalled >= NK() ? 'ПОЕХАТЬ' : carN) : 'В МАШИНУ';
      mbAct.style.borderColor = '#b91c1c';
      mbAct.style.boxShadow = '0 0 20px rgba(185,28,28,0.85)';
    } else if (nearL) {
      lbl.textContent = 'ШКАФ';
      mbAct.style.borderColor = '#a16207';
      mbAct.style.boxShadow = '0 0 16px rgba(161,98,7,0.75)';
    } else if (nearE) {
      if (ch == 3) {
        lbl.textContent = keys >= NK() ? 'ВОРОТА!' : 'ЗАПЕРТО';
        mbAct.style.borderColor = keys >= NK() ? '#dc2626' : '#7f1d1d';
        mbAct.style.boxShadow = keys >= NK() ? '0 0 18px rgba(220,38,38,0.85)' : 'none';
      } else {
        lbl.textContent = keys >= NK() ? 'ВЫХОД!' : 'ВЫХОД';
        mbAct.style.borderColor = keys >= NK() ? '#dc2626' : '#7f1d1d';
        mbAct.style.boxShadow = keys >= NK() ? '0 0 18px rgba(220,38,38,0.85)' : 'none';
      }
    } else if (nearSp) {
      lbl.textContent = 'ОБЫСК';
      mbAct.style.borderColor = '#d97706';
      mbAct.style.boxShadow = '0 0 16px rgba(217,119,6,0.75)';
    } else if (nearMazeNote) {
      lbl.textContent = 'ЗАПИСКА';
      mbAct.style.borderColor = '#dc2626';
      mbAct.style.boxShadow = '0 0 16px rgba(220,38,38,0.85)';
    } else if (nearPhoto) {
      lbl.textContent = 'ФОТО';
      mbAct.style.borderColor = '#d97706';
      mbAct.style.boxShadow = '0 0 16px rgba(217,119,6,0.75)';
    } else if (nearPC) {
      lbl.textContent = 'ПК';
      mbAct.style.borderColor = '#9b8e84';
      mbAct.style.boxShadow = '0 0 14px rgba(155,142,132,0.65)';
    } else if (nearUsb || nearPap || nearPaper) {
      lbl.textContent = 'ВЗЯТЬ';
      mbAct.style.borderColor = '#d97706';
      mbAct.style.boxShadow = '0 0 16px rgba(217,119,6,0.75)';
    } else if (nearD) {
      lbl.textContent = nearD.st == 'locked' ? 'ОТПЕРЕТЬ' : 'ДВЕРЬ';
      mbAct.style.borderColor = '#b91c1c';
      mbAct.style.boxShadow = '0 0 14px rgba(185,28,28,0.6)';
    } else if (nearSt) {
      lbl.textContent = UPF ? 'ВНИЗ' : 'НАВЕРХ';
      mbAct.style.borderColor = '#d97706';
      mbAct.style.boxShadow = '0 0 14px rgba(217,119,6,0.6)';
    } else {
      lbl.textContent = 'ДЕЙСТВИЕ';
      mbAct.style.borderColor = '#8b1e25';
      mbAct.style.boxShadow = '0 0 12px rgba(139,30,37,0.4)';
    }
  };

  // Orientation prompt
  const rot = document.createElement('div');
  rot.id = 'rot_prompt';
  rot.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;pointer-events:none;color:#fff;font-family:Georgia,serif;';
  rot.innerHTML = `
    <div style="background:#0f0407;border:2px solid #8b0000;border-radius:12px;padding:22px 28px;text-align:center;box-shadow:0 0 35px rgba(255,0,0,0.5);max-width:320px;box-sizing:border-box">
      <div style="font-size:36px;margin-bottom:8px">📱↻</div>
      <div style="color:#ffd700;font-size:16px;font-weight:bold;margin-bottom:6px;letter-spacing:0.04em">ПОВЕРНИ ЭКРАН</div>
      <div style="color:#aaa;font-size:12.5px;line-height:1.4">Для комфортной игры держите телефон горизонтально (альбомный режим)</div>
    </div>
  `;
  document.body.appendChild(rot);

  const chk = () => {
    if (!isTouchDevice()) {
      rot.style.display = 'none';
      return;
    }
    rot.style.display = window.innerHeight > window.innerWidth ? 'flex' : 'none';
  };
  window.addEventListener('resize', chk);
  window.addEventListener('orientationchange', () => setTimeout(chk, 150));
  chk();
})();
let ha=0,LB=null,UID=null,_lt=0,_lk='',_ps=0;
const $=id=>document.getElementById(id);
const PF={name:'',games:0,wins:0,deaths:0,keys:0,sec:0,coop:0,best:0,first:Date.now(),friends:[],xp:0,phoneCase:0,phoneWallpaper:0,phoneCharm:0,phoneSticker:0,avatar:'survivor',frame:'frame_classic',customAvatar:'',headAcc:0,faceAcc:0,ownedHeadAcc:[0],ownedFaceAcc:[0],owned:[0],skins:[0],ownedCars:['vaz2112'],eqCar:'vaz2112',carColors:{vaz2112:'#6f7882'},ownedMonSkins:['maze'],eqMonSkin:'maze',redeemedCodes:[],isDeveloper:0,devNick:'',m2:0,cemeteryUnlocked:0,m3:0,garagesUnlocked:0,jaUnlocked:0,w1:0,w2:0,w3:0,w4:0,vazCh3:0,vazCh4:0,foundVazParts:{},foundMazeNotes:{}};
try{Object.assign(PF,JSON.parse(localStorage.getItem('horror_p')||'{}'))}catch(e){}
try{
  const shopSv=JSON.parse(localStorage.getItem('horror_shop_save')||'null');
  if(shopSv&&typeof shopSv==='object'){
    if(shopSv.coins!==undefined)PF.coins=Math.max(Math.max(0,Math.floor(Number(PF.coins)||0)),Math.max(0,Math.floor(Number(shopSv.coins)||0)));
    if(shopSv.skin!==undefined)PF.skin=shopSv.skin|0;
    if(Array.isArray(shopSv.owned))PF.owned=[...new Set([...(PF.owned||[0]),...(PF.skins||[0]),...shopSv.owned])];
    if(shopSv.headAcc!==undefined)PF.headAcc=shopSv.headAcc|0;
    if(shopSv.faceAcc!==undefined)PF.faceAcc=shopSv.faceAcc|0;
    if(Array.isArray(shopSv.ownedHeadAcc))PF.ownedHeadAcc=[...new Set([...(PF.ownedHeadAcc||[0]),...shopSv.ownedHeadAcc])];
    if(Array.isArray(shopSv.ownedFaceAcc))PF.ownedFaceAcc=[...new Set([...(PF.ownedFaceAcc||[0]),...shopSv.ownedFaceAcc])];
    if(Array.isArray(shopSv.ownedCars))PF.ownedCars=[...new Set([...(PF.ownedCars||['vaz2112']),...shopSv.ownedCars])];
    if(shopSv.eqCar)PF.eqCar=shopSv.eqCar;
    if(shopSv.carColors&&typeof shopSv.carColors==='object')PF.carColors={...(PF.carColors||{}),...shopSv.carColors};
    if(Array.isArray(shopSv.ownedMonSkins))PF.ownedMonSkins=[...new Set([...(PF.ownedMonSkins||['maze']),...shopSv.ownedMonSkins])];
    if(shopSv.eqMonSkin)PF.eqMonSkin=shopSv.eqMonSkin;
  }
}catch(e){}
try{
  const ca=localStorage.getItem('horror_custom_avatar');
  if(ca&&/^data:image\//i.test(ca))PF.customAvatar=ca;
}catch(e){}
try{
  const dv=JSON.parse(localStorage.getItem('horror_dev_badge')||'null');
  if(dv&&dv.isDeveloper){PF.isDeveloper=1;if(dv.devNick)PF.devNick=String(dv.devNick).trim().toLowerCase();}
}catch(e){}
try{
  if(localStorage.getItem('horror_cemetery_unlocked')==='1'){PF.m2=1;PF.cemeteryUnlocked=1;}
  if(localStorage.getItem('horror_garages_unlocked')==='1'){PF.m3=1;PF.garagesUnlocked=1;}
}catch(e){}
PF.foundVazParts=getDiscoveredParts(PF);
PF.foundMazeNotes=getDiscoveredNotes(PF);
if(!Array.isArray(PF.friends))PF.friends=[];
if(PF.xp===undefined)PF.xp=0;
if(PF.phoneCase===undefined)PF.phoneCase=0;
if(PF.phoneWallpaper===undefined)PF.phoneWallpaper=0;
if(PF.phoneCharm===undefined)PF.phoneCharm=0;
if(PF.phoneSticker===undefined)PF.phoneSticker=0;
if(!PF.avatar)PF.avatar='survivor';
if(!PF.frame)PF.frame='frame_classic';
if(PF.customAvatar===undefined)PF.customAvatar='';
PF.skins=[...new Set([...(PF.skins||[0]),...(PF.owned||[0])])];
PF.owned=PF.skins;
if(!Array.isArray(PF.ownedHeadAcc))PF.ownedHeadAcc=[0];
if(!Array.isArray(PF.ownedFaceAcc))PF.ownedFaceAcc=[0];
if(!Array.isArray(PF.ownedCars))PF.ownedCars=['vaz2112'];
if(!PF.eqCar)PF.eqCar='vaz2112';
if(!PF.carColors||typeof PF.carColors!=='object')PF.carColors={vaz2112:'#6f7882'};
if(!Array.isArray(PF.ownedMonSkins))PF.ownedMonSkins=['maze'];
if(!PF.eqMonSkin)PF.eqMonSkin='maze';
if(!Array.isArray(PF.redeemedCodes))PF.redeemedCodes=[];
if(PF.headAcc===undefined)PF.headAcc=0;
if(PF.faceAcc===undefined)PF.faceAcc=0;
if(PF.m2===undefined)PF.m2=0;
if(PF.cemeteryUnlocked===undefined)PF.cemeteryUnlocked=(PF.m2||PF.w2)?1:0;
if(PF.m2||PF.cemeteryUnlocked||PF.w2){PF.m2=1;PF.cemeteryUnlocked=1;}
if(PF.m3===undefined)PF.m3=0;
if(PF.garagesUnlocked===undefined)PF.garagesUnlocked=(PF.m3||PF.w3)?1:0;
if(PF.m3||PF.garagesUnlocked||PF.w3){PF.m3=1;PF.garagesUnlocked=1;}
if(PF.jaUnlocked===undefined)PF.jaUnlocked=0;
const isDevBadgeForNick=(nm)=>{
  if(!PF.isDeveloper)return false;
  const dn=String(PF.devNick||'').trim().toLowerCase();
  if(!dn)return true;
  const n=String(nm||(ACC.on?ACC.nick:PF.name)||'').trim().toLowerCase();
  return !n||n===dn;
};
async function verifyDeveloperSecret(rawInput){
  const h=await sha256Hex(rawInput);
  if(!h||!DEV_HASHES.has(h))return false;
  PF.isDeveloper=1;
  const curN=(ACC.on?ACC.nick:(PF.name||'')).trim().toLowerCase();
  if(curN)PF.devNick=curN;
  try{localStorage.setItem('horror_dev_badge',JSON.stringify({isDeveloper:1,devNick:PF.devNick||''}))}catch(e){}
  pWrite();
  syncCoopProfile();
  return true;
}
function syncCoopProfile(){
  const nick=(ACC.on?ACC.nick:(PF.name||'Игрок')).slice(0,10);
  try{
    coop.setProfile(nick,PF.skin|0,PF.avatar||'survivor',PF.frame||'frame_classic',{
      avatarPhoto:PF.customAvatar||'',
      headAcc:PF.headAcc|0,
      faceAcc:PF.faceAcc|0,
      monsterSkin:PF.eqMonSkin||'maze',
      isDev:isDevBadgeForNick(nick)
    });
  }catch(e){}
}
const pWrite=()=>{try{
  PF.skins=[...new Set([...(PF.skins||[0]),...(PF.owned||[0])])];
  PF.owned=PF.skins;
  if(PF.m2||PF.cemeteryUnlocked||PF.w2){PF.m2=1;PF.cemeteryUnlocked=1;localStorage.setItem('horror_cemetery_unlocked','1');}
  if(PF.m3||PF.garagesUnlocked||PF.w3){PF.m3=1;PF.garagesUnlocked=1;localStorage.setItem('horror_garages_unlocked','1');}
  if(PF.isDeveloper){localStorage.setItem('horror_dev_badge',JSON.stringify({isDeveloper:1,devNick:PF.devNick||''}))}
  localStorage.setItem('horror_shop_save',JSON.stringify({
    coins:Math.max(0,Math.floor(Number(PF.coins)||0)),skin:PF.skin|0,owned:PF.owned,headAcc:PF.headAcc|0,faceAcc:PF.faceAcc|0,
    ownedHeadAcc:PF.ownedHeadAcc,ownedFaceAcc:PF.ownedFaceAcc,ownedCars:PF.ownedCars,
    eqCar:PF.eqCar,carColors:PF.carColors,ownedMonSkins:PF.ownedMonSkins,eqMonSkin:PF.eqMonSkin
  }));
  PF.foundVazParts=normalizeDiscoveredMap(PF.foundVazParts);
  localStorage.setItem(JOURNAL_STORAGE_KEY,JSON.stringify(PF.foundVazParts));
  PF.foundMazeNotes=normalizeDiscoveredNotes(PF.foundMazeNotes);
  localStorage.setItem(NOTES_STORAGE_KEY,JSON.stringify(PF.foundMazeNotes));
  localStorage.setItem('horror_p',JSON.stringify(PF));
}catch(e){}accSave()};
function pSave(dt){_ps+=dt;if(_ps>10){_ps=0;pWrite()}}
function pstat(k,n=1){PF[k]=(PF[k]||0)+n;pWrite()}
addEventListener('pagehide',pWrite);
function lockerCol(x,top,lh,wx,sh,colW=1){
if(ch==2){
  if(wx<.06||wx>.94||Math.abs(wx-.5)<.018){g.fillStyle='rgba(8,4,2,.82)';g.fillRect(x,top,colW,lh);return}
  g.fillStyle='rgb('+(66*sh|0)+','+(38*sh|0)+','+(20*sh|0)+')';g.fillRect(x,top,colW,lh);
  if((wx>.12&&wx<.44)||(wx>.56&&wx<.88)){
    if((wx*10|0)%2===0){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,top+lh*.08,colW,lh*.84)}
    g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,top+lh*.08,colW,Math.max(1,lh*.02));g.fillRect(x,top+lh*.9,colW,Math.max(1,lh*.02));
  }
  g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x,top,colW,Math.max(1,lh*.04));g.fillRect(x,top+lh*.95,colW,Math.max(1,lh*.05));
  const hx=wx<.5?.42:.58;if(Math.abs(wx-hx)<.024){g.fillStyle='rgb('+(208*sh|0)+','+(166*sh|0)+','+(78*sh|0)+')';g.fillRect(x,top+lh*.46,colW,lh*.1)}
  return;
}
if(wx<.07||wx>.93||Math.abs(wx-.5)<.015){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x,top,colW,lh);return}
g.fillStyle='rgba(0,0,0,.65)';for(let k=0;k<7;k++)g.fillRect(x,top+lh*(.1+k*.035),colW,Math.max(1,lh*.012));for(let k=0;k<5;k++)g.fillRect(x,top+lh*(.72+k*.035),colW,Math.max(1,lh*.012));
const hx=wx<.5?.42:.58;if(Math.abs(wx-hx)<.025){g.fillStyle='rgb('+(190*sh|0)+','+(180*sh|0)+','+(120*sh|0)+')';g.fillRect(x,top+lh*.46,colW,lh*.12)}
const nx=wx<.5?.25:.75;if(Math.abs(wx-nx)<.06){g.fillStyle='rgb('+(200*sh|0)+','+(200*sh|0)+','+(190*sh|0)+')';g.fillRect(x,top+lh*.3,colW,lh*.07)}
const q=(wx*40)|0;if(q%7==0){g.fillStyle='rgb('+(110*sh|0)+','+(45*sh|0)+','+(15*sh|0)+')';g.fillRect(x,top+lh*.55,colW,lh*(.1+(q%5)*.04))}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const fmtH=s=>{s=Math.floor(s);return Math.floor(s/3600)+' ч '+(Math.floor(s/60)%60)+' мин'};
const fmtT=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function reg(){let code='',tz='';try{const l=(navigator.languages&&navigator.languages[0])||navigator.language||'';const m=l.match(/[-_]([A-Za-z]{2})$/);if(m)code=m[1].toUpperCase()}catch(e){}
try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
if(!code){const M={'Europe/Kyiv':'UA','Europe/Kiev':'UA','Europe/Moscow':'RU','Europe/Minsk':'BY','Europe/Berlin':'DE','Europe/London':'GB','Europe/Paris':'FR','Europe/Warsaw':'PL','America/New_York':'US','America/Chicago':'US','America/Los_Angeles':'US','Asia/Tokyo':'JP','Asia/Almaty':'KZ'};code=M[tz]||''}
let name=code;try{if(code)name=new Intl.DisplayNames([SET.lang],{type:'region'}).of(code)}catch(e){}return{code,name:name||'не определён',tz}}
function openDevVerifyModal(){
  let m=document.getElementById('dev_verify_modal');if(m)disposeAnimatedModal(m);
  m=document.createElement('div');m.id='dev_verify_modal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.86);backdrop-filter:blur(6px);z-index:9900;display:flex;align-items:center;justify-content:center;padding:16px';
  m.innerHTML=`<div style="background:#12080a;border:2px solid #f59e0b;border-radius:10px;padding:20px;max-width:380px;width:100%;color:#eee;font-family:Georgia,serif;text-align:left;box-shadow:0 0 30px rgba(245,158,11,0.35)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <b style="color:#fde68a;font-size:15px">🔑 Подтверждение DEVELOPER</b>
      <button id="dvm_close" style="margin:0;background:transparent;border:0;color:#aaa;font-size:18px;cursor:pointer">✕</button>
    </div>
    <div style="font-size:12px;color:#bbb;margin-bottom:10px">Введите почту или логин разработчика для активации значка <b>DEVELOPER</b> под вашим ником:</div>
    <input id="dvm_inp" type="text" placeholder="email / логин" style="width:100%;box-sizing:border-box;background:#1a0d10;border:1px solid #8b5a12;color:#fff;padding:9px;border-radius:5px;font-size:14px;margin-bottom:8px" />
    <div id="dvm_err" style="font-size:11.5px;color:#ff6b81;min-height:16px;margin-bottom:8px"></div>
    <button id="dvm_ok" style="width:100%;margin:0;padding:9px;background:#b45309;border:1px solid #f59e0b;color:#fff;border-radius:6px;font-weight:bold;cursor:pointer">Подтвердить</button>
  </div>`;
  document.body.appendChild(m);
  openAnimatedModal(m);
  const closeDevModal=()=>closeAnimatedModal(m);
  $('dvm_close').onclick=closeDevModal;
  m.onclick=e=>{if(e.target===m)closeDevModal()};
  $('dvm_ok').onclick=async()=>{
    const val=$('dvm_inp')?.value||'';
    const ok=await verifyDeveloperSecret(val);
    if(ok){
      closeDevModal();
      try{TN(784,.15,.25,'triangle',1100)}catch(e){}
      updPf();renderSocialBar();renderAcct();updateCoopStylePreview();
      if(coop.currentRoom)renderActiveRoomCard(coop.currentRoom,coop.getPeersList(),coop.isHost);
      showToast('✓ Статус DEVELOPER активирован!');
    }else{
      const er=$('dvm_err');if(er)er.textContent='Неверный логин разработчика';
      try{TN(160,.15,.2,'square')}catch(e){}
    }
  };
}
let pit=null;
function updPf(){const R=reg(),d=new Date(),on=navigator.onLine&&(!LB||LB.connected()),o=-d.getTimezoneOffset()/60;
const lvlInfo=calculateLevel(PF.xp||0);
const curCase=getPhoneCase(PF.phoneCase||0);
const curCharm=getPhoneCharm(PF.phoneCharm||0);
const curSticker=getPhoneSticker(PF.phoneSticker||0);
const curAv=getAvatar(PF.avatar||'survivor');
const curFr=getFrame(PF.frame||'frame_classic');
const curCar=getCarSpec(PF.eqCar||'vaz2112');
const myNickDisp=(ACC.on?ACC.nick:(PF.name||'Игрок'));
const devActive=isDevBadgeForNick(myNickDisp);
const rows=[
['Ник и бейдж',`<div style="display:inline-flex;flex-direction:column;align-items:flex-end;gap:2px"><b style="color:#e6dacb">${esc(myNickDisp)}</b>${devActive?renderDeveloperBadgeHtml(true):''}</div>`],
['Статус',on?'<span style="color:#9e8d7e">● в сети</span>':'<span style="color:#992b2b">● нет связи</span>'],
['ID',UID?esc(String(UID).slice(-6)):'неизвестен'],
['Аккаунт',ACC.on?esc(ACC.nick):'—'],
['Уровень',`<b style="color:#d6b899">${lvlInfo.level} · ${lvlInfo.title}</b> (${lvlInfo.currentXp} XP)`],
['Аватар',`<button id="pf_avatar_open" style="margin:0;padding:2px 8px;font-size:12px;background:#0a0304;border:1px solid #4d1218;color:#d6c7b8;border-radius:2px;cursor:pointer">${PF.customAvatar?'Своё фото':curAv.emoji+' '+curAv.name} · ${curFr.name}</button>`],
['Гараж и магазин',`<button id="pf_shop_open" style="margin:0;padding:2px 8px;font-size:12px;background:#0a0304;border:1px solid #4d1218;color:#d6c7b8;border-radius:2px;cursor:pointer">${curCar.name}</button>`],
['Телефон',`<button id="pf_phone_open" style="margin:0;padding:2px 8px;font-size:12px;background:#0a0304;border:1px solid #4d1218;color:#d6c7b8;border-radius:2px;cursor:pointer">${curCase.name} ${curCharm.emoji}${curSticker.emoji?' '+curSticker.emoji:''}</button>`],
['Монеты',Math.max(0,Math.floor(Number(PF.coins)||0)).toLocaleString('ru-RU')],
['Разработчик',devActive?`${renderDeveloperBadgeHtml(true)}`:`<button id="pf_dev_open" style="margin:0;padding:2px 8px;font-size:11.5px;background:#0a0304;border:1px solid #4d1218;color:#b89c88;border-radius:2px;cursor:pointer">Подтвердить DEVELOPER</button>`],
['Местное время',d.toLocaleTimeString(LOCALE())],['Дата',d.toLocaleDateString(LOCALE(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
['Часовой пояс',esc(R.tz||'—')+' (UTC'+(o>=0?'+':'')+o+')'],['Регион',esc(R.name)+(R.code?' ('+R.code+')':'')],['Язык',esc(navigator.language||'—')],
['Устройство',isTouchDevice()?'телефон / планшет':'компьютер'],['Экран',innerWidth+'×'+innerHeight],
['Первый запуск',new Date(PF.first).toLocaleDateString(LOCALE())],['Наиграно',fmtH(PF.sec)],['Игр начато',PF.games],['Побед',PF.wins],['Смертей',PF.deaths],['Ключей найдено',PF.keys],['Кооп-игр',PF.coop],['Лучшее время побега',PF.best?fmtT(PF.best):'—']];
$('pfd').innerHTML='<table style="width:100%;border-collapse:collapse">'+rows.map(r=>'<tr style="border-bottom:1px solid #260a0d"><td style="padding:6px 4px;color:#786560">'+r[0]+'</td><td style="padding:6px 4px;text-align:right">'+r[1]+'</td></tr>').join('')+'</table>';
const pfPh=$('pf_phone_open');if(pfPh)pfPh.onclick=()=>showPhoneCustomizerModal({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();updPf();if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}))}});
const pfAv=$('pf_avatar_open');if(pfAv)pfAv.onclick=()=>openAvatarModal();
const pfShop=$('pf_shop_open');if(pfShop)pfShop.onclick=()=>openLobbyShopModal();
const pfDev=$('pf_dev_open');if(pfDev)pfDev.onclick=()=>openDevVerifyModal();}
(()=>{const b=document.createElement('button');b.id='pbtn';b.textContent='ПРОФИЛЬ';b.style.cssText='position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:10px;margin:0;padding:7px 13px;font:12px/1 Georgia,serif;letter-spacing:.12em;background:rgba(7,2,3,.92);border:1px solid #451014;color:#d6c7b8;border-radius:2px;cursor:pointer;z-index:20;display:none';document.body.appendChild(b);
const pf=document.createElement('div');pf.style.cssText='position:fixed;inset:0;z-index:30;background:radial-gradient(circle at 50% 25%,rgba(34,6,8,.92),rgba(3,1,2,.98));display:none;overflow:auto;padding:18px;box-sizing:border-box;color:#cfc2b4;font:14px Georgia,serif';
pf.innerHTML='<div style="max-width:500px;margin:12px auto;background:#050203;border:1px solid #451014;border-radius:2px;padding:18px;box-shadow:0 24px 64px rgba(0,0,0,.98)"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #29090c;padding-bottom:10px"><h2 style="margin:0;letter-spacing:.18em;font-size:15px;color:#b83838">ДОСЬЕ // ПРОФИЛЬ</h2><button id="pcl" style="margin:0;padding:4px 10px;background:#0a0304;border:1px solid #3f1116;color:#9e8d7e;border-radius:2px;cursor:pointer">✕</button></div><div style="margin:14px 0"><label style="font-size:11px;letter-spacing:.1em;color:#786560;text-transform:uppercase">Позывной<br><input id="pnm" maxlength="10" style="width:210px;margin:6px 0 0;padding:7px 9px;background:#020101;border:1px solid #451014;color:#dfd2c3;border-radius:2px;font-family:Georgia,serif;outline:none"></label></div><div id="pfd"></div></div>';document.body.appendChild(pf);
const sync=v=>{PF.name=v.slice(0,10);pWrite();syncCoopProfile();updateCoopStylePreview();if($('nick'))$('nick').value=PF.name;$('pnm').value=PF.name};
if($('nick')){$('nick').value=PF.name;$('nick').oninput=()=>{PF.name=$('nick').value.slice(0,10);pWrite();syncCoopProfile();updateCoopStylePreview()}}
$('pnm').oninput=()=>sync($('pnm').value);
b.onclick=()=>{pf.style.display='block';$('pnm').value=PF.name;updPf();clearInterval(pit);pit=setInterval(updPf,1000)};
$('pcl').onclick=()=>{pf.style.display='none';clearInterval(pit)}})();

// Real WebSocket Co-op Integration
coop.connect();

const diffLabel = (d, chap) => {
  const c = Number(chap);
  if (d === 'extreme') return c === 4 ? 'Экстрим (12 дет.)' : 'Экстрим';
  if (d === 'hard') return c === 4 ? 'Сложный (8 дет.)' : 'Сложный';
  return c === 4 ? 'Лёгкий (5 дет.)' : 'Лёгкий';
};

function syncCoopDiffSelect() {
  const chEl = $('chs');
  const dfEl = $('coop_diff');
  if (!dfEl) return;
  const c = Number(chEl?.value || 1);
  const opts = dfEl.options;
  for (let i = 0; i < opts.length; i++) {
    const o = opts[i];
    const lbl = diffLabel(o.value, c);
    o.textContent = tr(lbl);
  }
}

function renderCoopRooms(roomList, onlineCount) {
  const el = $('ol');
  if (!el) return;
  el.textContent = '';
  
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin:8px 0 6px;padding-bottom:4px;border-bottom:1px solid #4a151b';
  header.innerHTML = `
    <span style="color:#e44;letter-spacing:0.1em;font-weight:bold;font-size:13px">${tr('ОТКРЫТЫЕ КОМНАТЫ В СЕТИ')}</span>
    <span style="color:#5d5;font-size:12px;display:flex;align-items:center;gap:4px">
      <span style="display:inline-block;width:7px;height:7px;background:#5d5;border-radius:50%"></span>
      ${tr('Игроков онлайн: ')}${onlineCount || 1}
    </span>
  `;
  el.appendChild(header);

  if (!roomList || roomList.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'color:#888;font-size:13px;margin:6px 0;font-style:italic';
    p.textContent = tr('Нет активных открытых комнат. Создай комнату или нажми «🎲 БЫСТРЫЙ ПОИСК».');
    el.appendChild(p);
    return;
  }

  roomList.forEach((r) => {
    const card = document.createElement('div');
    card.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;margin:4px 0;background:#140709;border:1px solid #4a181e;border-radius:6px';
    card.innerHTML = `
      <div style="text-align:left">
        <div style="font-weight:bold;color:#fcc;font-size:14px;letter-spacing:0.05em">
          [${r.code}] <span style="font-size:12px;color:#aaa">· ${tr('Глава ')}${r.chapter} (${tr(diffLabel(r.difficulty, r.chapter))})</span>
        </div>
        <div style="font-size:11.5px;color:#888">${tr('Хост: ')}<span style="color:#fd4">${esc(r.hostName)}</span> · ${tr('Игроков: ')}${r.playerCount}/${r.maxPlayers}</div>
      </div>
      <button data-code="${r.code}" class="join-room-btn" style="margin:0;padding:6px 14px;font-size:13px;background:#3a0e14;border:1px solid #c33;color:#fff;border-radius:4px;cursor:pointer">
        ${tr('Войти')}
      </button>
    `;
    const btn = card.querySelector('.join-room-btn');
    if (btn) {
      btn.onclick = () => {
        if ($('code')) $('code').value = r.code;
        joinCoopRoom(r.code);
      };
    }
    el.appendChild(card);
  });
}

function renderActiveRoomCard(room, peers, isHost) {
  let card = $('coop_room_active');
  if (!card) return;
  if (!room) {
    card.style.display = 'none';
    card.innerHTML = '';
    return;
  }
  card.style.display = 'block';
  card.style.cssText = 'width:100%;margin:10px 0;padding:12px;background:#180a0d;border:2px solid #8b1e25;border-radius:8px;box-sizing:border-box;box-shadow:0 0 20px rgba(180,20,30,0.3);text-align:left';
  
  const myName = ACC.on ? ACC.nick : (PF.name || 'Ты');
  const rMode = room.coopMode === 'player' ? 'player' : 'bot';
  const rHunterId = room.hunterId || null;
  const myPlayer = {
    id: coop.peerId || 'me',
    name: myName,
    isMe: true,
    isHost: Boolean(isHost),
    avatar: PF.avatar || 'survivor',
    frame: PF.frame || 'frame_classic',
    avatarPhoto: PF.customAvatar || '',
    isDev: isDevBadgeForNick(myName),
    isHunter: rMode === 'player' && rHunterId === coop.peerId,
  };
  const otherPlayers = peers.map(p => ({
    id: p.id,
    name: p.name || 'Игрок',
    isMe: false,
    isHost: Boolean(p.isHost),
    avatar: p.avatar || 'survivor',
    frame: p.frame || 'frame_classic',
    avatarPhoto: p.avatarPhoto || '',
    isDev: Boolean(p.isDev),
    isHunter: rMode === 'player' && rHunterId === p.id,
  }));
  const allPlayers = [myPlayer, ...otherPlayers];
  const rDiff = room.difficulty || 'easy';
  const rChap = Number(room.chapter) || 1;
  
  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:10px">
      <div style="font-size:15px;color:#fff;font-weight:bold">
        КОМНАТА: <span style="color:#ff4757;letter-spacing:0.1em;background:#2a080c;padding:3px 8px;border-radius:4px;border:1px solid #a32">${room.code}</span>
      </div>
      <div style="font-size:12px;color:#aaa">Глава ${rChap} · <span style="color:#fd4">${tr(diffLabel(rDiff, rChap))}</span> · ${allPlayers.length}/4 игроков</div>
    </div>

    ${isHost ? `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:7px 10px;background:#110608;border:1px solid #3c141a;border-radius:6px">
        <span style="font-size:12px;color:#faa">⚙ ${tr('Сложность: ')}</span>
        <select id="coop_room_diff" style="background:#1c0a0d;color:#fff;border:1px solid #8b2538;padding:4px 8px;border-radius:4px;font-family:Georgia,serif;font-size:12.5px">
          <option value="easy" ${rDiff==='easy'?'selected':''}>${tr(diffLabel('easy', rChap))}</option>
          <option value="hard" ${rDiff==='hard'?'selected':''}>${tr(diffLabel('hard', rChap))}</option>
          <option value="extreme" ${rDiff==='extreme'?'selected':''}>${tr(diffLabel('extreme', rChap))}</option>
        </select>
      </div>
    ` : ''}

    ${allPlayers.length >= 2 ? (() => {
      const cvt = coop.currentVote || {};
      const myVote = Array.isArray(cvt.voters) ? cvt.voters.find(v => v.id === coop.peerId)?.choice : '';
      const botCnt = cvt.botVotes || 0;
      const pmCnt = cvt.playerVotes || 0;
      return `
        <div style="margin-bottom:10px;padding:8px 10px;background:#12060a;border:1px solid #591c28;border-radius:6px">
          <div style="font-size:11.5px;font-weight:bold;color:#ffccd5;margin-bottom:6px">🗳 ${tr('Голосование в начале: Бот или Игрок')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button id="room_vote_bot" style="margin:0;flex:1 1 130px;padding:6px 10px;font-size:12px;border-radius:5px;cursor:pointer;background:${myVote==='bot'?'#154328':'#1d0c10'};border:1.5px solid ${myVote==='bot'?'#2ed573':'#552'};color:#fff;font-weight:bold">🤖 Бот (${botCnt})</button>
            <button id="room_vote_player" style="margin:0;flex:1 1 130px;padding:6px 10px;font-size:12px;border-radius:5px;cursor:pointer;background:${myVote==='player'?'#4a0f18':'#1d0c10'};border:1.5px solid ${myVote==='player'?'#ff4757':'#552'};color:#fff;font-weight:bold">👹 Игрок-монстр (${pmCnt})</button>
          </div>
        </div>
      `;
    })() : ''}

    <div style="margin-bottom:12px">
      <div style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Отряд в комнате:</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));gap:8px">
        ${allPlayers.map(p => {
          const fr = getFrame(p.frame);
          return `
            <div style="
              display:flex;
              flex-direction:column;
              align-items:center;
              padding:10px 6px;
              background:${p.isHunter ? 'rgba(65,10,16,0.85)' : 'rgba(20,5,8,0.75)'};
              border:1px solid ${p.isHunter ? '#ff4757' : fr.color + '44'};
              border-radius:8px;
              position:relative;
              text-align:center;
            ">
              ${renderAvatarBadgeHtml(p.avatar, p.frame, 44, '', p.avatarPhoto)}
              <div style="font-size:12px;font-weight:bold;color:#fff;margin-top:6px;max-width:105px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${esc(p.name)} ${p.isMe ? '<span style="color:#2ed573;font-size:10px">(Ты)</span>' : ''}
              </div>
              ${p.isDev ? renderDeveloperBadgeHtml(true) : ''}
              ${p.isHunter ? '<span style="margin-top:2px;font-size:9.5px;font-weight:bold;color:#ff8a96;background:#3a0910;border:1px solid #ff4757;padding:1px 6px;border-radius:3px">👹 МОНСТР</span>' : ''}
              <div style="font-size:10px;color:${fr.color};margin-top:2px">
                ${fr.name}
              </div>
              ${p.isHost ? '<span style="position:absolute;top:4px;right:6px;font-size:11px;" title="Хост комнаты">👑</span>' : ''}
              ${p.isMe ? '<button id="coop_change_style_btn" style="margin-top:6px;padding:2px 8px;font-size:10px;background:#2b0c16;border:1px solid #8b2538;color:#ffbebe;border-radius:4px;cursor:pointer">🎨 Сменить</button>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${isHost ? `<button id="coop_btn_start" style="margin:0;padding:8px 18px;font-size:14px;background:#8b0000;border:1px solid #ff4444;color:#fff;border-radius:4px;cursor:pointer;font-weight:bold">▶ НАЧАТЬ ИГРУ ВМЕСТЕ</button>` : `<span style="font-size:13px;color:#aaa;display:flex;align-items:center">Ожидание запуска игры хостом...</span>`}
      <button id="coop_btn_copy" style="margin:0;padding:8px 14px;font-size:13px;background:#222;border:1px solid #555;color:#ddd;border-radius:4px;cursor:pointer">📋 Скопировать код</button>
      <button id="coop_btn_leave" style="margin:0;padding:8px 14px;font-size:13px;background:#1a0505;border:1px solid #522;color:#faa;border-radius:4px;cursor:pointer">✕ Выйти</button>
    </div>
  `;

  const roomDiffSel = card.querySelector('#coop_room_diff');
  if (roomDiffSel) {
    roomDiffSel.onchange = () => {
      DIFF = roomDiffSel.value || 'easy';
      DFM = DIFFS[DIFF] || DIFFS.easy;
      coop.setDifficulty(DIFF);
    };
  }
  const rvBot = card.querySelector('#room_vote_bot');
  if (rvBot) rvBot.onclick = () => coop.castVote('bot');
  const rvPlayer = card.querySelector('#room_vote_player');
  if (rvPlayer) rvPlayer.onclick = () => coop.castVote('player');

  const changeStyleBtn = card.querySelector('#coop_change_style_btn');
  if (changeStyleBtn) {
    changeStyleBtn.onclick = () => openAvatarModal();
  }

  const startBtn = card.querySelector('#coop_btn_start');
  if (startBtn) {
    startBtn.onclick = () => {
      coop.startGame();
    };
  }
  const copyBtn = card.querySelector('#coop_btn_copy');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(room.code).then(() => {
        say('Код комнаты скопирован: ' + room.code, 3);
      }).catch(() => {
        say('Код комнаты: ' + room.code, 3);
      });
    };
  }
  const leaveBtn = card.querySelector('#coop_btn_leave');
  if (leaveBtn) {
    leaveBtn.onclick = () => {
      coop.leaveRoom();
      MP.on = false;
      const m = $('mpm');
      if (m) m.textContent = 'Вы вышли из комнаты';
    };
  }
  trTree(card);
}

function updateCoopStylePreview() {
  const el = $('coop_avatar_preview');
  if (!el) return;
  const av = getAvatar(PF.avatar || 'survivor');
  const fr = getFrame(PF.frame || 'frame_classic');
  const myNick = (ACC.on ? ACC.nick : (PF.name || 'Игрок')).slice(0, 10);
  const devHtml = isDevBadgeForNick(myNick) ? renderDeveloperBadgeHtml(true) : '';
  el.innerHTML = `
    ${renderAvatarBadgeHtml(PF.avatar || 'survivor', PF.frame || 'frame_classic', 36, '', PF.customAvatar || '')}
    <div style="text-align:left">
      <div style="font-size:12px;font-weight:bold;color:#fff">${esc(myNick)}</div>
      ${devHtml}
      <div style="font-size:10px;color:${fr.color}">${PF.customAvatar ? 'Своё фото' : av.name} · ${fr.name}</div>
    </div>
  `;
}

function openAvatarModal() {
  aud();
  if (ac) ac.resume();
  showAvatarCustomizerModal(PF, {
    pWrite,
    coop,
    ac,
    TN,
    onUpdate: () => {
      syncCoopProfile();
      updateCoopStylePreview();
      updPf();
      renderSocialBar();
      renderAcct();
      if (coop.currentRoom) {
        renderActiveRoomCard(coop.currentRoom, coop.getPeersList(), coop.isHost);
      }
    }
  });
}

function openLobbyShopModal() {
  aud();
  if (ac) ac.resume();
  showLobbyShopModal(PF, {
    pWrite,
    ac,
    TN,
    coop,
    monsterSprites: { maze: monImg, mansion: monImg3, graveyard: monImg4, garages: monImg5, matrixman: monImgMatrix, figuraa: monImgFigura, grannyde: monImgGrannyDe, tvman: monImgTvMan },
    unlockAch: (id) => unlockAchievement(id, { PF, pWrite, ac, TN }),
    onUpdate: () => {
      PF.skins = [...new Set([...(PF.skins || [0]), ...(PF.owned || [0])])];
      PF.owned = PF.skins;
      pWrite();
      syncCoopProfile();
      updateCoopStylePreview();
      updPf();
      renderSocialBar();
      if (coop.currentRoom) {
        renderActiveRoomCard(coop.currentRoom, coop.getPeersList(), coop.isHost);
      }
    }
  });
}

function createCoopRoom() {
  aud();
  if (ac) ac.resume();
  syncCoopProfile();
  const chNum = +$('chs')?.value || 1;
  const diffVal = $('coop_diff')?.value || DIFF || 'easy';
  DIFF = diffVal;
  DFM = DIFFS[DIFF] || DIFFS.easy;
  const customCode = ($('code')?.value || '').trim();
  coop.createRoom(chNum, diffVal, customCode, 'bot');
  const m = $('mpm');
  if (m) m.textContent = 'Создание комнаты...';
}

function joinCoopRoom(code) {
  aud();
  if (ac) ac.resume();
  const c = (code || $('code')?.value || '').trim();
  if (!c) {
    const m = $('mpm');
    if (m) m.textContent = 'Введите код комнаты для входа';
    return;
  }
  syncCoopProfile();
  coop.joinRoom(c);
  const m = $('mpm');
  if (m) m.textContent = 'Подключение к комнате ' + c + '...';
}

function quickJoinCoop() {
  aud();
  if (ac) ac.resume();
  if (coop.lastRooms && coop.lastRooms.length > 0) {
    const target = coop.lastRooms[0];
    if ($('code')) $('code').value = target.code;
    joinCoopRoom(target.code);
  } else {
    createCoopRoom();
  }
}

coop.onRoomList((rooms, onlineCount) => {
  renderCoopRooms(rooms, onlineCount);
});

coop.onRoomUpdate((room, peers, isHost) => {
  renderActiveRoomCard(room, peers, isHost);
  if (room) {
    MP.on = true;
    MP.code = room.code;
    MP.seed = room.seed || 123456;
    ch = room.chapter || 1;
    DIFF = room.difficulty || 'easy';
    DFM = DIFFS[DIFF] || DIFFS.easy;
    if ($('coop_diff')) $('coop_diff').value = DIFF;
    const m = $('mpm');
    if (m) m.textContent = tr('Комната: ') + room.code + ' · ' + tr(diffLabel(DIFF, ch)) + ' (' + tr('Игроков: ') + (peers.length + 1) + '/4)';
  }
  updateModeButtons();
});

let modeModalOpen = false;
function updateModeButtons() {
  const isPM = Boolean(MP.on && coop.currentRoom && coop.currentRoom.coopMode === 'player');
  const imb = $('ingame_mode_btn');
  if (imb) {
    imb.textContent = isPM ? tr('👹 ИГРОК [M]') : tr('🤖 БОТ [M]');
    imb.style.borderColor = isPM ? '#ff4757' : '#2ed573';
    imb.style.background = isPM ? 'rgba(55, 8, 16, 0.88)' : 'rgba(12, 32, 20, 0.85)';
    imb.style.color = isPM ? '#ffd4d4' : '#c8ffe0';
  }
  const lmb = $('lobby_mode_btn');
  if (lmb) {
    lmb.textContent = isPM ? tr('👹 РЕЖИМ: ИГРОК') : tr('🤖 РЕЖИМ: БОТ');
    lmb.style.borderColor = isPM ? '#ff4757' : '#2ed573';
    lmb.style.background = isPM ? '#2a0b12' : '#0f2418';
    lmb.style.color = isPM ? '#ffd4d4' : '#c8ffe0';
  }
}

function closeMonsterModeModal(resumeLock = true) {
  const existing = document.getElementById('monster_mode_modal');
  if (existing) closeAnimatedModal(existing);
  modeModalOpen = false;
  if (resumeLock && state === 'play' && !pcOpen && !isTouchDevice()) {
    try { cv.requestPointerLock(); } catch (e) {}
  }
}

function openMonsterModeModal() {
  aud();
  if (ac) ac.resume();
  for (const k in kd) kd[k] = 0;
  modeModalOpen = true;
  if (document.pointerLockElement && document.exitPointerLock) {
    try { document.exitPointerLock(); } catch (e) {}
  }
  const existing = document.getElementById('monster_mode_modal');
  const wasOpen = Boolean(existing && existing.dataset?.uiClosing !== '1');
  if (existing) disposeAnimatedModal(existing);

  const inCoop = Boolean(MP.on && coop.currentRoom);
  const isPM = Boolean(inCoop && coop.currentRoom.coopMode === 'player');
  const isHost = Boolean(inCoop && coop.isHost);
  const rHunterId = inCoop ? (coop.currentRoom.hunterId || coop.peerId) : null;
  const myName = ACC.on ? ACC.nick : (PF.name || 'Ты');
  const players = inCoop ? [
    {
      id: coop.peerId || 'me',
      name: myName,
      isMe: true,
      avatar: PF.avatar || 'survivor',
      frame: PF.frame || 'frame_classic',
      avatarPhoto: PF.customAvatar || '',
      isDev: isDevBadgeForNick(myName),
    },
    ...coop.getPeersList().map(p => ({
      id: p.id,
      name: p.name || 'Игрок',
      isMe: false,
      avatar: p.avatar || 'survivor',
      frame: p.frame || 'frame_classic',
      avatarPhoto: p.avatarPhoto || '',
      isDev: Boolean(p.isDev),
    })),
  ] : [];

  const d = document.createElement('div');
  d.id = 'monster_mode_modal';
  d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.86);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Georgia,serif;padding:16px';
  d.innerHTML = `
    <div style="background:#14070a;border:2px solid #8b1e25;border-radius:12px;padding:18px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 36px rgba(180,20,30,0.5);color:#eee;box-sizing:border-box;text-align:left">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
        <div style="font-size:17px;font-weight:bold;color:#ffccd5;letter-spacing:0.06em">👹 БОТ ИЛИ ИГРОК</div>
        <button id="mm_close_x" style="margin:0;padding:4px 10px;font-size:13px;background:#260b10;border:1px solid #6b1d28;color:#fcc;border-radius:4px;cursor:pointer">✕</button>
      </div>
      <div style="font-size:12.5px;color:#bbb;margin-bottom:12px;line-height:1.4">
        Выберите, кто управляет монстром прямо во время матча: ИИ-бот или живой игрок из команды.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <button id="mm_pick_bot" style="margin:0;padding:12px 10px;text-align:left;border-radius:8px;cursor:${(!inCoop || isHost) ? 'pointer' : 'default'};background:${!isPM ? 'rgba(20,56,34,0.85)' : '#1a0a0e'};border:2px solid ${!isPM ? '#2ed573' : '#4a1b22'};color:#fff">
          <div style="font-size:14px;font-weight:bold;color:${!isPM ? '#86efac' : '#f3d0d5'};margin-bottom:4px">🤖 Бот (NPC-монстр)</div>
          <div style="font-size:11.5px;color:#ccc;line-height:1.35">ИИ-монстр сам патрулирует карту и охотится на шум и свет.</div>
          ${!isPM ? '<div style="margin-top:6px;font-size:11px;font-weight:bold;color:#4ade80">✓ Активен сейчас</div>' : ''}
        </button>
        <button id="mm_pick_player" style="margin:0;padding:12px 10px;text-align:left;border-radius:8px;cursor:${(inCoop && isHost) ? 'pointer' : 'pointer'};background:${isPM ? 'rgba(72,12,22,0.9)' : '#1a0a0e'};border:2px solid ${isPM ? '#ff4757' : '#4a1b22'};color:#fff;opacity:${inCoop ? '1' : '0.82'}">
          <div style="font-size:14px;font-weight:bold;color:${isPM ? '#ff9aa4' : '#f3d0d5'};margin-bottom:4px">👹 Игрок-монстр</div>
          <div style="font-size:11.5px;color:#ccc;line-height:1.35">Один игрок становится монстром и ставит ловушки [G].</div>
          ${isPM ? '<div style="margin-top:6px;font-size:11px;font-weight:bold;color:#ff6b81">✓ Активен сейчас</div>' : ''}
        </button>
      </div>
      ${inCoop ? `
        ${isPM ? `
          <div style="padding:10px;background:#100508;border:1px solid #4d1922;border-radius:8px;margin-bottom:12px">
            <div style="font-size:12px;font-weight:bold;color:#ffccd5;margin-bottom:8px">👹 Кто сейчас монстр-охотник:</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${players.map(p => {
                const active = p.id === rHunterId;
                return `
                  <button class="mm-hunter-btn" data-pid="${esc(p.id)}" style="margin:0;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;background:${active ? '#3b0c14' : '#19080c'};border:1px solid ${active ? '#ff4757' : '#3e161d'};border-radius:6px;color:#fff;cursor:${isHost ? 'pointer' : 'default'};text-align:left">
                    <span style="display:flex;align-items:center;gap:8px">
                      ${renderAvatarBadgeHtml(p.avatar, p.frame, 28, '', p.avatarPhoto)}
                      <span style="font-size:13px;font-weight:bold">${esc(p.name)}${p.isMe ? ' (Ты)' : ''}</span>
                      ${p.isDev ? renderDeveloperBadgeHtml(true) : ''}
                    </span>
                    <span style="font-size:11.5px;font-weight:bold;color:${active ? '#ff8a96' : '#888'}">${active ? '👹 МОНСТР' : (isHost ? 'Выбрать' : 'Выживший')}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        ${!isHost ? '<div style="font-size:12px;color:#fca5a5;margin-bottom:10px">Только хост комнаты может переключать режим и выбирать охотника.</div>' : ''}
      ` : `
        <div style="padding:10px;background:#110608;border:1px solid #4a1c22;border-radius:8px;margin-bottom:12px">
          <div style="font-size:12px;color:#f3c6c6;line-height:1.4;margin-bottom:8px">
            В одиночном режиме активен <b>🤖 Бот (NPC-монстр)</b>. Чтобы играть за Игрока-монстра или против него, откройте кооператив.
          </div>
          <button id="mm_goto_coop" style="margin:0;padding:7px 14px;font-size:12.5px;background:#5b0e18;border:1px solid #ff4757;color:#fff;border-radius:5px;cursor:pointer;font-weight:bold">👥 Перейти в Кооператив</button>
        </div>
      `}
      <div style="display:flex;justify-content:flex-end">
        <button id="mm_done_btn" style="margin:0;padding:8px 18px;font-size:13px;background:#2a0b12;border:1px solid #a22;color:#fff;border-radius:5px;cursor:pointer;font-weight:bold">Закрыть</button>
      </div>
    </div>
  `;
  document.body.appendChild(d);
  trTree(d);
  openAnimatedModal(d, { immediate: wasOpen });

  const closeAndResume = () => closeMonsterModeModal(true);
  d.querySelector('#mm_close_x').onclick = closeAndResume;
  d.querySelector('#mm_done_btn').onclick = closeAndResume;
  d.onclick = e => { if (e.target === d) closeAndResume(); };

  const botBtn = d.querySelector('#mm_pick_bot');
  if (botBtn) {
    botBtn.onclick = () => {
      if (inCoop) {
        if (!isHost) {
          showToast(tr('Только хост может менять режим'));
          return;
        }
        coop.setCoopMode('bot');
      } else {
        showToast(tr('🤖 Режим: Бот-монстр'));
      }
    };
  }
  const playerBtn = d.querySelector('#mm_pick_player');
  if (playerBtn) {
    playerBtn.onclick = () => {
      if (!inCoop) {
        closeMonsterModeModal(false);
        if (state !== 'menu') toLobby();
        setTimeout(() => $('coop_section')?.scrollIntoView({ behavior: 'smooth' }), 60);
        return;
      }
      if (!isHost) {
        showToast(tr('Только хост может менять режим'));
        return;
      }
      coop.setCoopMode('player');
    };
  }
  const gotoCoopBtn = d.querySelector('#mm_goto_coop');
  if (gotoCoopBtn) {
    gotoCoopBtn.onclick = () => {
      closeMonsterModeModal(false);
      if (state !== 'menu') toLobby();
      setTimeout(() => $('coop_section')?.scrollIntoView({ behavior: 'smooth' }), 60);
    };
  }
  d.querySelectorAll('.mm-hunter-btn').forEach(btn => {
    btn.onclick = () => {
      if (!isHost) return;
      const pid = btn.getAttribute('data-pid');
      if (pid) coop.setHunter(pid);
    };
  });
}

coop.onRoomModeUpdate((room) => {
  if (coop.currentRoom) {
    renderActiveRoomCard(room, coop.getPeersList(), coop.isHost);
  }
  updateModeButtons();
  if (MP.on && room && (state === 'play' || state === 'menu' || state === 'intro')) {
    const isPM = room.coopMode === 'player';
    if (isPM) {
      mon.off = 1; mon.vis = 0; mon.st = 'patrol'; mon.x = -99; mon.y = -99;
      if (state === 'play') {
        say(coop.isHunterMe()
          ? tr('Режим изменён: Вы — МОНСТР! Догоняйте выживших. [G] — поставить ловушку.')
          : tr('Режим изменён: Игрок-монстр! Один из игроков охотится за вами.'), 5);
      }
    } else {
      const waitBase = ch == 2 && stg == 'base';
      mon.off = waitBase ? 1 : 0;
      if (!mon.off && (mon.x < 0 || mon.y < 0 || !Number.isFinite(mon.x))) {
        const list = Array.isArray(floors) && floors.length ? floors : [[12, 12]];
        let pick = list.find(f => Math.hypot(f[0] + 0.5 - px, f[1] + 0.5 - py) >= 8);
        if (!pick) {
          pick = list.reduce((best, f) => {
            const db = Math.hypot(best[0] + 0.5 - px, best[1] + 0.5 - py);
            const df = Math.hypot(f[0] + 0.5 - px, f[1] + 0.5 - py);
            return df > db ? f : best;
          }, list[0]);
        }
        mon.x = pick[0] + 0.5;
        mon.y = pick[1] + 0.5;
        mon.st = 'patrol';
        mon.path = [];
        mon.tx = -1;
        mon.lost = 0;
      }
      if (state === 'play') {
        say(tr('Режим изменён: 🤖 Бот (NPC-монстр) вышел на охоту!'), 4);
      }
    }
    updateMobileActionBtn();
    showToast(isPM ? tr('👹 Режим: Игрок-монстр') : tr('🤖 Режим: Бот-монстр'));
    if (modeModalOpen && document.getElementById('monster_mode_modal')) {
      openMonsterModeModal();
    }
  }
});

coop.onMonsterState((data) => {
  if (data && data.m) MP.m = data.m;
});

coop.onTrapPlaced((data) => {
  if (data && data.trap && state === 'play') {
    if (!traps.some(t => t.id && t.id === data.trap.id)) {
      traps.push({ id: data.trap.id, x: +data.trap.x, y: +data.trap.y, on: 1 });
    }
    if (!coop.isHunterMe()) say('Установлена новая ловушка!', 2.2);
  }
});

coop.onPeerCaught((data) => {
  if (!data) return;
  if (data.id === coop.peerId && state === 'play') {
    const hunterPeer = coop.getPeersList().find(p => p.isHunter || p.id === coop.currentRoom?.hunterId);
    MP.deadBySkin = hunterPeer?.monsterSkin || '';
    die();
  } else if (data.playerName && data.id !== coop.peerId) {
    say(data.playerName + ' пойман!', 3);
  }
});

let voteTickTimer = null;
function closeCoopVoteModal() {
  if (voteTickTimer) {
    clearInterval(voteTickTimer);
    voteTickTimer = null;
  }
  const el = document.getElementById('coop_vote_modal');
  if (el) closeAnimatedModal(el);
}

function renderCoopVoteModal(voteData, resultData = null) {
  if (!coop.currentRoom) return;
  let d = document.getElementById('coop_vote_modal');
  if (d && d.dataset?.uiClosing === '1') {
    disposeAnimatedModal(d);
    d = null;
  }
  const isNewVoteModal = !d;
  if (!d) {
    d = document.createElement('div');
    d.id = 'coop_vote_modal';
    d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Georgia,serif;padding:16px';
    document.body.appendChild(d);
  }
  const voters = Array.isArray(voteData?.voters) ? voteData.voters : [];
  const botVotes = voteData?.botVotes || 0;
  const playerVotes = voteData?.playerVotes || 0;
  const myVote = voters.find(v => v.id === coop.peerId)?.choice || '';
  const botVotersList = voters.filter(v => v.choice === 'bot').map(v => esc(v.name)).join(', ');
  const playerVotersList = voters.filter(v => v.choice === 'player').map(v => esc(v.name)).join(', ');
  const totalPlayers = voteData?.totalPlayers || (coop.getPeersList().length + 1);
  const endsAt = voteData?.endsAt || (Date.now() + 10000);
  const secsLeft = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

  d.innerHTML = `
    <div style="background:#14070a;border:2px solid #a22;border-radius:12px;padding:20px;max-width:480px;width:100%;box-shadow:0 0 40px rgba(180,20,30,0.55);color:#fff;box-sizing:border-box;text-align:center">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px">
        <div style="font-size:17px;font-weight:bold;color:#ffccd5;letter-spacing:0.06em">🗳 ГОЛОСОВАНИЕ: БОТ ИЛИ ИГРОК</div>
        <div id="coop_vote_timer" style="font-size:13px;font-weight:bold;color:#fde047;background:#2a1a06;border:1px solid #d97706;padding:3px 9px;border-radius:6px">${resultData ? '✓' : (secsLeft + 'с')}</div>
      </div>
      <div style="font-size:12.5px;color:#ccc;margin-bottom:14px">
        ${resultData
          ? (resultData.coopMode === 'player'
              ? '<span style="color:#ff8a96;font-weight:bold">Победил выбор: 👹 ИГРОК-МОНСТР! Запуск игры...</span>'
              : '<span style="color:#86efac;font-weight:bold">Победил выбор: 🤖 БОТ (NPC-МОНСТР)! Запуск игры...</span>')
          : tr('Проголосуйте в начале матча: против ИИ-бота или с Игроком-монстром!') + ' (' + voters.length + '/' + totalPlayers + ')'
        }
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;text-align:left">
        <button id="cv_btn_bot" style="margin:0;padding:12px;border-radius:8px;cursor:${resultData?'default':'pointer'};background:${myVote==='bot'?'rgba(20,60,36,0.9)':'#1a0a0e'};border:2px solid ${myVote==='bot'?'#2ed573':'#4a1b22'};color:#fff">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:14px;font-weight:bold;color:#86efac">🤖 БОТ</span>
            <span style="font-size:16px;font-weight:bold;color:#4ade80">${botVotes}</span>
          </div>
          <div style="font-size:11px;color:#ccc;line-height:1.3">ИИ-монстр патрулирует карту и охотится на шум.</div>
          ${botVotersList ? `<div style="margin-top:6px;font-size:10.5px;color:#86efac">✓ ${botVotersList}</div>` : ''}
        </button>
        <button id="cv_btn_player" style="margin:0;padding:12px;border-radius:8px;cursor:${resultData?'default':'pointer'};background:${myVote==='player'?'rgba(75,12,24,0.92)':'#1a0a0e'};border:2px solid ${myVote==='player'?'#ff4757':'#4a1b22'};color:#fff">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:14px;font-weight:bold;color:#ff9aa4">👹 ИГРОК</span>
            <span style="font-size:16px;font-weight:bold;color:#ff6b81">${playerVotes}</span>
          </div>
          <div style="font-size:11px;color:#ccc;line-height:1.3">Один из игроков охотится и ставит ловушки [G].</div>
          ${playerVotersList ? `<div style="margin-top:6px;font-size:10.5px;color:#ff9aa4">✓ ${playerVotersList}</div>` : ''}
        </button>
      </div>
    </div>
  `;
  trTree(d);
  if (isNewVoteModal) openAnimatedModal(d);

  if (!resultData) {
    const bBtn = d.querySelector('#cv_btn_bot');
    const pBtn = d.querySelector('#cv_btn_player');
    if (bBtn) bBtn.onclick = () => coop.castVote('bot');
    if (pBtn) pBtn.onclick = () => coop.castVote('player');
    if (!voteTickTimer) {
      voteTickTimer = setInterval(() => {
        const tmEl = document.getElementById('coop_vote_timer');
        if (!tmEl || !coop.currentVote?.active) return;
        const left = Math.max(0, Math.ceil((coop.currentVote.endsAt - Date.now()) / 1000));
        tmEl.textContent = left + 'с';
      }, 250);
    }
  }
}

coop.onVoteStart((voteData) => {
  renderCoopVoteModal(voteData, null);
});

coop.onVoteUpdate((voteData) => {
  if (coop.currentRoom) {
    renderActiveRoomCard(coop.currentRoom, coop.getPeersList(), coop.isHost);
  }
  if (voteData && voteData.active && document.getElementById('coop_vote_modal')) {
    renderCoopVoteModal(voteData, null);
  }
});

coop.onVoteEnd((data) => {
  if (data && data.reason === 'solo') {
    closeCoopVoteModal();
    return;
  }
  if (document.getElementById('coop_vote_modal')) {
    renderCoopVoteModal({
      botVotes: data?.botVotes || 0,
      playerVotes: data?.playerVotes || 0,
      voters: [],
    }, data);
  }
  updateModeButtons();
});

coop.onGameStart((data) => {
  closeCoopVoteModal();
  ch = Number(data.chapter) || 1;
  DIFF = data.difficulty || 'easy';
  DFM = DIFFS[DIFF] || DIFFS.easy;
  MP.on = true;
  MP.code = coop.currentRoom ? coop.currentRoom.code : '';
  MP.seed = data.seed || 123456;
  RN = mul(MP.seed);
  keys = 0;
  
  const m = $('mpm');
  if (m) m.textContent = 'Игра запущена! Загрузка лабиринта...';
  
  launchGameWithLoading(ch);
});

coop.onError((errMsg) => {
  const m = $('mpm');
  if (m) m.textContent = 'Ошибка: ' + errMsg;
  say(errMsg, 3);
});

coop.onKeyFound((data) => {
  keys = data.totalKeys;
  const sharedIt = data.keyIndex !== undefined ? items[data.keyIndex] : null;
  const wasOn = !sharedIt || sharedIt.on;
  if (ch == 4 && wasOn) {
    partsCarried++;
    if (sharedIt) {
      try { discoverVazPart((sharedIt.pIdx || 0) % PART_NAMES.length, PF, pWrite, { ac, TN }); } catch (e) {}
    }
  }
  if (sharedIt) {
    sharedIt.on = 0;
  }
  TN(900, .4, .2, 'triangle', 1400);
  whisper();
  say('Напарник ' + (data.playerName || '') + ' нашёл ключ (' + keys + '/' + NK() + ')!', 4);
});

// Bind Coop UI Buttons
setTimeout(() => {
  const btnCreate = $('btn_create_room');
  if (btnCreate) btnCreate.onclick = createCoopRoom;
  const btnJoin = $('btn_join_room');
  if (btnJoin) btnJoin.onclick = () => joinCoopRoom();
  const btnQuick = $('btn_quick_join');
  if (btnQuick) btnQuick.onclick = quickJoinCoop;
  const legacyMp = $('mp');
  if (legacyMp) legacyMp.onclick = createCoopRoom;
  const chSel = $('chs');
  if (chSel) chSel.addEventListener('change', syncCoopDiffSelect);
  const diffSel = $('coop_diff');
  if (diffSel) {
    diffSel.value = DIFF || 'easy';
    diffSel.addEventListener('change', () => {
      DIFF = diffSel.value || 'easy';
      DFM = DIFFS[DIFF] || DIFFS.easy;
    });
  }
  syncCoopDiffSelect();
  syncCoopProfile();
}, 50);

function lbTick(t){
  if(t-_gt>500){_gt=t;updG3();updG4()}
  const pb=$('pbtn');
  if(pb){
    const v=state=='menu'?'block':'none';
    if(pb.style.display!=v)pb.style.display=v;
  }
}
let cg=null,cStep=0,cNext=0,cInt=null,cOff=0;
function mN(t,dur,fr,vol,type){const s=ac.createBufferSource();s.buffer=nb;const f=ac.createBiquadFilter();f.type=type;f.frequency.value=fr;const gn=ac.createGain();gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(gn);gn.connect(cg);s.start(t,Math.random());s.stop(t+dur)}
function mT(t,f,dur,vol,type,f2,lp){const o=ac.createOscillator(),gn=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+dur);let n=o;if(lp){const b=ac.createBiquadFilter();b.type='lowpass';b.frequency.value=lp;o.connect(b);n=b}n.connect(gn);gn.connect(cg);o.start(t);o.stop(t+dur+.02)}
function chaseStart(){cg=ac.createGain();cg.gain.value=0;cg.connect(musGain||mst);cNext=ac.currentTime+.05;cStep=0;cInt=setInterval(()=>{if(!ac||!cg)return;const d=Math.hypot(px-mon.x,py-mon.y),bpm=150+(1-Math.min(1,d/12))*35,sp=60/bpm/4;while(cNext<ac.currentTime+.25){mStep(cStep,cNext);cNext+=sp;cStep++}},60)}
function chaseStop(){clearInterval(cInt);cInt=null;try{cg.disconnect()}catch(e){}cg=null}
function mStep(s,t){const b=s%16,bar=(s/16)|0;
if(b%4==0)mT(t,130,.16,.9,'sine',38);
if(b==4||b==12){mN(t,.16,1800,.35,'bandpass');mT(t,220,.1,.25,'triangle',110)}
mN(t,.04,8000,b%2?.03:.07,'highpass');
const bs=[1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0][b];if(bs){const f=(b==6||b==13)?43.65:(b==10?46.25:41.2);mT(t,f*2,.14,.5,'sawtooth',null,320);mT(t,f,.18,.6,'sine')}
if(b==0&&bar%2==0){for(const f of[164.8,174.6,233.1])mT(t,f,.35,.07,'sawtooth',null,2400);mT(t,880,.5,.05,'square',1320,3000)}
if(b==8&&bar%4==3)mT(t,500,1.2,.06,'sawtooth',1100,2600);
if(b%8==2&&bar%2==1)mT(t,1500+((s*37)%5)*80,.08,.05,'square')}
function musTick(){try{lobbyMusic.updateState(state)}catch(e){}if(!ac||!mon)return;const want=state=='play'&&mon.st=='hunt'?(hid?.28:.6):0;
if(want>0){if(!cInt)chaseStart();cOff=0}else if(cInt){cOff++;if(cOff>240)chaseStop()}
if(cg)cg.gain.setTargetAtTime(want,ac.currentTime,want>0?.15:.6)}
let ch=1,EX=N-.5,EY=N-1.5,cT=0,nextLt=10,ltFl=0,nextMB=3,mbI=0;const MBN=[659,622,659,622,659,494,587,523,440,262,330,440,494,330,415,494,523];
function mansion(){map=[...Array(N)].map(()=>Array(N).fill(1));const R=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=0};
R(6,1,14,10);R(6,12,14,19);R(8,11,12,11);R(1,1,4,8);R(1,10,4,19);R(16,1,19,8);R(16,10,19,19);R(5,4,5,5);R(5,14,5,15);R(15,4,15,5);R(15,14,15,15);
for(const[x,y]of[[3,0],[10,0],[17,0],[0,5],[0,14],[20,5],[20,14],[4,20],[16,20],[7,20],[13,20]])map[y][x]=4;
for(const[x,y]of[[8,3],[12,3],[8,8],[12,8],[9,13],[10,13],[11,13],[7,16],[13,16],[2,3],[3,3],[2,6],[3,6],[2,13],[3,13],[2,17],[3,17],[17,4],[18,4],[17,5],[18,5],[17,13],[18,13],[17,17],[18,17]])map[y][x]=1;
map[20][10]=3;EX=10.5;EY=20.5}
function win4(x,top,lh,wx,colW=1){if(wx<.07||wx>.93||Math.abs(wx-.5)<.02){g.fillStyle='rgb(40,28,20)';g.fillRect(x,top,colW,lh);return}
g.fillStyle='rgba(70,100,170,'+(.3+ltFl*.6)+')';g.fillRect(x,top+lh*.12,colW,lh*.6);g.fillStyle='rgb(40,28,20)';g.fillRect(x,top+lh*.4,colW,Math.max(1,lh*.02));
if(wx<.2||wx>.8){g.fillStyle='rgba(110,20,30,.8)';g.fillRect(x,top,colW,lh*.85)}}
function dirt(x,top,lh,sh,wx,h,colW=1){const q=(wx*48|0),c=((q*2654435761+h*40503)>>>0)%100,k=Math.min(1,sh*1.2);
if(c<30){g.fillStyle='rgba(30,22,10,.55)';g.fillRect(x,top,colW,lh*(.12+c/100*1.1))}
if(h%6<2&&wx<.4){g.fillStyle='rgba('+(18*k|0)+','+(38*k|0)+','+(20*k|0)+',.55)';g.fillRect(x,top+lh*.05,colW,lh*.28*(1-wx*1.6))}
if(c>=80&&c<86){g.fillStyle='rgba('+(140*k|0)+','+(128*k|0)+','+(105*k|0)+',.45)';g.fillRect(x,top+lh*.12,colW,lh*.35)}
g.fillStyle='rgba(10,6,3,.5)';g.fillRect(x,top+lh*.85,colW,lh*.15);
if(h%9==4&&wx>.4&&wx<.6){g.fillStyle='rgb('+(105*k|0)+',0,0)';g.fillRect(x,top+lh*(.3+(c%10)/60),colW,lh*(.12+(Math.abs(wx-.5)<.04?.5:0)))}
if(h%13==7&&c%9==0){g.fillStyle='rgba(0,0,0,.5)';g.fillRect(x,top+lh*.2,colW,lh*.3)}}
function wood(x,top,lh,sh,wx,h,colW=1){g.fillStyle='rgb('+(58*sh|0)+','+(34*sh|0)+','+(22*sh|0)+')';g.fillRect(x,top+lh*.66,colW,lh*.34);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x,top+lh*.66,colW,Math.max(1,lh*.015));
if(h<16&&wx>.25&&wx<.75){const fr=wx<.28||wx>.72;g.fillStyle=fr?'rgb('+(170*sh|0)+','+(130*sh|0)+',40)':'rgb('+(18*sh|0)+','+(12*sh|0)+','+(14*sh|0)+')';g.fillRect(x,top+lh*.14,colW,lh*.42);
if(!fr&&wx>.38&&wx<.62){g.fillStyle='rgb('+(120*sh|0)+','+(105*sh|0)+','+(95*sh|0)+')';g.fillRect(x,top+lh*.22,colW,lh*.26);if(Math.abs(wx-.45)<.012||Math.abs(wx-.55)<.012){g.fillStyle='#000';g.fillRect(x,top+lh*.31,colW,lh*.05);g.fillStyle='rgba(255,60,40,'+Math.min(1,sh*3)+')';g.fillRect(x,top+lh*.33,colW,Math.max(1,lh*.015))}}}}
function beginChapter(){if(ch==2){stg='base';UPF=false;STF=0}state='chap';cT=0;ev={};genDone=false;nextLt=10;nextMB=3}
function endChap(){if(!genDone){gen();genDone=true}state='play';cv.style.filter='';cv.style.transform='';const carN=getCarSpec(PF.eqCar||'vaz2112').name;say(ch==4?('Гаражи. Собери детали внутри боксов и установи на '+carN+'.'):ch==3?'Кладбище. Найди 3 ключа и открой ворота.':'Подвал. Найди отмычку и вскрой дверь.',6);try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
function chapScr(dt){cT+=dt;cv.style.transform='';cv.style.filter='';g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);g.textAlign='center';g.textBaseline='middle';const carN=getCarSpec(PF.eqCar||'vaz2112').name;
once('c0',()=>{NZ(1.2,200,.8);TN(70,.8,.8,'sine',30)});if(cT>2)once('c1',()=>{NZ(2,250,.7);TN(55,1.5,.7,'sine',28)});
if(cT>1){g.globalAlpha=Math.min(1,cT-1);g.fillStyle='#a22';g.font='28px Georgia';g.fillText(ch==4?'ГЛАВА 4':ch==3?'ГЛАВА 3':'ГЛАВА 2',W/2,70)}
if(cT>2){g.globalAlpha=Math.min(1,cT-2);g.fillStyle='#caa';g.font='italic 16px Georgia';g.fillText(ch==4?'ГАРАЖИ':ch==3?'КЛАДБИЩЕ':'ОСОБНЯК',W/2,100)}
if(cT>3.5){g.globalAlpha=Math.min(1,cT-3.5);g.fillStyle='#888';g.font='11px Georgia';g.fillText(ch==4?('Гаражный кооператив №14. Под проливным дождём стоит '+carN+'.'):ch==3?'Ты очнулся среди надгробий. Ворота заперты.':'Ты очнулся в подвале старого особняка. Нужно выбраться.',W/2,140);g.fillText(ch==4?'Обыщи открытые гаражи, поставь детали на машину и уезжай. Механик рядом.':ch==3?'Найди 3 ключа. Могильщик уже идёт.':'Найди друга, которого забрала Хозяйка.',W/2,156)}
g.globalAlpha=1;if(cT>8)endChap()}
$('g2').onclick=()=>{if(MP.on){try{MP.room.leave()}catch(e){}MP.on=false}prev=null;$('cont').style.display='none';ch=2;start()};
let corpses=[];
function mkCorpse(k){return mk(160,48,x=>{const bp=x.createRadialGradient(84,37,4,84,37,72);bp.addColorStop(0,'rgba(105,6,8,.96)');bp.addColorStop(.55,'rgba(68,2,4,.72)');bp.addColorStop(1,'rgba(40,0,0,0)');x.fillStyle=bp;x.beginPath();x.ellipse(84,37,74,11,0,0,7);x.fill();
const cl=['#292d38','#541c28','#423a28'][k],pn=['#1a1c22','#22161c','#2c2820'][k],sk='#aba090';x.lineCap='round';
x.strokeStyle=pn;x.lineWidth=7.5;x.beginPath();x.moveTo(60,34);x.lineTo(31,30);x.lineTo(13,38);x.moveTo(60,37);x.lineTo(34,42);x.lineTo(9,33);x.stroke();
x.fillStyle='#141212';x.fillRect(6,34,9,6);x.fillRect(2,30,8,5);
x.fillStyle=cl;x.beginPath();x.ellipse(84,30,27,10.5,.04,0,7);x.fill();
x.fillStyle='rgba(122,8,12,.92)';x.beginPath();x.ellipse(88,29,11,5.5,0,0,7);x.fill();
x.strokeStyle='#ded2bc';x.lineWidth=1.4;for(let ri=0;ri<3;ri++){x.beginPath();x.moveTo(82+ri*5,26);x.lineTo(84+ri*5,32);x.stroke()}
x.strokeStyle=cl;x.lineWidth=5;x.beginPath();x.moveTo(102,26);x.lineTo(118,21);x.moveTo(99,34);x.lineTo(114,41);x.stroke();
x.strokeStyle=sk;x.lineWidth=3.6;x.beginPath();x.moveTo(118,21);x.lineTo(132,29);x.moveTo(114,41);x.lineTo(136,39);x.stroke();
x.fillStyle=sk;x.beginPath();x.ellipse(144,29,10.5,9,.18,0,7);x.fill();x.fillStyle=k==1?'#321810':k==2?'#54524c':'#111';x.beginPath();x.ellipse(148,26,9,6.8,.18,0,7);x.fill();
x.fillStyle='#080505';x.fillRect(137,27,3.5,2.8);x.fillRect(142,27,3,2.5);x.fillStyle='#240204';x.fillRect(138,33,5,3);x.fillStyle='rgba(130,6,10,.92)';x.fillRect(139,35,2.5,9)})}
const corpseImgs=[0,1,2].map(mkCorpse);
let nextHum=0,humI=0,subF=0,lkT=0,lkO=0;function lkKill(){if(lkT>0)return;lkT=.001;mon.x=hx;mon.y=hy;mon.path=[];for(let i=0;i<4;i++)setTimeout(()=>{NZ(.12,250,.9);TN(90,.12,.7,'square',50)},i*130)}const HUM=[392,370,330,311,294,330,370,392,349,311,294,262];
let VG=null,RB=null;
const DEFK={fwd:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD',sprint:'ShiftLeft',sneak:'KeyC',flash:'KeyF',use:'KeyE',lobby:'KeyT'};
const SET={lang:'ru',jaUnlocked:0,sens:1,tsens:1,inv:0,fov:67,shake:1,bob:1,vol:1,musVol:.8,sfxVol:.9,lobbyMusic:1,joySize:120,camShakal:1,keys:Object.assign({},DEFK)};
try{const raw=localStorage.getItem('horror_s');if(raw){const s=JSON.parse(raw);Object.assign(SET,s);SET.keys=Object.assign({},DEFK,s.keys||{})}else{const l=(navigator.language||'ru').slice(0,2);SET.lang=l=='uk'?'uk':l=='de'?'de':l=='ja'?'ja':l=='ru'?'ru':'en'}}catch(e){}
if(SET.lang==='ja'){SET.jaUnlocked=1}
if(PF.jaUnlocked||SET.jaUnlocked){PF.jaUnlocked=1;SET.jaUnlocked=1}
if(!['ru','en','uk','de','ja'].includes(SET.lang))SET.lang='ru';
if(SET.lang==='ja'&&!SET.jaUnlocked&&!PF.jaUnlocked)SET.lang='ru';
setLangGetter(()=>SET.lang);
if(SET.musVol===undefined)SET.musVol=.8;
if(SET.sfxVol===undefined)SET.sfxVol=.9;
if(SET.lobbyMusic===undefined)SET.lobbyMusic=1;
if(SET.joySize===undefined)SET.joySize=120;
if(SET.camShakal===undefined)SET.camShakal=1;
const sv=()=>{try{localStorage.setItem('horror_s',JSON.stringify(SET))}catch(e){}};
const FOVK=()=>Math.tan(SET.fov*Math.PI/360),LOCALE=()=>getLocale(SET.lang),aVol=()=>{if(VG)VG.gain.value=SET.vol!==undefined?SET.vol:1;if(musGain)musGain.gain.value=SET.musVol!==undefined?SET.musVol:.8;if(sfxGain)sfxGain.gain.value=SET.sfxVol!==undefined?SET.sfxVol:.9;try{lobbyMusic.setEnabled(SET.lobbyMusic!==0);lobbyMusic.setVolume((SET.musVol!==undefined?SET.musVol:.8)*0.75)}catch(e){}};
const ro=()=>{try{if(coop&&coop.lastRooms)renderCoopRooms(coop.lastRooms,coop.onlineCount)}catch(e){}};

function testSfx(){
  aud();if(!ac)return;try{ac.resume();}catch(e){}
  TN(160,.25,.65,'sawtooth',75);
  NZ(.35,1200,.7,0,'bandpass');
  setTimeout(()=>{
    TN(440,.2,.5,'square',220);
    NZ(.18,900,.4);
  },100);
}
function testMusic(){
  aud();if(!ac)return;try{ac.resume();}catch(e){}
  [220,261.6,311.1,415.3].forEach((f,i)=>{
    setTimeout(()=>{
      if(!ac)return;
      const o=ac.createOscillator(),gn=ac.createGain();
      o.type='sine';o.frequency.value=f;
      gn.gain.setValueAtTime(.18,ac.currentTime);
      gn.gain.exponentialRampToValueAtTime(.001,ac.currentTime+1.2);
      o.connect(gn);gn.connect(musGain||mst);
      o.start();o.stop(ac.currentTime+1.2);
    },i*130);
  });
}

function showSoundModal(){
  let m=$('snd_modal');
  if(m)disposeAnimatedModal(m);
  m=document.createElement('div');
  m.id='snd_modal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);z-index:9600;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';
  
  const vMaster=Math.round((SET.vol!==undefined?SET.vol:1)*100);
  const vMus=Math.round((SET.musVol!==undefined?SET.musVol:0.8)*100);
  const vSfx=Math.round((SET.sfxVol!==undefined?SET.sfxVol:0.9)*100);

  m.innerHTML=`
    <div style="background:#090406;border:2px solid #7f1d1d;width:100%;max-width:480px;border-radius:8px;padding:22px;color:#e7dec8;font-family:Georgia,serif;box-shadow:0 0 38px rgba(139,30,37,0.48), inset 0 0 28px rgba(45,6,10,0.45);position:relative;box-sizing:border-box">
      <button id="snd_close" style="position:absolute;top:14px;right:16px;background:transparent;border:0;color:#9b8e84;font-size:20px;cursor:pointer;padding:4px">✕</button>
      
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:44px;height:44px;border-radius:6px;background:#2a090d;border:1px solid #8b1e25;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 0 15px rgba(153,27,27,0.5)">
          🔊
        </div>
        <div>
          <h2 style="margin:0;font-size:20px;color:#e7dec8;letter-spacing:0.08em">НАСТРОЙКИ ЗВУКА</h2>
          <div style="font-size:12px;color:#9b8e84">Баланс музыки, эмбиента и хоррор-эффектов</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:14px;background:#100608;border:1px solid #451218;border-radius:6px;padding:14px 16px;margin-bottom:14px">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:14px;color:#e7dec8;font-weight:bold">🔊 Общая громкость</span>
            <span id="snd_val_master" style="font-size:13px;color:#fca5a5;font-weight:bold">${vMaster}%</span>
          </div>
          <input id="snd_sl_master" type="range" min="0" max="1" step="0.02" value="${SET.vol!==undefined?SET.vol:1}" style="width:100%;accent-color:#b91c1c;cursor:pointer" />
          <div style="font-size:11px;color:#8a7d74;margin-top:2px">Управляет всем звуковым потоком игры</div>
        </div>

        <div style="border-top:1px solid #2b0d12;padding-top:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:14px;color:#e7dec8;font-weight:bold">🎵 Музыка и эмбиент</span>
            <span id="snd_val_mus" style="font-size:13px;color:#fca5a5;font-weight:bold">${vMus}%</span>
          </div>
          <input id="snd_sl_mus" type="range" min="0" max="1" step="0.02" value="${SET.musVol!==undefined?SET.musVol:0.8}" style="width:100%;accent-color:#991b1b;cursor:pointer" />
          <div style="font-size:11px;color:#8a7d74;margin-top:2px">Фоновый гул, жуткие дроны, музыка погони</div>
        </div>

        <div style="border-top:1px solid #2b0d12;padding-top:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:14px;color:#e7dec8;font-weight:bold">💥 Хоррор-эффекты</span>
            <span id="snd_val_sfx" style="font-size:13px;color:#fca5a5;font-weight:bold">${vSfx}%</span>
          </div>
          <input id="snd_sl_sfx" type="range" min="0" max="1" step="0.02" value="${SET.sfxVol!==undefined?SET.sfxVol:0.9}" style="width:100%;accent-color:#dc2626;cursor:pointer" />
          <div style="font-size:11px;color:#8a7d74;margin-top:2px">Скримеры, шаги, рык, ловушки, стук сердца и фонарик</div>
        </div>

        <div style="border-top:1px solid #2b0d12;padding-top:12px;display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:14px;color:#e7dec8;font-weight:bold;display:flex;align-items:center;gap:6px">
              <span>🎻</span> <span>Фоновая музыка в лобби</span>
            </div>
            <div style="font-size:11px;color:#8a7d74;margin-top:2px">Атмосферный эмбиент и мелодия в главном меню</div>
          </div>
          <button id="snd_toggle_lobby_mus" style="margin:0;padding:6px 14px;font-size:12px;background:${SET.lobbyMusic!==0 ? '#3b0a10' : '#140c0d'};border:1px solid ${SET.lobbyMusic!==0 ? '#b91c1c' : '#555'};color:${SET.lobbyMusic!==0 ? '#fecaca' : '#888'};border-radius:4px;cursor:pointer;font-weight:bold;transition:all 0.2s ease">
            ${SET.lobbyMusic!==0 ? '✓ ВКЛЮЧЕНА' : '✕ ВЫКЛЮЧЕНА'}
          </button>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:14px">
        <button id="snd_test_sfx" style="flex:1;margin:0;padding:8px;font-size:12px;background:#240a0e;border:1px solid #7f1d1d;color:#fecaca;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px">
          <span>💥</span><span>Тест эффектов</span>
        </button>
        <button id="snd_test_mus" style="flex:1;margin:0;padding:8px;font-size:12px;background:#1c1208;border:1px solid #92400e;color:#fde68a;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px">
          <span>🎵</span><span>Тест музыки</span>
        </button>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
        <button id="snd_pre_night" style="flex:1;min-width:70px;margin:0;padding:6px 8px;font-size:11px;background:#14090b;border:1px solid #4a191f;color:#cbbba8;border-radius:4px;cursor:pointer">🌙 Ночь (30%)</button>
        <button id="snd_pre_std" style="flex:1;min-width:70px;margin:0;padding:6px 8px;font-size:11px;background:#14090b;border:1px solid #4a191f;color:#cbbba8;border-radius:4px;cursor:pointer">⚖ Норма (70%)</button>
        <button id="snd_pre_max" style="flex:1;min-width:70px;margin:0;padding:6px 8px;font-size:11px;background:#14090b;border:1px solid #4a191f;color:#cbbba8;border-radius:4px;cursor:pointer">💀 100%</button>
        <button id="snd_pre_mute" style="flex:1;min-width:70px;margin:0;padding:6px 8px;font-size:11px;background:#220808;border:1px solid #7f1d1d;color:#fca5a5;border-radius:4px;cursor:pointer">🔇 Мут</button>
      </div>

      <button id="snd_save" style="width:100%;margin:0;padding:11px;background:#5c0d14;border:1px solid #b91c1c;color:#e7dec8;border-radius:5px;font-size:15px;font-weight:bold;cursor:pointer;box-shadow:0 0 18px rgba(153,27,27,0.45)">
        ПРИМЕНИТЬ И ЗАКРЫТЬ
      </button>
    </div>
  `;

  document.body.appendChild(m);
  openAnimatedModal(m);

  const slMaster=$('snd_sl_master'), valMaster=$('snd_val_master');
  const slMus=$('snd_sl_mus'), valMus=$('snd_val_mus');
  const slSfx=$('snd_sl_sfx'), valSfx=$('snd_val_sfx');
  const btnLobbyMus=$('snd_toggle_lobby_mus');

  const updateSliders = () => {
    slMaster.value = SET.vol; valMaster.textContent = Math.round(SET.vol*100)+'%';
    slMus.value = SET.musVol; valMus.textContent = Math.round(SET.musVol*100)+'%';
    slSfx.value = SET.sfxVol; valSfx.textContent = Math.round(SET.sfxVol*100)+'%';
    if(btnLobbyMus){
      const on = SET.lobbyMusic !== 0;
      btnLobbyMus.textContent = on ? '✓ ВКЛЮЧЕНА' : '✕ ВЫКЛЮЧЕНА';
      btnLobbyMus.style.background = on ? '#3b0a10' : '#140c0d';
      btnLobbyMus.style.borderColor = on ? '#b91c1c' : '#555';
      btnLobbyMus.style.color = on ? '#fecaca' : '#888';
    }
  };

  if(btnLobbyMus){
    btnLobbyMus.onclick = () => {
      SET.lobbyMusic = (SET.lobbyMusic !== 0) ? 0 : 1;
      sv(); aVol();
      updateSliders();
      aud();
      if(ac && ac.state === 'suspended') ac.resume();
      try{lobbyMusic.setEnabled(SET.lobbyMusic !== 0);lobbyMusic.updateState(state);}catch(e){}
    };
  }

  slMaster.oninput = () => {
    SET.vol = +slMaster.value;
    valMaster.textContent = Math.round(SET.vol*100)+'%';
    sv(); aVol();
  };
  slMus.oninput = () => {
    SET.musVol = +slMus.value;
    valMus.textContent = Math.round(SET.musVol*100)+'%';
    sv(); aVol();
  };
  slSfx.oninput = () => {
    SET.sfxVol = +slSfx.value;
    valSfx.textContent = Math.round(SET.sfxVol*100)+'%';
    sv(); aVol();
  };

  $('snd_test_sfx').onclick = testSfx;
  $('snd_test_mus').onclick = testMusic;

  $('snd_pre_night').onclick = () => { SET.vol=0.3; SET.musVol=0.25; SET.sfxVol=0.35; sv(); aVol(); updateSliders(); };
  $('snd_pre_std').onclick = () => { SET.vol=0.7; SET.musVol=0.65; SET.sfxVol=0.75; sv(); aVol(); updateSliders(); };
  $('snd_pre_max').onclick = () => { SET.vol=1; SET.musVol=1; SET.sfxVol=1; sv(); aVol(); updateSliders(); };
  $('snd_pre_mute').onclick = () => { SET.vol=0; sv(); aVol(); updateSliders(); };

  const closeSoundModal = () => closeAnimatedModal(m);
  $('snd_close').onclick = closeSoundModal;
  $('snd_save').onclick = closeSoundModal;
  m.onclick = (e) => { if(e.target === m) closeSoundModal(); };
}
const _ft=g.fillText.bind(g);g.fillText=(s,x,y)=>_ft(tr(s),x,y);
new MutationObserver(ms=>{for(const m of ms){if(m.type=='characterData')trNode(m.target);else m.addedNodes.forEach(trTree)}}).observe(document.body,{childList:true,subtree:true,characterData:true});
function mapKey(c){for(const a in DEFK)if(SET.keys[a]===c)return DEFK[a];for(const a in DEFK)if(DEFK[a]===c)return null;return c}
const ki=e=>{if(e._m)return;const t=e.target;if(t&&(t.tagName=='INPUT'||t.tagName=='SELECT'||t.tagName=='TEXTAREA'))return;
if(RB){e.stopImmediatePropagation();if(e.type=='keydown'){e.preventDefault();if(e.code!='Escape'){const old=SET.keys[RB];for(const a in SET.keys)if(a!=RB&&SET.keys[a]==e.code)SET.keys[a]=old;SET.keys[RB]=e.code}RB=null;sv();rKeys()}return}
const c=mapKey(e.code);if(c===e.code)return;e.stopImmediatePropagation();if(c){const n=new KeyboardEvent(e.type,{code:c,key:e.key,repeat:e.repeat});n._m=1;window.dispatchEvent(n)}};
addEventListener('keydown',ki,true);addEventListener('keyup',ki,true);
const ACT=[['fwd','Вперёд'],['back','Назад'],['left','Влево'],['right','Вправо'],['sprint','Бег'],['sneak','Красться'],['flash','Телефон'],['use','Действие'],['lobby','В лобби']];
const KN={ShiftLeft:'Shift',ShiftRight:'R-Shift',ControlLeft:'Ctrl',Space:'Space',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'};
function rKeys(){const el=$('s_keys');if(!el)return;el.textContent='';for(const[a,n]of ACT){const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #311';const l=document.createElement('span');l.textContent=n;const b=document.createElement('button');b.style.cssText='margin:0;padding:4px 12px;font-size:13px;min-width:90px';b.textContent=RB==a?'Нажми клавишу…':(KN[SET.keys[a]]||String(SET.keys[a]).replace(/^(Key|Digit)/,''));b.onclick=()=>{RB=a;rKeys()};r.append(l,b);el.appendChild(r)}trTree(el)}
let _deClicks=0;
(()=>{const p=document.createElement('div');p.id='settings_modal';p.className='ui-modal-backdrop';p.style.cssText='position:fixed;inset:0;z-index:30;background:#000f;display:none;overflow:auto;padding:16px;box-sizing:border-box;color:#ccc;font:15px Georgia';
const h3=t=>`<h3 style='color:#c66;margin:18px 0 6px'>${t}</h3>`,sl=(id,l,mn,mx,st)=>`<div style='display:flex;justify-content:space-between;align-items:center;padding:6px 0'><span>${l}</span><span><input id='${id}' type='range' min='${mn}' max='${mx}' step='${st}' style='width:150px;padding:0;margin:0;border:0;background:transparent'> <b id='${id}_v' style='display:inline-block;min-width:68px;text-align:right'></b></span></div>`,ck=(id,l)=>`<div style='display:flex;justify-content:space-between;align-items:center;padding:6px 0'><span>${l}</span><input id='${id}' type='checkbox' style='width:22px;height:22px;padding:0;margin:0'></div>`;
p.innerHTML=`<div style='max-width:520px;margin:0 auto'><div style='display:flex;justify-content:space-between;align-items:center'><h2 style='margin:0;letter-spacing:.15em;color:#c44'>НАСТРОЙКИ</h2><button id='scl' style='margin:0;padding:6px 14px'>✕</button></div>${h3('Язык')}<select id='s_lang' style='background:#111;color:#ddd;border:1px solid #522;padding:10px;font:15px Georgia;width:100%'></select><div id='s_lang_btns' style='display:flex;flex-wrap:wrap;gap:6px;margin-top:8px'></div>${h3('Камера и графика')}${sl('s_shakal','Шакальность камеры',0,3,1)}${sl('s_sens','Чувствительность мыши',.3,3,.1)}${sl('s_tsens','Чувствительность касаний',.3,3,.1)}${sl('s_fov','Угол обзора',50,100,1)}${ck('s_inv','Инвертировать поворот')}${ck('s_shake','Тряска камеры')}${ck('s_bob','Покачивание при ходьбе')}${h3('Мобильное управление')}${sl('s_joy_size','Размер джойстика',80,280,10)}<div style='margin:4px 0 8px'><button id='s_joy_tablet' type='button' style='margin:0;padding:6px 12px;font-size:12px;background:#1a0e10;border:1px solid #7f1d1d;color:#e7dec8;border-radius:4px;cursor:pointer'>📱 Планшет (Большой 240px)</button></div>${h3('Звук')}${sl('s_vol','Общая громкость',0,1,.05)}${sl('s_mus_vol','Музыка и эмбиент',0,1,.05)}${sl('s_sfx_vol','Хоррор-эффекты',0,1,.05)}<div style='margin-top:6px'><button id='s_snd_adv' style='margin:0;padding:7px 14px;font-size:13px;background:#2a090d;border:1px solid #8b1e25;color:#fecaca;border-radius:4px;cursor:pointer'>🔊 Открыть панель звука и тест</button></div>${h3('Коды')}<div style='margin-top:6px'><button id='s_codes_btn' type='button' style='margin:0;padding:8px 16px;font-size:13.5px;background:#1c080c;border:1px solid #991b1b;color:#f3d2cf;border-radius:4px;cursor:pointer;font-weight:bold;letter-spacing:0.06em'>🎟 Коды</button></div>${h3('Управление (Клавиатура)')}<div id='s_keys'></div><button id='s_rst' style='margin-top:10px;padding:6px 14px;font-size:13px'>Сбросить управление</button><p style='font-size:12px;color:#777'>Стрелки ←→ всегда поворачивают камеру, ↑↓ двигают вперёд и назад.</p></div>`;document.body.appendChild(p);
const bS=(id,key)=>{const e=$(id),v=$(id+'_v');if(!e)return;e.value=SET[key];const sh=()=>{
if(key=='vol'||key=='musVol'||key=='sfxVol')v.textContent=Math.round((SET[key]!==undefined?SET[key]:1)*100)+'%';
else if(key=='fov')v.textContent=SET.fov+'°';
else if(key=='joySize')v.textContent=(SET.joySize||120)+'px';
else if(key=='camShakal'){const labels=['0 (Выкл)','1 (Лёгкая)','2 (Средняя)','3 (Высокая)'];v.textContent=labels[SET.camShakal]||String(SET.camShakal);trTree(v);}
else v.textContent=(+e.value).toFixed(1);
};sh();e.oninput=()=>{
SET[key]=+e.value;sh();sv();
if(key=='vol'||key=='musVol'||key=='sfxVol')aVol();
if(key=='joySize'&&window.__applyJoySize)window.__applyJoySize();
if(key=='camShakal')syncCanvasScale();
}},bC=(id,key)=>{const e=$(id);if(!e)return;e.checked=!!SET[key];e.onchange=()=>{SET[key]=e.checked?1:0;sv()}};
bS('s_sens','sens');bS('s_tsens','tsens');bS('s_fov','fov');bS('s_vol','vol');bS('s_mus_vol','musVol');bS('s_sfx_vol','sfxVol');bS('s_joy_size','joySize');bS('s_shakal','camShakal');bC('s_inv','inv');bC('s_shake','shake');bC('s_bob','bob');rKeys();
const renderLangControls=()=>{
  const sel=$('s_lang'),wrap=$('s_lang_btns');
  const jaOpen=!!(PF.jaUnlocked||SET.jaUnlocked);
  const langs=[['ru','🇷🇺 Русский'],['en','🇬🇧 English'],['uk','🇺🇦 Українська'],['de','🇩🇪 Deutsch']];
  if(jaOpen)langs.push(['ja','🇯🇵 日本語']);
  if(sel){
    sel.innerHTML=langs.map(([code,label])=>`<option value='${code}'>${label}</option>`).join('');
    sel.value=SET.lang;
  }
  if(wrap){
    wrap.textContent='';
    langs.forEach(([code,label])=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.textContent=label;
      const active=SET.lang===code;
      btn.style.cssText=`margin:0;padding:7px 12px;font-size:13px;border-radius:6px;cursor:pointer;font-family:Georgia,serif;border:1.5px solid ${active?'#ff4757':'#4a1e24'};background:${active?'#4a1218':'#14080a'};color:${active?'#fff':'#ccc'};${active?'box-shadow:0 0 10px rgba(255,71,87,0.45);font-weight:bold':''}`;
      btn.onclick=()=>selectLanguage(code,true);
      wrap.appendChild(btn);
    });
  }
};
const selectLanguage=(code,fromUser=true)=>{
  let nextLang=code;
  const jaWasUnlocked=!!(PF.jaUnlocked||SET.jaUnlocked);
  if(fromUser&&code==='de'){
    _deClicks++;
    if(!jaWasUnlocked&&_deClicks>=3){
      PF.jaUnlocked=1;SET.jaUnlocked=1;nextLang='ja';_deClicks=0;
      aud();
      try{TN(523,.12,.22,'sine');setTimeout(()=>TN(784,.25,.26,'triangle'),110)}catch(e){}
      const msgJa=tr('Секретный японский язык открыт навсегда!','ja');
      say(msgJa,6);showToast(msgJa);
    }
  }else if(fromUser){
    _deClicks=0;
  }
  SET.lang=nextLang;
  if(nextLang==='ja'){PF.jaUnlocked=1;SET.jaUnlocked=1;}
  sv();pWrite();
  if(fromUser&&nextLang!=='ru'){
    try{unlockAchievement('polyglot',{PF,pWrite,ac,TN})}catch(e){}
  }
  clearTrCache();
  document.documentElement.lang=SET.lang;
  document.title=tr('Не Оборачивайся - Хоррор 3D');
  renderLangControls();
  trTree(document.body);
  bS('s_shakal','camShakal');
  if(typeof updPf==='function'&&$('pfd'))updPf();
  ro();rKeys();renderSocialBar();renderAcct();
  if(typeof updG3==='function')updG3();
  if(typeof updG4==='function')updG4();
  if(typeof syncCoopDiffSelect==='function')syncCoopDiffSelect();
  if(typeof renderDif==='function')renderDif();
  updateMobileActionBtn();
  try{updateQuestBadge()}catch(e){}
  try{updateCoopStylePreview()}catch(e){}
  try{if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}catch(e){}
};
renderLangControls();
const openCodesModal=()=>{
  let cm=document.getElementById('codes_modal');
  if(cm)disposeAnimatedModal(cm);
  cm=document.createElement('div');
  cm.id='codes_modal';
  cm.style.cssText='position:fixed;inset:0;background:rgba(2,1,2,0.92);backdrop-filter:blur(7px);z-index:9910;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Georgia,serif';
  cm.innerHTML=`<div style="background:#050203;border:1px solid #5c141b;border-radius:4px;padding:20px;max-width:400px;width:100%;color:#e7dec8;box-shadow:0 0 42px rgba(153,27,27,0.45),inset 0 0 28px rgba(0,0,0,0.9);box-sizing:border-box">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2b090d;padding-bottom:10px;margin-bottom:14px">
      <b style="color:#d9534f;letter-spacing:0.12em;font-size:16px">🎟 КОДЫ</b>
      <button id="cm_close" type="button" style="margin:0;background:#0c0305;border:1px solid #451014;color:#a89a88;padding:3px 9px;border-radius:2px;cursor:pointer">✕</button>
    </div>
    <div style="font-size:12.5px;color:#9e8f80;margin-bottom:12px;line-height:1.45">Введи секретный код для активации награды:</div>
    <input id="promo_code_input" type="text" maxlength="24" autocomplete="off" placeholder="ВВЕДИ КОД" style="width:100%;box-sizing:border-box;background:#020101;border:1px solid #6b1d24;color:#f5ebd9;padding:10px 12px;border-radius:3px;font-size:15px;letter-spacing:0.12em;font-family:monospace;outline:none;margin-bottom:10px;text-align:center" />
    <div id="promo_status_msg" style="min-height:22px;font-size:12px;line-height:1.4;margin-bottom:12px;color:#cbd5e1;text-align:center"></div>
    <button id="promo_code_submit" type="button" style="width:100%;margin:0;padding:10px;background:#450a11;border:1px solid #b91c1c;color:#f5ebd9;border-radius:3px;font-weight:bold;letter-spacing:0.1em;cursor:pointer;font-family:Georgia,serif">АКТИВИРОВАТЬ</button>
  </div>`;
  document.body.appendChild(cm);
  openAnimatedModal(cm);
  const inp=cm.querySelector('#promo_code_input');
  const msgEl=cm.querySelector('#promo_status_msg');
  const subBtn=cm.querySelector('#promo_code_submit');
  const clBtn=cm.querySelector('#cm_close');
  const closeCm=()=>closeAnimatedModal(cm);
  clBtn.onclick=closeCm;
  cm.onclick=e=>{if(e.target===cm)closeCm()};
  setTimeout(()=>{try{inp&&inp.focus()}catch(e){}},60);
  const submitCode=async()=>{
    const raw=(inp?.value||'').trim().replace(/\s+/g,' ');
    if(!raw){
      if(msgEl){msgEl.style.color='#f87171';msgEl.textContent='Введи код.';}
      return;
    }
    const norm=raw.toUpperCase();
    if(Array.isArray(PF.redeemedCodes)&&PF.redeemedCodes.includes(norm)){
      try{TN(150,.18,.2,'square')}catch(e){}
      if(msgEl){msgEl.style.color='#f87171';msgEl.textContent='Ты уже использовал этот код! Повторно ввести его нельзя.';}
      return;
    }
    if(subBtn){subBtn.disabled=true;subBtn.textContent='ПРОВЕРКА...';}
    try{
      const resp=await fetch('/api/codes/redeem',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({code:raw,clientId:getPromoClientId()})
      });
      const data=await resp.json().catch(()=>({}));
      if(resp.ok&&data&&data.ok){
        if(data.rewardType==='monster_skin'&&data.rewardId){
          if(!Array.isArray(PF.ownedMonSkins))PF.ownedMonSkins=['maze'];
          if(!PF.ownedMonSkins.includes(data.rewardId))PF.ownedMonSkins.push(data.rewardId);
          PF.eqMonSkin=data.rewardId;
        }else if(data.rewardType==='coins'&&data.amount){
          PF.coins=Math.max(0,Math.floor(Number(PF.coins)||0))+Math.floor(Number(data.amount)||0);
        }
        if(!Array.isArray(PF.redeemedCodes))PF.redeemedCodes=[];
        if(data.codeKey&&!PF.redeemedCodes.includes(data.codeKey))PF.redeemedCodes.push(data.codeKey);
        if(!PF.redeemedCodes.includes(norm))PF.redeemedCodes.push(norm);
        pWrite();
        syncCoopProfile();
        if(typeof updPf==='function'&&$('pfd'))updPf();
        try{if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}catch(e){}
        aud();
        try{TN(587,.12,.22,'triangle');setTimeout(()=>TN(880,.28,.26,'triangle'),110)}catch(e){}
        if(msgEl){msgEl.style.color='#4ade80';msgEl.textContent=data.message||'Код активирован!';}
        showToast(data.message||'Код активирован!');
        if(inp)inp.value='';
      }else{
        try{TN(150,.18,.2,'square')}catch(e){}
        if(msgEl){msgEl.style.color='#f87171';msgEl.textContent=(data&&data.message)||'Не удалось активировать код.';}
      }
    }catch(err){
      if(msgEl){msgEl.style.color='#f87171';msgEl.textContent='Ошибка связи с сервером.';}
    }finally{
      if(subBtn){subBtn.disabled=false;subBtn.textContent='АКТИВИРОВАТЬ';}
    }
  };
  if(subBtn)subBtn.onclick=submitCode;
  if(inp)inp.onkeydown=e=>{if(e.key==='Enter')submitCode()};
};
const sCodes=$('s_codes_btn');if(sCodes)sCodes.onclick=()=>{hideAnimatedPanel(p,'ui-modal-backdrop');openCodesModal()};
const sAdv=$('s_snd_adv');if(sAdv)sAdv.onclick=()=>{hideAnimatedPanel(p,'ui-modal-backdrop');showSoundModal()};
const sJoyTab=$('s_joy_tablet');if(sJoyTab)sJoyTab.onclick=()=>{SET.joySize=240;sv();const sj=$('s_joy_size');if(sj)sj.value=240;const sjv=$('s_joy_size_v');if(sjv)sjv.textContent='240px';if(window.__applyJoySize)window.__applyJoySize()};
if($('s_lang'))$('s_lang').onchange=()=>selectLanguage($('s_lang').value,true);
$('s_rst').onclick=()=>{SET.keys=Object.assign({},DEFK);RB=null;sv();rKeys()};
const openSettingsDialog=()=>{renderLangControls();showAnimatedPanel(p,'block','ui-modal-backdrop');bS('s_vol','vol');bS('s_mus_vol','musVol');bS('s_sfx_vol','sfxVol');bS('s_joy_size','joySize');bS('s_shakal','camShakal');rKeys()};
const ovSetBtn=$('ov_settings_btn');if(ovSetBtn)ovSetBtn.onclick=openSettingsDialog;
$('scl').onclick=()=>{RB=null;hideAnimatedPanel(p,'ui-modal-backdrop')}})();
document.documentElement.lang=SET.lang;document.title=tr('Не Оборачивайся - Хоррор 3D');trTree(document.body);
let cage={on:false,spots:[],bars:[]},nearSp=null,srchT=0,srchS=null;const SF=['Только кости.','Пусто. Лишь ржавая миска.','Грязная солома. Ничего.','Пусто... Только крысиный помёт.'];
const spotImgs=[0,1,2,3].map(k=>mk(64,40,x=>{x.fillStyle='rgba(20,10,5,.5)';x.beginPath();x.ellipse(32,34,28,5,0,0,7);x.fill();
if(k==0){x.fillStyle='#d8d0b8';for(let i=0;i<9;i++)x.fillRect(8+i*5,26-(i%3)*3,4,3+(i%2)*6);x.beginPath();x.arc(30,18,7,0,7);x.fill();x.fillStyle='#000';x.fillRect(27,16,2,3);x.fillRect(32,16,2,3)}
if(k==1){x.fillStyle='#555';x.fillRect(20,14,24,20);x.fillStyle='#222';x.fillRect(20,14,24,3);x.strokeStyle='#777';x.beginPath();x.arc(32,14,12,Math.PI,0);x.stroke()}
if(k==2){x.fillStyle='#8a6d3b';for(let i=0;i<30;i++)x.fillRect(6+((i*37)%50),24+((i*13)%10),6,1.5)}
if(k==3){x.fillStyle='#5a4028';x.fillRect(14,10,36,24);x.fillStyle='#3a2818';x.fillRect(14,20,36,2);x.fillRect(31,10,2,24)}}));
function mkCage(){for(let y=1;y<=3;y++)for(let x=1;x<=3;x++)map[y][x]=0;cage={on:true,spots:[],bars:[]};
for(let i=1;i<=3;i++)for(const[x,y]of[[4,i],[i,4]])if(map[y][x]==0){map[y][x]=5;cage.bars.push([x,y])}
const ki=rnd(4);cage.spots=[[3.5,1.5],[1.5,3.5],[3.5,3.5],[2.5,2.5]].map((p,i)=>({x:p[0],y:p[1],k:i,done:0,key:i==ki}))}
function openCage(remote){if(!cage.on)return;cage.on=false;for(const[x,y]of cage.bars)map[y][x]=0;MP.got.add(200);NZ(.6,500,.9);TN(120,.5,.7,'sawtooth',50);
if(remote)say('Напарник открыл клетку.',3);else{say('Решётка со скрипом отъехала. Теперь — наружу.',4);MP.al=[2,2,Date.now(),0];mon.st='invest';mon.tx=2;mon.ty=2}}
function startSearch(s){srchT=.001;srchS=s;NZ(.15,300,.4)}
function finishSearch(){const s=srchS;srchT=0;srchS=null;if(!s)return;s.done=1;MP.got.add(300+cage.spots.indexOf(s));if(s.key){lastProgressT=tm;ghostHint=null;TN(900,.4,.3,'triangle',1400);say('Ты нашёл ключ от решётки!',3);setTimeout(()=>{if(state=='play')openCage(false)},800)}else say(SF[rnd(4)],3)}
function drawBars(bd,bw,zs,hor,RW=W,fog=null,flShakeX=0){const cw=W/RW,colW=cw+0.06;for(let ri=0;ri<RW;ri++){const d=bd[ri];if(!d||d>=zs[ri])continue;const x=ri*cw,lh=H/d*VFK(),top=hor-lh/2,fy=hor+lh/2,c=ri/RW-.5-flShakeX,L=Math.min(1,(ch==3?.085:.04)+FL*Math.exp(-c*c*10)*2.4/(1+d*d*.1)+.06/(1+d*d)+(hid?.1/(1+d*.2):0)),u=(bw[ri]*5)%1,fa=fog?1-Math.exp(-d*fog.density):0,iv=1-fa;
const fCol=(r,gg,b)=>fog?`rgb(${r*L*iv+fog.r*fa|0},${gg*L*iv+fog.g*fa|0},${b*L*iv+fog.b*fa|0})`:`rgb(${r*L|0},${gg*L|0},${b*L|0})`;
if(ch==3){
  const fH=lh*0.54,fTop=fy-fH;
  g.fillStyle=`rgba(0,0,0,${(0.42*iv).toFixed(3)})`;g.fillRect(x,fy-lh*0.015,colW,Math.max(1,lh*0.055));
  g.fillStyle=fCol(108,104,94);g.fillRect(x,fy-lh*0.10,colW,lh*0.10);
  if(bw[ri]<0.07||bw[ri]>0.93){
    g.fillStyle=fCol(128,122,110);g.fillRect(x,fTop-lh*0.04,colW,fH+lh*0.04);
  }else{
    g.fillStyle=fCol(26,28,32);
    if(u<0.15){g.fillRect(x,fTop,colW,fH*0.86);if(u<0.08){g.fillRect(x,fTop-lh*0.03,colW,lh*0.035)}}
    g.fillRect(x,fTop+lh*0.07,colW,Math.max(1,lh*0.025));
    g.fillRect(x,fy-lh*0.18,colW,Math.max(1,lh*0.025));
  }
}else{
  g.fillStyle=fCol(112,106,96);if(u<.14)g.fillRect(x,top,colW,lh);g.fillRect(x,top,colW,Math.max(1,lh*.05));g.fillRect(x,top+lh*.93,colW,Math.max(1,lh*.05));g.fillRect(x,top+lh*.5,colW,Math.max(1,lh*.03))
}}}
let BA=0,CY=0,NOLOCK=0;const VFK=()=>.66/FOVK();document.addEventListener('pointerlockerror',()=>{NOLOCK=1});
let ROOM={on:false},DR={st:'open',knock:0,bang:0},CAMS=[],VIS=new Uint8Array(N*N),visT=0,lastSeen=null,pcOpen=false,pcSt='off',pcT=0,hidSofa=false,nearPC=false,nearD=false;
const pcImg=mk(64,48,x=>{x.fillStyle='#3a2a1a';x.fillRect(4,28,56,18);x.fillStyle='#2a1c10';x.fillRect(4,28,56,3);x.fillStyle='#222';x.fillRect(18,6,28,20);x.fillStyle='#0c3a28';x.fillRect(20,8,24,15);x.fillStyle='#4f8';for(let i=0;i<4;i++)x.fillRect(22,10+i*3.5,8+((i*7)%12),1);x.fillStyle='#333';x.fillRect(29,26,6,3);x.fillStyle='#555';x.fillRect(22,31,20,4)});
const sofaImg=mk(128,40,x=>{x.fillStyle='rgba(20,10,5,.5)';x.beginPath();x.ellipse(64,37,58,4,0,0,7);x.fill();x.fillStyle='#4a2430';x.fillRect(6,8,116,22);x.fillStyle='#5c2e3c';x.fillRect(0,14,14,24);x.fillRect(114,14,14,24);x.fillStyle='#3d1c28';x.fillRect(14,20,100,16);x.fillStyle='#2a1219';for(let i=1;i<3;i++)x.fillRect(14+i*33,20,2,16);for(let i=0;i<4;i++)x.fillRect(6+i*29,8,2,10)});
function door6(x,top,lh,sh,wx,colW=1){if((wx*6%1)<.07){g.fillStyle='rgba(0,0,0,.4)';g.fillRect(x,top,colW,lh)}if(wx<.05||wx>.95){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x,top,colW,lh)}
if(1){g.fillStyle='rgb('+(105*sh|0)+','+(105*sh|0)+','+(117*sh|0)+')';g.fillRect(x,top+lh*.44,colW,lh*.09);if((wx*14|0)%3==0){g.fillStyle='rgb('+(140*sh|0)+','+(140*sh|0)+','+(150*sh|0)+')';g.fillRect(x,top+lh*.47,colW,Math.max(1,lh*.02))}}
if(Math.abs(wx-.82)<.03){g.fillStyle='rgb('+(200*sh|0)+','+(170*sh|0)+','+(80*sh|0)+')';g.fillRect(x,top+lh*.55,colW,lh*.07)}
if(Math.abs(wx-.5)<.03){g.fillStyle='#f33';g.fillRect(x,top+lh*.1,colW,Math.max(1,lh*.05))}}
var fixConn = function(){for(let it=0;it<80;it++){const seen=new Set([N+1]),q=[[1,1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*N+nx;if(nx>0&&ny>0&&nx<N-1&&ny<N-1&&!seen.has(k)&&(map[ny][nx]==0||map[ny][nx]==5)){seen.add(k);q.push([nx,ny])}}}
let fixed=false;for(let y=1;y<N-1&&!fixed;y++)for(let x=1;x<N-1&&!fixed;x++){if(map[y][x]!=1||(x>=14&&x<=18&&y>=14&&y<=18))continue;let r=0,u=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const v=map[y+b][x+a];if(v==0||v==5){if(seen.has((y+b)*N+x+a))r=1;else u=1}}if(r&&u){map[y][x]=0;fixed=true}}if(!fixed)break}}
var mkRoom = function(){for(let y=14;y<=18;y++)for(let x=14;x<=18;x++)map[y][x]=1;for(let y=15;y<=17;y++)for(let x=15;x<=17;x++)map[y][x]=0;map[16][14]=0;map[16][13]=0;ROOM={on:true};fixConn()}
var mkCams = function(){CAMS=[];for(let i=0;i<80&&CAMS.length<7;i++){const f=floors[rnd(floors.length)];if(!f)break;const x=f[0]+.5,y=f[1]+.5;if(x<5&&y<5)continue;if(x>=15&&x<=18&&y>=15&&y<=18)continue;if(CAMS.every(c=>Math.hypot(c.x-x,c.y-y)>=5))CAMS.push({x,y})}}
function camVis(){VIS.fill(0);for(const c of CAMS){const cx=c.x|0,cy=c.y|0;for(let y=Math.max(1,cy-6);y<=Math.min(N-2,cy+6);y++)for(let x=Math.max(1,cx-6);x<=Math.min(N-2,cx+6);x++){if(VIS[y*N+x]||Math.hypot(x-cx,y-cy)>6)continue;if(los(c.x,c.y,x+.5,y+.5))VIS[y*N+x]=1}}}
var applyDoor = function(st){if(DR.st==st)return;DR.st=st;map[16][14]=st=='locked'?6:0;if(st=='broken'){NZ(.6,400,.9);TN(70,.5,.8,'sawtooth',30);shake=.6}else TN(st=='locked'?300:260,.12,.3,'square',st=='locked'?240:300)}
var toggleDoor = function(){if(DR.st=='broken')return;if(DR.st=='locked'){applyDoor('open');say('Дверь отперта.',2);emitSuddenNoise(14.5,16.5,0.88,'дверь')}else{if(Math.hypot(px-14.5,py-16.5)<.85||Math.hypot(mon.x-14.5,mon.y-16.5)<1){say('Что-то мешает закрыть дверь.',2);return}applyDoor('locked');say('Дверь заперта.',2);emitSuddenNoise(14.5,16.5,0.88,'дверь');if(mon.st=='hunt'&&px>14.9)mon.siege=1}MP.dr=[DR.st,Date.now()]}
var breakDoor = function(){DR.st='broken';DR.knock=0;map[16][14]=0;mon.siege=0;NZ(.6,400,1);TN(70,.5,.9,'sawtooth',30);shake=1;mon.st='hunt';mon.lost=0;mon.tx=16;mon.ty=16;MP.dr=['broken',Date.now()];say('ДВЕРЬ ВЫБИТА!',2)}
var openPC = function(){pcOpen=true;const mb=document.getElementById('mob_pc_close');if(mb&&isTouchDevice())mb.style.display='block';document.exitPointerLock&&document.exitPointerLock();for(const k in kd)kd[k]=0}
var closePC = function(){pcOpen=false;const mb=document.getElementById('mob_pc_close');if(mb)mb.style.display='none';try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
var pcKey = function(c){if(c=='KeyE'){closePC();return}if(c=='Escape'){if(pcSt=='cams'||pcSt=='notes')pcSt='desk';else closePC();return}
if(c=='Enter'&&pcSt=='off'){pcSt='boot';pcT=0;TN(440,.15,.15);return}
if(pcSt=='desk'){if(c=='Digit1'||c=='Numpad1'){pcSt='cams';camVis();visT=.25}else if(c=='Digit2'||c=='Numpad2')pcSt='notes';else if(c=='Digit3'||c=='Numpad3'){pcSt='off';TN(220,.2,.15)}}}
var pcClick = function(e){const r=cv.getBoundingClientRect(),s=Math.min(r.width/W,r.height/H),x=(e.clientX-r.left-(r.width-W*s)/2)/s,y=(e.clientY-r.top-(r.height-H*s)/2)/s;
if(pcSt=='off'){pcKey('Enter');return}if(pcSt=='desk'&&y>=60&&y<=130){const i=Math.floor((x-40)/110);if(i>=0&&i<3&&x-40-i*110<=90)pcKey('Digit'+(i+1))}else if(y>H-22)pcKey('Escape')}
function pcDraw(){const t=pcT;g.globalAlpha=1;g.fillStyle='#02090a';g.fillRect(0,0,W,H);g.textBaseline='top';g.textAlign='left';g.font='10px monospace';
if(pcSt=='off'){g.fillStyle='#071612';g.fillRect(10,10,W-20,H-30);g.fillStyle='#6b6';g.textAlign='center';g.fillText('Монитор выключен',W/2,90);g.fillText('[Enter] — включить компьютер',W/2,108);g.fillStyle='#d33';g.fillRect(W/2-2,H-16,4,3);g.fillStyle='#6a8';g.fillText('[E] выйти',W/2,H-30)}
 else if(pcSt=='boot'){const L=['Загрузка системы...','Запуск службы камер...','Подключение к камерам: '+Math.min(CAMS.length,Math.floor(t*3))+'/'+CAMS.length,'Готово.'];g.fillStyle='#5f9';for(let i=0;i<L.length;i++)if(t>i*.6)g.fillText(L[i],20,24+i*14);g.fillStyle='#143';g.fillRect(20,100,W-40,8);g.fillStyle='#5f9';g.fillRect(20,100,(W-40)*Math.min(1,t/2.6),8);if(t>2.8){pcSt=PCUR&&(PCUR.k==1||PCUR.k==2)?'login':'desk';pcT=0}}
 else{g.fillStyle='#0a2a1e';g.fillRect(0,0,W,16);g.fillStyle='#8fb';
if(pcSt=='desk'){g.fillText('SECURITY OS 1.3',8,3);g.textAlign='right';g.fillText(new Date().toLocaleTimeString(LOCALE()).slice(0,5),W-8,3);g.textAlign='center';
[['1','Камеры'],['2','Заметки'],['3','Выключить']].forEach((a,i)=>{const bx=40+i*110,by=60;g.fillStyle='#0d3a2a';g.fillRect(bx,by,90,70);g.strokeStyle='#4c8';g.strokeRect(bx+.5,by+.5,89,69);g.fillStyle='#8fb';g.font='22px monospace';g.fillText(a[0],bx+45,by+14);g.font='10px monospace';g.fillText(a[1],bx+45,by+48)})}
 else if(pcSt=='desk2'){g.fillText('ЛАБОРАТОРИЯ №7',8,3);g.textAlign='right';g.fillText(new Date().toLocaleTimeString(LOCALE()).slice(0,5),W-8,3);g.textAlign='center';[['1','Файлы','#0d3a2a'],['2','Видеозаписи','#0d3a2a'],['3','НЕ ОТКРЫВАТЬ','#5a1010'],['4','Фотоархив','#172554']].forEach((a,i)=>{const col=i%2,row=Math.floor(i/2),bx=44+col*162,by=34+row*74;g.fillStyle=a[2];g.fillRect(bx,by,150,62);g.strokeStyle=i==2?'#f66':i==3?'#60a5fa':'#4c8';g.strokeRect(bx+.5,by+.5,149,61);g.fillStyle=i==2?'#faa':i==3?'#bfdbfe':'#8fb';g.font='20px monospace';g.fillText(a[0],bx+75,by+12);g.font='10px monospace';g.fillText(a[1],bx+75,by+40)})}
 else if(pcSt=='photos'){g.fillText('ФОТОАРХИВ',8,3);g.textAlign='right';g.fillText('[←/→] выбрать  [Enter] увеличить',W-8,3);g.textAlign='center';MANSION_PHOTOS.forEach((p,i)=>{const bx=16+i*126,by=26,bw=116,bh=138,sel=(photoSel|0)===i;g.fillStyle=sel?'#1e293b':'#091418';g.fillRect(bx,by,bw,bh);g.strokeStyle=sel?'#fbbf24':'#334155';g.lineWidth=sel?2:1;g.strokeRect(bx+.5,by+.5,bw-1,bh-1);g.lineWidth=1;g.fillStyle='#020617';g.fillRect(bx+6,by+6,bw-12,92);if(p.rawImg&&p.rawImg.complete&&p.rawImg.naturalWidth>0){g.drawImage(p.rawImg,bx+6,by+6,bw-12,92)}else{g.fillStyle='#475569';g.font='9px monospace';g.fillText('LOADING...',bx+bw/2,by+48)}g.fillStyle=sel?'#fde68a':'#94a3b8';g.font='bold 8px monospace';g.fillText('№'+(i+1),bx+bw/2,by+104);g.font='7px monospace';g.fillStyle='#cbd5e1';g.fillText(p.title.replace(/^ФОТО №\d\s*·\s*/,'').slice(0,18),bx+bw/2,by+118)})}
 else if(pcSt=='files'){g.fillText('ФАЙЛЫ',8,3);g.textAlign='center';g.fillStyle='#f66';g.font='12px monospace';g.fillText('ОШИБКА: невозможно открыть',W/2,80);g.fillStyle='#8fb';g.font='10px monospace';g.fillText('Файловая система повреждена.',W/2,100);g.fillText('Код ошибки: 0x155',W/2,116)}
 else if(pcSt=='vid'){g.fillText('ВИДЕОЗАПИСИ',8,3);vidDraw(pcT)}
 else if(pcSt=='doc'){g.fillText('НЕ ОТКРЫВАТЬ',8,3);docDraw()}
 else if(pcSt=='login'){g.fillText(PCT?PCT.title:'ДОСТУП ЗАПРЕЩЁН',8,3);g.fillStyle='#8fb';g.fillText('Введите пароль:',20,40);g.fillStyle='#0d3a2a';g.fillRect(20,56,200,22);g.fillStyle='#fff';g.font='14px monospace';g.fillText(PW||'',26,59);g.font='10px monospace';if(PWERR){g.fillStyle='#f66';g.fillText('Неверный пароль',20,86)}
['1','2','3','4','5','6','7','8','9','.','0','<'].forEach((k,i)=>{const bx=250+(i%3)*42,by=34+Math.floor(i/3)*30;g.fillStyle='#0d3a2a';g.fillRect(bx,by,38,26);g.strokeStyle='#4c8';g.strokeRect(bx+.5,by+.5,37,25);g.fillStyle='#8fb';g.textAlign='center';g.font='14px monospace';g.fillText(k,bx+19,by+5)});g.fillStyle='#14603f';g.fillRect(250,156,122,24);g.fillStyle='#fff';g.font='11px monospace';g.fillText('OK',311,161);g.textAlign='left';g.font='10px monospace'}
 else if(pcSt=='term'){g.fillText('ТЕРМИНАЛ',8,3);const cs=9,ox0=10,oy0=20;for(let y=0;y<N;y++)for(let x=0;x<N;x++){const m=map[y][x];g.fillStyle=(m==0||m==5)?'#0d3a2a':m==3?'#2f8':m==6?'#b8862f':'#1f6e48';g.fillRect(ox0+x*cs,oy0+y*cs,cs-1,cs-1)}
let left=0;for(const it of items)if(it.t=='k'&&it.on){left++;g.fillStyle='#fd4';g.beginPath();g.arc(ox0+it.x*cs,oy0+it.y*cs,4,0,7);g.fill()}
g.fillStyle='#fff';g.beginPath();g.arc(ox0+px*cs,oy0+py*cs,3,0,7);g.fill();g.textAlign='left';g.fillStyle='#8fb';g.fillText('Ключей осталось: '+left,210,30);g.fillStyle='#fd4';g.fillText('● ключ',210,50);g.fillStyle='#2f8';g.fillText('■ Выход',210,64);g.fillStyle='#fff';g.fillText('● вы',210,78)}
 else if(pcSt=='notes'){g.fillText('ЖУРНАЛ ОХРАНЫ',8,3);g.fillStyle='#9d9';['— Она слышит бег. Ходи тихо.','— Запри дверь изнутри: ей придётся её выбивать.','— Когда она ломает дверь — спрячься за диваном.','— Если она видела, как ты прячешься, это не спасёт.','— Камеры не видят всё. Не доверяй тишине.'].forEach((l,i)=>g.fillText(l,14,30+i*18))}
 else if(pcSt=='cams'){g.fillText('КАМЕРЫ',8,3);const cs=9,ox0=10,oy0=20;
for(let y=0;y<N;y++)for(let x=0;x<N;x++){const m=map[y][x],v=VIS[y*N+x];g.fillStyle=(m==0||m==5)?(v?'#12503a':'#05140e'):m==6?(v?'#b8862f':'#3a2a10'):(v?'#2f9a68':'#0a2a1d');g.fillRect(ox0+x*cs,oy0+y*cs,cs-1,cs-1)}
for(let i=0;i<CAMS.length;i++){const c=CAMS[i];g.fillStyle='#6ff';g.fillRect(ox0+c.x*cs-2,oy0+c.y*cs-2,5,5);g.fillStyle='#fff';g.font='7px monospace';g.fillText(String(i+1),ox0+c.x*cs+3,oy0+c.y*cs-8)}
const seenNow=VIS[(mon.y|0)*N+(mon.x|0)]==1;if(seenNow)lastSeen={x:mon.x,y:mon.y,t:tm};
if(lastSeen){const lx2=ox0+lastSeen.x*cs,ly2=oy0+lastSeen.y*cs;if(seenNow){g.fillStyle='rgba(255,40,40,'+(.6+.4*Math.sin(t*10))+')';g.beginPath();g.arc(lx2,ly2,5,0,7);g.fill()}else{g.strokeStyle='rgba(255,80,80,.6)';g.beginPath();g.arc(lx2,ly2,5,0,7);g.stroke()}}
g.fillStyle='#fff';g.beginPath();g.arc(ox0+px*cs,oy0+py*cs,3,0,7);g.fill();
g.font='10px monospace';g.textAlign='left';g.fillStyle='#8fb';g.fillText('Монстр:',210,26);g.fillStyle=seenNow?'#f66':'#aa8';g.fillText(seenNow?'В ЗОНЕ КАМЕРЫ':'не видно',210,40);
if(!seenNow&&lastSeen){g.fillStyle='#8fb';g.fillText('Последний раз: '+Math.round(tm-lastSeen.t)+' с назад',210,56)}
g.fillStyle=DR.st=='locked'?'#fc4':DR.st=='broken'?'#f66':'#8fb';g.fillText(DR.st=='locked'?'Дверь: ЗАПЕРТА':DR.st=='broken'?'Дверь: ВЫБИТА':'Дверь: открыта',210,80);
g.fillStyle='#8fb';g.fillText('● вы',210,110);g.fillStyle='#f66';g.fillText('● монстр',210,124);g.fillStyle='#6ff';g.fillText('■ камера',210,138);
for(let i=0;i<40;i++){g.fillStyle='rgba(120,255,180,'+Math.random()*.15+')';g.fillRect(ox0+rnd(N*cs),oy0+rnd(N*cs),1+rnd(3),1)}}
g.font='9px monospace';g.textAlign='center';g.fillStyle='#6a8';g.fillText('[Esc] назад   [E] выйти',W/2,H-13)}
g.fillStyle='rgba(0,0,0,.15)';for(let y=0;y<H;y+=3)g.fillRect(0,y,W,1);g.textAlign='left'}
let PIT=0,hidBed=false,PCUR=null,PW='',PWERR=0,FP=[],PCS=[],HRM=[],DOORS=[],phoneUI=false,phApp='home',nearPaper=false;
const SKINS=[{n:'Обычный',c:'#d8d8d0',p:0},{n:'Красная куртка',c:'#c0392b',p:50},{n:'Синий плащ',c:'#2e6fd0',p:80},{n:'Камуфляж',c:'#4a6b3a',p:100},{n:'Золотой',c:'#e0b030',p:250},{n:'Тень',c:'#2a2a33',p:300}];
if(PF.coins===undefined)PF.coins=40;if(!Array.isArray(PF.skins))PF.skins=[0];if(PF.skin===undefined)PF.skin=0;
const mkPl=c=>mk(64,128,x=>{x.fillStyle='#222';x.fillRect(23,86,8,40);x.fillRect(33,86,8,40);x.fillStyle=c;x.fillRect(20,40,24,48);x.fillRect(12,42,8,36);x.fillRect(44,42,8,36);x.fillStyle='#e8c9a8';x.beginPath();x.ellipse(32,26,10,12,0,0,7);x.fill();x.fillStyle='#2a1a10';x.beginPath();x.ellipse(32,19,11,7,0,0,7);x.fill();x.fillStyle='#000';x.fillRect(28,26,2,2);x.fillRect(35,26,2,2);x.fillStyle='#fff';x.fillRect(46,74,7,10);x.fillStyle='#cde';x.fillRect(47,75,5,7)});
const skinImgs=SKINS.map(s=>mkPl(s.c));
const bedImg=mk(128,48,x=>{x.fillStyle='rgba(20,10,5,.5)';x.beginPath();x.ellipse(64,44,60,4,0,0,7);x.fill();x.fillStyle='#4a3020';x.fillRect(4,26,120,16);x.fillRect(4,10,8,32);x.fillRect(116,16,8,26);x.fillStyle='#bcc6d4';x.fillRect(10,16,104,12);x.fillStyle='#e8e8ee';x.fillRect(14,12,26,8);x.fillStyle='#8a97ad';x.fillRect(46,18,64,10)});
const paperImg=mk(32,24,x=>{x.fillStyle='#e8e4d0';x.fillRect(4,4,24,16);x.fillStyle='#333';for(let i=0;i<4;i++)x.fillRect(7,7+i*3,12+((i*5)%8),1)});
function inFP(x,y){return FP.some(r=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3])}
function hideSpots(){const a=[{x:16,y:17.8,sofa:1}];for(const r of HRM){a.push({x:r.bh.x,y:r.bh.y,bed:1,sofa:1});a.push({x:r.sh.x,y:r.sh.y,sofa:1})}return a}
function mkHide(){FP=[[14,14,18,18]];HRM=[];const defs=[[6,1,0,1],[14,1,0,1],[1,8,1,0],[8,8,0,-1],[15,8,-1,0],[1,15,1,0]],pi=rnd(6);
defs.forEach((d,i)=>{const[x0,y0,dx,dy]=d;for(let y=y0;y<=y0+4;y++)for(let x=x0;x<=x0+4;x++)map[y][x]=1;for(let y=y0+1;y<=y0+3;y++)for(let x=x0+1;x<=x0+3;x++)map[y][x]=0;
const cx=x0+2+dx*2,cy=y0+2+dy*2,ox=cx+dx,oy=cy+dy;map[cy][cx]=0;map[oy][ox]=0;const door={st:'open',knock:0,bang:0,cx,cy,ox,oy,rx0:x0+1,ry0:y0+1,rx1:x0+3,ry1:y0+3};DOORS.push(door);FP.push([x0,y0,x0+4,y0+4]);
const C=[x0+2.5,y0+2.5],L=[-dy,dx];HRM.push({door,bed:{x:C[0]-dx*.6,y:C[1]-dy*.6},bh:{x:C[0]-dx*1.3,y:C[1]-dy*1.3},sofa:{x:C[0]+L[0]*.6,y:C[1]+L[1]*.6},sh:{x:C[0]+L[0]*1.3,y:C[1]+L[1]*1.3}});
if(i==pi)PCS.push({x:C[0]-L[0]*1.1,y:C[1]-L[1]*1.1,k:1,st:'off'})})}
var fixConn = function(){for(let it=0;it<120;it++){const seen=new Set([N+1]),q=[[1,1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*N+nx;if(nx>0&&ny>0&&nx<N-1&&ny<N-1&&!seen.has(k)&&(map[ny][nx]==0||map[ny][nx]==5)){seen.add(k);q.push([nx,ny])}}}
let fixed=false;for(let y=1;y<N-1&&!fixed;y++)for(let x=1;x<N-1&&!fixed;x++){if(map[y][x]!=1||inFP(x,y))continue;let r=0,u=0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const v=map[y+b][x+a];if(v==0||v==5){if(seen.has((y+b)*N+x+a))r=1;else u=1}}if(r&&u){map[y][x]=0;fixed=true}}if(!fixed)break}}
var mkRoom = function(){for(let y=14;y<=18;y++)for(let x=14;x<=18;x++)map[y][x]=1;for(let y=15;y<=17;y++)for(let x=15;x<=17;x++)map[y][x]=0;map[16][14]=0;map[16][13]=0;ROOM={on:true};DR={st:'open',knock:0,bang:0,cx:14,cy:16,ox:13,oy:16,rx0:15,ry0:15,rx1:17,ry1:17};DOORS=[DR];PCS=[{x:16.5,y:15.35,k:0,st:'off'}];mkHide();fixConn()}
var applyDoor = function(d,st){if(!d||d.st==st)return;d.st=st;map[d.cy][d.cx]=st=='locked'?6:0;if(st=='broken'){NZ(.6,400,.9);TN(70,.5,.8,'sawtooth',30);shake=.6}else TN(st=='locked'?300:260,.12,.3,'square',st=='locked'?240:300)}
function applyDoors(s){String(s).split(',').forEach((v,i)=>applyDoor(DOORS[i],v))}
const drSync=()=>{MP.dr=[DOORS.map(d=>d.st).join(','),Date.now()]};
var toggleDoor = function(d){if(!d||d.st=='broken')return;if(d.st=='locked'){applyDoor(d,'open');say('Дверь отперта.',2)}else{if(Math.hypot(px-d.cx-.5,py-d.cy-.5)<.85||Math.hypot(mon.x-d.cx-.5,mon.y-d.cy-.5)<1){say('Что-то мешает закрыть дверь.',2);return}applyDoor(d,'locked');say('Дверь заперта.',2);if(mon.st=='hunt'&&px>=d.rx0&&px<=d.rx1+1&&py>=d.ry0&&py<=d.ry1+1)mon.siege=DOORS.indexOf(d)+1}drSync()}
var breakDoor = function(d){d.st='broken';d.knock=0;map[d.cy][d.cx]=0;mon.siege=0;NZ(.6,400,1);TN(70,.5,.9,'sawtooth',30);shake=1;mon.st='hunt';mon.lost=0;mon.tx=(d.rx0+d.rx1)>>1;mon.ty=(d.ry0+d.ry1)>>1;drSync();say('ДВЕРЬ ВЫБИТА!',2)}
var openPC = function(pc){PCUR=pc;pcOpen=true;pcSt=pc.st||'off';pcT=0;PW='';PWERR=0;const mb=document.getElementById('mob_pc_close');if(mb&&isTouchDevice())mb.style.display='block';document.exitPointerLock&&document.exitPointerLock();for(const k in kd)kd[k]=0}
var closePC = function(){if(PCUR)PCUR.st=pcSt=='boot'?'off':pcSt;pcOpen=false;const mb=document.getElementById('mob_pc_close');if(mb)mb.style.display='none';try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
var pcKey = function(c){if(c=='KeyE'&&pcSt!='login'){closePC();return}if(c=='Escape'){if(pcSt=='cams'||pcSt=='notes')pcSt='desk';else closePC();return}
if(pcSt=='login'){if(/^(Digit|Numpad)\d$/.test(c)){if(PW.length<12)PW+=c.slice(-1);PWERR=0;TN(600,.04,.08)}else if(c=='Period'||c=='NumpadDecimal'){if(PW.length<12)PW+='.';PWERR=0;TN(600,.04,.08)}else if(c=='Backspace')PW=PW.slice(0,-1);else if(c=='Enter'||c=='NumpadEnter'){if(PW=='3.10.2026'){pcSt='term';PW='';TN(880,.2,.15)}else{PWERR=1;PW='';TN(150,.2,.2,'square')}}return}
if(c=='Enter'&&pcSt=='off'){pcSt='boot';pcT=0;TN(440,.15,.15);return}
if(pcSt=='desk'){if(c=='Digit1'||c=='Numpad1'){pcSt='cams';camVis();visT=.25}else if(c=='Digit2'||c=='Numpad2')pcSt='notes';else if(c=='Digit3'||c=='Numpad3'){pcSt='off';TN(220,.2,.15)}}}
var pcClick = function(e){const r=cv.getBoundingClientRect(),s=Math.min(r.width/W,r.height/H),x=(e.clientX-r.left-(r.width-W*s)/2)/s,y=(e.clientY-r.top-(r.height-H*s)/2)/s;
if(pcSt=='off'){pcKey('Enter');return}
if(pcSt=='desk'&&y>=60&&y<=130){const i=Math.floor((x-40)/110);if(i>=0&&i<3&&x-40-i*110<=90)pcKey('Digit'+(i+1));return}
if(pcSt=='login'){for(let i=0;i<12;i++){const bx=250+(i%3)*42,by=34+Math.floor(i/3)*30;if(x>=bx&&x<=bx+38&&y>=by&&y<=by+26){pcKey(i==9?'Period':i==11?'Backspace':'Digit'+(i==10?0:i+1));return}}if(x>=250&&x<=372&&y>=156&&y<=180){pcKey('Enter');return}}
if(y>H-22)pcKey('Escape')}
function bedOv(){g.fillStyle='rgba(8,5,8,.92)';g.fillRect(0,0,W,22);for(let x=0;x<W;x+=12)g.fillRect(x,22,9,5+((x*7)%9));g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,14,H);g.fillRect(W-14,0,14,H);g.fillStyle='rgba(120,110,100,.08)';for(let i=0;i<30;i++)g.fillRect(rnd(W),rnd(H),1,1)}
var togglePhone = function(){phoneUI=!phoneUI;phApp='home';TN(660,.08,.1)}
var phoneKey = function(c){if(c=='Escape'||c=='Backspace'){if(phApp!='home')phApp='home';else if(c=='Escape')phoneUI=false;return true}
if(phApp=='home'){if(c=='Digit1'){if(bat>0)flash=!flash;NZ(.04,3000,.2,0,'highpass');return true}if(c=='Digit2'){phoneUI=false;return true}}
return false}
var drawPhone = function(){const x=W-122,y=H-206,w=112,h=196;g.globalAlpha=1;g.fillStyle='#8a8d92';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle='#050505';g.fillRect(x,y,w,h);
const sx=x+9,sy=y+26,sw=w-18,sh=h-72;g.fillStyle='#0a1830';g.fillRect(sx,sy,sw,sh);g.fillStyle='#202428';g.beginPath();g.arc(x+w/2,y+h-20,9,0,7);g.fill();g.strokeStyle='#777';g.stroke();g.fillStyle='#222';g.fillRect(x+w/2-12,y+10,24,3);
g.font='7px monospace';g.textBaseline='top';g.textAlign='left';g.fillStyle='#cde';g.fillText(new Date().toLocaleTimeString(LOCALE()).slice(0,5),sx+3,sy+2);g.textAlign='right';g.fillText(Math.round(bat)+'%',sx+sw-3,sy+2);g.textAlign='center';
[['Фонарик',flash?'#ffd54a':'#555'],['Закрыть','#c44']].forEach((a,i)=>{const bx=sx+8+(i%2)*46,by=sy+20+Math.floor(i/2)*50;g.fillStyle=a[1];g.fillRect(bx,by,34,34);g.fillStyle='#fff';g.font='9px monospace';g.fillText(String(i+1),bx+17,by+11);g.font='6px monospace';g.fillText(a[0],bx+17,by+38)});g.textAlign='left'}
let DB=null,_gt=0,_as=null,_al='',_ap=Promise.resolve(),_sqt=null;const ACC={on:false,k:'',nick:'',h:'',provider:'',socialName:'',avatar:'',linked:[]},UNLOCK=1794127864633;
var gy = function(){map=[...Array(N)].map(()=>Array(N).fill(1));for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)map[y][x]=0;
for(let y=2;y<=18;y+=2)for(let x=2;x<=18;x+=2){if(x<5&&y<5)continue;if(x>=7&&x<=13&&y>=7&&y<=13)continue;if(y>=16&&x>=8&&x<=12)continue;if(rnd(10)<6)map[y][x]=7}
for(let i=0;i<9;i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(!(x<5&&y<5)&&!(x>=7&&x<=13&&y>=7&&y<=13)&&!(y>=16&&x>=8&&x<=12)&&map[y][x]==0)map[y][x]=1}
for(let y=8;y<=12;y++)for(let x=8;x<=12;x++)map[y][x]=1;for(let y=9;y<=11;y++)for(let x=9;x<=11;x++)map[y][x]=0;map[12][10]=0;map[N-1][10]=3;EX=10.5;EY=20.5}
var drawStones = function(sd,sw,zs,hor){for(let x=0;x<W;x++){const d=sd[x];if(!d||d>=zs[x])continue;const u=sw[x];if(u<.15||u>.85)continue;const lh=H/d*VFK(),fy=hor+lh/2,c=x/W-.5,L=Math.min(1,.04+FL*Math.exp(-c*c*10)*2.4/(1+d*d*.1)+.06/(1+d*d)+(hid?.1/(1+d*.2):0)),a=(u-.5)/.35,hgt=lh*(.36+.1*Math.sqrt(Math.max(0,1-a*a)));
g.fillStyle='rgb('+(120*L|0)+','+(124*L|0)+','+(122*L|0)+')';g.fillRect(x,fy-hgt,1,hgt);if(Math.abs(u-.5)<.025){g.fillStyle='rgba(20,22,20,.7)';g.fillRect(x,fy-hgt*.85,1,hgt*.5)}if(Math.abs(u-.5)<.1){g.fillStyle='rgba(20,22,20,.6)';g.fillRect(x,fy-hgt*.62,1,Math.max(1,hgt*.04))}g.fillStyle='rgba(10,25,10,.4)';g.fillRect(x,fy-hgt*.12,1,hgt*.12)}}
function updG3(){const b=$('g3');if(!b)return;const isUnlocked=!!(PF.cemeteryUnlocked||PF.m2);let txt,en=false;
if(isUnlocked){txt='ГЛАВА 3 · КЛАДБИЩЕ (ОТКРЫТО)';en=true}else{const left=UNLOCK-Date.now();if(left>0){const s=Math.floor(left/1000);txt='ГЛАВА 3 · КЛАДБИЩЕ — пройди особняк или жди: '+Math.floor(s/86400)+' дн. '+p2(s%86400/3600)+':'+p2(s%3600/60)+':'+p2(s%60)}else{txt='ГЛАВА 3 · КЛАДБИЩЕ — чтобы зайти, пройди особняк'}}
const k=txt+'|'+SET.lang;if(b.__t!==k){b.__t=k;b.textContent=txt;trTree(b)}b.disabled=!en;b.style.opacity=en?1:.55;if(en){b.style.borderColor='#2ed573';b.style.color='#a8ffc8'}}
function updG4(){const b=$('g4');if(!b)return;const isUnlocked=!!(PF.garagesUnlocked||PF.m3||PF.w3);
const txt=isUnlocked?'ГЛАВА 4 · ГАРАЖИ (ОТКРЫТО)':'ГЛАВА 4 · ГАРАЖИ — пройди кладбище';
const k=txt+'|'+SET.lang;if(b.__t!==k){b.__t=k;b.textContent=txt;trTree(b)}
b.disabled=!isUnlocked;b.style.opacity=isUnlocked?1:.55;if(isUnlocked){b.style.borderColor='#ff9f1a';b.style.color='#ffe082'}else{b.style.borderColor='';b.style.color=''}}
$('g3').onclick=()=>{if($('g3').disabled)return;if(MP.on){try{MP.room.leave()}catch(e){}MP.on=false}prev=null;$('cont').style.display='none';ch=3;start()};
const b64=buf=>btoa(String.fromCharCode(...new Uint8Array(buf))),okNick=n=>/^[A-Za-z0-9_]{3,12}$/.test(n);
async function hashPw(pw,saltB64){const enc=new TextEncoder(),salt=Uint8Array.from(atob(saltB64),c=>c.charCodeAt(0)),key=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);return b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256))}
function accMsg(t,bad){const m=$('am');if(m){m.textContent=t;m.style.color=bad?'#e77':'#7d7'}}
function accData(){return{games:PF.games|0,wins:PF.wins|0,deaths:PF.deaths|0,keys:PF.keys|0,sec:Math.floor(PF.sec||0),coop:PF.coop|0,best:PF.best|0,coins:Math.max(0,Math.floor(Number(PF.coins)||0)),skins:PF.skins,owned:PF.owned||PF.skins||[0],skin:PF.skin|0,avatar:PF.avatar||'survivor',frame:PF.frame||'frame_classic',customAvatar:PF.customAvatar||'',ownedHeadAcc:PF.ownedHeadAcc||[0],ownedFaceAcc:PF.ownedFaceAcc||[0],headAcc:PF.headAcc|0,faceAcc:PF.faceAcc|0,ownedCars:PF.ownedCars||['vaz2112'],eqCar:PF.eqCar||'vaz2112',carColors:PF.carColors||{vaz2112:'#6f7882'},ownedMonSkins:PF.ownedMonSkins||['maze'],eqMonSkin:PF.eqMonSkin||'maze',redeemedCodes:PF.redeemedCodes||[],phoneCase:PF.phoneCase|0,phoneWallpaper:PF.phoneWallpaper|0,phoneCharm:PF.phoneCharm|0,phoneSticker:PF.phoneSticker|0,isDeveloper:PF.isDeveloper?1:0,devNick:PF.devNick||'',m2:(PF.m2||PF.cemeteryUnlocked)?1:0,cemeteryUnlocked:(PF.cemeteryUnlocked||PF.m2)?1:0,m3:(PF.m3||PF.garagesUnlocked)?1:0,garagesUnlocked:(PF.garagesUnlocked||PF.m3)?1:0,jaUnlocked:(PF.jaUnlocked||SET.jaUnlocked)?1:0,vazCh3:PF.vazCh3?1:0,vazCh4:PF.vazCh4?1:0,foundVazParts:normalizeDiscoveredMap(PF.foundVazParts),foundMazeNotes:normalizeDiscoveredNotes(PF.foundMazeNotes),w1:PF.w1?1:0,w2:PF.w2?1:0,w3:PF.w3?1:0,w4:PF.w4?1:0,friends:PF.friends,first:PF.first}}
function mergeP(p){for(const f of['games','wins','deaths','keys','sec','coop','coins'])PF[f]=Math.max(Math.max(0,Math.floor(Number(PF[f])||0)),Math.max(0,Math.floor(Number(p[f])||0)));PF.best=(PF.best&&p.best)?Math.min(PF.best,p.best):(PF.best||p.best||0);PF.skins=[...new Set([...(PF.skins||[0]),...(PF.owned||[0]),...(p.skins||[]),...(p.owned||[])])];PF.owned=PF.skins;if(p.skin!==undefined)PF.skin=p.skin;if(p.avatar)PF.avatar=p.avatar;if(p.frame)PF.frame=p.frame;if(p.customAvatar&&!PF.customAvatar)PF.customAvatar=p.customAvatar;PF.ownedHeadAcc=[...new Set([...(PF.ownedHeadAcc||[0]),...(p.ownedHeadAcc||[])])];PF.ownedFaceAcc=[...new Set([...(PF.ownedFaceAcc||[0]),...(p.ownedFaceAcc||[])])];if(p.headAcc!==undefined)PF.headAcc=p.headAcc;if(p.faceAcc!==undefined)PF.faceAcc=p.faceAcc;PF.ownedCars=[...new Set([...(PF.ownedCars||['vaz2112']),...(p.ownedCars||[])])];if(p.eqCar)PF.eqCar=p.eqCar;if(p.carColors&&typeof p.carColors==='object')PF.carColors=Object.assign({},p.carColors,PF.carColors||{});PF.ownedMonSkins=[...new Set([...(PF.ownedMonSkins||['maze']),...(p.ownedMonSkins||[])])];if(p.eqMonSkin)PF.eqMonSkin=p.eqMonSkin;PF.redeemedCodes=[...new Set([...(PF.redeemedCodes||[]),...(Array.isArray(p.redeemedCodes)?p.redeemedCodes:[])])];if(p.phoneCase!==undefined)PF.phoneCase=Math.max(PF.phoneCase||0,p.phoneCase||0);if(p.phoneWallpaper!==undefined)PF.phoneWallpaper=Math.max(PF.phoneWallpaper||0,p.phoneWallpaper||0);if(p.phoneCharm!==undefined)PF.phoneCharm=Math.max(PF.phoneCharm||0,p.phoneCharm||0);if(p.phoneSticker!==undefined)PF.phoneSticker=Math.max(PF.phoneSticker||0,p.phoneSticker||0);if(p.isDeveloper&&p.devNick){PF.isDeveloper=1;PF.devNick=p.devNick;}PF.m2=PF.m2||p.m2||p.cemeteryUnlocked||PF.w2||p.w2;PF.cemeteryUnlocked=PF.cemeteryUnlocked||p.cemeteryUnlocked||p.m2||PF.w2||p.w2;PF.m3=PF.m3||p.m3||p.garagesUnlocked||PF.w3||p.w3;PF.garagesUnlocked=PF.garagesUnlocked||p.garagesUnlocked||p.m3||PF.w3||p.w3;PF.vazCh3=PF.vazCh3||p.vazCh3;PF.vazCh4=PF.vazCh4||p.vazCh4;PF.foundVazParts=mergeDiscoveredParts(PF.foundVazParts,p.foundVazParts);PF.foundMazeNotes=mergeDiscoveredNotes(PF.foundMazeNotes,p.foundMazeNotes);for(const w of['w1','w2','w3','w4'])PF[w]=PF[w]||p[w];if(p.jaUnlocked){PF.jaUnlocked=1;SET.jaUnlocked=1;sv()}const fm=new Map();for(const f of[...(p.friends||[]),...(PF.friends||[])])if(f&&f.id)fm.set(f.id,f);PF.friends=[...fm.values()];PF.first=Math.min(PF.first||Date.now(),p.first||Date.now())}
function accSave(){if(!ACC.on||!DB)return;clearTimeout(_as);_as=setTimeout(()=>{const d=accData(),j=JSON.stringify(d);if(j===_al)return;_al=j;_ap=_ap.then(()=>DB.doc('acc/'+ACC.k).update({p:d,sk:d.skin,w:d.wins}).catch(()=>{}))},4000)}
async function accLogin(k,nick,h,d){ACC.on=true;ACC.k=k;ACC.nick=nick;ACC.h=h;PF.name=nick;if(d&&d.p)mergeP(d.p);try{localStorage.setItem('horror_acc',JSON.stringify({k,h}))}catch(e){}$('nick').value=nick;pWrite();renderAcct();renderSocialBar();updateCoopStylePreview();syncCoopProfile();ro();updG3();updG4()}
async function regAcc(nick,pw){if(!DB){accMsg('Аккаунты недоступны: войди в Claude и открой ссылку из аккаунта.',1);return}
if(!okNick(nick)){accMsg('Ник: 3–12 символов, латиница, цифры и _',1);return}if(pw.length<4){accMsg('Пароль: минимум 4 символа',1);return}
accMsg('Регистрация…');const k=nick.toLowerCase(),ref=DB.doc('acc/'+k);try{const a=await ref.acquire({holder:'r'+Math.random().toString(36).slice(2),ttlMs:8000});if(!a.acquired){accMsg('Попробуй ещё раз через пару секунд.',1);return}
const s=await ref.get();if(s.exists&&s.data().h){accMsg('Этот ник уже занят.',1);return}
const salt=b64(crypto.getRandomValues(new Uint8Array(16))),h=await hashPw(pw,salt);await ref.set({k,nick,h,s:salt,c:Date.now(),sk:PF.skin|0,p:accData()});await accLogin(k,nick,h,null);accMsg('Аккаунт создан. Добро пожаловать, '+nick+'!')}catch(e){accMsg('Не удалось: '+((e&&e.message)||e),1)}}
async function loginAcc(nick,pw){if(!DB){accMsg('Аккаунты недоступны: войди в Claude и открой ссылку из аккаунта.',1);return}if(!okNick(nick)){accMsg('Ник: 3–12 символов, латиница, цифры и _',1);return}
accMsg('Вход…');try{const s=await DB.doc('acc/'+nick.toLowerCase()).get();if(!s.exists||!s.data().h){accMsg('Аккаунт не найден.',1);return}const d=s.data(),h=await hashPw(pw,d.s);if(h!==d.h){accMsg('Неверный пароль.',1);return}await accLogin(d.k,d.nick,h,d);accMsg('Вы вошли как '+d.nick)}catch(e){accMsg('Не удалось: '+((e&&e.message)||e),1)}}
async function autoLogin(){
  try {
    const sAuth = getStoredSocialAuth();
    const a = sAuth && (sAuth.account || sAuth);
    if (a && a.provider) {
      ACC.on = true;
      ACC.k = a.id || ('u_' + (a.nick || 'player'));
      ACC.nick = a.nick || 'Игрок';
      ACC.provider = a.provider;
      ACC.socialName = a.name || a.nick;
      ACC.avatar = a.avatar || getAvatarSvg(a.provider);
      ACC.linked = sAuth.linked || [a.provider];
      PF.name = ACC.nick;
      const ni = $('nick'); if (ni) ni.value = ACC.nick;
      pWrite();
      renderAcct();
      renderSocialBar();
      updateCoopStylePreview();
      syncCoopProfile();
      return;
    }
    const j=JSON.parse(localStorage.getItem('horror_acc')||'null');
    if(!j)return;
    if(j.provider){
      ACC.on = true;
      ACC.nick = j.nick || 'Игрок';
      ACC.provider = j.provider;
      ACC.avatar = getAvatarSvg(j.provider);
      PF.name = ACC.nick;
      renderAcct();
      renderSocialBar();
      updateCoopStylePreview();
      syncCoopProfile();
      return;
    }
  } catch(e){}
}

function showToast(msg) {
  let t = $('soc_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'soc_toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a0808;border:2px solid #a22;color:#fcc;padding:10px 20px;font:14px Georgia,serif;z-index:9999;border-radius:6px;box-shadow:0 0 20px rgba(180,0,0,0.6);pointer-events:none;transition:opacity 0.3s;opacity:0';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._tm);
  t._tm = setTimeout(() => { t.style.opacity = '0'; }, 3500);
}

function socialLogin(providerId, customNick, avatarEmoji, avatarBg) {
  const p = SOCIAL_PROVIDERS[providerId] || SOCIAL_PROVIDERS.vk;
  const rawNick = (customNick && customNick.trim()) || p.defaultNick;
  const cleanNick = rawNick.replace(/[^A-Za-z0-9_а-яА-ЯёЁ]/g, '').slice(0, 10) || 'Игрок';
  const id = providerId + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const avatar = getAvatarSvg(providerId, avatarEmoji || '🔦', avatarBg || '#1e293b');

  ACC.on = true;
  ACC.k = id;
  ACC.nick = cleanNick;
  ACC.h = '';
  ACC.provider = providerId;
  ACC.socialName = cleanNick;
  ACC.avatar = avatar;
  if (!Array.isArray(ACC.linked)) ACC.linked = [];
  if (!ACC.linked.includes(providerId)) ACC.linked.push(providerId);

  PF.name = cleanNick;
  const ni = $('nick'); if (ni) ni.value = cleanNick;

  let gotBonus = false;
  if (!PF.socBonus) {
    PF.socBonus = 1;
    PF.coins = (PF.coins || 0) + 50;
    gotBonus = true;
  }

  setStoredSocialAuth({
    account: {
      id,
      nick: cleanNick,
      name: cleanNick,
      provider: providerId,
      avatar,
      linkedAt: Date.now()
    },
    linked: ACC.linked
  });

  try {
    localStorage.setItem('horror_acc', JSON.stringify({ k: id, nick: cleanNick, provider: providerId, avatar, linked: ACC.linked }));
  } catch (e) {}

  pWrite();
  try{unlockAchievement('social_butterfly',{PF,pWrite,ac,TN})}catch(e){}
  renderAcct();
  renderSocialBar();
  updateCoopStylePreview();
  syncCoopProfile();
  ro();

  try {
    if (ac) {
      TN(523, .1, .2, 'sine');
      setTimeout(() => TN(659, .1, .2, 'sine'), 100);
      setTimeout(() => TN(784, .25, .25, 'triangle'), 200);
    }
  } catch (e) {}

  const bonusMsg = gotBonus ? ' • Получен бонус +50 🪙!' : '';
  say('Вход через ' + p.name + ' выполнен!' + bonusMsg, 4);
  showToast('✓ Авторизован через ' + p.name + (gotBonus ? ' (+50 монет)' : ''));
}

function linkSocialProvider(providerId, customNick) {
  const p = SOCIAL_PROVIDERS[providerId] || SOCIAL_PROVIDERS.vk;
  if (!Array.isArray(ACC.linked)) ACC.linked = [ACC.provider || 'local'];
  if (!ACC.linked.includes(providerId)) {
    ACC.linked.push(providerId);
    PF.coins = (PF.coins || 0) + 25;
    say('Сеть ' + p.name + ' привязана (+25 монет)!', 4);
    showToast('✓ Привязана сеть ' + p.name + ' (+25 монет)');
  } else {
    say('Сеть ' + p.name + ' уже привязана.', 3);
  }
  const sAuth = getStoredSocialAuth() || {};
  sAuth.linked = ACC.linked;
  setStoredSocialAuth(sAuth);
  pWrite();
  renderAcct();
  renderSocialBar();
}

function socialLogout() {
  ACC.on = false;
  ACC.k = '';
  ACC.nick = '';
  ACC.provider = '';
  ACC.avatar = '';
  ACC.linked = [];
  try {
    localStorage.removeItem('horror_social_auth');
    localStorage.removeItem('horror_acc');
  } catch (e) {}
  renderAcct();
  renderSocialBar();
  updateCoopStylePreview();
  syncCoopProfile();
  ro();
  say('Вы вышли из аккаунта.', 3);
  showToast('Вы вышли из аккаунта');
}

function showSocialLoginModal(providerId, isLinking = false) {
  const p = SOCIAL_PROVIDERS[providerId] || SOCIAL_PROVIDERS.vk;
  let m = $('soc_modal');
  if (m) disposeAnimatedModal(m);

  m = document.createElement('div');
  m.id = 'soc_modal';
  m.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 45%, rgba(16,4,6,0.90) 0%, rgba(2,1,2,0.97) 75%);backdrop-filter:blur(7px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  let selectedEmoji = AVATAR_PRESETS[0]?.emoji || '🔦';
  let selectedBg = '#14080a';

  m.innerHTML = `
    <div style="background:#050203;border:1px solid #4d1218;width:100%;max-width:390px;border-radius:2px;padding:24px 20px 20px;color:#cfc2b4;font-family:Georgia,serif;box-shadow:inset 0 0 40px rgba(0,0,0,0.96), 0 0 36px rgba(90,8,12,0.28);position:relative;box-sizing:border-box">
      <button id="sm_close" style="position:absolute;top:12px;right:14px;background:transparent;border:0;color:#6e5656;font-size:18px;cursor:pointer;padding:4px 6px;margin:0">✕</button>

      <div style="text-align:center;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #2b0b0f">
        <div style="font-size:10px;letter-spacing:0.28em;color:#7e2026;font-family:monospace;margin-bottom:5px">${p.name.toUpperCase()}</div>
        <h2 style="margin:0;font-size:17px;font-weight:normal;color:#dfd2c3;letter-spacing:0.18em">${isLinking ? 'ПРИВЯЗКА СЕТИ' : 'ИДЕНТИФИКАЦИЯ'}</h2>
      </div>

      <div style="margin-bottom:14px">
        <label style="display:block;font-size:10.5px;letter-spacing:0.14em;color:#8a726c;font-family:monospace;margin-bottom:6px">ПОЗЫВНОЙ</label>
        <input id="sm_nick" value="${(PF.name || p.defaultNick).slice(0, 10)}" maxlength="10" style="width:100%;box-sizing:border-box;background:#080304;border:1px solid #3c1015;color:#e6dacb;padding:10px;font-size:14px;font-family:Georgia,serif;border-radius:2px;outline:none" />
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block;font-size:10.5px;letter-spacing:0.14em;color:#8a726c;font-family:monospace;margin-bottom:6px">МЕТКА</label>
        <div id="sm_avatars" style="display:flex;gap:6px;justify-content:space-between">
          ${AVATAR_PRESETS.map((av, idx) => `
            <div data-emoji="${av.emoji}" data-bg="#14080a" class="sm-av-btn" style="flex:1;cursor:pointer;padding:7px 2px;text-align:center;border-radius:2px;background:${idx === 0 ? '#180608' : '#080304'};border:1px solid ${idx === 0 ? '#8c1d24' : '#2a0b0e'};filter:grayscale(0.35);transition:all 0.15s">
              <div style="font-size:17px">${av.emoji}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="sm_status" style="font-size:11px;font-family:monospace;letter-spacing:0.08em;color:#b86b6b;margin-bottom:12px;text-align:center;display:none;padding:6px;background:#0c0405;border:1px solid #3c1014">
        УСТАНОВКА СВЯЗИ...
      </div>

      <button id="sm_submit" style="width:100%;margin:0;padding:12px;background:#1a0507;color:#dfd2c3;border:1px solid #751820;font-size:13px;letter-spacing:0.16em;font-family:Georgia,serif;border-radius:2px;cursor:pointer">
        ${isLinking ? 'ПРИВЯЗАТЬ' : 'ПОДТВЕРДИТЬ ВХОД'}
      </button>
    </div>
  `;

  document.body.appendChild(m);
  openAnimatedModal(m);

  const avBtns = m.querySelectorAll('.sm-av-btn');
  avBtns.forEach(btn => {
    btn.onclick = () => {
      avBtns.forEach(b => {
        b.style.borderColor = '#2a0b0e';
        b.style.background = '#080304';
      });
      btn.style.borderColor = '#8c1d24';
      btn.style.background = '#180608';
      selectedEmoji = btn.getAttribute('data-emoji');
      selectedBg = btn.getAttribute('data-bg');
    };
  });

  const closeSocModal = () => closeAnimatedModal(m);
  $('sm_close').onclick = closeSocModal;
  m.onclick = (e) => { if (e.target === m) closeSocModal(); };

  const submitBtn = $('sm_submit');
  const statusEl = $('sm_status');
  const nickInput = $('sm_nick');

  submitBtn.onclick = () => {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    statusEl.style.display = 'block';

    setTimeout(() => {
      statusEl.style.color = '#d9b5a6';
      statusEl.textContent = 'ДОСТУП ОТКРЫТ.';
      setTimeout(() => {
        closeAnimatedModal(m, {
          onDone: () => {
            if (isLinking) {
              linkSocialProvider(providerId, nickInput.value);
            } else {
              socialLogin(providerId, nickInput.value, selectedEmoji, selectedBg);
            }
          }
        });
      }, 360);
    }, 520);
  };
}

function showShareModal(roomCode) {
  const code = roomCode || ($('code') && $('code').value) || 'game';
  const url = window.location.href.split('#')[0];
  const shareText = `Я играю в хоррор «НЕ ОБОРАЧИВАЙСЯ»! Заходи ко мне в кооператив, код комнаты: ${code} 👻`;

  let m = $('share_modal');
  if (m) disposeAnimatedModal(m);

  m = document.createElement('div');
  m.id = 'share_modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';

  m.innerHTML = `
    <div style="background:#0f0909;border:2px solid #a22;width:100%;max-width:440px;border-radius:10px;padding:24px;color:#eee;font-family:Georgia,serif;box-shadow:0 0 35px rgba(170,34,34,0.4);position:relative;box-sizing:border-box;text-align:center">
      <button id="shm_close" style="position:absolute;top:14px;right:16px;background:transparent;border:0;color:#aaa;font-size:20px;cursor:pointer;padding:4px;margin:0">✕</button>
      
      <div style="font-size:32px;margin-bottom:8px">📢</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#fcc;letter-spacing:0.05em">ПРИГЛАСИТЬ ДРУЗЕЙ В КООП</h2>
      <p style="font-size:13px;color:#aaa;margin:0 0 16px">Код вашей комнаты: <b style="color:#fd4;font-size:16px;letter-spacing:0.1em">${code}</b></p>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        <a id="sh_tg" href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;background:#24A1DE;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold">
          <span style="font-size:18px">✈️</span> Отправить в Telegram
        </a>
        <a id="sh_vk" href="https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;background:#0077FF;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold">
          <span style="font-size:18px">🔷</span> Поделиться ВКонтакте
        </a>
        <a id="sh_wa" href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;background:#25D366;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold">
          <span style="font-size:18px">💬</span> Отправить в WhatsApp
        </a>
        <button id="sh_copy" style="margin:0;padding:12px;background:#300;color:#fcc;border:1px solid #a22;border-radius:6px;font-size:14px;cursor:pointer">
          📋 Скопировать приглашение
        </button>
      </div>
      <div id="sh_copied" style="font-size:12px;color:#5d5;display:none">✓ Ссылка и код скопированы в буфер!</div>
    </div>
  `;

  document.body.appendChild(m);
  openAnimatedModal(m);

  const closeShareModal = () => closeAnimatedModal(m);
  $('shm_close').onclick = closeShareModal;
  m.onclick = (e) => { if (e.target === m) closeShareModal(); };

  $('sh_copy').onclick = () => {
    navigator.clipboard.writeText(`${shareText}\n${url}`).then(() => {
      $('sh_copied').style.display = 'block';
      showToast('Ссылка на комнату скопирована!');
      setTimeout(() => closeAnimatedModal(m), 1200);
    }).catch(() => {
      showToast('Код комнаты: ' + code);
    });
  };
}

function renderSocialBar() {
  let bar = $('soc_auth_bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'soc_auth_bar';
    bar.style.cssText = 'width:100%;max-width:560px;margin:16px 0 8px;padding:14px;background:rgba(7,2,3,0.92);border:1px solid #451014;border-radius:2px;box-sizing:border-box;box-shadow:inset 0 0 26px rgba(0,0,0,0.9)';
    
    const dif = $('dif');
    if (dif) dif.insertAdjacentElement('afterend', bar);
    else {
      const g3 = $('g3');
      if (g3) g3.insertAdjacentElement('afterend', bar);
      else if ($('ov')) $('ov').appendChild(bar);
    }
  }

  if (ACC.on) {
    const prov = SOCIAL_PROVIDERS[ACC.provider] || { name: 'Аккаунт', color: '#751820', badgeText: 'ID' };
    const avatarImg = PF.customAvatar || ACC.avatar || getAvatarSvg(ACC.provider || 'vk');
    const linkedList = Array.isArray(ACC.linked) ? ACC.linked : [ACC.provider || 'vk'];
    const devBadgeHtml = isDevBadgeForNick(ACC.nick) ? renderDeveloperBadgeHtml(true) : '';

    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:11px">
          <div style="position:relative;width:40px;height:40px;border-radius:2px;overflow:hidden;border:1px solid #6b151a;background:#0a0304;flex-shrink:0">
            <img src="${avatarImg}" style="width:100%;height:100%;object-fit:cover;filter:contrast(1.06) brightness(0.9)" />
          </div>
          <div style="text-align:left">
            <div style="color:#dfd2c3;font-size:14.5px;letter-spacing:0.06em;display:flex;align-items:center;gap:6px">
              ${esc(ACC.nick)}
              <span style="font-size:10px;font-family:monospace;padding:1px 6px;border-radius:2px;background:#140507;border:1px solid #4d1218;color:#b89e92">${prov.name}</span>
            </div>
            ${devBadgeHtml}
            <div style="font-size:11px;font-family:monospace;color:#786560;margin-top:2px">СЕАНС АКТИВЕН · СЕТЕЙ: ${linkedList.length}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button id="sb_profile" style="margin:0;padding:6px 11px;font-size:11.5px;letter-spacing:0.05em;background:#0c0405;border:1px solid #4d1218;color:#d6c7b8;border-radius:2px;cursor:pointer">Профиль</button>
          <button id="sb_link" style="margin:0;padding:6px 11px;font-size:11.5px;letter-spacing:0.05em;background:#090304;border:1px solid #381014;color:#b8a89a;border-radius:2px;cursor:pointer">+ Сеть</button>
          <button id="sb_share" style="margin:0;padding:6px 11px;font-size:11.5px;letter-spacing:0.05em;background:#090304;border:1px solid #381014;color:#b8a89a;border-radius:2px;cursor:pointer">Пригласить</button>
          <button id="sb_out" style="margin:0;padding:6px 10px;font-size:11.5px;letter-spacing:0.05em;background:#080203;border:1px solid #2b0b0e;color:#826666;border-radius:2px;cursor:pointer">Выйти</button>
        </div>
      </div>
    `;

    $('sb_profile').onclick = () => { const pb = $('pbtn'); if (pb) pb.click(); };
    $('sb_link').onclick = () => {
      showSocialAuthModal({
        PF,
        pWrite,
        ac,
        TN,
        onLoginSuccess: () => {
          autoLogin();
          renderSocialBar();
        }
      });
    };
    $('sb_share').onclick = () => { showShareModal(); };
    $('sb_out').onclick = () => { socialLogout(); };
  } else {
    bar.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:6px">
        <span style="color:#dfd2c3;font-size:13px;letter-spacing:0.18em;font-family:Georgia,serif">ИДЕНТИФИКАЦИЯ</span>
        <span style="color:#6e2429;font-size:10px;font-family:monospace;letter-spacing:0.14em">ВНЕ СЕТИ</span>
      </div>
      <div style="font-size:11.5px;color:#786560;margin-bottom:11px;text-align:left;font-style:italic">
        Сохрани своё имя и прогресс перед входом в темноту.
      </div>
      
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <button id="sb_btn_google" style="flex:1;min-width:170px;margin:0;padding:10px 14px;background:#0a0304;color:#d6c7b8;border:1px solid #451217;border-radius:2px;font-size:13px;letter-spacing:0.05em;font-family:Georgia,serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color 0.15s, background 0.15s">
          <span style="display:flex;align-items:center;opacity:0.8">${SOCIAL_PROVIDERS.google.iconSvg}</span>
          <span>Войти через Google</span>
        </button>
        <button id="sb_btn_vk" style="flex:1;min-width:170px;margin:0;padding:10px 14px;background:#0a0304;color:#d6c7b8;border:1px solid #451217;border-radius:2px;font-size:13px;letter-spacing:0.05em;font-family:Georgia,serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color 0.15s, background 0.15s">
          <span style="display:flex;align-items:center;opacity:0.8">${SOCIAL_PROVIDERS.vk.iconSvg}</span>
          <span>Войти через VK ID</span>
        </button>
      </div>

      <div style="display:flex;gap:6px;justify-content:center">
        <button data-prov="telegram" class="soc-btn-other" style="flex:1;margin:0;padding:7px;font-size:11.5px;background:#080203;color:#a8988c;border:1px solid #320d12;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.telegram.iconSvg}</span><span>Telegram</span>
        </button>
        <button data-prov="yandex" class="soc-btn-other" style="flex:1;margin:0;padding:7px;font-size:11.5px;background:#080203;color:#a8988c;border:1px solid #320d12;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.yandex.iconSvg}</span><span>Яндекс</span>
        </button>
        <button data-prov="discord" class="soc-btn-other" style="flex:1;margin:0;padding:7px;font-size:11.5px;background:#080203;color:#a8988c;border:1px solid #320d12;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px">
          <span style="display:flex;align-items:center;opacity:0.75">${SOCIAL_PROVIDERS.discord.iconSvg}</span><span>Discord</span>
        </button>
      </div>
    `;

    const openModalWithProvider = () => {
      showSocialAuthModal({
        PF,
        pWrite,
        ac,
        TN,
        onLoginSuccess: () => {
          autoLogin();
          renderSocialBar();
        }
      });
    };

    const gBtn = $('sb_btn_google'); if (gBtn) gBtn.onclick = openModalWithProvider;
    const vBtn = $('sb_btn_vk'); if (vBtn) vBtn.onclick = openModalWithProvider;

    bar.querySelectorAll('.soc-btn-other').forEach(btn => {
      btn.onclick = openModalWithProvider;
    });
  }
}

function renderAcct(){
  const el=$('acct');if(!el)return;el.textContent='';
  const mk2=(tag,css,txt)=>{const e=document.createElement(tag);if(css)e.style.cssText=css;if(txt)e.textContent=txt;return e};
  el.appendChild(mk2('h3','color:#a44;margin:12px 0 6px;letter-spacing:0.14em;font-weight:normal;font-size:14px','ИДЕНТИФИКАЦИЯ'));
  if($('pnm'))$('pnm').disabled=ACC.on;

  if(ACC.on){
    const prov = SOCIAL_PROVIDERS[ACC.provider] || { name: 'Аккаунт', color: '#751820' };
    const avatarImg = PF.customAvatar || ACC.avatar || getAvatarSvg(ACC.provider || 'vk');
    const linked = Array.isArray(ACC.linked) ? ACC.linked : [ACC.provider || 'vk'];
    const devBadgeHtml = isDevBadgeForNick(ACC.nick) ? renderDeveloperBadgeHtml(true) : '';

    const card = document.createElement('div');
    card.style.cssText = 'background:#060203;border:1px solid #451014;border-radius:2px;padding:12px;margin:8px 0;text-align:left;box-shadow:inset 0 0 20px rgba(0,0,0,0.85)';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <img src="${avatarImg}" style="width:42px;height:42px;border-radius:2px;object-fit:cover;border:1px solid #6b151a;background:#0a0304;flex-shrink:0" />
        <div>
          <div style="font-size:15px;color:#dfd2c3;letter-spacing:0.05em">${esc(ACC.nick)}</div>
          ${devBadgeHtml}
          <div style="font-size:11px;font-family:monospace;color:#786560">${prov.name} · ID ${esc(String(ACC.k).slice(-8))}</div>
        </div>
      </div>
      <div style="font-size:11.5px;color:#8a726c;margin-bottom:8px">
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
          ${linked.map(lid => {
            const lp = SOCIAL_PROVIDERS[lid] || { name: lid, color: '#666' };
            return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:2px;background:#0f0406;border:1px solid #4d1218;font-size:10.5px;color:#b8a89a">${lp.name}</span>`;
          }).join('')}
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button id="p_link_more" style="margin:0;padding:6px 11px;font-size:11.5px;background:#0a0304;border:1px solid #451217;color:#c9b8a8;border-radius:2px;cursor:pointer">+ Привязать сеть</button>
        <button id="p_share_acc" style="margin:0;padding:6px 11px;font-size:11.5px;background:#0a0304;border:1px solid #3a1014;color:#b8a89a;border-radius:2px;cursor:pointer">Пригласить</button>
        <button id="p_acc_out" style="margin:0;padding:6px 11px;font-size:11.5px;background:#120406;border:1px solid #6b151a;color:#d49e9e;border-radius:2px;cursor:pointer">Выйти</button>
      </div>
    `;
    el.appendChild(card);

    $('p_link_more').onclick = () => {
      const unlinked = Object.keys(SOCIAL_PROVIDERS).filter(k => !linked.includes(k));
      if (unlinked.length > 0) showSocialLoginModal(unlinked[0], true);
      else say('Все доступные сети уже привязаны!', 3);
    };
    $('p_share_acc').onclick = () => showShareModal();
    $('p_acc_out').onclick = () => socialLogout();
  } else {
    const sBox = document.createElement('div');
    sBox.style.cssText = 'background:#060203;border:1px solid #451014;border-radius:2px;padding:12px;margin:8px 0;text-align:left;box-shadow:inset 0 0 20px rgba(0,0,0,0.85)';
    sBox.innerHTML = `
      <div style="font-size:11.5px;font-family:monospace;letter-spacing:0.12em;color:#9c7f78;margin-bottom:8px">ВХОД ЧЕРЕЗ ВНЕШНИЙ ПРОФИЛЬ</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        ${Object.values(SOCIAL_PROVIDERS).map(p => `
          <button data-prov="${p.id}" class="p-soc-btn" style="margin:0;padding:6px 10px;font-size:11.5px;background:#0b0405;color:#cfc2b4;border:1px solid #451217;border-radius:2px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            ${p.name}
          </button>
        `).join('')}
      </div>
      <div style="font-size:11px;color:#6e5a56;margin-bottom:6px;border-top:1px solid #260a0d;padding-top:8px">Или по логину:</div>
    `;
    el.appendChild(sBox);

    sBox.querySelectorAll('.p-soc-btn').forEach(b => {
      b.onclick = () => {
        showSocialLoginModal(b.getAttribute('data-prov'), false);
      };
    });

    const i1=mk2('input','width:140px;margin-right:4px;background:#080304;border:1px solid #3c1015;color:#dfd2c3;padding:6px 8px;border-radius:2px');i1.id='an';i1.placeholder='позывной';i1.maxLength=12;
    const i2=mk2('input','width:140px;margin-right:4px;background:#080304;border:1px solid #3c1015;color:#dfd2c3;padding:6px 8px;border-radius:2px');i2.id='ap';i2.type='password';i2.placeholder='пароль';i2.maxLength=32;
    const b1=mk2('button','margin:4px;padding:6px 12px;font-size:12px;background:#0a0304;border:1px solid #451217;color:#c9b8a8;border-radius:2px;cursor:pointer','Регистрация');
    const b2=mk2('button','margin:4px;padding:6px 12px;font-size:12px;background:#160507;border:1px solid #6b151a;color:#dfd2c3;border-radius:2px;cursor:pointer','Войти');
    b1.onclick=()=>regAcc(i1.value.trim(),i2.value);
    b2.onclick=()=>loginAcc(i1.value.trim(),i2.value);
    el.append(i1,i2,b1,b2);
  }
  el.appendChild(mk2('div','font-size:12px;margin:4px 0')).id='am';
}
$('#pfd') && $('#pfd').insertAdjacentHTML('beforebegin',"<div id='acct'></div>");renderAcct();renderSocialBar();
var gy = function(){map=[...Array(N)].map(()=>Array(N).fill(1));for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)map[y][x]=0;
for(let y=2;y<=18;y+=2)for(let x=2;x<=18;x+=2){if(x<5&&y<5)continue;if(x>=7&&x<=13&&y>=7&&y<=13)continue;if(y>=16&&x>=8&&x<=12)continue;if(rnd(10)<6)map[y][x]=7}
for(let i=0;i<9;i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(!(x<5&&y<5)&&!(x>=7&&x<=13&&y>=7&&y<=13)&&!(y>=16&&x>=8&&x<=12)&&map[y][x]==0)map[y][x]=1}
for(let y=8;y<=12;y++)for(let x=8;x<=12;x++)map[y][x]=1;for(let y=9;y<=11;y++)for(let x=9;x<=11;x++)map[y][x]=0;map[12][10]=0;map[N-1][10]=3;EX=10.5;EY=20.5;
for(let it=0;it<60;it++){const seen=new Set([N+1]),q=[[1,1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*N+nx;if(nx>0&&ny>0&&nx<N-1&&ny<N-1&&!seen.has(k)&&map[ny][nx]==0){seen.add(k);q.push([nx,ny])}}}
let fixed=false;for(let y=1;y<N-1&&!fixed;y++)for(let x=1;x<N-1&&!fixed;x++){if(map[y][x]!=0||seen.has(y*N+x))continue;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx>0&&ny>0&&nx<N-1&&ny<N-1&&(map[ny][nx]==7||(map[ny][nx]==1&&!(nx>=8&&nx<=12&&ny>=8&&ny<=12)))){map[ny][nx]=0;fixed=true;break}}}if(!fixed)break}}
let stg='base',FRI=null,FUR=[],RM=[],csDone=0,cs2T=0,cs2={},survT=600,survShow=0,rmLast='';
const NK=()=>ch==2?(stg=='base'?1:stg=='post'?0:99):ch==4?(DIFF=='extreme'?12:DIFF=='hard'?8:5):3,NMS={bed:'Спальня',bath:'Ванная',kit:'Кухня',pan:'Кладовка',liv:'Гостиная',st1:'Склад 1',st2:'Склад 2',st3:'Склад 3',w1:'Палата 154',w2:'Палата 155',w3:'Палата 156',pr:'Процедурная',ar:'Архив',lab:'Лаборатория',cor:'Коридор'};
const friendImg=mk(128,40,x=>{x.fillStyle='rgba(90,0,0,.9)';x.beginPath();x.ellipse(64,34,60,6,0,0,7);x.fill();x.fillStyle='#2e4c7a';x.fillRect(30,18,56,14);x.fillStyle='#2a2a30';x.fillRect(4,24,30,8);x.fillStyle='#8a0000';x.fillRect(2,24,4,8);x.fillStyle='#d8b090';x.fillRect(84,22,12,6);x.fillStyle='#8a0000';x.fillRect(86,12,6,8);x.fillStyle='#e8c9a8';x.beginPath();x.arc(106,22,10,0,7);x.fill();x.fillStyle='#3a2414';x.beginPath();x.arc(108,17,9,Math.PI,0);x.fill();x.fillStyle='#000';x.fillRect(105,21,2,2);x.fillRect(110,21,2,2);x.fillStyle='#8a0000';x.fillRect(100,28,10,2)});
const tubImg=mk(96,40,x=>{x.fillStyle='rgba(20,10,5,.4)';x.beginPath();x.ellipse(48,37,44,4,0,0,7);x.fill();x.fillStyle='#d8dde0';x.fillRect(4,12,88,22);x.fillStyle='#8a9aa3';x.fillRect(8,14,80,8);x.fillStyle='#777';x.fillRect(10,34,6,4);x.fillRect(80,34,6,4)});
const stoveImg=mk(48,56,x=>{x.fillStyle='#c8c8c8';x.fillRect(4,8,40,46);x.fillStyle='#222';x.fillRect(8,12,32,10);x.fillStyle='#555';for(let i=0;i<4;i++){x.beginPath();x.arc(14+(i%2)*20,16+(i>>1)*0,4,0,7);x.fill()}x.fillStyle='#333';x.fillRect(10,30,28,18)});
const tableImg=mk(64,32,x=>{x.fillStyle='rgba(20,10,5,.4)';x.beginPath();x.ellipse(32,29,28,3,0,0,7);x.fill();x.fillStyle='#6a4a2a';x.fillRect(4,10,56,5);x.fillStyle='#4a3018';x.fillRect(8,15,4,14);x.fillRect(52,15,4,14)});
const shelfImg=mk(64,64,x=>{x.fillStyle='#4a3018';x.fillRect(4,4,56,58);x.fillStyle='#2a1a0c';for(let i=0;i<4;i++)x.fillRect(4,14+i*14,56,3);x.fillStyle='#8a6a3a';for(let i=0;i<4;i++)for(let j=0;j<3;j++)x.fillRect(8+j*17,6+i*14,12,8)});
function base(){map[N-2][N-1]=3;EX=N-.5;EY=N-1.5}
function reachFix(){for(let it=0;it<60;it++){const seen=new Set([10*N+10]),q=[[10,10]];while(q.length){const[x,y]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*N+nx;if(nx>0&&ny>0&&nx<N-1&&ny<N-1&&!seen.has(k)&&map[ny][nx]==0){seen.add(k);q.push([nx,ny])}}}let fixed=false;for(let y=1;y<N-1&&!fixed;y++)for(let x=1;x<N-1&&!fixed;x++){if(map[y][x]!=0||seen.has(y*N+x))continue;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(map[ny][nx]==7){map[ny][nx]=0;fixed=true;break}}}if(!fixed)break}}
function mansion2(){map=[...Array(N)].map(()=>Array(N).fill(1));for(let y=1;y<=19;y++)for(let x=9;x<=11;x++)map[y][x]=0;
const RS=[[1,4],[6,9],[11,14],[16,19]],NM=['bed','bath','kit','pan','liv','st1','st2','st3'];DOORS=[];RM=[];FUR=[];const fi=5+rnd(3);
for(let sd=0;sd<2;sd++)for(let r=0;r<4;r++){const[y0,y1]=RS[r],x0=sd?13:1,x1=sd?19:7,cx=sd?12:8,cy=y0+2,ox=sd?11:9;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=0;map[cy][cx]=0;const d={st:'open',knock:0,bang:0,cx,cy,ox,oy:cy,rx0:x0,ry0:y0,rx1:x1,ry1:y1};DOORS.push(d);RM.push({k:NM[sd*4+r],x0,y0,x1,y1})}
for(let sd=0;sd<2;sd++)for(let r=0;r<3;r++){const a=sd*4+r;if(a==fi||a+1==fi)continue;map[RS[r][1]+1][sd?16:4]=0}
RM.forEach((m,i)=>{const d=DOORS[i],k=m.k;if(i==fi){const sx=d.ox-d.cx;for(let q=2;q<=4;q++)map[d.cy-1][d.cx-sx*q]=7}if(i!=fi&&(k[0]=='s'||k=='pan')){for(let y=m.y0;y<=m.y1;y++)for(let x=m.x0;x<=m.x1;x++){if(Math.abs(x-d.cx)<=2||y==d.cy)continue;if(rnd(100)<(k=='pan'?18:34))map[y][x]=7}}
if(k=='bed'){FUR.push({x:2.1,y:m.y0+1,img:bedImg,sc:.3});HSP.push({x:1.3,y:m.y0+1,bed:1,sofa:1})}if(k=='bath')FUR.push({x:2.4,y:m.y0+1.1,img:tubImg,sc:.26});if(k=='kit'){FUR.push({x:2,y:m.y0+.9,img:stoveImg,sc:.34});FUR.push({x:4.6,y:m.y0+2.4,img:tableImg,sc:.24})}
if(k=='pan')for(let j=0;j<3;j++)FUR.push({x:1.7,y:m.y0+.9+j*1.2,img:shelfImg,sc:.5});if(k=='liv'){HSP.push({x:18.9,y:m.y0+1.2,sofa:1});FUR.push({x:18.2,y:m.y0+1.2,img:sofaImg,sc:.36});FUR.push({x:15.8,y:m.y0+2.3,img:tableImg,sc:.24})}
if(k=='st1'||k=='st2'||k=='st3'){FUR.push({x:14.2,y:m.y0+1.2,img:crateImg,sc:.26});FUR.push({x:17.8,y:m.y1-0.6,img:candelabraImg,sc:.4,em:1})}});
FUR.push({x:9.3,y:2.5,img:candelabraImg,sc:.42,em:1},{x:11.7,y:7.4,img:candelabraImg,sc:.42,em:1},{x:9.3,y:13.4,img:candelabraImg,sc:.42,em:1},{x:11.7,y:17.6,img:clockImg,sc:.56},{x:9.3,y:9.2,img:clockImg,sc:.56},{x:10.5,y:5.2,img:benchImg,sc:.22},{x:10.5,y:15.2,img:benchImg,sc:.22});
const d=DOORS[fi],dx=d.ox-d.cx;FRI={x:d.cx-dx*5.2,y:d.cy+.5,room:fi,fl:dx>0?0:1};for(const[wx,wy]of[[8,2],[12,7],[8,12],[12,17],[8,19],[12,2]]){map[wy][wx]=2;M2_LOCKERS.push({x:wx+.5,y:wy+.5});}reachFix();EX=-99;EY=-99;STR={x:9.8,y:10.5}}
function startMain(){stg='main';UPF=false;STF=0;gen();px=10.5;py=19.2;pa=-Math.PI/2;PIT=0;state='play';rmLast='';TN(200,.6,.3,'sawtooth',120);say('Первый этаж. Найди друга.',5)}
function startCS(){if(!FRI||state!='play')return;const d=DOORS[FRI.room],dx=d.ox-d.cx;if(d.st=='locked')applyDoor(d,'open');cs2={d,dx,F:{x:FRI.x,y:FRI.y},P0:{x:FRI.x+dx*1.4,y:FRI.y},f:{}};state='cs2';cs2T=0;pcOpen=false;phoneUI=false;hid=false;CY=0;PIT=0;mon.off=1;mon.vis=0;mon.siege=0;for(const k in kd)kd[k]=0;flash=true;document.exitPointerLock&&document.exitPointerLock()}
function csUpd(dt){cs2T+=dt;const t=cs2T,d=cs2.d,dx=cs2.dx,F=cs2.F,P0=cs2.P0,f=cs2.f,cy5=d.cy+.5,hallM=d.ox+dx*1.6,Xd=d.cx+.5,Pd=Xd-dx*1.0;
const cl=u=>Math.max(0,Math.min(1,u)),ez=u=>{u=cl(u);return u*u*(3-2*u)},Lr=(a,b,u)=>a+(b-a)*ez(u),angF=Math.atan2(0,-dx),angH=Math.atan2(0,dx);FL=1;BA=0;mon.st='hunt';mon.vis=t>3.0;
if(t<2.2){px=P0.x;py=P0.y;pa=angF;CY=0;PIT=0}else if(t<3.3){px=P0.x;py=P0.y;pa=angF+Math.PI*ez((t-2.2)/1.1)}else if(t<4.2){px=P0.x;py=P0.y;pa=angH}else if(t<5.1){const u=(t-4.2)/.9;px=Lr(P0.x,Pd,u);py=Lr(P0.y,cy5,u);pa=angH}
else if(t<7.2){px=Lr(Pd,Xd-dx*1.7,(t-5.2)/1);py=cy5;pa=angH}else if(t<8.6){CY=-24*cl((t-7.2)/.3);py=Lr(cy5,cy5-2,(t-7.3)/.5);px=Xd-dx*1.7;pa=angH+(angF-angH)*ez((t-7.2)/.4);PIT=-10}
else if(t<9.4){px=Lr(Xd-dx*1.7,Xd-dx*.6,(t-8.6)/.8);py=Lr(cy5-2,cy5,(t-8.6)/.8);pa=angF+(angH-angF)*ez((t-8.6)/.4)}else if(t<10){px=Lr(Xd-dx*.6,d.ox+.5,(t-9.4)/.6);py=cy5;pa=angH}
else if(t<10.7){const u=(t-10)/.7;px=d.ox+.5;py=cy5;pa=angH+Math.PI*ez(u);CY=-24*(1-ez(u));PIT=-10*(1-ez(u))}else{px=d.ox+.5;py=cy5;pa=angF;CY=0;PIT=0}
if(t<4.2){mon.x=hallM;mon.y=cy5}else if(t<5.1){mon.x=Lr(hallM,d.ox+.5,(t-4.2)/.9);mon.y=cy5}else if(t<7.2){mon.x=d.ox+.5;mon.y=cy5}else if(t<8.6){mon.x=Lr(d.ox+.5,F.x+dx*1.1,(t-7.2)/1.2);mon.y=cy5}else{mon.x=F.x+dx*1.1;mon.y=cy5}
if(t>2.2&&t<5.1&&Math.floor(t*2.2)!=f.fs){f.fs=Math.floor(t*2.2);NZ(.1,200,.4,0)}if(t>3&&!f.gr){f.gr=1;TN(70,1.2,.5,'sawtooth',45)}
if(t>=5.1&&!f.sl){f.sl=1;d.st='locked';map[d.cy][d.cx]=6;NZ(.3,500,1);TN(90,.3,.9,'square',40);shake=1}
for(let i=0;i<3;i++)if(t>=5.5+i*.6&&!f['b'+i]){f['b'+i]=1;NZ(.15,200,.95);TN(80,.15,.9,'square',40);shake=.8}
if(t>=7.2&&!f.br){f.br=1;d.st='broken';map[d.cy][d.cx]=0;NZ(.7,400,1);TN(70,.6,.9,'sawtooth',30);shake=1.2}
if(t>=8.6&&!f.at){f.at=1;NZ(.8,2000,.7);TN(900,.9,.3,'sawtooth',300);shake=1}
if(t>=10.7&&!f.s2){f.s2=1;d.st='locked';map[d.cy][d.cx]=6;NZ(.3,500,1);TN(90,.3,.9,'square',40);shake=1.2}
if(t>=11.3)endCS()}
function endCS(){const d=cs2.d,dx=cs2.dx;d.st='locked';map[d.cy][d.cx]=6;state='play';stg='surv';csDone=1;survT=300;survShow=0;mon.off=0;mon.vis=0;mon.rage=0;mon.st='hunt';mon.x=d.cx-dx*3.8;mon.y=d.cy+.5;mon.path=[];mon.tx=(d.rx0+d.rx1)>>1;mon.ty=d.cy;mon.siege=DOORS.indexOf(d)+1;mon.lost=0;px=d.ox+.5;py=d.cy+.5;pa=Math.atan2(0,-dx);CY=0;PIT=0;shake=.8;drSync();try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
function csHud(){g.fillStyle='#000';g.fillRect(0,0,W,20);g.fillRect(0,H-20,W,20);const t=cs2T,S=[[.3,'Дима?.. Это ты?..'],[1.3,'Дима: ...Беги... Она уже здесь...'],[3.2,'(позади раздаются шаги)'],[8.7,'(крик обрывается)']];let s='';for(const a of S)if(t>=a[0]&&t<a[0]+2.2)s=a[1];if(s){g.font='italic 11px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#ddd';g.fillText(s,W/2,H-34)}g.textAlign='left'}
function drawSurv(){if(!(ch==2&&stg=='surv'))return;g.textAlign='center';g.textBaseline='top';if(survShow<3.5){const a=Math.min(1,survShow*2)*(survShow>3?(3.5-survShow)*2:1);g.font='bold 26px Georgia';g.fillStyle='rgba(200,30,30,'+a+')';g.fillText('ВЫЖИТЬ',W/2,18)}else{g.font='bold 20px monospace';g.fillStyle=survT<60?'#f55':'#eee';g.fillText(p2(survT/60)+':'+p2(survT%60),W/2,8)}g.textAlign='left'}
var breakDoor = function(d){d.st='broken';d.knock=0;map[d.cy][d.cx]=0;const inn=mon.x>=d.rx0&&mon.x<=d.rx1+1&&mon.y>=d.ry0&&mon.y<=d.ry1+1;mon.siege=0;NZ(.6,400,1);TN(70,.5,.9,'sawtooth',30);shake=1;mon.st='hunt';mon.lost=0;mon.tx=inn?(px|0):((d.rx0+d.rx1)>>1);mon.ty=inn?(py|0):d.cy;if(ch==2&&stg=='surv')mon.rage=1;drSync();say('ДВЕРЬ ВЫБИТА!',2)}
var drawStones = function(sd,sw,zs,hor,kk,RW=W,fog=null,flShakeX=0){for(let x=0;x<W;x++){const d=sd[x];if(!d||d>=zs[x])continue;const u=sw[x],lh=H/d*VFK(),fy=hor+lh/2,c=x/W-.5-flShakeX,L=Math.min(1,(ch==3?.085:.04)+FL*Math.exp(-c*c*10)*2.4/(1+d*d*.1)+.06/(1+d*d)+(hid?.1/(1+d*.2):0));
if(ch==3){if(u<.15||u>.85)continue;const a=(u-.5)/.35,hgt=lh*(.36+.1*Math.sqrt(Math.max(0,1-a*a)));g.fillStyle='rgb('+(120*L|0)+','+(124*L|0)+','+(122*L|0)+')';g.fillRect(x,fy-hgt,1,hgt);if(Math.abs(u-.5)<.025){g.fillStyle='rgba(20,22,20,.7)';g.fillRect(x,fy-hgt*.85,1,hgt*.5)}if(Math.abs(u-.5)<.1){g.fillStyle='rgba(20,22,20,.6)';g.fillRect(x,fy-hgt*.62,1,Math.max(1,hgt*.04))}g.fillStyle='rgba(10,25,10,.4)';g.fillRect(x,fy-hgt*.12,1,hgt*.12)}
else{if(u<.05||u>.95)continue;const hgt=lh*.5;g.fillStyle='rgb('+(150*L|0)+','+(105*L|0)+','+(60*L|0)+')';g.fillRect(x,fy-hgt,1,hgt);g.fillStyle='rgba(0,0,0,.5)';if(u<.09||u>.91)g.fillRect(x,fy-hgt,1,hgt);g.fillRect(x,fy-hgt*.5,1,Math.max(1,hgt*.04));g.fillRect(x,fy-hgt,1,Math.max(1,hgt*.05))}}}
const monImg3=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';const hh=i=>{const v=Math.sin(i*53.3)*43758.5;return v-Math.floor(v)};
x.strokeStyle='#040101';for(let i=0;i<18;i++){x.lineWidth=1.2+hh(i)*1.7;x.beginPath();const x0=23+i*1.1;x.moveTo(x0,2);x.bezierCurveTo(x0-9+hh(i+2)*6,22,x0-6+hh(i+5)*10,50,x0-3+(hh(i+1)-.5)*14,68+hh(i+4)*24);x.stroke()}
for(const sd of[-1,1]){x.strokeStyle='#c2ab96';x.lineWidth=2.5;x.beginPath();x.moveTo(32+sd*7,30);x.quadraticCurveTo(32+sd*23,76,32+sd*21,122);x.stroke();x.strokeStyle='rgba(145,0,0,.95)';x.lineWidth=1.8;x.beginPath();x.moveTo(32+sd*7,32);x.quadraticCurveTo(32+sd*23,78,32+sd*21,120);x.stroke();x.strokeStyle='#7a0808';x.lineWidth=.85;for(let f=0;f<5;f++){x.beginPath();x.moveTo(32+sd*21,122);x.lineTo(32+sd*(21+(f-2)*2.6),128);x.stroke()}}
x.fillStyle='#120307';x.beginPath();x.moveTo(26,29);x.lineTo(38,29);x.lineTo(37,66);x.bezierCurveTo(46,88,54,110,56,127);for(let i=0;i<8;i++)x.lineTo(56-i*7,127-(i%2?0:4.5));x.bezierCurveTo(10,110,18,88,27,66);x.closePath();x.fill();
// Exposed torn sternum & wet gore across bodice
x.fillStyle='rgba(155,0,0,.9)';for(let i=0;i<16;i++){x.beginPath();x.ellipse(23+hh(i)*18,34+hh(i+6)*90,2+hh(i+3)*5,3+hh(i+9)*9,0,0,7);x.fill()}for(let i=0;i<8;i++)x.fillRect(21+i*3.4,58+hh(i)*10,1.4,30+hh(i+2)*36);
x.strokeStyle='#d6c9b2';x.lineWidth=.7;for(let i=0;i<4;i++){x.beginPath();x.moveTo(27,36+i*4.5);x.lineTo(37,37+i*4.5);x.stroke()}
x.fillStyle='#bfa896';x.fillRect(29.5,22,5,9);x.fillStyle='rgba(145,0,0,.85)';x.fillRect(30,24,2,8);
const gr=x.createRadialGradient(31,10,1,32,13,15);gr.addColorStop(0,'#e2d2be');gr.addColorStop(.68,'#a38b78');gr.addColorStop(1,'#362822');x.fillStyle=gr;x.beginPath();x.ellipse(32,13,10,13.5,0,0,7);x.fill();x.fillStyle='rgba(145,0,0,.62)';x.beginPath();x.ellipse(32,17,9,10,0,0,7);x.fill();
x.fillStyle='#000';for(const sd of[-1,1]){x.beginPath();x.ellipse(32+sd*4.6,9,4.7,5.4,0,0,7);x.fill()}
for(const sd of[-1,1]){const ex=32+sd*4.6,ey=10;x.fillStyle='#dfd2be';x.beginPath();x.arc(ex,ey,4.2,0,7);x.fill();x.strokeStyle='rgba(185,5,5,.95)';x.lineWidth=.4;for(let i=0;i<9;i++){const a=hh(i+sd*5)*6.28;x.beginPath();x.moveTo(ex+Math.cos(a)*4.2,ey+Math.sin(a)*4.2);x.lineTo(ex+Math.cos(a)*1.6,ey+Math.sin(a)*1.6);x.stroke()}x.fillStyle='#080000';x.beginPath();x.arc(ex+sd*.5,ey+.4,1.2,0,7);x.fill();x.fillStyle='#f88';x.fillRect(ex+sd*.5-.3,ey-.2,.7,.7);x.fillStyle='rgba(155,0,0,.95)';x.fillRect(ex-.6,ey+4,1.2,12+hh(sd+4)*7)}
// Torn-open jaw tendons & double row fangs
x.fillStyle='#040000';x.beginPath();x.ellipse(32,22.5,6.6,5.4,0,0,7);x.fill();x.strokeStyle='rgba(140,12,12,.9)';x.lineWidth=.9;for(const sd of[-1,1]){x.beginPath();x.moveTo(32+sd*6.5,19);x.lineTo(32+sd*7.5,25);x.stroke()}
x.fillStyle='#ece4ca';for(let i=-5;i<=5;i+=1.35){x.beginPath();x.moveTo(32+i-.6,18.2);x.lineTo(32+i,22.2+Math.abs(Math.sin(i*3))*1.8);x.lineTo(32+i+.6,18.2);x.fill();x.beginPath();x.moveTo(32+i-.6,27.0);x.lineTo(32+i,23.2-Math.abs(Math.sin(i*2))*1.8);x.lineTo(32+i+.6,27.0);x.fill()}
x.fillStyle='rgba(155,0,0,.98)';x.fillRect(29,26,1.6,22);x.fillRect(33,26,1.6,36);x.fillRect(31,26,1.3,16)});
const pickImg=mk(32,32,x=>{x.lineCap='round';x.lineJoin='round';x.strokeStyle='#d4a838';x.lineWidth=1.8;x.beginPath();x.arc(5,27,2.8,0,7);x.stroke();x.strokeStyle='#764a26';x.lineWidth=4;x.beginPath();x.moveTo(6.5,25.5);x.lineTo(13.5,18.5);x.stroke();x.strokeStyle='#e0b23e';x.lineWidth=3.2;x.beginPath();x.moveTo(13.2,18.8);x.lineTo(14.8,17.2);x.stroke();x.fillStyle='#f0c850';x.fillRect(8.5,22.5,1.5,1.5);x.fillRect(11,20,1.5,1.5);x.strokeStyle='#e4ecf5';x.lineWidth=2;x.beginPath();x.moveTo(15,17);x.lineTo(25,7);x.lineTo(27.5,4.5);x.lineTo(24.5,4);x.stroke();x.strokeStyle='#b8c6d8';x.lineWidth=2;x.beginPath();x.moveTo(7,15);x.lineTo(22,24);x.lineTo(26,20);x.stroke()});
var placeLockers = function(){let n=0;for(let i=0;i<300&&n<6;i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(map[y][x]==1&&(!map[y][x-1]||!map[y][x+1]||!map[y-1][x]||!map[y+1][x])&&!inFP(x,y)){map[y][x]=2;lockers.push({x:x+.5,y:y+.5});n++}}}
var endSurv = function(){stg='post';mon.rage=0;mon.tired=0;mon.hr=0;placeLockers();map[0][10]=3;EX=10.5;EY=.5;say('Время вышло. Главная дверь открылась!',6);TN(440,.5,.3,'triangle',880)}
let STR=null,HSP=[],PAP=[],PCT=null,VF={},nearSt=false,nearPap=null;
const stairsImg=mk(64,64,x=>{x.fillStyle='rgba(20,10,5,.4)';x.beginPath();x.ellipse(32,60,30,3,0,0,7);x.fill();for(let i=0;i<6;i++){x.fillStyle='rgb('+(90+i*12)+','+(60+i*8)+','+(36+i*5)+')';x.fillRect(6+i*3,54-i*8,52-i*6,8)}x.fillStyle='#3a2414';x.fillRect(4,8,4,52);x.fillRect(56,8,4,52)});
function vidDraw(T){const X=20,Y=22,Wv=360,Hv=172;g.save();g.beginPath();g.rect(X,Y,Wv,Hv);g.clip();
if(T>12.2){g.fillStyle='#000';g.fillRect(X,Y,Wv,Hv);for(let i=0;i<700;i++){g.fillStyle='rgba(255,255,255,'+Math.random()*.5+')';g.fillRect(X+rnd(Wv),Y+rnd(Hv),1+rnd(3),1)}g.fillStyle='#e44';g.font='bold 14px monospace';g.textAlign='center';g.fillText('ЗАПИСЬ ПРЕРВАНА',X+Wv/2,Y+Hv/2-6);if(!VF.e){VF.e=1;NZ(1.2,5000,.4,0,'highpass')}g.restore();return}
g.fillStyle='#0a1812';g.fillRect(X,Y,Wv,Hv);g.fillStyle='#16301f';g.fillRect(X,Y,Wv,96);g.fillStyle='#0b1a12';g.fillRect(X,Y+96,Wv,76);
let sh=0;if(T>6.5&&T<9.2)sh=(Math.random()-.5)*3;
for(let i=0;i<5;i++){const dx0=X+14+i*70,brk=i==2&&T>=9.2;g.fillStyle=brk?'#030705':'#243f30';g.fillRect(dx0+(i==2?sh:0),Y+26,46,70);g.strokeStyle='#4a6';g.strokeRect(dx0+.5+(i==2?sh:0),Y+26.5,45,69);g.fillStyle='#8fb';g.font='8px monospace';g.textAlign='center';g.fillText(String(153+i),dx0+23,Y+12)}
const sx=X+24+Math.min(T,9.1)*28,fy=Y+136,hit=T>=9.9;
if(T>=9.2){const u=Math.min(1,(T-9.2)/.7),d0=X+14+2*70+23,mx=d0+(sx+14-d0)*u;g.drawImage(monImg,mx-34,fy-128,68,136)}
g.save();g.translate(sx,fy);if(hit){const k=Math.min(1,(T-9.9)/.5);g.rotate(k*1.4);g.translate(0,k*10)}
g.fillStyle='#e8e8e0';g.fillRect(-7,-36,14,26);g.fillStyle='#2a2a2a';const w=Math.sin(T*10)*(T<9?4:0);g.fillRect(-5,-10,4,12+w);g.fillRect(1,-10,4,12-w);g.fillStyle='#e8c9a8';g.beginPath();g.arc(0,-42,6,0,7);g.fill();g.fillStyle='#222';g.fillRect(-4,-43,8,2);g.restore();
if(hit){g.fillStyle='rgba(150,0,0,.85)';for(let i=0;i<20;i++)g.fillRect(sx-20+rnd(40),fy-30+rnd(30)+(T-9.9)*10,2+rnd(4),2+rnd(6));if(T<10.3){g.fillStyle='rgba(255,30,30,.35)';g.fillRect(X,Y,Wv,Hv)}}
g.font='10px monospace';g.textAlign='center';g.fillStyle='#ddd';if(T>2&&T<6.3)g.fillText('Хорошо, что всё прошло удачно.',X+Wv/2,Y+Hv-10);else if(T>6.5&&T<9.2)g.fillText('(глухой стук)',X+Wv/2,Y+Hv-10);else if(T>9.8&&T<12)g.fillText('Нет!.. Не-е-ет!..',X+Wv/2,Y+Hv-10);
g.fillStyle='rgba(0,0,0,.18)';for(let y=Y;y<Y+Hv;y+=3)g.fillRect(X,y,Wv,1);g.fillStyle='#8fb';g.font='8px monospace';g.textAlign='left';g.fillText('КАМ 04 · КОРИДОР ПАЛАТ',X+6,Y+Hv-22);g.fillStyle='#f55';if(Math.floor(T*2)%2)g.fillText('● REC',X+Wv-40,Y+8);
if(T>11&&T<12.2&&Math.random()<.6){g.fillStyle='rgba(255,255,255,.3)';g.fillRect(X,Y+rnd(Hv),Wv,3+rnd(6))}
if(T>=6.5&&T<9.2&&Math.floor(T*3)!=VF.kk){VF.kk=Math.floor(T*3);NZ(.1,200,.5);TN(80,.1,.5,'square',45)}if(T>=9.2&&!VF.c){VF.c=1;NZ(.5,400,.8);TN(70,.4,.8,'sawtooth',30)}if(T>=9.9&&!VF.s){VF.s=1;TN(1100,.8,.25,'sawtooth',400);NZ(.5,3000,.5)}
g.restore()}
function docDraw(){const L=['МИНИСТЕРСТВО ОБОРОНЫ США · ЛАБОРАТОРИЯ №7','СОВЕРШЕННО СЕКРЕТНО','','Отчёт по проекту «ГЕНЕЗИС»:','Эксперимент прошёл удачно.','Пациент-155 и пациентка-647 полностью','преобразованы в этих существ.','Агрессивны, быстры, не чувствуют боли','и не подаются контролю.','Содержание — изолированные палаты 2-го этажа.','','Спасибо за помощь.','Деер Майер, 1995'];g.fillStyle='#e8e4d0';g.fillRect(30,22,340,168);g.fillStyle='#222';g.textAlign='left';g.font='bold 9px monospace';g.fillText(L[0],38,28);g.fillStyle='#a00';g.fillText(L[1],38,40);g.fillStyle='#222';g.font='9px monospace';for(let i=3;i<L.length;i++)g.fillText(L[i],38,56+(i-3)*11)}
function upfloor(){map=[...Array(N)].map(()=>Array(N).fill(1));for(let y=9;y<=11;y++)for(let x=1;x<=19;x++)map[y][x]=0;DOORS=[];RM=[];FUR=[];HSP=[];PAP=[];PCS=[];
const cols=[[1,6],[8,12],[14,19]],nm=['w1','w2','w3','pr','ar','lab'];
for(let s=0;s<2;s++)for(let c=0;c<3;c++){const[x0,x1]=cols[c],y0=s?13:1,y1=s?19:7,cx=(x0+x1)>>1,cy=s?12:8,oy=s?11:9;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=0;map[cy][cx]=0;const d={st:s?'open':'broken',knock:0,bang:0,cx,cy,ox:cx,oy,rx0:x0,ry0:y0,rx1:x1,ry1:y1};DOORS.push(d);RM.push({k:nm[s*3+c],x0,y0,x1,y1})}
for(let c=0;c<3;c++){const x0=cols[c][0];for(const by of[2.2,5.2]){FUR.push({x:x0+1.4,y:by,img:bedImg,sc:.3});HSP.push({x:x0+.6,y:by,bed:1,sofa:1})}}
const lab=DOORS[5];lab.pw=1;lab.st='locked';map[lab.cy][lab.cx]=6;
FUR.push({x:3.5,y:16.5,img:tableImg,sc:.24});for(let j=0;j<3;j++)FUR.push({x:8.9,y:14.2+j*1.5,img:shelfImg,sc:.5});FUR.push({x:15.5,y:17.5,img:tableImg,sc:.24});FUR.push({x:18,y:17.5,img:tableImg,sc:.24});
FUR.push({x:4.5,y:9.3,img:candelabraImg,sc:.42,em:1},{x:10.5,y:9.3,img:clockImg,sc:.55},{x:15.5,y:11.7,img:candelabraImg,sc:.42,em:1},{x:13.8,y:9.4,img:crateImg,sc:.26},{x:6.4,y:11.6,img:crateImg,sc:.26},{x:18.2,y:14.4,img:candelabraImg,sc:.42,em:1});
MANSION_PHOTO_SPOTS=[{x:14.7,y:15.2,idx:0},{x:16.8,y:18.6,idx:1},{x:18.4,y:15.4,idx:2}];
MANSION_PHOTO_SPOTS.forEach(p=>FUR.push({x:p.x,y:p.y,img:mansionPhotoImgs[p.idx],sc:.36}));
PCS.push({x:17,y:13.5,k:2,st:'off'});USB={x:15.7,y:13.7,on:!PF.usb};
PAP.push({x:5.2,y:14.2,t:'Журнал: «Инцидент в палате 155:|02.11.1998. Записи — в лаборатории.»'});
PAP.push({x:11.2,y:18.4,t:'Записка: «Пароль от компьютера —|название любимого романа Майера.»'});
PAP.push({x:15.2,y:18.6,t:'На бумаге: «Проект ГЕНЕЗИС начался в 1995 году.|Не открывать без нужды.»'});
STR={x:1.9,y:10.5};EX=-99;EY=-99}
var placeLockers = function(){let n=0;for(let i=0;i<300&&n<8;i++){const x=1+rnd(N-2),y=1+rnd(N-2);if(map[y][x]==1&&(!map[y][x-1]||!map[y][x+1]||!map[y-1][x]||!map[y+1][x])&&!inFP(x,y)){map[y][x]=2;lockers.push({x:x+.5,y:y+.5});n++}}}
function postHide(){for(const h of HSP)lockers.push(h);placeLockers()}
var endSurv = function(){stg='post';mon.rage=0;mon.tired=0;mon.hr=0;postHide();map[0][10]=3;EX=10.5;EY=.5;say('Время вышло! Главная дверь открыта.|Теперь можно прятаться.',7);TN(440,.5,.3,'triangle',880)}
function goUp(){stg='up';gen();postHide();px=3;py=10.5;pa=0;PIT=0;mon.off=0;mon.rage=0;mon.st='patrol';say('Второй этаж',3)}
function goDown(){stg='post';gen();postHide();map[0][10]=3;EX=10.5;EY=.5;px=10.6;py=10.5;pa=Math.PI;PIT=0;mon.off=0;mon.rage=0;mon.st='patrol'}
var useStairs = function(){TN(200,.3,.2,'sawtooth',120);if(stg=='post')goUp();else goDown()}
var toggleDoor = function(d){if(!d||d.st=='broken')return;if(d.pw){openPC({k:3,door:d});return}if(d.st=='locked'){applyDoor(d,'open');say('Дверь отперта.',2)}else{if(Math.hypot(px-d.cx-.5,py-d.cy-.5)<.85||Math.hypot(mon.x-d.cx-.5,mon.y-d.cy-.5)<1){say('Что-то мешает закрыть дверь.',2);return}applyDoor(d,'locked');say('Дверь заперта.',2);if(mon.st=='hunt'&&px>=d.rx0&&px<=d.rx1+1&&py>=d.ry0&&py<=d.ry1+1)mon.siege=DOORS.indexOf(d)+1}drSync()}
var openPC = function(pc){PCUR=pc;pcOpen=true;PW='';PWERR=0;pcT=0;PCT=null;const mb=document.getElementById('mob_pc_close');if(mb&&isTouchDevice())mb.style.display='block';
if(pc.k==3){pcSt='login';PCT={tgt:'02.11.1998',title:'ЗАМОК · КОД ДВЕРИ',ok:()=>{pc.door.pw=0;pc.door.st='open';map[pc.door.cy][pc.door.cx]=0;TN(880,.2,.15);say('Замок открыт.',2);closePC()}}}
else{pcSt=pc.st||'off';if(pc.k==1)PCT={tgt:'3.10.2026',title:'ДОСТУП ЗАПРЕЩЁН',ok:()=>{pcSt='term'}};else if(pc.k==2)PCT={tgt:'1984',title:'ВХОД В СИСТЕМУ',ok:()=>{pcSt='desk2'}}}
document.exitPointerLock&&document.exitPointerLock();for(const k in kd)kd[k]=0}
var pcKey = function(c){if(c=='KeyE'&&pcSt!='login'){closePC();return}
if(c=='Escape'){if(pcSt=='login'&&PCT&&PCT.back){pcSt=PCT.back;PCT=PCT.prevT}else if(['cams','notes','files','vid','doc','photos'].includes(pcSt))pcSt=PCUR&&PCUR.k==2?'desk2':'desk';else closePC();return}
if(pcSt=='login'){if(/^(Digit|Numpad)\d$/.test(c)){if(PW.length<12)PW+=c.slice(-1);PWERR=0;TN(600,.04,.08)}else if(c=='Period'||c=='NumpadDecimal'){if(PW.length<12)PW+='.';PWERR=0;TN(600,.04,.08)}else if(c=='Backspace')PW=PW.slice(0,-1);else if(c=='Enter'||c=='NumpadEnter'){if(PCT&&PW===PCT.tgt){PW='';PCT.ok()}else{PWERR=1;PW='';TN(150,.2,.2,'square')}}return}
if(c=='Enter'&&pcSt=='off'){pcSt='boot';pcT=0;TN(440,.15,.15);return}
if(pcSt=='desk'){if(c=='Digit1'||c=='Numpad1'){pcSt='cams';camVis();visT=.25}else if(c=='Digit2'||c=='Numpad2')pcSt='notes';else if(c=='Digit3'||c=='Numpad3'){pcSt='off';TN(220,.2,.15)}}
else if(pcSt=='desk2'){if(c=='Digit1'||c=='Numpad1')pcSt='files';else if(c=='Digit2'||c=='Numpad2'){pcSt='vid';pcT=0;VF={}}else if(c=='Digit3'||c=='Numpad3'){const pt=PCT;PCT={tgt:'1995',title:'НЕ ОТКРЫВАТЬ',back:'desk2',prevT:pt,ok:()=>{pcSt='doc';PCT=pt}};pcSt='login';PW='';PWERR=0}else if(c=='Digit4'||c=='Numpad4'){pcSt='photos';photoSel=0;TN(660,.06,.1)}}
else if(pcSt=='photos'){if(c=='ArrowLeft'){photoSel=(photoSel+MANSION_PHOTOS.length-1)%MANSION_PHOTOS.length;TN(520,.04,.08)}else if(c=='ArrowRight'){photoSel=(photoSel+1)%MANSION_PHOTOS.length;TN(520,.04,.08)}else if(c=='Digit1'||c=='Numpad1'){photoSel=0;openMansionPhotoModal(0)}else if(c=='Digit2'||c=='Numpad2'){photoSel=1;openMansionPhotoModal(1)}else if(c=='Digit3'||c=='Numpad3'){photoSel=2;openMansionPhotoModal(2)}else if(c=='Enter'||c=='NumpadEnter'){openMansionPhotoModal(photoSel)}}}
var pcClick = function(e){const r=cv.getBoundingClientRect(),s=Math.min(r.width/W,r.height/H),x=(e.clientX-r.left-(r.width-W*s)/2)/s,y=(e.clientY-r.top-(r.height-H*s)/2)/s;
if(pcSt=='off'){pcKey('Enter');return}
if(pcSt=='desk'&&y>=60&&y<=130){const i=Math.floor((x-40)/110);if(i>=0&&i<3&&x-40-i*110<=90)pcKey('Digit'+(i+1));return}
if(pcSt=='desk2'){for(let i=0;i<4;i++){const col=i%2,row=Math.floor(i/2),bx=44+col*162,by=34+row*74;if(x>=bx&&x<=bx+150&&y>=by&&y<=by+62){pcKey('Digit'+(i+1));return}}}
if(pcSt=='photos'){for(let i=0;i<MANSION_PHOTOS.length;i++){const bx=16+i*126,by=26,bw=116,bh=138;if(x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh){if(photoSel===i)openMansionPhotoModal(i);else{photoSel=i;TN(520,.04,.08)}return}}}
if(pcSt=='login'){for(let i=0;i<12;i++){const bx=250+(i%3)*42,by=34+Math.floor(i/3)*30;if(x>=bx&&x<=bx+38&&y>=by&&y<=by+26){pcKey(i==9?'Period':i==11?'Backspace':'Digit'+(i==10?0:i+1));return}}if(x>=250&&x<=372&&y>=156&&y<=180){pcKey('Enter');return}}
if(y>H-22)pcKey('Escape')}
let UPF=false,JY=0,jv=0,STF=0,LT=[1,1,1],CAMV=false,camI=0,USB=null,nearUsb=false,instT0=0;
SKINS.forEach((s,i)=>{s.l=[[1,1,1],[1,.55,.5],[.55,.75,1],[.65,1,.6],[1,.88,.5],[.75,.6,1]][i]||[1,1,1]});
function floorCol(){const b=ch==2?[160,105,65]:ch==3?[205,165,100]:ch==4?[92,98,108]:[140,130,110];return b.map((v,i)=>v*LT[i]|0).join(',')}
const usbImg=mk(32,24,x=>{x.fillStyle='#2a3a4a';x.fillRect(4,8,18,10);x.fillStyle='#c8ccd0';x.fillRect(22,10,8,6);x.fillStyle='#4af';x.fillRect(8,11,3,3)});
function jump(){if(JY==0&&jv==0&&!hid&&state=='play'&&!pcOpen){jv=170;TN(300,.08,.1);emitSuddenNoise(px,py,0.78,'прыжок')}}
function takeUsb(){if(!USB||!USB.on)return;USB.on=false;PF.usb=1;pWrite();TN(900,.2,.2,'triangle',1300);try{unlockAchievement('secret_finder',{PF,pWrite,ac,TN})}catch(e){}say('Ты взял флешку.|Открой телефон — он её подключит.',6)}
var mkCams = function(){CAMS=[];for(let i=0;i<80&&CAMS.length<7;i++){const f=floors[rnd(floors.length)];if(!f)break;const x=f[0]+.5,y=f[1]+.5;if(x<5&&y<5)continue;if(x>=15&&x<=18&&y>=15&&y<=18)continue;if(CAMS.every(c=>Math.hypot(c.x-x,c.y-y)>=5)){let ba=0,bd=-1;for(let k=0;k<8;k++){const a=k*Math.PI/4;let d=0;while(d<12&&map[(y+Math.sin(a)*d)|0][(x+Math.cos(a)*d)|0]==0)d+=.25;if(d>bd){bd=d;ba=a}}CAMS.push({x,y,a:ba})}}}
function renderCam(i,t){const c=CAMS[i];if(!c)return;const sv=[px,py,pa,PIT,CY,BA,FL,hid,JY];px=c.x;py=c.y;pa=c.a+Math.sin(t*.5+i)*.7;PIT=0;CY=0;BA=0;FL=1;hid=false;JY=0;CAMV=true;try{render()}finally{CAMV=false;[px,py,pa,PIT,CY,BA,FL,hid,JY]=sv}}
function camScreen(){const t=pcT;renderCam(camI,t);g.globalAlpha=1;g.globalCompositeOperation='multiply';g.fillStyle='rgb(150,255,170)';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
g.fillStyle='rgba(0,0,0,.2)';for(let y=0;y<H;y+=2)g.fillRect(0,y,W,1);for(let i=0;i<50;i++){g.fillStyle='rgba(200,255,220,'+Math.random()*.2+')';g.fillRect(rnd(W),rnd(H),1+rnd(2),1)}
const c=CAMS[camI],dx=mon.x-c.x,dy=mon.y-c.y,d=Math.hypot(dx,dy),aa=c.a+Math.sin(t*.5+camI)*.7;let da=Math.atan2(dy,dx)-aa;da=Math.atan2(Math.sin(da),Math.cos(da));const seen=!mon.off&&d<14&&Math.abs(da)<.62&&los(c.x,c.y,mon.x,mon.y);
g.font='10px monospace';g.textBaseline='top';g.textAlign='left';g.fillStyle='#000';g.fillRect(0,0,W,16);g.fillStyle='#8fb';g.fillText('КАМЕРА '+(camI+1)+'/'+CAMS.length,8,3);g.textAlign='right';g.fillText(new Date().toLocaleTimeString(LOCALE()),W-8,3);
if(seen&&Math.floor(t*4)%2){g.fillStyle='#f44';g.textAlign='center';g.font='bold 12px monospace';g.fillText('МОНСТР В КАДРЕ',W/2,22)}
g.fillStyle='#000';g.fillRect(0,H-16,W,16);g.fillStyle='#6a8';g.font='9px monospace';g.textAlign='center';g.fillText('[←] [→] — сменить камеру   [Esc] назад   [E] выйти',W/2,H-12);g.textAlign='left'}
const pcKey0=pcKey;pcKey=function(c){if(pcSt=='desk'&&(c=='Digit1'||c=='Numpad1'))camI=0;if(pcSt=='cams'){if(c=='ArrowLeft'){camI=(camI+CAMS.length-1)%CAMS.length;return}if(c=='ArrowRight'){camI=(camI+1)%CAMS.length;return}const m=/^Digit(\d)$/.exec(c);if(m&&+m[1]>=1&&+m[1]<=CAMS.length){camI=+m[1]-1;return}}pcKey0(c)};
const pcClick0=pcClick;pcClick=function(e){if(pcSt=='cams'){const r=cv.getBoundingClientRect();if(e.clientY<r.top+r.height*.9){pcKey((e.clientX-r.left)/r.width<.5?'ArrowLeft':'ArrowRight');return}}pcClick0(e)};
var togglePhone = function(){phoneUI=!phoneUI;phApp='home';instT0=performance.now();TN(660,.08,.1)}
var phoneKey = function(c){if(c=='Escape'||c=='Backspace'){if(phApp!='home')phApp='home';else if(c=='Escape')phoneUI=false;return true}
if(phApp=='home'){if(c=='Digit1'){if(bat>0)flash=!flash;NZ(.04,3000,.2,0,'highpass');return true}if(c=='Digit2'){showPhoneCustomizerModal({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}))}});return true}if(c=='Digit3'){phoneUI=false;return true}if(c=='Digit4'&&PF.radar){phApp='radar';return true}}
return false}
var drawPhone = function(){const x=W-122,y=H-206,w=112,h=196;const curCase=getPhoneCase(PF.phoneCase||0);const curWp=getPhoneWallpaper(PF.phoneWallpaper||0);const curCharm=getPhoneCharm(PF.phoneCharm||0);const curSticker=getPhoneSticker(PF.phoneSticker||0);g.globalAlpha=1;g.fillStyle=curCase.color;g.fillRect(x-3,y-3,w+6,h+6);g.strokeStyle=curCase.glow;g.lineWidth=1;g.strokeRect(x-3,y-3,w+6,h+6);g.fillStyle='#050505';g.fillRect(x,y,w,h);
const sx=x+9,sy=y+26,sw=w-18,sh=h-72;g.fillStyle=curWp.bg;g.fillRect(sx,sy,sw,sh);g.fillStyle='rgba(255,255,255,0.03)';for(let ly=sy+12;ly<sy+sh;ly+=10)g.fillRect(sx,ly,sw,1);g.fillStyle='#202428';g.beginPath();g.arc(x+w/2,y+h-20,9,0,7);g.fill();g.strokeStyle=curCase.glow;g.stroke();g.fillStyle='#222';g.fillRect(x+w/2-12,y+10,24,3);
g.font='7px monospace';g.textBaseline='top';g.textAlign='left';g.fillStyle='#cde';g.fillText(new Date().toLocaleTimeString(LOCALE()).slice(0,5),sx+3,sy+2);g.textAlign='right';g.fillText(Math.round(bat)+'%',sx+sw-3,sy+2);g.textAlign='center';
if(PF.usb&&!PF.radar){const t=(performance.now()-instT0)/1000;g.fillStyle='#fff';g.font='7px monospace';g.fillText('Подключена USB-флешка',sx+sw/2,sy+34);g.fillText('Установка: Радар',sx+sw/2,sy+46);g.fillStyle='#234';g.fillRect(sx+8,sy+62,sw-16,6);g.fillStyle='#4f8';g.fillRect(sx+8,sy+62,(sw-16)*Math.min(1,t/2.5),6);if(t>=2.5){PF.radar=1;pWrite();say('Установлено приложение «Радар»',4);phApp='home'}}
 else if(phApp=='home'){const A=[['Фонарик',flash?'#ffd54a':'#555'],['Стиль','#8b1e25'],['Закрыть','#c44']];if(PF.radar)A.push(['Радар','#2a9a55']);A.forEach((a,i)=>{const bx=sx+8+(i%2)*46,by=sy+18+Math.floor(i/2)*44;g.fillStyle=a[1];g.fillRect(bx,by,34,30);g.fillStyle='#fff';g.font='9px monospace';g.fillText(String(i+1),bx+17,by+8);g.font='6px monospace';g.fillText(a[0],bx+17,by+22)})}
 else if(phApp=='radar'){const cx=sx+sw/2,cy=sy+66,R=38,dm=mon.off?999:Math.hypot(mon.x-px,mon.y-py),col=dm<7?'255,60,50':dm<14?'255,210,60':'70,230,110',lvl=dm<7?'ОПАСНО':dm<14?'РЯДОМ':'ДАЛЕКО';
g.fillStyle='#001a0c';g.fillRect(sx,sy+12,sw,sh-12);if(dm<30){const gl=g.createRadialGradient(cx,cy,5,cx,cy,R+8);gl.addColorStop(0,'rgba('+col+','+(.3+.15*Math.sin(performance.now()/180))+')');gl.addColorStop(1,'rgba('+col+',0)');g.fillStyle=gl;g.fillRect(sx,sy+12,sw,sh-12)}
g.strokeStyle='rgba(120,255,160,.5)';g.lineWidth=1;for(let i=1;i<=3;i++){g.beginPath();g.arc(cx,cy,R*i/3,0,7);g.stroke()}g.beginPath();g.moveTo(cx-R,cy);g.lineTo(cx+R,cy);g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
const sa=performance.now()/600;g.strokeStyle='rgba(120,255,160,.8)';g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(sa)*R,cy+Math.sin(sa)*R);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(cx,cy,2,0,7);g.fill();g.fillStyle='#8fb';g.font='7px monospace';g.fillText('Радар',cx,sy+14);
if(dm<30){const rel=Math.atan2(mon.y-py,mon.x-px)-pa,rr=Math.min(1,dm/26)*R,bx=cx+Math.sin(rel)*rr,by=cy-Math.cos(rel)*rr;g.fillStyle='rgba('+col+',.35)';g.beginPath();g.arc(bx,by,8,0,7);g.fill();g.fillStyle='rgb('+col+')';g.beginPath();g.arc(bx,by,3.5,0,7);g.fill();g.font='7px monospace';g.fillText(lvl,cx,sy+sh-12)}else{g.fillStyle='#7a9';g.font='7px monospace';g.fillText('Сигнала нет',cx,sy+sh-12)}}
if(curSticker&&curSticker.emoji){g.font='14px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(curSticker.emoji,x+14,y+12)}
if(curCharm&&curCharm.emoji){g.font='15px sans-serif';g.textAlign='center';g.textBaseline='middle';g.save();g.translate(x+w-4,y+h-6);g.rotate(0.2+Math.sin(tm*3)*0.12);g.fillText(curCharm.emoji,0,0);g.restore()}
g.textAlign='left'}
var useStairs = function(){TN(200,.3,.2,'sawtooth',120);const sv={rage:mon.rage},follow=stg=='surv'||mon.st=='hunt';UPF=!UPF;gen();if(stg=='post'){postHide();if(!UPF){map[0][10]=3;EX=10.5;EY=.5}}
if(UPF){px=4.6;py=10.5;pa=Math.PI}else{px=11.4;py=10.5;pa=Math.PI}PIT=0;JY=0;jv=0;mon.rage=sv.rage;mon.tired=0;mon.hr=0;if(follow){mon.off=1;STF=3}else{mon.off=0;mon.st='patrol'}say(UPF?'Второй этаж':'Первый этаж',3)}
let selCh=0,DIFF='easy',errSeen=false,tpk=0;const DIFFS={easy:{sp:.85,hear:.75,sight:.85},hard:{sp:1.15,hear:1.3,sight:1.15},extreme:{sp:1.4,hear:1.7,sight:1.35},secret:{sp:1.3,hear:1.5,sight:1.5}};let DFM=DIFFS.easy;
const benchImg=mk(64,32,x=>{x.fillStyle='rgba(10,10,5,.4)';x.beginPath();x.ellipse(32,29,28,3,0,0,7);x.fill();x.fillStyle='#4a3a28';x.fillRect(4,10,56,4);x.fillRect(4,16,56,4);x.fillStyle='#2a2018';x.fillRect(8,20,4,9);x.fillRect(52,20,4,9);x.fillRect(4,4,56,3)});
const lampImg=mk(24,64,x=>{x.fillStyle='#1a1a1a';x.fillRect(11,12,3,50);x.fillRect(7,58,11,4);x.fillStyle='#e8f0b0';x.beginPath();x.arc(12,8,6,0,7);x.fill();x.fillStyle='rgba(230,240,160,.35)';x.beginPath();x.arc(12,8,11,0,7);x.fill()});
const monImg4=mk(128,256,x=>{x.scale(2,2);x.lineCap='round';x.lineJoin='round';const hh=i=>{const v=Math.sin(i*77.7)*43758.5;return v-Math.floor(v)};
// Jagged blood-soaked graveyard spade
x.strokeStyle='#443222';x.lineWidth=2.6;x.beginPath();x.moveTo(56,16);x.lineTo(56,118);x.stroke();x.fillStyle='#575e5c';x.beginPath();x.moveTo(49,118);x.lineTo(63,118);x.lineTo(59,128);x.lineTo(53,128);x.closePath();x.fill();x.fillStyle='rgba(155,0,0,.92)';x.fillRect(50,118,10,5);
// Tattered burial cloak + tendrils
x.fillStyle='#040504';x.beginPath();x.moveTo(32,2);x.bezierCurveTo(14,6,11,30,9,60);x.bezierCurveTo(7,90,3,112,1,127);for(let i=0;i<9;i++)x.lineTo(1+i*7.5,127-(i%2?0:6.5));x.bezierCurveTo(61,112,57,90,55,60);x.bezierCurveTo(53,30,50,6,32,2);x.closePath();x.fill();
x.strokeStyle='#152414';x.lineWidth=1;for(let i=0;i<14;i++){const a=8+hh(i)*48,b=30+hh(i+3)*80;x.beginPath();x.moveTo(a,b);x.lineTo(a+(hh(i+6)-.5)*7,b+11);x.stroke()}
// Exposed bloodstained ribcage & spine
x.fillStyle='#080303';x.fillRect(23,33,18,30);x.fillStyle='rgba(120,0,0,.65)';x.fillRect(25,35,14,26);x.strokeStyle='#cfc9b0';x.lineWidth=.95;for(let i=0;i<6;i++){x.beginPath();x.moveTo(25,35+i*4.6);x.quadraticCurveTo(32,39+i*4.6,39,35+i*4.6);x.stroke()}x.beginPath();x.moveTo(32,33);x.lineTo(32,63);x.stroke();
for(const sd of[-1,1]){x.strokeStyle='#8e8b78';x.lineWidth=2.2;x.beginPath();x.moveTo(32+sd*14,34);x.quadraticCurveTo(32+sd*26,76,32+sd*23,118);x.stroke();x.strokeStyle='#cfc9b0';x.lineWidth=.8;for(let f=0;f<5;f++){x.beginPath();x.moveTo(32+sd*23,118);x.lineTo(32+sd*(23+(f-2)*2.4),127);x.stroke()}}
// Cracked skull & burning necrotic eye hollows + crimson maw
const gr=x.createRadialGradient(31,10,1,32,12,16);gr.addColorStop(0,'#dad6be');gr.addColorStop(.68,'#8c8870');gr.addColorStop(1,'#1e1e16');x.fillStyle=gr;x.beginPath();x.ellipse(32,13,10.2,13.4,0,0,7);x.fill();x.fillStyle='rgba(0,0,0,.65)';x.beginPath();x.ellipse(32,6,12,7,0,0,7);x.fill();
x.strokeStyle='#15120d';x.lineWidth=.8;x.beginPath();x.moveTo(26,4);x.lineTo(29,9);x.lineTo(27,14);x.moveTo(37,5);x.lineTo(34,11);x.stroke();
for(const sd of[-1,1]){x.fillStyle='#000';x.beginPath();x.ellipse(32+sd*4.4,10,3.8,5,0,0,7);x.fill();const fg=x.createRadialGradient(32+sd*4.4,10,0,32+sd*4.4,10,6.8);fg.addColorStop(0,'rgba(220,255,190,1)');fg.addColorStop(.45,'rgba(70,245,85,.78)');fg.addColorStop(1,'rgba(0,140,0,0)');x.fillStyle=fg;x.beginPath();x.arc(32+sd*4.4,10,6.8,0,7);x.fill()}
x.fillStyle='#000';x.beginPath();x.ellipse(32,16,1.3,2.2,0,0,7);x.fill();x.fillStyle='#050000';x.beginPath();x.ellipse(32,24,5.4,8.6,0,0,7);x.fill();x.fillStyle='#e2dcc0';for(let i=-4;i<=4;i+=1.25){x.beginPath();x.moveTo(32+i-.5,18.5);x.lineTo(32+i,22.8);x.lineTo(32+i+.5,18.5);x.fill();x.beginPath();x.moveTo(32+i-.5,30.5);x.lineTo(32+i,26.2);x.lineTo(32+i+.5,30.5);x.fill()}x.fillStyle='rgba(145,0,0,.94)';x.fillRect(29.5,29,1.5,21);x.fillRect(33.5,29,1.3,29)});
var gy = function(){
  N = 25;
  cemeteryGateOpened = false;
  nearVaz = false;
  map = [...Array(N)].map(() => Array(N).fill(5));
  for(let y=1; y<N-1; y++) for(let x=1; x<N-1; x++) map[y][x] = 0;
  FUR = [];

  const B=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=1};
  const I=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=0};

  // Main central autumn gravel alleyway & cross path
  for(let y=1; y<N-1; y++) for(let x=11; x<=13; x++) map[y][x] = 0;
  for(let y=11; y<=13; y++) for(let x=1; x<N-1; x++) map[y][x] = 0;

  // 1. Cream-Stone Orthodox Chapel with dark onion dome on the East-Center side (matching photo)
  B(15,4,20,8); I(16,5,19,7);
  map[6][15]=0; // arched chapel entrance facing central alley
  map[5][15]=4; map[7][15]=4; map[4][17]=4; // arched chapel windows
  FUR.push({x:17.5, y:6.0, img:chapelDomeImg, sc:1.18, noSh:1, overWall:1});
  FUR.push({x:18.8, y:6.0, img:lampImg, sc:.62});

  // 2. NW Crypt & Old Masonry Vault
  B(2,2,6,6); I(3,3,5,5); map[6][4]=0; map[3][2]=4; map[4][2]=4;

  // 3. Wrought-iron grave fences (map=5) & ornate carved stone crosses/monuments (map=7) along both path sides
  // West burial plots (left of alley)
  for(const y of [4,8,15,19]) for(const x of [7,8,9]) map[y][x]=5;
  map[8][8]=0; map[15][8]=0; // walkable plot gates
  for(const [gx,gy2] of [[8,3],[9,5],[7,6],[9,9],[8,16],[9,18],[7,20],[9,21]]) map[gy2][gx]=7;

  // East burial plots (right of alley, foreground monuments & wrought fences like photo)
  for(const y of [10,15,19]) for(const x of [15,16,17,18]) map[y][x]=5;
  map[15][16]=0; map[19][17]=0;
  for(const [gx,gy2] of [[15,16],[17,17],[19,16],[16,20],[18,21],[21,15],[22,18],[21,10]]) map[gy2][gx]=7;

  // SW Caretaker shed & monuments
  B(2,17,5,21); I(3,18,4,20); map[17][4]=0;
  FUR.push({x:3.5, y:19.5, img:lampImg, sc:.65});

  // 4. Golden & Amber Autumn Trees lining the alley & horizon
  for(const [tx,ty2,tImg,sc] of [
    [9.8, 2.6, autumnTreeImg1, 1.28],
    [14.2, 2.4, autumnTreeImg2, 1.32],
    [10.2, 10.2, autumnTreeImg2, 1.22],
    [14.6, 9.6, autumnTreeImg1, 1.25],
    [21.6, 5.2, autumnTreeImg1, 1.34],
    [21.8, 8.6, autumnTreeImg2, 1.28],
    [10.1, 14.4, autumnTreeImg1, 1.20],
    [14.5, 14.6, autumnTreeImg2, 1.22],
    [6.6, 13.8, autumnTreeImg2, 1.26],
    [22.0, 14.2, autumnTreeImg1, 1.30],
    [7.2, 22.2, autumnTreeImg1, 1.28],
    [21.4, 21.8, autumnTreeImg2, 1.30],
    [2.4, 14.2, autumnTreeImg1, 1.25],
  ]){
    FUR.push({x:tx, y:ty2, img:tImg, sc});
  }

  // 5. Wooden Cemetery Benches, Memorial Statue, Urns, Bone Piles & Alleyway Lamps
  FUR.push({x:10.6, y:6.4, img:benchImg, sc:.24}, {x:13.4, y:7.4, img:benchImg, sc:.24});
  FUR.push({x:10.6, y:17.2, img:benchImg, sc:.24}, {x:13.4, y:18.2, img:benchImg, sc:.24});
  FUR.push({x:12.0, y:12.0, img:statImg, sc:.82});
  FUR.push({x:10.8, y:4.2, img:urnImg, sc:.28}, {x:13.2, y:4.2, img:urnImg, sc:.28});
  FUR.push({x:10.8, y:20.4, img:urnImg, sc:.28}, {x:13.2, y:20.4, img:urnImg, sc:.28});
  FUR.push({x:3.5, y:4.5, img:bonePileImg, sc:.24}, {x:17.5, y:17.5, img:bonePileImg, sc:.24});
  FUR.push({x:10.9, y:9.2, img:lampImg, sc:.62}, {x:13.1, y:15.2, img:lampImg, sc:.62});

  // Exit Gate at South central fence
  const exitX = 12, exitY = N-1;
  map[exitY][exitX] = 3;
  EX = exitX + 0.5;
  EY = exitY + 0.5;

  // VAZ-2112 parked right outside the cemetery exit gate!
  VAZ = { x: exitX + 0.5, y: exitY + 1.8, on: true, yaw: 0 };

  // Graph reachability fix to ensure all walkable tiles are reachable from alley [12, 2]
  for(let it=0; it<100; it++){
    const seen = new Set([2*N+12]), q = [[12, 2]];
    while(q.length){
      const[x,y] = q.shift();
      for(const[a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx = x+a, ny = y+b, k = ny*N+nx;
        if(nx>0 && ny>0 && nx<N-1 && ny<N-1 && !seen.has(k) && map[ny][nx]==0){
          seen.add(k); q.push([nx,ny]);
        }
      }
    }
    let fixed = false;
    for(let y=1; y<N-1 && !fixed; y++) for(let x=1; x<N-1 && !fixed; x++){
      if(map[y][x]!=0 || seen.has(y*N+x)) continue;
      for(const[a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx = x+a, ny = y+b;
        if(nx>0 && ny>0 && nx<N-1 && ny<N-1 && (map[ny][nx]==7 || map[ny][nx]==5 || map[ny][nx]==1)){
          map[ny][nx] = 0; fixed = true; break;
        }
      }
    }
    if(!fixed) break;
  }
};
function drawRain4(camInBay, hor){
  const cnt = camInBay ? 34 : 95;
  const spd = 280;
  g.lineWidth = 1;
  g.strokeStyle = camInBay ? 'rgba(175,205,235,0.2)' : 'rgba(185,215,245,0.34)';
  g.beginPath();
  for(let i=0;i<cnt;i++){
    const sx = ((hv(i*3.1)*W + tm*38*(0.7+(i%3)*0.25)) % (W+20)) - 10;
    const sy = ((hv(i*7.7)*H + tm*spd*(0.8+(i%4)*0.15)) % (H+16)) - 12;
    if(camInBay && sy < hor*0.25) continue;
    const len = 8 + (i%4)*3;
    g.moveTo(sx, sy);
    g.lineTo(sx - 2.2, sy + len);
  }
  g.stroke();
  if(!camInBay){
    g.strokeStyle = 'rgba(180,210,240,0.22)';
    for(let i=0;i<14;i++){
      const rx = hv(i*11.3)*W;
      const ry = hor + 18 + hv(i*5.9)*Math.max(10, H - hor - 24);
      const ph = (tm*4.5 + i*0.37) % 1;
      if(ph < 0.6){
        const r = 1.5 + ph*5;
        g.beginPath();g.ellipse(rx, ry, r, r*0.35, 0, 0, 7);g.stroke();
      }
    }
  }
}

function drawVaz3D(ox, oy, dx, dy, plx, ply, hor, VF, zb, zs, inv, RW=W, fog=null, lights=null, flShakeX=0){
  if(!VAZ || !VAZ.on) return;
  const cw = W / RW, colW = cw + 0.06;
  const yaw = VAZ.yaw || 0;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const toW = (u, v, z) => [VAZ.x + u*cy - v*sy, VAZ.y + u*sy + v*cy, z];
  const proj = p => {
    const wx = p[0]-ox, wy = p[1]-oy, wz = p[2];
    const cz = inv*(-ply*wx + plx*wy);
    const cx = inv*(dy*wx - dx*wy);
    return { wx, wy, wz, cx, cz };
  };
  const clipNear = (verts) => {
    const out = [], n = verts.length, ZN = 0.14;
    for(let i=0;i<n;i++){
      const a = verts[i], b = verts[(i+1)%n];
      const ai = a.cz >= ZN, bi = b.cz >= ZN;
      if(ai && bi) out.push(b);
      else if(ai && !bi){
        const t = (ZN - a.cz)/(b.cz - a.cz);
        out.push({ cx: a.cx+(b.cx-a.cx)*t, cz: ZN, wz: a.wz+(b.wz-a.wz)*t });
      }else if(!ai && bi){
        const t = (ZN - a.cz)/(b.cz - a.cz);
        out.push({ cx: a.cx+(b.cx-a.cx)*t, cz: ZN, wz: a.wz+(b.wz-a.wz)*t });
        out.push(b);
      }
    }
    return out;
  };

  const cDist = Math.hypot(VAZ.x - ox, VAZ.y - oy);
  let carPt = 0;
  if(lights){
    for(let li=0;li<lights.length;li++){
      const lt=lights[li],ld2=(VAZ.x-lt.x)**2+(VAZ.y-lt.y)**2;
      if(ld2<lt.rad2)carPt+=(1-Math.sqrt(ld2)/lt.rad)*lt.pow*0.35;
    }
  }
  const vazP0 = proj([VAZ.x, VAZ.y, 0]);
  const vazBeamOff = vazP0.cz > 0.1 ? (vazP0.cx / vazP0.cz) * 0.5 - flShakeX : 0;
  const vazSpot = Math.exp(-vazBeamOff * vazBeamOff * 8);
  const L = CAMV ? Math.min(1, .35 + .9/(1+cDist*cDist*.05)) : Math.min(1, (ch==4?.28:ch==3?.085:.06) + FL*2.05*vazSpot/(1+cDist*cDist*.08) + ltFl*0.45/(1+cDist*cDist*.03) + 0.08/(1+cDist) + carPt);
  const fogA = fog ? (1 - Math.exp(-cDist * fog.density)) : 0;
  const invF = 1 - fogA;
  const scCol = (rgb, k) => {
    const rr = Math.min(255, rgb[0]*L*k), gg = Math.min(255, rgb[1]*L*k), bb = Math.min(255, rgb[2]*L*k);
    if(!fog) return `rgb(${rr|0},${gg|0},${bb|0})`;
    return `rgb(${rr*invF+fog.r*fogA|0},${gg*invF+fog.g*fogA|0},${bb*invF+fog.b*fogA|0})`;
  };
  const ready = ch!=4 || partsInstalled>=NK();

  const quads = [];
  const addQ = (pts, rgb, shade=1, em=false, alpha=1) => {
    const pv = pts.map(p => proj(toW(p[0], p[1], p[2])));
    const cl = clipNear(pv);
    if(cl.length < 3) return;
    let avgZ = 0;
    for(const v of cl) avgZ += v.cz;
    avgZ /= cl.length;
    const emCol = fog ? `rgb(${rgb[0]*invF+fog.r*fogA*0.5|0},${rgb[1]*invF+fog.g*fogA*0.5|0},${rgb[2]*invF+fog.b*fogA*0.5|0})` : `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    quads.push({ cl, z: avgZ, col: em ? emCol : scCol(rgb, shade), alpha });
  };

  // Dynamic multi-layer soft penumbra + umbra ground shadow beneath car
  const toC=(wx,wy)=>[wx*cy+wy*sy,-wx*sy+wy*cy];
  let slx=0.22,sly=0.16,swSum=0.4;
  if(FL>0.04){
    const [lu,lv]=toC(VAZ.x-ox,VAZ.y-oy);
    const ld=Math.hypot(lu,lv)||1;
    slx+=(lu/ld)*FL*1.4;sly+=(lv/ld)*FL*1.4;swSum+=FL*1.4;
  }
  if(lights){
    for(let li=0;li<lights.length;li++){
      const lt=lights[li],vx=VAZ.x-lt.x,vy=VAZ.y-lt.y,d2=vx*vx+vy*vy;
      if(d2>0.3&&d2<lt.rad2){
        const [lu,lv]=toC(vx,vy),ld=Math.hypot(lu,lv)||1,pw=(1-Math.sqrt(d2)/lt.rad)*lt.pow;
        slx+=(lu/ld)*pw;sly+=(lv/ld)*pw;swSum+=pw;
      }
    }
  }
  const sox=Math.max(-0.45,Math.min(0.45,slx/swSum*0.38));
  const soy=Math.max(-0.42,Math.min(0.42,sly/swSum*0.38));
  addQ([[-1.58+sox,-.86+soy,0.004],[1.58+sox,-.86+soy,0.004],[1.58+sox,.86+soy,0.004],[-1.58+sox,.86+soy,0.004]], [0,0,0], 1, true, 0.14*invF);
  addQ([[-1.40+sox*.55,-.70+soy*.55,0.008],[1.40+sox*.55,-.70+soy*.55,0.008],[1.40+sox*.55,.70+soy*.55,0.008],[-1.40+sox*.55,.70+soy*.55,0.008]], [0,0,0], 1, true, 0.24*invF);
  addQ([[-1.22,-.55,0.012],[1.22,-.55,0.012],[1.22,.55,0.012],[-1.22,.55,0.012]], [0,0,0], 1, true, 0.42*invF);

  // Lower body shell (uses equipped car & custom paint color)
  const eqCarSpec = getCarSpec(PF.eqCar || 'vaz2112');
  const rawHex = (PF.carColors && PF.carColors[eqCarSpec.id]) || eqCarSpec.defaultColor || '#6f7882';
  const hexStr = String(rawHex).replace('#', '');
  const body = hexStr.length === 6
    ? [parseInt(hexStr.slice(0,2),16)||120, parseInt(hexStr.slice(2,4),16)||128, parseInt(hexStr.slice(4,6),16)||136]
    : [132,140,148];
  const darkB = [40,44,50], chromeB = [212,220,232], glass = [16,24,36];
  const bt = eqCarSpec.bodyType || 'hatch';
  const isWagon = bt === 'wagon' || bt === 'wagon_classic' || bt === 'wagon_box' || bt === 'largus';
  const isSedan = bt === 'kopeyka' || bt === 'box_sedan' || bt === 'chrome_sedan' || bt === 'round_sedan' || bt === 'zubilo' || bt === 'samara2_sedan' || bt === 'kalina' || bt === 'vesta' || bt === 'executive_sedan';
  const isVan = bt === 'van';
  const isSuv = bt === 'suv' || bt === 'crossover_niva';
  const isCompact = bt === 'compact';
  const isCoupe = bt === 'zubilo_coupe';
  const isRetroChrome = eqCarSpec.id === 'vaz2101' || eqCarSpec.id === 'vaz2102' || eqCarSpec.id === 'vaz2106' || eqCarSpec.id === 'vaz2107' || eqCarSpec.id === 'niva2121';
  const isBodyBumper = bt === 'round_sedan' || bt === 'hatch' || bt === 'wagon' || bt === 'samara2_hatch' || bt === 'samara2_sedan' || bt === 'kalina' || bt === 'vesta' || bt === 'executive_sedan';
  const bmpCol = isBodyBumper ? body : isRetroChrome ? chromeB : darkB;
  const lenK = isCompact ? 0.84 : bt === 'executive_sedan' ? 1.12 : bt === 'vesta' ? 1.05 : 1.0;
  const zOff = isSuv ? 0.055 : isVan ? 0.03 : 0.0;
  const roofH = (isVan ? 0.78 : isSuv ? 0.70 : bt === 'largus' ? 0.68 : bt === 'kalina' ? 0.65 : 0.62) + zOff;
  const rearRoofX = (isVan ? -1.02 : isWagon || isSuv ? -0.92 : isSedan ? -0.50 : -0.62) * lenK;
  const fX = 1.08 * lenK;
  const rX = -1.08 * lenK;

  // Front & rear sculpted bumpers + rubber overriders on classics
  addQ([[fX,-.45,.10+zOff],[fX,.45,.10+zOff],[fX,.45,.21+zOff],[fX,-.45,.21+zOff]], bmpCol, 0.94);
  addQ([[rX,.45,.10+zOff],[rX,-.45,.10+zOff],[rX,-.45,.22+zOff],[rX,.45,.22+zOff]], bmpCol, 0.80);
  if(eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'||eqCarSpec.id==='vaz2106'){
    for(const oz of [-0.20, 0.20]){
      addQ([[fX+.02,oz-.02,.10+zOff],[fX+.02,oz+.02,.10+zOff],[fX+.02,oz+.02,.24+zOff],[fX+.02,oz-.02,.24+zOff]], chromeB, 1.05);
      addQ([[rX-.02,oz+.02,.10+zOff],[rX-.02,oz-.02,.10+zOff],[rX-.02,oz-.02,.24+zOff],[rX-.02,oz+.02,.24+zOff]], chromeB, 0.92);
    }
  }else if(eqCarSpec.id==='vaz2104'||eqCarSpec.id==='vaz2105'||eqCarSpec.id==='vaz2107'){
    addQ([[fX+.01,-.45,.14+zOff],[fX+.01,.45,.14+zOff],[fX+.01,.45,.18+zOff],[fX+.01,-.45,.18+zOff]], [20,22,26], 0.9);
  }

  // Side body panels, moldings, mirrors, handles, mudflaps & detailed wheels
  for(const sd of [-1, 1]){
    const y = sd * 0.46;
    const sh = sd > 0 ? 0.96 : 0.84;
    // Lower rocker skirt / black cladding on SUVs
    addQ([[rX+.02,y,.09+zOff],[fX-.02,y,.09+zOff],[fX-.02,y,.18+zOff],[rX+.02,y,.18+zOff]], (bt==='crossover_niva'||bt==='suv'||!isBodyBumper)?darkB:body, sh*0.86);
    // Main sculpted door belt
    addQ([[rX+.02,y,.18+zOff],[fX-.02,y,.18+zOff],[fX-.06,y,.38+zOff],[rX+.06,y,.38+zOff]], body, sh);
    // Side molding / chrome strip / Vesta X-crease
    if(eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'||eqCarSpec.id==='vaz2106'||eqCarSpec.id==='volga3110'){
      addQ([[rX+.04,sd*0.466,.29+zOff],[fX-.04,sd*0.466,.29+zOff],[fX-.04,sd*0.466,.31+zOff],[rX+.04,sd*0.466,.31+zOff]], chromeB, 1, true);
    }else if(bt==='vesta'){
      addQ([[0.04,sd*0.465,.36+zOff],[0.45,sd*0.465,.20+zOff],[0.41,sd*0.465,.20+zOff],[0.00,sd*0.465,.36+zOff]], body, sh*0.76);
      addQ([[-0.06,sd*0.465,.36+zOff],[-0.45,sd*0.465,.20+zOff],[-0.41,sd*0.465,.20+zOff],[-0.02,sd*0.465,.36+zOff]], body, sh*1.12);
    }else{
      addQ([[rX+.10,sd*0.464,.24+zOff],[fX-.10,sd*0.464,.24+zOff],[fX-.10,sd*0.464,.27+zOff],[rX+.10,sd*0.464,.27+zOff]], [24,26,30], sh);
    }
    // Side doors & handles
    const handleXs = isCoupe ? [-0.14*lenK] : [-0.42*lenK, 0.04*lenK];
    for(const hx of handleXs){
      addQ([[hx,sd*0.468,.32+zOff],[hx+.09,sd*0.468,.32+zOff],[hx+.09,sd*0.468,.34+zOff],[hx,sd*0.468,.34+zOff]], (eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'||eqCarSpec.id==='vaz2106'||eqCarSpec.id==='volga3110')?chromeB:[22,24,28], sh);
    }
    // Side mirrors
    if(!isVan){
      const mirC = isBodyBumper ? body : (eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'||eqCarSpec.id==='vaz2106') ? chromeB : [24,26,30];
      addQ([[0.42*lenK,sd*0.46,.37+zOff],[0.42*lenK,sd*0.53,.37+zOff],[0.42*lenK,sd*0.53,.43+zOff],[0.42*lenK,sd*0.46,.43+zOff]], mirC, sh);
    }
    // Greenhouse side pillars + translucent reflective tinted windows
    const frontCabBotX = isVan ? fX-.04 : 0.52*lenK;
    const frontCabTopX = isVan ? fX-.10 : 0.24*lenK;
    addQ([[isVan?rX+.04:isSedan?-0.76*lenK:-0.94*lenK,y*0.97,.38+zOff],[frontCabBotX,y*0.97,.38+zOff],[frontCabTopX,y*0.88,roofH],[rearRoofX,y*0.88,roofH]], body, sh*0.92);
    addQ([[isVan?rX+.12:isSedan?-0.66*lenK:-0.78*lenK,sd*0.455,.40+zOff],[isVan?fX-.10:0.38*lenK,sd*0.455,.40+zOff],[isVan?fX-.14:0.18*lenK,sd*0.41,roofH-.03],[rearRoofX+0.07,sd*0.41,roofH-.03]], glass, 1, true, 0.72);
    // Side window dynamic sky/lamp reflections
    addQ([[isVan?rX+.24:-0.42*lenK,sd*0.457,.44+zOff],[isVan?fX-.16:0.26*lenK,sd*0.457,.44+zOff],[isVan?fX-.20:0.14*lenK,sd*0.414,roofH-.05],[isVan?rX+.18:-0.48*lenK,sd*0.414,roofH-.05]], [148,188,224], 1, true, 0.16);
    // B-pillar divider (further back on 3-door coupe & classic Niva)
    const bpX = (isCoupe||bt==='suv') ? -0.26*lenK : -0.15*lenK;
    addQ([[bpX-.04,sd*0.458,.39+zOff],[bpX+.03,sd*0.458,.39+zOff],[bpX+.01,sd*0.41,roofH-.03],[bpX-.06,sd*0.41,roofH-.03]], [28,32,38], sh);
    // 8-sided cylindrical 3D wheels with deep wheelwell arch, curved tire tread, alloy rim & brake hub
    for(const wx of [-0.66*lenK, 0.66*lenK]){
      const rTire = (isSuv || isVan) ? 0.142 : 0.124;
      const rRim = rTire * 0.58;
      const rHub = rTire * 0.24;
      const cz = rTire;
      const wyIn = sd * 0.41;
      const wyOut = sd * 0.484;
      const wyRim = sd * 0.488;
      const wyHub = sd * 0.492;
      // Wheelwell recess cavity
      addQ([[wx-rTire*1.12,sd*0.456,.02],[wx+rTire*1.12,sd*0.456,.02],[wx+rTire*1.12,sd*0.456,cz+rTire*1.12],[wx-rTire*1.12,sd*0.456,cz+rTire*1.12]], [10,12,15], 1, true);
      const tirePts = [];
      const rimPts = [];
      const hubPts = [];
      for(let ti=0; ti<8; ti++){
        const a0 = ti * Math.PI * 0.25;
        const a1 = (ti + 1) * Math.PI * 0.25;
        const x0 = wx + Math.cos(a0) * rTire, z0 = cz + Math.sin(a0) * rTire;
        const x1 = wx + Math.cos(a1) * rTire, z1 = cz + Math.sin(a1) * rTire;
        addQ([[x0, wyIn, z0], [x1, wyIn, z1], [x1, wyOut, z1], [x0, wyOut, z0]], [14,16,20], 0.72 + 0.3 * Math.max(0, Math.sin(a0)));
        tirePts.push([x0, wyOut, z0]);
        rimPts.push([wx + Math.cos(a0) * rRim, wyRim, cz + Math.sin(a0) * rRim]);
        hubPts.push([wx + Math.cos(a0) * rHub, wyHub, cz + Math.sin(a0) * rHub]);
      }
      addQ(tirePts, [20,22,26], 1, true);
      addQ(rimPts, isRetroChrome?[216,224,234]:[176,184,194], sh);
      addQ(hubPts, [28,32,38], sh);
    }
    // Rear mudflap
    addQ([[rX+.22,sd*0.46,.02],[rX+.26,sd*0.46,.02],[rX+.26,sd*0.46,.11],[rX+.22,sd*0.46,.11]], [16,18,22], sh);
  }
  // Cabin dashboard & glowing cluster silhouette visible behind translucent glass
  const dCabX = isVan ? fX - 0.14 : 0.34*lenK;
  addQ([[dCabX-.14,-.34,.34+zOff],[dCabX,-.34,.34+zOff],[dCabX,.34,.34+zOff],[dCabX-.14,.34,.34+zOff]], [24,27,34], 0.9);
  addQ([[dCabX-.15,.08,.39+zOff],[dCabX-.15,.26,.39+zOff],[dCabX-.15,.26,.45+zOff],[dCabX-.15,.08,.45+zOff]], ready?[86,214,142]:[28,34,42], 1, ready, 0.85);
  if(isVan){
    addQ([[fX-.02,-.45,.22+zOff],[fX,-.44,.42+zOff],[fX,.44,.42+zOff],[fX-.02,.45,.22+zOff]], body, 0.94);
    addQ([[fX,-.42,.42+zOff],[fX,.42,.42+zOff],[fX-.10,.40,roofH],[fX-.10,-.40,roofH]], glass, 1, true, 0.64);
    addQ([[fX-.01,-.28,.44+zOff],[fX-.01,-.10,.44+zOff],[fX-.09,.06,roofH-.03],[fX-.09,-.10,roofH-.03]], [185,220,248], 1, true, 0.24);
    addQ([[rearRoofX,-.40,roofH],[fX-.10,-.40,roofH],[fX-.10,.40,roofH],[rearRoofX,.40,roofH]], body, 1.12);
    addQ([[rX+.02,-.42,.41+zOff],[rearRoofX,-.40,roofH],[rearRoofX,.40,roofH],[rX+.02,.42,.41+zOff]], glass, 1, true, 0.72);
    addQ([[rX+.03,-.24,.44+zOff],[rX+.03,-.08,.44+zOff],[rearRoofX+.01,.06,roofH-.04],[rearRoofX+.01,-.08,roofH-.04]], [155,195,228], 1, true, 0.18);
    addQ([[rX,-.45,.23+zOff],[rX+.02,-.44,.41+zOff],[rX+.02,.44,.41+zOff],[rX,.45,.23+zOff]], body, 0.85);
  }else{
    // Hood + optional 2107 / Volga power rib
    addQ([[0.48*lenK,-.45,.38+zOff],[fX-.02,-.44,.32+zOff],[fX-.02,.44,.32+zOff],[0.48*lenK,.45,.38+zOff]], body, 1.06);
    if(eqCarSpec.id==='vaz2107'||eqCarSpec.id==='volga3110'){
      addQ([[0.50*lenK,-.13,.385+zOff],[fX-.04,-.13,.335+zOff],[fX-.04,.13,.335+zOff],[0.50*lenK,.13,.385+zOff]], body, 1.14);
    }
    // Front fascia
    addQ([[fX-.02,-.45,.21+zOff],[fX,-.44,.32+zOff],[fX,.44,.32+zOff],[fX-.02,.45,.21+zOff]], body, 0.92);
    // Translucent windshield + dual specular reflection streaks
    addQ([[0.50*lenK,-.42,.38+zOff],[0.50*lenK,.42,.38+zOff],[0.24*lenK,.39,roofH],[0.24*lenK,-.39,roofH]], glass, 1, true, 0.62);
    addQ([[0.46*lenK,-.28,.40+zOff],[0.46*lenK,-.10,.40+zOff],[0.27*lenK,.04,roofH-.03],[0.27*lenK,-.12,roofH-.03]], [178,214,244], 1, true, 0.25);
    addQ([[0.46*lenK,.02,.40+zOff],[0.46*lenK,.12,.40+zOff],[0.27*lenK,.22,roofH-.03],[0.27*lenK,.14,roofH-.03]], [248,220,168], 1, true, 0.14);
    // Roof crown
    addQ([[rearRoofX,-.39,roofH],[0.24*lenK,-.39,roofH],[0.24*lenK,.39,roofH],[rearRoofX,.39,roofH]], body, 1.14);
    if(isSedan){
      addQ([[-0.76*lenK,-.42,.38+zOff],[rearRoofX,-.39,roofH],[rearRoofX,.39,roofH],[-0.76*lenK,.42,.38+zOff]], glass, 1, true, 0.72);
      addQ([[-0.72*lenK,-.22,.41+zOff],[rearRoofX-.02,-.06,roofH-.03],[rearRoofX-.02,.10,roofH-.03],[-0.72*lenK,-.06,.41+zOff]], [155,195,228], 1, true, 0.2);
      addQ([[rX+.04,-.44,.38+zOff],[-0.76*lenK,-.43,.38+zOff],[-0.76*lenK,.43,.38+zOff],[rX+.04,.44,.38+zOff]], body, 1.0);
      addQ([[rX,-.45,.22+zOff],[rX+.04,-.44,.38+zOff],[rX+.04,.44,.38+zOff],[rX,.45,.22+zOff]], body, 0.85);
      if(eqCarSpec.id==='vaz2115'){
        addQ([[rX+.02,-.42,.40+zOff],[rX+.10,-.42,.40+zOff],[rX+.10,.42,.40+zOff],[rX+.02,.42,.40+zOff]], body, 1.05);
      }
    }else if(isWagon||isSuv){
      addQ([[rX+.06,-.42,.39+zOff],[rearRoofX,-.39,roofH],[rearRoofX,.39,roofH],[rX+.06,.42,.39+zOff]], glass, 1, true, 0.72);
      addQ([[rX+.08,-.20,.42+zOff],[rearRoofX-.01,-.04,roofH-.03],[rearRoofX-.01,.12,roofH-.03],[rX+.08,-.04,.42+zOff]], [155,195,228], 1, true, 0.2);
      addQ([[rX,-.45,.22+zOff],[rX+.06,-.44,.39+zOff],[rX+.06,.44,.39+zOff],[rX,.45,.22+zOff]], body, 0.85);
      if(isSuv){
        addQ([[rX-.055,-.18,.28+zOff],[rX-.055,.18,.28+zOff],[rX-.055,.18,.54+zOff],[rX-.055,-.18,.54+zOff]], [20,22,26], 0.85);
        addQ([[rX-.06,-.09,.33+zOff],[rX-.06,.09,.33+zOff],[rX-.06,.09,.49+zOff],[rX-.06,-.09,.49+zOff]], [165,175,185], 0.95);
      }
    }else{
      addQ([[rX+.12,-.42,.40+zOff],[rearRoofX,-.39,roofH],[rearRoofX,.39,roofH],[rX+.12,.42,.40+zOff]], glass, 1, true, 0.72);
      addQ([[rX+.14,-.20,.43+zOff],[rearRoofX-.01,-.04,roofH-.03],[rearRoofX-.01,.12,roofH-.03],[rX+.14,-.04,.43+zOff]], [155,195,228], 1, true, 0.2);
      addQ([[rX+.14,-.43,.48+zOff],[rX+.24,-.43,.50+zOff],[rX+.24,.43,.50+zOff],[rX+.14,.43,.48+zOff]], (bt==='samara2_hatch'||bt==='hatch')?body:[36,40,46], 0.98);
      addQ([[rX,-.45,.22+zOff],[rX+.12,-.44,.40+zOff],[rX+.12,.44,.40+zOff],[rX,.45,.22+zOff]], body, 0.85);
    }
  }
  if(isVan){
    addQ([[fX-.045,-.018,.42+zOff],[fX-.045,.018,.42+zOff],[fX-.10,.018,roofH],[fX-.10,-.018,roofH]], body, 0.9);
    addQ([[rX-.006,-.01,.23+zOff],[rX-.006,.01,.23+zOff],[rX-.006,.01,roofH-.05],[rX-.006,-.01,roofH-.05]], [26,28,32], 0.9);
  }
  // Roof rails / racks / Vesta shark-fin antenna
  if(eqCarSpec.id==='vaz2111'||eqCarSpec.id==='largus'||eqCarSpec.id==='niva2123'){
    for(const sd of [-1, 1]){
      addQ([[rearRoofX+.08,sd*.35,roofH],[0.20*lenK,sd*.35,roofH],[0.20*lenK,sd*.35,roofH+.035],[rearRoofX+.08,sd*.35,roofH+.035]], [26,28,32], 0.9);
    }
  }else if(eqCarSpec.id==='niva2121'||eqCarSpec.id==='vaz2102'||eqCarSpec.id==='vaz2104'){
    addQ([[rearRoofX+.06,-.34,roofH+.02],[0.18*lenK,-.34,roofH+.02],[0.18*lenK,.34,roofH+.02],[rearRoofX+.06,.34,roofH+.02]], [32,36,42], 0.9);
  }else if(bt==='vesta'){
    addQ([[rearRoofX+.08,-.02,roofH],[rearRoofX+.18,-.02,roofH],[rearRoofX+.18,.02,roofH+.045],[rearRoofX+.08,.02,roofH+.045]], body, 1.05);
  }
  // Front Grille
  const grilleCol = (eqCarSpec.id==='vaz2107'||eqCarSpec.id==='volga3110'||eqCarSpec.id==='vaz2106'||eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102') ? chromeB : [22,25,29];
  const grTop = (eqCarSpec.id==='vaz2107') ? .34+zOff : .30+zOff;
  addQ([[fX+.005,-.20,.23+zOff],[fX+.005,.20,.23+zOff],[fX+.005,.20,grTop],[fX+.005,-.20,grTop]], grilleCol, 1, true);
  if(eqCarSpec.id==='vaz2107'||eqCarSpec.id==='volga3110'||eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'){
    addQ([[fX+.008,-.17,.24+zOff],[fX+.008,.17,.24+zOff],[fX+.008,.17,grTop-.015],[fX+.008,-.17,grTop-.015]], [26,30,36], 1, true);
  }else if(bt==='vesta'){
    addQ([[fX+.007,-.22,.13+zOff],[fX+.007,.22,.13+zOff],[fX+.007,.19,.29+zOff],[fX+.007,-.19,.29+zOff]], [16,18,22], 1, true);
    addQ([[fX+.009,-.23,.13+zOff],[fX+.009,-.19,.13+zOff],[fX+.009,-.16,.29+zOff],[fX+.009,-.20,.29+zOff]], chromeB, 1, true);
    addQ([[fX+.009,.19,.13+zOff],[fX+.009,.23,.13+zOff],[fX+.009,.20,.29+zOff],[fX+.009,.16,.29+zOff]], chromeB, 1, true);
  }
  // Front headlights
  const hlCol = ready ? [255,244,175] : [135,145,155];
  if(eqCarSpec.id==='vaz2106'){
    for(const hz of [-.38,-.27,.27,.38]){
      addQ([[fX+.005,hz-.04,.24+zOff],[fX+.005,hz+.04,.24+zOff],[fX+.005,hz+.04,.30+zOff],[fX+.005,hz-.04,.30+zOff]], hlCol, 1, ready);
    }
  }else if(eqCarSpec.id==='vaz2101'||eqCarSpec.id==='vaz2102'){
    for(const hz of [-.33,.33]){
      addQ([[fX+.005,hz-.05,.235+zOff],[fX+.005,hz+.05,.235+zOff],[fX+.005,hz+.05,.31+zOff],[fX+.005,hz-.05,.31+zOff]], chromeB, 1, true);
      addQ([[fX+.008,hz-.038,.245+zOff],[fX+.008,hz+.038,.245+zOff],[fX+.008,hz+.038,.30+zOff],[fX+.008,hz-.038,.30+zOff]], hlCol, 1, ready);
    }
  }else{
    addQ([[fX+.005,-.42,.24+zOff],[fX+.005,-.25,.24+zOff],[fX+.005,-.25,.30+zOff],[fX+.005,-.42,.30+zOff]], hlCol, 1, ready);
    addQ([[fX+.005,.25,.24+zOff],[fX+.005,.42,.24+zOff],[fX+.005,.42,.30+zOff],[fX+.005,.25,.30+zOff]], hlCol, 1, ready);
    if(eqCarSpec.id==='niva2121'){
      addQ([[fX+.006,-.41,.315+zOff],[fX+.006,-.27,.315+zOff],[fX+.006,-.27,.34+zOff],[fX+.006,-.41,.34+zOff]], [245,158,11], 1, true);
      addQ([[fX+.006,.27,.315+zOff],[fX+.006,.41,.315+zOff],[fX+.006,.41,.34+zOff],[fX+.006,.27,.34+zOff]], [245,158,11], 1, true);
    }
  }
  // Fog lights on modern models
  if(bt==='samara2_hatch'||bt==='samara2_sedan'||bt==='kalina'||bt==='vesta'||bt==='crossover_niva'||eqCarSpec.id==='priora'||eqCarSpec.id==='largus'){
    for(const fz of [-.32,.32]){
      addQ([[fX+.008,fz-.03,.13+zOff],[fX+.008,fz+.03,.13+zOff],[fX+.008,fz+.03,.17+zOff],[fX+.008,fz-.03,.17+zOff]], ready?[254,240,138]:[125,135,145], 1, ready);
    }
  }
  // Front license plate & exhaust
  addQ([[fX+.01,-.14,.13+zOff],[fX+.01,.14,.13+zOff],[fX+.01,.14,.19+zOff],[fX+.01,-.14,.19+zOff]], [235,240,245], 0.95);
  addQ([[rX-.04,-.27,.07],[rX+.02,-.27,.07],[rX+.02,-.22,.10],[rX-.04,-.22,.10]], [148,158,168], 0.9);

  // Wide red/amber taillight & rear license plate
  const tlCol = ready ? [245,40,48] : [140,24,28];
  addQ([[rX-.005,-.43,.25+zOff],[rX-.005,.43,.25+zOff],[rX-.005,.43,.33+zOff],[rX-.005,-.43,.33+zOff]], tlCol, 1, ready);
  addQ([[rX-.008,-.41,.255+zOff],[rX-.008,-.32,.255+zOff],[rX-.008,-.32,.29+zOff],[rX-.008,-.41,.29+zOff]], [245,145,22], 1, true);
  addQ([[rX-.008,.32,.255+zOff],[rX-.008,.41,.255+zOff],[rX-.008,.41,.29+zOff],[rX-.008,.32,.29+zOff]], [245,145,22], 1, true);
  addQ([[rX-.01,-.15,.26+zOff],[rX-.01,.15,.26+zOff],[rX-.01,.15,.31+zOff],[rX-.01,-.15,.31+zOff]], [240,244,248], 0.9);

  quads.sort((a,b) => b.z - a.z);

  for(const q of quads){
    const pts = q.cl.map(v => ({
      x: W*0.5*(1 + v.cx/v.cz),
      y: hor + (H/v.cz*VF)*(0.5 - v.wz),
      z: v.cz
    }));
    let minX = W, maxX = -1;
    for(const p of pts){ if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x; }
    const rx0 = Math.max(0, Math.floor(minX / cw)), rx1 = Math.min(RW - 1, Math.ceil(maxX / cw));
    if(rx1 < rx0) continue;
    g.globalAlpha = q.alpha !== undefined ? q.alpha : 1;
    g.fillStyle = q.col;
    for(let ri = rx0; ri <= rx1; ri++){
      const xc = (ri + 0.5) * cw;
      let yMin = 1e9, yMax = -1e9, zHit = 1e9, hits = 0;
      for(let i=0;i<pts.length;i++){
        const a = pts[i], b = pts[(i+1)%pts.length];
        if((a.x<=xc && b.x>=xc) || (b.x<=xc && a.x>=xc)){
          const dx2 = b.x - a.x;
          if(Math.abs(dx2) < 1e-4){
            if(a.y<yMin)yMin=a.y; if(b.y<yMin)yMin=b.y;
            if(a.y>yMax)yMax=a.y; if(b.y>yMax)yMax=b.y;
            zHit = Math.min(zHit, a.z, b.z);
            hits++;
          }else{
            const t = (xc - a.x)/dx2;
            const yy = a.y + (b.y - a.y)*t;
            const zz = a.z + (b.z - a.z)*t;
            if(yy<yMin)yMin=yy; if(yy>yMax)yMax=yy;
            if(zz<zHit)zHit=zz;
            hits++;
          }
        }
      }
      if(hits >= 2 && zb[ri] > zHit){
        if((q.alpha===undefined||q.alpha>=0.99)&&zHit < zs[ri]) zs[ri] = zHit;
        const hh = Math.max(1, yMax - yMin);
        g.fillRect(ri * cw, yMin, colW, hh);
      }
    }
  }
  g.globalAlpha = 1;
}

var gr = function(){
  N = 25;
  cemeteryGateOpened = false;
  nearVaz = false;
  map = [...Array(N)].map(() => Array(N).fill(1));
  for(let y=1; y<N-1; y++) for(let x=1; x<N-1; x++) map[y][x] = 0;
  FUR = [];
  GARAGE_BAYS = [];
  GARAGE_PART_SPOTS = [];
  EX = -99;
  EY = -99;

  // Outer perimeter garage facades with alternating silicate brick & rusted red-brown gates
  for(let x=2; x<=22; x+=2){
    if(x<10||x>14){map[0][x]=8; map[24][x]=8;}
  }
  for(let y=2; y<=22; y+=2){
    if(y!=8&&y!=15){map[y][0]=8; map[y][24]=8;}
  }

  const B=(x0,y0,x1,y1,t=1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=t};
  const I=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)map[y][x]=0};

  // NW Garage Row (Boxes #1-#3, Box #3 open)
  B(2,2,9,6,1); I(3,3,8,5);
  map[6][3]=8; map[6][5]=0; map[6][7]=8;
  GARAGE_BAYS.push({x0:3,y0:3,x1:8.99,y1:6.05});
  FUR.push({x:3.6, y:3.6, img:tableImg, sc:.26}, {x:7.8, y:3.6, img:shelfImg, sc:.52}, {x:5.5, y:3.4, img:lampImg, sc:.62});
  GARAGE_PART_SPOTS.push({x:4.4,y:4.6,bay:0}, {x:6.1,y:3.9,bay:0}, {x:7.6,y:5.1,bay:0});

  // NE Garage Row (Boxes #4-#6, Box #6 open)
  B(15,2,22,6,1); I(16,3,21,5);
  map[6][17]=8; map[6][19]=0; map[6][21]=8;
  GARAGE_BAYS.push({x0:16,y0:3,x1:21.99,y1:6.05});
  FUR.push({x:17.0, y:3.6, img:shelfImg, sc:.52}, {x:20.4, y:3.8, img:tableImg, sc:.26}, {x:19.2, y:3.4, img:lampImg, sc:.62});
  GARAGE_PART_SPOTS.push({x:17.4,y:5.0,bay:1}, {x:18.9,y:4.0,bay:1}, {x:20.5,y:4.8,bay:1});

  // Mid-West Orange Garage Row (#7-#8) with Duocara Radio inside
  B(2,9,9,13,9); I(3,10,8,12);
  map[9][3]=9; map[9][5]=0; map[9][7]=9;
  map[13][3]=9; map[13][5]=9; map[13][7]=0;
  GARAGE_BAYS.push({x0:3,y0:9.95,x1:8.99,y1:13.05});
  FUR.push({x:4.0, y:11.3, img:tableImg, sc:.26}, {x:7.6, y:10.6, img:shelfImg, sc:.5}, {x:6.2, y:11.5, img:lampImg, sc:.62});
  GARAGE_PART_SPOTS.push({x:3.8,y:12.2,bay:2}, {x:5.5,y:10.7,bay:2}, {x:8.0,y:12.1,bay:2});

  // Mid-East Garage Row (#9-#10)
  B(15,9,22,13,1); I(16,10,21,12);
  map[9][17]=8; map[9][19]=0; map[9][21]=8;
  map[13][17]=0; map[13][19]=8; map[13][21]=8;
  GARAGE_BAYS.push({x0:16,y0:9.95,x1:21.99,y1:13.05});
  FUR.push({x:17.2, y:10.6, img:shelfImg, sc:.5}, {x:20.4, y:11.4, img:tableImg, sc:.26}, {x:18.6, y:11.5, img:lampImg, sc:.62});
  GARAGE_PART_SPOTS.push({x:16.7,y:12.1,bay:3}, {x:19.0,y:10.8,bay:3}, {x:20.8,y:12.1,bay:3});

  // SW Garage (#11)
  B(2,17,7,22,1); I(3,18,6,21);
  map[17][4]=0; map[17][6]=8;
  GARAGE_BAYS.push({x0:3,y0:17.95,x1:6.99,y1:21.99});
  FUR.push({x:3.5, y:19.2, img:shelfImg, sc:.5}, {x:5.6, y:20.6, img:tableImg, sc:.26});
  GARAGE_PART_SPOTS.push({x:4.8,y:21.1,bay:4}, {x:3.8,y:18.7,bay:4}, {x:5.8,y:18.8,bay:4});

  // SE Garage (#13)
  B(17,17,22,22,1); I(18,18,21,21);
  map[17][18]=8; map[17][20]=0;
  GARAGE_BAYS.push({x0:18,y0:17.95,x1:21.99,y1:21.99});
  FUR.push({x:18.8, y:19.4, img:tableImg, sc:.26}, {x:20.8, y:20.6, img:shelfImg, sc:.5});
  GARAGE_PART_SPOTS.push({x:18.8,y:21.1,bay:5}, {x:19.8,y:19.0,bay:5}, {x:21.0,y:18.8,bay:5});

  // South Courtyard Garage Box #14 (3D VAZ-2112 parked outdoors right beside it!)
  B(9,20,13,23,1);
  I(10,21,12,22);
  map[20][10]=8; map[20][11]=0; map[20][12]=0;
  GARAGE_BAYS.push({x0:10,y0:20.95,x1:12.99,y1:22.99});
  FUR.push({x:10.5, y:21.8, img:tableImg, sc:.26}, {x:12.3, y:21.8, img:shelfImg, sc:.5});
  GARAGE_PART_SPOTS.push({x:11.4,y:22.3,bay:6}, {x:10.6,y:21.3,bay:6});

  // 3D VAZ-2112 parked outdoors in rainy South courtyard right beside Box #14
  VAZ = { x: 14.3, y: 18.0, on: true, yaw: -0.36 };

  // Street lamps illuminating outdoor asphalt lanes & courtyard
  FUR.push({x:10.4, y:3.6, img:lampImg, sc:.68}, {x:14.6, y:3.6, img:lampImg, sc:.68});
  FUR.push({x:10.4, y:11.5, img:lampImg, sc:.68}, {x:14.6, y:11.5, img:lampImg, sc:.68});
  FUR.push({x:9.6, y:18.8, img:lampImg, sc:.72}, {x:16.2, y:16.4, img:lampImg, sc:.72});

  // Extra garage bay & courtyard decorations (tires, oil/fuel barrels, crates, cones)
  FUR.push(
    {x:3.3, y:5.2, img:tiresImg, sc:.26}, {x:8.2, y:5.2, img:barrelImg, sc:.32},
    {x:16.4, y:5.2, img:barrelImg, sc:.32}, {x:21.2, y:5.2, img:tiresImg, sc:.26},
    {x:3.3, y:12.3, img:crateImg, sc:.26}, {x:8.3, y:12.3, img:tiresImg, sc:.26},
    {x:16.4, y:12.3, img:crateImg, sc:.26}, {x:21.3, y:12.3, img:barrelImg, sc:.32},
    {x:3.4, y:21.2, img:barrelImg, sc:.32}, {x:21.2, y:21.2, img:tiresImg, sc:.26},
    {x:10.3, y:16.4, img:coneImg, sc:.26}, {x:16.8, y:16.4, img:coneImg, sc:.26},
    {x:12.8, y:19.2, img:tiresImg, sc:.26}, {x:15.9, y:19.4, img:barrelImg, sc:.32}
  );

  // Reachability repair from player start [12, 2]
  for(let it=0; it<100; it++){
    const seen = new Set([2*N+12]), q = [[12, 2]];
    while(q.length){
      const[x,y] = q.shift();
      for(const[a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx = x+a, ny = y+b, k = ny*N+nx;
        if(nx>0 && ny>0 && nx<N-1 && ny<N-1 && !seen.has(k) && map[ny][nx]==0){
          seen.add(k); q.push([nx,ny]);
        }
      }
    }
    let fixed = false;
    for(let y=1; y<N-1 && !fixed; y++) for(let x=1; x<N-1 && !fixed; x++){
      if(map[y][x]!=0 || seen.has(y*N+x)) continue;
      for(const[a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx = x+a, ny = y+b;
        if(nx>0 && ny>0 && nx<N-1 && ny<N-1 && map[ny][nx]==1){
          map[ny][nx] = 0; fixed = true; break;
        }
      }
    }
    if(!fixed) break;
  }
};
var drawStones = function(sd,sw,zs,hor,kk,RW=W,fog=null,flShakeX=0){const cw=W/RW,colW=cw+0.06;for(let ri=0;ri<RW;ri++){const d=sd[ri];if(!d||d>=zs[ri])continue;const x=ri*cw,u=sw[ri],lh=H/d*VFK(),fy=hor+lh/2,c=ri/RW-.5-flShakeX,L=Math.min(1,(ch==3?.085:.04)+FL*Math.exp(-c*c*10)*2.4/(1+d*d*.1)+.06/(1+d*d)+(hid?.1/(1+d*.2):0)),fa=fog?1-Math.exp(-d*fog.density):0,iv=1-fa;
const sCol=(r,gg,b)=>fog?`rgb(${r*L*iv+fog.r*fa|0},${gg*L*iv+fog.g*fa|0},${b*L*iv+fog.b*fa|0})`:`rgb(${r*L|0},${gg*L|0},${b*L|0})`;
if(ch==3){
  const v=kk[ri];
  if(u>.10&&u<.90){g.fillStyle=`rgba(0,0,0,${(0.44*iv).toFixed(3)})`;g.fillRect(x,fy-lh*0.015,colW,Math.max(1.5,lh*0.06))}
  g.fillStyle=sCol(152,146,132);
  if(v==1){
    if(u>.22&&u<.78){g.fillRect(x,fy-lh*.14,colW,lh*.14)}
    if(u>=.38&&u<=.62){g.fillRect(x,fy-lh*.62,colW,lh*.62)}
    else if(u>.18&&u<.82){g.fillRect(x,fy-lh*.48,colW,lh*.07);if(u>.30&&u<.70)g.fillRect(x,fy-lh*.57,colW,lh*.04)}
    if(u>=.38&&u<=.62){g.fillStyle=`rgba(38,68,26,${(0.45*iv).toFixed(3)})`;g.fillRect(x,fy-lh*.12,colW,lh*.12)}
  }else if(v==2){
    if(u<.16||u>.84)continue;
    const plH=u>.24&&u<.76?lh*.44:lh*.18;
    g.fillRect(x,fy-plH,colW,plH);
    if(u>.32&&u<.68){g.fillStyle=sCol(198,192,178);g.fillRect(x,fy-lh*.37,colW,lh*.17)}
    g.fillStyle=`rgba(20,22,20,${(0.45*iv).toFixed(3)})`;g.fillRect(x,fy-plH,colW,Math.max(1,lh*.03));
    g.fillStyle=`rgba(175,85,22,${(0.48*iv).toFixed(3)})`;g.fillRect(x,fy-lh*.06,colW,lh*.06);
  }else{
    if(u<.15||u>.85)continue;
    const a=(u-.5)/.35,hgt=lh*(.42+.11*Math.sqrt(Math.max(0,1-a*a)));
    g.fillRect(x,fy-hgt,colW,hgt);
    if(Math.abs(u-.5)<.03){g.fillStyle=`rgba(32,30,26,${(0.72*iv).toFixed(3)})`;g.fillRect(x,fy-hgt*.85,colW,hgt*.5)}
    if(Math.abs(u-.5)<.11){g.fillStyle=`rgba(32,30,26,${(0.65*iv).toFixed(3)})`;g.fillRect(x,fy-hgt*.64,colW,Math.max(1,hgt*.045))}
    g.fillStyle=`rgba(32,68,24,${(0.52*iv).toFixed(3)})`;g.fillRect(x,fy-hgt*.18,colW,hgt*.18);
  }
}else{if(u<.05||u>.95)continue;const hgt=lh*.5;g.fillStyle=sCol(150,105,60);g.fillRect(x,fy-hgt,colW,hgt);g.fillStyle=`rgba(0,0,0,${(0.5*iv).toFixed(3)})`;if(u<.09||u>.91)g.fillRect(x,fy-hgt,colW,hgt);g.fillRect(x,fy-hgt*.5,colW,Math.max(1,hgt*.04));g.fillRect(x,fy-hgt,colW,Math.max(1,hgt*.05))}}}
function secretTp(){tpk=.45;const f=[[Math.cos(pa),Math.sin(pa)],[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];let best=null;for(const[a,b]of f){const x=px+a*.9,y=py+b*.9;if(map[y|0]&&map[y|0][x|0]==0){best=[x,y];break}}if(!best)best=[px,py];mon.x=best[0];mon.y=best[1];mon.st='hunt';mon.path=[];NZ(.5,2500,.9);TN(60,.7,.9,'sine',25);TN(1200,.4,.3,'sawtooth',200);shake=1.2}
function face3(cx,cy,s,j,rot){g.save();g.translate(cx,cy);g.rotate(rot);g.scale(s/200,s/200);
g.fillStyle='#050605';g.beginPath();g.moveTo(-102,114);g.quadraticCurveTo(-96,-62,-32,-102);g.quadraticCurveTo(0,-128,32,-102);g.quadraticCurveTo(96,-62,102,114);g.closePath();g.fill();
g.strokeStyle='#181e17';g.lineWidth=2.2;for(let i=0;i<10;i++){g.beginPath();g.moveTo(-92+i*21,-90+hv(i)*30);g.quadraticCurveTo(-95+i*21+hv(i+3)*20,10,-102+i*23,112);g.stroke()}
const gr=g.createRadialGradient(0,-20,5,0,0,92);gr.addColorStop(0,'#ddd9c0');gr.addColorStop(.68,'#85826c');gr.addColorStop(1,'#1e1e15');g.fillStyle=gr;g.beginPath();g.ellipse(0,-10,58,82,0,0,7);g.fill();
g.strokeStyle='rgba(12,14,10,.88)';g.lineWidth=1.5;for(let i=0;i<11;i++){g.beginPath();let a=(hv(i)-.5)*64,b=-86;g.moveTo(a,b);for(let k=0;k<5;k++){a+=(hv(i*5+k)-.5)*20;b+=14+hv(i+k)*14;g.lineTo(a,b)}g.stroke()}
for(const sd of[-1,1]){g.fillStyle='#000';g.beginPath();g.ellipse(sd*24,-24,19,25,sd*.15,0,7);g.fill();const fg=g.createRadialGradient(sd*24,-22,0,sd*24,-22,28);fg.addColorStop(0,'rgba(210,255,190,1)');fg.addColorStop(.4,'rgba(60,235,75,.72)');fg.addColorStop(1,'rgba(0,120,0,0)');g.fillStyle=fg;g.beginPath();g.arc(sd*24,-22,28,0,7);g.fill();g.fillStyle='#fff';g.fillRect(sd*24-2+(Math.random()-.5)*3,-24,4,5.5)}
g.fillStyle='#000';g.beginPath();g.moveTo(-6,6);g.lineTo(6,6);g.lineTo(0,24);g.closePath();g.fill();
const jd=j*68;g.fillStyle='#030000';g.beginPath();g.moveTo(-38,34);g.quadraticCurveTo(0,30+jd*1.15,38,34);g.quadraticCurveTo(0,26,-38,34);g.fill();
g.fillStyle='#dcd7bc';for(let i=-8;i<=8;i++){const x=i*4.3;g.beginPath();g.moveTo(x-1.9,28);g.lineTo(x,28+11+hv(i)*9);g.lineTo(x+1.9,28);g.fill()}
g.fillStyle='#b2af98';g.beginPath();g.moveTo(-40,34+jd*.5);g.quadraticCurveTo(0,60+jd,40,34+jd*.5);g.lineTo(34,26+jd*.5);g.quadraticCurveTo(0,44+jd*.9,-34,26+jd*.5);g.closePath();g.fill();
g.fillStyle='#dcd7bc';for(let i=-7;i<=7;i++){const x=i*4.5,y=30+jd*.5+(1-(x/40)**2)*8;g.beginPath();g.moveTo(x-1.9,y);g.lineTo(x,y-10-hv(i+9)*8);g.lineTo(x+1.9,y);g.fill()}
g.fillStyle='rgba(155,0,0,.94)';for(let i=0;i<8;i++)g.fillRect(-24+i*7+hv(i)*4,34+jd*.4,2.2,24+hv(i+4)*44);g.restore()}
function scare3(t){g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);glt=.36;if(t<.11){cv.style.transform='';return}
let s,j=0;if(t<.36){const u=(t-.11)/.25;s=35+315*u*u*u}else{s=350+(t-.36)*52+(t>1.0?Math.pow((t-1.0)*3.2,3)*85:0);j=Math.min(1.35,(t-.36)/.45)*(.85+.25*Math.abs(Math.sin(t*44)))}
const drag=t>1.15?Math.min(1,(t-1.15)/.7):0,sh=t<.36?0:1,jx=sh?(Math.random()-.5)*30:0,jy=sh?(Math.random()-.5)*22:0;
g.save();g.translate(W/2,H/2+drag*H*1.1);g.rotate(drag*.28);g.translate(-W/2,-H/2);
const fg=g.createRadialGradient(W/2,H*.5,10,W/2,H*.5,W*.65);fg.addColorStop(0,'rgba(45,145,55,.58)');fg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=fg;g.fillRect(0,0,W,H);
if(sh&&Math.random()<0.4){g.globalAlpha=0.35;face3(W/2+jx-11,H*.55+jy,s,j,0);face3(W/2+jx+11,H*.55+jy,s,j,0);g.globalAlpha=1}
face3(W/2+jx,H*.55+jy,s,j,Math.sin(t*48)*.07*sh);
if(t>.85)for(const sd of[-1,1]){const k=Math.min(1,(t-.85)*2.2),bx=W/2+sd*(95-k*22),by=H-k*95;g.strokeStyle='#d6d0b6';g.lineWidth=5.5;g.beginPath();g.moveTo(W/2+sd*120,H+20);g.lineTo(bx,by);g.stroke();g.strokeStyle='rgba(150,0,0,.9)';g.lineWidth=2.4;for(let f=0;f<5;f++){g.beginPath();g.moveTo(bx,by);g.lineTo(bx+(f-2)*7.5,by-28-Math.abs(f-2)*3.5);g.stroke()}}
g.restore();
if(t>1.15)for(let i=0;i<70;i++){g.fillStyle='rgba(55,35,20,'+Math.random()*.75+')';g.fillRect(rnd(W),rnd(H),2+rnd(5),2+rnd(5))}
const vg=g.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.88)');g.fillStyle=vg;g.fillRect(0,0,W,H);
const r=Math.random();if(t>.36&&t<1.9){if(r<.16){g.fillStyle='rgba(110,255,110,.34)';g.fillRect(0,0,W,H)}else if(r<.28){g.fillStyle='rgba(160,0,0,.42)';g.fillRect(0,0,W,H)}}
if(t>1.9){g.fillStyle='#000';g.globalAlpha=Math.min(1,(t-1.9)/.6);g.fillRect(0,0,W,H);g.globalAlpha=1}
for(let i=0;i<140;i++){g.fillStyle='rgba(255,255,255,'+Math.random()*.4+')';g.fillRect(rnd(W),rnd(H),1+rnd(3),1)}
cv.style.transform='translate('+(Math.random()-.5)*46+'px,'+(Math.random()-.5)*46+'px) scale('+(1+Math.random()*.09)+')'}
function showErr(){const old=document.getElementById('err_2z_modal');if(old)disposeAnimatedModal(old);const wrap=document.createElement('div');wrap.id='err_2z_modal';wrap.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px';const m=document.createElement('div');m.style.cssText='background:#111;border:2px solid #a22;border-radius:10px;padding:18px 26px;text-align:center;color:#ddd;font:16px Georgia;min-width:230px;box-shadow:0 0 30px rgba(170,34,34,0.45)';const a=document.createElement('div');a.style.cssText='color:#e55;font-size:20px;margin-bottom:8px';a.textContent='Ошибка 2Z';const b=document.createElement('div');b.textContent='Сложность недоступна';const c=document.createElement('button');c.textContent='Закрыть';c.style.cssText='margin-top:14px;padding:6px 18px;font-size:14px;cursor:pointer';c.onclick=()=>closeAnimatedModal(wrap);wrap.onclick=e=>{if(e.target===wrap)closeAnimatedModal(wrap)};m.append(a,b,c);wrap.appendChild(m);document.body.appendChild(wrap);openAnimatedModal(wrap)}
function launchGameWithLoading(chapterNum = ch) {
  aud();
  if (ac) ac.resume();
  const titles = {
    1: 'ГЛАВА 1 · ЛАБИРИНТ ТЕНИ',
    2: 'ГЛАВА 2 · ЗАБРОШЕННЫЙ ОСОБНЯК',
    3: 'ГЛАВА 3 · ТУМАННОЕ КЛАДБИЩЕ',
    4: 'ГЛАВА 4 · МЁРТВЫЕ ГАРАЖИ'
  };
  const ov = document.getElementById('ov');
  if (ov) hideAnimatedPanel(ov, 'ui-lobby-ov');

  showAtmosphericLoading({
    chapter: chapterNum,
    chapterTitle: titles[chapterNum] || ('ГЛАВА ' + chapterNum),
    duration: 2500,
    ac,
    onComplete: () => {
      ch = chapterNum;
      start();
    }
  });
}

function startSel(){
  const n=selCh||1;
  if(MP.on){try{coop.leaveRoom()}catch(e){}MP.on=false}
  prev=null;
  $('cont').style.display='none';
  if($('lobby_mode_btn'))$('lobby_mode_btn').style.display='none';
  ch=n;
  if(DIFF=='secret'&&n!=3)DIFF='easy';
  launchGameWithLoading(n);
}
function renderDif(){const el=$('dif');if(!el)return;el.textContent='';if(!selCh||(selCh==3&&$('g3').disabled&&!PF.cemeteryUnlocked&&!PF.m2)||(selCh==4&&$('g4')&&$('g4').disabled&&!PF.garagesUnlocked&&!PF.m3&&!PF.w3))return;
const t=document.createElement('div');t.style.cssText='margin:10px 0 4px;color:#c66;letter-spacing:.08em';t.textContent='Сложность · Глава '+selCh;el.appendChild(t);const row=document.createElement('div');
const chOpts=selCh==4?[['easy','Лёгкий (5 дет.)'],['hard','Сложный (8 дет.)'],['extreme','Экстрим (12 дет.)']]:[['easy','Лёгкий'],['hard','Сложный'],['extreme','Экстрим']];
chOpts.concat(selCh==3?[['secret','???']]:[]).forEach(a=>{const k=a[0],b=document.createElement('button');b.textContent=a[1];b.style.cssText='margin:3px;padding:8px 16px;font-size:15px;'+(DIFF==k?'outline:2px solid #e44':'');b.onclick=()=>{if(k=='secret'){if(!errSeen){errSeen=true;showErr();return}DIFF='secret';startSel();return}DIFF=k;renderDif()};row.appendChild(b)});el.appendChild(row);
const go=document.createElement('button');go.className='chapter-btn';go.textContent='▶ НАЧАТЬ';go.style.cssText='margin:8px 3px;padding:8px 22px;background:#600';go.onclick=()=>{if(DIFF=='secret')DIFF='easy';startSel()};el.appendChild(go);trTree(el)}
function selectChapter(n){if(n==3&&$('g3').disabled&&!PF.cemeteryUnlocked&&!PF.m2)return;if(n==4&&$('g4')&&$('g4').disabled&&!PF.garagesUnlocked&&!PF.m3&&!PF.w3)return;if(selCh==n){startSel();return}selCh=n;if(DIFF=='secret'&&n!=3)DIFF='easy';[$('go'),$('g2'),$('g3'),$('g4')].forEach((b,i)=>{if(b)b.style.outline=(i+1==n)?'2px solid #e44':''});renderDif()}
($('chapters_col')||$('g4')||$('g3')).insertAdjacentHTML('afterend',"<div id='dif'></div>");
$('go').onclick=()=>selectChapter(1);
$('g2').onclick=()=>selectChapter(2);
$('g3').onclick=()=>selectChapter(3);
if($('g4'))$('g4').onclick=()=>selectChapter(4);
const ovAch=$('ov_ach_btn');if(ovAch)ovAch.onclick=()=>showAchievementsModal(PF);
const ovQst=$('ov_quest_btn');if(ovQst)ovQst.onclick=()=>showDailyQuestsModal(PF,{pWrite,ac,TN});
const ovStrk=$('ov_streak_btn');if(ovStrk)ovStrk.onclick=()=>showDailyStreakModal({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}});
const ovAv=$('ov_avatar_btn');if(ovAv)ovAv.onclick=openAvatarModal;
const ovShop=$('ov_shop_btn');if(ovShop)ovShop.onclick=openLobbyShopModal;
const coopAvBtn=$('btn_open_avatar_customizer');if(coopAvBtn)coopAvBtn.onclick=openAvatarModal;
function showArtsGalleryModal(){
  const existing=document.getElementById('arts_gallery_modal');
  if(existing)disposeAnimatedModal(existing);
  try{unlockAchievement('art_collector',{PF,pWrite,ac,TN})}catch(e){}
  const d=document.createElement('div');
  d.id='arts_gallery_modal';
  d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Georgia,serif;padding:16px';
  d.innerHTML=`<div style="background:#090406;border:2px solid #8b1e25;border-radius:8px;padding:20px;max-width:680px;width:100%;max-height:92vh;overflow-y:auto;text-align:center;box-shadow:0 0 40px rgba(153,27,27,0.48), inset 0 0 28px rgba(40,6,10,0.5);color:#e7dec8;box-sizing:border-box">
    <div style="font-size:18px;font-weight:bold;color:#e7dec8;letter-spacing:0.10em;margin-bottom:14px">ГАЛЕРЕЯ АРТОВ · БОКС №14</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-bottom:16px;text-align:left">
      <div style="border:1px solid #4a181e;border-radius:6px;overflow:hidden;background:#0e0708;display:flex;flex-direction:column">
        <img src="${doorArtUrl}" alt="Box 14 Door Art" style="width:100%;height:210px;object-fit:cover;display:block" />
        <div style="padding:10px 12px">
          <div style="font-size:12px;font-weight:bold;color:#fca5a5;margin-bottom:4px">БОКС №14 · ДВЕРЬ В КОШМАР</div>
          <div style="font-size:11.5px;color:#b8aa99;font-style:italic;line-height:1.4">«Закрытая стальная дверь гаража №14 под проливным дождём. За ней Механик чинит свои старые капканы.»</div>
        </div>
      </div>
      <div style="border:1px solid #4a181e;border-radius:6px;overflow:hidden;background:#0e0708;display:flex;flex-direction:column">
        <img src="${horrorArtUrl}" alt="Box 14 Concept Art" style="width:100%;height:210px;object-fit:cover;display:block" />
        <div style="padding:10px 12px">
          <div style="font-size:12px;font-weight:bold;color:#fca5a5;margin-bottom:4px">ВАЗ-2112 У БОКСА №14</div>
          <div style="font-size:11.5px;color:#b8aa99;font-style:italic;line-height:1.4">«Бокс №14. За открытыми воротами кладбища ждёт старая "Двенашка" — единственный шанс уехать живым. Главное — не оборачивайся на красный свет в темноте гаражей.»</div>
        </div>
      </div>
    </div>
    <button id="close_arts_modal" style="background:#3b0a10;border:1.5px solid #b91c1c;color:#e7dec8;padding:9px 24px;border-radius:5px;cursor:pointer;font-family:Georgia,serif;font-weight:bold;font-size:13px;letter-spacing:0.08em">ЗАКРЫТЬ ГАЛЕРЕЮ</button>
  </div>`;
  document.body.appendChild(d);
  trTree(d);
  openAnimatedModal(d);
  d.querySelector('#close_arts_modal').onclick=()=>closeAnimatedModal(d);
  d.onclick=e=>{if(e.target===d)closeAnimatedModal(d)};
}
const ovArts=$('ov_arts_btn');
if(ovArts)ovArts.onclick=()=>{
  aud();
  try{TN(330,.12,.22,'sine',520)}catch(e){}
  showArtsGalleryModal();
};
const ovJournal=$('ov_journal_btn');
if(ovJournal)ovJournal.onclick=()=>{
  aud();
  try{TN(420,.1,.18,'triangle',620)}catch(e){}
  showDiscoveryJournalModal(PF,{pWrite,ac,TN});
};
const dRetry=$('dead_btn_retry');
if(dRetry)dRetry.onclick=()=>{
  const dUI=document.getElementById('dead_ui');if(dUI)hideAnimatedPanel(dUI,'ui-dead-panel');
  if(MP.on)respawn();else start();
};
const dLobby=$('dead_btn_lobby');
if(dLobby)dLobby.onclick=()=>{
  const dUI=document.getElementById('dead_ui');if(dUI)hideAnimatedPanel(dUI,'ui-dead-panel');
  toLobby(true);
};
const escNext=$('esc_btn_next');
if(escNext)escNext.onclick=()=>{
  const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');
  if(ch<4){
    ch=ch+1;
    pstat('ch'+ch);
    beginChapter();
  }else{
    if(MP.on)respawn();else start();
  }
};
const escLobby=$('esc_btn_lobby');
if(escLobby)escLobby.onclick=()=>{
  const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');
  toLobby(true);
};
try{
  initLobbyChat({
    playBlip:()=>{try{TN(600,.05,.08)}catch(e){}}
  });
}catch(e){}
updateQuestBadge();
function finishCh4Cutscene(){
  if(state!=='ch4_cutscene')return;
  cv.style.transform='';cv.style.filter='';
  state='win';wT=0;MP.win=Date.now();
  if(MP.on){try{coop.sendPlayerEscaped()}catch(e){}}
}
function startCh4Cutscene(){
  state='ch4_cutscene';
  ch4CsT=0;
  ch4CsEv={};
  pcOpen=false;phoneUI=false;hid=false;
  for(const k in kd)kd[k]=0;
  document.exitPointerLock&&document.exitPointerLock();
  TN(120,.2,.4,'triangle',220);
}
function ch4CutsceneUpd(dt){
  ch4CsT+=dt;
  const t=ch4CsT;
  const ev=ch4CsEv;
  if(!ev.door1&&t>=1.7){ev.door1=1;NZ(.06,520,.35);TN(160,.08,.25,'square',95)}
  if(!ev.lock&&t>=2.4){ev.lock=1;TN(420,.05,.18,'square',290);setTimeout(()=>TN(440,.05,.18,'square',310),120)}
  if(!ev.hit1&&t>=3.7){ev.hit1=1;NZ(.14,340,.85);TN(95,.15,.6,'square',45)}
  if(!ev.hit2&&t>=4.7){ev.hit2=1;NZ(.18,460,.95);TN(85,.18,.75,'sawtooth',40)}
  if(!ev.hit3&&t>=5.5){ev.hit3=1;NZ(.22,640,1.0);TN(70,.22,.85,'square',35)}
  if(!ev.ign&&t>=6.3){ev.ign=1;TN(75,.28,.55,'sawtooth',110);setTimeout(()=>TN(110,.9,.5,'sawtooth',145),240)}
  if(!ev.ram&&t>=8.1){ev.ram=1;NZ(.85,420,1.0);TN(60,.7,.95,'sawtooth',26);try{scream()}catch(e){}}
  if(!ev.boil&&t>=11.9){ev.boil=1;NZ(1.1,2600,.35,0,'highpass');TN(360,.3,.25,'triangle',240)}
  if(!ev.hoodOpen&&t>=13.8){ev.hoodOpen=1;NZ(.2,400,.4);TN(130,.12,.3,'square',85)}
  if(!ev.nivaCrash&&t>=15.7){ev.nivaCrash=1;NZ(.95,380,1.0);TN(55,.8,.9,'sawtooth',24);setTimeout(()=>NZ(.6,700,.45),250)}
  if(!ev.rep1&&t>=18.1){ev.rep1=1;TN(620,.07,.22,'triangle',820);NZ(.05,900,.2)}
  if(!ev.rep2&&t>=19.2){ev.rep2=1;TN(700,.08,.25,'triangle',960);NZ(.05,1100,.2)}
  if(!ev.hoodClose&&t>=20.3){ev.hoodClose=1;NZ(.12,260,.6);TN(85,.12,.5,'square',40)}
  if(!ev.ign2&&t>=21.2){ev.ign2=1;TN(80,.25,.5,'sawtooth',125);setTimeout(()=>TN(115,.8,.4,'sawtooth',145),220)}
  if(!ev.hotel&&t>=25.2){ev.hotel=1;TN(330,.6,.2,'sine',520)}
  if(t>=28.5)finishCh4Cutscene();
}
let _cs3dCache={};
function getCutscene3DCarImg(carSpec,paintHex,angle,headlights=true,pitch=0.20,w=240,h=160){
  const cid=(carSpec&&carSpec.id)||'vaz2112';
  const c=paintHex||(carSpec&&carSpec.defaultColor)||'#6f7882';
  const k=`${cid}|${c}|${angle.toFixed(2)}|${headlights?1:0}|${pitch.toFixed(2)}|${w}x${h}`;
  if(_cs3dCache[k])return _cs3dCache[k];
  const cv3=document.createElement('canvas');
  cv3.width=w;cv3.height=h;
  renderCarShowcase3D(cv3,carSpec,c,angle,1.06,headlights,pitch,{transparent:true,hideLabel:true,groundShadow:true});
  if(Object.keys(_cs3dCache).length>18)_cs3dCache={};
  _cs3dCache[k]=cv3;
  return cv3;
}
function drawCh4CutsceneSideCar(x,y,sc,col,hoodOpen,trunkOpen,carOverride=null,angle=Math.PI*0.92,headlights=true){
  const spec=carOverride||getCarSpec(PF.eqCar||'vaz2112');
  const bt=spec.bodyType||'hatch';
  const isVanS=bt==='van';
  const paint=col||spec.defaultColor||'#6f7882';
  const img3d=getCutscene3DCarImg(spec,paint,angle,headlights,0.20,260,170);
  const w=164*sc,h=107*sc;
  g.save();
  g.translate(x,y);
  // Volumetric headlight beam cone in front (-X) or right (+X if angle near 0)
  if(headlights){
    const dir=Math.cos(angle)>=0?1:-1;
    const bx=dir*62*sc;
    const bg=g.createLinearGradient(bx,-2*sc,bx+dir*115*sc,10*sc);
    bg.addColorStop(0,'rgba(255,244,185,0.34)');
    bg.addColorStop(1,'rgba(255,244,185,0)');
    g.fillStyle=bg;
    g.beginPath();
    g.moveTo(bx,-4*sc);
    g.lineTo(bx+dir*115*sc,-26*sc);
    g.lineTo(bx+dir*115*sc,28*sc);
    g.lineTo(bx,8*sc);
    g.closePath();
    g.fill();
  }
  // Ambient occlusion shadow + tail glow
  g.fillStyle='rgba(0,0,0,0.45)';
  g.beginPath();g.ellipse(0,18*sc,66*sc,8*sc,0,0,7);g.fill();
  g.drawImage(img3d,-w/2,-h*0.56,w,h);
  if(hoodOpen&&!isVanS){
    g.save();
    g.strokeStyle=paint;g.lineWidth=3.5*sc;
    g.beginPath();g.moveTo(-36*sc,-10*sc);g.lineTo(-64*sc,-34*sc);g.stroke();
    g.fillStyle='#1f2937';g.fillRect(-58*sc,-12*sc,18*sc,7*sc);
    g.restore();
  }
  if(trunkOpen){
    g.save();
    g.strokeStyle=paint;g.lineWidth=3.5*sc;
    g.beginPath();g.moveTo(46*sc,-10*sc);g.lineTo(65*sc,-31*sc);g.stroke();
    g.restore();
  }
  g.restore();
}
function drawCh4Cutscene(){
  const t=ch4CsT;
  const spec=getCarSpec(PF.eqCar||'vaz2112');
  const col=(PF.carColors&&PF.carColors[spec.id])||spec.defaultColor||'#6f7882';
  const cl=v=>Math.max(0,Math.min(1,v));
  const lerp=(a,b,u)=>a+(b-a)*cl(u);

  cv.style.transform='';
  if((t>=3.7&&t<=5.9&&Math.sin(t*36)>0.3)||(t>=8.0&&t<=8.6)){
    const amp=t>=8.0?6:3;
    cv.style.transform=`translate(${((Math.random()-.5)*amp).toFixed(1)}px,${((Math.random()-.5)*amp).toFixed(1)}px)`;
  }

  g.globalAlpha=1;
  g.fillStyle='#040508';g.fillRect(0,0,W,H);

  let sub='';
  if(t<3.2){
    // SCENE 1: 3D garage courtyard with orange garage & Box #14, player runs to equipped 3D car & locks doors
    const sky=g.createLinearGradient(0,0,0,122);sky.addColorStop(0,'#04060d');sky.addColorStop(1,'#121824');
    g.fillStyle=sky;g.fillRect(0,0,W,122);
    const road=g.createLinearGradient(0,122,0,H);road.addColorStop(0,'#141820');road.addColorStop(1,'#090b10');
    g.fillStyle=road;g.fillRect(0,122,W,H-122);
    // Perspective 3D garage boxes + bright orange bay
    g.fillStyle='#191e26';g.fillRect(14,42,162,80);
    g.fillStyle='#11151b';g.fillRect(16,42,160,6);
    g.fillStyle='#7c2d12';g.fillRect(24,56,42,66);
    g.fillStyle='#ea580c';g.fillRect(74,56,44,66); // orange garage silhouette
    g.fillStyle='rgba(255,145,60,0.18)';g.beginPath();g.arc(96,120,42,0,7);g.fill();
    g.fillStyle='#3b1214';g.fillRect(126,56,42,66);
    g.fillStyle='#e2e8f0';g.font='bold 7.5px monospace';g.textAlign='center';g.fillText('БОКС №14',147,50);
    // Warm overhead sodium streetlamp cone
    const lg=g.createRadialGradient(195,38,4,195,95,88);
    lg.addColorStop(0,'rgba(255,214,140,0.32)');lg.addColorStop(1,'rgba(255,214,140,0)');
    g.fillStyle=lg;g.fillRect(100,32,190,140);
    drawCh4CutsceneSideCar(270,152,1.16,col,false,false,spec,Math.PI*0.90,t>=2.0);
    if(t<1.75){
      const px0=lerp(72,254,t/1.75);
      const bob=Math.abs(Math.sin(t*14))*3;
      g.fillStyle='rgba(0,0,0,0.45)';g.beginPath();g.ellipse(px0,170,8,3,0,0,7);g.fill();
      g.fillStyle='#1f2937';g.fillRect(px0-5,147-bob,10,22);
      g.fillStyle='#e5c7a6';g.beginPath();g.arc(px0,140-bob,5,0,7);g.fill();
      sub='Ты бежишь к '+spec.name+' под проливным дождём...';
    }else if(t<2.4){
      g.fillStyle='#86efac';g.font='bold 9px monospace';g.textAlign='center';
      g.fillText('ДВЕРИ ЗАКРЫВАЮТСЯ...',268,94);
      sub='Садишься за руль и спешно закрываешь все двери...';
    }else{
      g.fillStyle='#fde047';g.font='bold 9px monospace';g.textAlign='center';
      g.fillText('🔒 *ЩЁЛК!* ВСЕ ДВЕРИ ЗАБЛОКИРОВАНЫ',268,92);
      sub='Замки щёлкнули! Все двери заперты!';
    }
    drawRain4(false,122);
  }else if(t<6.2){
    // SCENE 2: Inside car — Mechanic approaches and bangs on driver glass with lightning & blood crack
    g.fillStyle='#06080d';g.fillRect(0,0,W,H);
    g.fillStyle='#0b1018';g.fillRect(34,26,332,126);
    const app=cl((t-3.2)/0.6);
    const bang=t>3.65?Math.abs(Math.sin((t-3.65)*8))*15:0;
    const ms=lerp(94,154,app)+bang;
    g.save();g.beginPath();g.rect(34,26,332,126);g.clip();
    if(t>3.6&&t<3.9){g.fillStyle='rgba(210,225,255,0.22)';g.fillRect(34,26,332,126);}
    g.drawImage(monImg5,W/2-ms*0.28,154-ms*0.86,ms*0.56,ms);
    if(t>3.7){
      const hitN=t>5.5?3:t>4.7?2:1;
      g.strokeStyle='rgba(220,235,255,0.78)';g.lineWidth=1.2;
      for(let k=0;k<hitN*6;k++){
        const a=(k/(hitN*6))*6.28+0.3;
        g.beginPath();g.moveTo(W/2,88);g.lineTo(W/2+Math.cos(a)*(24+k*7),88+Math.sin(a)*(18+k*5));g.stroke();
      }
      g.fillStyle='rgba(145,10,14,0.45)';g.beginPath();g.arc(W/2+4,92,8+hitN*4,0,7);g.fill();
    }
    g.restore();
    g.save();g.beginPath();g.rect(34,26,332,126);g.clip();
    g.fillStyle='rgba(175,212,244,0.12)';
    g.beginPath();g.moveTo(64,26);g.lineTo(132,26);g.lineTo(96,152);g.lineTo(38,152);g.closePath();g.fill();
    g.fillStyle='rgba(235,246,255,0.16)';
    g.beginPath();g.moveTo(278,26);g.lineTo(312,26);g.lineTo(280,152);g.lineTo(246,152);g.closePath();g.fill();
    g.restore();
    g.strokeStyle='#111419';g.lineWidth=18;g.strokeRect(26,18,348,142);
    const isWoodDash=/vaz2101|vaz2102|vaz2106|vaz2107|volga3110/.test(spec.id);
    const isModernDash=/vaz2110|vaz2111|vaz2112|vaz2114|vaz2115|kalina|priora|granta|largus|niva2123|vesta/.test(spec.id);
    const dGrad=g.createLinearGradient(0,150,0,H);
    dGrad.addColorStop(0,'#171b22');dGrad.addColorStop(1,'#090b0f');
    g.fillStyle=dGrad;g.fillRect(0,152,W,H-152);
    g.fillStyle='#232832';g.fillRect(0,152,W,4);
    g.fillStyle='#14181f';g.beginPath();g.moveTo(64,154);g.lineTo(74,144);g.lineTo(154,144);g.lineTo(164,154);g.closePath();g.fill();
    g.fillStyle=isWoodDash?'#633018':isModernDash?'#3b4250':'#2b303a';
    g.fillRect(168,157,218,16);
    g.fillStyle=isWoodDash?'rgba(42,18,8,0.65)':'rgba(15,18,24,0.45)';
    for(let gy=160;gy<171;gy+=4)g.fillRect(172,gy,210,1.2);
    g.fillStyle='#0d1016';g.fillRect(182,158,34,12);g.fillRect(224,158,34,12);
    for(let vy=160;vy<169;vy+=3){g.fillStyle='#262c38';g.fillRect(184,vy,30,1);g.fillRect(226,vy,30,1);}
    g.fillStyle=spec.id==='vesta'?'rgba(56,168,245,0.65)':spec.id==='granta'?'rgba(235,64,52,0.65)':isModernDash?'rgba(66,188,136,0.58)':'rgba(232,154,62,0.5)';
    g.fillRect(268,158,42,14);
    g.fillStyle='#0b0e14';g.fillRect(76,147,76,24);
    const dialCol=spec.id==='vesta'?'#e0f2fe':spec.id==='granta'?'#fca5a5':isModernDash?'#4ade80':'#fbbf24';
    for(const [dx,ang] of [[96,0.4],[132,-0.6]]){
      g.strokeStyle=isWoodDash?'#cbd5e1':'#64748b';g.lineWidth=1.6;
      g.beginPath();g.arc(dx,159,9,0,7);g.stroke();
      g.strokeStyle=dialCol;g.lineWidth=1.2;
      g.beginPath();g.arc(dx,159,6.5,2.4,6.9);g.stroke();
      g.strokeStyle='#ef4444';g.lineWidth=1.5;
      g.beginPath();g.moveTo(dx,159);g.lineTo(dx+Math.cos(ang)*6.5,159+Math.sin(ang)*6.5);g.stroke();
    }
    g.strokeStyle='#1c2028';g.lineWidth=5;g.beginPath();g.arc(114,186,31,0,7);g.stroke();
    if(isWoodDash){g.strokeStyle='rgba(218,226,236,0.65)';g.lineWidth=1.2;g.beginPath();g.arc(114,186,21,0,7);g.stroke();}
    g.strokeStyle='#2c3340';g.lineWidth=3.5;
    g.beginPath();g.moveTo(85,186);g.lineTo(143,186);g.moveTo(114,186);g.lineTo(114,215);g.stroke();
    g.fillStyle='#1f242e';g.beginPath();g.arc(114,186,9,0,7);g.fill();
    sub='Механик подошёл к машине и изо всех сил бьёт по стеклу!';
  }else if(t<9.8){
    // SCENE 3: Engine starts -> volumetric headlights + ramming closed gates -> knocking down Mechanic!
    const u=cl((t-6.2)/3.6);
    const sky=g.createLinearGradient(0,0,0,104);sky.addColorStop(0,'#04060a');sky.addColorStop(1,'#111824');
    g.fillStyle=sky;g.fillRect(0,0,W,104);
    g.fillStyle='#141922';g.fillRect(0,104,W,H-104);
    // Headlight beam pool on asphalt ahead
    const beamG=g.createLinearGradient(W/2,H,W/2,102);
    beamG.addColorStop(0,'rgba(255,244,185,0.28)');beamG.addColorStop(1,'rgba(255,244,185,0)');
    g.fillStyle=beamG;g.beginPath();g.moveTo(110,H);g.lineTo(290,H);g.lineTo(255,104);g.lineTo(145,104);g.closePath();g.fill();
    const gScale=lerp(0.35,1.45,Math.min(1,u*1.75));
    const impact=t>=8.1;
    const gx=W/2,gy=112+gScale*28;
    const gw=110*gScale,gh=58*gScale;
    if(!impact){
      g.fillStyle='rgba(0,0,0,0.45)';g.fillRect(gx-gw*0.52,gy,gw*1.04,4*gScale);
      g.fillStyle='#7f1d1d';g.fillRect(gx-gw/2,gy-gh,gw,gh);
      g.strokeStyle='#1f2937';g.lineWidth=2;g.strokeRect(gx-gw/2,gy-gh,gw,gh);
      g.beginPath();g.moveTo(gx,gy-gh);g.lineTo(gx,gy);g.stroke();
      g.fillStyle='#fbbf24';g.font=`bold ${Math.max(7,7*gScale)|0}px monospace`;g.textAlign='center';
      g.fillText('ВЫЕЗД ЗАКРЫТ',gx,gy-gh*0.5);
      if(t>=7.15){
        const mh=gh*0.92;
        g.drawImage(monImg5,gx-mh*0.26,gy-mh,mh*0.52,mh);
      }
      sub=t<7.15?'Ты заводишь мотор и жмёшь газ прямо в закрытые ворота!':'ПЕРЕД КАПОТОМ ВЫСКАКИВАЕТ МЕХАНИК!';
    }else{
      const blast=cl((t-8.1)/1.5);
      g.save();g.translate(gx-gw*0.35-blast*85,gy-gh*0.5-blast*18);g.rotate(-blast*1.3);
      g.fillStyle='#7f1d1d';g.fillRect(-gw*0.25,-gh*0.5,gw*0.5,gh);g.restore();
      g.save();g.translate(gx+gw*0.35+blast*85,gy-gh*0.5-blast*14);g.rotate(blast*1.2);
      g.fillStyle='#7f1d1d';g.fillRect(-gw*0.25,-gh*0.5,gw*0.5,gh);g.restore();
      g.save();g.translate(gx+blast*52,gy-25+blast*38);g.rotate(blast*2.4);
      g.globalAlpha=Math.max(0,1-blast*0.8);
      g.drawImage(monImg5,-24,-45,48,90);
      g.restore();g.globalAlpha=1;
      for(let i=0;i<18;i++){
        g.fillStyle='#fde047';
        g.fillRect(gx+Math.sin(i*19+t*20)*(25+blast*90),gy-16+Math.cos(i*13)*(12+blast*35),3,3);
      }
      sub='БАМ! Машина сбивает Механика вместе с воротами напролом!';
    }
    g.fillStyle=col;
    g.beginPath();g.moveTo(55,H);g.lineTo(108,162);g.lineTo(292,162);g.lineTo(345,H);g.closePath();g.fill();
    g.fillStyle='rgba(0,0,0,0.28)';g.fillRect(108,162,184,4);
  }else if(t<13.0){
    // SCENE 4: Dirt road -> 1 hour -> smooth highway, 3D car engine overheats (boils)!
    const onHighway=t>=11.4;
    g.fillStyle=onHighway?'#060b14':'#090b07';g.fillRect(0,0,W,110);
    g.fillStyle=onHighway?'#1a202a':'#342416';g.fillRect(0,110,W,H-110);
    for(let i=0;i<8;i++){
      const rx=((i*60-(t*150)%60)+W)%W;
      g.fillStyle=onHighway?'#e2e8f0':'#23170c';
      g.fillRect(rx,onHighway?170:155+(i%3)*14,onHighway?26:18,onHighway?3:4);
    }
    const jitter=onHighway?0:Math.sin(t*28)*2.5;
    drawCh4CutsceneSideCar(188,150+jitter,1.08,col,false,false,spec,Math.PI*0.92,true);
    if(onHighway){
      for(let i=0;i<10;i++){
        const p=((t*1.9+i*0.13)%1);
        g.fillStyle=`rgba(230,240,255,${(1-p)*0.55})`;
        g.beginPath();g.arc(114-p*14,132-p*48,4+p*12,0,7);g.fill();
      }
      g.fillStyle='rgba(153,27,27,0.92)';g.fillRect(18,16,138,20);
      g.strokeStyle='#dc2626';g.strokeRect(18,16,138,20);
      g.fillStyle='#fef2f2';g.font='bold 9px monospace';g.textAlign='left';
      g.fillText('🌡 ДВИГАТЕЛЬ КИПИТ! 130°C',24,29);
      sub='Спустя 1 час ты выехал на ровную дорогу, но мотор закипел!';
    }else{
      sub='Машина мчит по ухабистой грунтовой дороге прочь от гаражей...';
    }
    if(t>=10.6&&t<=11.7){
      g.fillStyle='rgba(0,0,0,0.78)';g.fillRect(W/2-115,24,230,24);
      g.fillStyle='#fde68a';g.font='bold 10px Georgia';g.textAlign='center';
      g.fillText('Спустя 1 час пути по грунтовке...',W/2,39);
    }
  }else if(t<17.4){
    // SCENE 5: 3D parked car + speeding green 3D Niva 4x4 crashes into roadside tree & burns!
    g.fillStyle='#060a14';g.fillRect(0,0,W,105);
    g.fillStyle='#19212c';g.fillRect(0,105,W,46);
    g.fillStyle='#241e18';g.fillRect(0,151,W,H-151);
    g.fillStyle='rgba(226,232,240,0.45)';
    for(let x=15;x<W;x+=48)g.fillRect(x,126,24,2);
    // Roadside 3D-shaded oak tree + shadow
    g.fillStyle='rgba(0,0,0,0.4)';g.beginPath();g.ellipse(332,112,18,5,0,0,7);g.fill();
    g.fillStyle='#3b2414';g.fillRect(326,64,12,48);
    g.fillStyle='#0f2916';g.beginPath();g.arc(332,56,22,0,7);g.fill();
    g.fillStyle='#1b4326';g.beginPath();g.arc(328,50,15,0,7);g.fill();

    // Speeding 3D Green Niva ('niva2121') skids and crashes into tree at t=15.7s!
    if(t>=14.6){
      const cu=cl((t-14.6)/1.1);
      const nx=lerp(24,306,cu);
      const ny=lerp(122,102,cu*cu);
      const nivaSpec=getCarSpec('niva2121');
      const niva3d=getCutscene3DCarImg(nivaSpec,'#15803d',-0.36,t<15.85,0.18,160,110);
      g.save();g.translate(nx,ny);g.rotate(t>=15.7?0.26:Math.sin(t*24)*0.11);
      if(t<15.75){
        const nbG=g.createLinearGradient(24,0,84,0);
        nbG.addColorStop(0,'rgba(255,245,180,0.38)');nbG.addColorStop(1,'rgba(255,245,180,0)');
        g.fillStyle=nbG;g.beginPath();g.moveTo(22,-4);g.lineTo(82,-18);g.lineTo(82,16);g.lineTo(22,6);g.closePath();g.fill();
      }
      g.drawImage(niva3d,-34,-26,68,46);
      g.restore();
      if(t>=15.7){
        const fireGlow=g.createRadialGradient(308,92,4,308,92,52);
        fireGlow.addColorStop(0,'rgba(251,146,60,0.55)');fireGlow.addColorStop(1,'rgba(0,0,0,0)');
        g.fillStyle=fireGlow;g.beginPath();g.arc(308,92,52,0,7);g.fill();
        for(let f=0;f<10;f++){
          const fx=308+Math.sin(t*14+f)*10;
          const fy=96-Math.abs(Math.cos(t*11+f))*28;
          g.fillStyle=f%2?'rgba(249,115,22,0.88)':'rgba(250,204,21,0.82)';
          g.beginPath();g.arc(fx,fy,5+(f%3)*3,0,7);g.fill();
        }
      }
    }

    const hoodO=t>=13.8;
    const trunkO=t>=14.9;
    drawCh4CutsceneSideCar(168,162,1.12,col,hoodO,trunkO,spec,Math.PI*0.92,false);
    if(hoodO){
      for(let i=0;i<9;i++){
        const p=((t*1.7+i*0.14)%1);
        g.fillStyle=`rgba(190,198,210,${(1-p)*0.55})`;
        g.beginPath();g.arc(105-p*8,144-p*44,5+p*11,0,7);g.fill();
      }
    }
    let plX=162;
    if(t<14.2)plX=lerp(162,92,(t-13.2)/0.8);
    else plX=lerp(92,252,(t-14.2)/1.1);
    g.fillStyle='#1f2937';g.fillRect(plX-5,156,10,22);
    g.fillStyle='#e5c7a6';g.beginPath();g.arc(plX,150,5,0,7);g.fill();
    if(t>=16.7){g.fillStyle='#b91c1c';g.fillRect(plX+4,166,8,6)}

    if(t<14.3)sub='Останавливаешься на обочине и открываешь капот — из мотора валит дым...';
    else if(t<15.7)sub='Идёшь к багажнику за инструментами. На трассе на огромной скорости несётся «Нива»!';
    else sub='«Нива» теряет управление, врезается в дерево и вспыхивает! Ты спокойно берёшь инструменты.';
  }else if(t<22.0){
    // SCENE 6: Walk to motor, repair 3D car engine, close hood, restart & drive
    g.fillStyle='#060a14';g.fillRect(0,0,W,105);
    g.fillStyle='#19212c';g.fillRect(0,105,W,46);
    g.fillStyle='#241e18';g.fillRect(0,151,W,H-151);
    const repaired=t>=19.9;
    const hoodClosed=t>=20.3;
    const carDrive=t>=21.2?Math.pow((t-21.2)/0.8,2)*120:0;
    drawCh4CutsceneSideCar(168-carDrive,162,1.12,col,!hoodClosed,false,spec,Math.PI*0.92,t>=21.2);
    if(!repaired){
      if(t>=18.0&&Math.sin(t*30)>0){
        for(let s=0;s<6;s++){
          g.fillStyle='#fde047';
          g.fillRect(98+Math.sin(s*9+t*25)*12,146+Math.cos(s*7+t*20)*10,2.5,2.5);
        }
      }
    }
    if(t<20.9){
      const plX=t<18.0?lerp(252,92,(t-17.4)/0.6):t<20.3?92:lerp(92,162,(t-20.3)/0.55);
      g.fillStyle='#1f2937';g.fillRect(plX-5,156,10,22);
      g.fillStyle='#e5c7a6';g.beginPath();g.arc(plX,150,5,0,7);g.fill();
    }
    if(t<19.9)sub='Чинишь перегретый двигатель инструментами...';
    else if(t<20.8)sub='Мотор починен! Закрываешь капот и возвращаешься в салон.';
    else sub='Закрываешь двери, заводишь машину и снова выезжаешь на трассу!';
  }else{
    // SCENE 7: 3D rear-view of equipped escaped car receding toward glowing Hotel
    const p=cl((t-22.0)/6.5);
    const sky=g.createLinearGradient(0,0,0,108);sky.addColorStop(0,'#03050d');sky.addColorStop(1,'#10182b');
    g.fillStyle=sky;g.fillRect(0,0,W,108);
    g.fillStyle='#070a10';g.fillRect(0,108,W,H-108);
    g.fillStyle='#191f2a';
    g.beginPath();g.moveTo(W/2-14,108);g.lineTo(W/2+14,108);g.lineTo(W+20,H);g.lineTo(-20,H);g.closePath();g.fill();
    const sc=(t*2.6)%1;
    for(let i=0;i<8;i++){
      const u0=(i+sc)/8,y0=108+u0*u0*(H-108);
      g.fillStyle='rgba(255,255,255,0.45)';g.fillRect(W/2-1,y0,2,4+u0*6);
    }
    const hs=lerp(0.55,1.45,p);
    const hx0=W/2-28*hs,hy0=108-34*hs;
    g.fillStyle='rgba(251,191,36,0.22)';g.beginPath();g.arc(W/2,hy0+16*hs,44*hs,0,7);g.fill();
    g.fillStyle='#1b222e';g.fillRect(hx0,hy0,56*hs,34*hs);
    g.fillStyle='#fef08a';
    for(let wy=0;wy<2;wy++)for(let wx=0;wx<4;wx++)g.fillRect(hx0+(6+wx*12)*hs,hy0+(12+wy*9)*hs,6*hs,5*hs);
    g.fillStyle='#b91c1c';g.fillRect(W/2-18*hs,hy0-10*hs,36*hs,9*hs);
    g.fillStyle='#fff';g.font=`bold ${Math.max(6,7*hs)|0}px monospace`;g.textAlign='center';
    g.fillText('ОТЕЛЬ',W/2,hy0-3*hs);

    const cs=lerp(0.95,0.26,p);
    const cy=lerp(174,118,p);
    const rear3d=getCutscene3DCarImg(spec,col,Math.PI*0.5,true,0.20,240,160);
    g.save();g.translate(W/2,cy);g.scale(cs,cs);
    const tg=g.createRadialGradient(0,20,2,0,22,42);
    tg.addColorStop(0,'rgba(255,35,45,0.34)');tg.addColorStop(1,'rgba(255,0,0,0)');
    g.fillStyle=tg;g.fillRect(-46,10,92,22);
    g.drawImage(rear3d,-66,-48,132,88);
    g.restore();

    if(t<24.5){
      g.fillStyle='rgba(0,0,0,0.78)';g.fillRect(W/2-110,18,220,22);
      g.fillStyle='#fde68a';g.font='bold 10px Georgia';g.textAlign='center';
      g.fillText('Прошло 3 часа дороги...',W/2,32);
    }
    sub='Спустя 3 часа вдали показался тёплый свет отеля... Ты едешь туда. Глава 4 завершена!';
  }

  // Cinematic letterbox bars & subtitles
  g.fillStyle='#000';g.fillRect(0,0,W,16);g.fillRect(0,H-24,W,24);
  if(sub){
    g.font='italic 9.5px Georgia';g.textAlign='center';g.textBaseline='middle';
    g.fillStyle='#e7dec8';g.fillText(sub,W/2,H-12);
  }
  if(t>2.0){
    g.font='8px monospace';g.textAlign='right';g.fillStyle='rgba(255,255,255,0.55)';
    g.fillText('[Space / Клик] Пропустить ▶',W-8,9);
  }
  g.textAlign='left';
}
let last=0;function loop(t){requestAnimationFrame(loop);const shopOpen=state==='menu'&&!!document.getElementById('lobby_shop_modal');if(!shopOpen)syncCanvasScale();const dt=Math.min(.05,(t-last)/1000||0);last=t;if(!shopOpen)lbTick(t);musTick();if(!shopOpen){try{updateLobbyChatVisibility(state==='menu');}catch(e){}}{const sh=(state=='play'||state=='intro')?'block':'none';if(sh!=lbS){lbS=sh;document.getElementById('lb').style.display=sh;const imb=document.getElementById('ingame_mode_btn');if(imb)imb.style.display=sh;if(sh=='block')updateModeButtons()}const tcE=document.getElementById('tc');if(tcE){const v=state=='play'&&!pcOpen&&!modeModalOpen&&isTouchDevice()?'block':'none';if(tcE.style.display!=v){tcE.style.display=v;if(v=='none')kd.KeyW=kd.KeyS=kd.KeyA=kd.KeyD=kd.ShiftLeft=kd.ShiftRight=kd.KeyC=0}}}
if(state=='play'){updateMobileActionBtn();PF.sec+=dt;pSave(dt);survXpTimer+=dt;if(survXpTimer>=30){survXpTimer=0;try{addXP(25,'Выживание (30 сек)',{PF,pWrite,ac,TN})}catch(e){}}try{trackDailyQuest('survive',dt,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})});if(moving&&crouch)trackDailyQuest('stealth',dt,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}upd(dt);if(state=='play'){render();post();camFx();hud()}}else if(state=='dead'){if(MP.on)mpTick(dt);deadScr(dt);camFx()}else if(state=='win'){winScr(dt);camFx()}else if(state=='intro'){introScr(dt);camFx()}else if(state=='chap'){chapScr(dt);camFx()}else if(state=='cs2'){csUpd(dt);if(state=='cs2'){render();post();camFx();csHud()}}else if(state=='ch4_cutscene'){ch4CutsceneUpd(dt);if(state=='ch4_cutscene'){drawCh4Cutscene();camFx()}}}
requestAnimationFrame(loop);
// ---------- INPUT ----------
function start(){const dUI=document.getElementById('dead_ui');if(dUI)hideAnimatedPanel(dUI,'ui-dead-panel');const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');if($('lobby_mode_btn'))$('lobby_mode_btn').style.display='none';DFM=DIFFS[DIFF]||DIFFS.easy;aud();ac.resume();if(muffleFilter&&ac)muffleFilter.frequency.setTargetAtTime(18500,ac.currentTime,0.05);try{lobbyMusic.updateState('play');}catch(e){}mobFs();pstat('games');try{trackDailyQuest('games',1,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}if(ch>=2){seen=1;beginChapter()}else if(seen){gen();state='play'}else{seen=1;state='intro';iT=0;genDone=false;ev={};lastStep=lastStepF=lastRain=0}hideAnimatedPanel(document.getElementById('ov'),'ui-lobby-ov');cv.style.filter='';cv.style.transform='';try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
let prev=null,lbS='';
function toLobby(force){if(state!='play'&&state!='intro'&&state!='dead'&&state!='ch4_cutscene'&&!force)return;const wasActive=(state==='play'||state==='intro'||state==='dead');const dUI=document.getElementById('dead_ui');if(dUI)hideAnimatedPanel(dUI,'ui-dead-panel');const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');prev=wasActive?state:null;state='menu';pcOpen=false;phoneUI=false;closeMonsterModeModal(false);pWrite();for(const k in kd)kd[k]=0;const mobExit=document.getElementById('mob_pc_close');if(mobExit)mobExit.style.display='none';document.exitPointerLock&&document.exitPointerLock();if(ac){ac.resume();if(muffleFilter)muffleFilter.frequency.setTargetAtTime(18500,ac.currentTime,0.05);try{duocaraRadio.update({active:false,ac,dest:musGain||mst,tm});lobbyMusic.updateState('menu');}catch(e){}}cv.style.transform='';cv.style.filter='';showAnimatedPanel(document.getElementById('ov'),'flex','ui-lobby-ov');document.getElementById('cont').style.display=prev?'inline-block':'none';if($('lobby_mode_btn')){$('lobby_mode_btn').style.display=prev?'inline-block':'none';updateModeButtons();}updG3();updG4();updateCoopStylePreview();if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}}),{PF,pWrite,ac,TN});}
function resume(){if(state!='menu'||!prev)return;state=prev;prev=null;closeMonsterModeModal(false);const eUI=document.getElementById('escape_ui');if(eUI)hideAnimatedPanel(eUI,'ui-modal-backdrop');if($('lobby_mode_btn'))$('lobby_mode_btn').style.display='none';ac&&ac.resume();try{lobbyMusic.updateState('play');}catch(e){}hideAnimatedPanel(document.getElementById('ov'),'ui-lobby-ov');try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}}
document.getElementById('cont').onclick=resume;
document.getElementById('mp').onclick=createCoopRoom;
document.getElementById('lb').onclick=toLobby;
if($('ingame_mode_btn'))$('ingame_mode_btn').onclick=openMonsterModeModal;
if($('lobby_mode_btn'))$('lobby_mode_btn').onclick=openMonsterModeModal;
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&state=='play'&&!pcOpen&&!modeModalOpen&&!photoModalOpen&&!isTouchDevice())toLobby()});
addEventListener('keydown',e=>{if(e.target.tagName=='INPUT'||e.target.tagName=='TEXTAREA')return;if(photoModalOpen){if(e.code=='Escape'||e.code=='KeyE'){const pm=document.getElementById('mansion_photo_modal');if(pm){const cl=pm.querySelector('#mp_close');if(cl)cl.click();else{closeAnimatedModal(pm);photoModalOpen=false}}else photoModalOpen=false;e.preventDefault();return}if(e.code=='ArrowLeft'||e.code=='ArrowRight'){const curBtn=document.querySelector('#mansion_photo_modal .mp_sw[style*="92400e"]');const curI=curBtn?Number(curBtn.getAttribute('data-idx')):0;openMansionPhotoModal((curI+(e.code=='ArrowRight'?1:2))%3);e.preventDefault();return}return}if(e.code=='Escape'&&modeModalOpen){closeMonsterModeModal(true);e.preventDefault();return}if(e.code=='KeyM'&&(state=='play'||(state=='menu'&&prev))){if(modeModalOpen)closeMonsterModeModal(true);else openMonsterModeModal();e.preventDefault();return}if(modeModalOpen)return;kd[e.code]=1;if(e.code=='KeyT'){if(state=='menu'&&prev)resume();else toLobby();return}if(pcOpen){pcKey(e.code);e.preventDefault();return}if(phoneUI&&phoneKey(e.code)){e.preventDefault();return}if(state=='ch4_cutscene'){if(ch4CsT>2&&(e.code=='Space'||e.code=='Enter'||e.code=='Escape'))finishCh4Cutscene();e.preventDefault();return}if(state=='chap'&&cT>1.5){endChap();return}if(state=='intro'&&iT>1){endIntro();return}if(state!='play')return;
if(e.code=='KeyF'){togglePhone()}if(e.code=='Space'){jump()}if(e.code=='KeyG'){placeHunterTrap()}
if(e.code=='KeyE'){const eqCarName=getCarSpec(PF.eqCar||'vaz2112').name;if(hid){if(lkT>0)return;mon.lk=null;hid=false;px=hx;py=hy;NZ(.3,500,.2);TN(150,.4,.15,'sawtooth',110);emitSuddenNoise(px,py,0.82,'шкаф')}
else if(nearRadio){RADIO_SPOT.on=!RADIO_SPOT.on;TN(RADIO_SPOT.on?620:320,.08,.18,'square');say(RADIO_SPOT.on?'Радио включено: Piggy — Duocara':'Радио выключено.',3)}
else if(nearVaz){
  if(ch==4){
    if(partsCarried>0){
      const nAdd=partsCarried;partsInstalled+=partsCarried;partsCarried=0;lastProgressT=tm;ghostHint=null;
      TN(680,.15,.25,'triangle',960);NZ(.15,800,.3);
      try{addXP(30*nAdd,'Установка детали на '+eqCarName,{PF,pWrite,ac,TN})}catch(e){}
      if(partsInstalled>=NK()){
        say('Все детали установлены на '+eqCarName+'! Садись за руль [E] и уезжай!',6);
        scream();
      }else{
        say('Детали установлены ('+partsInstalled+'/'+NK()+')! Найди остальные.',4);
      }
    }else if(partsInstalled>=NK()){
      startCh4Cutscene();
    }else{
      say('Не хватает деталей ('+partsInstalled+'/'+NK()+'). Обыщи гаражи!',3);
    }
  }else{
    TN(90,.25,.8,'sawtooth',60);
    TN(160,1.2,.9,'sawtooth',80);
    NZ(2.2,550,.85);
    say('Двигатель взревел! Ты жмёшь на газ и вырываешься с кладбища!',5);
    state='win';wT=0;MP.win=Date.now();
    if(MP.on){try{coop.sendPlayerEscaped()}catch(e){}}
  }
}
else if(nearE&&ch==3&&keys>=NK()){
  cemeteryGateOpened=true;
  nearE=false;
  lastProgressT=tm;
  ghostHint=null;
  if(map[N-1]) map[N-1][12]=0;
  NZ(.9,400,.9);
  TN(80,.6,.9,'sawtooth',35);
  shake=.35;
  say('Ворота открыты со скрежетом! Беги к машине '+eqCarName+' и садись в неё!',6);
}
else if(nearSp&&cage.on&&!srchT){startSearch(nearSp)}else if(nearMazeNote){nearMazeNote.on=0;lastProgressT=tm;ghostHint=null;discoverMazeNote(nearMazeNote.noteIdx,PF,pWrite,{ac,TN});try{addXP(25,'Найдена страшная записка',{PF,pWrite,ac,TN})}catch(e){}try{unlockAchievement('secret_finder',{PF,pWrite,ac,TN})}catch(e){}say('Найдена страшная записка — текст добавлен в Журнал находок!',5)}else if(nearPhoto){openMansionPhotoModal(nearPhoto.idx)}else if(nearPC){openPC(nearPC)}else if(nearPaper){say('На листке от руки: «Пароль от терминала: 3.10.2026»',9);TN(520,.1,.1);try{unlockAchievement('secret_finder',{PF,pWrite,ac,TN})}catch(e){}}else if(nearUsb){takeUsb()}else if(nearPap){say(nearPap.t,9);TN(520,.1,.1);try{unlockAchievement('secret_finder',{PF,pWrite,ac,TN})}catch(e){}}else if(nearSt){useStairs()}else if(nearD){toggleDoor(nearD)}else if(nearL){try{trackDailyQuest('hide',1,{PF,pWrite,ac,TN,showModal:()=>showDailyQuestsModal(PF,{pWrite,ac,TN})})}catch(e){}const spot=mon.st=='hunt'&&los(mon.x,mon.y,px,py)&&Math.hypot(mon.x-px,mon.y-py)<16;hid=true;hidSofa=!!nearL.sofa;hidBed=!!nearL.bed;phoneUI=false;hx=px;hy=py;if(spot){mon.lk={t:0};mon.tx=hx|0;mon.ty=hy|0;mon.lost=0;MP.al=[hx|0,hy|0,Date.now(),1];try{unlockAchievement('closet_survivor',{PF,pWrite,ac,TN});if(ch==2&&!hidSofa&&!hidBed)unlockAchievement('wardrobe_ghost',{PF,pWrite,ac,TN})}catch(e){}}lx=nearL.x;ly=nearL.y;px=lx;py=ly;pa=Math.atan2(hy-ly,hx-lx);ha=pa;flash=false;TN(180,.5,.2,'sawtooth',120);emitSuddenNoise(hx,hy,0.82,'шкаф');say('Фонарь погас. Не дыши.',3)}
else if(nearE&&keys>=NK()){if(ch==2&&stg=='base')startMain();else{state='win';wT=0;MP.win=Date.now();if(MP.on){try{coop.sendPlayerEscaped()}catch(e){}}TN(300,2,.3,'triangle',600)}}else if(nearE)say(ch==3?'Ворота заперты. Нужно 3 ключа.':ch==2&&stg=='base'?'Нужна отмычка, чтобы вскрыть дверь.':'Дверь заперта. Нужно 3 ключа.',2)}
if(e.code.startsWith('Arrow')||e.code=='Space')e.preventDefault()});
addEventListener('keyup',e=>kd[e.code]=0);
addEventListener('mousemove',e=>{if(state=='play'&&(document.pointerLockElement==cv||e.buttons||NOLOCK)&&!pcOpen&&!modeModalOpen){pa+=Math.max(-150,Math.min(150,e.movementX))*.0025*SET.sens*(SET.inv?-1:1);PIT=Math.max(-80,Math.min(80,PIT-Math.max(-150,Math.min(150,e.movementY))*.4*SET.sens))}});
cv.addEventListener('click',e=>{
  if(modeModalOpen)return;
  if(phoneUI){
    const r=cv.getBoundingClientRect(), s=Math.min(r.width/W, r.height/H);
    const cx=(e.clientX-r.left-(r.width-W*s)/2)/s, cy=(e.clientY-r.top-(r.height-H*s)/2)/s;
    const px0=W-122, py0=H-206, pw=112, ph=196;
    if(cx>=px0&&cx<=px0+pw&&cy>=py0&&cy<=py0+ph){
      const sx=px0+9, sy=py0+26, sw=pw-18, sh=ph-72;
      if(Math.hypot(cx-(px0+pw/2), cy-(py0+ph-20)) <= 12){
        if(phApp!='home') phApp='home'; else phoneUI=false;
        TN(660,.08,.1); return;
      }
      if(phApp=='home'){
        const A=[['Фонарик',flash?'#ffd54a':'#555'],['Стиль','#8b1e25'],['Закрыть','#c44']];
        if(PF.radar) A.push(['Радар','#2a9a55']);
        for(let i=0;i<A.length;i++){
          const bx=sx+8+(i%2)*46, by=sy+18+Math.floor(i/2)*44;
          if(cx>=bx&&cx<=bx+34&&cy>=by&&cy<=by+30){
            phoneKey('Digit'+(i+1));
            return;
          }
        }
      }
      return;
    }
  }
  if(pcOpen){pcClick(e);return}
  if(state=='ch4_cutscene'){if(ch4CsT>2)finishCh4Cutscene();return}
  if(state=='chap'&&cT>1.5){endChap();return}
  if(state=='intro'&&iT>1){endIntro();return}
  if(state=='play')try{if(!isTouchDevice())cv.requestPointerLock()}catch(e){}
  else if(state=='dead'&&deadT>(ch>=2?2.7:2))(MP.on?respawn():start())
});

  updG3();
  updG4();
  renderSocialBar();
  autoLogin();
  if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}}),{PF,pWrite,ac,TN});
  checkAndNotifyDailyStreak({PF,pWrite,ac,TN,onUpdate:()=>{pWrite();if($('lobby_xp_panel'))renderXPBarInLobby($('lobby_xp_panel'),PF,()=>showPhoneCustomizerModal({PF,pWrite,ac,TN}),{PF,pWrite,ac,TN})}});
  updateCoopStylePreview();

  const ensureLobbyAudio = () => {
    aud();
    if(ac && ac.state === 'suspended') {
      ac.resume().then(() => {
        try{lobbyMusic.updateState(state);}catch(e){}
      }).catch(()=>{});
    } else if(ac) {
      try{lobbyMusic.updateState(state);}catch(e){}
    }
  };
  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach(ev => window.addEventListener(ev, ensureLobbyAudio, { passive: true }));
}
