import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import http from "http";
import https from "https";

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

async function getPublicIp() {
  return new Promise((resolve) => {
    https.get("https://api.ipify.org", { timeout: 3000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data.trim() || "103.160.174.114"));
    }).on("error", () => resolve("103.160.174.114"));
  });
}

const localIp = getLocalIp();
const publicIp = await getPublicIp();
const infoFiles = [
  path.resolve(process.cwd(), "public-url.json"),
  path.resolve(process.cwd(), "server/public-url.json"),
];

function saveInfo(payload) {
  const json = JSON.stringify(payload, null, 2);
  for (const f of infoFiles) {
    try {
      fs.writeFileSync(f, json);
    } catch (e) {}
  }
}

// Initial state
const info = {
  localIp,
  localPort: 5173,
  localUrl: `http://${localIp}:5173`,
  publicIp,
  publicUrl: null,
  tunnelPassword: publicIp,
  status: "starting",
  updatedAt: new Date().toISOString(),
};

saveInfo(info);

console.log(`🌐 Local Network Shareable URL: http://${localIp}:5173`);
console.log(`🔒 Public Tunnel Gateway IP (Tunnel Password): ${publicIp}`);
console.log("⚡ Starting secure public HTTPS tunnel via localtunnel with IPv4 binding...");

const lt = spawn("npx", ["-y", "localtunnel", "--port", "5173", "--local-host", "127.0.0.1", "--print-requests"], {
  stdio: ["ignore", "pipe", "pipe"],
});

lt.stdout.on("data", (data) => {
  const text = data.toString();
  console.log(text.trim());
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
  if (match) {
    info.publicUrl = match[0];
    info.status = "active";
    info.updatedAt = new Date().toISOString();
    saveInfo(info);
    console.log(`\n🎉 Public Secured HTTPS Link Ready: ${info.publicUrl}`);
    console.log(`🔑 If asked for Tunnel Password / Endpoint IP, enter: ${publicIp}\n`);
  }
});

lt.stderr.on("data", (data) => {
  console.error("Tunnel log:", data.toString().trim());
});

lt.on("close", (code) => {
  console.log(`Tunnel closed with code ${code}`);
  info.status = "closed";
  saveInfo(info);
});

