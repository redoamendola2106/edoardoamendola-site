const fs = require('fs');
const vm = require('vm');
const assert = require('node:assert/strict');
const source=fs.readFileSync(process.argv[2] || require('node:path').resolve(__dirname, '../script.js'),'utf8');
// Exercise the shipped resonance renderer without requiring a browser runtime.
const start=source.indexOf('function renderResonance(');
const end=source.indexOf('\nfunction renderStaff',start);
const context={clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),prefersReducedMotion:false};
vm.createContext(context);
vm.runInContext(source.slice(start,end),context);
const first={style:{}},second={style:{}};
const el={querySelector:s=>s.includes('resonance-1')?first:second};
context.renderResonance(el,.7);
assert.ok(parseFloat(first.style.letterSpacing)<=.1,'Resonance spacing must remain subtle (<= 0.1em) to avoid reflow across the portrait');
assert.ok(+second.style.opacity>+first.style.opacity,'Second line should outlast the first');
console.log('PASS resonance legibility and timing');
