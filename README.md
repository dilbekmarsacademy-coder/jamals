# Kvazar — gamifikatsiyalashgan SAT tayyorlov platformasi

**Kvazar** — SAT'ga tayyorlanish uchun frontend-only (backend'siz) platforma. Auditoriya — katta yoshdagi o'quvchilar, shuning uchun interfeys sokin va "ish quroli" uslubida.

**Dizayn tizimi** (`src/index.css`): Inter shrifti, neytral sirtlar, bitta asosiy rang (indigo `#5B4BF0` / dark: `#7465FF`), aksent rang (korall) faqat seriya belgisi uchun. Gradient faqat logotipda ishlatiladi. Minimal shrift o'lchami 12px, hamma joyda bir xil klaviatura fokusi, `prefers-reduced-motion` hurmat qilinadi.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tiplarni tekshiradi va dist/ ga yig'adi
npm run preview    # build natijasini ko'rish
```

Node.js 20+ kerak. Birinchi ochilishda onboarding (`/welcome`) chiqadi: “Demo sifatida davom etish” → ism → maqsad → yo'nalish.
Progressni boshlang'ich holatga qaytarish uchun: **Profil → Progressni qayta boshlash**.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Framer Motion · React Router · Zustand (`persist` → localStorage) · canvas-confetti · YouTube IFrame API

## Sahifalar

| Route | Tavsif |
|---|---|
| `/` | Dashboard: salomlashuv (vaqtga qarab), SAT countdown, bugungi dars, shaxsiy progress (level ring, streak, XP), uy vazifalari hisoblagichi, haftalik reyting mini-widgeti, haftalik faollik grafigi |
| `/lessons` | Darslar ro'yxati (fan bo'yicha filtr, kurs progressi) |
| `/lessons/:id` | YouTube pleyer, real vaqtda ko'rilgan qism %, tugagach XP + “Uy vazifasiga o'tish” CTA, materiallar, oldingi/keyingi dars |
| `/homework` | 4 ustunli Kanban (mobil'da tablar), fan filtri, qidiruv, tafsilot modali |
| `/homework/:id` | Vazifani bajarish (savollar, topshirish, natija va tahlil) |
| `/leaderboard` | Podium + ro'yxat, ↑↓ o'zgarish, “siz” qatori sticky, haftalik/oylik/umumiy, shaxsiy rekordlar, nishonlar devori |
| `/attendance` | Oylik kalendar, kun popup'i, davomat % ring, davomat streak |
| `/profile` | Statistika, daraja tarixi, sozlamalar (ism, maqsad, sana, mavzu) |
| `/welcome` | Mock login + onboarding (UI-only) |

## Gamifikatsiya qoidalari

- **Dars tugallandi** — videoning 90% qismi *haqiqatda* ko'rilganda (oldinga o'tkazish hisoblanmaydi). `npm run dev` rejimida pleyer ostida “Dev: darsni tugallangan deb belgilash” tugmasi chiqadi (production build'da yashirin).
- **Mukofotlar** — ekranni to'smaydigan kichik bildirishnomalar (pastki o'ng burchak); yutuq va daraja uchun qisqa, kichik konfetti.
- **Uy vazifasi** — klaviatura: A–D yoki 1–4 javob tanlaydi, ← → savollar orasida o'tadi.
- **Uy vazifasi XP** — `xpReward × (0.4 + 0.6 × natija)`, muddati o'tgan bo'lsa ×0.5.
- **Kunlik seriya (streak)** — dars yoki vazifa bajarilgan ketma-ket kunlar (bugun hali faol bo'lmasangiz ham, kechagacha davom etsa, streak saqlanadi).
- **Darajalar** — har bir keyingi daraja uchun `300 + (level − 1) × 150` XP.
- **Nishonlar** — 16 ta; qoidalar `src/lib/badges.ts` da sof funksiyalar sifatida.
- **Davomat** — dars kunida (Du–Sh) faol bo'lsangiz, avtomatik “qatnashgan” deb belgilanadi.
- **Bildirishnomalar** — yangi nishon, daraja, muddat yaqinlashgani va streak xavf ostida ekani haqida.

## Struktura

```
src/
  data/          # mock ma'lumotlar (tiplangan TS): darslar, vazifalar, reyting, nishonlar, seed
  services/api.ts# ma'lumotlarga kirish qatlami (async) — backend ulanganda faqat shu fayl o'zgaradi
  store/         # Zustand store: XP, streak, progress, davomat, nishonlar, bildirishnomalar
  lib/           # sof yordamchi funksiyalar: levels, streak, badges, activity, leaderboard, date
  hooks/         # useQuery (skeleton + kesh), useYouTubePlayer, useRanking, ...
  components/
    ui/          # shadcn uslubidagi primitivlar (button, card, dialog, tabs, tooltip, skeleton)
    brand/       # Logo (SVG)
    layout/      # Sidebar, TopBar, BottomNav, RewardLayer, Notifications
    common/      # ProgressRing, BadgeTile, Avatar, pill'lar
    dashboard/ homework/
  pages/
```

## Backend'ga o'tish

1. `src/services/api.ts` dagi funksiyalarni `fetch()` chaqiruvlari bilan almashtiring — imzolar (`Promise<Lesson[]>` va h.k.) o'zgarmaydi.
2. Store'dagi action'lar (`completeLesson`, `submitHomework`, …) ichida server so'rovlarini qo'shing; XP/nishon qoidalari (`lib/levels.ts`, `lib/badges.ts`) serverga ko'chirilishi mumkin.
3. `useQuery` o'rniga TanStack Query qo'yish oson — interfeysi bir xil (`{ data, loading }`).

## Videolar

Barcha darslar ochiq YouTube SAT video'laridan (Khan Academy, Gradeful, Marcus Maths, The SAT Gamified, Ivy League Mentors va boshqalar); har bir ID oEmbed orqali tekshirilgan. Mualliflik huquqi video egalariga tegishli.
