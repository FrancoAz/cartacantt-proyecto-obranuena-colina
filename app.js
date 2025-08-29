/* Datos del proyecto */
const projectData = [
  {
    id: 'arquitectura',
    name: 'Proyecto de Arquitectura',
    start: '2025-08-25T00:00:00',
    end:   '2025-09-04T23:59:59',
    subs: [
      { name: 'Planta de Arquitectura', progress: 95 },
      { name: 'Elevación Norte', progress: 95 },
      { name: 'Elevación Sur', progress: 95 },
      { name: 'Elevación Este', progress: 95 },
      { name: 'Elevación Oeste', progress: 95 },
      { name: 'Gráfico de Superficies' },
      { name: 'Emplazamiento', progress: 80 },
      { name: 'Cuadro de superficies' },
      { name: 'Planta de Cubierta', progress: 80 },
      { name: 'Plano de ubicación' },
      { name: "Corte A-A'", progress: 95 },
      { name: "Corte B-B'", progress: 95 },
      { name: "Corte C-C'", progress: 95 },
      { name: "Corte D-D'", progress: 95 },
      { name: 'Plano de Puertas y Ventanas' },
      { name: 'Planos de Closet' },
      { name: 'Plano de cierre Perimetral' }
    ]
  },
  {
    id: 'topografia',
    name: 'Proyecto de Topografía',
    start: '2025-08-26T00:00:00',
    end:   '2025-08-29T23:59:59',
    subs: [
      { name: 'Cotas de deslindes' },
      { name: 'Rasante Norte' },
      { name: 'Rasante Sur' },
      { name: 'Rasante Este' },
      { name: 'Rasante Oeste' },
      { name: 'Cuadro de coordenadas UTM' }
    ]
  },
  {
    id: 'estructura',
    name: 'Proyecto de Estructura',
    start: '2025-08-27T00:00:00',
    end:   '2025-09-02T23:59:59',
    subs: [
      { name: 'Plano de Fundación' },
      { name: 'Plano de cimiento' },
      { name: 'Plano de Estructuras de Vigas y cadenas' },
      { name: 'Plano de Pilares' },
      { name: 'Plano de Detalle de Fundación' }
    ]
  },
  {
    id: 'agua',
    name: 'Proyecto de Agua Potable',
    start: '2025-08-28T00:00:00',
    end:   '2025-09-12T23:59:59',
    subs: [
      { name: 'Planta de Agua Potable fria' },
      { name: 'Planta de Agua potable caliente' },
      { name: 'Isometria A.fria' },
      { name: 'Isometria A.Caliente' },
      { name: 'Cuadro de calculos' }
    ]
  },
  {
    id: 'alcantarillado',
    name: 'Proyecto de Alcantarillado Rural',
    start: '2025-09-02T00:00:00',
    end:   '2025-09-10T23:59:59'
  },
  {
    id: 'electricidad',
    name: 'Planos de Electricidad',
    start: '2025-09-12T00:00:00',
    end:   '2025-09-16T23:59:59'
  }
];

/* Helpers */
const $ = sel => document.querySelector(sel);
const formatDate = d => new Date(d).toLocaleString('es-CL', { year:'numeric', month:'short', day:'numeric' });

function clamp(v, a=0, b=1){ return Math.max(a, Math.min(b, v)); }

/* Build Gantt */
function buildGantt(data){
  const gantt = $('#gantt');
  // determine overall range
  const starts = data.map(d => new Date(d.start));
  const ends = data.map(d => new Date(d.end));
  const min = new Date(Math.min(...starts));
  const max = new Date(Math.max(...ends));
  // extend a little padding days
  const paddingDays = 2;
  min.setDate(min.getDate() - paddingDays);
  max.setDate(max.getDate() + paddingDays);
  const totalMs = max - min;

  // header: ticks
  const ticks = [];
  const tickEl = document.createElement('div');
  tickEl.className = 'gantt-grid';
  const tickRow = document.createElement('div');
  tickRow.style.display = 'flex';
  tickRow.style.gap = '12px';
  tickRow.style.marginBottom = '12px';
  // show a tick every 3 days or so depending on range
  const dayCount = Math.ceil((max - min) / (1000*60*60*24));
  const step = dayCount <= 10 ? 1 : dayCount <= 30 ? 3 : Math.ceil(dayCount/10);
  for(let d = new Date(min); d <= max; d.setDate(d.getDate()+step)){
    const label = document.createElement('div');
    label.style.minWidth = '80px';
    label.style.fontSize = '12px';
    label.style.color = 'var(--muted)';
    label.textContent = new Date(d).toLocaleDateString('es-CL', {day:'2-digit', month:'short'});
    tickRow.appendChild(label);
  }
  tickEl.appendChild(tickRow);
  // rows
  data.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'gantt-row';

    const lbl = document.createElement('div');
    lbl.className = 'gantt-label';
    lbl.textContent = item.name;
    row.appendChild(lbl);

    const track = document.createElement('div');
    track.className = 'gantt-track';

    const start = new Date(item.start);
    const end = new Date(item.end);
    const leftPct = ((start - min) / totalMs) * 100;
    const widthPct = ((end - start) / totalMs) * 100;

    const bar = document.createElement('div');
    bar.className = 'gantt-bar';
    bar.style.left = `${leftPct}%`;
    bar.style.width = `${Math.max(widthPct, 1)}%`;
    bar.title = `${item.name} — ${formatDate(item.start)} → ${formatDate(item.end)}`;
    bar.textContent = `${formatDate(item.start)} → ${formatDate(item.end)}`;

    track.appendChild(bar);
    row.appendChild(track);
    tickEl.appendChild(row);
  });

  // clear and append
  gantt.innerHTML = '';
  gantt.appendChild(tickEl);
}

/* Build project cards */
function buildProjectCards(data){
  const container = $('#projectsList');
  container.innerHTML = '';

  data.forEach(item=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${item.id}`;

    const head = document.createElement('div');
    head.className = 'card-head';
    head.innerHTML = `<div>
        <div class="card-title">${item.name}</div>
        <div class="card-dates">${formatDate(item.start)} — ${formatDate(item.end)}</div>
      </div>`;
    card.appendChild(head);

    const controls = document.createElement('div');
    controls.className = 'card-controls';

    if (Array.isArray(item.subs) && item.subs.length) {
      controls.innerHTML += `<button id="${item.id}-toggle" class="toggle-btn" aria-expanded="false" aria-controls="${item.id}-sublist">Ver subcategorías <span class="caret">▾</span></button>`;
    }

    controls.innerHTML += `<div id="${item.id}-status" class="status upcoming" style="min-width:88px;text-align:center">...</div>`;
    card.appendChild(controls);

    const body = document.createElement('div');
    body.className = 'card-body';

    // counter row
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="counter"><div class="time" id="${item.id}-counter">--</div><div class="muted small">restantes</div></div>
                     <div style="min-width:160px">
                       <div class="progress-small" aria-hidden="true"><i id="${item.id}-progress" style="width:0%"></i></div>
                       <div id="${item.id}-progress-text" class="muted small" style="margin-top:6px">Progreso: 0%</div>
                     </div>`;
    body.appendChild(row);

    // subcategories (for any project with subs)
    if (Array.isArray(item.subs) && item.subs.length){
      const subwrap = document.createElement('div');
      subwrap.className = 'sublist';
      subwrap.id = `${item.id}-sublist`;
      item.subs.forEach((sub, idx)=>{
        const sc = document.createElement('div');
        sc.className = 'subcard';
        sc.innerHTML = `<div class="subhead">
            <div style="font-weight:700">${sub.name}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <div id="${item.id}-sub-${idx}-status" class="status upcoming" style="font-size:11px;padding:4px 8px">...</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 6px;">
            <div class="muted small">Fechas</div>
            <div class="muted small">${formatDate(item.start)} → ${formatDate(item.end)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div id="${item.id}-sub-${idx}-counter" class="muted small" style="min-width: 80px; text-align: left;">--</div>
            <div style="flex-grow:1">
              <div class="progress-small"><i id="${item.id}-sub-${idx}-progress" style="width:0%"></i></div>
            </div>
          </div>`;
        subwrap.appendChild(sc);
      });
      body.appendChild(subwrap);
    }

    card.appendChild(body);
    container.appendChild(card);

    // attach toggle behavior for sublist (dynamic, accessible)
    const toggleBtn = document.getElementById(`${item.id}-toggle`);
    const sublistEl = document.getElementById(`${item.id}-sublist`);
    if (toggleBtn && sublistEl){
      toggleBtn.addEventListener('click', () => {
        const open = sublistEl.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        const caret = toggleBtn.querySelector('.caret');
        if (caret) caret.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    }
  });
}

/* Timer logic */
function startTimers(data){
  // prepare durations
  const items = data.map(item => {
    const s = new Date(item.start), e = new Date(item.end);
    return { ...item, s, e, durationMs: e - s };
  });

  function update(){
    const now = new Date();
    // global progress weighted by duration
    let totalWeight = 0;
    let weightedSum = 0;

    items.forEach(item=>{
      const { id, s, e, durationMs } = item;
      const progress = clamp((now - s) / (e - s) , 0, 1);
      const pct = Math.round(progress * 100);
      weightedSum += progress * durationMs;
      totalWeight += durationMs;

      // update item progress UI
      const bar = document.getElementById(`${id}-progress`);
      const text = document.getElementById(`${id}-progress-text`);
      const counter = document.getElementById(`${id}-counter`);
      const statusEl = document.getElementById(`${id}-status`);
      if (bar) bar.style.width = `${pct}%`;
      if (text) text.textContent = `Progreso: ${pct}%`;

      // status
      let status = 'upcoming', cls='upcoming';
      if (now >= e){ status = 'Completado'; cls='completed' }
      else if (now >= s && now < e){ status = 'En curso'; cls='in-progress' }
      else { status = 'Próximo'; cls='upcoming' }
      if (statusEl){
        statusEl.textContent = status;
        statusEl.className = `status ${cls}`;
      }

      // counter
      if (counter){
        const remainingMs = e - now;
        if (remainingMs <= 0) counter.textContent = '0d 00:00:00';
        else {
          const days = Math.floor(remainingMs / (1000*60*60*24));
          const hrs = String(Math.floor((remainingMs % (1000*60*60*24)) / (1000*60*60))).padStart(2,'0');
          const mins = String(Math.floor((remainingMs % (1000*60*60)) / (1000*60))).padStart(2,'0');
          const secs = String(Math.floor((remainingMs % (1000*60)) / 1000)).padStart(2,'0');
          counter.textContent = `${days}d ${hrs}:${mins}:${secs}`;
        }
      }

      // subitems for projects with subs (use parent's start/end)
      if (Array.isArray(item.subs) && item.subs.length){
        item.subs.forEach((sub, idx)=>{
          const subsStatus = document.getElementById(`${item.id}-sub-${idx}-status`);
          const subsCounter = document.getElementById(`${item.id}-sub-${idx}-counter`);
          const subsProgress = document.getElementById(`${item.id}-sub-${idx}-progress`);
          
          let spPct;
          if (sub.progress !== undefined) {
            spPct = sub.progress;
          } else {
            // subs use same start/end as parent if no manual progress is set
            const sp = clamp((now - s) / (e - s), 0, 1);
            spPct = Math.round(sp * 100);
          }
          
          if (subsProgress) subsProgress.style.width = `${spPct}%`;
          
          if (subsStatus){
            let st = 'Próximo', cl = 'upcoming';
            if (spPct >= 100) {
              st = 'Completado';
              cl = 'completed';
            } else if (spPct > 0) {
              st = 'En curso';
              cl = 'in-progress';
            } else if (now >= s) { // Progress is 0 but task has started
              st = 'En curso';
              cl = 'in-progress';
            }
            subsStatus.textContent = st;
            subsStatus.className = `status ${cl}`;
          }

          if (subsCounter){
            const remainingMs = e - now;
            if (remainingMs <= 0) subsCounter.textContent = '0d 00:00:00';
            else {
              const days = Math.floor(remainingMs / (1000*60*60*24));
              const hrs = String(Math.floor((remainingMs % (1000*60*60*24)) / (1000*60*60))).padStart(2,'0');
              const mins = String(Math.floor((remainingMs % (1000*60*60)) / (1000*60))).padStart(2,'0');
              const secs = String(Math.floor((remainingMs % (1000*60)) / 1000)).padStart(2,'0');
              subsCounter.textContent = `${days}d ${hrs}:${mins}:${secs}`;
            }
          }
        });
      }
    });

    const globalProgress = totalWeight ? Math.round((weightedSum / totalWeight) * 100) : 0;
    $('#globalProgressBar').style.width = `${globalProgress}%`;
    $('#globalProgressText').textContent = `${globalProgress}% completado (promedio ponderado)`;
  }

  update();
  setInterval(update, 1000);
}

/* Initialize UI */
function init(){
  buildGantt(projectData);
  buildProjectCards(projectData);
  startTimers(projectData);
}

init();