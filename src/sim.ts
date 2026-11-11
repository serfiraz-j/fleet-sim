import "dotenv/config";
import mqtt from "mqtt";

interface Telemetry {
  serialNumber: string;
  ts: string;
  battery: number;
  metrics: {
    pressure: number;
    flow: number;
    volume: number;
    spo2: number;
  };
}

function randomWalk(
  current: number,
  step: number,
  min: number,
  max: number,
): number {
  const change = (Math.random() * 2 - 1) * step;
  const next = current + change;

  return Math.max(min, Math.min(max, next));
}

const telemetry: Telemetry = {
  serialNumber: "SIM-0001",
  ts: new Date().toISOString(),
  battery: 85,
  metrics: {
    pressure: 18.4,
    flow: 32.1,
    volume: 480,
    spo2: 97,
  },
};

console.log("Telemetri hazır:", telemetry);

const brokerUrl = process.env.BROKER_URL;
const intervalMs = Number(process.env.INTERVAL_MS ?? 1000);

if (!Number.isInteger(intervalMs) || intervalMs <= 0) {
  throw new Error("INTERVAL_MS pozitif bir tam sayı olmalı");
}

if (!brokerUrl) {
  throw new Error("BROKER_URL .env dosyasında tanımlı değil");
}

const client = mqtt.connect(brokerUrl);
let telemetryTimer: ReturnType<typeof setInterval> | undefined;

client.on("connect", () => {
  console.log("EMQX broker bağlantısı başarılı!");

  if (telemetryTimer) return;

  telemetryTimer = setInterval(() => {
    const m = telemetry.metrics;

    m.pressure = randomWalk(m.pressure, 0.5, 10, 30);
    m.flow = randomWalk(m.flow, 1, 20, 60);
    m.volume = randomWalk(m.volume, 5, 300, 700);
    m.spo2 = randomWalk(m.spo2, 0.3, 95, 100);

    telemetry.ts = new Date().toISOString();

    if (!client.connected) {
      console.log("Broker bağlantısı yok, telemetri atlandı");
      return;
    }

    const topic = `sim/ventilator/${telemetry.serialNumber}/telemetry`;

    client.publish(topic, JSON.stringify(telemetry), { qos: 0 }, (error) => {
      if (error) {
        console.error("Telemetri yayın hatası:", error.message);
        return;
      }

      console.log("Telemetri publish işlemi tamamlandı:", telemetry);
    });
  }, intervalMs);
});

client.on("error", (error) => {
  console.error("MQTT bağlantı hatası:", error.message);
});

process.on("SIGINT", () => {
  console.log("Kapanış sinyali alındı");

  if (telemetryTimer) {
    clearInterval(telemetryTimer);
  }

  client.end(false, () => {
    console.log("MQTT bağlantısı düzgün kapatıldı");
  });
});
