const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.argv[2]||require('node:path').resolve(__dirname, '..');
const source=fs.readFileSync(root+'/script.js','utf8');
function setup(withAudio=false){
 let now=10000,id=0;const frames=new Map(),sounds=[];
 class El {
  constructor(){this.style={};this.attrs={};this.dataset={};this.children=[];this.events={};const classes=new Set();this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,v)=>{v=v??!classes.has(x);v?classes.add(x):classes.delete(x);return v}};this.nodes={};this.offsetHeight=5400;}
  querySelector(s){return this.nodes[s]??=new El()}
  querySelectorAll(s){return s==='.story-staff span'?(this.lines??=Array.from({length:5},()=>new El())):[]}
  setAttribute(k,v){this.attrs[k]=v} addEventListener(k,f){this.events[k]=f} removeEventListener(k){delete this.events[k]} appendChild(x){this.children.push(x)}
  getBoundingClientRect(){return {top:-context.window.scrollY,height:900}}
 }
 const els={};const get=k=>els[k]??=new El();
 const texts=Array.from(fs.readFileSync(root+'/index.html','utf8').matchAll(/data-i18n="([^"]+)"/g),m=>{const e=new El();e.dataset.i18n=m[1];return e});
 const languages=['en','it','tr'].map(lang=>{const e=new El();e.dataset.lang=lang;return e});
 const nav=['about','concerts','lessons','recordings','contact'].map(section=>{const e=new El();e.dataset.section=section;return e});
 const doc={getElementById:get,querySelector:get,querySelectorAll:s=>s==='[data-i18n]'?texts:s==='.lang'?languages:s==='.nav-link'||s==='[data-section]'?nav:[],createElement:()=>new El(),body:{},documentElement:{},addEventListener(){},removeEventListener(){},hidden:false};
 class AudioContextAdapter {
  constructor(){this.currentTime=0;this.destination={}}
  resume(){return Promise.resolve()} suspend(){return Promise.resolve()} close(){return Promise.resolve()}
  decodeAudioData(){return Promise.resolve({})}
  createGain(){const gain={value:.75,cancelScheduledValues(){},setValueAtTime(v){this.value=v},linearRampToValueAtTime(){}};return {gain,connect(){},disconnect(){}}}
  createBufferSource(){const voice={paused:false,connect(){},disconnect(){},start(){sounds.push(voice)},stop(){voice.paused=true}};return voice}
 }
 const context={fetch:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}),document:doc,window:{AudioContext:AudioContextAdapter,scrollY:0,innerHeight:900,PIANO_STORY_AUDIO:withAudio?{listening:'assets/audio/listening.mp3',breath:'assets/audio/breath.mp3'}:{},addEventListener(){},removeEventListener(){},scrollTo({top}){this.scrollY=top}},history:{replaceState(){}},location:{hash:''},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),performance:{now:()=>now},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:f=>{frames.set(++id,f);return id},cancelAnimationFrame:i=>frames.delete(i),Audio:class{constructor(src){this.src=src;this.paused=false;sounds.push(this)}play(){return Promise.resolve()}pause(){this.paused=true}}};
 vm.createContext(context);vm.runInContext(source,context);
 const run=code=>vm.runInContext(code,context);
 const progress=p=>{context.window.scrollY=p*4500;run('renderStory()')};
 const frame=()=>{now+=400;const pending=[...frames.values()];frames.clear();pending.forEach(f=>f(now))};
 return {ready:()=>new Promise(resolve=>setImmediate(resolve)),run,progress,context,els,get,texts,sounds,frame,advance:ms=>now+=ms};
}
async function main(){
let s=setup();s.progress(0);assert.equal(s.run('soundEnabled'),false);assert.equal(s.sounds.length,0);assert.equal(s.get('soundToggle').hidden,true);
for(let i=0;i<=1000;i++){s.progress(i/1000);assert.ok(s.run('Object.values(movementEls).filter(e=>e.style.visibility === "visible").length')<=1,'Only one movement visible');}
for(const p of [.18,.31,.45,.59,.74,.86,.96]){s.progress(p);const a=s.run('JSON.stringify(Object.values(movementEls).map(e=>e.style))');s.progress(.99);s.progress(p);assert.equal(s.run('JSON.stringify(Object.values(movementEls).map(e=>e.style))'),a,'Reverse scroll must reproduce the same state');}
s.progress(1);assert.equal(s.run('Object.values(movementEls).filter(e=>e.style.visibility === "visible").length'),0);
for(const lang of ['en','it','tr']){s.run(`currentLang='${lang}';translateStatic()`);assert.equal(s.context.document.documentElement.lang,lang);assert.ok(s.texts.filter(x=>x.dataset.i18n.startsWith('story.')).every(x=>x.innerHTML),'All movement translations present');assert.ok(s.get('soundToggle').attrs['aria-label']);}
s.run('prefersReducedMotion=true;smoothVelocity=1');s.progress(.59);assert.equal(s.run('movementEls.rubato.style.transform'),'translate3d(0.00px, 0.00px, 0)');s.progress(.86);assert.equal(s.run('movementEls.resonance.querySelector(".story-text--resonance-1").style.letterSpacing'),'');
for(const section of ['about','concerts','lessons','recordings','contact']){s.run(`renderSection('${section}')`);assert.ok(s.get('home').classList.contains('hidden'));assert.ok(s.get('sectionTitle').textContent);s.run('showHome()');assert.equal(s.context.window.scrollY,0);assert.equal(s.get('home').classList.contains('hidden'),false);}
s=setup(true);s.progress(.30);assert.equal(s.sounds.length,0,'Configured audio must not autoplay');s.run('toggleStorySound()');await s.ready();assert.equal(s.sounds.length,1);for(let i=0;i<10;i++)s.progress(.31);assert.equal(s.sounds.length,1,'No repeated sound during one movement');s.progress(.24);s.progress(.30);assert.equal(s.sounds.length,1,'Boundary jitter must not replay');s.advance(6100);s.progress(.30);await s.ready();assert.equal(s.sounds.length,2,'A deliberate later return can replay');s.run("renderSection('about')");assert.equal(s.run('soundEnabled'),false);assert.ok(s.sounds.every(x=>x.paused),'All audio stops on navigation');s.run('showHome()');s.progress(.30);assert.equal(s.sounds.length,2,'Returning to home must not resume audio');
s.run('toggleStorySound()');s.context.document.hidden=true;s.run('visibilityChanged()');assert.equal(s.run('soundEnabled'),false);s.run('destroyStory()');
s=setup();s.run('compactScreen.matches=true');
s.progress(.52+(.67-.52)*.9);
assert.ok(s.run('movementEls.rubato.style.transform').includes('-'), 'Mobile text must continue upwards after passing the center');
// A slow download must never start playing after navigation or mute.
s=setup(true);let finishDownload;
s.context.fetch=()=>new Promise(resolve=>{finishDownload=resolve});
s.progress(.30);s.run('toggleStorySound()');await s.ready();
s.run("renderSection('contact')");
finishDownload({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
await s.ready();assert.equal(s.sounds.length,0,'Stale audio download must not play');
// A missing/failed audio asset restores the OFF state without an uncaught error.
s=setup(true);s.context.fetch=async()=>({ok:false});s.progress(.30);
s.run('toggleStorySound()');await s.ready();
assert.equal(s.run('soundEnabled'),false,'Failed audio resets sound to OFF');
// The deliverable actually contains an MP3 for every configured movement.
const config={window:{}};vm.createContext(config);
vm.runInContext(fs.readFileSync(root+'/story-audio.js','utf8'),config);
for(const name of ['silence','listening','breath','rubato','cantabile','resonance','dacapo']){
 const file=config.window.PIANO_STORY_AUDIO[name];
 assert.ok(file && fs.statSync(root+'/'+file).size>1000,`Missing audio for ${name}`);
}
console.log('PASS: 1001 timeline samples, reverse determinism, three locales, reduced motion, five routes, mobile travel, seven MP3 assets, audio opt-in/cooldown/navigation/visibility cleanup, stale loads and errors');

}
main().catch(error=>{console.error(error);process.exitCode=1});
