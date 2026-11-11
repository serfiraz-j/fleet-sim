
# ADR-0001: TypeScript Tercihi

## Durum
Kabul edildi

## Bağlam
Fleet Simulator'da birden fazla sanal cihaz çalışacak ve bu cihazlar MQTT üzerinden sensör verileri gönderecek. İleride farklı cihaz tipleri de ekleneceği için kodun düzenli ve kolay geliştirilebilir olması önemli.

## Karar
Bu projede TypeScript kullanmaya karar verdim. Mevcut Device Management API ise JavaScript olarak kalacak.

## Neden TypeScript?
TypeScript sayesinde pil, sıcaklık ve basınç gibi verilerin tiplerini belirleyebiliyoruz. Yanlış tip kullanımını kodu çalıştırmadan fark edebilmek ve farklı cihazlar için ortak yapılar oluşturabilmek önemli avantajlar.

Ayrıca ekip de TypeScript kullanıyor.

## API Neden JavaScript Kalıyor?
Mevcut API zaten çalışıyor ve 26 otomatik testi var. Şu aşamada TypeScript'e geçirmek bize doğrudan bir fayda sağlamayacağı gibi gereksiz değişiklik ve hata riski oluşturabilir.

## Sonuç
TypeScript için ek yapılandırma gerekiyor ama özellikle cihaz verilerini yönetirken kodun daha güvenli ve anlaşılır olmasını sağlıyor. Dışarıdan gelen JSON verilerini ise ayrıca doğrulamamız gerekiyor.
