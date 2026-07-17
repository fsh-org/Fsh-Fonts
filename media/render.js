export function renderTTO(glyf, upe=256, size=256, guide=false, advance=0) {
  let sizing = guide?Math.max(upe,advance):upe;
  let path = '';
  let start = true;
  for (let i=0; i<glyf.length; i++) {
    path += `${start?'M':'L'} ${glyf[i].x} ${sizing-glyf[i].y} `;
    start = false;
    if (glyf[i].countourEnd) path += 'Z';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${sizing} ${sizing}">
  ${guide?`<rect x="0" y="0" width="1" height="${sizing}"/>
<rect x="0" y="${sizing}" width="${sizing}" height="1"/>
<rect x="${advance}" y="0" width="1" height="${sizing}"/>`:''}
  <path fill-rule="evenodd" d="${path}"/>
</svg>`;
}