# Aşama 1 — Araştırma Notları

## MQTT ile HTTP arasındaki fark

HTTP'de istemci istek atar, sunucu cevap verir. Her veri için yeni bir istek gerekir.

MQTT'de cihaz mesajını broker'a gönderir (publish). O topic'e abone olan (subscribe) herkes mesajı alır. Bağlantı açık kalır ve mesajlar küçüktür. Bu yüzden her saniye sensör verisi göndermek için MQTT daha uygun.

## MQTT broker ne işe yarar?

Broker araya giren bir dağıtıcı. Cihazlardan mesajları alır ve o topic'e abone olanlara iletir. Böylece cihaz, mesajı kimin dinlediğini bilmek zorunda kalmaz. Projede broker olarak EMQX kullandım.

## Topic ve wildcard

Topic, mesajın gönderildiği adres. Seviyeler `/` ile ayrılıyor. Ben `sim/ventilator/SIM-0001/telemetry` kullandım.

Wildcard'lar, abone olurken birden fazla topic'i tek seferde dinlemeyi sağlar:

- `+` tek bir seviyenin yerine geçer. `sim/ventilator/+/telemetry` bütün ventilatörlerin telemetrisini dinler.
- `#` kalan bütün seviyelerin yerine geçer. `sim/#`, `sim/` altındaki her mesajı dinler.

## QoS seviyeleri

QoS, mesajın ne kadar garantili teslim edileceğini belirler:

- **QoS 0:** En fazla bir kez gönderilir. Kaybolabilir ama en hızlısı bu.
- **QoS 1:** En az bir kez teslim edilir. Aynı mesaj iki kez gelebilir.
- **QoS 2:** Tam bir kez teslim edilir. En güvenlisi ama en yavaşı.

Telemetri için QoS 0 seçtim. Her saniye yeni ölçüm gidiyor, biri kaybolsa bir saniye sonra yenisi geliyor. Ek garantinin getireceği gecikmeye gerek yok.

## Neden TypeScript?

Telemetri verisi iç içe alanlardan oluşuyor. Yapısını tiplerle tanımlayınca yanlış alan adı ya da yanlış tip daha kod yazarken fark ediliyor. Device Management API ise JavaScript olarak kalıyor. Ayrıntılar ADR-0001'de.

## tsc ile tsx farkı

- `tsc`: Tipleri kontrol eder ve TypeScript'i JavaScript'e derler.
- `tsx`: TypeScript dosyasını ayrı bir derleme adımı olmadan doğrudan çalıştırır. Hızlıdır ama tip kontrolü yapmaz.

Bu yüzden ikisini ayrı kullanıyorum: `npm run typecheck` ile tipleri kontrol ediyorum, `npm run sim` ile simülatörü çalıştırıyorum.

## Random Walk

Random Walk, bir önceki değere küçük bir rastgele değişim ekleyerek yeni değeri üretir: `yeni değer = önceki değer + küçük rastgele değişim`.

Her ölçümde tamamen yeni bir rastgele sayı üretilseydi değerler mantıksız şekilde zıplardı. Random Walk ile değerler gerçek bir sensördeki gibi yavaş yavaş değişiyor. Sınırların dışına çıkmamaları için `Math.min()` ve `Math.max()` kullanıyorum.

## Bağlantı kesilme testi

1. `docker compose stop emqx` ile broker'ı durdurdum. Simülatör kapanmadı, sadece bağlantı hatası verdi.
2. `docker compose start emqx` ile broker'ı tekrar başlattım. Simülatör kendiliğinden yeniden bağlandı ve telemetri göndermeye devam etti.

Kapanışta Ctrl+C ile gelen SIGINT'i yakalıyorum. `clearInterval()` ile zamanlayıcıyı durdurup `client.end()` ile MQTT bağlantısını düzgün kapatıyorum.