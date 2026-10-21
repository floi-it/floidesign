/* Custom cursor: a small dot that replaces the system pointer (idea from nadiuhkidesign.com).
   Its colour drifts through the brand palette as the mouse travels — blended continuously,
   one colour every ~700px of movement, so it shifts gradually instead of flashing.
   Mouse/trackpad only; touch devices keep their default behaviour. */
(function(){
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // brand colours dark enough to read as a 10px dot on --bg (#F4F4F2)
  var palette = ['#CF5F3A','#880666','#135291','#4A39C1','#273C2C'];
  var PX_PER_COLOUR = 700;

  var rgb = palette.map(function(hex){
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  });

  var style = document.createElement('style');
  style.textContent =
    '*{cursor:none!important}' +
    '.floi-cursor{position:fixed;top:0;left:0;width:10px;height:10px;border-radius:50%;pointer-events:none;z-index:9999;' +
    'box-shadow:0 0 0 1.5px rgba(255,255,255,.75);opacity:0;transition:opacity .2s;will-change:transform}';
  document.head.appendChild(style);

  var dot = document.createElement('div');
  dot.className = 'floi-cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var travelled = 0, lastX = null, lastY = null;

  function colourAt(dist){
    var pos = (dist / PX_PER_COLOUR) % rgb.length;
    var i = Math.floor(pos), t = pos - i;
    var a = rgb[i], b = rgb[(i + 1) % rgb.length];
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
                    Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
                    Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  dot.style.background = colourAt(0);

  window.addEventListener('mousemove', function(e){
    if (lastX !== null) travelled += Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX; lastY = e.clientY;
    dot.style.transform = 'translate(' + (e.clientX - 5) + 'px,' + (e.clientY - 5) + 'px)';
    dot.style.background = colourAt(travelled);
    dot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', function(){ dot.style.opacity = '0'; });
})();
