import { generateOTF } from './export/otf.js';

window.showPage = (page)=>document.querySelectorAll('main > div').forEach(page=>page.style.display=page.getAttribute('data-page')===page?'':'none');
window.showPage('settings');

// Glyphs
let glyphs = [];
let substitutions = [];
function showGlyphLists() {
  let disp = (gl)=>`<div>
  <img src="${gl.glyf}">
  <span>${gl.name}</span>
</div>`;
  document.getElementById('glyph-list').innerHTML = glyphs.map(disp).join('');
  document.getElementById('sub-list').innerHTML = substitutions.map(disp).join('');
}
window.createGlyph = ()=>{
  glyphs.push({
    name: prompt('Character'),
    glyf: ''
  });
  showGlyphLists();
};
window.createSub = ()=>{
  substitutions.push({
    name: prompt('Character sequence'),
    glyf: ''
  });
  showGlyphLists();
};
showGlyphLists();

// Export
window.exportShow = ()=>{
  document.getElementById('export-modal').showModal();
};
window.exportFont = ()=>{
  generateOTF();
};
