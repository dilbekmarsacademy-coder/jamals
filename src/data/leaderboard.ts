import type { L10n, LeaderboardEntry } from '@/types'

const e = (
  id: string,
  name: string,
  school: L10n,
  weekly: number,
  monthly: number,
  all: number,
  prev: [number, number, number],
  streak: number,
): LeaderboardEntry => ({
  id,
  name,
  school,
  avatarSeed: id,
  xp: { weekly, monthly, all },
  prevRank: { weekly: prev[0], monthly: prev[1], all: prev[2] },
  streak,
})

/** Other students. The current user is merged in at runtime with live XP from the store. */
export const leaderboard: LeaderboardEntry[] = [
  e('u1', 'Jasur Karimov', { uz: 'Toshkent, 110-maktab', ru: 'Ташкент, школа №110', en: 'Tashkent, School 110' }, 1240, 4820, 12450, [2, 1, 1], 41),
  e('u2', 'Madina Rahimova', { uz: 'Samarqand, PIIMA', ru: 'Самарканд, PIIMA', en: 'Samarkand, PIIMA' }, 1310, 4610, 11980, [1, 2, 2], 36),
  e('u3', 'Timur Yusupov', { uz: 'Toshkent, Al-Xorazmiy', ru: 'Ташкент, школа им. аль-Хорезми', en: 'Tashkent, Al-Khwarizmi School' }, 980, 4390, 11020, [5, 3, 3], 22),
  e('u4', 'Laylo Aliyeva', { uz: 'Buxoro, 5-litsey', ru: 'Бухара, лицей №5', en: 'Bukhara, Lyceum 5' }, 1105, 4100, 10340, [3, 4, 4], 18),
  e('u5', 'Bekzod Ismoilov', { uz: 'Namangan, IT-maktab', ru: 'Наманган, IT-школа', en: 'Namangan, IT School' }, 870, 3850, 9870, [4, 6, 5], 15),
  e('u6', 'Sevara Qodirova', { uz: 'Toshkent, Westminster litseyi', ru: 'Ташкент, лицей Westminster', en: 'Tashkent, Westminster Lyceum' }, 920, 3920, 9420, [6, 5, 7], 27),
  e('u7', 'Doniyor Toshev', { uz: 'Farg‘ona, 21-maktab', ru: 'Фергана, школа №21', en: 'Fergana, School 21' }, 760, 3400, 9105, [8, 8, 6], 9),
  e('u8', 'Nilufar Sobirova', { uz: 'Andijon, Prezident maktabi', ru: 'Андижан, Президентская школа', en: 'Andijan, Presidential School' }, 815, 3510, 8760, [7, 7, 8], 12),
  e('u9', 'Otabek Nazarov', { uz: 'Qarshi, 3-litsey', ru: 'Карши, лицей №3', en: 'Karshi, Lyceum 3' }, 640, 3120, 8340, [10, 9, 9], 6),
  e('u10', 'Kamola Ergasheva', { uz: 'Toshkent, 239-maktab', ru: 'Ташкент, школа №239', en: 'Tashkent, School 239' }, 700, 2980, 7980, [9, 11, 10], 14),
  e('u11', 'Sardor Hamidov', { uz: 'Nukus, Prezident maktabi', ru: 'Нукус, Президентская школа', en: 'Nukus, Presidential School' }, 520, 2760, 7210, [12, 10, 11], 4),
  e('u12', 'Dilnoza Mirzayeva', { uz: 'Xiva, 1-maktab', ru: 'Хива, школа №1', en: 'Khiva, School 1' }, 590, 2650, 6840, [11, 12, 12], 8),
  e('u13', 'Akmal Turg‘unov', { uz: 'Termiz, 7-litsey', ru: 'Термез, лицей №7', en: 'Termez, Lyceum 7' }, 430, 2410, 6300, [14, 14, 13], 3),
  e('u14', 'Shahzoda Umarova', { uz: 'Toshkent, INHA litseyi', ru: 'Ташкент, лицей INHA', en: 'Tashkent, INHA Lyceum' }, 470, 2290, 5720, [13, 13, 15], 5),
  e('u15', 'Rustam Olimov', { uz: 'Jizzax, 2-maktab', ru: 'Джизак, школа №2', en: 'Jizzakh, School 2' }, 310, 1980, 5110, [16, 16, 14], 2),
  e('u16', 'Zarina Po‘latova', { uz: 'Guliston, 4-maktab', ru: 'Гулистан, школа №4', en: 'Gulistan, School 4' }, 280, 1720, 4650, [15, 17, 17], 1),
  e('u17', 'Ilhom Sattorov', { uz: 'Navoiy, 12-maktab', ru: 'Навои, школа №12', en: 'Navoi, School 12' }, 210, 1510, 4020, [17, 15, 16], 0),
  e('u18', 'Muxlisa Abdullayeva', { uz: 'Urganch, 9-maktab', ru: 'Ургенч, школа №9', en: 'Urgench, School 9' }, 160, 1200, 3480, [18, 18, 18], 0),
]
