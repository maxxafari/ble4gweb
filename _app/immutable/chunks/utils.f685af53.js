import{s as g,n as d,o as E,h as I,b as V,c as q}from"./scheduler.da9d0849.js";import{S as w,i as x,g as h,s as N,h as _,j as T,z as b,c as H,f as u,k as y,a as f,A as p,C as $,m as L,n as S,o as A}from"./index.5d2acbf4.js";import{d as m,c as D,e as F,s as M}from"./Status.6c43ff51.js";function U(l){let t,n="Connect Vehicle",e,s;return{c(){t=h("button"),t.textContent=n,this.h()},l(c){t=_(c,"BUTTON",{class:!0,"data-svelte-h":!0}),b(t)!=="svelte-6kwstn"&&(t.textContent=n),this.h()},h(){y(t,"class","svelte-t8ve75")},m(c,a){f(c,t,a),e||(s=$(t,"click",l[2]),e=!0)},p:d,d(c){c&&u(t),e=!1,s()}}}function P(l){let t,n="🟢 Connected";return{c(){t=h("span"),t.textContent=n},l(e){t=_(e,"SPAN",{"data-svelte-h":!0}),b(t)!=="svelte-ljfyeq"&&(t.textContent=n)},m(e,s){f(e,t,s)},p:d,d(e){e&&u(t)}}}function R(l){let t,n,e="Bluetooth vehicle",s;function c(o,i){return o[0]?P:U}let a=c(l),r=a(l);return{c(){t=h("div"),n=h("span"),n.textContent=e,s=N(),r.c(),this.h()},l(o){t=_(o,"DIV",{class:!0});var i=T(t);n=_(i,"SPAN",{"data-svelte-h":!0}),b(n)!=="svelte-e9dros"&&(n.textContent=e),s=H(i),r.l(i),i.forEach(u),this.h()},h(){y(t,"class","ble svelte-t8ve75")},m(o,i){f(o,t,i),p(t,n),p(t,s),r.m(t,null)},p(o,[i]){a===(a=c(o))&&r?r.p(o,i):(r.d(1),r=a(o),r&&(r.c(),r.m(t,null)))},i:d,o:d,d(o){o&&u(t),r.d()}}}function j(l,t,n){let e=!1;async function s(){const a=await m.connect();n(0,e=a)}return E(()=>{const a=setInterval(()=>{n(0,e=m.isConnected())},500);return()=>clearInterval(a)}),[e,s,()=>s()]}class Z extends w{constructor(t){super(),x(this,t,j,R,g,{})}}function z(l){let t,n="Horn",e,s,c,a,r;return{c(){t=h("button"),t.textContent=n,e=N(),s=h("audio"),this.h()},l(o){t=_(o,"BUTTON",{"data-svelte-h":!0}),b(t)!=="svelte-yfn8cv"&&(t.textContent=n),e=H(o),s=_(o,"AUDIO",{src:!0}),T(s).forEach(u),this.h()},h(){I(s.src,c="/horn.wav")||y(s,"src",c)},m(o,i){f(o,t,i),f(o,e,i),f(o,s,i),l[2](s),a||(r=$(t,"click",l[0]),a=!0)},p:d,i:d,o:d,d(o){o&&(u(t),u(e),u(s)),l[2](null),a=!1,r()}}}function X(l,t,n){let e;function s(){e.play()}E(()=>D.subscribe(a=>{a.horn&&s()}));function c(a){V[a?"unshift":"push"](()=>{e=a,n(1,e)})}return[s,e,c]}class tt extends w{constructor(t){super(),x(this,t,X,z,g,{soundHorn:0})}get soundHorn(){return this.$$.ctx[0]}}function G(l){let t,n,e=l[0].lights?"OFF":"ON",s,c,a;return{c(){t=h("button"),n=L("Turn Lights "),s=L(e)},l(r){t=_(r,"BUTTON",{});var o=T(t);n=S(o,"Turn Lights "),s=S(o,e),o.forEach(u)},m(r,o){f(r,t,o),p(t,n),p(t,s),c||(a=$(t,"click",l[1]),c=!0)},p(r,[o]){o&1&&e!==(e=r[0].lights?"OFF":"ON")&&A(s,e)},i:d,o:d,d(r){r&&u(t),c=!1,a()}}}function J(l,t,n){let e;return q(l,D,c=>n(0,e=c)),[e,()=>{F("lights",!0)}]}class et extends w{constructor(t){super(),x(this,t,J,G,g,{})}}let v=new Date().getTime(),C=null,k;const B=90,K=l=>{k=l;const t=new Date().getTime();t>v+B?(v=t,m.leds.setValRaw(k)):C||(C=setTimeout(()=>{m.leds.setValRaw(k),v=new Date().getTime(),C=null},B))};function nt(){return M.subscribe(l=>{if(!m.isConnected()){console.warn("command not sent, BLE not connected",l);return}const{lm:t,rm:n}=l,e=new TextEncoder().encode("XLRlr");e[1]=Math.abs(t),e[2]=Math.abs(n),e[3]=t<0?1:0,e[4]=n<0?1:0,K(e.buffer)})}let O=null;const st=async()=>{window&&(window==null||window.navigator.wakeLock.request("screen").then(l=>(O=l,O)).catch(l=>(console.log("wakeLock error",l),null)))};export{Z as C,tt as H,et as L,nt as b,st as p};
