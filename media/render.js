export function renderTTO(glyf, upe=256, size=256, guide=false, advance=0) {
  let sizing = guide?Math.max(upe,advance):upe;
  let path = '';
  let points = [];
  for (let i=0; i<glyf.length; i++) {
    points.push({ x: Number(glyf[i].x), y: sizing-Number(glyf[i].y), onCurve: glyf[i].onCurve });
    if (glyf[i].countourEnd) { path += contourPath(points); points = []; }
  }
  if (points.length) path += contourPath(points);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${sizing} ${sizing}">
  ${guide?`<rect x="0" y="0" width="1" height="${sizing}"/>
  <rect x="0" y="${sizing}" width="${sizing}" height="1"/>
  <rect x="${advance}" y="0" width="1" height="${sizing}"/>`:''}
  <path fill-rule="evenodd" d="${path}"/>
  ${guide?glyf.map(p=>`<circle cx="${p.x}" cy="${sizing-p.y}" r="${upe/64}" fill="var(--${p.onCurve?'blue':'red'}-1)"/>`).join(''):''}
</svg>`;
}
function contourPath(points) {
  let count = points.length;
  if (count===0) return '';
  let firstOnCurve = points.findIndex(point=>point.onCurve);
  let start = firstOnCurve===-1?{ x: (points[count-1].x+points[0].x)/2, y: (points[count-1].y+points[0].y)/2 }:points[firstOnCurve];
  let begin = firstOnCurve===-1?0:firstOnCurve+1;
  let steps = firstOnCurve===-1?count:count-1;
  let data = `M ${start.x} ${start.y} `;
  let control = null;
  for (let i=0; i<steps; i++) {
    let point = points[(begin+i)%count];
    if (point.onCurve) {
      if (control) { data += `Q ${control.x} ${control.y} ${point.x} ${point.y} `; control = null; }
      else data += `L ${point.x} ${point.y} `;
    } else {
      if (control) data += `Q ${control.x} ${control.y} ${(control.x+point.x)/2} ${(control.y+point.y)/2} `;
      control = point;
    }
  }
  if (control) data += `Q ${control.x} ${control.y} ${start.x} ${start.y} `;
  return data+'Z ';
}