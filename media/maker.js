import { generateOTF } from './export/otf.js';

window.showPage = (page)=>document.querySelectorAll('main > div').forEach(page=>page.style.display=page.getAttribute('data-page')===page?'':'none');
window.showPage('settings');

window.exportShow = ()=>{
  document.getElementById('export-modal').showModal();
};
window.exportFont = ()=>{
  generateOTF();
};