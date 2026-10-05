# Driftline

Türkçe arayüzlü, masaüstü ve mobil tarayıcılarda oynanabilen 2D drift oyunu. Saf HTML, CSS ve JavaScript kullanır; bağımlılık veya derleme adımı yoktur.

## Özellikler

- Zikzaklı yollar, 20 bölüm ve orman, liman, dağ, sahil, çöl ve kar rotaları
- Serbest sürüş, zamana karşı ve jeton avı modları
- Drift puanı, jetonlar, trafik, rampalar, turbo ve üç canlı serbest sürüş
- Garajda araç satın alma, performans yükseltme, boya, şerit, jant, spoiler ve neon modifiyeleri
- Otomatik veya manuel vites; manuel vites kolu, `Q` ve `E` kontrolleri
- Üç seçilebilir oyun içi müzik parçası
- Dokunmatik mobil sürüş kontrolleri ve fare/klavye desteği
- İlerleme tarayıcının yerel depolamasında saklanır

## Yerelde çalıştırma

`index.html` dosyasını bir tarayıcıda aç. Alternatif olarak proje klasöründe basit bir yerel sunucu başlat:

```bash
python -m http.server 8000
```

Sonra `http://localhost:8000` adresini aç. Mobil cihazda oynamak için oyunu bir web sunucusunda yayınla; aynı Wi-Fi ağındaki yerel sunucuya veya GitHub Pages bağlantısına telefon tarayıcısından erişebilirsin.

## GitHub Pages ile yayınlama

Bu proje derleme veya paket kurulumu istemez. `index.html`, `style.css`, `game.js` ve `.github/workflows/pages.yml` dosyalarını GitHub deposuna yüklemen yeterli.

1. GitHub'da yeni bir depo oluştur ve bu klasördeki dosyaları deponun kök dizinine yükle.
2. Depoda **Settings → Pages** sayfasını aç.
3. **Build and deployment → Source** alanında **GitHub Actions** seç.
4. Dosyaları `main` dalına gönder. **Actions** sekmesindeki `Publish Driftline to GitHub Pages` iş akışı oyunu otomatik yayımlar.
5. Yayın tamamlanınca **Settings → Pages** bölümünde gösterilen bağlantıyı aç. Aynı bağlantı PC ve mobil tarayıcılarda çalışır.

Sonraki her `main` güncellemesi siteyi yeniden yayımlar. İstersen iş akışını **Actions** sekmesinden elle de başlatabilirsin.

## Kontroller

| Eylem | Klavye | Mobil |
| --- | --- | --- |
| Gaz | `W` / `↑` | Gaz düğmesine basılı tut |
| Fren / geri | `S` / `↓` | Fren düğmesine basılı tut |
| Yön | `A` / `D` veya oklar | Sol/sağ düğmelerine basılı tut |
| Drift | `Space` | Drift düğmesine basılı tut |
| Turbo | `Shift` | Turbo düğmesine basılı tut |
| Vites yükselt / düşür | `E` / `Q` | Manuel vites kolundaki numaraya dokun |
| Kamera | `C` | Ekrandaki kamera düğmesi |
| Duraklat | `P` / `Esc` | Duraklat düğmesi |

Arka plan müziği ve ses efektleri tarayıcı içinde üretilir. Ses, tarayıcıların izin gereksinimi nedeniyle ilk kullanıcı etkileşiminden sonra başlar.
