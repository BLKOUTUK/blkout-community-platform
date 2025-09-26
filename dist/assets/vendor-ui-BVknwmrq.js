var pt=Object.defineProperty,mt=Object.defineProperties;var gt=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var be=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var Ee=(e,t,n)=>t in e?pt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,E=(e,t)=>{for(var n in t||(t={}))be.call(t,n)&&Ee(e,n,t[n]);if($)for(var n of $(t))xe.call(t,n)&&Ee(e,n,t[n]);return e},M=(e,t)=>mt(e,gt(t));var P=(e,t)=>{var n={};for(var r in e)be.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&$)for(var r of $(e))t.indexOf(r)<0&&xe.call(e,r)&&(n[r]=e[r]);return n};import{r as c,R as Ie,a as kt,b as Et}from"./vendor-react-jeKE6LQy.js";var je={exports:{}},te={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bt=c,xt=Symbol.for("react.element"),wt=Symbol.for("react.fragment"),Ct=Object.prototype.hasOwnProperty,Mt=bt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,St={key:!0,ref:!0,__self:!0,__source:!0};function Fe(e,t,n){var r,a={},o=null,s=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(s=t.ref);for(r in t)Ct.call(t,r)&&!St.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)a[r]===void 0&&(a[r]=t[r]);return{$$typeof:xt,type:e,key:o,ref:s,props:a,_owner:Mt.current}}te.Fragment=wt;te.jsx=Fe;te.jsxs=Fe;je.exports=te;var k=je.exports;/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),We=(...e)=>e.filter((t,n,r)=>!!t&&r.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Pt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=c.forwardRef((l,f)=>{var d=l,{color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:a="",children:o,iconNode:s}=d,i=P(d,["color","size","strokeWidth","absoluteStrokeWidth","className","children","iconNode"]);return c.createElement("svg",E(M(E({ref:f},Pt),{width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:We("lucide",a)}),i),[...s.map(([v,h])=>c.createElement(v,h)),...Array.isArray(o)?o:[o]])});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=(e,t)=>{const n=c.forwardRef((s,o)=>{var i=s,{className:r}=i,a=P(i,["className"]);return c.createElement(At,E({ref:o,iconNode:t,className:We(`lucide-${Rt(e)}`,r)},a))});return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hr=u("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yr=u("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vr=u("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pr=u("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mr=u("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gr=u("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kr=u("Building",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["path",{d:"M9 22v-4h6v4",key:"r93iot"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Er=u("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const br=u("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=u("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wr=u("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cr=u("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=u("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sr=u("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rr=u("Chrome",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["line",{x1:"21.17",x2:"12",y1:"8",y2:"8",key:"a0cw5f"}],["line",{x1:"3.95",x2:"8.54",y1:"6.06",y2:"14",key:"1kftof"}],["line",{x1:"10.88",x2:"15.46",y1:"21.94",y2:"14",key:"1ymyh8"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=u("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ar=u("CircleCheckBig",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=u("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Or=u("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=u("Crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=u("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=u("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=u("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=u("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jr=u("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fr=u("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=u("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=u("Grid3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=u("Handshake",[["path",{d:"m11 17 2 2a1 1 0 1 0 3-3",key:"efffak"}],["path",{d:"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",key:"9pr0kb"}],["path",{d:"m21 3 1 11h-2",key:"1tisrp"}],["path",{d:"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",key:"1uvwmv"}],["path",{d:"M3 4h8",key:"1ep09j"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=u("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=u("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=u("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=u("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $r=u("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=u("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=u("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=u("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=u("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=u("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qr=u("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=u("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=u("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=u("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=u("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=u("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=u("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=u("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=u("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=u("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=u("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=u("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=u("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=u("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fa=u("ThumbsDown",[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",key:"m61m77"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=u("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=u("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const va=u("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=u("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ma=u("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ga=u("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=u("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=u("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ba=u("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xa=u("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=u("VolumeX",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ca=u("Vote",[["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}],["path",{d:"M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z",key:"1ezoue"}],["path",{d:"M22 19H2",key:"nuriw5"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=u("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sa=u("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);function _(e,t,{checkForDefaultPrevented:n=!0}={}){return function(a){if(e==null||e(a),n===!1||!a.defaultPrevented)return t==null?void 0:t(a)}}function we(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Ue(...e){return t=>{let n=!1;const r=e.map(a=>{const o=we(a,t);return!n&&typeof o=="function"&&(n=!0),o});if(n)return()=>{for(let a=0;a<r.length;a++){const o=r[a];typeof o=="function"?o():we(e[a],null)}}}}function F(...e){return c.useCallback(Ue(...e),e)}function Nt(e,t){const n=c.createContext(t),r=o=>{const l=o,{children:s}=l,i=P(l,["children"]),f=c.useMemo(()=>i,Object.values(i));return k.jsx(n.Provider,{value:f,children:s})};r.displayName=e+"Provider";function a(o){const s=c.useContext(n);if(s)return s;if(t!==void 0)return t;throw new Error(`\`${o}\` must be used within \`${e}\``)}return[r,a]}function Ot(e,t=[]){let n=[];function r(o,s){const i=c.createContext(s),f=n.length;n=[...n,s];const l=v=>{var g;const b=v,{scope:h,children:m}=b,w=P(b,["scope","children"]),p=((g=h==null?void 0:h[e])==null?void 0:g[f])||i,y=c.useMemo(()=>w,Object.values(w));return k.jsx(p.Provider,{value:y,children:m})};l.displayName=o+"Provider";function d(v,h){var p;const m=((p=h==null?void 0:h[e])==null?void 0:p[f])||i,w=c.useContext(m);if(w)return w;if(s!==void 0)return s;throw new Error(`\`${v}\` must be used within \`${o}\``)}return[l,d]}const a=()=>{const o=n.map(s=>c.createContext(s));return function(i){const f=(i==null?void 0:i[e])||o;return c.useMemo(()=>({[`__scope${e}`]:M(E({},i),{[e]:f})}),[i,f])}};return a.scopeName=e,[r,Dt(a,...t)]}function Dt(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(a=>({useScope:a(),scopeName:a.scopeName}));return function(o){const s=r.reduce((i,{useScope:f,scopeName:l})=>{const v=f(o)[`__scope${l}`];return E(E({},i),v)},{});return c.useMemo(()=>({[`__scope${t.scopeName}`]:s}),[s])}};return n.scopeName=t.scopeName,n}var z=globalThis!=null&&globalThis.document?c.useLayoutEffect:()=>{},Tt=Ie[" useId ".trim().toString()]||(()=>{}),Lt=0;function ce(e){const[t,n]=c.useState(Tt());return z(()=>{n(r=>r!=null?r:String(Lt++))},[e]),e||(t?`radix-${t}`:"")}var _t=Ie[" useInsertionEffect ".trim().toString()]||z;function It({prop:e,defaultProp:t,onChange:n=()=>{},caller:r}){const[a,o,s]=jt({defaultProp:t,onChange:n}),i=e!==void 0,f=i?e:a;{const d=c.useRef(e!==void 0);c.useEffect(()=>{const v=d.current;v!==i&&console.warn(`${r} is changing from ${v?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),d.current=i},[i,r])}const l=c.useCallback(d=>{var v;if(i){const h=Ft(d)?d(e):d;h!==e&&((v=s.current)==null||v.call(s,h))}else o(d)},[i,e,o,s]);return[f,l]}function jt({defaultProp:e,onChange:t}){const[n,r]=c.useState(e),a=c.useRef(n),o=c.useRef(t);return _t(()=>{o.current=t},[t]),c.useEffect(()=>{var s;a.current!==n&&((s=o.current)==null||s.call(o,n),a.current=n)},[n,a]),[n,r,o]}function Ft(e){return typeof e=="function"}function Be(e){const t=Wt(e),n=c.forwardRef((r,a)=>{const l=r,{children:o}=l,s=P(l,["children"]),i=c.Children.toArray(o),f=i.find(Bt);if(f){const d=f.props.children,v=i.map(h=>h===f?c.Children.count(d)>1?c.Children.only(null):c.isValidElement(d)?d.props.children:null:h);return k.jsx(t,M(E({},s),{ref:a,children:c.isValidElement(d)?c.cloneElement(d,void 0,v):null}))}return k.jsx(t,M(E({},s),{ref:a,children:o}))});return n.displayName=`${e}.Slot`,n}function Wt(e){const t=c.forwardRef((n,r)=>{const s=n,{children:a}=s,o=P(s,["children"]);if(c.isValidElement(a)){const i=zt(a),f=qt(o,a.props);return a.type!==c.Fragment&&(f.ref=r?Ue(r,i):i),c.cloneElement(a,f)}return c.Children.count(a)>1?c.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var Ut=Symbol("radix.slottable");function Bt(e){return c.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===Ut}function qt(e,t){const n=E({},t);for(const r in t){const a=e[r],o=t[r];/^on[A-Z]/.test(r)?a&&o?n[r]=(...i)=>{const f=o(...i);return a(...i),f}:a&&(n[r]=a):r==="style"?n[r]=E(E({},a),o):r==="className"&&(n[r]=[a,o].filter(Boolean).join(" "))}return E(E({},e),n)}function zt(e){var r,a;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(a=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:a.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var Ht=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],T=Ht.reduce((e,t)=>{const n=Be(`Primitive.${t}`),r=c.forwardRef((a,o)=>{const l=a,{asChild:s}=l,i=P(l,["asChild"]),f=s?n:t;return typeof window!="undefined"&&(window[Symbol.for("radix-ui")]=!0),k.jsx(f,M(E({},i),{ref:o}))});return r.displayName=`Primitive.${t}`,M(E({},e),{[t]:r})},{});function Vt(e,t){e&&kt.flushSync(()=>e.dispatchEvent(t))}function H(e){const t=c.useRef(e);return c.useEffect(()=>{t.current=e}),c.useMemo(()=>(...n)=>{var r;return(r=t.current)==null?void 0:r.call(t,...n)},[])}function $t(e,t=globalThis==null?void 0:globalThis.document){const n=H(e);c.useEffect(()=>{const r=a=>{a.key==="Escape"&&n(a)};return t.addEventListener("keydown",r,{capture:!0}),()=>t.removeEventListener("keydown",r,{capture:!0})},[n,t])}var Zt="DismissableLayer",ye="dismissableLayer.update",Gt="dismissableLayer.pointerDownOutside",Kt="dismissableLayer.focusOutside",Ce,qe=c.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),ze=c.forwardRef((e,t)=>{var I;const N=e,{disableOutsidePointerEvents:n=!1,onEscapeKeyDown:r,onPointerDownOutside:a,onFocusOutside:o,onInteractOutside:s,onDismiss:i}=N,f=P(N,["disableOutsidePointerEvents","onEscapeKeyDown","onPointerDownOutside","onFocusOutside","onInteractOutside","onDismiss"]),l=c.useContext(qe),[d,v]=c.useState(null),h=(I=d==null?void 0:d.ownerDocument)!=null?I:globalThis==null?void 0:globalThis.document,[,m]=c.useState({}),w=F(t,S=>v(S)),p=Array.from(l.layers),[y]=[...l.layersWithOutsidePointerEventsDisabled].slice(-1),b=p.indexOf(y),g=d?p.indexOf(d):-1,R=l.layersWithOutsidePointerEventsDisabled.size>0,C=g>=b,x=Qt(S=>{const V=S.target,ke=[...l.branches].some(oe=>oe.contains(V));!C||ke||(a==null||a(S),s==null||s(S),S.defaultPrevented||i==null||i())},h),A=Jt(S=>{const V=S.target;[...l.branches].some(oe=>oe.contains(V))||(o==null||o(S),s==null||s(S),S.defaultPrevented||i==null||i())},h);return $t(S=>{g===l.layers.size-1&&(r==null||r(S),!S.defaultPrevented&&i&&(S.preventDefault(),i()))},h),c.useEffect(()=>{if(d)return n&&(l.layersWithOutsidePointerEventsDisabled.size===0&&(Ce=h.body.style.pointerEvents,h.body.style.pointerEvents="none"),l.layersWithOutsidePointerEventsDisabled.add(d)),l.layers.add(d),Me(),()=>{n&&l.layersWithOutsidePointerEventsDisabled.size===1&&(h.body.style.pointerEvents=Ce)}},[d,h,n,l]),c.useEffect(()=>()=>{d&&(l.layers.delete(d),l.layersWithOutsidePointerEventsDisabled.delete(d),Me())},[d,l]),c.useEffect(()=>{const S=()=>m({});return document.addEventListener(ye,S),()=>document.removeEventListener(ye,S)},[]),k.jsx(T.div,M(E({},f),{ref:w,style:E({pointerEvents:R?C?"auto":"none":void 0},e.style),onFocusCapture:_(e.onFocusCapture,A.onFocusCapture),onBlurCapture:_(e.onBlurCapture,A.onBlurCapture),onPointerDownCapture:_(e.onPointerDownCapture,x.onPointerDownCapture)}))});ze.displayName=Zt;var Xt="DismissableLayerBranch",Yt=c.forwardRef((e,t)=>{const n=c.useContext(qe),r=c.useRef(null),a=F(t,r);return c.useEffect(()=>{const o=r.current;if(o)return n.branches.add(o),()=>{n.branches.delete(o)}},[n.branches]),k.jsx(T.div,M(E({},e),{ref:a}))});Yt.displayName=Xt;function Qt(e,t=globalThis==null?void 0:globalThis.document){const n=H(e),r=c.useRef(!1),a=c.useRef(()=>{});return c.useEffect(()=>{const o=i=>{if(i.target&&!r.current){let f=function(){He(Gt,n,l,{discrete:!0})};const l={originalEvent:i};i.pointerType==="touch"?(t.removeEventListener("click",a.current),a.current=f,t.addEventListener("click",a.current,{once:!0})):f()}else t.removeEventListener("click",a.current);r.current=!1},s=window.setTimeout(()=>{t.addEventListener("pointerdown",o)},0);return()=>{window.clearTimeout(s),t.removeEventListener("pointerdown",o),t.removeEventListener("click",a.current)}},[t,n]),{onPointerDownCapture:()=>r.current=!0}}function Jt(e,t=globalThis==null?void 0:globalThis.document){const n=H(e),r=c.useRef(!1);return c.useEffect(()=>{const a=o=>{o.target&&!r.current&&He(Kt,n,{originalEvent:o},{discrete:!1})};return t.addEventListener("focusin",a),()=>t.removeEventListener("focusin",a)},[t,n]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function Me(){const e=new CustomEvent(ye);document.dispatchEvent(e)}function He(e,t,n,{discrete:r}){const a=n.originalEvent.target,o=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});t&&a.addEventListener(e,t,{once:!0}),r?Vt(a,o):a.dispatchEvent(o)}var ie="focusScope.autoFocusOnMount",se="focusScope.autoFocusOnUnmount",Se={bubbles:!1,cancelable:!0},en="FocusScope",Ve=c.forwardRef((e,t)=>{const p=e,{loop:n=!1,trapped:r=!1,onMountAutoFocus:a,onUnmountAutoFocus:o}=p,s=P(p,["loop","trapped","onMountAutoFocus","onUnmountAutoFocus"]),[i,f]=c.useState(null),l=H(a),d=H(o),v=c.useRef(null),h=F(t,y=>f(y)),m=c.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;c.useEffect(()=>{if(r){let y=function(C){if(m.paused||!i)return;const x=C.target;i.contains(x)?v.current=x:L(v.current,{select:!0})},b=function(C){if(m.paused||!i)return;const x=C.relatedTarget;x!==null&&(i.contains(x)||L(v.current,{select:!0}))},g=function(C){if(document.activeElement===document.body)for(const A of C)A.removedNodes.length>0&&L(i)};document.addEventListener("focusin",y),document.addEventListener("focusout",b);const R=new MutationObserver(g);return i&&R.observe(i,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",y),document.removeEventListener("focusout",b),R.disconnect()}}},[r,i,m.paused]),c.useEffect(()=>{if(i){Pe.add(m);const y=document.activeElement;if(!i.contains(y)){const g=new CustomEvent(ie,Se);i.addEventListener(ie,l),i.dispatchEvent(g),g.defaultPrevented||(tn(cn($e(i)),{select:!0}),document.activeElement===y&&L(i))}return()=>{i.removeEventListener(ie,l),setTimeout(()=>{const g=new CustomEvent(se,Se);i.addEventListener(se,d),i.dispatchEvent(g),g.defaultPrevented||L(y!=null?y:document.body,{select:!0}),i.removeEventListener(se,d),Pe.remove(m)},0)}}},[i,l,d,m]);const w=c.useCallback(y=>{if(!n&&!r||m.paused)return;const b=y.key==="Tab"&&!y.altKey&&!y.ctrlKey&&!y.metaKey,g=document.activeElement;if(b&&g){const R=y.currentTarget,[C,x]=nn(R);C&&x?!y.shiftKey&&g===x?(y.preventDefault(),n&&L(C,{select:!0})):y.shiftKey&&g===C&&(y.preventDefault(),n&&L(x,{select:!0})):g===R&&y.preventDefault()}},[n,r,m.paused]);return k.jsx(T.div,M(E({tabIndex:-1},s),{ref:h,onKeyDown:w}))});Ve.displayName=en;function tn(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(L(r,{select:t}),document.activeElement!==n)return}function nn(e){const t=$e(e),n=Re(t,e),r=Re(t.reverse(),e);return[n,r]}function $e(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const a=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||a?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function Re(e,t){for(const n of e)if(!rn(n,{upTo:t}))return n}function rn(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function an(e){return e instanceof HTMLInputElement&&"select"in e}function L(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&an(e)&&t&&e.select()}}var Pe=on();function on(){let e=[];return{add(t){const n=e[0];t!==n&&(n==null||n.pause()),e=Ae(e,t),e.unshift(t)},remove(t){var n;e=Ae(e,t),(n=e[0])==null||n.resume()}}}function Ae(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function cn(e){return e.filter(t=>t.tagName!=="A")}var sn="Portal",Ze=c.forwardRef((e,t)=>{var f;const i=e,{container:n}=i,r=P(i,["container"]),[a,o]=c.useState(!1);z(()=>o(!0),[]);const s=n||a&&((f=globalThis==null?void 0:globalThis.document)==null?void 0:f.body);return s?Et.createPortal(k.jsx(T.div,M(E({},r),{ref:t})),s):null});Ze.displayName=sn;function ln(e,t){return c.useReducer((n,r)=>{const a=t[n][r];return a!=null?a:n},e)}var ne=e=>{const{present:t,children:n}=e,r=un(t),a=typeof n=="function"?n({present:r.isPresent}):c.Children.only(n),o=F(r.ref,dn(a));return typeof n=="function"||r.isPresent?c.cloneElement(a,{ref:o}):null};ne.displayName="Presence";function un(e){const[t,n]=c.useState(),r=c.useRef(null),a=c.useRef(e),o=c.useRef("none"),s=e?"mounted":"unmounted",[i,f]=ln(s,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return c.useEffect(()=>{const l=Z(r.current);o.current=i==="mounted"?l:"none"},[i]),z(()=>{const l=r.current,d=a.current;if(d!==e){const h=o.current,m=Z(l);e?f("MOUNT"):m==="none"||(l==null?void 0:l.display)==="none"?f("UNMOUNT"):f(d&&h!==m?"ANIMATION_OUT":"UNMOUNT"),a.current=e}},[e,f]),z(()=>{var l;if(t){let d;const v=(l=t.ownerDocument.defaultView)!=null?l:window,h=w=>{const y=Z(r.current).includes(CSS.escape(w.animationName));if(w.target===t&&y&&(f("ANIMATION_END"),!a.current)){const b=t.style.animationFillMode;t.style.animationFillMode="forwards",d=v.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=b)})}},m=w=>{w.target===t&&(o.current=Z(r.current))};return t.addEventListener("animationstart",m),t.addEventListener("animationcancel",h),t.addEventListener("animationend",h),()=>{v.clearTimeout(d),t.removeEventListener("animationstart",m),t.removeEventListener("animationcancel",h),t.removeEventListener("animationend",h)}}else f("ANIMATION_END")},[t,f]),{isPresent:["mounted","unmountSuspended"].includes(i),ref:c.useCallback(l=>{r.current=l?getComputedStyle(l):null,n(l)},[])}}function Z(e){return(e==null?void 0:e.animationName)||"none"}function dn(e){var r,a;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(a=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:a.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var le=0;function fn(){c.useEffect(()=>{var t,n;const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",(t=e[0])!=null?t:Ne()),document.body.insertAdjacentElement("beforeend",(n=e[1])!=null?n:Ne()),le++,()=>{le===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(r=>r.remove()),le--}},[])}function Ne(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var D=function(){return D=Object.assign||function(t){for(var n,r=1,a=arguments.length;r<a;r++){n=arguments[r];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},D.apply(this,arguments)};function Ge(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n}function hn(e,t,n){if(n||arguments.length===2)for(var r=0,a=t.length,o;r<a;r++)(o||!(r in t))&&(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return e.concat(o||Array.prototype.slice.call(t))}var Q="right-scroll-bar-position",J="width-before-scroll-bar",yn="with-scroll-bars-hidden",vn="--removed-body-scroll-bar-size";function ue(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function pn(e,t){var n=c.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var a=n.value;a!==r&&(n.value=r,n.callback(r,a))}}}})[0];return n.callback=t,n.facade}var mn=typeof window!="undefined"?c.useLayoutEffect:c.useEffect,Oe=new WeakMap;function gn(e,t){var n=pn(null,function(r){return e.forEach(function(a){return ue(a,r)})});return mn(function(){var r=Oe.get(n);if(r){var a=new Set(r),o=new Set(e),s=n.current;a.forEach(function(i){o.has(i)||ue(i,null)}),o.forEach(function(i){a.has(i)||ue(i,s)})}Oe.set(n,e)},[e]),n}function kn(e){return e}function En(e,t){t===void 0&&(t=kn);var n=[],r=!1,a={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(o){var s=t(o,r);return n.push(s),function(){n=n.filter(function(i){return i!==s})}},assignSyncMedium:function(o){for(r=!0;n.length;){var s=n;n=[],s.forEach(o)}n={push:function(i){return o(i)},filter:function(){return n}}},assignMedium:function(o){r=!0;var s=[];if(n.length){var i=n;n=[],i.forEach(o),s=n}var f=function(){var d=s;s=[],d.forEach(o)},l=function(){return Promise.resolve().then(f)};l(),n={push:function(d){s.push(d),l()},filter:function(d){return s=s.filter(d),n}}}};return a}function bn(e){e===void 0&&(e={});var t=En(null);return t.options=D({async:!0,ssr:!1},e),t}var Ke=function(e){var t=e.sideCar,n=Ge(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return c.createElement(r,D({},n))};Ke.isSideCarExport=!0;function xn(e,t){return e.useMedium(t),Ke}var Xe=bn(),de=function(){},re=c.forwardRef(function(e,t){var n=c.useRef(null),r=c.useState({onScrollCapture:de,onWheelCapture:de,onTouchMoveCapture:de}),a=r[0],o=r[1],s=e.forwardProps,i=e.children,f=e.className,l=e.removeScrollBar,d=e.enabled,v=e.shards,h=e.sideCar,m=e.noRelative,w=e.noIsolation,p=e.inert,y=e.allowPinchZoom,b=e.as,g=b===void 0?"div":b,R=e.gapMode,C=Ge(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),x=h,A=gn([n,t]),N=D(D({},C),a);return c.createElement(c.Fragment,null,d&&c.createElement(x,{sideCar:Xe,removeScrollBar:l,shards:v,noRelative:m,noIsolation:w,inert:p,setCallbacks:o,allowPinchZoom:!!y,lockRef:n,gapMode:R}),s?c.cloneElement(c.Children.only(i),D(D({},N),{ref:A})):c.createElement(g,D({},N,{className:f,ref:A}),i))});re.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};re.classNames={fullWidth:J,zeroRight:Q};var wn=function(){if(typeof __webpack_nonce__!="undefined")return __webpack_nonce__};function Cn(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=wn();return t&&e.setAttribute("nonce",t),e}function Mn(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function Sn(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Rn=function(){var e=0,t=null;return{add:function(n){e==0&&(t=Cn())&&(Mn(t,n),Sn(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Pn=function(){var e=Rn();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},Ye=function(){var e=Pn(),t=function(n){var r=n.styles,a=n.dynamic;return e(r,a),null};return t},An={left:0,top:0,right:0,gap:0},fe=function(e){return parseInt(e||"",10)||0},Nn=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[fe(n),fe(r),fe(a)]},On=function(e){if(e===void 0&&(e="margin"),typeof window=="undefined")return An;var t=Nn(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Dn=Ye(),q="data-scroll-locked",Tn=function(e,t,n,r){var a=e.left,o=e.top,s=e.right,i=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(yn,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(i,"px ").concat(r,`;
  }
  body[`).concat(q,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(s,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(i,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Q,` {
    right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(J,` {
    margin-right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(Q," .").concat(Q,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(J," .").concat(J,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(q,`] {
    `).concat(vn,": ").concat(i,`px;
  }
`)},De=function(){var e=parseInt(document.body.getAttribute(q)||"0",10);return isFinite(e)?e:0},Ln=function(){c.useEffect(function(){return document.body.setAttribute(q,(De()+1).toString()),function(){var e=De()-1;e<=0?document.body.removeAttribute(q):document.body.setAttribute(q,e.toString())}},[])},_n=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,a=r===void 0?"margin":r;Ln();var o=c.useMemo(function(){return On(a)},[a]);return c.createElement(Dn,{styles:Tn(o,!t,a,n?"":"!important")})},ve=!1;if(typeof window!="undefined")try{var G=Object.defineProperty({},"passive",{get:function(){return ve=!0,!0}});window.addEventListener("test",G,G),window.removeEventListener("test",G,G)}catch(e){ve=!1}var W=ve?{passive:!1}:!1,In=function(e){return e.tagName==="TEXTAREA"},Qe=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!In(e)&&n[t]==="visible")},jn=function(e){return Qe(e,"overflowY")},Fn=function(e){return Qe(e,"overflowX")},Te=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot!="undefined"&&r instanceof ShadowRoot&&(r=r.host);var a=Je(e,r);if(a){var o=et(e,r),s=o[1],i=o[2];if(s>i)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},Wn=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},Un=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},Je=function(e,t){return e==="v"?jn(t):Fn(t)},et=function(e,t){return e==="v"?Wn(t):Un(t)},Bn=function(e,t){return e==="h"&&t==="rtl"?-1:1},qn=function(e,t,n,r,a){var o=Bn(e,window.getComputedStyle(t).direction),s=o*r,i=n.target,f=t.contains(i),l=!1,d=s>0,v=0,h=0;do{if(!i)break;var m=et(e,i),w=m[0],p=m[1],y=m[2],b=p-y-o*w;(w||b)&&Je(e,i)&&(v+=b,h+=w);var g=i.parentNode;i=g&&g.nodeType===Node.DOCUMENT_FRAGMENT_NODE?g.host:g}while(!f&&i!==document.body||f&&(t.contains(i)||t===i));return(d&&Math.abs(v)<1||!d&&Math.abs(h)<1)&&(l=!0),l},K=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Le=function(e){return[e.deltaX,e.deltaY]},_e=function(e){return e&&"current"in e?e.current:e},zn=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Hn=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Vn=0,U=[];function $n(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),a=c.useState(Vn++)[0],o=c.useState(Ye)[0],s=c.useRef(e);c.useEffect(function(){s.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var p=hn([e.lockRef.current],(e.shards||[]).map(_e),!0).filter(Boolean);return p.forEach(function(y){return y.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),p.forEach(function(y){return y.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var i=c.useCallback(function(p,y){if("touches"in p&&p.touches.length===2||p.type==="wheel"&&p.ctrlKey)return!s.current.allowPinchZoom;var b=K(p),g=n.current,R="deltaX"in p?p.deltaX:g[0]-b[0],C="deltaY"in p?p.deltaY:g[1]-b[1],x,A=p.target,N=Math.abs(R)>Math.abs(C)?"h":"v";if("touches"in p&&N==="h"&&A.type==="range")return!1;var I=Te(N,A);if(!I)return!0;if(I?x=N:(x=N==="v"?"h":"v",I=Te(N,A)),!I)return!1;if(!r.current&&"changedTouches"in p&&(R||C)&&(r.current=x),!x)return!0;var S=r.current||x;return qn(S,y,p,S==="h"?R:C)},[]),f=c.useCallback(function(p){var y=p;if(!(!U.length||U[U.length-1]!==o)){var b="deltaY"in y?Le(y):K(y),g=t.current.filter(function(x){return x.name===y.type&&(x.target===y.target||y.target===x.shadowParent)&&zn(x.delta,b)})[0];if(g&&g.should){y.cancelable&&y.preventDefault();return}if(!g){var R=(s.current.shards||[]).map(_e).filter(Boolean).filter(function(x){return x.contains(y.target)}),C=R.length>0?i(y,R[0]):!s.current.noIsolation;C&&y.cancelable&&y.preventDefault()}}},[]),l=c.useCallback(function(p,y,b,g){var R={name:p,delta:y,target:b,should:g,shadowParent:Zn(b)};t.current.push(R),setTimeout(function(){t.current=t.current.filter(function(C){return C!==R})},1)},[]),d=c.useCallback(function(p){n.current=K(p),r.current=void 0},[]),v=c.useCallback(function(p){l(p.type,Le(p),p.target,i(p,e.lockRef.current))},[]),h=c.useCallback(function(p){l(p.type,K(p),p.target,i(p,e.lockRef.current))},[]);c.useEffect(function(){return U.push(o),e.setCallbacks({onScrollCapture:v,onWheelCapture:v,onTouchMoveCapture:h}),document.addEventListener("wheel",f,W),document.addEventListener("touchmove",f,W),document.addEventListener("touchstart",d,W),function(){U=U.filter(function(p){return p!==o}),document.removeEventListener("wheel",f,W),document.removeEventListener("touchmove",f,W),document.removeEventListener("touchstart",d,W)}},[]);var m=e.removeScrollBar,w=e.inert;return c.createElement(c.Fragment,null,w?c.createElement(o,{styles:Hn(a)}):null,m?c.createElement(_n,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function Zn(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Gn=xn(Xe,$n);var tt=c.forwardRef(function(e,t){return c.createElement(re,D({},e,{ref:t,sideCar:Gn}))});tt.classNames=re.classNames;var Kn=function(e){if(typeof document=="undefined")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},B=new WeakMap,X=new WeakMap,Y={},he=0,nt=function(e){return e&&(e.host||nt(e.parentNode))},Xn=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=nt(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},Yn=function(e,t,n,r){var a=Xn(t,Array.isArray(e)?e:[e]);Y[n]||(Y[n]=new WeakMap);var o=Y[n],s=[],i=new Set,f=new Set(a),l=function(v){!v||i.has(v)||(i.add(v),l(v.parentNode))};a.forEach(l);var d=function(v){!v||f.has(v)||Array.prototype.forEach.call(v.children,function(h){if(i.has(h))d(h);else try{var m=h.getAttribute(r),w=m!==null&&m!=="false",p=(B.get(h)||0)+1,y=(o.get(h)||0)+1;B.set(h,p),o.set(h,y),s.push(h),p===1&&w&&X.set(h,!0),y===1&&h.setAttribute(n,"true"),w||h.setAttribute(r,"true")}catch(b){console.error("aria-hidden: cannot operate on ",h,b)}})};return d(t),i.clear(),he++,function(){s.forEach(function(v){var h=B.get(v)-1,m=o.get(v)-1;B.set(v,h),o.set(v,m),h||(X.has(v)||v.removeAttribute(r),X.delete(v)),m||v.removeAttribute(n)}),he--,he||(B=new WeakMap,B=new WeakMap,X=new WeakMap,Y={})}},Qn=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),a=Kn(e);return a?(r.push.apply(r,Array.from(a.querySelectorAll("[aria-live], script"))),Yn(r,a,n,"aria-hidden")):function(){return null}},ae="Dialog",[rt]=Ot(ae),[Jn,O]=rt(ae),at=e=>{const{__scopeDialog:t,children:n,open:r,defaultOpen:a,onOpenChange:o,modal:s=!0}=e,i=c.useRef(null),f=c.useRef(null),[l,d]=It({prop:r,defaultProp:a!=null?a:!1,onChange:o,caller:ae});return k.jsx(Jn,{scope:t,triggerRef:i,contentRef:f,contentId:ce(),titleId:ce(),descriptionId:ce(),open:l,onOpenChange:d,onOpenToggle:c.useCallback(()=>d(v=>!v),[d]),modal:s,children:n})};at.displayName=ae;var ot="DialogTrigger",er=c.forwardRef((e,t)=>{const s=e,{__scopeDialog:n}=s,r=P(s,["__scopeDialog"]),a=O(ot,n),o=F(t,a.triggerRef);return k.jsx(T.button,M(E({type:"button","aria-haspopup":"dialog","aria-expanded":a.open,"aria-controls":a.contentId,"data-state":ge(a.open)},r),{ref:o,onClick:_(e.onClick,a.onOpenToggle)}))});er.displayName=ot;var pe="DialogPortal",[tr,ct]=rt(pe,{forceMount:void 0}),it=e=>{const{__scopeDialog:t,forceMount:n,children:r,container:a}=e,o=O(pe,t);return k.jsx(tr,{scope:t,forceMount:n,children:c.Children.map(r,s=>k.jsx(ne,{present:n||o.open,children:k.jsx(Ze,{asChild:!0,container:a,children:s})}))})};it.displayName=pe;var ee="DialogOverlay",st=c.forwardRef((e,t)=>{const n=ct(ee,e.__scopeDialog),s=e,{forceMount:r=n.forceMount}=s,a=P(s,["forceMount"]),o=O(ee,e.__scopeDialog);return o.modal?k.jsx(ne,{present:r||o.open,children:k.jsx(rr,M(E({},a),{ref:t}))}):null});st.displayName=ee;var nr=Be("DialogOverlay.RemoveScroll"),rr=c.forwardRef((e,t)=>{const o=e,{__scopeDialog:n}=o,r=P(o,["__scopeDialog"]),a=O(ee,n);return k.jsx(tt,{as:nr,allowPinchZoom:!0,shards:[a.contentRef],children:k.jsx(T.div,M(E({"data-state":ge(a.open)},r),{ref:t,style:E({pointerEvents:"auto"},r.style)}))})}),j="DialogContent",lt=c.forwardRef((e,t)=>{const n=ct(j,e.__scopeDialog),s=e,{forceMount:r=n.forceMount}=s,a=P(s,["forceMount"]),o=O(j,e.__scopeDialog);return k.jsx(ne,{present:r||o.open,children:o.modal?k.jsx(ar,M(E({},a),{ref:t})):k.jsx(or,M(E({},a),{ref:t}))})});lt.displayName=j;var ar=c.forwardRef((e,t)=>{const n=O(j,e.__scopeDialog),r=c.useRef(null),a=F(t,n.contentRef,r);return c.useEffect(()=>{const o=r.current;if(o)return Qn(o)},[]),k.jsx(ut,M(E({},e),{ref:a,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:_(e.onCloseAutoFocus,o=>{var s;o.preventDefault(),(s=n.triggerRef.current)==null||s.focus()}),onPointerDownOutside:_(e.onPointerDownOutside,o=>{const s=o.detail.originalEvent,i=s.button===0&&s.ctrlKey===!0;(s.button===2||i)&&o.preventDefault()}),onFocusOutside:_(e.onFocusOutside,o=>o.preventDefault())}))}),or=c.forwardRef((e,t)=>{const n=O(j,e.__scopeDialog),r=c.useRef(!1),a=c.useRef(!1);return k.jsx(ut,M(E({},e),{ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:o=>{var s,i;(s=e.onCloseAutoFocus)==null||s.call(e,o),o.defaultPrevented||(r.current||(i=n.triggerRef.current)==null||i.focus(),o.preventDefault()),r.current=!1,a.current=!1},onInteractOutside:o=>{var f,l;(f=e.onInteractOutside)==null||f.call(e,o),o.defaultPrevented||(r.current=!0,o.detail.originalEvent.type==="pointerdown"&&(a.current=!0));const s=o.target;((l=n.triggerRef.current)==null?void 0:l.contains(s))&&o.preventDefault(),o.detail.originalEvent.type==="focusin"&&a.current&&o.preventDefault()}}))}),ut=c.forwardRef((e,t)=>{const d=e,{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:a,onCloseAutoFocus:o}=d,s=P(d,["__scopeDialog","trapFocus","onOpenAutoFocus","onCloseAutoFocus"]),i=O(j,n),f=c.useRef(null),l=F(t,f);return fn(),k.jsxs(k.Fragment,{children:[k.jsx(Ve,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:a,onUnmountAutoFocus:o,children:k.jsx(ze,M(E({role:"dialog",id:i.contentId,"aria-describedby":i.descriptionId,"aria-labelledby":i.titleId,"data-state":ge(i.open)},s),{ref:l,onDismiss:()=>i.onOpenChange(!1)}))}),k.jsxs(k.Fragment,{children:[k.jsx(sr,{titleId:i.titleId}),k.jsx(ur,{contentRef:f,descriptionId:i.descriptionId})]})]})}),me="DialogTitle",cr=c.forwardRef((e,t)=>{const o=e,{__scopeDialog:n}=o,r=P(o,["__scopeDialog"]),a=O(me,n);return k.jsx(T.h2,M(E({id:a.titleId},r),{ref:t}))});cr.displayName=me;var dt="DialogDescription",ir=c.forwardRef((e,t)=>{const o=e,{__scopeDialog:n}=o,r=P(o,["__scopeDialog"]),a=O(dt,n);return k.jsx(T.p,M(E({id:a.descriptionId},r),{ref:t}))});ir.displayName=dt;var ft="DialogClose",ht=c.forwardRef((e,t)=>{const o=e,{__scopeDialog:n}=o,r=P(o,["__scopeDialog"]),a=O(ft,n);return k.jsx(T.button,M(E({type:"button"},r),{ref:t,onClick:_(e.onClick,()=>a.onOpenChange(!1))}))});ht.displayName=ft;function ge(e){return e?"open":"closed"}var yt="DialogTitleWarning",[Ra,vt]=Nt(yt,{contentName:j,titleName:me,docsSlug:"dialog"}),sr=({titleId:e})=>{const t=vt(yt),n=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return c.useEffect(()=>{e&&(document.getElementById(e)||console.error(n))},[n,e]),null},lr="DialogDescriptionWarning",ur=({contentRef:e,descriptionId:t})=>{const r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${vt(lr).contentName}}.`;return c.useEffect(()=>{var o;const a=(o=e.current)==null?void 0:o.getAttribute("aria-describedby");t&&a&&(document.getElementById(t)||console.warn(r))},[r,e,t]),null},Pa=at,Aa=it,Na=st,Oa=lt,Da=ht;export{Fr as $,vr as A,gr as B,Ar as C,Tr as D,_r as E,jr as F,Wr as G,qr as H,hr as I,Dr as J,Vr as K,$r as L,Xr as M,Lr as N,Or as O,ea as P,ra as Q,la as R,aa as S,va as T,ma as U,wa as V,pa as W,Ma as X,yr as Y,Sa as Z,Qr as _,ta as a,zr as a0,Ca as a1,Hr as a2,kr as a3,ka as a4,Br as a5,Yr as a6,sa as a7,xr as a8,Ur as a9,Zr as aa,ca as ab,Cr as ac,Mr as ad,Pa as ae,Aa as af,Na as ag,Oa as ah,br as ai,Da as aj,xa as b,na as c,da as d,Er as e,Ea as f,Jr as g,ya as h,ha as i,k as j,fa as k,Pr as l,ia as m,Kr as n,Gr as o,Ir as p,ga as q,pr as r,ba as s,Rr as t,oa as u,Nr as v,Sr as w,wr as x,ua as y,mr as z};
