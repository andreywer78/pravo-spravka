const DEFAULT_DB = "pravo_db_v1";
let state = { laws: [], favorites: [], selected: null, category: "" };

const app = {
  init() {
    const saved = localStorage.getItem(DEFAULT_DB);
    if (saved) {
      try { const x = JSON.parse(saved); state.laws = x.laws || []; state.favorites = x.favorites || []; }
      catch { this.loadDefault(); }
    } else this.loadDefault();
    document.querySelectorAll(".nav-btn").forEach(b => b.onclick = () => this.showView(b.dataset.view));
    document.querySelector("#searchInput").oninput = () => this.renderList();
    document.querySelector("#typeFilter").onchange = () => this.renderList();
    document.querySelector("#statusFilter").onchange = () => this.renderList();
    document.querySelector("#clearSearch").onclick = () => { document.querySelector("#searchInput").value=""; document.querySelector("#typeFilter").value=""; document.querySelector("#statusFilter").value=""; state.category=""; document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x.dataset.cat==="")); this.renderList(); };
    document.querySelectorAll(".category").forEach(b => b.onclick = () => { state.category=b.dataset.cat; document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b)); this.renderList(); });
    document.querySelector("#importFile").onchange = e => this.importDB(e);
    this.fillFilters(); this.updateCounts(); this.renderList(); this.renderAdmin();
  },
  loadDefault() {
    // Embedded starter database keeps GitHub Pages functional even if laws.json is not fetched.
    state.laws = [
      {"id":"constitution-rf","title":"Конституция Российской Федерации","type":"Конституция","number":"—","date":"1993-12-12","status":"Действует","tags":["конституция","основной закон","права"],"description":"Основной закон Российской Федерации.","text":"Конституция Российской Федерации\n\nСтатья 1\n1. Российская Федерация — Россия есть демократическое федеративное правовое государство с республиканской формой правления.\n\nСтатья 2\nЧеловек, его права и свободы являются высшей ценностью. Признание, соблюдение и защита прав и свобод человека и гражданина — обязанность государства.\n\nСтатья 15\n1. Конституция Российской Федерации имеет высшую юридическую силу, прямое действие и применяется на всей территории Российской Федерации."},
      {"id":"civil-code","title":"Гражданский кодекс Российской Федерации","type":"Кодекс","number":"часть первая","date":"1994-11-30","status":"Действует","tags":["гк","гражданское право","имущество","договор"],"description":"Основные положения гражданского законодательства.","text":"Гражданский кодекс Российской Федерации\n\nСтатья 1. Основные начала гражданского законодательства\n1. Гражданское законодательство основывается на признании равенства участников регулируемых им отношений, неприкосновенности собственности, свободы договора, недопустимости произвольного вмешательства кого-либо в частные дела.\n\nСтатья 10. Пределы осуществления гражданских прав\n1. Не допускаются осуществление гражданских прав исключительно с намерением причинить вред другому лицу.\n\nСтатья 420. Понятие договора\n1. Договором признаётся соглашение двух или нескольких лиц об установлении, изменении или прекращении гражданских прав и обязанностей."},
      {"id":"criminal-code","title":"Уголовный кодекс Российской Федерации","type":"Кодекс","number":"№ 63-ФЗ","date":"1996-06-13","status":"Действует","tags":["ук","уголовное право","преступление","наказание"],"description":"Основной законодательный акт в сфере уголовной ответственности.","text":"Уголовный кодекс Российской Федерации\n\nСтатья 1. Уголовное законодательство Российской Федерации\n1. Уголовное законодательство Российской Федерации состоит из настоящего Кодекса.\n\nСтатья 2. Задачи Уголовного кодекса Российской Федерации\n1. Задачами настоящего Кодекса являются охрана прав и свобод человека и гражданина, собственности, общественного порядка и безопасности, а также предупреждение преступлений.\n\nСтатья 14. Понятие преступления\n1. Преступлением признаётся виновно совершённое общественно опасное деяние, запрещённое настоящим Кодексом под угрозой наказания."},
      {"id":"criminal-procedure-code","title":"Уголовно-процессуальный кодекс Российской Федерации","type":"Кодекс","number":"№ 174-ФЗ","date":"2001-12-18","status":"Действует","tags":["упк","уголовный процесс","следствие","суд"],"description":"Основной акт, регулирующий уголовное судопроизводство.","text":"Уголовно-процессуальный кодекс Российской Федерации\n\nСтатья 1. Законы, определяющие порядок уголовного судопроизводства\n1. На территории Российской Федерации порядок уголовного судопроизводства определяется настоящим Кодексом.\n\nСтатья 6. Назначение уголовного судопроизводства\n1. Уголовное судопроизводство имеет своим назначением защиту прав и законных интересов лиц и организаций, потерпевших от преступлений, а также защиту личности от незаконного и необоснованного обвинения."},
      {"id":"administrative-code","title":"Кодекс Российской Федерации об административных правонарушениях","type":"Кодекс","number":"№ 195-ФЗ","date":"2001-12-30","status":"Действует","tags":["коап","административное право","правонарушение"],"description":"Законодательство об административных правонарушениях.","text":"Кодекс Российской Федерации об административных правонарушениях\n\nСтатья 1.1. Законодательство об административных правонарушениях\n1. Законодательство об административных правонарушениях состоит из настоящего Кодекса и принимаемых в соответствии с ним законов субъектов Российской Федерации.\n\nСтатья 2.1. Административное правонарушение\n1. Административным правонарушением признаётся противоправное, виновное действие (бездействие) физического или юридического лица, за которое установлена административная ответственность."},
      {"id":"labor-code","title":"Трудовой кодекс Российской Федерации","type":"Кодекс","number":"№ 197-ФЗ","date":"2001-12-30","status":"Действует","tags":["тк","труд","работа","работник"],"description":"Основной акт трудового законодательства.","text":"Трудовой кодекс Российской Федерации\n\nСтатья 1. Цели и задачи трудового законодательства\nЦелями трудового законодательства являются установление государственных гарантий трудовых прав и свобод граждан, создание благоприятных условий труда, защита прав и интересов работников и работодателей.\n\nСтатья 21. Основные права и обязанности работника\nРаботник имеет право на заключение, изменение и расторжение трудового договора в порядке и на условиях, которые установлены законодательством."}
    ];
    state.favorites=[];
    this.save();
  },
  save() {
    localStorage.setItem(DEFAULT_DB, JSON.stringify({laws:state.laws, favorites:state.favorites, savedAt:new Date().toISOString()}));
    this.updateCounts(); this.renderAdmin();
  },
  fillFilters() {
    const types=[...new Set(state.laws.map(x=>x.type))].sort();
    document.querySelector("#typeFilter").innerHTML='<option value="">Все виды документов</option>'+types.map(x=>`<option>${esc(x)}</option>`).join("");
  },
  updateCounts() {
    document.querySelector("#docCount").textContent=state.laws.length;
    document.querySelector("#allCount").textContent=state.laws.length;
    document.querySelector("#favCount").textContent=state.favorites.length?state.favorites.length:"";
  },
  showView(view) {
    document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));
    document.querySelector("#"+(view==="home"?"homeView":view==="favorites"?"favoritesView":"adminView")).classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
    if(view==="favorites") this.renderFavorites();
    if(view==="admin") this.renderAdmin();
    window.scrollTo(0,0);
  },
  goHome(){this.showView("home");},
  renderList() {
    const q=document.querySelector("#searchInput").value.trim().toLowerCase();
    const type=document.querySelector("#typeFilter").value;
    const status=document.querySelector("#statusFilter").value;
    let arr=state.laws.filter(l=>{
      const hay=[l.title,l.type,l.number,l.description,l.text,(l.tags||[]).join(" ")].join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!type||l.type===type)&&(!status||l.status===status)&&(!state.category||l.type===state.category);
    });
    document.querySelector("#resultLabel").textContent=`Найдено: ${arr.length}`;
    document.querySelector("#lawList").innerHTML=arr.map(card).join("");
    document.querySelector("#empty").classList.toggle("hidden",arr.length!==0);
  },
  renderFavorites() {
    const arr=state.laws.filter(l=>state.favorites.includes(l.id));
    document.querySelector("#favoriteList").innerHTML=arr.length?arr.map(card).join(""):'<div class="empty">В избранном пока нет документов.</div>';
  },
  open(id) {
    const l=state.laws.find(x=>x.id===id); if(!l)return;
    state.selected=id;
    document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));
    document.querySelector("#documentView").classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
    document.querySelector("#document").innerHTML=`<div class="doc-header"><div class="law-meta"><span class="badge">${esc(l.type)}</span><span class="badge green">${esc(l.status)}</span></div><h1>${esc(l.title)}</h1><p>${esc(l.description||"")}</p><div class="law-number">${esc(l.number||"")} · дата принятия: ${esc(l.date||"—")}</div></div><div class="doc-body">${esc(l.text)}</div>`;
    const fav=state.favorites.includes(id);
    document.querySelector("#favoriteBtn").textContent=fav?"★ В избранном":"☆ В избранное";
    document.querySelector("#favoriteBtn").onclick=()=>this.toggleFavorite(id);
    document.querySelector("#editBtn").onclick=()=>this.editLaw(id);
    window.scrollTo(0,0);
  },
  toggleFavorite(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];this.save();this.open(id);},
  newLaw(){this.openModal({id:"",title:"",type:"Федеральный закон",number:"",date:new Date().toISOString().slice(0,10),status:"Действует",tags:[],description:"",text:""});},
  editLaw(id){const l=state.laws.find(x=>x.id===id);if(l)this.openModal({...l});},
  openModal(l){
    document.querySelector("#modalTitle").textContent=l.id?"Редактирование документа":"Новый документ";
    document.querySelector("#lawForm").innerHTML=`<div class="form-grid">
      <div class="form-group full"><label>Название</label><input class="form-input" name="title" required value="${attr(l.title)}"></div>
      <div class="form-group"><label>Вид</label><select class="form-input" name="type"><option>Конституция</option><option>Кодекс</option><option>Федеральный закон</option><option>Подзаконный акт</option><option>Иной документ</option></select></div>
      <div class="form-group"><label>Номер</label><input class="form-input" name="number" value="${attr(l.number||"")}"></div>
      <div class="form-group"><label>Дата</label><input class="form-input" name="date" type="date" value="${attr(l.date||"")}"></div>
      <div class="form-group"><label>Статус</label><select class="form-input" name="status"><option>Действует</option><option>Утратил силу</option></select></div>
      <div class="form-group full"><label>Теги через запятую</label><input class="form-input" name="tags" value="${attr((l.tags||[]).join(", "))}"></div>
      <div class="form-group full"><label>Описание</label><input class="form-input" name="description" value="${attr(l.description||"")}"></div>
      <div class="form-group full"><label>Полный текст</label><textarea class="form-textarea" name="text" required>${esc(l.text||"")}</textarea></div>
    </div><div class="form-actions"><button type="button" class="secondary-btn" onclick="app.closeModal()">Отмена</button><button class="primary-btn">Сохранить</button></div>`;
    const form=document.querySelector("#lawForm"); form.querySelector('[name="type"]').value=l.type||"Иной документ"; form.querySelector('[name="status"]').value=l.status||"Действует";
    form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);const item={id:l.id||("law-"+Date.now()),title:f.get("title").trim(),type:f.get("type"),number:f.get("number").trim(),date:f.get("date"),status:f.get("status"),tags:f.get("tags").split(",").map(x=>x.trim()).filter(Boolean),description:f.get("description").trim(),text:f.get("text")};const i=state.laws.findIndex(x=>x.id===item.id);if(i>=0)state.laws[i]=item;else state.laws.push(item);this.save();this.fillFilters();this.closeModal();this.renderList();if(state.selected===item.id)this.open(item.id);};
    document.querySelector("#modal").classList.remove("hidden");
  },
  closeModal(){document.querySelector("#modal").classList.add("hidden");},
  renderAdmin(){
    const el=document.querySelector("#adminTable"); if(!el)return;
    el.innerHTML='<div class="admin-row header"><div>Документ</div><div>Вид</div><div>Статус</div><div>Действия</div></div>'+state.laws.map(l=>`<div class="admin-row"><div><b>${esc(l.title)}</b><div class="law-number">${esc(l.number||"")}</div></div><div>${esc(l.type)}</div><div><span class="badge green">${esc(l.status)}</span></div><div class="admin-actions"><button class="small-btn" onclick="app.open('${l.id}')">Открыть</button><button class="small-btn" onclick="app.editLaw('${l.id}')">Изменить</button><button class="small-btn danger" onclick="app.deleteLaw('${l.id}')">Удалить</button></div></div>`).join("");
  },
  deleteLaw(id){const l=state.laws.find(x=>x.id===id);if(!l||!confirm(`Удалить документ «${l.title}»?`))return;state.laws=state.laws.filter(x=>x.id!==id);state.favorites=state.favorites.filter(x=>x!==id);this.save();this.renderList();},
  exportDB(){const blob=new Blob([JSON.stringify({version:1,laws:state.laws},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="laws.json";a.click();URL.revokeObjectURL(a.href);},
  importDB(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.laws))throw Error();state.laws=x.laws;state.favorites=[];this.save();this.fillFilters();this.renderList();alert("База успешно импортирована.");}catch{alert("Не удалось прочитать базу. Нужен JSON с массивом laws.");}};r.readAsText(file);},
  resetDB(){if(!confirm("Сбросить локальные изменения и вернуть стартовую базу?"))return;localStorage.removeItem(DEFAULT_DB);location.reload();}
};

function card(l){return `<div class="law-card" onclick="app.open('${l.id}')"><div class="law-meta"><span class="badge">${esc(l.type)}</span><span class="badge green">${esc(l.status)}</span></div><h3>${esc(l.title)}</h3><p>${esc(l.description||"")}</p><div class="law-number">${esc(l.number||"")} · ${esc(l.date||"")}</div></div>`}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function attr(s){return esc(s).replace(/\n/g,"&#10;")}
window.app=app;document.addEventListener("DOMContentLoaded",()=>app.init());
