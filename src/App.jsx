import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from "recharts";

const plantPerf = [
  { plant: "Unit 1", loc: "Mirzapur",  yield: 91.2, cycle: 21.4, energy: 198, hcl: 30.4, batches: 38, offSpec: 4 },
  { plant: "Unit 2", loc: "Jharkhand", yield: 93.5, cycle: 20.1, energy: 188, hcl: 31.2, batches: 52, offSpec: 3 },
  { plant: "Unit 3", loc: "Jharkhand", yield: 94.8, cycle: 19.2, energy: 182, hcl: 31.8, batches: 98, offSpec: 5 },
  { plant: "Unit 4", loc: "Odisha",    yield: 92.1, cycle: 20.8, energy: 195, hcl: 30.8, batches: 48, offSpec: 4 },
  { plant: "Unit 5", loc: "NCR",       yield: 93.0, cycle: 20.5, energy: 190, hcl: 31.0, batches: 65, offSpec: 5 },
  { plant: "Unit 6", loc: "Jharkhand", yield: 95.6, cycle: 18.5, energy: 172, hcl: 32.1, batches: 70, offSpec: 2 },
];

const hclPlants = [
  { plant: "Unit 1", state: "Free",    tank: 78, rate: 0,    vol: 380,  action: "Find paid buyer or route to Unit 5" },
  { plant: "Unit 2", state: "Paid",    tank: 45, rate: 2800, vol: 620,  action: "Steel buyer paying ₹2.8K/MT" },
  { plant: "Unit 3", state: "Paid",    tank: 52, rate: 3100, vol: 1200, action: "Pharma at ₹3.1K — push volume" },
  { plant: "Unit 4", state: "Dispose", tank: 92, rate: -800, vol: 280,  action: "⚠ Tank critical. Throttle CPW." },
  { plant: "Unit 5", state: "Paid",    tank: 38, rate: 2500, vol: 850,  action: "NCR market strong. Room in tank." },
  { plant: "Unit 6", state: "Free",    tank: 65, rate: 0,    vol: 700,  action: "Monsoon ending — nearing paid" },
];

const hclTrend = [
  { w: "W1", paid: 3200, free: 800,  dispose: 0   },
  { w: "W2", paid: 2900, free: 1100, dispose: 200  },
  { w: "W3", paid: 2500, free: 1200, dispose: 500  },
  { w: "W4", paid: 2100, free: 1400, dispose: 700  },
  { w: "W5", paid: 2800, free: 1000, dispose: 400  },
  { w: "W6", paid: 3100, free: 900,  dispose: 200  },
  { w: "W7", paid: 3400, free: 700,  dispose: 100  },
  { w: "W8", paid: 3000, free: 1000, dispose: 200  },
];

const demandData = [
  { m: "Oct",   pvc: 1800, mwf: 650, rubber: 450, paint: 250, export: 380 },
  { m: "Nov",   pvc: 2100, mwf: 700, rubber: 500, paint: 200, export: 420 },
  { m: "Dec",   pvc: 1950, mwf: 600, rubber: 400, paint: 300, export: 350 },
  { m: "Jan",   pvc: 2400, mwf: 750, rubber: 550, paint: 280, export: 450 },
  { m: "Feb",   pvc: 2200, mwf: 800, rubber: 480, paint: 320, export: 400 },
  { m: "Mar",   pvc: 2600, mwf: 850, rubber: 520, paint: 350, export: 480 },
  { m: "Apr*",  pvc: 2450, mwf: 780, rubber: 500, paint: 300, export: 460 },
  { m: "May*",  pvc: 2700, mwf: 900, rubber: 580, paint: 380, export: 520 },
];

const marginData = [
  { w: "W1", crude: 82, wax: 68, cpw: 92, margin: 24 },
  { w: "W2", crude: 84, wax: 70, cpw: 91, margin: 21 },
  { w: "W3", crude: 86, wax: 74, cpw: 90, margin: 16 },
  { w: "W4", crude: 83, wax: 72, cpw: 92, margin: 20 },
  { w: "W5", crude: 80, wax: 66, cpw: 93, margin: 27 },
  { w: "W6", crude: 78, wax: 64, cpw: 94, margin: 30 },
  { w: "W7", crude: 81, wax: 68, cpw: 93, margin: 25 },
  { w: "W8", crude: 79, wax: 65, cpw: 93, margin: 28 },
];

const TABS = [
  { id: "command", label: "Command center", icon: "▣" },
  { id: "hcl",     label: "HCl intelligence", icon: "◈" },
  { id: "demand",  label: "Demand & planning", icon: "◎" },
  { id: "market",  label: "Market & margin", icon: "◇" },
];

const P = {
  bg: "#0a0a0c", surface: "#111114", card: "#16161a", elevated: "#1c1c21",
  border: "#ffffff0d", borderHover: "#ffffff1a", borderAccent: "#d4a853",
  text: "#e8e6e1", textMuted: "#7a7872", textDim: "#4a4944",
  accent: "#d4a853", accentDim: "#d4a85333", accentGlow: "#d4a85318",
  green: "#5cb87a", greenDim: "#5cb87a22",
  amber: "#d4a853", amberDim: "#d4a85322",
  red: "#d45353", redDim: "#d4535322",
  cyan: "#53a8d4", cyanDim: "#53a8d422",
  coral: "#d47a53", coralDim: "#d47a5322",
  purple: "#8a6fbf", purpleDim: "#8a6fbf22",
};

const TT = {
  background: P.elevated,
  border: `1px solid ${P.border}`,
  borderRadius: 8,
  color: P.text,
  fontSize: 11,
  padding: "10px 14px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
};

const CSS = `
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 #d4a85366; }
    50%       { opacity: 0.7; transform: scale(1.15); box-shadow: 0 0 0 6px #d4a85300; }
  }
  @keyframes tab-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes banner-in {
    from { opacity: 0; transform: translateY(-100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes banner-out {
    from { opacity: 1; max-height: 60px; }
    to   { opacity: 0; max-height: 0; padding: 0; }
  }
  .tab-panel { animation: tab-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
  .banner-visible { animation: banner-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
  .banner-hiding  { animation: banner-out 0.3s ease forwards; }
  .row-hover { transition: background 0.12s; }
  .row-hover:hover { background: ${P.elevated} !important; }
  .tab-btn { transition: color 0.18s, border-color 0.18s; }
  .tab-btn:hover { color: ${P.text} !important; }
`;

// ── Metric card ──────────────────────────────────────────────────────────────
function Metric({ label, value, sub, color = P.accent, trend, trendVal }) {
  const trendColor = trend === "up" ? P.green : trend === "down" ? P.red : P.textMuted;
  const trendIcon  = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return (
    <div style={{
      padding: "18px 20px",
      background: P.card,
      borderRadius: 14,
      border: `1px solid ${P.border}`,
      flex: 1,
      minWidth: 150,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}00, ${color}77, ${color}00)` }} />
      <div style={{ fontSize: 10, color: P.textMuted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1, fontFamily: "'JetBrains Mono','SF Mono',monospace", letterSpacing: "-0.02em" }}>{value}</div>
        {trendVal && (
          <span style={{ fontSize: 11, fontWeight: 700, color: trendColor, background: trendColor + "18", padding: "2px 7px", borderRadius: 6 }}>
            {trendIcon} {trendVal}
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: 10, color: P.textDim, marginTop: 5, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ── Tag chip ─────────────────────────────────────────────────────────────────
function Tag({ text, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 100, fontSize: 10, fontWeight: 700,
      background: color + "18", color, border: `1px solid ${color}33`, letterSpacing: "0.03em",
    }}>{text}</span>
  );
}

// ── HCl state badge ───────────────────────────────────────────────────────────
function StateIndicator({ state }) {
  const cfg = {
    Paid:    { c: P.green, icon: "✓" },
    Free:    { c: P.amber, icon: "–" },
    Dispose: { c: P.red,   icon: "✗" },
  };
  const s = cfg[state];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 11px", borderRadius: 7, fontSize: 11, fontWeight: 700,
      background: s.c + "18", color: s.c, border: `1px solid ${s.c}22`,
    }}>
      <span style={{ fontSize: 10 }}>{s.icon}</span> {state}
    </span>
  );
}

// ── Chart card ────────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, style: s }) {
  return (
    <div style={{
      background: P.card, borderRadius: 14, border: `1px solid ${P.border}`,
      padding: "18px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", ...s,
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: P.text, letterSpacing: "-0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: P.textDim, marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

// ── Alert / insight row ───────────────────────────────────────────────────────
function Alert({ msg, color, icon }) {
  return (
    <div style={{
      display: "flex", gap: 12, padding: "13px 16px",
      borderRadius: 10, background: color + "09",
      borderLeft: `3px solid ${color}`,
      marginBottom: 8, lineHeight: 1.6,
    }}>
      {icon && <span style={{ fontSize: 14, color, flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span style={{ fontSize: 12, color: P.text }}>{msg}</span>
    </div>
  );
}

// ── Tank bar ──────────────────────────────────────────────────────────────────
function TankBar({ pct }) {
  const barColor = pct >= 85 ? P.red : pct >= 70 ? P.amber : P.green;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 72, height: 10, borderRadius: 5, background: P.elevated, overflow: "hidden", flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: barColor, transition: "width 0.6s" }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: pct >= 85 ? P.red : P.textMuted, minWidth: 32 }}>
        {pct}%
      </span>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("command");
  const [loaded, setLoaded]     = useState(false);
  const [banner, setBanner]     = useState(true);   // Unit-4 critical alert
  const [bannerHide, setBannerHide] = useState(false);
  const [tabKey, setTabKey]     = useState(0);      // forces re-mount for animation

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  function switchTab(id) {
    setTab(id);
    setTabKey(k => k + 1);
  }

  function dismissBanner() {
    setBannerHide(true);
    setTimeout(() => setBanner(false), 320);
  }

  const totalBatches = plantPerf.reduce((s, p) => s + p.batches, 0);
  const avgYield     = (plantPerf.reduce((s, p) => s + p.yield * p.batches, 0) / totalBatches).toFixed(1);
  const totalOff     = plantPerf.reduce((s, p) => s + p.offSpec, 0);

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: "'DM Sans','Satoshi',system-ui,sans-serif", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}>
      <style>{CSS}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ── Critical banner ── */}
      {banner && (
        <div className={bannerHide ? "banner-hiding" : "banner-visible"} style={{
          background: `linear-gradient(90deg, ${P.red}22, ${P.red}10)`,
          borderBottom: `1px solid ${P.red}33`,
          padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, color: P.red }}>⚠</span>
            <span style={{ fontSize: 12, color: P.text }}>
              <strong style={{ color: P.red }}>CRITICAL — Unit 4 HCl tank at 92%.</strong>
              {" "}Route 120 MT to Unit 3 (saves ₹96K vs disposal). Throttle to CP-42 only.
            </span>
          </div>
          <button onClick={dismissBanner} style={{ background: "none", border: "none", color: P.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* ── Sticky header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: P.bg + "f0",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${P.border}`,
      }}>
        <div style={{ padding: "16px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: P.accent,
                animation: "pulse-dot 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: P.accent, textTransform: "uppercase", letterSpacing: "0.14em" }}>Live</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px", color: P.text, letterSpacing: "-0.025em" }}>Suntek Group</h1>
            <p style={{ fontSize: 11, color: P.textMuted, margin: 0 }}>
              6 plants · 44 reactors · 7+ product lines · <span style={{ color: P.accent }}>Powered by CaratSense</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 14px", background: P.card, borderRadius: 10, border: `1px solid ${P.border}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.green }} />
            <span style={{ fontSize: 11, color: P.textMuted }}>38 / 44 reactors active</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginTop: 14, paddingLeft: 24 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => switchTab(t.id)}
              style={{
                padding: "10px 18px", border: "none", cursor: "pointer", background: "transparent",
                borderBottom: tab === t.id ? `2px solid ${P.accent}` : "2px solid transparent",
                color: tab === t.id ? P.accent : P.textMuted,
                fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 13, opacity: 0.7 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding: "24px 24px 48px" }}>

        {/* ══ COMMAND CENTER ══════════════════════════════════════════════════ */}
        {tab === "command" && (
          <div key={`command-${tabKey}`} className="tab-panel">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <Metric label="Monthly output"  value="7,500"        sub="MT CPW · Target: 10K"      color={P.cyan}   trend="up"   trendVal="+8%" />
              <Metric label="Group yield"     value={`${avgYield}%`} sub="Weighted average"          color={P.green}  trend="up"   trendVal="+0.4%" />
              <Metric label="HCl generated"   value="15,000"       sub="MT · ~2× CPW volume"        color={P.coral}  trend="down" trendVal="-2%" />
              <Metric label="Off-spec"        value={totalOff.toString()} sub={`of ${totalBatches} batches`} color={totalOff < 25 ? P.amber : P.red} trend="down" trendVal="-3" />
            </div>

            {/* 2-col grid: chart left, summary right */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14, marginBottom: 16 }}>
              <ChartCard title="Plant performance benchmark" subtitle="Yield % by unit — same grades, different plants">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={plantPerf} barSize={34}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                    <XAxis dataKey="plant" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                    <YAxis domain={[88, 98]} tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Bar dataKey="yield" name="Yield %" radius={[6, 6, 0, 0]}>
                      {plantPerf.map((r, i) => (
                        <Cell key={i} fill={r.yield >= 95 ? P.green : r.yield >= 93 ? P.accent : r.yield >= 91.5 ? P.coral : P.red} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Quick summary panel */}
              <div style={{ background: P.card, borderRadius: 14, border: `1px solid ${P.border}`, padding: "18px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: P.text, marginBottom: 2 }}>Performance snapshot</div>
                {[
                  { label: "Best unit",    value: "Unit 6",   sub: "95.6% yield · 172 kWh/t", color: P.green },
                  { label: "Worst energy", value: "Unit 1",   sub: "198 kWh/t · +26 vs best",  color: P.red },
                  { label: "Top volume",   value: "Unit 3",   sub: "98 batches this period",    color: P.cyan },
                  { label: "Utilization",  value: "78%",      sub: "38 / 44 reactors active",  color: P.amber },
                  { label: "HCl Δ",        value: "₹2.1K",    sub: "Blended avg / MT",         color: P.accent },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 10, borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}>
                    <span style={{ fontSize: 10, color: P.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", paddingTop: 2 }}>{r.label}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: r.color, fontFamily: "'JetBrains Mono',monospace" }}>{r.value}</div>
                      <div style={{ fontSize: 9, color: P.textDim, marginTop: 1 }}>{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit detail table */}
            <div style={{ background: P.card, borderRadius: 14, border: `1px solid ${P.border}`, overflow: "hidden", marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "15px 20px 10px", fontSize: 13, fontWeight: 600 }}>Unit detail</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Plant", "Location", "Yield", "Cycle", "kWh/t", "HCl %", "Batches", "Off-spec"].map(h => (
                      <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 9, fontWeight: 700, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plantPerf.map((r, i) => {
                    const isBest = r.plant === "Unit 6";
                    return (
                      <tr
                        key={r.plant}
                        className="row-hover"
                        style={{
                          borderBottom: `1px solid ${P.border}`,
                          background: i % 2 === 1 ? "#ffffff04" : "transparent",
                          borderLeft: isBest ? `3px solid ${P.green}` : "3px solid transparent",
                        }}
                      >
                        <td style={{ padding: "11px 16px", fontWeight: 700, color: isBest ? P.green : P.accent, fontSize: 12 }}>{r.plant}</td>
                        <td style={{ padding: "11px 16px", fontSize: 11, color: P.textMuted }}>{r.loc}</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: r.yield >= 94 ? P.green : P.text }}>{r.yield}%</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{r.cycle}h</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: r.energy <= 185 ? P.green : r.energy >= 195 ? P.red : P.text }}>{r.energy}</td>
                        <td style={{ padding: "11px 16px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: r.hcl >= 31 ? P.green : P.amber }}>{r.hcl}%</td>
                        <td style={{ padding: "11px 16px", fontSize: 12 }}>{r.batches}</td>
                        <td style={{ padding: "11px 16px" }}><Tag text={r.offSpec} color={r.offSpec <= 3 ? P.green : P.amber} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Insights</div>
              <Alert icon="✓" color={P.green}  msg="Unit 6 outperforms all units: 95.6% yield, 172 kWh/ton. Its process parameters should baseline models across plants." />
              <Alert icon="⚠" color={P.amber}  msg="Unit 1 highest energy at 198 kWh/ton — 26 kWh more than Unit 6 on same grades. Cooling system audit recommended. Est. savings: ₹18–24L/yr." />
              <Alert icon="→" color={P.cyan}   msg="Group utilization at 78%. Pushing to 85% across 44 reactors = ~530 additional MT CPW/month." />
            </div>
          </div>
        )}

        {/* ══ HCL INTELLIGENCE ════════════════════════════════════════════════ */}
        {tab === "hcl" && (
          <div key={`hcl-${tabKey}`} className="tab-panel">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <Metric label="Paid"            value={`${hclPlants.filter(h=>h.state==="Paid").reduce((s,h)=>s+h.vol,0)}`}    sub={`MT · ${hclPlants.filter(h=>h.state==="Paid").length} plants`}  color={P.green}  trend="up"   trendVal="+6%" />
              <Metric label="Free"            value={`${hclPlants.filter(h=>h.state==="Free").reduce((s,h)=>s+h.vol,0)}`}    sub={`MT · ${hclPlants.filter(h=>h.state==="Free").length} plants`}  color={P.amber}  trend="down" trendVal="-12%" />
              <Metric label="Dispose"         value={`${hclPlants.filter(h=>h.state==="Dispose").reduce((s,h)=>s+h.vol,0)}`} sub="MT · Costing money"                                            color={P.red}    trend="up"   trendVal="+40%" />
              <Metric label="Net realization" value="₹2.1K"                                                                  sub="Blended avg /MT"                                               color={P.accent} trend="up"   trendVal="+3%" />
            </div>

            <div style={{ background: P.card, borderRadius: 14, border: `1px solid ${P.border}`, overflow: "hidden", marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "15px 20px 6px" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>HCl economic state by plant</div>
                <div style={{ fontSize: 10, color: P.textDim, marginTop: 3 }}>Paid = revenue · Free = zero · Dispose = you pay to remove</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6 }}>
                <thead>
                  <tr>
                    {["Plant", "State", "Tank level", "Rate /MT", "MT/wk", "Action"].map(h => (
                      <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 9, fontWeight: 700, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hclPlants.map((r, i) => (
                    <tr key={r.plant} className="row-hover" style={{ borderBottom: `1px solid ${P.border}`, background: i % 2 === 1 ? "#ffffff04" : "transparent" }}>
                      <td style={{ padding: "11px 16px", fontWeight: 700, fontSize: 12, color: P.accent }}>{r.plant}</td>
                      <td style={{ padding: "11px 16px" }}><StateIndicator state={r.state} /></td>
                      <td style={{ padding: "11px 16px" }}><TankBar pct={r.tank} /></td>
                      <td style={{ padding: "11px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: r.rate > 0 ? P.green : r.rate === 0 ? P.textDim : P.red }}>
                        {r.rate > 0 ? `₹${r.rate.toLocaleString()}` : r.rate === 0 ? "—" : `-₹${Math.abs(r.rate)}`}
                      </td>
                      <td style={{ padding: "11px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{r.vol}</td>
                      <td style={{ padding: "11px 16px", fontSize: 11, color: P.textMuted, maxWidth: 220 }}>{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ChartCard title="HCl economics trend" subtitle="MT per week · stacked by economic state" style={{ marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={hclTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                  <XAxis dataKey="w" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                  <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TT} />
                  <Area type="monotone" dataKey="paid"    stackId="1" fill={P.greenDim} stroke={P.green} strokeWidth={1.5} name="Paid" />
                  <Area type="monotone" dataKey="free"    stackId="1" fill={P.amberDim} stroke={P.amber} strokeWidth={1.5} name="Free" />
                  <Area type="monotone" dataKey="dispose" stackId="1" fill={P.redDim}   stroke={P.red}   strokeWidth={1.5} name="Dispose" />
                  <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Action items</div>
              <Alert icon="⚠" color={P.red}   msg="Unit 4 tank at 92%. Route 120 MT to Unit 3 (tanker ₹18K, saves ₹96K vs disposal). Throttle to CP-42 only." />
              <Alert icon="→" color={P.cyan}  msg="Cross-plant arbitrage: Unit 6 HCl free, Unit 5 has paying buyers. 40 MT tanker = ₹22K cost, ₹1L revenue. Net: ₹78K." />
              <Alert icon="✓" color={P.green} msg="Unit 3 Pharma buyer wants 30% more volume. Increase CPW production there to capture premium HCl rate (₹3.1K/MT)." />
            </div>
          </div>
        )}

        {/* ══ DEMAND & PLANNING ═══════════════════════════════════════════════ */}
        {tab === "demand" && (
          <div key={`demand-${tabKey}`} className="tab-panel">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <Metric label="CPW demand"  value="5,100"  sub="MT next month"         color={P.cyan}   trend="up"   trendVal="+5%" />
              <Metric label="HCl demand"  value="12,800" sub="MT all segments"        color={P.coral}  trend="up"   trendVal="+3%" />
              <Metric label="Top segment" value="PVC"    sub="53% of CPW demand"      color={P.accent} trend="up"   trendVal="+9%" />
              <Metric label="Export"      value="9.4%"   sub="Star Export House"      color={P.green}  trend="up"   trendVal="+1.2%" />
            </div>

            <ChartCard title="CPW demand by buyer segment" subtitle="MT · * = AI forecast" style={{ marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                  <XAxis dataKey="m" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                  <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TT} />
                  <Area type="monotone" dataKey="pvc"    stackId="1" fill={P.purpleDim} stroke={P.purple} strokeWidth={1.5} name="PVC" />
                  <Area type="monotone" dataKey="mwf"    stackId="1" fill={P.cyanDim}   stroke={P.cyan}   strokeWidth={1.5} name="Metalworking" />
                  <Area type="monotone" dataKey="rubber" stackId="1" fill={P.amberDim}  stroke={P.amber}  strokeWidth={1.5} name="Rubber" />
                  <Area type="monotone" dataKey="export" stackId="1" fill={P.greenDim}  stroke={P.green}  strokeWidth={1.5} name="Export" />
                  <Area type="monotone" dataKey="paint"  stackId="1" fill={P.coralDim}  stroke={P.coral}  strokeWidth={1.5} name="Paints" />
                  <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{ background: P.card, borderRadius: 14, border: `1px solid ${P.border}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "15px 20px 10px", fontSize: 13, fontWeight: 600 }}>Order-to-plant assignment</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Order", "Buyer", "Grade", "MT", "Plant", "Reason"].map(h => (
                      <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 9, fontWeight: 700, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ORD-4821", "Finolex Cables",    "CP-52", "120", "Unit 3", "Best yield + HCl has paying buyer"],
                    ["ORD-4822", "Supreme (Export)",  "CP-52", "85",  "Unit 6", "Export grade: highest quality unit"],
                    ["ORD-4823", "Lubrizol",          "CP-42", "60",  "Unit 5", "NCR. CP-42 = less HCl generation"],
                    ["ORD-4824", "Fenner Belts",      "CP-70", "45",  "Unit 3", "Glass-lined. NOT Unit 4 (HCl full)"],
                    ["ORD-4825", "Asian Paints",      "CP-52", "90",  "Unit 2", "In stock. Jharkhand freight optimal"],
                  ].map((r, i) => (
                    <tr key={i} className="row-hover" style={{ borderBottom: `1px solid ${P.border}`, background: i % 2 === 1 ? "#ffffff04" : "transparent" }}>
                      <td style={{ padding: "11px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: P.accent }}>{r[0]}</td>
                      <td style={{ padding: "11px 16px", fontSize: 12, fontWeight: 500 }}>{r[1]}</td>
                      <td style={{ padding: "11px 16px" }}><Tag text={r[2]} color={r[2]==="CP-52"?P.purple:r[2]==="CP-42"?P.cyan:P.amber} /></td>
                      <td style={{ padding: "11px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{r[3]}</td>
                      <td style={{ padding: "11px 16px", fontWeight: 700, fontSize: 12 }}>{r[4]}</td>
                      <td style={{ padding: "11px 16px", fontSize: 11, color: P.textMuted }}>{r[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ MARKET & MARGIN ═════════════════════════════════════════════════ */}
        {tab === "market" && (
          <div key={`market-${tabKey}`} className="tab-panel">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <Metric label="Brent crude"  value="$79"    sub="Per barrel · trending down"   color={P.green}  trend="down" trendVal="-3%" />
              <Metric label="Wax cost"     value="₹65K"   sub="Per MT · tracking crude"       color={P.amber}  trend="down" trendVal="-2%" />
              <Metric label="CPW margin"   value="28%"    sub="CP-52 blended"                 color={P.green}  trend="up"   trendVal="+4pp" />
              <Metric label="DOP price"    value="₹132K"  sub="Per MT · CPW competitive"      color={P.accent} trend="up"   trendVal="+8%" />
            </div>

            {/* 2-col grid: chart + signals */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <ChartCard title="Margin model" subtitle="Indexed · Crude → wax cost → CPW revenue → margin gap">
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={marginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                    <XAxis dataKey="w" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                    <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TT} />
                    <Line type="monotone" dataKey="crude"  stroke={P.red}   strokeWidth={1.5} dot={false} name="Crude (indexed)" />
                    <Line type="monotone" dataKey="wax"    stroke={P.coral} strokeWidth={1.5} dot={false} name="Wax cost" />
                    <Line type="monotone" dataKey="cpw"    stroke={P.cyan}  strokeWidth={1.5} dot={false} name="CPW revenue" />
                    <Line type="monotone" dataKey="margin" stroke={P.green} strokeWidth={2.5} dot={{ r: 3, fill: P.green }} name="Margin %" />
                    <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <ChartCard title="Upstream signals" style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Crude oil (Brent)",       value: "$79/bbl",  trend: "↓ 3%",       color: P.green },
                      { label: "Paraffin wax (IOCL)",     value: "₹65K/MT",  trend: "↓ 2%",       color: P.green },
                      { label: "Chlorine (piped)",        value: "₹5.2K/MT", trend: "→ flat",      color: P.textMuted },
                      { label: "Electricity (Jharkhand)", value: "₹7.8/kWh", trend: "↑ 1%",        color: P.amber },
                      { label: "ESBO (soy-linked)",       value: "₹110K/MT", trend: "↓ 5%",        color: P.green },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 7, borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}>
                        <span style={{ fontSize: 11, color: P.textMuted }}>{r.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{r.value}</span>
                          <span style={{ fontSize: 10, color: r.color, fontWeight: 700 }}>{r.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                <ChartCard title="Downstream demand signals" style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "PVC production index",    value: "106.2",     trend: "↑ 4%",        color: P.green },
                      { label: "Auto output (SIAM)",      value: "3.8L units",trend: "↑ 2%",        color: P.green },
                      { label: "Steel production (JPC)",  value: "12.1 MT",   trend: "→ flat",       color: P.textMuted },
                      { label: "DOP/DBP plasticizer",     value: "₹132K/MT",  trend: "↑ 8%",        color: P.green },
                      { label: "Construction (monsoon)",  value: "Recovery",  trend: "↑ resuming",   color: P.cyan },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 7, borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}>
                        <span style={{ fontSize: 11, color: P.textMuted }}>{r.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{r.value}</span>
                          <span style={{ fontSize: 10, color: r.color, fontWeight: 700 }}>{r.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Market intelligence</div>
              <Alert icon="✓" color={P.green}  msg="Crude down 3% this week. Paraffin wax procurement window: IOCL next circular expected ₹1.5–2K/MT lower. Lock in 2-week supply now." />
              <Alert icon="→" color={P.accent} msg="DOP at ₹132K/MT (↑8% MoM). CPW is 40% cheaper per plasticizer unit. Sales opportunity: target PVC compounders currently using DOP. Prepare samples + pricing." />
              <Alert icon="⚠" color={P.amber}  msg="Grasim Rehla Cl₂ plant scheduled maintenance in 3 weeks (14 days). Units 2, 3, 6 on piped supply. Verify alternate Cl₂ source or pre-build inventory." />
              <Alert icon="→" color={P.cyan}   msg="Monsoon receding. Construction restart signals strong in western India. PVC pipe demand expected to surge in 4–6 weeks. Pre-build CP-52 inventory." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
