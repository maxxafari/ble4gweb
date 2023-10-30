import{f as Y,s as se,c as ce,o as de,n as Z}from"../chunks/scheduler.da9d0849.js";import{S as fe,i as ue,s as u,g as m,r as H,B as pe,f as b,c as p,h,j as R,z as y,u as V,k as Q,a as B,A as c,v as z,C as ee,d as N,t as O,w as A}from"../chunks/index.5d2acbf4.js";import{H as me,L as he,p as _e,b as ge}from"../chunks/utils.96733cca.js";import{b as ve,a as Ce,S as be,C as Se,d as re}from"../chunks/Status.2ab7d4c4.js";import{p as le,e as $e,c as ke,b as we,a as xe}from"../chunks/peers.4a939f78.js";import{b as ye}from"../chunks/statusStore.cf99fd43.js";import{w as Te}from"../chunks/index.b9f67257.js";const Pe=!1,Le=!0,Ae=Object.freeze(Object.defineProperty({__proto__:null,prerender:Le,ssr:Pe},Symbol.toStringTag,{value:"Module"})),X=async o=>{const t=Y(k).peer;if(!t)throw new Error("Peer is null when calling p2");const e=t.connect(le);e.once("open",()=>{we(e,o),ye(e),ve(e),Ce(e)}),e.once("close",()=>{console.info("data connection closed calling p2 again..."),X(o)}),setTimeout(()=>{var n,a;console.info("checking if peer2 is connected: ",(n=e.peerConnection)==null?void 0:n.connectionState),["connecting","connected"].includes((a=e.peerConnection)==null?void 0:a.connectionState)||(e.removeAllListeners(),console.info("retrying connection to peer2"),X(o))},8e3)},Ee=async o=>{console.info("Creating new peer1"),await ke(xe,o);const t=Y(o).peer;if(!t)throw new Error("Peer is null when calling p2");t==null||t.on("error",e=>{e.type==="peer-unavailable"&&console.log("peer unavailable")}),t==null||t.once("open",()=>{X(o)})},k=Te($e("peer1"),()=>(console.info("new subscription for peer1"),Y(k).peer===null&&Ee(k),()=>{console.info("No subscription  peer1")}));k.subscribe(({peer:o,mediaStream:t,mediaConn:e})=>{if(t&&o&&!e){console.log("mediaStream changed");const n=o==null?void 0:o.call(le,t);k.update(a=>({...a,mediaConn:n}))}else!t&&e&&(console.log("mediaStream cleared"),e.close(),k.update(n=>({...n,mediaConn:null})))});function Be(o){let t,e="Connect BLE",n,a;return{c(){t=m("button"),t.textContent=e},l(l){t=h(l,"BUTTON",{"data-svelte-h":!0}),y(t)!=="svelte-p8uxjk"&&(t.textContent=e)},m(l,_){B(l,t,_),n||(a=ee(t,"click",o[4]),n=!0)},p:Z,d(l){l&&b(t),n=!1,a()}}}function Ie(o){let t,e="BLE connected";return{c(){t=m("p"),t.textContent=e},l(n){t=h(n,"P",{"data-svelte-h":!0}),y(t)!=="svelte-ppi2h6"&&(t.textContent=e)},m(n,a){B(n,t,a)},p:Z,d(n){n&&b(t)}}}function ae(o){let t,e="<h4>Calling peer2...</h4>";return{c(){t=m("div"),t.innerHTML=e},l(n){t=h(n,"DIV",{"data-svelte-h":!0}),y(t)!=="svelte-1jdsk8a"&&(t.innerHTML=e)},m(n,a){B(n,t,a)},d(n){n&&b(t)}}}function ie(o){let t,e,n="Connected to Peer2",a,l,_="Send data",S,g;return{c(){t=m("div"),e=m("h4"),e.textContent=n,a=u(),l=m("button"),l.textContent=_},l(C){t=h(C,"DIV",{});var i=R(t);e=h(i,"H4",{"data-svelte-h":!0}),y(e)!=="svelte-1n8zg7s"&&(e.textContent=n),a=p(i),l=h(i,"BUTTON",{"data-svelte-h":!0}),y(l)!=="svelte-eqb3bi"&&(l.textContent=_),i.forEach(b)},m(C,i){B(C,t,i),c(t,e),c(t,a),c(t,l),S||(g=ee(l,"click",o[6]),S=!0)},p:Z,d(C){C&&b(t),S=!1,g()}}}function De(o){let t,e,n,a,l="BLE device",_,S,g,C="Caller (initiator)",i,$,te="Use video",q,w,W,I,D,T,F,P,G,L,J,E,M,K,ne;function oe(r,x){return r[1]?Ie:Be}let U=oe(o),v=U(o),f=!o[2].dataConn&&ae(),d=o[2].dataConn&&ie(o);return T=new be({props:{isSender:!0}}),P=new Se({}),L=new me({}),E=new he({}),{c(){t=u(),e=m("div"),n=m("div"),a=m("p"),a.textContent=l,_=u(),v.c(),S=u(),g=m("p"),g.textContent=C,i=u(),$=m("label"),$.textContent=te,q=u(),w=m("input"),W=u(),f&&f.c(),I=u(),d&&d.c(),D=u(),H(T.$$.fragment),F=u(),H(P.$$.fragment),G=u(),H(L.$$.fragment),J=u(),H(E.$$.fragment),this.h()},l(r){pe("svelte-czx9hh",document.head).forEach(b),t=p(r),e=h(r,"DIV",{});var s=R(e);n=h(s,"DIV",{});var j=R(n);a=h(j,"P",{"data-svelte-h":!0}),y(a)!=="svelte-r1r1cb"&&(a.textContent=l),_=p(j),v.l(j),j.forEach(b),S=p(s),g=h(s,"P",{"data-svelte-h":!0}),y(g)!=="svelte-1id8pt1"&&(g.textContent=C),i=p(s),$=h(s,"LABEL",{for:!0,"data-svelte-h":!0}),y($)!=="svelte-eeyfdt"&&($.textContent=te),q=p(s),w=h(s,"INPUT",{type:!0,id:!0}),W=p(s),f&&f.l(s),I=p(s),d&&d.l(s),D=p(s),V(T.$$.fragment,s),F=p(s),V(P.$$.fragment,s),G=p(s),V(L.$$.fragment,s),J=p(s),V(E.$$.fragment,s),s.forEach(b),this.h()},h(){document.title="Peer1",Q($,"for","use-video"),Q(w,"type","checkbox"),Q(w,"id","use-video")},m(r,x){B(r,t,x),B(r,e,x),c(e,n),c(n,a),c(n,_),v.m(n,null),c(e,S),c(e,g),c(e,i),c(e,$),c(e,q),c(e,w),w.checked=o[0],c(e,W),f&&f.m(e,null),c(e,I),d&&d.m(e,null),c(e,D),z(T,e,null),c(e,F),z(P,e,null),c(e,G),z(L,e,null),c(e,J),z(E,e,null),M=!0,K||(ne=ee(w,"change",o[5]),K=!0)},p(r,[x]){U===(U=oe(r))&&v?v.p(r,x):(v.d(1),v=U(r),v&&(v.c(),v.m(n,null))),x&1&&(w.checked=r[0]),r[2].dataConn?f&&(f.d(1),f=null):f||(f=ae(),f.c(),f.m(e,I)),r[2].dataConn?d?d.p(r,x):(d=ie(r),d.c(),d.m(e,D)):d&&(d.d(1),d=null)},i(r){M||(N(T.$$.fragment,r),N(P.$$.fragment,r),N(L.$$.fragment,r),N(E.$$.fragment,r),M=!0)},o(r){O(T.$$.fragment,r),O(P.$$.fragment,r),O(L.$$.fragment,r),O(E.$$.fragment,r),M=!1},d(r){r&&(b(t),b(e)),v.d(),f&&f.d(),d&&d.d(),A(T),A(P),A(L),A(E),K=!1,ne()}}}function Me(o,t,e){let n;ce(o,k,i=>e(2,n=i));let a=!1,l=!0;async function _(){const i=await re.connect();e(1,a=i)}_e(),ge(),de(()=>{const i=setInterval(()=>{e(1,a=re.isConnected())},500);return()=>clearInterval(i)});const S=()=>_();function g(){l=this.checked,e(0,l)}const C=()=>{var i;return(i=n.dataConn)==null?void 0:i.send({message:"ping!",date:new Date})};return o.$$.update=()=>{o.$$.dirty&1&&(l&&navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(i=>{k.update($=>({...$,mediaStream:i}))}).catch(i=>{e(0,l=!1),console.log("getUserMedia error",i)}),l||k.update(i=>({...i,mediaStream:null})))},[l,a,n,_,S,g,C]}class qe extends fe{constructor(t){super(),ue(this,t,Me,De,se,{})}}export{qe as component,Ae as universal};
