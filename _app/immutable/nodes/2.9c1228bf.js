import{s as O,o as P,n as j}from"../chunks/scheduler.45f36ff2.js";import{S as z,i as D,s as $,g as _,r as k,B as M,f as d,c as g,h,j as y,u as E,a as v,A as C,v as B,d as x,t as T,w,z as I,C as V}from"../chunks/index.3c897206.js";import{S as q,C as A,d as L}from"../chunks/Status.a9f40a50.js";import{b as N}from"../chunks/transferToBle.da5e3624.js";const U=!1,W=!0,Y=Object.freeze(Object.defineProperty({__proto__:null,prerender:W,ssr:U},Symbol.toStringTag,{value:"Module"}));function F(l){let e,n="Connect BLE",t,a;return{c(){e=_("button"),e.textContent=n},l(r){e=h(r,"BUTTON",{"data-svelte-h":!0}),I(e)!=="svelte-p8uxjk"&&(e.textContent=n)},m(r,c){v(r,e,c),t||(a=V(e,"click",l[2]),t=!0)},p:j,d(r){r&&d(e),t=!1,a()}}}function G(l){let e,n="BLE connected";return{c(){e=_("p"),e.textContent=n},l(t){e=h(t,"P",{"data-svelte-h":!0}),I(e)!=="svelte-ppi2h6"&&(e.textContent=n)},m(t,a){v(t,e,a)},p:j,d(t){t&&d(e)}}}function H(l){let e,n,t,a,r,c,i,m;function b(o,u){return o[0]?G:F}let p=b(l),s=p(l);return r=new q({props:{isSender:!0}}),i=new A({}),{c(){e=$(),n=_("div"),t=_("div"),s.c(),a=$(),k(r.$$.fragment),c=$(),k(i.$$.fragment),this.h()},l(o){M("svelte-16nv4d1",document.head).forEach(d),e=g(o),n=h(o,"DIV",{});var f=y(n);t=h(f,"DIV",{});var S=y(t);s.l(S),S.forEach(d),a=g(f),E(r.$$.fragment,f),c=g(f),E(i.$$.fragment,f),f.forEach(d),this.h()},h(){document.title="TEST BLE"},m(o,u){v(o,e,u),v(o,n,u),C(n,t),s.m(t,null),C(n,a),B(r,n,null),C(n,c),B(i,n,null),m=!0},p(o,[u]){p===(p=b(o))&&s?s.p(o,u):(s.d(1),s=p(o),s&&(s.c(),s.m(t,null)))},i(o){m||(x(r.$$.fragment,o),x(i.$$.fragment,o),m=!0)},o(o){T(r.$$.fragment,o),T(i.$$.fragment,o),m=!1},d(o){o&&(d(e),d(n)),s.d(),w(r),w(i)}}}function J(l,e,n){let t=!1;async function a(){n(0,t=await L.connect())}return N(),P(()=>{const c=setInterval(()=>{n(0,t=L.isConnected())},500);return()=>clearInterval(c)}),[t,a,()=>a()]}class Z extends z{constructor(e){super(),D(this,e,J,H,O,{})}}export{Z as component,Y as universal};
