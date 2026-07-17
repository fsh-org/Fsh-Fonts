import { generateOTF, classifyChar } from './export/otf.js';
import { renderTTO } from './render.js';

window.showPage = (page)=>document.querySelectorAll('main > div').forEach(div=>div.style.display=(div.getAttribute('data-page')===page)?'':'none');
window.showPage('settings');

// Settings
const weightNames = ['Thin','Thin','Extra-light','Light','Normal','Medium','Semi-bold','Bold','Extra-bold','Black','Black'];
const widthNames = ['Gay','Ultra-condensed','Extra-condensed','Condensed','Semi-condensed','Medium','Semi-expanded','Expanded','Extra-expanded','Ultra-expanded'];
document.getElementById('style-weight').oninput = (evt)=>{
  document.getElementById('preview-weight').innerText = evt.target.value+' '+weightNames[Math.round(evt.target.value/100)];
};
document.getElementById('style-width').oninput = (evt)=>{
  document.getElementById('preview-width').innerText = evt.target.value+' '+widthNames[evt.target.value];
};

// Glyphs
let glyphs = [{
  name: '.notdef',
  char: '',
  advance: 110,
  glyf: [
    { x: 0, y: 0, countourEnd: false, onCurve: true },
    { x: 50, y: 0, countourEnd: false, onCurve: true },
    { x: 50, y: 100, countourEnd: false, onCurve: true },
    { x: 0, y: 100, countourEnd: false, onCurve: true },
    { x: 0, y: 0, countourEnd: true, onCurve: true },

    { x: 10, y: 10, countourEnd: false, onCurve: true },
    { x: 10, y: 90, countourEnd: false, onCurve: true },
    { x: 40, y: 90, countourEnd: false, onCurve: true },
    { x: 40, y: 10, countourEnd: false, onCurve: true },
    { x: 10, y: 10, countourEnd: true, onCurve: true }
  ]
}];
let substitutions = [];
function showGlyphLists() {
  let disp = (gl,idx,where)=>`<button onclick="window.editGlyf(${idx}, '${where}')">
  ${renderTTO(gl.glyf, 256, 100)}
  <span>${gl.name}${gl.char!==''&&gl.char!==gl.name?` (${gl.char})`:''}</span>
</button>`;
  document.getElementById('glyph-list').innerHTML = glyphs.map((gl,idx)=>disp(gl,idx,'glyphs')).join('');
  document.getElementById('sub-list').innerHTML = substitutions.map((gl,idx)=>disp(gl,idx,'substitutions')).join('');
}
window.createGlyph = ()=>{
  let char = prompt('Character');
  if (!char) return;
  if (classifyChar(char)===null) {
    alert('Must be one code point or be a varation sequence');
    return;
  }
  if (glyphs.findIndex(gl=>gl.char===char)!==-1) {
    alert('Glyph for that already defined');
    return;
  }
  glyphs.push({
    name: char,
    char: char,
    advance: glyphs[0].advance,
    glyf: glyphs[0].glyf
  });
  showGlyphLists();
};
window.createSub = ()=>{
  let charseq = prompt('Character sequence');
  if (!charseq) return;
  if (substitutions.findIndex(sub=>sub.char===charseq)!==-1) {
    alert('Substitution for that sequence already defined');
    return;
  }
  substitutions.push({
    name: charseq,
    char: charseq,
    advance: glyphs[0].advance,
    glyf: glyphs[0].glyf
  });
  showGlyphLists();
};
showGlyphLists();

let editModal = document.getElementById('edit-glyph');
window.editGlyf = (idx, where)=>{
  let t = glyphs;
  if (where==='substitutions') t = substitutions;
  editModal.showModal();
  editModal.querySelector('.contain').innerHTML = renderTTO(t[idx].glyf, 256, 256, true, t[idx].advance);
  editModal.querySelector('h2').innerText = `${t[idx].name}${t[idx].char!==''&&t[idx].char!==t[idx].name?` (${t[idx].char})`:''}`;
  editModal.querySelector('input').value = t[idx].name;
  editModal.querySelector('input[type="number"]').value = t[idx].advance;
};

// Export
window.exportFont = ()=>{
  let family = document.getElementById('string-family').value||'Font';
  let subfamily = document.getElementById('string-subfamily').value||'Regular';
  let buffer = generateOTF({
    weight: document.getElementById('style-weight').value,
    italic: document.getElementById('style-italic').checked,
    italicAngle: document.getElementById('style-italicAngle').value,
    underline: document.getElementById('style-underline').checked,
    underlinePosition: document.getElementById('style-underlinePosition').value,
    underlineThickness: document.getElementById('style-underlineThickness').value,
    strikePosition: document.getElementById('style-strikePosition').value,
    strikeThickness: document.getElementById('style-strikeThickness').value,
    outline: document.getElementById('style-outline').checked,
    shadow: document.getElementById('style-shadow').checked,
    width: document.getElementById('style-width').value,
    monospaced: document.getElementById('style-monospaced').checked,
    subXSize: document.getElementById('style-subXSize').value,
    subYSize: document.getElementById('style-subYSize').value,
    subXOff: document.getElementById('style-subXOff').value,
    subYOff: document.getElementById('style-subYOff').value,
    supXSize: document.getElementById('style-supXSize').value,
    supYSize: document.getElementById('style-supYSize').value,
    supXOff: document.getElementById('style-supXOff').value,
    supYOff: document.getElementById('style-supYOff').value,
    ascender: document.getElementById('style-ascender').value,
    descender: document.getElementById('style-descender').value,
    linegap: document.getElementById('style-linegap').value,

    family,
    subfamily,
    version: document.getElementById('string-version').value,
    copyright: document.getElementById('string-copyright').value,
    designer: document.getElementById('string-designer').value,
    desc: document.getElementById('string-desc').value,
    license: document.getElementById('string-license').value,
    sample: document.getElementById('string-sample').value,

    glyphNames: document.getElementById('glyphNames').checked,
    tag: document.getElementById('tag').value
  }, glyphs, substitutions);

  let url = URL.createObjectURL(new Blob([buffer], { type: 'font/otf' }));
  let lnk = document.createElement('a');
  lnk.href = url;
  lnk.download = `${family.toLowerCase()}-${subfamily.toLowerCase()}.otf`;
  lnk.style.display = 'none';
  document.body.appendChild(lnk);
  lnk.click();
  lnk.remove();
  URL.revokeObjectURL(url);
};
