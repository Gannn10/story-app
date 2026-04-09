(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://story-api.dicoding.dev/v1`,t={async register({name:t,email:n,password:r}){return await(await fetch(`${e}/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:t,email:n,password:r})})).json()},async login({email:t,password:n}){return await(await fetch(`${e}/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:t,password:n})})).json()},async getAllStories(t){return await(await fetch(`${e}/stories?location=1`,{method:`GET`,headers:{Authorization:`Bearer ${t}`}})).json()},async addStory(t,n){return await(await fetch(`${e}/stories`,{method:`POST`,headers:{Authorization:`Bearer ${t}`},body:n})).json()}},n=(e,t)=>t.some(t=>e instanceof t),r,i;function a(){return r||=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]}function o(){return i||=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]}var s=new WeakMap,c=new WeakMap,l=new WeakMap;function u(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(g(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return l.set(t,e),t}function d(e){if(s.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});s.set(e,t)}var f={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return s.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)?!0:t in e}};function p(e){f=e(f)}function m(e){return o().includes(e)?function(...t){return e.apply(_(this),t),g(this.request)}:function(...t){return g(e.apply(_(this),t))}}function h(e){return typeof e==`function`?m(e):(e instanceof IDBTransaction&&d(e),n(e,a())?new Proxy(e,f):e)}function g(e){if(e instanceof IDBRequest)return u(e);if(c.has(e))return c.get(e);let t=h(e);return t!==e&&(c.set(e,t),l.set(t,e)),t}var _=e=>l.get(e);function v(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=g(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(g(o.result),e.oldVersion,e.newVersion,g(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}var y=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],b=[`put`,`add`,`delete`,`clear`],x=new Map;function S(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(x.get(t))return x.get(t);let n=t.replace(/FromIndex$/,``),r=t!==n,i=b.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||y.includes(n)))return;let a=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return x.set(t,a),a}p(e=>({...e,get:(t,n,r)=>S(t,n)||e.get(t,n,r),has:(t,n)=>!!S(t,n)||e.has(t,n)}));var C=[`continue`,`continuePrimaryKey`,`advance`],w={},T=new WeakMap,E=new WeakMap,D={get(e,t){if(!C.includes(t))return e[t];let n=w[t];return n||=w[t]=function(...e){T.set(this,E.get(this)[t](...e))},n}};async function*O(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;let n=new Proxy(t,D);for(E.set(n,t),l.set(n,_(t));t;)yield n,t=await(T.get(n)||t.continue()),T.delete(n)}function k(e,t){return t===Symbol.asyncIterator&&n(e,[IDBIndex,IDBObjectStore,IDBCursor])||t===`iterate`&&n(e,[IDBIndex,IDBObjectStore])}p(e=>({...e,get(t,n,r){return k(t,n)?O:e.get(t,n,r)},has(t,n){return k(t,n)||e.has(t,n)}}));var A=`story-app-db`,j=`stories`,M=v(A,1,{upgrade(e){e.objectStoreNames.contains(j)||e.createObjectStore(j,{keyPath:`id`})}}),N={async getAll(){return(await M).getAll(j)},async put(e){return(await M).put(j,e)},async delete(e){return(await M).delete(j,e)}},P={async render(){return`
            <section class="home-container">
                <h1>Dashboard Story Maps</h1> 
                <div id="mainMap" style="height: 400px; margin-bottom: 20px;"></div>
                <h2>Cerita Terbaru</h2> 
                <div id="storyList" class="responsive-grid"></div>
            </section>
        `},async afterRender(){let e=localStorage.getItem(`USER_TOKEN`),n=L.map(`mainMap`).setView([-2.5489,118.0149],5);L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(n);try{let{listStory:r}=await t.getAllStories(e),i=document.getElementById(`storyList`);i.innerHTML=``;let a=(await N.getAll()).map(e=>e.id);r.forEach(e=>{e.lat&&e.lon&&L.marker([e.lat,e.lon]).addTo(n).bindPopup(`<b>${e.name}</b>`);let t=a.includes(e.id);i.innerHTML+=`
                    <article class="story-card">
                        <img src="${e.photoUrl}" alt="${e.name}">
                        <div class="card-body">
                            <h3>${e.name}</h3>
                            <p class="story-desc">${e.description.substring(0,50)}...</p>
                            <button class="btn-save ${t?`active`:``}" 
                                    data-story='${JSON.stringify(e)}' 
                                    title="Simpan Offline">
                                🔖
                            </button>
                        </div>
                    </article>
                `}),i.querySelectorAll(`.btn-save`).forEach(e=>{e.addEventListener(`click`,async t=>{let n=JSON.parse(e.dataset.story);e.classList.add(`animating`);try{await N.put(n),e.classList.add(`active`),console.log(`Berhasil disimpan ke Bookmark!`)}catch(e){console.error(e)}setTimeout(()=>e.classList.remove(`animating`),300)})})}catch(e){console.error(e)}}},F={async render(){return`
            <section class="add-container">
                <h1>Tambah Cerita Baru</h1>
                <form id="addStoryForm">
                    <div class="form-group">
                        <label for="photo">Pilih Foto</label>
                        <input type="file" id="photo" accept="image/*" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Deskripsi</label>
                        <textarea id="description" required></textarea>
                    </div>

                    <h2>Pilih Lokasi di Peta</h2>
                    <div id="mapPicker" style="height: 300px;"></div>
                    
                    <div class="form-group grid-2">
                        <div>
                            <label for="lat">Latitude</label>
                            <input type="text" id="lat" placeholder="Klik peta..." disabled> </div>
                        <div>
                            <label for="lon">Longitude</label>
                            <input type="text" id="lon" placeholder="Klik peta..." disabled> </div>
                    </div>

                    <button type="submit" id="btnSubmit">Posting Story</button>
                </form>
            </section>
        `},async afterRender(){let e=L.map(`mapPicker`).setView([-6.2,106.8],13);L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(e);let n;e.on(`click`,t=>{n&&e.removeLayer(n),n=L.marker(t.latlng).addTo(e),document.getElementById(`lat`).value=t.latlng.lat,document.getElementById(`lon`).value=t.latlng.lng}),document.getElementById(`addStoryForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=localStorage.getItem(`USER_TOKEN`),r=new FormData;r.append(`description`,document.getElementById(`description`).value),r.append(`photo`,document.getElementById(`photo`).files[0]);let i=document.getElementById(`lat`).value,a=document.getElementById(`lon`).value;i&&r.append(`lat`,i),a&&r.append(`lon`,a),(await t.addStory(n,r)).error||(alert(`Berhasil!`),window.location.hash=`#/`)})}},I={async render(){return`
            <section class="auth-container">
                <h1>Masuk ke Akun</h1> 
                
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required placeholder="Masukkan email anda">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required minlength="8" placeholder="Masukkan password anda">
                    </div>
                    <button type="submit" id="loginBtn">Login</button>
                    
                    <p class="mt-2 text-center">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
                </form>
            </section>
        `},async afterRender(){document.getElementById(`loginForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=document.querySelector(`#email`).value,r=document.querySelector(`#password`).value,i=document.querySelector(`#loginBtn`);try{i.innerText=`Memproses...`,i.disabled=!0;let e=await t.login({email:n,password:r});e.error?alert(`Gagal: `+e.message):(localStorage.setItem(`USER_TOKEN`,e.loginResult.token),alert(`Login Berhasil!`),window.location.hash=`#/`)}catch{alert(`Terjadi kesalahan jaringan.`)}finally{i.innerText=`Login`,i.disabled=!1}})}},R={async render(){return`
            <section class="auth-container">
                <h1>Daftar Akun Baru</h1> 

                <form id="registerForm">
                    <div class="form-group">
                        <label for="regName">Nama Lengkap</label>
                        <input type="text" id="regName" required placeholder="Nama lengkap anda">
                    </div>
                    <div class="form-group">
                        <label for="regEmail">Email</label>
                        <input type="email" id="regEmail" required placeholder="email@contoh.com">
                    </div>
                    <div class="form-group">
                        <label for="regPassword">Password</label>
                        <input type="password" id="regPassword" required minlength="8" placeholder="Minimal 8 karakter">
                    </div>
                    <button type="submit" id="regBtn">Daftar</button>
                    <p class="mt-2 text-center">Sudah punya akun? <a href="#/login">Login di sini</a></p>
                </form>
            </section>
        `},async afterRender(){document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=document.querySelector(`#regName`).value,r=document.querySelector(`#regEmail`).value,i=document.querySelector(`#regPassword`).value;try{let e=await t.register({name:n,email:r,password:i});e.error?alert(`Gagal: `+e.message):(alert(`Pendaftaran Berhasil! Silakan Login.`),window.location.hash=`#/login`)}catch{alert(`Terjadi kesalahan saat mendaftar.`)}})}},z={async render(){return`
            <section class="home-container">
                <h1>Bookmark Saya (Offline)</h1>
                <div id="savedList" class="responsive-grid"></div>
            </section>
        `},async afterRender(){let e=await N.getAll(),t=document.getElementById(`savedList`);if(e.length===0){t.innerHTML=`<p>Belum ada bookmark tersimpan.</p>`;return}t.innerHTML=``,e.forEach(e=>{t.innerHTML+=`
                <article class="story-card">
                    <img src="${e.photoUrl}" alt="${e.name}">
                    <div class="card-body">
                        <h3>${e.name}</h3>
                        <button class="btn-delete" data-id="${e.id}" style="background:#ef4444; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">
                            🗑️ Hapus Bookmark
                        </button>
                    </div>
                </article>
            `}),t.querySelectorAll(`.btn-delete`).forEach(e=>{e.addEventListener(`click`,async()=>{await N.delete(e.dataset.id),alert(`Berhasil dihapus!`),window.location.reload()})})}},B={"/":P,"/add":F,"/saved":z,"/login":I,"/register":R},V={async renderPage(){let e=window.location.hash.slice(1)||`/`,t=localStorage.getItem(`USER_TOKEN`),n=document.querySelector(`#mainContent`),r=document.querySelector(`#mainHeader`),i=[`/login`,`/register`].includes(e);if(!t&&!i){window.location.hash=`#/login`;return}r&&(r.style.display=i?`none`:`block`);let a=B[e]||P,o=async()=>{n.innerHTML=`<div class="loader-container"><p>Memuat Halaman...</p></div>`;try{n.innerHTML=await a.render(),a.afterRender&&await a.afterRender()}catch(e){console.error(`Render Error:`,e),n.innerHTML=`<p class="error">Gagal memuat halaman.</p>`}};document.startViewTransition?document.startViewTransition(()=>o()):await o()}},H={async requestPermission(){if(await Notification.requestPermission()===`denied`){console.error(`Fitur notifikasi ditolak.`);return}console.log(`Notifikasi diizinkan!`)},async subscribePushNotification(e){try{let t=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:`BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk`});await fetch(`https://story-api.dicoding.dev/v1/notifications/subscribe`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e}`},body:JSON.stringify(t)}),console.log(`Berhasil langganan push notification`)}catch(e){console.error(`Gagal subscribe:`,e)}}};window.addEventListener(`hashchange`,()=>{V.renderPage()}),window.addEventListener(`load`,async()=>{if(V.renderPage(),`serviceWorker`in navigator)try{await navigator.serviceWorker.register(`sw.js`),console.log(`SW Berhasil Aktif!`)}catch(e){console.error(`SW Gagal Daftar:`,e)}let e=localStorage.getItem(`USER_TOKEN`);e&&(await H.requestPermission(),await H.subscribePushNotification(e))});