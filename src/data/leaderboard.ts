import type { LeaderboardEntry } from '@/types'

const e = (
  id: string,
  name: string,
  school: string,
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
  e('u1', 'Jasur Karimov', 'Toshkent, 110-maktab', 1240, 4820, 12450, [2, 1, 1], 41),
  e('u2', 'Madina Rahimova', 'Samarqand, PIIMA', 1310, 4610, 11980, [1, 2, 2], 36),
  e('u3', 'Timur Yusupov', 'Toshkent, Al-Xorazmiy', 980, 4390, 11020, [5, 3, 3], 22),
  e('u4', 'Laylo Aliyeva', 'Buxoro, 5-litsey', 1105, 4100, 10340, [3, 4, 4], 18),
  e('u5', 'Bekzod Ismoilov', 'Namangan, IT-maktab', 870, 3850, 9870, [4, 6, 5], 15),
  e('u6', 'Sevara Qodirova', 'Toshkent, Westminster litseyi', 920, 3920, 9420, [6, 5, 7], 27),
  e('u7', 'Doniyor Toshev', 'Farg‘ona, 21-maktab', 760, 3400, 9105, [8, 8, 6], 9),
  e('u8', 'Nilufar Sobirova', 'Andijon, Prezident maktabi', 815, 3510, 8760, [7, 7, 8], 12),
  e('u9', 'Otabek Nazarov', 'Qarshi, 3-litsey', 640, 3120, 8340, [10, 9, 9], 6),
  e('u10', 'Kamola Ergasheva', 'Toshkent, 239-maktab', 700, 2980, 7980, [9, 11, 10], 14),
  e('u11', 'Sardor Hamidov', 'Nukus, Prezident maktabi', 520, 2760, 7210, [12, 10, 11], 4),
  e('u12', 'Dilnoza Mirzayeva', 'Xiva, 1-maktab', 590, 2650, 6840, [11, 12, 12], 8),
  e('u13', 'Akmal Turg‘unov', 'Termiz, 7-litsey', 430, 2410, 6300, [14, 14, 13], 3),
  e('u14', 'Shahzoda Umarova', 'Toshkent, INHA litseyi', 470, 2290, 5720, [13, 13, 15], 5),
  e('u15', 'Rustam Olimov', 'Jizzax, 2-maktab', 310, 1980, 5110, [16, 16, 14], 2),
  e('u16', 'Zarina Po‘latova', 'Guliston, 4-maktab', 280, 1720, 4650, [15, 17, 17], 1),
  e('u17', 'Ilhom Sattorov', 'Navoiy, 12-maktab', 210, 1510, 4020, [17, 15, 16], 0),
  e('u18', 'Muxlisa Abdullayeva', 'Urganch, 9-maktab', 160, 1200, 3480, [18, 18, 18], 0),
]
