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

## Canlı oyun

- Oyun: https://hamit3131.github.io/driftline-game/
- GitHub deposu: https://github.com/hamit3131/driftline-game

## Yerelde çalıştırma

`index.html` dosyasını bir tarayıcıda aç. Alternatif olarak proje klasöründe basit bir yerel sunucu başlat:

```bash
python -m http.server 8000
```

Sonra `http://localhost:8000` adresini aç. Mobil cihazda oynamak için oyunu bir web sunucusunda yayınla; aynı Wi-Fi ağındaki yerel sunucuya veya GitHub Pages bağlantısına telefon tarayıcısından erişebilirsin.

## GitHub Pages ile yayınlama

Bu proje derleme veya paket kurulumu istemez. `.github/workflows/pages.yml` dosyası `main` dalındaki her güncellemede `index.html`, `style.css` ve `game.js` dosyalarını otomatik yayımlar.

Depoyu kendi hesabına kopyalarsan, **Settings → Pages → Build and deployment → Source** alanında **GitHub Actions** seç. Sonra `main` dalına gönderdiğin her güncelleme otomatik yayımlanır; durumu **Actions** sekmesinde görebilirsin.

Oyun PC ve mobil tarayıcılarda aynı bağlantıyla çalışır.

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
