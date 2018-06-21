---
---

var swUrl = '{{ "/sw.js" | absolute_url }}';
{% comment %}
{% include assets/js/bricks.js %}
{% include assets/js/lazyload.js %}
{% include assets/js/nav.js %}
{% include assets/js/custom.js%}
{% include assets/js/smoothscroll.js %}
{% endcomment %}
(function(){
var D=function(){function a(){function b(a,b){d[a]=d[a]||[];d[a].push(b);return this}function a(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:!1;b?d[a].splice(d[a].indexOf(b),1):delete d[a];return this}var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},d=Object.create(null);c.u=b;c.once=function(a,c){c.j=!0;b(a,c);return this};c.s=a;c.f=function(b){for(var c=this,e=arguments.length,f=Array(1<e?e-1:0),g=1;g<e;g++)f[g-1]=arguments[g];(e=d[b]&&d[b].slice())&&e.forEach(function(e){e.j&&
a(b,e);e.apply(c,f)});return this};return c}return function(){function b(a){a.forEach(function(a){return a()})}function f(a){return Array.apply(null,Array(a)).map(function(){return 0})}function c(){return v.map(function(a){return a.i&&window.matchMedia("(min-width: "+a.i+")").matches}).indexOf(!0)}function d(){x||(window.requestAnimationFrame(g),x=!0)}function g(){u!==c()&&(n(),q.f("resize",h));x=!1}function n(){w=!1;b(J.concat(E));return q.f("pack")}var e=0<arguments.length&&void 0!==arguments[0]?
arguments[0]:{},w=void 0,x=void 0,u=void 0,h=void 0,p=void 0,k=void 0,y=void 0,z=void 0,A=void 0,B=void 0,r=void 0,C=void 0,F=void 0,G=0===e.h.indexOf("data-")?e.h:"data-"+e.h,v=e.sizes.slice().reverse(),K=!1!==e.position,t=e.c.nodeType?e.c:document.querySelector(e.c),L={all:function(){return Array.prototype.slice.call(t.children)},o:function(){return Array.prototype.slice.call(t.children).filter(function(a){return!a.hasAttribute(""+G)})}},J=[function(){u=c()},function(){h=-1===u?v[v.length-1]:v[u]},
function(){k=f(h.b)}],E=[function(){r=L[w?"new":"all"]()},function(){0!==r.length&&(C=r.map(function(a){return a.clientWidth}),F=r.map(function(a){return a.clientHeight}))},function(){r.forEach(function(a,b){p=k.indexOf(Math.min.apply(Math,k));a.style.position="absolute";y=k[p]+"px";z=p*C[b]+p*h.a+"px";K?(a.style.top=y,a.style.left=z):a.style.transform="translate3d("+z+", "+y+", 0)";a.setAttribute(G,"");A=C[b];B=F[b];A&&B&&(k[p]+=B+h.a)})},function(){t.style.position="relative";t.style.width=h.b*
A+(h.b-1)*h.a+"px";t.style.height=Math.max.apply(Math,k)-h.a+"px"}],q=a({g:n,update:function(){w=!0;b(E);return q.f("update")},resize:function(){window[(0<arguments.length&&void 0!==arguments[0]?arguments[0]:1)?"addEventListener":"removeEventListener"]("resize",d);return q}});return q}}();
document.addEventListener("DOMContentLoaded",function(){function a(){!1===f&&(f=!0,setTimeout(function(){for(var c=b.length-1;0<=c;c--){var d=b[c];d.getBoundingClientRect().top<=window.innerHeight&&0<=d.getBoundingClientRect().bottom&&(d.setAttribute("src",d.getAttribute("data-src")),d.classList.add("loaded"),b.splice(c,1))}0===b.length&&(document.removeEventListener("scroll",a),window.removeEventListener("resize",a),window.removeEventListener("orientationchange",a));f=!1},200))}var b=[].slice.call(document.getElementsByClassName("lazyload")),
f=!1;document.addEventListener("scroll",a);window.addEventListener("resize",a);window.addEventListener("orientationchange",a);a();for(var c=document.getElementsByClassName("preload"),d=0;d<c.length;d++)"style"===c[d].getAttribute("as")&&c[d].setAttribute("rel","stylesheet")});
(function(){var a=document.getElementById("menu-button"),b=document.getElementById("nav-items");a.addEventListener("click",function(){-1!==(a.getAttribute("class")||"").indexOf("open")?(a.setAttribute("class",""),b.setAttribute("class","close"),setTimeout(function(){b.setAttribute("class","")},400)):(a.setAttribute("class","menu-opened open"),b.setAttribute("class","open"))})})();
navigator.serviceWorker&&navigator.serviceWorker.register(swUrl,{scope:"/"}).then(function(a){console.log("Service worker successfully registered on scope",a.scope)})["catch"](function(){console.log("Service worker failed to register")});
window.addEventListener("load",function(){var a=document.getElementById("grid");if(a){var b=[{b:1,a:0},{i:"768px",b:2,a:0}];try{var f=window.m=D({c:a,h:"data-packed",sizes:b});window.addEventListener("resize",f.g);window.addEventListener("orientationchange",f.g);f.g()}catch(c){console.error(c)}}a=document.getElementsByClassName("preload");for(b=0;b<a.length;b++)"style"===a[b].getAttribute("as")&&(a[b].rel="stylesheet")});
for(var H,I=document.getElementsByTagName("a"),M=0;M<I.length;M++)H=I[M],H.addEventListener("click",function(){if(location.pathname.replace(/^\//,"")==this.pathname.replace(/^\//,"")&&location.hostname==this.hostname){var a=this.getAttribute("href").replace("#",""),b=document.getElementById(a);if(null!==b)return N(window.l(b),function(){b.focus();if(document.activeElement===b)return!1;b.setAttribute("tabindex","-1");b.focus()}),!1}});
var O=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)};
function N(a,b){function f(){n+=20;var a=n;a/=c/2;1>a?a=g/2*a*a+d:(a--,a=-g/2*(a*(a-2)-1)+d);document.documentElement.scrollTop=a;document.body.parentNode.scrollTop=a;document.body.scrollTop=a;n<c?O(f):b&&"function"===typeof b&&b()}var c=800,d=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,g=a-d,n=0;c="undefined"===typeof c?500:c;f()};
})()
    

