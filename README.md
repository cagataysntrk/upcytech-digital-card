# UpcyTech Digital Card

UpcyTech kurucu ekibi için Vercel üzerinde çalışan dijital kartvizit, QR ve vCard sistemi.

## Ürün davranışı

Her kişinin kalıcı bir profil adresi vardır:

- `/cagatay`
- `/enes`
- `/hulusi`
- `/harun`
- `/hamza`

Ana QR kodu bu kalıcı profil URL'sini taşır. Telefon veya e-posta değiştiğinde QR kodunu yeniden basmak gerekmez.

Profil ekranında:

- tek dokunuşla `.vcf` kişi kartı açılır,
- telefon ve e-posta native uygulamaya yönlenir,
- UpcyTech web sitesi ve LinkedIn bağlantıları bulunur,
- cihaz destekliyorsa native paylaşım paneli açılır,
- aynı kartın baskıya uygun SVG ve yüksek çözünürlüklü PNG QR'ı indirilebilir.

## Mimari

- Next.js App Router
- TypeScript
- Vercel
- `qrcode` ile server-side SVG/PNG üretimi
- vCard 3.0
- Veritabanı yok
- Admin paneli yok
- QR hedefi sabit; profil verisi güncellenebilir

## Neden telefon/e-posta repoda tutulmuyor?

Bu repository public. Telefon ve e-posta gibi doğrudan iletişim bilgileri Vercel Environment Variables üzerinden okunur. Kart zaten paylaşılabilir bir yüzeydir fakat bu yöntem iletişim bilgisinin Git geçmişinde ayrıca kalmasını önler.

`.env.example` içindeki değişkenleri Vercel projesine ekleyin.

## Lokal geliştirme

```bash
cp .env.example .env.local
npm install
npm run dev
```

Kalite kontrolleri:

```bash
npm run typecheck
npm run build
```

## Vercel yayını

1. Bu repository'yi Vercel'e import edin.
2. Framework preset: Next.js.
3. `NEXT_PUBLIC_SITE_URL` değerini production domain ile tanımlayın:
   `https://card.upcytech.com`
4. İletişim değişkenlerini ekleyin.
5. Deploy edin.
6. Vercel > Project > Settings > Domains altında `card.upcytech.com` ekleyin.
7. DNS tarafında Vercel'in verdiği kaydı tanımlayın.
8. Domain aktif olduktan sonra QR'ları final olarak indirin.

> QR'lar production origin'i encode eder. Production domain değişecekse baskıdan önce
> `NEXT_PUBLIC_SITE_URL` değerini kesinleştirin.

## Yeni kişi eklemek

`lib/people.ts` içine yeni `PersonDefinition` ekleyin ve iki yeni environment variable tanımlayın:

```text
UPCY_CONTACT_<KEY>_PHONE
UPCY_CONTACT_<KEY>_EMAIL
```

Yeni slug otomatik olarak profil, vCard ve QR endpoint'lerinde kullanılabilir.

## Endpoint'ler

```text
/<slug>                              Dijital kart
/api/contact/<slug>                  vCard
/api/qr/<slug>?format=svg            QR SVG
/api/qr/<slug>?format=png            QR PNG
/api/qr/<slug>?format=png&download=1 İndirilebilir QR
```

## Güvenilir QR üretimi

QR çıktıları yüksek hata düzeltme seviyesi (`H`), yeterli quiet-zone ve yüksek çözünürlükle oluşturulur. Logo QR matrisinin üstüne bindirilmez; bu tercih küçük ekran ve baskıda tarama güvenilirliğini artırır.

## Mevcut ekip verisinin kaynağı

İsimler ve görevler UpcyTech'in kamusal ekip sayfasındaki güncel şirket tanımlarına göre başlangıç verisi olarak eklenmiştir. Telefon, e-posta ve kişisel sosyal hesaplar doğrulanmadan eklenmez.
