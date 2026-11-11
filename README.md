# Fleet Simulator

MQTT üzerinden sanal cihaz telemetrisi üreten TypeScript projesi. Staj çalışması kapsamında geliştiriliyor.

## Kullanılan Teknolojiler

- Node.js + TypeScript
- MQTT.js
- EMQX (Docker Compose)
- ESLint + Prettier

## Kurulum

Bağımlılıkları yükleyin:

```bash
npm ci
```

`.env` dosyasını oluşturun:

```env
BROKER_URL=mqtt://127.0.0.1:1883
INTERVAL_MS=1000
```

EMQX broker'ı başlatın:

```bash
docker compose up -d
```

Simülatörü çalıştırın:

```bash
npm run sim
```

Durdurmak için `Ctrl+C` kullanın.

## Telemetri

Simülatör şu topic'e JSON mesajları yayınlar:

`sim/ventilator/SIM-0001/telemetry`

Örnek mesaj:

```json
{
  "serialNumber": "SIM-0001",
  "ts": "2026-11-11T08:00:00.000Z",
  "battery": 85,
  "metrics": {
    "pressure": 18.4,
    "flow": 32.1,
    "volume": 480,
    "spo2": 97
  }
}
```

Sensör değerleri Random Walk yöntemiyle güncellenir.

## Test ve Kod Kontrolü

```bash
npm run typecheck
npm run lint
npm run format:check
```

## Bağlantı Kesilmesi

EMQX'i durdurmak için:

```bash
docker compose stop emqx
```

Broker kapalıyken simülatör çalışmaya devam eder ancak telemetri yayınlamaz.

Yeniden başlatmak için:

```bash
docker compose start emqx
```

Bağlantı geri geldiğinde MQTT.js otomatik olarak yeniden bağlanır ve telemetri yayını devam eder.

## Dokümantasyon

- `docs/adr/0001-typescript.md` — TypeScript tercihinin gerekçesi
- `notes/asama-1.md` — MQTT ve TypeScript araştırma notları

## Mevcut Kapsam

Aşama 1 kapsamında tek sanal ventilatör simülasyonu tamamlandı. Sonraki aşamalarda çoklu cihaz ve filo yönetimi eklenecek.