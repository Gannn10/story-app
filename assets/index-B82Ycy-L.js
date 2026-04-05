(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://story-api.dicoding.dev/v1`,t={async register({name:t,email:n,password:r}){return await(await fetch(`${e}/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:t,email:n,password:r})})).json()},async login({email:t,password:n}){return await(await fetch(`${e}/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:t,password:n})})).json()},async getAllStories(t){return await(await fetch(`${e}/stories?location=1`,{method:`GET`,headers:{Authorization:`Bearer ${t}`}})).json()},async addStory(t,n){return await(await fetch(`${e}/stories`,{method:`POST`,headers:{Authorization:`Bearer ${t}`},body:n})).json()}},n={async render(){return`
            <section class="home-container">
                <h1>Dashboard Story Maps</h1> 
                <div id="mainMap"></div>

                <h2>Cerita Terbaru dari Seluruh Dunia</h2> 
                <div id="storyList" class="responsive-grid">
                    <p>Memuat data cerita...</p>
                </div>
            </section>
        `},async afterRender(){let e=localStorage.getItem(`USER_TOKEN`),n=L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`),r=L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`),i=L.map(`mainMap`,{center:[-2.5489,118.0149],zoom:5,layers:[n]});L.control.layers({Street:n,Satellite:r}).addTo(i);try{let{listStory:n}=await t.getAllStories(e),r=document.getElementById(`storyList`);r.innerHTML=``,n.forEach(e=>{e.lat&&e.lon&&L.marker([e.lat,e.lon]).addTo(i).bindPopup(`<b>${e.name}</b><br>${e.description}`),r.innerHTML+=`
                    <article class="story-card">
                        <img src="${e.photoUrl}" alt="Foto cerita oleh ${e.name}">
                        <div class="card-body">
                            <h3>${e.name}</h3> <p class="story-date">${new Date(e.createdAt).toLocaleDateString(`id-ID`,{year:`numeric`,month:`long`,day:`numeric`})}</p> <p class="story-desc">${e.description.substring(0,100)}...</p> </div>
                    </article>
                `})}catch{document.getElementById(`storyList`).innerHTML=`<p>Gagal memuat data. Token tidak valid.</p>`}}},r={async render(){return`
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
        `},async afterRender(){let e=L.map(`mapPicker`).setView([-6.2,106.8],13);L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(e);let n;e.on(`click`,t=>{n&&e.removeLayer(n),n=L.marker(t.latlng).addTo(e),document.getElementById(`lat`).value=t.latlng.lat,document.getElementById(`lon`).value=t.latlng.lng}),document.getElementById(`addStoryForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=localStorage.getItem(`USER_TOKEN`),r=new FormData;r.append(`description`,document.getElementById(`description`).value),r.append(`photo`,document.getElementById(`photo`).files[0]);let i=document.getElementById(`lat`).value,a=document.getElementById(`lon`).value;i&&r.append(`lat`,i),a&&r.append(`lon`,a),(await t.addStory(n,r)).error||(alert(`Berhasil!`),window.location.hash=`#/`)})}},i={async render(){return`
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
        `},async afterRender(){document.getElementById(`loginForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=document.querySelector(`#email`).value,r=document.querySelector(`#password`).value,i=document.querySelector(`#loginBtn`);try{i.innerText=`Memproses...`,i.disabled=!0;let e=await t.login({email:n,password:r});e.error?alert(`Gagal: `+e.message):(localStorage.setItem(`USER_TOKEN`,e.loginResult.token),alert(`Login Berhasil!`),window.location.hash=`#/`)}catch{alert(`Terjadi kesalahan jaringan.`)}finally{i.innerText=`Login`,i.disabled=!1}})}},a={async render(){return`
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
        `},async afterRender(){document.getElementById(`registerForm`).addEventListener(`submit`,async e=>{e.preventDefault();let n=document.querySelector(`#regName`).value,r=document.querySelector(`#regEmail`).value,i=document.querySelector(`#regPassword`).value;try{let e=await t.register({name:n,email:r,password:i});e.error?alert(`Gagal: `+e.message):(alert(`Pendaftaran Berhasil! Silakan Login.`),window.location.hash=`#/login`)}catch{alert(`Terjadi kesalahan saat mendaftar.`)}})}},o={"/":n,"/add":r,"/login":i,"/register":a},s={async init(){window.addEventListener(`hashchange`,()=>{this._renderPage()}),window.addEventListener(`load`,()=>{this._renderPage()})},async _renderPage(){let e=window.location.hash.slice(1)||`/`,t=localStorage.getItem(`USER_TOKEN`),r=document.querySelector(`#mainContent`),i=document.querySelector(`#mainHeader`),a=[`/login`,`/register`].includes(e);if(!t&&!a){window.location.hash=`#/login`;return}a?i.style.display=`none`:i.style.display=`block`;let s=o[e]||n,c=async()=>{r.innerHTML=`<div class="loader-container"><p>Memuat Halaman...</p></div>`;try{r.innerHTML=await s.render(),await s.afterRender()}catch(e){console.error(`Render Error:`,e),r.innerHTML=`<p class="error">Terjadi kesalahan saat memuat halaman.</p>`}};document.startViewTransition?document.startViewTransition(()=>c()):await c()}};document.addEventListener(`DOMContentLoaded`,()=>{s.init();let e=document.getElementById(`logoutBtn`);e&&e.addEventListener(`click`,e=>{e.preventDefault(),localStorage.removeItem(`USER_TOKEN`),window.location.hash=`#/login`,window.location.reload()}),c(),window.addEventListener(`hashchange`,c)});function c(){let e=localStorage.getItem(`USER_TOKEN`),t=document.querySelector(`header`);e?(t.style.display=`block`,document.body.classList.remove(`not-logged-in`)):(t.style.display=`none`,document.body.classList.add(`not-logged-in`))}`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>console.log(`SW registered!`,e)).catch(e=>console.error(`SW registration failed:`,e))});