import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const fragment = await readFile(new URL('../src/challenge.html',import.meta.url),'utf8');
const standalone = await readFile(new URL('../index.html',import.meta.url),'utf8');
const script = fragment.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const core = script.match(/\/\* optics:start \*\/([\s\S]*?)\/\* optics:end \*\//)[1];
const context = {};
vm.runInNewContext(core+';globalThis.optics={geometry,intensity,sinc,displayColor,markedX};',context);
const {geometry,intensity,sinc,displayColor,markedX} = context.optics;
const near = (actual,expected,tolerance=1e-10) => assert.ok(Math.abs(actual-expected)<=tolerance,'Expected '+actual+' to be within '+tolerance+' of '+expected);

// Independent quadrature across the physical openings. No sinc helper or
// closed-form interference factor is used in this reference calculation.
function aperture(x,covered,distance=geometry.distance,fresnel=false,n=2048) {
  let re=0,im=0;
  for (const side of [-1,1]) {
    if (covered && side===1) continue;
    for (let j=0;j<n;j++) {
      const xi=side*geometry.spacing/2-geometry.width/2+(j+0.5)*geometry.width/n;
      let phase=-2*Math.PI*x*xi/(geometry.wavelength*distance);
      if (fresnel) phase+=Math.PI*xi*xi/(geometry.wavelength*distance);
      re+=Math.cos(phase)*geometry.width/n;
      im+=Math.sin(phase)*geometry.width/n;
    }
  }
  return (re*re+im*im)/(4*geometry.width*geometry.width);
}

function farFieldAtDistance(x,distance) {
  const beta=Math.PI*geometry.width*x/(geometry.wavelength*distance);
  const alpha=Math.PI*geometry.spacing*x/(geometry.wavelength*distance);
  const envelope=beta===0 ? 1 : (Math.sin(beta)/beta)**2;
  return envelope*Math.cos(alpha)**2;
}

// This fixture checks state transitions and generated attributes/text.
// It does not provide layout, SVG rendering, keyboard or browser evidence.
function fixture(stored) {
  const nodes=new Map();
  class Element {
    constructor(tag,attributes) {
      this.tag=tag;this.attributes=new Map(Object.entries(attributes));
      this.dataset={};this.textContent='';this.innerHTML='';this.events={};
      for(const [key,value] of Object.entries(attributes)) {
        if(key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
      }
    }
    setAttribute(name,value) {this.attributes.set(name,String(value));}
    getAttribute(name) {return this.attributes.get(name) ?? null;}
    toggleAttribute(name,force) {
      const present=force===undefined ? !this.attributes.has(name) : Boolean(force);
      if(present) this.attributes.set(name,''); else this.attributes.delete(name);
      return present;
    }
    get hidden() {return this.attributes.has('hidden');}
    addEventListener(name,callback) {this.events[name]=callback;}
    click() {assert.ok(this.events.click);this.events.click();}
  }
  let root;
  for(const match of fragment.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)) {
    const attributes={};
    for(const item of match[2].matchAll(/(?:^|\s)([a-z][a-z0-9-]*)(?:="([^"]*)")?/gi)) attributes[item[1]]=item[2] ?? '';
    const element=new Element(match[1],attributes);
    if(attributes.id==='slit-cover-review') root=element;
    for(const key of Object.keys(attributes).filter(x=>x.startsWith('data-'))) {
      const selector='['+key+']';
      if(!nodes.has(selector)) nodes.set(selector,[]);
      nodes.get(selector).push(element);
    }
  }
  assert.ok(root);
  root.querySelector=selector => {
    const element=nodes.get(selector)?.[0];
    assert.ok(element,'Missing fixture selector '+selector);
    return element;
  };
  root.querySelectorAll=selector => nodes.get(selector) ?? [];
  const sandbox={
    document:{getElementById:id=>id==='slit-cover-review' ? root : null},
    window:{openai:{widgetState:stored,setWidgetState:value=>{sandbox.saved=value;}}},
  };
  vm.runInNewContext(script,sandbox);
  return {root,get:root.querySelector,all:root.querySelectorAll,sandbox};
}

near(sinc(0),1);
near(intensity(0,false),1);
near(intensity(0,true),0.25);
near(intensity(markedX,false),0,1e-25);
near(intensity(markedX,true),0.24188280231876974);
near(intensity(geometry.wavelength*geometry.distance/geometry.width,false),0,1e-25);

let maxApertureDifference=0;
let sampledStates=0;
for(let j=0;j<=120;j++) {
  const x=-0.022+0.044*j/120;
  for(const covered of [false,true]) {
    const actual=intensity(x,covered);
    assert.ok(actual>=0 && actual<=1);
    near(actual,intensity(-x,covered));
    maxApertureDifference=Math.max(maxApertureDifference,Math.abs(actual-aperture(x,covered)));
    sampledStates++;
  }
}
assert.ok(maxApertureDifference<1e-7);
for(const bad of [NaN,Infinity,-Infinity]) {
  assert.throws(()=>intensity(bad,false));
  assert.throws(()=>sinc(bad));
}
assert.throws(()=>intensity(0,'covered'));
for(const bad of [-0.1,1.1,NaN]) assert.throws(()=>displayColor(bad));
assert.equal(displayColor(0),'rgb(0,0,0)');
assert.equal(displayColor(1),'rgb(124,255,200)');

const fresnelComparisons=[];
for(const distance of [2,0.1,0.01]) {
  const fringeSpacing=geometry.wavelength*distance/geometry.spacing;
  let maxDifference=0,maxRefinement=0;
  for(let j=0;j<=120;j++) {
    const x=(-3+6*j/120)*fringeSpacing;
    const coarse=aperture(x,false,distance,true,2048);
    const fine=aperture(x,false,distance,true,4096);
    maxDifference=Math.max(maxDifference,Math.abs(farFieldAtDistance(x,distance)-coarse));
    maxRefinement=Math.max(maxRefinement,Math.abs(fine-coarse));
  }
  fresnelComparisons.push({distanceMetres:distance,maximumDifference:maxDifference,maximumQuadratureRefinement:maxRefinement});
}
near(fresnelComparisons[0].maximumDifference,0.000013801053010187303,1e-10);
near(fresnelComparisons[1].maximumDifference,0.005508236839626202,1e-10);
near(fresnelComparisons[2].maximumDifference,0.4432316162649572,1e-10);
assert.ok(fresnelComparisons.every(x=>x.maximumQuadratureRefinement<1e-7));

const ui=fixture();
assert.equal(ui.get('[data-target-reading]').textContent,'0.0%');
assert.equal(ui.get('[data-center-reading]').textContent,'100.0%');
assert.ok(ui.get('[data-cover]').hidden);
assert.ok(ui.get('[data-result]').hidden);
ui.all('[data-guess]')[1].click();
assert.equal(ui.all('[data-guess]')[1].getAttribute('aria-pressed'),'true');
assert.ok(ui.get('[data-result]').hidden);
ui.get('[data-toggle]').click();
assert.equal(ui.get('[data-target-reading]').textContent,'24.2%');
assert.equal(ui.get('[data-center-reading]').textContent,'25.0%');
assert.equal(ui.get('[data-toggle]').textContent,'Open the right slit');
assert.equal(ui.get('[data-toggle]').getAttribute('aria-pressed'),'true');
assert.equal(ui.get('[data-cover]').hidden,false);
assert.equal(ui.get('[data-before-path]').hidden,false);
assert.equal(ui.get('[data-before-legend]').hidden,false);
assert.equal(ui.get('[data-result]').hidden,false);
assert.ok(ui.get('[data-result]').textContent.includes('Your prediction matches this case.'));
assert.equal((ui.get('[data-gradient]').innerHTML.match(/<stop /g) ?? []).length,641);
assert.ok(ui.get('[data-live]').textContent.includes('24.2%'));
assert.notEqual(ui.get('[data-before-path]').getAttribute('d'),ui.get('[data-current-path]').getAttribute('d'));

const restored=fixture(ui.sandbox.saved);
assert.equal(restored.get('[data-cover]').hidden,false);
assert.equal(restored.get('[data-target-reading]').textContent,'24.2%');
assert.equal(restored.all('[data-guess]')[1].getAttribute('aria-pressed'),'true');
ui.get('[data-toggle]').click();
assert.equal(ui.get('[data-target-reading]').textContent,'0.0%');
assert.equal(ui.get('[data-center-reading]').textContent,'100.0%');
assert.equal(ui.get('[data-cover]').hidden,true);
ui.get('[data-reset]').click();
assert.ok(ui.get('[data-result]').hidden);
assert.ok(ui.get('[data-next]').hidden);
assert.ok(ui.all('[data-guess]').every(x=>x.getAttribute('aria-pressed')==='false'));
const malformed=fixture({model:'slit-cover-review-v1',covered:'true',observed:'true',guess:'invalid'});
assert.equal(malformed.get('[data-target-reading]').textContent,'0.0%');
assert.ok(malformed.get('[data-result]').hidden);

assert.ok(standalone.startsWith('<!doctype html>'));
assert.ok(standalone.includes(fragment));
assert.equal((standalone.match(/<script>/g) ?? []).length,1);
assert.equal((standalone.match(/id="slit-cover-review"/g) ?? []).length,1);
// Canonical metadata describes the web copy and loads no runtime asset.
const runtimeMarkup=standalone.replace(/<link\s+rel="canonical"\s+href="https:\/\/[^"]+"\s*\/?>/gi,'');
assert.equal(/<script\b[^>]*\bsrc=|<link\b|<img\b|<iframe\b|<object\b/i.test(runtimeMarkup),false);
assert.equal(/\bfetch\s*\(|XMLHttpRequest|WebSocket|import\s*\(|url\(["']?https?:\/\//.test(script),false);

export const report={
  scope:'Review sketch: scalar mathematics, JavaScript parsing, DOM-fixture state transitions and static packaging checks',
  geometrySI:{...geometry},
  reference:'Original two-slit coherent on-axis intensity; fixed for both conditions',
  openingPrediction:{
    markedPositionMillimetres:1000*markedX,
    bothOpen:{center:intensity(0,false),markedSpot:intensity(markedX,false)},
    rightCovered:{center:intensity(0,true),markedSpot:intensity(markedX,true)}
  },
  apertureComparison:{sampledStates,midpointsPerSlit:2048,maximumDifference:maxApertureDifference},
  fresnelComparison:{samplePositionsPerDistance:121,span:'plus or minus three nominal fringe spacings',cases:fresnelComparisons},
  checks:{javascriptParsing:'pass',finiteInputs:'pass',limitsAndSymmetry:'pass',independentApertureComparison:'pass',quadratureRefinement:'pass',uiFixture:'pass',widgetStateRestoration:'pass',singleFileStaticPackaging:'pass'},
  unverified:['Actual browser rendering and keyboard/touch operation','Opening the file in a browser with networking disabled','Child enjoyment and transfer of learning','Independent human physics review'],
  sha256:{
    fragment:createHash('sha256').update(fragment).digest('hex'),
    standalone:createHash('sha256').update(standalone).digest('hex')
  }
};
console.log(JSON.stringify(report,null,2));
