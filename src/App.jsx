import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";

const plantPerf = [
  { plant: "Unit 1", loc: "Mirzapur", yield: 91.2, cycle: 21.4, energy: 198, hcl: 30.4, batches: 38, offSpec: 4 },
  { plant: "Unit 2", loc: "Jharkhand", yield: 93.5, cycle: 20.1, energy: 188, hcl: 31.2, batches: 52, offSpec: 3 },
  { plant: "Unit 3", loc: "Jharkhand", yield: 94.8, cycle: 19.2, energy: 182, hcl: 31.8, batches: 98, offSpec: 5 },
  { plant: "Unit 4", loc: "Odisha", yield: 92.1, cycle: 20.8, energy: 195, hcl: 30.8, batches: 48, offSpec: 4 },
  { plant: "Unit 5", loc: "NCR", yield: 93.0, cycle: 20.5, energy: 190, hcl: 31.0, batches: 65, offSpec: 5 },
  { plant: "Unit 6", loc: "Jharkhand", yield: 95.6, cycle: 18.5, energy: 172, hcl: 32.1, batches: 70, offSpec: 2 },
];

const hclPlants = [
  { plant: "Unit 1", state: "Free", tank: 78, rate: 0, vol: 380, action: "Find paid buyer or route to Unit 5" },
  { plant: "Unit 2", state: "Paid", tank: 45, rate: 2800, vol: 620, action: "Steel buyer paying \u20B92.8K/MT" },
  { plant: "Unit 3", state: "Paid", tank: 52, rate: 3100, vol: 1200, action: "Pharma at \u20B93.1K \u2014 push volume" },
  { plant: "Unit 4", state: "Dispose", tank: 92, rate: -800, vol: 280, action: "\u26A0 Tank critical. Throttle CPW." },
  { plant: "Unit 5", state: "Paid", tank: 38, rate: 2500, vol: 850, action: "NCR market strong. Room in tank." },
  { plant: "Unit 6", state: "Free", tank: 65, rate: 0, vol: 700, action: "Monsoon ending \u2014 nearing paid" },
];

const hclTrend = [
  { w: "W1", paid: 3200, free: 800, dispose: 0 },
  { w: "W2", paid: 2900, free: 1100, dispose: 200 },
  { w: "W3", paid: 2500, free: 1200, dispose: 500 },
  { w: "W4", paid: 2100, free: 1400, dispose: 700 },
  { w: "W5", paid: 2800, free: 1000, dispose: 400 },
  { w: "W6", paid: 3100, free: 900, dispose: 200 },
  { w: "W7", paid: 3400, free: 700, dispose: 100 },
  { w: "W8", paid: 3000, free: 1000, dispose: 200 },
];

const demandData = [
  { m: "Oct", pvc: 1800, mwf: 650, rubber: 450, paint: 250, export: 380 },
  { m: "Nov", pvc: 2100, mwf: 700, rubber: 500, paint: 200, export: 420 },
  { m: "Dec", pvc: 1950, mwf: 600, rubber: 400, paint: 300, export: 350 },
  { m: "Jan", pvc: 2400, mwf: 750, rubber: 550, paint: 280, export: 450 },
  { m: "Feb", pvc: 2200, mwf: 800, rubber: 480, paint: 320, export: 400 },
  { m: "Mar", pvc: 2600, mwf: 850, rubber: 520, paint: 350, export: 480 },
  { m: "Apr\u2217", pvc: 2450, mwf: 780, rubber: 500, paint: 300, export: 460 },
  { m: "May\u2217", pvc: 2700, mwf: 900, rubber: 580, paint: 380, export: 520 },
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
  { id: "command", label: "Command center", icon: "\u25A3" },
  { id: "hcl", label: "HCl intelligence", icon: "\u25C8" },
  { id: "demand", label: "Demand & planning", icon: "\u25CE" },
  { id: "market", label: "Market & margin", icon: "\u25C7" },
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

const TT = { background: P.elevated, border: `1px solid ${P.border}`, borderRadius: 6, color: P.text, fontSize: 11, padding: "8px 12px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" };

function Metric({ label, value, sub, color = P.accent, small }) {
  return (
    <div style={{ padding: small ? "12px 14px" : "16px 18px", background: P.card, borderRadius: 12, border: `1px solid ${P.border}`, flex: 1, minWidth: small ? 120 : 140, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}00, ${color}66, ${color}00)` }} />
      <div style={{ fontSize: 10, color: P.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: small ? 22 : 28, fontWeight: 600, color, lineHeight: 1, fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: P.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Tag({ text, color }) {
  const bg = color + "18";
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: bg, color, border: `1px solid ${color}33`, letterSpacing: "0.02em" }}>{text}</span>;
}

function StateIndicator({ state }) {
  const config = { Paid: { c: P.green, icon: "\u2713", bg: P.greenDim }, Free: { c: P.amber, icon: "\u2013", bg: P.amberDim }, Dispose: { c: P.red, icon: "\u2717", bg: P.redDim } };
  const s = config[state];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: s.bg, color: s.c, border: `1px solid ${s.c}22` }}>
      <span style={{ fontSize: 10 }}>{s.icon}</span> {state}
    </span>
  );
}

function ChartCard({ title, subtitle, children, style: s }) {
  return (
    <div style={{ background: P.card, borderRadius: 12, border: `1px solid ${P.border}`, padding: "16px 18px", ...s }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: P.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: P.textDim, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Alert({ msg, color }) {
  return (
    <div style={{ padding: "11px 14px", borderRadius: 8, background: color + "08", borderLeft: `2px solid ${color}`, marginBottom: 6, fontSize: 11, color: P.text, lineHeight: 1.6 }}>{msg}</div>
  );
}

export default function App() {
  const [tab, setTab] = useState("command");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const totalBatches = plantPerf.reduce((s, p) => s + p.batches, 0);
  const avgYield = (plantPerf.reduce((s, p) => s + p.yield * p.batches, 0) / totalBatches).toFixed(1);
  const totalOff = plantPerf.reduce((s, p) => s + p.offSpec, 0);

  return (
    <div style={{ background: P.bg, minHeight: "100vh", color: P.text, fontFamily: "'DM Sans', 'Satoshi', system-ui, sans-serif", transition: "opacity 0.4s", opacity: loaded ? 1 : 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${P.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.accent, boxShadow: `0 0 12px ${P.accent}66` }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: P.accent, textTransform: "uppercase", letterSpacing: "0.12em" }}>Live</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px", color: P.text, letterSpacing: "-0.02em" }}>Suntek Group</h1>
            <p style={{ fontSize: 12, color: P.textMuted, margin: 0 }}>6 plants \u00b7 44 reactors \u00b7 7+ product lines \u00b7 <span style={{ color: P.accent }}>Powered by CaratSense</span></p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 14px", background: P.card, borderRadius: 8, border: `1px solid ${P.border}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.green }} />
            <span style={{ fontSize: 11, color: P.textMuted }}>38/44 reactors active</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 0, marginTop: 18 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 18px", border: "none", cursor: "pointer", background: "transparent",
              borderBottom: tab === t.id ? `2px solid ${P.accent}` : "2px solid transparent",
              color: tab === t.id ? P.accent : P.textMuted,
              fontSize: 12, fontWeight: tab === t.id ? 600 : 500, transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <span style={{ fontSize: 14, opacity: 0.7 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px 40px" }}>

        {/* ═══ COMMAND CENTER ═══ */}
        {tab === "command" && (<div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Metric label="Monthly output" value="7,500" sub="MT CPW \u00b7 Target: 10K" color={P.cyan} />
            <Metric label="Group yield" value={`${avgYield}%`} sub="Weighted average" color={P.green} />
            <Metric label="HCl generated" value="15,000" sub="MT \u00b7 ~2\u00d7 CPW volume" color={P.coral} />
            <Metric label="Off-spec" value={totalOff.toString()} sub={`of ${totalBatches} batches`} color={totalOff < 25 ? P.amber : P.red} />
          </div>

          <ChartCard title="Plant performance benchmark" subtitle="Yield % by unit \u2014 same grades, different plants" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={plantPerf} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                <XAxis dataKey="plant" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                <YAxis domain={[88, 98]} tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="yield" name="Yield %" radius={[6, 6, 0, 0]}>
                  {plantPerf.map((r, i) => <Cell key={i} fill={r.yield >= 95 ? P.green : r.yield >= 93 ? P.accent : r.yield >= 91.5 ? P.coral : P.red} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ background: P.card, borderRadius: 12, border: `1px solid ${P.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 8px", fontSize: 13, fontWeight: 600 }}>Unit detail</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Plant", "Location", "Yield", "Cycle", "kWh/t", "HCl %", "Batches", "Off-spec"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 9, fontWeight: 600, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{plantPerf.map((r, i) => (
                <tr key={r.plant} style={{ borderBottom: `1px solid ${P.border}`, transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = P.elevated} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: P.accent, fontSize: 12 }}>{r.plant}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: P.textMuted }}>{r.loc}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: r.yield >= 94 ? P.green : P.text }}>{r.yield}%</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{r.cycle}h</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: r.energy <= 185 ? P.green : r.energy >= 195 ? P.red : P.text }}>{r.energy}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: r.hcl >= 31 ? P.green : P.amber }}>{r.hcl}%</td>
                  <td style={{ padding: "10px 14px", fontSize: 12 }}>{r.batches}</td>
                  <td style={{ padding: "10px 14px" }}><Tag text={r.offSpec} color={r.offSpec <= 3 ? P.green : P.amber} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Insights</div>
            <Alert msg="Unit 6 outperforms all units: 95.6% yield, 172 kWh/ton. Its process parameters should baseline models across plants." color={P.green} />
            <Alert msg="Unit 1 highest energy at 198 kWh/ton \u2014 26 kWh more than Unit 6 on same grades. Cooling system audit recommended. Est. savings: \u20B918\u201324L/yr." color={P.amber} />
            <Alert msg="Group utilization at 78%. Pushing to 85% across 44 reactors = ~530 additional MT CPW/month." color={P.cyan} />
          </div>
        </div>)}

        {/* ═══ HCL INTELLIGENCE ═══ */}
        {tab === "hcl" && (<div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Metric label="Paid" value={`${hclPlants.filter(h=>h.state==="Paid").reduce((s,h)=>s+h.vol,0)}`} sub={`MT \u00b7 ${hclPlants.filter(h=>h.state==="Paid").length} plants`} color={P.green} />
            <Metric label="Free" value={`${hclPlants.filter(h=>h.state==="Free").reduce((s,h)=>s+h.vol,0)}`} sub={`MT \u00b7 ${hclPlants.filter(h=>h.state==="Free").length} plants`} color={P.amber} />
            <Metric label="Dispose" value={`${hclPlants.filter(h=>h.state==="Dispose").reduce((s,h)=>s+h.vol,0)}`} sub="MT \u00b7 Costing money" color={P.red} />
            <Metric label="Net realization" value="\u20B92.1K" sub="Blended avg /MT" color={P.accent} />
          </div>

          <div style={{ background: P.card, borderRadius: 12, border: `1px solid ${P.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "14px 18px 4px" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>HCl economic state by plant</div>
              <div style={{ fontSize: 10, color: P.textDim, marginTop: 2 }}>Paid = revenue \u00b7 Free = zero \u00b7 Dispose = you pay to remove</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead><tr>{["Plant", "State", "Tank", "Rate", "MT/wk", "Action"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 9, fontWeight: 600, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{hclPlants.map(r => (
                <tr key={r.plant} style={{ borderBottom: `1px solid ${P.border}` }} onMouseEnter={e=>e.currentTarget.style.background=P.elevated} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 12, color: P.accent }}>{r.plant}</td>
                  <td style={{ padding: "10px 14px" }}><StateIndicator state={r.state} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 48, height: 6, borderRadius: 3, background: P.elevated, overflow: "hidden" }}>
                        <div style={{ width: `${r.tank}%`, height: "100%", borderRadius: 3, background: r.tank >= 85 ? P.red : r.tank >= 70 ? P.amber : P.green, transition: "width 0.6s" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: r.tank >= 85 ? P.red : P.textMuted }}>{r.tank}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: r.rate > 0 ? P.green : r.rate === 0 ? P.textDim : P.red }}>{r.rate > 0 ? `\u20B9${r.rate}` : r.rate === 0 ? "\u2014" : `-\u20B9${Math.abs(r.rate)}`}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{r.vol}</td>
                  <td style={{ padding: "10px 14px", fontSize: 10, color: P.textMuted, maxWidth: 200 }}>{r.action}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <ChartCard title="HCl economics trend" subtitle="MT per week \u00b7 stacked by economic state">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hclTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                <XAxis dataKey="w" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="paid" stackId="1" fill={P.greenDim} stroke={P.green} strokeWidth={1.5} name="Paid" />
                <Area type="monotone" dataKey="free" stackId="1" fill={P.amberDim} stroke={P.amber} strokeWidth={1.5} name="Free" />
                <Area type="monotone" dataKey="dispose" stackId="1" fill={P.redDim} stroke={P.red} strokeWidth={1.5} name="Dispose" />
                <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Action items</div>
            <Alert msg="Unit 4 tank at 92%. Route 120 MT to Unit 3 (tanker \u20B918K, saves \u20B996K vs disposal). Throttle to CP-42 only." color={P.red} />
            <Alert msg="Cross-plant arbitrage: Unit 6 HCl free, Unit 5 has paying buyers. 40 MT tanker = \u20B922K cost, \u20B91L revenue. Net: \u20B978K." color={P.cyan} />
            <Alert msg="Unit 3 Pharma buyer wants 30% more volume. Increase CPW production there to capture premium HCl rate (\u20B93.1K/MT)." color={P.green} />
          </div>
        </div>)}

        {/* ═══ DEMAND & PLANNING ═══ */}
        {tab === "demand" && (<div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Metric label="CPW demand" value="5,100" sub="MT next month" color={P.cyan} />
            <Metric label="HCl demand" value="12,800" sub="MT all segments" color={P.coral} />
            <Metric label="Top segment" value="PVC" sub="53% of CPW demand" color={P.accent} />
            <Metric label="Export" value="9.4%" sub="Star Export House" color={P.green} />
          </div>

          <ChartCard title="CPW demand by buyer segment" subtitle="MT \u00b7 \u2217 = AI forecast" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                <XAxis dataKey="m" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="pvc" stackId="1" fill={P.purpleDim} stroke={P.purple} strokeWidth={1.5} name="PVC" />
                <Area type="monotone" dataKey="mwf" stackId="1" fill={P.cyanDim} stroke={P.cyan} strokeWidth={1.5} name="Metalworking" />
                <Area type="monotone" dataKey="rubber" stackId="1" fill={P.amberDim} stroke={P.amber} strokeWidth={1.5} name="Rubber" />
                <Area type="monotone" dataKey="export" stackId="1" fill={P.greenDim} stroke={P.green} strokeWidth={1.5} name="Export" />
                <Area type="monotone" dataKey="paint" stackId="1" fill={P.coralDim} stroke={P.coral} strokeWidth={1.5} name="Paints" />
                <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ background: P.card, borderRadius: 12, border: `1px solid ${P.border}`, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px 8px", fontSize: 13, fontWeight: 600 }}>Order-to-plant assignment</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Order", "Buyer", "Grade", "MT", "Plant", "Reason"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 9, fontWeight: 600, color: P.textDim, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${P.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{[
                ["ORD-4821", "Finolex Cables", "CP-52", "120", "Unit 3", "Best yield + HCl has paying buyer"],
                ["ORD-4822", "Supreme (Export)", "CP-52", "85", "Unit 6", "Export grade: highest quality unit"],
                ["ORD-4823", "Lubrizol", "CP-42", "60", "Unit 5", "NCR. CP-42 = less HCl generation"],
                ["ORD-4824", "Fenner Belts", "CP-70", "45", "Unit 3", "Glass-lined. NOT Unit 4 (HCl full)"],
                ["ORD-4825", "Asian Paints", "CP-52", "90", "Unit 2", "In stock. Jharkhand freight optimal"],
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${P.border}` }} onMouseEnter={e=>e.currentTarget.style.background=P.elevated} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.accent }}>{r[0]}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 500 }}>{r[1]}</td>
                  <td style={{ padding: "10px 14px" }}><Tag text={r[2]} color={r[2]==="CP-52"?P.purple:r[2]==="CP-42"?P.cyan:P.amber} /></td>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{r[3]}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 12 }}>{r[4]}</td>
                  <td style={{ padding: "10px 14px", fontSize: 10, color: P.textMuted }}>{r[5]}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>)}

        {/* ═══ MARKET & MARGIN ═══ */}
        {tab === "market" && (<div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Metric label="Brent crude" value="$79" sub="Per barrel \u00b7 trending down" color={P.green} />
            <Metric label="Wax cost" value="\u20B965K" sub="Per MT \u00b7 tracking crude" color={P.amber} />
            <Metric label="CPW margin" value="28%" sub="CP-52 blended" color={P.green} />
            <Metric label="DOP price" value="\u20B9132K" sub="Per MT \u00b7 CPW competitive" color={P.accent} />
          </div>

          <ChartCard title="Margin model" subtitle="Indexed \u00b7 Crude \u2192 wax cost \u2192 CPW revenue \u2192 margin gap" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} />
                <XAxis dataKey="w" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={{ stroke: P.border }} tickLine={false} />
                <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TT} />
                <Line type="monotone" dataKey="crude" stroke={P.red} strokeWidth={1.5} dot={false} name="Crude (indexed)" />
                <Line type="monotone" dataKey="wax" stroke={P.coral} strokeWidth={1.5} dot={false} name="Wax cost" />
                <Line type="monotone" dataKey="cpw" stroke={P.cyan} strokeWidth={1.5} dot={false} name="CPW revenue" />
                <Line type="monotone" dataKey="margin" stroke={P.green} strokeWidth={2.5} dot={{ r: 3, fill: P.green }} name="Margin %" />
                <Legend wrapperStyle={{ fontSize: 10, color: P.textMuted }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <ChartCard title="Upstream signals" style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Crude oil (Brent)", value: "$79/bbl", trend: "\u2193 3%", color: P.green },
                  { label: "Paraffin wax (IOCL)", value: "\u20B965K/MT", trend: "\u2193 2%", color: P.green },
                  { label: "Chlorine (piped)", value: "\u20B95.2K/MT", trend: "\u2192 flat", color: P.textMuted },
                  { label: "Electricity (Jharkhand)", value: "\u20B97.8/kWh", trend: "\u2191 1%", color: P.amber },
                  { label: "ESBO (soy-linked)", value: "\u20B9110K/MT", trend: "\u2193 5%", color: P.green },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}>
                    <span style={{ fontSize: 11, color: P.textMuted }}>{r.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{r.value}</span>
                      <span style={{ fontSize: 10, color: r.color, fontWeight: 600 }}>{r.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Downstream demand signals" style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "PVC production index", value: "106.2", trend: "\u2191 4%", color: P.green },
                  { label: "Auto output (SIAM)", value: "3.8L units", trend: "\u2191 2%", color: P.green },
                  { label: "Steel production (JPC)", value: "12.1 MT", trend: "\u2192 flat", color: P.textMuted },
                  { label: "DOP/DBP plasticizer", value: "\u20B9132K/MT", trend: "\u2191 8%", color: P.green },
                  { label: "Construction (monsoon)", value: "Recovery", trend: "\u2191 resuming", color: P.cyan },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 4 ? `1px solid ${P.border}` : "none" }}>
                    <span style={{ fontSize: 11, color: P.textMuted }}>{r.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{r.value}</span>
                      <span style={{ fontSize: 10, color: r.color, fontWeight: 600 }}>{r.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Market intelligence</div>
            <Alert msg="Crude down 3% this week. Paraffin wax procurement window: IOCL next circular expected \u20B91.5\u20132K/MT lower. Lock in 2-week supply now." color={P.green} />
            <Alert msg="DOP at \u20B9132K/MT (\u21918% MoM). CPW is 40% cheaper per plasticizer unit. Sales opportunity: target PVC compounders currently using DOP. Prepare samples + pricing." color={P.accent} />
            <Alert msg="Grasim Rehla Cl\u2082 plant scheduled maintenance in 3 weeks (14 days). Units 2, 3, 6 on piped supply. Verify alternate Cl\u2082 source or pre-build inventory." color={P.amber} />
            <Alert msg="Monsoon receding. Construction restart signals strong in western India. PVC pipe demand expected to surge in 4\u20136 weeks. Pre-build CP-52 inventory." color={P.cyan} />
          </div>
        </div>)}
      </div>
    </div>
  );
}
