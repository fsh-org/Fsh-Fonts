export function renderTTO(glyf, upe=256, size=256, guide=false, advance=0) {
  let sizing = guide?Math.max(upe,advance):upe;
  let path = '';
  let contour = [];
  for (let i=0; i<glyf.length; i++) {
    contour.push({ x: glyf[i].x, y: sizing-glyf[i].y, onCurve: glyf[i].onCurve!==false });
    if (glyf[i].countourEnd) { path += contourPath(contour); contour = []; }
  }
  if (contour.length) path += contourPath(contour);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${sizing} ${sizing}">
  ${guide?`<rect x="0" y="0" width="1" height="${sizing}"/>
<rect x="0" y="${sizing}" width="${sizing}" height="1"/>
<rect x="${advance}" y="0" width="1" height="${sizing}"/>`:''}
  <path fill-rule="evenodd" d="${path}"/>
</svg>`;
}
function contourPath(pts) {
  let n = pts.length;
  if (n===0) return '';
  let s = pts.findIndex(p=>p.onCurve);
  let start = s===-1?{ x: (pts[n-1].x+pts[0].x)/2, y: (pts[n-1].y+pts[0].y)/2 }:pts[s];
  let begin = s===-1?0:s+1;
  let total = s===-1?n:n-1;
  let d = `M ${start.x} ${start.y} `;
  let ctrl = null;
  for (let k=0; k<total; k++) {
    let p = pts[(begin+k)%n];
    if (p.onCurve) {
      if (ctrl) { d += `Q ${ctrl.x} ${ctrl.y} ${p.x} ${p.y} `; ctrl = null; }
      else d += `L ${p.x} ${p.y} `;
    } else {
      if (ctrl) d += `Q ${ctrl.x} ${ctrl.y} ${(ctrl.x+p.x)/2} ${(ctrl.y+p.y)/2} `;
      ctrl = p;
    }
  }
  if (ctrl) d += `Q ${ctrl.x} ${ctrl.y} ${start.x} ${start.y} `;
  return d+'Z ';
}
