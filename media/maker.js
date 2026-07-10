import { generateOTF } from './export/otf.js';

window.showPage = (page)=>document.querySelectorAll('main > div').forEach(page=>page.style.display=page.getAttribute('data-page')===page?'':'none');
window.showPage('settings');

// Glyphs
let glyphs = [{ name: '.notdef', char: '', glyf: '' }];
let substitutions = [];
function showGlyphLists() {
  let disp = (gl)=>`<div>
  <span>${gl.glyf}</span>
  <span>${gl.name}</span>
</div>`;
  document.getElementById('glyph-list').innerHTML = glyphs.map(disp).join('');
  document.getElementById('sub-list').innerHTML = substitutions.map(disp).join('');
}
window.createGlyph = ()=>{
  let char = prompt('Character');
  if ([...Intl.Segmenter(undefined, {
    granularity: 'grapheme'
  }).segment(char)].length!==1) {
    alert('Only one grapheme allowed');
    return;
  }
  if (glyphs.findIndex(gl=>gl.char===char)!==-1) {
    alert('Glyph for that char already defined');
    return;
  }
  glyphs.push({
    name: char,
    char: char,
    glyf: ''
  });
  showGlyphLists();
};
window.createSub = ()=>{
  let charseq = prompt('Character sequence');
  substitutions.push({
    name: charseq,
    char: charseq,
    glyf: ''
  });
  showGlyphLists();
};
showGlyphLists();

// Export
window.exportFont = ()=>{
  generateOTF(glyphs, substitutions);
};
