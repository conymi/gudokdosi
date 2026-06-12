/* =====================================================================
   구독도시 — 매칭 엔진 (앱 constants.js에서 이식, 순수 함수)
   + 매칭 오버레이 렌더링 (라벤더 모노톤 리스킨, emoji 제거)
   ===================================================================== */

const MQ = [
  {axis:"tempo",   q:"하루를 어떻게 보낼 거예요?",  a:"빡빡하게 채우기",      m:"적당히",        b:"느리게 흘러가기"},
  {axis:"consume", q:"뭐 하면서 시간 보낼래요?",    a:"맛집이랑 골목 구경",  m:"둘 다 좋아요",  b:"자연 속에서"},
  {axis:"space",   q:"어디가 좋아요?",              a:"골목 사이",          m:"가리지 않아요", b:"바다 앞"},
  {axis:"relation",q:"혼자 갈 거예요?",             a:"혼자가 편해요",      m:"상관없어요",    b:"누군가와 같이"},
  {axis:"infra",   q:"편한 게 중요해요?",           a:"가까이 다 있어야 해요", m:"보통이요",   b:"좀 불편해도 괜찮아요"},
];

const USER_TYPE_POOL = {
  "고요한 파도형":       {desc:"느리게, 자연 속에서, 혼자. 고요한 시간이 필요한 사람."},
  "나란히 걷는 해변형":  {desc:"바다를 나란히 걷는 시간. 말없이 함께여도 좋은."},
  "동네 산책자형":       {desc:"혼자 천천히 골목을 도는 사람."},
  "골목 미식가형":       {desc:"같이 먹고 같이 걷는 거 아는 사람."},
  "야외 활동좋아형":     {desc:"자연 속에서 몸을 움직이는 게 좋은 사람."},
  "골목 탐험가형":       {desc:"빠르게, 알차게. 시간이 아까운 사람."},
  "효율 산책자형":       {desc:"혼자, 빡빡하게, 동선 짧게."},
  "느낌 좋은 곳 발굴형":  {desc:"분위기 있는 곳을 찾아다니는 사람."},
  "자유 탐험가형":       {desc:"어디든 좋아요. 당신의 속도대로."},
  "고즈넉한 자유 선호형": {desc:"한적하게, 정하지 않고, 천천히."},
  "동네 생활자형":       {desc:"사람과 분위기 속에 자연스럽게 섞이는 사람."},
};
function ulabel(name){ return Object.assign({name}, USER_TYPE_POOL[name]); }
function getUserType(a){
  const t=a.tempo,c=a.consume,sp=a.space,r=a.relation,inf=a.infra;
  const slow=t>=0.75,fast=t<=0.25;
  const nature=c>=0.75||sp>=0.75;
  const city=c<=0.25&&sp<=0.25;
  const alone=r<=0.25,together=r>=0.75;
  const remote=inf>=0.75;
  if(together&&(nature||sp>=0.5)) return ulabel(slow?"나란히 걷는 해변형":"동네 생활자형");
  if(alone&&slow&&nature) return ulabel("고요한 파도형");
  if(nature&&!fast&&!together) return ulabel("야외 활동좋아형");
  if(fast&&alone&&(city||sp<=0.5)) return ulabel("효율 산책자형");
  if(fast) return ulabel("골목 탐험가형");
  if(alone&&slow&&(city||sp<=0.5)) return ulabel("동네 산책자형");
  if(together&&(city||c<=0.5)) return ulabel("골목 미식가형");
  if(remote&&slow) return ulabel("고즈넉한 자유 선호형");
  if(sp>=0.5&&c>=0.5) return ulabel("느낌 좋은 곳 발굴형");
  return ulabel("자유 탐험가형");
}

const CITY_SCORES = [
  {city_id:"sokcho",name:"속초",axis:{tempo:0.812,consume:0.417,space:0.422,relation:0.429,infra:0.526},
   confidence:"mid",cityType:"고요한 파도형",oneLiner:"서두르지 않아도 바다가 기다려주는 곳",
   matchReason:"5개 도시 중 가장 느린 템포를 가진 도시예요. 일정을 빽빽이 채우기보다 한 곳에 오래 머무는 걸 좋아한다면 잘 맞아요. 아침 바다를 두 번 봐도 시간이 남는, 그런 속도예요."},
  {city_id:"gongju",name:"공주",axis:{tempo:0.05,consume:0.555,space:0.387,relation:0.444,infra:0.794},
   confidence:"high",cityType:"골목 탐험가형",oneLiner:"당일치기로 알차게 도는 곳",
   matchReason:"주말 방문이 가장 몰리는, 하루 코스로 알찬 도시예요. 시간을 빽빽하게 채워 부지런히 도는 걸 좋아한다면 잘 맞아요. 백제의 흔적이 시내 곳곳에 흩어져 있어, 반나절이면 천 년을 걷는 셈이에요."},
  {city_id:"gunsan",name:"군산",axis:{tempo:0.416,consume:0.417,space:0.426,relation:0.442,infra:0.898},
   confidence:"mid",cityType:"고즈넉한 자유 선호형",oneLiner:"자유롭게 천천히 유람하는 곳",
   matchReason:"볼거리가 가장 넓게 흩어져 있는 도시예요. 한곳에 몰려 있지 않아 유랑하듯 천천히 옮겨 다니기 좋고, 뭘 하지 않아도 되는 자유로움이 있어요. 아무것도 정하지 않은 하루가 어울리는 곳."},
  {city_id:"tongyeong",name:"통영",axis:{tempo:0.28,consume:0.575,space:0.44,relation:0.419,infra:0.677},
   confidence:"mid",cityType:"골목 탐험가형",oneLiner:"섬과 바다, 낭만과 예술이 가득한 곳",
   matchReason:"자연과 체험거리가 손꼽히게 많은 도시예요. 맛집만 도는 여행보다 섬·바다·골목을 두루 누비고 싶다면 잘 맞아요. 가서 직접 걸어봐야 진가를 아는, 그런 곳이에요."},
  {city_id:"seogwipo",name:"서귀포",axis:{tempo:0.467,consume:0.514,space:0.413,relation:0.619,infra:0.878},
   confidence:"mid",cityType:"동네 생활자형",oneLiner:"일상의 아름다움을 함께 나누는 곳",
   matchReason:"5개 도시 중 유일하게 '함께·활기' 쪽으로 기운 도시예요. 혼자만의 고요함보다 사람과 분위기 속에 섞이고 싶다면 잘 맞아요. 가장 많은 볼거리가 매일 다른 하루를 만들어 줘요."},
];

/* 속초 하루 동선 — 관계축 분기 (sokcho_places.json 실제 장소·멘트) */
const SOKCHO_COURSES = {
  solo: {
    title: "혼자 걷는 속초 하루", sub: "고요하게, 천천히",
    steps: [
      {name:"영랑호",         dur:"아침", comment:"아침에 와봐요. 물 위에 산이 뒤집혀 있어요."},
      {name:"상도문돌담마을", dur:"낮",   comment:"관광지 느낌 아니에요. 진짜 동네."},
      {name:"영금정",         dur:"일몰", comment:"일몰 때 여기 서 있으면 소리가 달라져요."},
    ]
  },
  together: {
    title: "함께 걷는 속초 하루", sub: "활기차게, 나란히",
    steps: [
      {name:"아바이마을", dur:"아침", comment:"갯배 타고 건너가요. 오징어순대 먹고."},
      {name:"대포항",     dur:"낮",   comment:"물회는 여기. 아침에 와야 제대로예요."},
      {name:"동명항",     dur:"저녁", comment:"작은 항구인데 분위기 좋아요."},
    ]
  },
  neutral: {
    title: "속초 하루 동선", sub: "처음이라면, 이 흐름으로",
    steps: [
      {name:"영랑호",     dur:"아침", comment:"아침에 와봐요. 물 위에 산이 뒤집혀 있어요."},
      {name:"아바이마을", dur:"낮",   comment:"갯배 타고 건너가요. 오징어순대 먹고."},
      {name:"영금정",     dur:"일몰", comment:"일몰 때 여기 서 있으면 소리가 달라져요."},
    ]
  }
};
/* 4개 도시 하루 동선 — 단일 코스 (관계축 분기 없음) */
const CITY_COURSES = {
  gongju: {
    title: "공주 하루 동선", sub: "천 년의 시간 위를 천천히",
    steps: [
      {name:"공산성",   dur:"아침", comment:"금강 끼고 성곽을 천천히 걸어봐요. 어지럽던 마음이 이상하게 맑아져요."},
      {name:"무령왕릉", dur:"낮",   comment:"고즈넉해요. 안에 들어서면 공기가 한 톤 가라앉아요."},
      {name:"고마나루", dur:"저녁", comment:"금강변 솔숲이 한적해요. 운 좋으면 고라니도 만나요. 곰 전설이 있는 곳이에요."},
    ]
  },
  gunsan: {
    title: "군산 하루 동선", sub: "레트로한 시간여행",
    steps: [
      {name:"경암동 철길마을", dur:"아침", comment:"집이랑 집 사이로 기찻길이 지나가요. 옛 시간이 살아난 것처럼, 자꾸 미소가 나요."},
      {name:"히로쓰 가옥",     dur:"낮",   comment:"시간이 잠깐 멈춘 것 같아요. 적산가옥 특유의 그 공기가 있어요."},
      {name:"선유도",         dur:"저녁", comment:"신선이 놀았다는 섬이에요. 섬과 섬이 다리로 이어져서, 해 질 때 바다가 정말 좋아요."},
    ]
  },
  tongyeong: {
    title: "통영 하루 동선", sub: "섬과 바다, 예술의 도시",
    steps: [
      {name:"동피랑마을", dur:"아침", comment:"언덕을 올라서면 골목마다 벽화예요. 숨차게 올라온 보람이 있어요."},
      {name:"강구안",     dur:"낮",   comment:"바다가 늘 잔잔해요. 충무김밥이랑 꿀빵 사서, 앉아서 먹기 좋아요."},
      {name:"달아공원",   dur:"저녁", comment:"한려수도 섬 사이로 해가 져요. 그 석양 보러 일부러 와요."},
    ]
  },
  seogwipo: {
    title: "서귀포 하루 동선", sub: "보물 같은 도시, 아직 발굴할 게 남은",
    steps: [
      {name:"천지연폭포", dur:"아침", comment:"물소리가 생각보다 커요. 잠깐 들렀다 가는데도 오래 서 있게 돼요."},
      {name:"올레시장",   dur:"낮",   comment:"먹을 거 사서 한 바퀴 돌다 보면 이중섭거리로 빠져요. 오후가 그냥 흘러가요."},
      {name:"외돌개",     dur:"저녁", comment:"바다 절벽에 바위가 장승처럼 솟아 있어요. 한참 보게 돼요."},
    ]
  },
};
/* 코스 카드 렌더 — steps 배열을 받아 공통 렌더 */
function renderCourseCard(course){
  const steps = course.steps.map((s,i)=>`
    <div class="cv-step">
      <div class="cv-num">${i+1}</div>
      <div class="cv-body">
        <div class="cv-place">${s.name}<span class="cv-dur">${s.dur}</span></div>
        <div class="cv-comment">${s.comment}</div>
      </div>
    </div>`).join('');
  return `
    <div class="course-card">
      <div class="cv-promise">지금은 동선까지.<br><b>곧, 그 동네 사람의 하루까지.</b></div>
      <div class="cv-title">${course.title}</div>
      <div class="cv-sub">${course.sub}</div>
      ${steps}
    </div>`;
}

/* 속초 — 관계축 분기 유지 */
function renderSokchoCourse(relation){
  const c = relation<=0.25 ? SOKCHO_COURSES.solo
          : relation>=0.75 ? SOKCHO_COURSES.together
          : SOKCHO_COURSES.neutral;
  return renderCourseCard(c);
}


const AXIS_KEYS=["tempo","consume","space","relation","infra"];
const AXIS_WEIGHTS={tempo:1,consume:1,space:1,relation:1,infra:1};
const FIT_LO=58, FIT_HI=94;
function matchCities(userAxes, topN=3){
  const maxDist=Math.sqrt(AXIS_KEYS.reduce((s,k)=>s+AXIS_WEIGHTS[k],0));
  const all=CITY_SCORES.map(city=>{
    let sum=0;
    for(const k of AXIS_KEYS){const u=userAxes[k]??0.5;const d=u-city.axis[k];sum+=AXIS_WEIGHTS[k]*d*d;}
    return Object.assign({},city,{dist:Math.sqrt(sum)});
  });
  const ds=all.map(c=>c.dist);
  const dMin=Math.min(...ds),dMax=Math.max(...ds);
  const span=(dMax-dMin)||1e-9;
  const scored=all.map(c=>{
    const absFit=1-c.dist/maxDist;
    const relFit=1-(c.dist-dMin)/span;
    const mix=absFit*0.4+relFit*0.6;
    return Object.assign({},c,{matchPct:Math.round(FIT_LO+mix*(FIT_HI-FIT_LO))});
  });
  scored.sort((a,b)=>a.dist-b.dist);
  for(let i=1;i<scored.length;i++){
    if(scored[i].matchPct>=scored[i-1].matchPct){ scored[i].matchPct=scored[i-1].matchPct-1; }
  }
  return scored.slice(0,topN);
}

/* 설정 — 폼/SNS 링크 확정되면 여기만 교체 */
const CONFIG = {
  formUrl: "https://forms.gle/QggD6JeQGTfmLnhK8",
  instaUrl: "#",
  contactEmail: "conipoky1347@gmail.com",
  logUrl: "https://script.google.com/macros/s/AKfycbyDG8OrukdyhF-6uE2sIY4Q_tYYH9sYr_iMlfL4xtRGJJbbqY0raf8sEcPtsma8VjQDnw/exec"
};

/* ----- 행동 로그 전송 (Google Sheet) ----- */
function logEvent(eventName, data){
  try{
    fetch(CONFIG.logUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ event: eventName }, data || {}))
    });
  }catch(err){ /* 로깅 실패는 사용자 경험을 막지 않음 */ }
}

/* =====================================================================
   매칭 오버레이 로직
   ===================================================================== */
let step=0, axes={};
let overlay, ovContent, ovCount, ovDots;

function bindMatchEngine(){
  overlay   = document.getElementById('overlay');
  ovContent = document.getElementById('ovContent');
  ovCount   = document.getElementById('ovCount');
  ovDots    = document.getElementById('ovDots');
  const sb = document.getElementById('signupBtn');   if(sb){ sb.href = CONFIG.formUrl; sb.addEventListener('click', ()=>logEvent('external_link_click',{link_category:'signup',link_domain:'google_form'})); }
  const sb2 = document.getElementById('signupBtn2');  if(sb2){ sb2.href = CONFIG.formUrl; sb2.addEventListener('click', ()=>logEvent('external_link_click',{link_category:'signup',link_domain:'google_form'})); }
  const ml = document.getElementById('mailLink');    if(ml) ml.href = "mailto:"+CONFIG.contactEmail;
}

function openMatch(){
  step=0; axes={};
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
  renderDots(); renderQuestion();
  logEvent("match_start");
}

function closeMatch(){
  overlay.classList.remove('open');
  document.body.style.overflow='';
}
function renderDots(){
  ovDots.innerHTML = MQ.map((_,i)=>`<span class="ov-dot ${i<=step?'on':''}"></span>`).join('');
  ovCount.textContent = `${String(Math.min(step+1,MQ.length)).padStart(2,'0')} / ${String(MQ.length).padStart(2,'0')}`;
}
function renderQuestion(){
  const q=MQ[step];
  ovContent.innerHTML = `
    <div class="q-body q-anim">
      <div class="q-num">${String(step+1).padStart(2,'0')}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-choices">
        <button class="q-choice" onclick="choose(0)"><span>${q.a}</span></button>
        <button class="q-choice mid" onclick="choose(0.5)"><span>${q.m}</span></button>
        <button class="q-choice" onclick="choose(1)"><span>${q.b}</span></button>
      </div>
    </div>`;
  renderDots();
}
function choose(v){
  axes[MQ[step].axis]=v;
  if(step<MQ.length-1){ step++; renderQuestion(); }
  else { showSearching(); }
}
function showSearching(){
  renderDots();
  ovContent.innerHTML = `
    <div class="searching q-anim">
      <div class="searching-mark"><span></span><span></span><span></span></div>
      <div class="t">당신의 도시를<br>찾고 있어요</div>
    </div>`;
  setTimeout(showResult, 1700);
}
function showResult(){
  const final={tempo:axes.tempo??0.5,consume:axes.consume??0.5,space:axes.space??0.5,relation:axes.relation??0.5,infra:axes.infra??0.5};
  const ct=getUserType(final);
  const top=matchCities(final,3);
  logEvent("match_complete", {
    tempo: final.tempo, consume: final.consume, space: final.space,
    relation: final.relation, infra: final.infra,
    city1: top[0]?.name, pct1: top[0]?.matchPct,
    city2: top[1]?.name, city3: top[2]?.name
  });
  const confLabel={high:"데이터 충분",mid:"데이터 보통",low:"데이터 부족"};
  const top1=top[0];
  const sokchoIsTop = top1.city_id==="sokcho";
  let courseBlock;
if(sokchoIsTop){
  courseBlock = `<div class="r-section topgap">먼저 열리는 도시 · 속초</div>
     ${renderSokchoCourse(final.relation)}`;
} else if(CITY_COURSES[top1.city_id]){
  courseBlock = `<div class="r-section topgap">${top1.name}의 하루</div>
     ${renderCourseCard(CITY_COURSES[top1.city_id])}`;
} else {
  courseBlock = `<div class="r-section topgap">${top1.name}의 하루</div>
     <div class="course-card">
       <div class="cv-promise">${top1.name}의 하루 동선은 지금 준비 중이에요.<br>
       <b>곧, 그 동네 사람의 하루까지.</b></div>
     </div>`;
}

  ovCount.textContent = "결과";
  ovDots.innerHTML="";
  const ctaNote = sokchoIsTop
    ? `당신과 가장 잘 맞는 도시는 <b>속초</b>.<br>가장 먼저 문을 여는 도시예요. 준비되면 알려드릴께요.`
    : `당신과 가장 잘 맞는 도시는 <b>${top1.name}</b>.<br>속초를 시작으로, <b>${top1.name}</b>도 곧 이렇게 깊어져요. 준비되면 알려드릴게요.`;

  const firstCard = `
    <div class="city-row top">
      <div class="cr-rank">01</div>
      <div class="cr-main">
        <div class="cr-head"><span class="cr-name">${top1.name}</span><span class="cr-pct">${top1.matchPct}<i>%</i></span></div>
        <div class="cr-type">${top1.cityType}</div>
        <div class="cr-one">${top1.oneLiner}</div>
        <div class="cr-reason">${top1.matchReason}</div>
      </div>
    </div>`;
  const restCards = top.slice(1).map((c,i)=>`
    <div class="city-row">
      <div class="cr-rank">${String(i+2).padStart(2,'0')}</div>
      <div class="cr-main">
        <div class="cr-head"><span class="cr-name">${c.name}</span><span class="cr-pct">${c.matchPct}<i>%</i></span></div>
        <div class="cr-type">${c.cityType}</div>
        <div class="cr-one">${c.oneLiner}</div>
        <div class="cr-foot"><span class="cr-conf">${confLabel[c.confidence]||""}</span><span class="cr-soon">곧 깊어져요</span></div>
      </div>
    </div>`).join('');

  ovContent.innerHTML = `
    <div class="result q-anim">
      <div id="shareCapture">
        <div class="r-label">나의 생활 유형</div>
        <div class="r-type">${ct.name}</div>
        <div class="r-desc">${ct.desc}</div>
        <div class="r-rule"></div>
        <div class="r-section">나와 맞는 도시</div>
        ${firstCard}
        <div class="capture-brand">구독도시 · gudokdosi</div>
      </div>
      ${restCards}
      ${courseBlock}
            <div class="r-cta">
        <div class="r-cta-note">${ctaNote}</div>
        <a class="btn btn-fill" href="${CONFIG.formUrl}" target="_blank" rel="noopener" onclick="logEvent('external_link_click',{link_category:'feedback',link_domain:'google_form',city_id:'${top1.city_id}'})">이 결과, 어떠셨나요?</a>
        <button class="r-share" onclick="logEvent('result_save',{city_id:'${top1.city_id}',match_rate:${top1.matchPct}}); shareResult('${top1.name}', ${top1.matchPct})">결과 이미지로 저장하기</button>
      </div>
    </div>`;
  overlay.scrollTop=0;
}
async function shareResult(city, pct){
  const node = document.getElementById('shareCapture');
  if(!node || typeof html2canvas==='undefined'){ alert("이미지를 만들 수 없어요. 잠시 후 다시 시도해주세요."); return; }
  const btn = document.querySelector('.r-share');
  const orig = btn ? btn.textContent : '';
  if(btn){ btn.textContent = "이미지 만드는 중…"; btn.disabled = true; }
  try{
    if(document.fonts && document.fonts.ready){ await document.fonts.ready; }
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--plum-deep').trim() || "#241B2E";
    const canvas = await html2canvas(node, {backgroundColor:bg, scale:2, useCORS:true});
    const a = document.createElement('a');
    a.href = canvas.toDataURL("image/png"); a.download = `구독도시_${city}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  }catch(e){ alert("이미지 저장에 실패했어요. 화면 캡처로 공유해주세요."); }
  finally{ if(btn){ btn.textContent = orig; btn.disabled = false; } }
}

document.addEventListener('keydown',e=>{ if(e.key==='Escape' && overlay && overlay.classList.contains('open')) closeMatch(); });
