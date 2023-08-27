import{s as Z,n as q,r as $}from"../chunks/scheduler.b0c1c2c3.js";import{S as tt,i as et,g as w,s as U,m as D,B as at,h as v,f as b,c as I,j as O,y as S,n as j,k as Q,A as s,a as z,C as x,o as W}from"../chunks/index.00179a67.js";const nt=!1,rt=!0,_t=Object.freeze(Object.defineProperty({__proto__:null,prerender:rt,ssr:nt},Symbol.toStringTag,{value:"Module"})),ot=async(n,t)=>{const{serviceId:o,characteristicId:e,readParser:i,setParser:a}=t;if(!n.connected)throw new Error("BLE Server not connected");const r=await(await n.getPrimaryService(o)).getCharacteristic(e);t.isNotifiable&&(await r.startNotifications(),console.log("add notification for: ",t.characteristicId),await r.startNotifications(),r.addEventListener("characteristicvaluechanged",c=>{const h=c.target;if(!i)throw new Error("readParser not defined");h.value&&y(i(h.value))}));async function C(){if(!i)throw new Error("readParser not defined");return await i(await r.readValue())}async function E(c){await r.writeValue(c)}async function u(c){if(!a)throw new Error("setParser not defined");await r.writeValue(a(c))}let y=c=>{console.warn("onNotification not implemented:",{serviceId:o,characteristicId:e,value:c})};return{getVal:C,setVal:u,setValRaw:E,onNotification:c=>{if(!t.isNotifiable)throw new Error("Characteristic is not notifiable");y=c}}};function it(n){let t,o="Disconnect",e,i;return{c(){t=w("button"),t.textContent=o},l(a){t=v(a,"BUTTON",{"data-svelte-h":!0}),S(t)!=="svelte-fs9pv2"&&(t.textContent=o)},m(a,f){z(a,t,f),e||(i=x(t,"click",n[9]),e=!0)},p:q,d(a){a&&b(t),e=!1,i()}}}function ct(n){let t,o="Connect To Ble",e,i;return{c(){t=w("button"),t.textContent=o},l(a){t=v(a,"BUTTON",{"data-svelte-h":!0}),S(t)!=="svelte-fhymu3"&&(t.textContent=o)},m(a,f){z(a,t,f),e||(i=x(t,"click",n[8]),e=!0)},p:q,d(a){a&&b(t),e=!1,i()}}}function st(n){let t,o,e,i,a,f,r,C="update",E,u,y,p,c,h,P,L,V,g,N="Off",T,d,R="On",G,F;function J(l,m){return l[0]?it:ct}let A=J(n),_=A(n);return{c(){t=w("meta"),o=U(),e=w("section"),_.c(),i=U(),a=w("ul"),f=w("li"),r=w("button"),r.textContent=C,E=U(),u=w("li"),y=D("Led: "),p=D(n[1]),c=U(),h=w("li"),P=D("Battery: "),L=D(n[2]),V=U(),g=w("button"),g.textContent=N,T=U(),d=w("button"),d.textContent=R,this.h()},l(l){const m=at("svelte-1n9drxs",document.head);t=v(m,"META",{name:!0,content:!0}),m.forEach(b),o=I(l),e=v(l,"SECTION",{});var k=O(e);_.l(k),i=I(k),a=v(k,"UL",{});var B=O(a);f=v(B,"LI",{});var K=O(f);r=v(K,"BUTTON",{"data-svelte-h":!0}),S(r)!=="svelte-1924rdz"&&(r.textContent=C),K.forEach(b),E=I(B),u=v(B,"LI",{});var M=O(u);y=j(M,"Led: "),p=j(M,n[1]),M.forEach(b),c=I(B),h=v(B,"LI",{});var H=O(h);P=j(H,"Battery: "),L=j(H,n[2]),H.forEach(b),B.forEach(b),V=I(k),g=v(k,"BUTTON",{"data-svelte-h":!0}),S(g)!=="svelte-1t8gbhd"&&(g.textContent=N),T=I(k),d=v(k,"BUTTON",{"data-svelte-h":!0}),S(d)!=="svelte-vndrdl"&&(d.textContent=R),k.forEach(b),this.h()},h(){document.title="Control",Q(t,"name","description"),Q(t,"content","Control app")},m(l,m){s(document.head,t),z(l,o,m),z(l,e,m),_.m(e,null),s(e,i),s(e,a),s(a,f),s(f,r),s(a,E),s(a,u),s(u,y),s(u,p),s(a,c),s(a,h),s(h,P),s(h,L),s(e,V),s(e,g),s(e,T),s(e,d),G||(F=[x(r,"click",n[10]),x(g,"click",n[11]),x(d,"click",n[12])],G=!0)},p(l,[m]){A===(A=J(l))&&_?_.p(l,m):(_.d(1),_=A(l),_&&(_.c(),_.m(e,i))),m&2&&W(p,l[1]),m&4&&W(L,l[2])},i:q,o:q,d(l){l&&(b(o),b(e)),b(t),_.d(),G=!1,$(F)}}}const X="a3941db0-a97c-4cf1-943f-a25ff9ba40cd",lt="5b8c0ab6-a058-4684-b2b6-4a0a692e2d45";async function Y(n){return await ft(await n.readValue())}async function ft(n){const t=new Uint8Array(n.buffer);return console.log("valueArray",t),[t[0],t[1]]}function dt(n,t,o){let e,i=!1,a,f,r,C,E;async function u(){var T;if(o(7,e=await navigator.bluetooth.requestDevice({filters:[{namePrefix:"nrf52"}],optionalServices:[X,"battery_service"]})),!e.gatt)throw new Error("No GATT server");if(a=await((T=e.gatt)==null?void 0:T.connect()),!a)throw new Error("No GATT server");if(f=await(a==null?void 0:a.getPrimaryService(X)),!f)throw new Error("No LED service");if(r=await f.getCharacteristic(lt),!r)throw new Error("No LED characteristic");console.log("found ledCharacteristic",r),console.log("add battery value"),(await ot(a,{serviceId:"battery_service",characteristicId:"battery_level",isNotifiable:!0,readParser:d=>d.getUint8(0).toString()})).onNotification(d=>{console.log("battery value",d),o(2,E=d)}),o(1,C=await Y(r))}async function y(){var N;await((N=e==null?void 0:e.gatt)==null?void 0:N.disconnect()),o(7,e=void 0)}async function p(){r&&o(1,C=await Y(r))}async function c(N,T){r&&(await r.writeValue(new Uint8Array([N,T])),p())}const h=()=>u(),P=()=>y(),L=()=>p(),V=()=>c(0,0),g=()=>c(1,1);return n.$$.update=()=>{n.$$.dirty&128&&o(0,i=!!e)},[i,C,E,u,y,p,c,e,h,P,L,V,g]}class wt extends tt{constructor(t){super(),et(this,t,dt,st,Z,{})}}export{wt as component,_t as universal};