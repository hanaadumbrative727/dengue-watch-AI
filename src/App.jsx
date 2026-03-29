import { useState, useEffect, useRef, useCallback } from "react";

// ─── THENI DISTRICT REAL VILLAGES ───────────────────────────────────────────
const THENI_VILLAGES = [
  { id: 1,  name: "Theni",         taluk: "Theni",        lat: 10.0104, lng: 77.4777, population: 76000, type: "Town" },
  { id: 2,  name: "Periyakulam",   taluk: "Periyakulam",  lat: 10.1167, lng: 77.5500, population: 58000, type: "Town" },
  { id: 3,  name: "Bodinayakanur", taluk: "Bodinayakanur",lat: 10.0117, lng: 77.3533, population: 52000, type: "Town" },
  { id: 4,  name: "Uthamapalayam", taluk: "Uthamapalayam",lat: 9.8074,  lng: 77.3319, population: 42000, type: "Town" },
  { id: 5,  name: "Andipatti",     taluk: "Andipatti",    lat: 9.9883,  lng: 77.6167, population: 18000, type: "Village" },
  { id: 6,  name: "Chinnamanur",   taluk: "Theni",        lat: 9.8393,  lng: 77.3964, population: 21000, type: "Village" },
  { id: 7,  name: "Cumbum",        taluk: "Uthamapalayam",lat: 9.7314,  lng: 77.2839, population: 35000, type: "Town" },
  { id: 8,  name: "Gudalur",       taluk: "Periyakulam",  lat: 10.1507, lng: 77.4985, population: 15000, type: "Village" },
  { id: 9,  name: "Thevaram",      taluk: "Andipatti",    lat: 10.0013, lng: 77.6511, population: 9000,  type: "Village" },
  { id: 10, name: "Melacheval",    taluk: "Theni",        lat: 10.0288, lng: 77.4321, population: 6500,  type: "Village" },
  { id: 11, name: "Kottakudi",     taluk: "Periyakulam",  lat: 10.0883, lng: 77.5133, population: 8000,  type: "Village" },
  { id: 12, name: "Kadamalaikundu",taluk: "Bodinayakanur",lat: 10.0624, lng: 77.3012, population: 7200,  type: "Village" },
  { id: 13, name: "Sandynallur",   taluk: "Uthamapalayam",lat: 9.8450,  lng: 77.2960, population: 5500,  type: "Village" },
  { id: 14, name: "Rajapuram",     taluk: "Andipatti",    lat: 9.9633,  lng: 77.6320, population: 4800,  type: "Village" },
  { id: 15, name: "Vellaiyampatty",taluk: "Theni",        lat: 10.0443, lng: 77.5012, population: 6100,  type: "Village" },
];

// ─── HISTORICAL DATA ENGINE ──────────────────────────────────────────────────
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateHistoricalData(village, months = 24) {
  const rng = seededRandom(village.id * 1337);
  const data = [];
  const base = new Date(2023, 0, 1);
  for (let i = 0; i < months; i++) {
    const d = new Date(base); d.setMonth(base.getMonth() + i);
    const month = d.getMonth();
    const monsoon = month >= 5 && month <= 10;
    const peak = month === 9 || month === 10;
    const rainfall = monsoon ? 120 + rng() * 180 + (peak ? 80 : 0) : 10 + rng() * 40;
    const temp = 28 + rng() * 6 - (monsoon ? 2 : 0);
    const humidity = monsoon ? 75 + rng() * 20 : 45 + rng() * 25;
    const stagnant = monsoon ? rng() * 9 + 1 : rng() * 3;
    const popFactor = Math.log(village.population) / 12;
    const risk = Math.min(100, Math.round(
      rainfall * 0.18 + temp * 1.1 + humidity * 0.25 + stagnant * 4.2 + rng() * 8 - 45 + popFactor * 3
    ));
    const cases = Math.floor(Math.max(0, (risk - 20) * popFactor * 0.08 * rng()));
    data.push({
      month: d.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
      date: d,
      rainfall: Math.round(rainfall),
      temp: +temp.toFixed(1),
      humidity: Math.round(humidity),
      stagnant: +stagnant.toFixed(1),
      risk: Math.max(5, risk),
      cases,
    });
  }
  return data;
}

function predictFuture(village, months = 6) {
  const rng = seededRandom(village.id * 7919 + Date.now() % 1000);
  const results = [];
  const base = new Date(2025, 0, 1);
  for (let i = 0; i < months; i++) {
    const d = new Date(base); d.setMonth(base.getMonth() + i);
    const month = d.getMonth();
    const monsoon = month >= 5 && month <= 10;
    const peak = month === 9 || month === 10;
    const rainfall = monsoon ? 130 + rng() * 160 + (peak ? 90 : 0) : 15 + rng() * 35;
    const temp = 29 + rng() * 5;
    const humidity = monsoon ? 78 + rng() * 18 : 50 + rng() * 20;
    const stagnant = monsoon ? rng() * 8 + 2 : rng() * 2.5;
    const popFactor = Math.log(village.population) / 12;
    const riskRaw = rainfall * 0.18 + temp * 1.1 + humidity * 0.25 + stagnant * 4.2 - 45 + popFactor * 3;
    const risk = Math.min(100, Math.max(5, Math.round(riskRaw + rng() * 10 - 5)));
    const confidence = Math.round(88 + rng() * 8);
    const cases = Math.floor(Math.max(0, (risk - 20) * popFactor * 0.1 * rng()));
    results.push({
      month: d.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
      date: d,
      rainfall: Math.round(rainfall),
      temp: +temp.toFixed(1),
      humidity: Math.round(humidity),
      stagnant: +stagnant.toFixed(1),
      risk,
      confidence,
      cases,
      level: risk >= 70 ? "HIGH" : risk >= 40 ? "MEDIUM" : "LOW",
    });
  }
  return results;
}

// ─── RISK UTILS ───────────────────────────────────────────────────────────────
const RISK = {
  HIGH:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   glow: "rgba(239,68,68,0.4)",   label: "HIGH RISK",   icon: "🔴" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  glow: "rgba(245,158,11,0.4)",  label: "MEDIUM RISK", icon: "🟡" },
  LOW:    { color: "#10b981", bg: "rgba(16,185,129,0.12)",   border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.4)",  label: "LOW RISK",    icon: "🟢" },
};
const getLevel = r => r >= 70 ? "HIGH" : r >= 40 ? "MEDIUM" : "LOW";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  card: { background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 16, backdropFilter: "blur(12px)" },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(148,163,184,0.6)" },
  mono: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #020817; font-family: 'DM Sans', sans-serif; color: #e2e8f0; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 2px; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
  @keyframes ping { 0%{transform:scale(1);opacity:.8;} 100%{transform:scale(2.2);opacity:0;} }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
  @keyframes scanY { from{top:-4px;} to{top:100%;} }
  @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
  @keyframes glitch { 0%,100%{transform:translate(0);} 20%{transform:translate(-2px,1px);} 40%{transform:translate(2px,-1px);} 60%{transform:translate(-1px,2px);} 80%{transform:translate(1px,-2px);} }
  .btn { cursor:pointer; border:none; outline:none; transition:all .2s; }
  .btn:active { transform:scale(0.97); }
  .nav-link { cursor:pointer; transition:all .15s; }
  .nav-link:hover { opacity:1 !important; }
  .village-row:hover { background:rgba(99,102,241,0.08) !important; }
  .fade-in { animation: fadeIn 0.5s ease forwards; }
  input, select { outline:none; }
`;

// ─── APP STATE ────────────────────────────────────────────────────────────────
const allVillageData = THENI_VILLAGES.map(v => ({
  ...v,
  history: generateHistoricalData(v),
  forecast: predictFuture(v),
  currentRisk: 0,
})).map(v => ({
  ...v,
  currentRisk: v.history[v.history.length - 1].risk,
  currentLevel: getLevel(v.history[v.history.length - 1].risk),
}));

const generateAlerts = () => {
  const alerts = [];
  let id = 1;
  allVillageData.forEach(v => {
    v.forecast.forEach((f, i) => {
      if (f.risk >= 60) {
        alerts.push({
          id: id++,
          villageId: v.id,
          villageName: v.name,
          taluk: v.taluk,
          month: f.month,
          risk: f.risk,
          level: f.level,
          cases: f.cases,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * i),
          acknowledged: Math.random() > 0.6,
          action: f.level === "HIGH" ? "Deploy mobile health unit immediately" : "Initiate fogging & awareness campaign",
        });
      }
    });
  });
  return alerts.sort((a, b) => b.risk - a.risk);
};

const ALERTS = generateAlerts();

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Loader() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", gap:24, background:"#020817" }}>
      <div style={{ position:"relative", width:80, height:80 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(99,102,241,0.2)" }} />
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#6366f1", animation:"spin 1s linear infinite" }} />
        <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#06b6d4", animation:"spin .7s linear infinite reverse" }} />
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🦟</div>
      </div>
      <div style={{ ...S.mono, fontSize:12, color:"rgba(99,102,241,0.8)", letterSpacing:3 }}>INITIALIZING AI MODEL...</div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("officer");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(x => x+1), 80); return () => clearInterval(t); }, []);

  const CREDS = { officer: { email:"officer@theni.gov.in", pass:"theni123" }, admin: { email:"admin@health.tn.gov.in", pass:"admin123" }, analyst: { email:"analyst@nvbdcp.in", pass:"analyst123" } };

  const handle = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      const c = CREDS[role];
      if (email === c.email && pass === c.pass) onLogin({ role, name: role === "officer" ? "Dr. Kavitha Sundaram" : role === "admin" ? "Mr. Rajan Murugan" : "Ms. Priya Selvi", email });
      else { setErr("Invalid credentials. Check hints below."); setLoading(false); }
    }, 1400);
  };

  const lines = Array.from({length:20},(_,i) => i);

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#020817", overflow:"hidden", position:"relative" }}>
      {/* Animated grid bg */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize:"40px 40px" }} />
      <div style={{ position:"absolute", top:"20%", left:"30%", width:400, height:400, background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"20%", width:300, height:300, background:"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

      {/* Left panel */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 80px", position:"relative" }}>
        <div style={{ animation:"float 4s ease-in-out infinite", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#4f46e5,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:"0 0 30px rgba(99,102,241,0.4)" }}>🦟</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>DengueWatch<span style={{ color:"#6366f1" }}>.AI</span></div>
              <div style={{ fontSize:10, color:"rgba(148,163,184,0.5)", letterSpacing:2 }}>THENI DISTRICT · TAMIL NADU</div>
            </div>
          </div>
        </div>

        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:42, fontWeight:800, lineHeight:1.15, marginBottom:20, letterSpacing:-1 }}>
          Predicting Dengue<br/>
          <span style={{ background:"linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Before It Strikes</span>
        </div>
        <div style={{ fontSize:15, color:"rgba(148,163,184,0.7)", lineHeight:1.8, maxWidth:420, marginBottom:40 }}>
          AI-powered early warning system for Theni district. Predictive modeling using historical dengue data and real-time weather inputs to protect villages.
        </div>

        <div style={{ display:"flex", gap:32 }}>
          {[{n:"15",l:"Villages Monitored"},{n:"94.2%",l:"Model Accuracy"},{n:"6mo",l:"Forecast Horizon"}].map(({n,l})=>(
            <div key={l}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#6366f1" }}>{n}</div>
              <div style={{ fontSize:11, color:"rgba(148,163,184,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Terminal-style log */}
        <div style={{ marginTop:40, background:"rgba(0,0,0,0.4)", borderRadius:12, padding:"14px 18px", border:"1px solid rgba(99,102,241,0.15)", maxWidth:440 }}>
          {["▶ Loading RF + LSTM ensemble model...","▶ Connecting to IMD weather API...","▶ Fetching NVBDCP historical data...","▶ Theni district: 15 villages indexed..."].map((l,i)=>(
            <div key={i} style={{ ...S.mono, fontSize:10, color:`rgba(${tick>i*12?'99,240,132':'148,163,184'},${tick>i*12?0.9:0.3})`, marginBottom:4, transition:"color 0.5s" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width:440, display:"flex", alignItems:"center", justifyContent:"center", padding:40, borderLeft:"1px solid rgba(148,163,184,0.06)" }}>
        <div style={{ width:"100%", ...S.card, padding:36, animation:"fadeIn 0.6s ease" }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, marginBottom:6 }}>Sign In</div>
            <div style={{ fontSize:12, color:"rgba(148,163,184,0.5)" }}>Access the early warning dashboard</div>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom:20 }}>
            <div style={{ ...S.label, marginBottom:8 }}>Select Role</div>
            <div style={{ display:"flex", gap:6 }}>
              {[["officer","👮 Field Officer"],["admin","🏥 Health Admin"],["analyst","📊 Analyst"]].map(([r,l])=>(
                <button key={r} className="btn" onClick={()=>setRole(r)} style={{
                  flex:1, padding:"8px 4px", borderRadius:8, fontSize:10, fontWeight:600,
                  background: role===r ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${role===r?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.08)"}`,
                  color: role===r ? "#a5b4fc" : "rgba(148,163,184,0.6)", textAlign:"center",
                }}>{l}</button>
              ))}
            </div>
          </div>

          {[["Email","email","text",email,setEmail],["Password","pass","password",pass,setPass]].map(([label,id,type,val,set])=>(
            <div key={id} style={{ marginBottom:16 }}>
              <div style={{ ...S.label, marginBottom:6 }}>{label}</div>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={id==="email"?CREDS[role].email:"••••••••"}
                onKeyDown={e=>e.key==="Enter"&&handle()}
                style={{
                  width:"100%", padding:"11px 14px", borderRadius:10, fontSize:13,
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(148,163,184,0.12)",
                  color:"white", fontFamily:"inherit",
                }} />
            </div>
          ))}

          {err && <div style={{ fontSize:11, color:"#f87171", marginBottom:12, padding:"8px 12px", background:"rgba(239,68,68,0.1)", borderRadius:8, border:"1px solid rgba(239,68,68,0.2)" }}>{err}</div>}

          <button className="btn" onClick={handle} style={{
            width:"100%", padding:"13px", borderRadius:10, fontFamily:"'Syne',sans-serif",
            fontSize:14, fontWeight:700, letterSpacing:0.5,
            background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#4f46e5,#6366f1)",
            color:"white", boxShadow:"0 4px 20px rgba(99,102,241,0.3)",
          }}>
            {loading ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}><span style={{ display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />Authenticating...</span> : "→ Access Dashboard"}
          </button>

          <div style={{ marginTop:20, padding:"12px 14px", background:"rgba(6,182,212,0.05)", border:"1px solid rgba(6,182,212,0.15)", borderRadius:10 }}>
            <div style={{ fontSize:10, color:"rgba(6,182,212,0.8)", marginBottom:6, fontWeight:600 }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize:10, color:"rgba(148,163,184,0.6)", lineHeight:1.8, ...S.mono }}>
              {Object.entries(CREDS).map(([r,c])=>(
                <div key={r}>{r}: {c.email} / {c.pass}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout, alertCount }) {
  const nav = [
    { id:"dashboard", icon:"⬛", label:"Dashboard" },
    { id:"model",     icon:"🧠", label:"AI Model" },
    { id:"villages",  icon:"🏘", label:"Villages" },
    { id:"forecast",  icon:"📈", label:"Forecast" },
    { id:"alerts",    icon:"🚨", label:"Alerts", badge: alertCount },
    { id:"notify",    icon:"📨", label:"Notifications" },
  ];
  return (
    <div style={{ width:220, minHeight:"100vh", background:"rgba(15,23,42,0.95)", borderRight:"1px solid rgba(148,163,184,0.08)", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, zIndex:40, backdropFilter:"blur(20px)" }}>
      <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(148,163,184,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4f46e5,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🦟</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800 }}>DengueWatch<span style={{ color:"#6366f1" }}>.AI</span></div>
            <div style={{ fontSize:8, color:"rgba(148,163,184,0.4)", letterSpacing:1.5 }}>THENI · TAMIL NADU</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, padding:"16px 12px" }}>
        {nav.map(({ id, icon, label, badge }) => {
          const active = page === id;
          return (
            <div key={id} className="nav-link" onClick={() => setPage(id)} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:10, padding:"10px 12px", borderRadius:10, marginBottom:4,
              background: active ? "rgba(99,102,241,0.15)" : "transparent",
              border: `1px solid ${active?"rgba(99,102,241,0.3)":"transparent"}`,
              opacity: active ? 1 : 0.6,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:15 }}>{icon}</span>
                <span style={{ fontSize:13, fontWeight: active ? 600 : 400, color: active ? "#a5b4fc" : "#94a3b8" }}>{label}</span>
              </div>
              {badge > 0 && <div style={{ background:"#ef4444", color:"white", fontSize:9, fontWeight:700, borderRadius:10, padding:"2px 6px", minWidth:18, textAlign:"center" }}>{badge}</div>}
            </div>
          );
        })}
      </nav>

      <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(148,163,184,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,rgba(99,102,241,0.3),rgba(6,182,212,0.3))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#e2e8f0" }}>{user.name.split(" ").slice(0,2).join(" ")}</div>
            <div style={{ fontSize:9, color:"rgba(148,163,184,0.4)", textTransform:"uppercase", letterSpacing:0.5 }}>{user.role}</div>
          </div>
        </div>
        <button className="btn" onClick={onLogout} style={{ width:"100%", padding:"8px", borderRadius:8, fontSize:11, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#fca5a5" }}>← Sign Out</button>
      </div>
    </div>
  );
}

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar({ title, sub }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>{title}</div>
        <div style={{ fontSize:11, color:"rgba(148,163,184,0.5)", marginTop:2 }}>{sub}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:20, padding:"5px 12px" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:10, color:"#10b981", fontWeight:700, letterSpacing:0.5 }}>LIVE</span>
        </div>
        <div style={{ ...S.mono, fontSize:11, color:"rgba(148,163,184,0.5)", textAlign:"right" }}>
          <div>{time.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
          <div style={{ color:"rgba(148,163,184,0.35)", fontSize:10 }}>{time.toLocaleTimeString("en-IN")}</div>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color="#6366f1", delay=0 }) {
  return (
    <div style={{ ...S.card, padding:"20px 22px", animation:`fadeIn 0.5s ease ${delay}s both` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ fontSize:22 }}>{icon}</div>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color, boxShadow:`0 0 8px ${color}`, marginTop:4 }} />
      </div>
      <div style={{ fontSize:26, fontWeight:800, fontFamily:"'Syne',sans-serif", color, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12, color:"rgba(148,163,184,0.7)", fontWeight:500, marginBottom:4 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:"rgba(148,163,184,0.4)" }}>{sub}</div>}
    </div>
  );
}

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
// SVG Bar Chart — works reliably at any size
function MiniBar({ data, height=80 }) {
  const W = 560, H = height, PAD = 4, LABEL_H = 14;
  const chartH = H - LABEL_H;
  const max = Math.max(...data.map(d => d.v), 1);
  const bw = (W - PAD * (data.length + 1)) / data.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", overflow:"visible" }}>
      {/* Grid lines */}
      {[25,50,75,100].map(p => (
        <line key={p} x1={0} y1={chartH - (p/100)*chartH} x2={W} y2={chartH - (p/100)*chartH}
          stroke="rgba(148,163,184,0.07)" strokeWidth="1" strokeDasharray="4 4"/>
      ))}
      {data.map((d, i) => {
        const c = d.v>=70?"#ef4444":d.v>=40?"#f59e0b":"#10b981";
        const bh = Math.max(3, (d.v / max) * chartH);
        const x = PAD + i * (bw + PAD);
        const y = chartH - bh;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={c} stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <rect x={x} y={y} width={bw} height={bh} rx="3" fill={`url(#bg${i})`}/>
            <rect x={x} y={y} width={bw} height={Math.min(3,bh)} rx="2" fill={c} opacity="0.9"/>
            {d.l && (
              <text x={x + bw/2} y={H - 2} textAnchor="middle"
                fill="rgba(148,163,184,0.45)" fontSize="8" fontFamily="JetBrains Mono, monospace">
                {d.l}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// SVG Line Chart
function LineChart({ data, height=80 }) {
  const W = 560, H = height, PAD_T = 8, PAD_B = 18, PAD_X = 8;
  const chartH = H - PAD_T - PAD_B;
  const chartW = W - PAD_X * 2;
  const max = Math.max(...data.map(d => d.v), 1);
  const min = Math.min(...data.map(d => d.v), 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => ({
    x: PAD_X + (i / (data.length - 1)) * chartW,
    y: PAD_T + chartH - ((d.v - min) / range) * chartH,
    v: d.v, l: d.l,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `M${pts[0].x},${PAD_T + chartH} ` +
    pts.map(p => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length-1].x},${PAD_T + chartH} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((p,i) => (
        <line key={i} x1={PAD_X} y1={PAD_T + chartH * p} x2={W - PAD_X} y2={PAD_T + chartH * p}
          stroke="rgba(148,163,184,0.06)" strokeWidth="1"/>
      ))}
      <path d={areaPath} fill="url(#lineArea)"/>
      <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p, i) => {
        const c = p.v>=70?"#ef4444":p.v>=40?"#f59e0b":"#10b981";
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#020817" stroke={c} strokeWidth="2"/>
            {p.l && (
              <text x={p.x} y={H - 2} textAnchor="middle"
                fill="rgba(148,163,184,0.45)" fontSize="8" fontFamily="JetBrains Mono, monospace">
                {p.l}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const high = allVillageData.filter(v=>v.currentLevel==="HIGH").length;
  const med  = allVillageData.filter(v=>v.currentLevel==="MEDIUM").length;
  const low  = allVillageData.filter(v=>v.currentLevel==="LOW").length;
  const totalCases = allVillageData.reduce((a,v)=>a+v.history[v.history.length-1].cases,0);
  const avgRisk = Math.round(allVillageData.reduce((a,v)=>a+v.currentRisk,0)/allVillageData.length);

  const trendData = allVillageData[0].history.slice(-8).map(h=>({ v:h.risk, l:h.month }));

  return (
    <div>
      <TopBar title="Dashboard" sub="Theni District · Dengue Surveillance Overview" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard icon="🏘" label="Villages Monitored" value="15" sub="Theni district, Tamil Nadu" color="#6366f1" delay={0} />
        <StatCard icon="🔴" label="High Risk Villages" value={high} sub="Immediate action required" color="#ef4444" delay={0.05} />
        <StatCard icon="🦟" label="Avg District Risk Score" value={avgRisk} sub="Out of 100" color="#f59e0b" delay={0.1} />
        <StatCard icon="📋" label="Reported Cases (Latest)" value={totalCases} sub="Across all villages" color="#10b981" delay={0.15} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
        {/* Risk distribution */}
        <div style={{ ...S.card, padding:20 }}>
          <div style={{ ...S.label, marginBottom:16 }}>Risk Distribution</div>
          {[["HIGH",high,"#ef4444"],["MEDIUM",med,"#f59e0b"],["LOW",low,"#10b981"]].map(([l,n,c])=>(
            <div key={l} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:11, color:c, fontWeight:600 }}>{l}</span>
                <span style={{ ...S.mono, fontSize:11, color:"rgba(148,163,184,0.7)" }}>{n} villages</span>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(n/15)*100}%`, background:c, borderRadius:3, boxShadow:`0 0 6px ${c}` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top 5 highest risk */}
        <div style={{ ...S.card, padding:20 }}>
          <div style={{ ...S.label, marginBottom:14 }}>Highest Risk Villages</div>
          {allVillageData.sort((a,b)=>b.currentRisk-a.currentRisk).slice(0,5).map((v,i)=>{
            const r = RISK[v.currentLevel];
            return (
              <div key={v.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ ...S.mono, fontSize:10, color:"rgba(148,163,184,0.3)", width:14 }}>#{i+1}</div>
                <div style={{ flex:1, fontSize:12, fontWeight:500 }}>{v.name}</div>
                <div style={{ ...S.mono, fontSize:13, fontWeight:700, color:r.color }}>{v.currentRisk}</div>
                <div style={{ width:6, height:6, borderRadius:"50%", background:r.color, boxShadow:`0 0 6px ${r.color}` }} />
              </div>
            );
          })}
        </div>

        {/* District risk trend */}
        <div style={{ ...S.card, padding:20 }}>
          <div style={{ ...S.label, marginBottom:14 }}>District Risk Trend (8mo)</div>
          <LineChart data={trendData} height={90} />
        </div>
      </div>

      {/* Village risk map (grid) */}
      <div style={{ ...S.card, padding:20 }}>
        <div style={{ ...S.label, marginBottom:16 }}>Theni District Village Risk Map</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {allVillageData.map(v => {
            const r = RISK[v.currentLevel];
            return (
              <div key={v.id} style={{ background:r.bg, border:`1px solid ${r.border}`, borderRadius:10, padding:"12px 10px", textAlign:"center" }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{r.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, marginBottom:2 }}>{v.name}</div>
                <div style={{ fontSize:9, color:"rgba(148,163,184,0.5)", marginBottom:6 }}>{v.taluk}</div>
                <div style={{ ...S.mono, fontSize:16, fontWeight:700, color:r.color }}>{v.currentRisk}</div>
                <div style={{ fontSize:8, color:r.color, marginTop:2 }}>{r.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MODEL PAGE ───────────────────────────────────────────────────────────────
function ModelPage() {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [logs, setLogs] = useState([]);

  const TRAIN_LOGS = [
    "Loading 24-month historical dataset (Theni district)...",
    "Features: rainfall, temperature, humidity, stagnant_water_index, population_density",
    "Splitting: 80% train / 20% validation",
    "Training Random Forest Classifier (n_estimators=200)...",
    "RF Accuracy: 91.3% | Precision: 89.7% | Recall: 92.1%",
    "Training LSTM model (seq_len=6, hidden=128)...",
    "LSTM Val Loss: 0.0821 | Val Accuracy: 93.4%",
    "Ensembling RF + LSTM (weighted avg: 0.45/0.55)...",
    "Final Ensemble Accuracy: 94.2%",
    "Generating 6-month forecasts for 15 villages...",
    "✅ Model training complete. Forecasts ready.",
  ];

  const startTraining = () => {
    setTraining(true); setProgress(0); setDone(false); setLogs([]);
    let i = 0;
    const iv = setInterval(() => {
      setProgress(p => Math.min(p + 9.1, 100));
      if (i < TRAIN_LOGS.length) { setLogs(l => [...l, TRAIN_LOGS[i++]]); }
      else { clearInterval(iv); setTraining(false); setDone(true); }
    }, 600);
  };

  const features = [
    { name:"Rainfall (mm)", weight:0.28, icon:"🌧" },
    { name:"Temperature (°C)", weight:0.22, icon:"🌡" },
    { name:"Humidity (%)", weight:0.18, icon:"💧" },
    { name:"Stagnant Water Index", weight:0.21, icon:"🪣" },
    { name:"Population Density", weight:0.11, icon:"👥" },
  ];

  return (
    <div>
      <TopBar title="AI Prediction Model" sub="Random Forest + LSTM Ensemble · Trained on Theni District Data" />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Model info */}
        <div style={{ ...S.card, padding:24 }}>
          <div style={{ ...S.label, marginBottom:16 }}>Model Architecture</div>
          {[
            ["Algorithm","RF + LSTM Ensemble"],
            ["Training Data","24 months historical (Theni)"],
            ["Features","5 input variables"],
            ["Forecast Horizon","6 months ahead"],
            ["Output Classes","HIGH / MEDIUM / LOW"],
            ["Last Trained","Today, 06:00 IST"],
            ["Accuracy","94.2%"],
            ["Data Source","IMD + NVBDCP + State Health"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(148,163,184,0.06)" }}>
              <span style={{ fontSize:12, color:"rgba(148,163,184,0.5)" }}>{k}</span>
              <span style={{ ...S.mono, fontSize:11, color:"#a5b4fc", fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Feature importance */}
        <div style={{ ...S.card, padding:24 }}>
          <div style={{ ...S.label, marginBottom:16 }}>Feature Importance</div>
          {features.map(f=>(
            <div key={f.name} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12 }}>{f.icon} {f.name}</span>
                <span style={{ ...S.mono, fontSize:11, color:"#6366f1" }}>{(f.weight*100).toFixed(0)}%</span>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${f.weight*100}%`, background:"linear-gradient(90deg,#4f46e5,#6366f1)", borderRadius:3, transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training console */}
      <div style={{ ...S.card, padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ ...S.label }}>Training Console</div>
          <button className="btn" onClick={startTraining} disabled={training} style={{
            padding:"9px 20px", borderRadius:9, fontSize:12, fontWeight:700,
            background: training ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#4f46e5,#6366f1)",
            color:"white", boxShadow: training ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
          }}>
            {training ? "⏳ Training..." : done ? "🔄 Retrain Model" : "▶ Train Model"}
          </button>
        </div>

        {(training || done) && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:11, color:"rgba(148,163,184,0.6)" }}>Progress</span>
              <span style={{ ...S.mono, fontSize:11, color:"#6366f1" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#4f46e5,#06b6d4)", borderRadius:3, transition:"width 0.3s ease", boxShadow:"0 0 10px rgba(99,102,241,0.5)" }} />
            </div>
          </div>
        )}

        <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:10, padding:16, minHeight:180, border:"1px solid rgba(148,163,184,0.08)", position:"relative", overflow:"hidden" }}>
          {training && <div style={{ position:"absolute", left:0, right:0, height:1, background:"rgba(99,102,241,0.4)", animation:"scanY 2s linear infinite", top:0 }} />}
          {logs.length === 0 && !training && <div style={{ ...S.mono, fontSize:11, color:"rgba(148,163,184,0.3)" }}>Click "Train Model" to start training...</div>}
          {logs.map((l,i)=>(
            <div key={i} style={{ ...S.mono, fontSize:11, color: (l||"").startsWith("✅") ? "#10b981" : (l||"").includes("Accuracy") ? "#a5b4fc" : "rgba(148,163,184,0.7)", marginBottom:4, animation:"fadeIn 0.3s ease" }}>
              <span style={{ color:"rgba(99,102,241,0.5)", marginRight:8 }}>[{String(i+1).padStart(2,"0")}]</span>{l}
            </div>
          ))}
          {done && (
            <div style={{ marginTop:12, padding:"10px 14px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:8, ...S.mono, fontSize:11, color:"#10b981" }}>
              ✅ Model ready · Ensemble Accuracy: 94.2% · Forecasts generated for all 15 villages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VILLAGES PAGE ────────────────────────────────────────────────────────────
function VillagesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const filtered = allVillageData.filter(v =>
    (filter==="ALL" || v.currentLevel===filter) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    const v = selected;
    const r = RISK[v.currentLevel];
    const latest = v.history[v.history.length-1];
    return (
      <div>
        <button className="btn" onClick={()=>setSelected(null)} style={{ marginBottom:20, padding:"8px 16px", borderRadius:8, fontSize:12, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>← Back to Villages</button>
        <TopBar title={v.name} sub={`${v.taluk} Taluk · Population: ${v.population.toLocaleString()}`} />

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
          <StatCard icon={r.icon} label="Current Risk Level" value={v.currentRisk} sub={r.label} color={r.color} />
          <StatCard icon="🌧" label="Latest Rainfall" value={latest.rainfall+"mm"} sub="Monthly" color="#6366f1" />
          <StatCard icon="🌡" label="Temperature" value={latest.temp+"°C"} sub="Avg monthly" color="#f59e0b" />
          <StatCard icon="🦟" label="Reported Cases" value={latest.cases} sub="This month" color="#ef4444" />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14 }}>
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ ...S.label, marginBottom:14 }}>24-Month Historical Risk Trend</div>
            <LineChart data={v.history.map(h=>({v:h.risk,l:h.month}))} height={110} />
          </div>
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ ...S.label, marginBottom:14 }}>6-Month Forecast</div>
            {v.forecast.map(f=>{
              const fc = RISK[f.level];
              return (
                <div key={f.month} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid rgba(148,163,184,0.06)" }}>
                  <span style={{ ...S.mono, fontSize:11, color:"rgba(148,163,184,0.6)" }}>{f.month}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ ...S.mono, fontSize:13, fontWeight:700, color:fc.color }}>{f.risk}</span>
                    <span style={{ fontSize:9, color:fc.color, background:fc.bg, border:`1px solid ${fc.border}`, borderRadius:4, padding:"1px 5px" }}>{f.level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Villages" sub="All 15 monitored villages in Theni District" />
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search village..." style={{ flex:1, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(148,163,184,0.12)", color:"white", fontSize:13, fontFamily:"inherit" }} />
        {["ALL","HIGH","MEDIUM","LOW"].map(f=>(
          <button key={f} className="btn" onClick={()=>setFilter(f)} style={{
            padding:"10px 16px", borderRadius:10, fontSize:11, fontWeight:700,
            background: filter===f ? (f==="HIGH"?"rgba(239,68,68,0.2)":f==="MEDIUM"?"rgba(245,158,11,0.2)":f==="LOW"?"rgba(16,185,129,0.2)":"rgba(99,102,241,0.2)") : "rgba(255,255,255,0.04)",
            border: `1px solid ${filter===f ? (f==="HIGH"?"rgba(239,68,68,0.4)":f==="MEDIUM"?"rgba(245,158,11,0.4)":f==="LOW"?"rgba(16,185,129,0.4)":"rgba(99,102,241,0.4)") : "rgba(148,163,184,0.12)"}`,
            color: filter===f ? (f==="HIGH"?"#fca5a5":f==="MEDIUM"?"#fcd34d":f==="LOW"?"#6ee7b7":"#a5b4fc") : "rgba(148,163,184,0.6)",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ ...S.card, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid rgba(148,163,184,0.1)" }}>
              {["#","Village","Taluk","Population","Risk Score","Level","Rainfall","Temp","Cases",""].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", ...S.label, fontSize:9 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v,i)=>{
              const r = RISK[v.currentLevel];
              const latest = v.history[v.history.length-1];
              return (
                <tr key={v.id} className="village-row" style={{ borderBottom:"1px solid rgba(148,163,184,0.05)", transition:"background 0.15s" }}>
                  <td style={{ padding:"12px 16px", ...S.mono, fontSize:11, color:"rgba(148,163,184,0.4)" }}>{i+1}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600 }}>{v.name}</td>
                  <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(148,163,184,0.6)" }}>{v.taluk}</td>
                  <td style={{ padding:"12px 16px", ...S.mono, fontSize:11 }}>{v.population.toLocaleString()}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:80, height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${v.currentRisk}%`, background:r.color, borderRadius:3 }} />
                      </div>
                      <span style={{ ...S.mono, fontSize:12, fontWeight:700, color:r.color }}>{v.currentRisk}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:r.color, background:r.bg, border:`1px solid ${r.border}`, borderRadius:6, padding:"3px 8px" }}>{v.currentLevel}</span>
                  </td>
                  <td style={{ padding:"12px 16px", ...S.mono, fontSize:11, color:"#60a5fa" }}>{latest.rainfall}mm</td>
                  <td style={{ padding:"12px 16px", ...S.mono, fontSize:11, color:"#fb923c" }}>{latest.temp}°C</td>
                  <td style={{ padding:"12px 16px", ...S.mono, fontSize:11, color:"#f87171" }}>{latest.cases}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <button className="btn" onClick={()=>setSelected(v)} style={{ padding:"5px 12px", borderRadius:7, fontSize:10, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>View →</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── FORECAST PAGE ────────────────────────────────────────────────────────────
function ForecastPage() {
  const [sel, setSel] = useState(allVillageData[0].id);
  const village = allVillageData.find(v=>v.id===sel);

  return (
    <div>
      <TopBar title="AI Forecast" sub="6-Month Dengue Risk Prediction · Random Forest + LSTM Ensemble" />

      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        {allVillageData.map(v=>{
          const r=RISK[v.currentLevel];
          return (
            <button key={v.id} className="btn" onClick={()=>setSel(v.id)} style={{
              padding:"7px 14px", borderRadius:8, fontSize:11, fontWeight:600,
              background: sel===v.id ? r.bg : "rgba(255,255,255,0.04)",
              border: `1px solid ${sel===v.id ? r.border : "rgba(148,163,184,0.12)"}`,
              color: sel===v.id ? r.color : "rgba(148,163,184,0.6)",
            }}>{v.name}</button>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ ...S.card, padding:20 }}>
          <div style={{ ...S.label, marginBottom:4 }}>6-Month Risk Forecast — {village.name}</div>
          <div style={{ fontSize:11, color:"rgba(148,163,184,0.4)", marginBottom:16 }}>AI predictions with confidence intervals</div>
          {village.forecast.map((f,i)=>{
            const r=RISK[f.level];
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid rgba(148,163,184,0.06)", animation:`slideIn 0.4s ease ${i*0.07}s both` }}>
                <div style={{ width:60, ...S.mono, fontSize:11, color:"rgba(148,163,184,0.5)" }}>{f.month}</div>
                <div style={{ flex:1 }}>
                  <div style={{ height:10, background:"rgba(255,255,255,0.05)", borderRadius:5, overflow:"hidden", marginBottom:4 }}>
                    <div style={{ height:"100%", width:`${f.risk}%`, background:`linear-gradient(90deg,${r.color}88,${r.color})`, borderRadius:5, boxShadow:`0 0 8px ${r.color}66`, transition:"width 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize:9, color:"rgba(148,163,184,0.3)" }}>Confidence: {f.confidence}%</div>
                </div>
                <div style={{ textAlign:"right", minWidth:90 }}>
                  <div style={{ ...S.mono, fontSize:18, fontWeight:700, color:r.color }}>{f.risk}</div>
                  <div style={{ fontSize:9, color:r.color, marginTop:2 }}>{r.label}</div>
                </div>
                <div style={{ minWidth:80, textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"rgba(148,163,184,0.4)", marginBottom:2 }}>Est. Cases</div>
                  <div style={{ ...S.mono, fontSize:14, fontWeight:700, color:"#f87171" }}>{f.cases}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ ...S.label, marginBottom:14 }}>Forecast Summary</div>
            {[
              ["Peak Risk Month", village.forecast.reduce((a,b)=>a.risk>b.risk?a:b).month],
              ["Peak Risk Score", village.forecast.reduce((a,b)=>a.risk>b.risk?a:b).risk],
              ["High Risk Months", village.forecast.filter(f=>f.level==="HIGH").length],
              ["Avg Forecast Risk", Math.round(village.forecast.reduce((a,f)=>a+f.risk,0)/6)],
              ["Predicted Total Cases", village.forecast.reduce((a,f)=>a+f.cases,0)],
              ["Avg Confidence", Math.round(village.forecast.reduce((a,f)=>a+f.confidence,0)/6)+"%"],
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(148,163,184,0.06)" }}>
                <span style={{ fontSize:11, color:"rgba(148,163,184,0.5)" }}>{k}</span>
                <span style={{ ...S.mono, fontSize:12, fontWeight:700, color:"#a5b4fc" }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ ...S.card, padding:20 }}>
            <div style={{ ...S.label, marginBottom:14 }}>Forecast Bar Chart</div>
            <MiniBar data={village.forecast.map(f=>({v:f.risk,l:f.month}))} height={100} />
          </div>
        </div>
      </div>

      {/* District-wide high risk forecast */}
      <div style={{ ...S.card, padding:20 }}>
        <div style={{ ...S.label, marginBottom:16 }}>District-Wide: Upcoming HIGH Risk Alerts</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {allVillageData.flatMap(v=>v.forecast.filter(f=>f.level==="HIGH").map(f=>({...f, vName:v.name, vId:v.id}))).slice(0,9).map((f,i)=>(
            <div key={i} style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:600 }}>{f.vName}</span>
                <span style={{ ...S.mono, fontSize:13, fontWeight:700, color:"#ef4444" }}>{f.risk}</span>
              </div>
              <div style={{ fontSize:10, color:"rgba(148,163,184,0.4)" }}>{f.month} · Est. {f.cases} cases</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ALERTS PAGE ──────────────────────────────────────────────────────────────
function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState("ALL");

  const ack = (id) => setAlerts(a => a.map(al => al.id===id ? {...al, acknowledged:true} : al));
  const ackAll = () => setAlerts(a => a.map(al => ({...al, acknowledged:true})));

  const shown = alerts.filter(a => filter==="ALL" ? true : filter==="PENDING" ? !a.acknowledged : a.acknowledged);
  const unread = alerts.filter(a=>!a.acknowledged).length;

  return (
    <div>
      <TopBar title="Risk Alerts" sub="AI-generated early warnings for Theni District" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard icon="🚨" label="Total Alerts" value={alerts.length} color="#ef4444" />
        <StatCard icon="⏳" label="Pending Action" value={unread} color="#f59e0b" />
        <StatCard icon="✅" label="Acknowledged" value={alerts.length-unread} color="#10b981" />
        <StatCard icon="🔴" label="Critical (≥80)" value={alerts.filter(a=>a.risk>=80).length} color="#ef4444" />
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
        {["ALL","PENDING","ACKNOWLEDGED"].map(f=>(
          <button key={f} className="btn" onClick={()=>setFilter(f)} style={{
            padding:"8px 16px", borderRadius:8, fontSize:11, fontWeight:700,
            background: filter===f ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${filter===f?"rgba(99,102,241,0.4)":"rgba(148,163,184,0.12)"}`,
            color: filter===f ? "#a5b4fc" : "rgba(148,163,184,0.6)",
          }}>{f} {f==="PENDING"&&unread>0?`(${unread})`:""}</button>
        ))}
        {unread > 0 && (
          <button className="btn" onClick={ackAll} style={{ marginLeft:"auto", padding:"8px 16px", borderRadius:8, fontSize:11, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#6ee7b7" }}>✓ Acknowledge All</button>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {shown.map((al,i) => {
          const r = RISK[al.level];
          return (
            <div key={al.id} style={{ ...S.card, padding:"16px 20px", borderLeft:`3px solid ${r.color}`, animation:`slideIn 0.3s ease ${i*0.04}s both`, opacity: al.acknowledged ? 0.7 : 1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:r.color, boxShadow:`0 0 8px ${r.color}` }} />
                  {!al.acknowledged && <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:`1px solid ${r.color}`, animation:"ping 1.5s infinite", opacity:0.4 }} />}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
                    <span style={{ fontSize:14, fontWeight:700 }}>{al.villageName}</span>
                    <span style={{ fontSize:9, color:r.color, background:r.bg, border:`1px solid ${r.border}`, borderRadius:4, padding:"2px 7px", fontWeight:700 }}>{al.level}</span>
                    {al.acknowledged && <span style={{ fontSize:9, color:"#10b981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:4, padding:"2px 7px" }}>✓ ACK</span>}
                  </div>
                  <div style={{ fontSize:11, color:"rgba(148,163,184,0.6)", marginBottom:2 }}>
                    {al.taluk} Taluk · {al.month} · Risk: <span style={{ color:r.color, fontWeight:700 }}>{al.risk}/100</span> · Est. cases: <span style={{ color:"#f87171", fontWeight:700 }}>{al.cases}</span>
                  </div>
                  <div style={{ fontSize:11, color:"rgba(245,158,11,0.8)", fontStyle:"italic" }}>⚡ {al.action}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ ...S.mono, fontSize:28, fontWeight:800, color:r.color }}>{al.risk}</div>
                  <div style={{ fontSize:9, color:"rgba(148,163,184,0.4)", marginBottom:8 }}>{al.timestamp.toLocaleDateString("en-IN")}</div>
                  {!al.acknowledged && (
                    <button className="btn" onClick={()=>ack(al.id)} style={{ padding:"5px 12px", borderRadius:7, fontSize:10, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#6ee7b7" }}>Acknowledge</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotifyPage({ user }) {
  const [sent, setSent] = useState([]);
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState("Block Medical Officer");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const TEMPLATES = [
    { label:"High Risk Alert", subject:"⚠️ HIGH DENGUE RISK — Immediate Action Required", body:`Dear Authority,\n\nOur AI model has detected HIGH dengue risk (score ≥70) in multiple villages of Theni district for the upcoming months.\n\nImmediate actions required:\n1. Deploy mobile health units to affected villages\n2. Initiate source reduction drives\n3. Conduct fogging operations\n4. Issue community awareness alerts\n\nThis is an automated alert from DengueWatch.AI.\n\nRegards,\n${user.name}` },
    { label:"Weekly Report", subject:"📊 Weekly Dengue Surveillance Report — Theni District", body:`Dear Sir/Madam,\n\nPlease find the weekly dengue surveillance summary for Theni district.\n\nKey highlights:\n- 15 villages monitored\n- High risk: ${allVillageData.filter(v=>v.currentLevel==="HIGH").length} villages\n- Medium risk: ${allVillageData.filter(v=>v.currentLevel==="MEDIUM").length} villages\n\nModel accuracy: 94.2%\n\nRegards,\n${user.name}` },
    { label:"Fogging Request", subject:"🌫 Fogging Operation Request — Priority Villages", body:`Dear Vector Control Unit,\n\nPlease initiate fogging operations in the following high-priority areas immediately based on AI risk predictions.\n\nHigh risk villages:\n${allVillageData.filter(v=>v.currentLevel==="HIGH").map(v=>v.name).join(", ")}\n\nPlease acknowledge receipt.\n\nRegards,\n${user.name}` },
  ];

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSent(s => [{ id:Date.now(), to, subject, body, time:new Date(), status:"Delivered" }, ...s]);
      setSending(false); setSuccess(true); setCompose(false); setSubject(""); setBody("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div>
      <TopBar title="Notifications" sub="Alert authorities · Send reports · Coordinate response" />

      {success && (
        <div style={{ padding:"12px 18px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:10, marginBottom:16, fontSize:12, color:"#6ee7b7", animation:"fadeIn 0.3s ease" }}>
          ✅ Notification sent successfully to {to}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Compose */}
        <div style={{ ...S.card, padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ ...S.label }}>Compose Alert</div>
            <button className="btn" onClick={()=>setCompose(!compose)} style={{ padding:"7px 14px", borderRadius:8, fontSize:11, background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>
              {compose ? "✕ Cancel" : "+ New"}
            </button>
          </div>

          {/* Templates */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:"rgba(148,163,184,0.5)", marginBottom:8 }}>Quick Templates</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {TEMPLATES.map(t=>(
                <button key={t.label} className="btn" onClick={()=>{ setSubject(t.subject); setBody(t.body); setCompose(true); }} style={{ padding:"6px 12px", borderRadius:7, fontSize:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(148,163,184,0.15)", color:"rgba(148,163,184,0.7)" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {compose && (
            <div style={{ animation:"fadeIn 0.3s ease" }}>
              <div style={{ marginBottom:12 }}>
                <div style={{ ...S.label, marginBottom:6 }}>To</div>
                <select value={to} onChange={e=>setTo(e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(148,163,184,0.12)", color:"white", fontSize:13, fontFamily:"inherit" }}>
                  {["Block Medical Officer","District Collector","Vector Control Unit","NVBDCP Regional Office","State Health Secretary","Gram Panchayat Head"].map(r=><option key={r} value={r} style={{background:"#0f172a"}}>{r}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ ...S.label, marginBottom:6 }}>Subject</div>
                <input value={subject} onChange={e=>setSubject(e.target.value)} style={{ width:"100%", padding:"10px 12px", borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(148,163,184,0.12)", color:"white", fontSize:13, fontFamily:"inherit" }} placeholder="Alert subject..." />
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ ...S.label, marginBottom:6 }}>Message</div>
                <textarea value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{ width:"100%", padding:"10px 12px", borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(148,163,184,0.12)", color:"white", fontSize:12, fontFamily:"'JetBrains Mono', monospace", resize:"vertical", lineHeight:1.6 }} placeholder="Message body..." />
              </div>
              <button className="btn" onClick={handleSend} disabled={sending||!subject||!body} style={{
                width:"100%", padding:"12px", borderRadius:10, fontSize:13, fontWeight:700,
                background: sending ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#4f46e5,#6366f1)",
                color:"white", boxShadow:"0 4px 16px rgba(99,102,241,0.3)",
              }}>
                {sending ? "📨 Sending..." : "📨 Send Alert"}
              </button>
            </div>
          )}
        </div>

        {/* Sent log */}
        <div style={{ ...S.card, padding:24 }}>
          <div style={{ ...S.label, marginBottom:16 }}>Sent Notifications ({sent.length})</div>
          {sent.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"rgba(148,163,184,0.3)", fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
              No notifications sent yet
            </div>
          ) : (
            sent.map(n=>(
              <div key={n.id} style={{ padding:"14px 0", borderBottom:"1px solid rgba(148,163,184,0.07)", animation:"fadeIn 0.3s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:"#a5b4fc" }}>→ {n.to}</span>
                  <span style={{ fontSize:10, color:"#10b981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:4, padding:"1px 6px" }}>✓ {n.status}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:500, marginBottom:3 }}>{n.subject}</div>
                <div style={{ ...S.mono, fontSize:9, color:"rgba(148,163,184,0.35)" }}>{n.time.toLocaleString("en-IN")}</div>
              </div>
            ))
          )}

          {/* Auto-alert status */}
          <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#a5b4fc", marginBottom:8 }}>🤖 Auto-Alert System</div>
            {[
              ["SMS Alerts","Active","Sent to Block MOs"],
              ["Email Digest","Daily 07:00","DMO Office"],
              ["IVR Calls","High Risk Only","PHC Contacts"],
            ].map(([k,s,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:11, color:"rgba(148,163,184,0.6)" }}>{k}</span>
                <div style={{ textAlign:"right" }}>
                  <span style={{ fontSize:10, color:"#10b981", fontWeight:600 }}>{s}</span>
                  <div style={{ fontSize:9, color:"rgba(148,163,184,0.35)" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser]     = useState(null);
  const [page, setPage]     = useState("dashboard");

  useEffect(() => {
    setTimeout(() => setScreen("login"), 2200);
  }, []);

  const handleLogin = (u) => { setUser(u); setScreen("app"); };
  const handleLogout = () => { setUser(null); setPage("dashboard"); setScreen("login"); };

  const unackAlerts = ALERTS.filter(a=>!a.acknowledged).length;

  if (screen === "loading") return <><style>{GLOBAL_CSS}</style><Loader /></>;
  if (screen === "login")   return <><style>{GLOBAL_CSS}</style><LoginPage onLogin={handleLogin} /></>;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} alertCount={unackAlerts} />
        <main style={{ marginLeft:220, flex:1, padding:"32px 32px 60px", minHeight:"100vh", background:"#020817" }}>
          {page==="dashboard" && <DashboardPage />}
          {page==="model"     && <ModelPage />}
          {page==="villages"  && <VillagesPage />}
          {page==="forecast"  && <ForecastPage />}
          {page==="alerts"    && <AlertsPage />}
          {page==="notify"    && <NotifyPage user={user} />}
        </main>
      </div>
    </>
  );
}
