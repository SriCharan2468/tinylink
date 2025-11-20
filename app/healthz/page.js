export const dynamic = "force-dynamic"; // ensures always fresh data

export default function HealthzPage() {
  // Node.js process.* APIs only work in server components (no "use client"!)
  const uptime = process.uptime();
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();

  const health = {
    status: "OK",
    uptime: `${Math.round(uptime)} seconds`,
    timestamp: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`
    },
    cpuUser: cpu.user,
    cpuSystem: cpu.system
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <div style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: 36,
        background: "#f8fafc",
        borderRadius: 18,
        boxShadow: "0 2px 18px #e7effa"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 32, color: "#204060", fontSize: 28 }}>
          System Health Check
        </h2>
        <table style={{
          width: "100%",
          fontSize: 18,
          borderCollapse: "separate",
          borderSpacing: "0 12px"
        }}>
          <tbody>
            <TableRow label="Status" value={health.status} />
            <TableRow label="Uptime" value={health.uptime} />
            <TableRow label="Timestamp" value={health.timestamp} />
            <TableRow label="Platform" value={health.platform} />
            <TableRow label="Node Version" value={health.nodeVersion} />
            <TableRow label="PID" value={health.pid} />
            <TableRow label="Memory RSS" value={health.memory.rss} />
            <TableRow label="Heap Used / Total" value={`${health.memory.heapUsed} / ${health.memory.heapTotal}`} />
            <TableRow label="CPU User" value={health.cpuUser} />
            <TableRow label="CPU System" value={health.cpuSystem} />
          </tbody>
        </table>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <a href="/home" style={{
            background: "#3580fb", color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 8, textDecoration: "none",
            fontWeight: 600, fontSize: 16, boxShadow: "0 2px 6px #d6e8fc"
          }}>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// Simple table row helper for a label-value row
function TableRow({ label, value }) {
  return (
    <tr>
      <td style={{ fontWeight: 700, color: "#215489", padding: "10px 0", width: "200px" }}>
        {label}:
      </td>
      <td style={{ color: "#174466", padding: "10px 0" }}>
        {value}
      </td>
    </tr>
  );
}
