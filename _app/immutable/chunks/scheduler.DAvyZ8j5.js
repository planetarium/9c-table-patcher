function Fr(){}const Nt=e=>e;function $r(e,o){for(const c in o)e[c]=o[c];return e}function rt(e){return e()}function Rt(){return Object.create(null)}function tt(e){e.forEach(rt)}function et(e){return typeof e=="function"}function Ot(e,o){return e!=e?o==o:e!==o||e&&typeof e=="object"||typeof e=="function"}function jt(e){return Object.keys(e).length===0}function nt(e,...o){if(e==null){for(const f of o)f(void 0);return Fr}const c=e.subscribe(...o);return c.unsubscribe?()=>c.unsubscribe():c}function Ht(e,o,c){e.$$.on_destroy.push(nt(o,c))}function Wt(e,o,c,f){if(e){const p=Ar(e,o,c,f);return e[0](p)}}function Ar(e,o,c,f){return e[1]&&f?$r(c.ctx.slice(),e[1](f(o))):c.ctx}function qt(e,o,c,f){if(e[2]&&f){const p=e[2](f(c));if(o.dirty===void 0)return p;if(typeof p=="object"){const y=[],h=Math.max(o.dirty.length,p.length);for(let a=0;a<h;a+=1)y[a]=o.dirty[a]|p[a];return y}return o.dirty|p}return o.dirty}function Yt(e,o,c,f,p,y){if(p){const h=Ar(o,c,f,y);e.p(h,p)}}function Gt(e){if(e.ctx.length>32){const o=[],c=e.ctx.length/32;for(let f=0;f<c;f++)o[f]=-1;return o}return-1}function Xt(e){const o={};for(const c in e)c[0]!=="$"&&(o[c]=e[c]);return o}function zt(e,o){const c={};o=new Set(o);for(const f in e)!o.has(f)&&f[0]!=="$"&&(c[f]=e[f]);return c}function Jt(e){const o={};for(const c in e)o[c]=!0;return o}function Pt(e){return e&&et(e.destroy)?e.destroy:Fr}var Qt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function it(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ot={},V={};V.byteLength=ct;V.toByteArray=lt;V.fromByteArray=pt;var L=[],b=[],ut=typeof Uint8Array<"u"?Uint8Array:Array,tr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var O=0,at=tr.length;O<at;++O)L[O]=tr[O],b[tr.charCodeAt(O)]=O;b[45]=62;b[95]=63;function Br(e){var o=e.length;if(o%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var c=e.indexOf("=");c===-1&&(c=o);var f=c===o?0:4-c%4;return[c,f]}function ct(e){var o=Br(e),c=o[0],f=o[1];return(c+f)*3/4-f}function ft(e,o,c){return(o+c)*3/4-c}function lt(e){var o,c=Br(e),f=c[0],p=c[1],y=new ut(ft(e,f,p)),h=0,a=p>0?f-4:f,w;for(w=0;w<a;w+=4)o=b[e.charCodeAt(w)]<<18|b[e.charCodeAt(w+1)]<<12|b[e.charCodeAt(w+2)]<<6|b[e.charCodeAt(w+3)],y[h++]=o>>16&255,y[h++]=o>>8&255,y[h++]=o&255;return p===2&&(o=b[e.charCodeAt(w)]<<2|b[e.charCodeAt(w+1)]>>4,y[h++]=o&255),p===1&&(o=b[e.charCodeAt(w)]<<10|b[e.charCodeAt(w+1)]<<4|b[e.charCodeAt(w+2)]>>2,y[h++]=o>>8&255,y[h++]=o&255),y}function st(e){return L[e>>18&63]+L[e>>12&63]+L[e>>6&63]+L[e&63]}function ht(e,o,c){for(var f,p=[],y=o;y<c;y+=3)f=(e[y]<<16&16711680)+(e[y+1]<<8&65280)+(e[y+2]&255),p.push(st(f));return p.join("")}function pt(e){for(var o,c=e.length,f=c%3,p=[],y=16383,h=0,a=c-f;h<a;h+=y)p.push(ht(e,h,h+y>a?a:h+y));return f===1?(o=e[c-1],p.push(L[o>>2]+L[o<<4&63]+"==")):f===2&&(o=(e[c-2]<<8)+e[c-1],p.push(L[o>>10]+L[o>>4&63]+L[o<<2&63]+"=")),p.join("")}var cr={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */cr.read=function(e,o,c,f,p){var y,h,a=p*8-f-1,w=(1<<a)-1,_=w>>1,d=-7,F=c?p-1:0,I=c?-1:1,T=e[o+F];for(F+=I,y=T&(1<<-d)-1,T>>=-d,d+=a;d>0;y=y*256+e[o+F],F+=I,d-=8);for(h=y&(1<<-d)-1,y>>=-d,d+=f;d>0;h=h*256+e[o+F],F+=I,d-=8);if(y===0)y=1-_;else{if(y===w)return h?NaN:(T?-1:1)*(1/0);h=h+Math.pow(2,f),y=y-_}return(T?-1:1)*h*Math.pow(2,y-f)};cr.write=function(e,o,c,f,p,y){var h,a,w,_=y*8-p-1,d=(1<<_)-1,F=d>>1,I=p===23?Math.pow(2,-24)-Math.pow(2,-77):0,T=f?0:y-1,Y=f?1:-1,G=o<0||o===0&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(a=isNaN(o)?1:0,h=d):(h=Math.floor(Math.log(o)/Math.LN2),o*(w=Math.pow(2,-h))<1&&(h--,w*=2),h+F>=1?o+=I/w:o+=I*Math.pow(2,1-F),o*w>=2&&(h++,w/=2),h+F>=d?(a=0,h=d):h+F>=1?(a=(o*w-1)*Math.pow(2,p),h=h+F):(a=o*Math.pow(2,F-1)*Math.pow(2,p),h=0));p>=8;e[c+T]=a&255,T+=Y,a/=256,p-=8);for(h=h<<p|a,_+=p;_>0;e[c+T]=h&255,T+=Y,h/=256,_-=8);e[c+T-Y]|=G*128};/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */(function(e){var o=V,c=cr,f=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=a,e.SlowBuffer=Mr,e.INSPECT_MAX_BYTES=50;var p=2147483647;e.kMaxLength=p,a.TYPED_ARRAY_SUPPORT=y(),!a.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function y(){try{var n=new Uint8Array(1),r={foo:function(){return 42}};return Object.setPrototypeOf(r,Uint8Array.prototype),Object.setPrototypeOf(n,r),n.foo()===42}catch{return!1}}Object.defineProperty(a.prototype,"parent",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.buffer}}),Object.defineProperty(a.prototype,"offset",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.byteOffset}});function h(n){if(n>p)throw new RangeError('The value "'+n+'" is invalid for option "size"');var r=new Uint8Array(n);return Object.setPrototypeOf(r,a.prototype),r}function a(n,r,t){if(typeof n=="number"){if(typeof r=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return F(n)}return w(n,r,t)}a.poolSize=8192;function w(n,r,t){if(typeof n=="string")return I(n,r);if(ArrayBuffer.isView(n))return Y(n);if(n==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof n);if(C(n,ArrayBuffer)||n&&C(n.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(C(n,SharedArrayBuffer)||n&&C(n.buffer,SharedArrayBuffer)))return G(n,r,t);if(typeof n=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');var i=n.valueOf&&n.valueOf();if(i!=null&&i!==n)return a.from(i,r,t);var u=Dr(n);if(u)return u;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof n[Symbol.toPrimitive]=="function")return a.from(n[Symbol.toPrimitive]("string"),r,t);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof n)}a.from=function(n,r,t){return w(n,r,t)},Object.setPrototypeOf(a.prototype,Uint8Array.prototype),Object.setPrototypeOf(a,Uint8Array);function _(n){if(typeof n!="number")throw new TypeError('"size" argument must be of type number');if(n<0)throw new RangeError('The value "'+n+'" is invalid for option "size"')}function d(n,r,t){return _(n),n<=0?h(n):r!==void 0?typeof t=="string"?h(n).fill(r,t):h(n).fill(r):h(n)}a.alloc=function(n,r,t){return d(n,r,t)};function F(n){return _(n),h(n<0?0:Z(n)|0)}a.allocUnsafe=function(n){return F(n)},a.allocUnsafeSlow=function(n){return F(n)};function I(n,r){if((typeof r!="string"||r==="")&&(r="utf8"),!a.isEncoding(r))throw new TypeError("Unknown encoding: "+r);var t=sr(n,r)|0,i=h(t),u=i.write(n,r);return u!==t&&(i=i.slice(0,u)),i}function T(n){for(var r=n.length<0?0:Z(n.length)|0,t=h(r),i=0;i<r;i+=1)t[i]=n[i]&255;return t}function Y(n){if(C(n,Uint8Array)){var r=new Uint8Array(n);return G(r.buffer,r.byteOffset,r.byteLength)}return T(n)}function G(n,r,t){if(r<0||n.byteLength<r)throw new RangeError('"offset" is outside of buffer bounds');if(n.byteLength<r+(t||0))throw new RangeError('"length" is outside of buffer bounds');var i;return r===void 0&&t===void 0?i=new Uint8Array(n):t===void 0?i=new Uint8Array(n,r):i=new Uint8Array(n,r,t),Object.setPrototypeOf(i,a.prototype),i}function Dr(n){if(a.isBuffer(n)){var r=Z(n.length)|0,t=h(r);return t.length===0||n.copy(t,0,0,r),t}if(n.length!==void 0)return typeof n.length!="number"||rr(n.length)?h(0):T(n);if(n.type==="Buffer"&&Array.isArray(n.data))return T(n.data)}function Z(n){if(n>=p)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+p.toString(16)+" bytes");return n|0}function Mr(n){return+n!=n&&(n=0),a.alloc(+n)}a.isBuffer=function(r){return r!=null&&r._isBuffer===!0&&r!==a.prototype},a.compare=function(r,t){if(C(r,Uint8Array)&&(r=a.from(r,r.offset,r.byteLength)),C(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),!a.isBuffer(r)||!a.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(r===t)return 0;for(var i=r.length,u=t.length,l=0,s=Math.min(i,u);l<s;++l)if(r[l]!==t[l]){i=r[l],u=t[l];break}return i<u?-1:u<i?1:0},a.isEncoding=function(r){switch(String(r).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},a.concat=function(r,t){if(!Array.isArray(r))throw new TypeError('"list" argument must be an Array of Buffers');if(r.length===0)return a.alloc(0);var i;if(t===void 0)for(t=0,i=0;i<r.length;++i)t+=r[i].length;var u=a.allocUnsafe(t),l=0;for(i=0;i<r.length;++i){var s=r[i];if(C(s,Uint8Array))l+s.length>u.length?a.from(s).copy(u,l):Uint8Array.prototype.set.call(u,s,l);else if(a.isBuffer(s))s.copy(u,l);else throw new TypeError('"list" argument must be an Array of Buffers');l+=s.length}return u};function sr(n,r){if(a.isBuffer(n))return n.length;if(ArrayBuffer.isView(n)||C(n,ArrayBuffer))return n.byteLength;if(typeof n!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof n);var t=n.length,i=arguments.length>2&&arguments[2]===!0;if(!i&&t===0)return 0;for(var u=!1;;)switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return $(n).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return dr(n).length;default:if(u)return i?-1:$(n).length;r=(""+r).toLowerCase(),u=!0}}a.byteLength=sr;function Nr(n,r,t){var i=!1;if((r===void 0||r<0)&&(r=0),r>this.length||((t===void 0||t>this.length)&&(t=this.length),t<=0)||(t>>>=0,r>>>=0,t<=r))return"";for(n||(n="utf8");;)switch(n){case"hex":return zr(this,r,t);case"utf8":case"utf-8":return yr(this,r,t);case"ascii":return Gr(this,r,t);case"latin1":case"binary":return Xr(this,r,t);case"base64":return qr(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Jr(this,r,t);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(n+"").toLowerCase(),i=!0}}a.prototype._isBuffer=!0;function N(n,r,t){var i=n[r];n[r]=n[t],n[t]=i}a.prototype.swap16=function(){var r=this.length;if(r%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<r;t+=2)N(this,t,t+1);return this},a.prototype.swap32=function(){var r=this.length;if(r%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<r;t+=4)N(this,t,t+3),N(this,t+1,t+2);return this},a.prototype.swap64=function(){var r=this.length;if(r%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<r;t+=8)N(this,t,t+7),N(this,t+1,t+6),N(this,t+2,t+5),N(this,t+3,t+4);return this},a.prototype.toString=function(){var r=this.length;return r===0?"":arguments.length===0?yr(this,0,r):Nr.apply(this,arguments)},a.prototype.toLocaleString=a.prototype.toString,a.prototype.equals=function(r){if(!a.isBuffer(r))throw new TypeError("Argument must be a Buffer");return this===r?!0:a.compare(this,r)===0},a.prototype.inspect=function(){var r="",t=e.INSPECT_MAX_BYTES;return r=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim(),this.length>t&&(r+=" ... "),"<Buffer "+r+">"},f&&(a.prototype[f]=a.prototype.inspect),a.prototype.compare=function(r,t,i,u,l){if(C(r,Uint8Array)&&(r=a.from(r,r.offset,r.byteLength)),!a.isBuffer(r))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof r);if(t===void 0&&(t=0),i===void 0&&(i=r?r.length:0),u===void 0&&(u=0),l===void 0&&(l=this.length),t<0||i>r.length||u<0||l>this.length)throw new RangeError("out of range index");if(u>=l&&t>=i)return 0;if(u>=l)return-1;if(t>=i)return 1;if(t>>>=0,i>>>=0,u>>>=0,l>>>=0,this===r)return 0;for(var s=l-u,m=i-t,x=Math.min(s,m),E=this.slice(u,l),B=r.slice(t,i),g=0;g<x;++g)if(E[g]!==B[g]){s=E[g],m=B[g];break}return s<m?-1:m<s?1:0};function hr(n,r,t,i,u){if(n.length===0)return-1;if(typeof t=="string"?(i=t,t=0):t>2147483647?t=2147483647:t<-2147483648&&(t=-2147483648),t=+t,rr(t)&&(t=u?0:n.length-1),t<0&&(t=n.length+t),t>=n.length){if(u)return-1;t=n.length-1}else if(t<0)if(u)t=0;else return-1;if(typeof r=="string"&&(r=a.from(r,i)),a.isBuffer(r))return r.length===0?-1:pr(n,r,t,i,u);if(typeof r=="number")return r=r&255,typeof Uint8Array.prototype.indexOf=="function"?u?Uint8Array.prototype.indexOf.call(n,r,t):Uint8Array.prototype.lastIndexOf.call(n,r,t):pr(n,[r],t,i,u);throw new TypeError("val must be string, number or Buffer")}function pr(n,r,t,i,u){var l=1,s=n.length,m=r.length;if(i!==void 0&&(i=String(i).toLowerCase(),i==="ucs2"||i==="ucs-2"||i==="utf16le"||i==="utf-16le")){if(n.length<2||r.length<2)return-1;l=2,s/=2,m/=2,t/=2}function x(Er,gr){return l===1?Er[gr]:Er.readUInt16BE(gr*l)}var E;if(u){var B=-1;for(E=t;E<s;E++)if(x(n,E)===x(r,B===-1?0:E-B)){if(B===-1&&(B=E),E-B+1===m)return B*l}else B!==-1&&(E-=E-B),B=-1}else for(t+m>s&&(t=s-m),E=t;E>=0;E--){for(var g=!0,J=0;J<m;J++)if(x(n,E+J)!==x(r,J)){g=!1;break}if(g)return E}return-1}a.prototype.includes=function(r,t,i){return this.indexOf(r,t,i)!==-1},a.prototype.indexOf=function(r,t,i){return hr(this,r,t,i,!0)},a.prototype.lastIndexOf=function(r,t,i){return hr(this,r,t,i,!1)};function Rr(n,r,t,i){t=Number(t)||0;var u=n.length-t;i?(i=Number(i),i>u&&(i=u)):i=u;var l=r.length;i>l/2&&(i=l/2);for(var s=0;s<i;++s){var m=parseInt(r.substr(s*2,2),16);if(rr(m))return s;n[t+s]=m}return s}function Or(n,r,t,i){return z($(r,n.length-t),n,t,i)}function jr(n,r,t,i){return z(Vr(r),n,t,i)}function Hr(n,r,t,i){return z(dr(r),n,t,i)}function Wr(n,r,t,i){return z(Kr(r,n.length-t),n,t,i)}a.prototype.write=function(r,t,i,u){if(t===void 0)u="utf8",i=this.length,t=0;else if(i===void 0&&typeof t=="string")u=t,i=this.length,t=0;else if(isFinite(t))t=t>>>0,isFinite(i)?(i=i>>>0,u===void 0&&(u="utf8")):(u=i,i=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var l=this.length-t;if((i===void 0||i>l)&&(i=l),r.length>0&&(i<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");u||(u="utf8");for(var s=!1;;)switch(u){case"hex":return Rr(this,r,t,i);case"utf8":case"utf-8":return Or(this,r,t,i);case"ascii":case"latin1":case"binary":return jr(this,r,t,i);case"base64":return Hr(this,r,t,i);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Wr(this,r,t,i);default:if(s)throw new TypeError("Unknown encoding: "+u);u=(""+u).toLowerCase(),s=!0}},a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function qr(n,r,t){return r===0&&t===n.length?o.fromByteArray(n):o.fromByteArray(n.slice(r,t))}function yr(n,r,t){t=Math.min(n.length,t);for(var i=[],u=r;u<t;){var l=n[u],s=null,m=l>239?4:l>223?3:l>191?2:1;if(u+m<=t){var x,E,B,g;switch(m){case 1:l<128&&(s=l);break;case 2:x=n[u+1],(x&192)===128&&(g=(l&31)<<6|x&63,g>127&&(s=g));break;case 3:x=n[u+1],E=n[u+2],(x&192)===128&&(E&192)===128&&(g=(l&15)<<12|(x&63)<<6|E&63,g>2047&&(g<55296||g>57343)&&(s=g));break;case 4:x=n[u+1],E=n[u+2],B=n[u+3],(x&192)===128&&(E&192)===128&&(B&192)===128&&(g=(l&15)<<18|(x&63)<<12|(E&63)<<6|B&63,g>65535&&g<1114112&&(s=g))}}s===null?(s=65533,m=1):s>65535&&(s-=65536,i.push(s>>>10&1023|55296),s=56320|s&1023),i.push(s),u+=m}return Yr(i)}var wr=4096;function Yr(n){var r=n.length;if(r<=wr)return String.fromCharCode.apply(String,n);for(var t="",i=0;i<r;)t+=String.fromCharCode.apply(String,n.slice(i,i+=wr));return t}function Gr(n,r,t){var i="";t=Math.min(n.length,t);for(var u=r;u<t;++u)i+=String.fromCharCode(n[u]&127);return i}function Xr(n,r,t){var i="";t=Math.min(n.length,t);for(var u=r;u<t;++u)i+=String.fromCharCode(n[u]);return i}function zr(n,r,t){var i=n.length;(!r||r<0)&&(r=0),(!t||t<0||t>i)&&(t=i);for(var u="",l=r;l<t;++l)u+=Zr[n[l]];return u}function Jr(n,r,t){for(var i=n.slice(r,t),u="",l=0;l<i.length-1;l+=2)u+=String.fromCharCode(i[l]+i[l+1]*256);return u}a.prototype.slice=function(r,t){var i=this.length;r=~~r,t=t===void 0?i:~~t,r<0?(r+=i,r<0&&(r=0)):r>i&&(r=i),t<0?(t+=i,t<0&&(t=0)):t>i&&(t=i),t<r&&(t=r);var u=this.subarray(r,t);return Object.setPrototypeOf(u,a.prototype),u};function A(n,r,t){if(n%1!==0||n<0)throw new RangeError("offset is not uint");if(n+r>t)throw new RangeError("Trying to access beyond buffer length")}a.prototype.readUintLE=a.prototype.readUIntLE=function(r,t,i){r=r>>>0,t=t>>>0,i||A(r,t,this.length);for(var u=this[r],l=1,s=0;++s<t&&(l*=256);)u+=this[r+s]*l;return u},a.prototype.readUintBE=a.prototype.readUIntBE=function(r,t,i){r=r>>>0,t=t>>>0,i||A(r,t,this.length);for(var u=this[r+--t],l=1;t>0&&(l*=256);)u+=this[r+--t]*l;return u},a.prototype.readUint8=a.prototype.readUInt8=function(r,t){return r=r>>>0,t||A(r,1,this.length),this[r]},a.prototype.readUint16LE=a.prototype.readUInt16LE=function(r,t){return r=r>>>0,t||A(r,2,this.length),this[r]|this[r+1]<<8},a.prototype.readUint16BE=a.prototype.readUInt16BE=function(r,t){return r=r>>>0,t||A(r,2,this.length),this[r]<<8|this[r+1]},a.prototype.readUint32LE=a.prototype.readUInt32LE=function(r,t){return r=r>>>0,t||A(r,4,this.length),(this[r]|this[r+1]<<8|this[r+2]<<16)+this[r+3]*16777216},a.prototype.readUint32BE=a.prototype.readUInt32BE=function(r,t){return r=r>>>0,t||A(r,4,this.length),this[r]*16777216+(this[r+1]<<16|this[r+2]<<8|this[r+3])},a.prototype.readIntLE=function(r,t,i){r=r>>>0,t=t>>>0,i||A(r,t,this.length);for(var u=this[r],l=1,s=0;++s<t&&(l*=256);)u+=this[r+s]*l;return l*=128,u>=l&&(u-=Math.pow(2,8*t)),u},a.prototype.readIntBE=function(r,t,i){r=r>>>0,t=t>>>0,i||A(r,t,this.length);for(var u=t,l=1,s=this[r+--u];u>0&&(l*=256);)s+=this[r+--u]*l;return l*=128,s>=l&&(s-=Math.pow(2,8*t)),s},a.prototype.readInt8=function(r,t){return r=r>>>0,t||A(r,1,this.length),this[r]&128?(255-this[r]+1)*-1:this[r]},a.prototype.readInt16LE=function(r,t){r=r>>>0,t||A(r,2,this.length);var i=this[r]|this[r+1]<<8;return i&32768?i|4294901760:i},a.prototype.readInt16BE=function(r,t){r=r>>>0,t||A(r,2,this.length);var i=this[r+1]|this[r]<<8;return i&32768?i|4294901760:i},a.prototype.readInt32LE=function(r,t){return r=r>>>0,t||A(r,4,this.length),this[r]|this[r+1]<<8|this[r+2]<<16|this[r+3]<<24},a.prototype.readInt32BE=function(r,t){return r=r>>>0,t||A(r,4,this.length),this[r]<<24|this[r+1]<<16|this[r+2]<<8|this[r+3]},a.prototype.readFloatLE=function(r,t){return r=r>>>0,t||A(r,4,this.length),c.read(this,r,!0,23,4)},a.prototype.readFloatBE=function(r,t){return r=r>>>0,t||A(r,4,this.length),c.read(this,r,!1,23,4)},a.prototype.readDoubleLE=function(r,t){return r=r>>>0,t||A(r,8,this.length),c.read(this,r,!0,52,8)},a.prototype.readDoubleBE=function(r,t){return r=r>>>0,t||A(r,8,this.length),c.read(this,r,!1,52,8)};function U(n,r,t,i,u,l){if(!a.isBuffer(n))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>u||r<l)throw new RangeError('"value" argument is out of bounds');if(t+i>n.length)throw new RangeError("Index out of range")}a.prototype.writeUintLE=a.prototype.writeUIntLE=function(r,t,i,u){if(r=+r,t=t>>>0,i=i>>>0,!u){var l=Math.pow(2,8*i)-1;U(this,r,t,i,l,0)}var s=1,m=0;for(this[t]=r&255;++m<i&&(s*=256);)this[t+m]=r/s&255;return t+i},a.prototype.writeUintBE=a.prototype.writeUIntBE=function(r,t,i,u){if(r=+r,t=t>>>0,i=i>>>0,!u){var l=Math.pow(2,8*i)-1;U(this,r,t,i,l,0)}var s=i-1,m=1;for(this[t+s]=r&255;--s>=0&&(m*=256);)this[t+s]=r/m&255;return t+i},a.prototype.writeUint8=a.prototype.writeUInt8=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,1,255,0),this[t]=r&255,t+1},a.prototype.writeUint16LE=a.prototype.writeUInt16LE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,2,65535,0),this[t]=r&255,this[t+1]=r>>>8,t+2},a.prototype.writeUint16BE=a.prototype.writeUInt16BE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,2,65535,0),this[t]=r>>>8,this[t+1]=r&255,t+2},a.prototype.writeUint32LE=a.prototype.writeUInt32LE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,4,4294967295,0),this[t+3]=r>>>24,this[t+2]=r>>>16,this[t+1]=r>>>8,this[t]=r&255,t+4},a.prototype.writeUint32BE=a.prototype.writeUInt32BE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,4,4294967295,0),this[t]=r>>>24,this[t+1]=r>>>16,this[t+2]=r>>>8,this[t+3]=r&255,t+4},a.prototype.writeIntLE=function(r,t,i,u){if(r=+r,t=t>>>0,!u){var l=Math.pow(2,8*i-1);U(this,r,t,i,l-1,-l)}var s=0,m=1,x=0;for(this[t]=r&255;++s<i&&(m*=256);)r<0&&x===0&&this[t+s-1]!==0&&(x=1),this[t+s]=(r/m>>0)-x&255;return t+i},a.prototype.writeIntBE=function(r,t,i,u){if(r=+r,t=t>>>0,!u){var l=Math.pow(2,8*i-1);U(this,r,t,i,l-1,-l)}var s=i-1,m=1,x=0;for(this[t+s]=r&255;--s>=0&&(m*=256);)r<0&&x===0&&this[t+s+1]!==0&&(x=1),this[t+s]=(r/m>>0)-x&255;return t+i},a.prototype.writeInt8=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,1,127,-128),r<0&&(r=255+r+1),this[t]=r&255,t+1},a.prototype.writeInt16LE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,2,32767,-32768),this[t]=r&255,this[t+1]=r>>>8,t+2},a.prototype.writeInt16BE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,2,32767,-32768),this[t]=r>>>8,this[t+1]=r&255,t+2},a.prototype.writeInt32LE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,4,2147483647,-2147483648),this[t]=r&255,this[t+1]=r>>>8,this[t+2]=r>>>16,this[t+3]=r>>>24,t+4},a.prototype.writeInt32BE=function(r,t,i){return r=+r,t=t>>>0,i||U(this,r,t,4,2147483647,-2147483648),r<0&&(r=4294967295+r+1),this[t]=r>>>24,this[t+1]=r>>>16,this[t+2]=r>>>8,this[t+3]=r&255,t+4};function mr(n,r,t,i,u,l){if(t+i>n.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function xr(n,r,t,i,u){return r=+r,t=t>>>0,u||mr(n,r,t,4),c.write(n,r,t,i,23,4),t+4}a.prototype.writeFloatLE=function(r,t,i){return xr(this,r,t,!0,i)},a.prototype.writeFloatBE=function(r,t,i){return xr(this,r,t,!1,i)};function _r(n,r,t,i,u){return r=+r,t=t>>>0,u||mr(n,r,t,8),c.write(n,r,t,i,52,8),t+8}a.prototype.writeDoubleLE=function(r,t,i){return _r(this,r,t,!0,i)},a.prototype.writeDoubleBE=function(r,t,i){return _r(this,r,t,!1,i)},a.prototype.copy=function(r,t,i,u){if(!a.isBuffer(r))throw new TypeError("argument should be a Buffer");if(i||(i=0),!u&&u!==0&&(u=this.length),t>=r.length&&(t=r.length),t||(t=0),u>0&&u<i&&(u=i),u===i||r.length===0||this.length===0)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(i<0||i>=this.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("sourceEnd out of bounds");u>this.length&&(u=this.length),r.length-t<u-i&&(u=r.length-t+i);var l=u-i;return this===r&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(t,i,u):Uint8Array.prototype.set.call(r,this.subarray(i,u),t),l},a.prototype.fill=function(r,t,i,u){if(typeof r=="string"){if(typeof t=="string"?(u=t,t=0,i=this.length):typeof i=="string"&&(u=i,i=this.length),u!==void 0&&typeof u!="string")throw new TypeError("encoding must be a string");if(typeof u=="string"&&!a.isEncoding(u))throw new TypeError("Unknown encoding: "+u);if(r.length===1){var l=r.charCodeAt(0);(u==="utf8"&&l<128||u==="latin1")&&(r=l)}}else typeof r=="number"?r=r&255:typeof r=="boolean"&&(r=Number(r));if(t<0||this.length<t||this.length<i)throw new RangeError("Out of range index");if(i<=t)return this;t=t>>>0,i=i===void 0?this.length:i>>>0,r||(r=0);var s;if(typeof r=="number")for(s=t;s<i;++s)this[s]=r;else{var m=a.isBuffer(r)?r:a.from(r,u),x=m.length;if(x===0)throw new TypeError('The value "'+r+'" is invalid for argument "value"');for(s=0;s<i-t;++s)this[s+t]=m[s%x]}return this};var Pr=/[^+/0-9A-Za-z-_]/g;function Qr(n){if(n=n.split("=")[0],n=n.trim().replace(Pr,""),n.length<2)return"";for(;n.length%4!==0;)n=n+"=";return n}function $(n,r){r=r||1/0;for(var t,i=n.length,u=null,l=[],s=0;s<i;++s){if(t=n.charCodeAt(s),t>55295&&t<57344){if(!u){if(t>56319){(r-=3)>-1&&l.push(239,191,189);continue}else if(s+1===i){(r-=3)>-1&&l.push(239,191,189);continue}u=t;continue}if(t<56320){(r-=3)>-1&&l.push(239,191,189),u=t;continue}t=(u-55296<<10|t-56320)+65536}else u&&(r-=3)>-1&&l.push(239,191,189);if(u=null,t<128){if((r-=1)<0)break;l.push(t)}else if(t<2048){if((r-=2)<0)break;l.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;l.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;l.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else throw new Error("Invalid code point")}return l}function Vr(n){for(var r=[],t=0;t<n.length;++t)r.push(n.charCodeAt(t)&255);return r}function Kr(n,r){for(var t,i,u,l=[],s=0;s<n.length&&!((r-=2)<0);++s)t=n.charCodeAt(s),i=t>>8,u=t%256,l.push(u),l.push(i);return l}function dr(n){return o.toByteArray(Qr(n))}function z(n,r,t,i){for(var u=0;u<i&&!(u+t>=r.length||u>=n.length);++u)r[u+t]=n[u];return u}function C(n,r){return n instanceof r||n!=null&&n.constructor!=null&&n.constructor.name!=null&&n.constructor.name===r.name}function rr(n){return n!==n}var Zr=function(){for(var n="0123456789abcdef",r=new Array(256),t=0;t<16;++t)for(var i=t*16,u=0;u<16;++u)r[i+u]=n[t]+n[u];return r}()})(ot);var Tr={exports:{}},v=Tr.exports={},k,S;function ir(){throw new Error("setTimeout has not been defined")}function or(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?k=setTimeout:k=ir}catch{k=ir}try{typeof clearTimeout=="function"?S=clearTimeout:S=or}catch{S=or}})();function Ur(e){if(k===setTimeout)return setTimeout(e,0);if((k===ir||!k)&&setTimeout)return k=setTimeout,setTimeout(e,0);try{return k(e,0)}catch{try{return k.call(null,e,0)}catch{return k.call(this,e,0)}}}function yt(e){if(S===clearTimeout)return clearTimeout(e);if((S===or||!S)&&clearTimeout)return S=clearTimeout,clearTimeout(e);try{return S(e)}catch{try{return S.call(null,e)}catch{return S.call(this,e)}}}var D=[],H=!1,R,P=-1;function wt(){!H||!R||(H=!1,R.length?D=R.concat(D):P=-1,D.length&&br())}function br(){if(!H){var e=Ur(wt);H=!0;for(var o=D.length;o;){for(R=D,D=[];++P<o;)R&&R[P].run();P=-1,o=D.length}R=null,H=!1,yt(e)}}v.nextTick=function(e){var o=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)o[c-1]=arguments[c];D.push(new Ir(e,o)),D.length===1&&!H&&Ur(br)};function Ir(e,o){this.fun=e,this.array=o}Ir.prototype.run=function(){this.fun.apply(null,this.array)};v.title="browser";v.browser=!0;v.env={};v.argv=[];v.version="";v.versions={};function M(){}v.on=M;v.addListener=M;v.once=M;v.off=M;v.removeListener=M;v.removeAllListeners=M;v.emit=M;v.prependListener=M;v.prependOnceListener=M;v.listeners=function(e){return[]};v.binding=function(e){throw new Error("process.binding is not supported")};v.cwd=function(){return"/"};v.chdir=function(e){throw new Error("process.chdir is not supported")};v.umask=function(){return 0};var mt=Tr.exports;const Vt=it(mt);var xt=function(e){function o(){var f=this||self;return delete e.prototype.__magic__,f}if(typeof globalThis=="object")return globalThis;if(this)return o();e.defineProperty(e.prototype,"__magic__",{configurable:!0,get:o});var c=__magic__;return c}(Object),Kt=xt;let K=!1;function Zt(){K=!0}function $t(){K=!1}function _t(e,o,c,f){for(;e<o;){const p=e+(o-e>>1);c(p)<=f?e=p+1:o=p}return e}function dt(e){if(e.hydrate_init)return;e.hydrate_init=!0;let o=e.childNodes;if(e.nodeName==="HEAD"){const w=[];for(let _=0;_<o.length;_++){const d=o[_];d.claim_order!==void 0&&w.push(d)}o=w}const c=new Int32Array(o.length+1),f=new Int32Array(o.length);c[0]=-1;let p=0;for(let w=0;w<o.length;w++){const _=o[w].claim_order,d=(p>0&&o[c[p]].claim_order<=_?p+1:_t(1,p,I=>o[c[I]].claim_order,_))-1;f[w]=c[d]+1;const F=d+1;c[F]=w,p=Math.max(F,p)}const y=[],h=[];let a=o.length-1;for(let w=c[p]+1;w!=0;w=f[w-1]){for(y.push(o[w-1]);a>=w;a--)h.push(o[a]);a--}for(;a>=0;a--)h.push(o[a]);y.reverse(),h.sort((w,_)=>w.claim_order-_.claim_order);for(let w=0,_=0;w<h.length;w++){for(;_<y.length&&h[w].claim_order>=y[_].claim_order;)_++;const d=_<y.length?y[_]:null;e.insertBefore(h[w],d)}}function Et(e,o){e.appendChild(o)}function gt(e){if(!e)return document;const o=e.getRootNode?e.getRootNode():e.ownerDocument;return o&&o.host?o:e.ownerDocument}function re(e){const o=Cr("style");return o.textContent="/* empty */",vt(gt(e),o),o.sheet}function vt(e,o){return Et(e.head||e,o),o.sheet}function Ft(e,o){if(K){for(dt(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;o!==e.actual_end_child?(o.claim_order!==void 0||o.parentNode!==e)&&e.insertBefore(o,e.actual_end_child):e.actual_end_child=o.nextSibling}else(o.parentNode!==e||o.nextSibling!==null)&&e.appendChild(o)}function te(e,o,c){K&&!c?Ft(e,o):(o.parentNode!==e||o.nextSibling!=c)&&e.insertBefore(o,c||null)}function ee(e){e.parentNode&&e.parentNode.removeChild(e)}function ne(e,o){for(let c=0;c<e.length;c+=1)e[c]&&e[c].d(o)}function Cr(e){return document.createElement(e)}function At(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function fr(e){return document.createTextNode(e)}function ie(){return fr(" ")}function oe(){return fr("")}function ue(e,o,c,f){return e.addEventListener(o,c,f),()=>e.removeEventListener(o,c,f)}function lr(e,o,c){c==null?e.removeAttribute(o):e.getAttribute(o)!==c&&e.setAttribute(o,c)}const Bt=["width","height"];function Tt(e,o){const c=Object.getOwnPropertyDescriptors(e.__proto__);for(const f in o)o[f]==null?e.removeAttribute(f):f==="style"?e.style.cssText=o[f]:f==="__value"?e.value=e[f]=o[f]:c[f]&&c[f].set&&Bt.indexOf(f)===-1?e[f]=o[f]:lr(e,f,o[f])}function ae(e,o){for(const c in o)lr(e,c,o[c])}function Ut(e,o){Object.keys(o).forEach(c=>{bt(e,c,o[c])})}function bt(e,o,c){const f=o.toLowerCase();f in e?e[f]=typeof e[f]=="boolean"&&c===""?!0:c:o in e?e[o]=typeof e[o]=="boolean"&&c===""?!0:c:lr(e,o,c)}function ce(e){return/-/.test(e)?Ut:Tt}function fe(e){return e.dataset.svelteH}function le(e){return Array.from(e.childNodes)}function It(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function kr(e,o,c,f,p=!1){It(e);const y=(()=>{for(let h=e.claim_info.last_index;h<e.length;h++){const a=e[h];if(o(a)){const w=c(a);return w===void 0?e.splice(h,1):e[h]=w,p||(e.claim_info.last_index=h),a}}for(let h=e.claim_info.last_index-1;h>=0;h--){const a=e[h];if(o(a)){const w=c(a);return w===void 0?e.splice(h,1):e[h]=w,p?w===void 0&&e.claim_info.last_index--:e.claim_info.last_index=h,a}}return f()})();return y.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,y}function Sr(e,o,c,f){return kr(e,p=>p.nodeName===o,p=>{const y=[];for(let h=0;h<p.attributes.length;h++){const a=p.attributes[h];c[a.name]||y.push(a.name)}y.forEach(h=>p.removeAttribute(h))},()=>f(o))}function se(e,o,c){return Sr(e,o,c,Cr)}function he(e,o,c){return Sr(e,o,c,At)}function Ct(e,o){return kr(e,c=>c.nodeType===3,c=>{const f=""+o;if(c.data.startsWith(f)){if(c.data.length!==f.length)return c.splitText(f.length)}else c.data=f},()=>fr(o),!0)}function pe(e){return Ct(e," ")}function ye(e,o){o=""+o,e.data!==o&&(e.data=o)}function we(e,o){e.value=o??""}function me(e,o,c,f){c==null?e.style.removeProperty(o):e.style.setProperty(o,c,"")}function xe(e,o,c){for(let f=0;f<e.options.length;f+=1){const p=e.options[f];if(p.__value===o){p.selected=!0;return}}(!c||o!==void 0)&&(e.selectedIndex=-1)}function _e(e,o){for(let c=0;c<e.options.length;c+=1){const f=e.options[c];f.selected=~o.indexOf(f.__value)}}function de(e){const o=e.querySelector(":checked");return o&&o.__value}function Ee(e,o,c){e.classList.toggle(o,!!c)}function kt(e,o,{bubbles:c=!1,cancelable:f=!1}={}){return new CustomEvent(e,{detail:o,bubbles:c,cancelable:f})}function ge(e,o){const c=[];let f=0;for(const p of o.childNodes)if(p.nodeType===8){const y=p.textContent.trim();y===`HEAD_${e}_END`?(f-=1,c.push(p)):y===`HEAD_${e}_START`&&(f+=1,c.push(p))}else f>0&&c.push(p);return c}function ve(e,o){return new e(o)}let Q;function er(e){Q=e}function q(){if(!Q)throw new Error("Function called outside component initialization");return Q}function Fe(e){q().$$.on_mount.push(e)}function Ae(e){q().$$.after_update.push(e)}function Be(e){q().$$.on_destroy.push(e)}function Te(){const e=q();return(o,c,{cancelable:f=!1}={})=>{const p=e.$$.callbacks[o];if(p){const y=kt(o,c,{cancelable:f});return p.slice().forEach(h=>{h.call(e,y)}),!y.defaultPrevented}return!0}}function Ue(e,o){return q().$$.context.set(e,o),o}function be(e){return q().$$.context.get(e)}function Ie(e,o){const c=e.$$.callbacks[o.type];c&&c.slice().forEach(f=>f.call(this,o))}const X=[],vr=[];let W=[];const ur=[],Lr=Promise.resolve();let ar=!1;function St(){ar||(ar=!0,Lr.then(Dt))}function Ce(){return St(),Lr}function Lt(e){W.push(e)}function ke(e){ur.push(e)}const nr=new Set;let j=0;function Dt(){if(j!==0)return;const e=Q;do{try{for(;j<X.length;){const o=X[j];j++,er(o),Mt(o.$$)}}catch(o){throw X.length=0,j=0,o}for(er(null),X.length=0,j=0;vr.length;)vr.pop()();for(let o=0;o<W.length;o+=1){const c=W[o];nr.has(c)||(nr.add(c),c())}W.length=0}while(X.length);for(;ur.length;)ur.pop()();ar=!1,nr.clear(),er(e)}function Mt(e){if(e.fragment!==null){e.update(),tt(e.before_update);const o=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,o),e.after_update.forEach(Lt)}}function Se(e){const o=[],c=[];W.forEach(f=>e.indexOf(f)===-1?o.push(f):c.push(f)),c.forEach(f=>f()),W=o}export{zt as $,qt as A,gt as B,re as C,tt as D,et as E,Lt as F,kt as G,Nt as H,Rt as I,Dt as J,jt as K,Se as L,Q as M,er as N,rt as O,X as P,St as Q,Zt as R,$t as S,Be as T,$r as U,Xt as V,ot as W,Qt as X,Vt as Y,it as Z,Kt as _,lr as a,Ue as a0,Ie as a1,ce as a2,Pt as a3,ue as a4,be as a5,At as a6,he as a7,Jt as a8,Te as a9,Ee as aa,Tt as ab,we as ac,_e as ad,xe as ae,ne as af,de as ag,ae as ah,ge as ai,ke as aj,ie as b,se as c,ee as d,Cr as e,le as f,fe as g,Ct as h,te as i,pe as j,Ft as k,ye as l,Ht as m,Fr as n,oe as o,Ae as p,Fe as q,me as r,Ot as s,fr as t,vr as u,ve as v,Ce as w,Wt as x,Yt as y,Gt as z};
