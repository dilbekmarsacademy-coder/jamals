import type { L10n, LeaguePlayer, Tier } from '@/types'
import { hashString, mulberry32, randInt } from '@/lib/random'

export const TIER_META: Record<Tier, { name: L10n; color: string }> = {
  bronze: { name: { en: 'Bronze', uz: 'Bronza', ru: 'Бронза' }, color: '#c2773a' },
  silver: { name: { en: 'Silver', uz: 'Kumush', ru: 'Серебро' }, color: '#a8b4c7' },
  gold: { name: { en: 'Gold', uz: 'Oltin', ru: 'Золото' }, color: '#f59e0b' },
  platinum: { name: { en: 'Platinum', uz: 'Platina', ru: 'Платина' }, color: '#2dd4bf' },
  diamond: { name: { en: 'Diamond', uz: 'Olmos', ru: 'Алмаз' }, color: '#22d3ee' },
  master: { name: { en: 'Master', uz: 'Usta', ru: 'Мастер' }, color: '#a78bfa' },
}

export const LEAGUE_SIZE = 20
export const PROMOTE = 3
export const DEMOTE = 3
export const MY_TIER: Tier = 'diamond'

const HANDLES = [
  'nodira.k', 'quantum_jas', 'madina.writes', 'timur_proofs', 'laylo.sat', 'bekzod1600', 'sevara.q', 'doniyor.dx',
  'nilu_reads', 'otabek.math', 'kamola.e', 'sardor_vec', 'dilnoza.m', 'akmal.t', 'shahzoda_u', 'rustam.o',
  'zarina.p', 'ilhom.s', 'malika.ink', 'jahon.v', 'aziza_tan', 'farrux.log', 'umida.r', 'elyor.sin',
  'gulnora.h', 'bobur.dy', 'yulduz.k', 'anvar.pi', 'feruza.e', 'shoxrux.x', 'mira.lex', 'ravshan.q',
  'nasiba.w', 'islom.ab', 'dildora.f', 'temur.vtx', 'oydin.z', 'kamron.n', 'lola.syn', 'zafar.int',
]

/**
 * Deterministic standings for a tier. XP ranges grow with the tier so higher
 * leagues look more competitive. The current user is merged in at runtime.
 */
export function leagueRoster(tier: Tier, size = LEAGUE_SIZE): LeaguePlayer[] {
  const tierIndex = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'].indexOf(tier)
  const rng = mulberry32(hashString(`league-${tier}`))
  const top = 900 + tierIndex * 420
  const players: LeaguePlayer[] = []
  for (let i = 0; i < size; i++) {
    const handle = HANDLES[(i * 7 + tierIndex * 5) % HANDLES.length]
    const decay = 1 - i / (size + 2)
    players.push({
      id: `${tier}-${i}`,
      username: handle,
      avatarHue: randInt(rng, 0, 359),
      streak: Math.max(0, Math.round(randInt(rng, 0, 60) * decay)),
      weekXp: Math.round((top * decay + randInt(rng, -40, 40)) / 5) * 5,
    })
  }
  return players
}

/** The Diamond league that the demo user competes in (fixed so the user starts at #4) */
export const myLeagueRivals: LeaguePlayer[] = [
  { id: 'r1', username: 'madina.writes', avatarHue: 300, streak: 52, weekXp: 2480 },
  { id: 'r2', username: 'quantum_jas', avatarHue: 190, streak: 41, weekXp: 2215 },
  { id: 'r3', username: 'timur_proofs', avatarHue: 30, streak: 33, weekXp: 1990 },
  { id: 'r4', username: 'nodira.k', avatarHue: 140, streak: 19, weekXp: 1720 },
  { id: 'r5', username: 'bekzod1600', avatarHue: 220, streak: 27, weekXp: 1655 },
  { id: 'r6', username: 'sevara.q', avatarHue: 340, streak: 12, weekXp: 1540 },
  { id: 'r7', username: 'laylo.sat', avatarHue: 60, streak: 22, weekXp: 1495 },
  { id: 'r8', username: 'otabek.math', avatarHue: 260, streak: 8, weekXp: 1380 },
  { id: 'r9', username: 'nilu_reads', avatarHue: 170, streak: 15, weekXp: 1305 },
  { id: 'r10', username: 'kamola.e', avatarHue: 10, streak: 6, weekXp: 1210 },
  { id: 'r11', username: 'sardor_vec', avatarHue: 120, streak: 30, weekXp: 1150 },
  { id: 'r12', username: 'dilnoza.m', avatarHue: 280, streak: 4, weekXp: 1045 },
  { id: 'r13', username: 'akmal.t', avatarHue: 200, streak: 9, weekXp: 980 },
  { id: 'r14', username: 'shahzoda_u', avatarHue: 320, streak: 3, weekXp: 905 },
  { id: 'r15', username: 'rustam.o', avatarHue: 90, streak: 11, weekXp: 820 },
  { id: 'r16', username: 'zarina.p', avatarHue: 45, streak: 2, weekXp: 760 },
  { id: 'r17', username: 'ilhom.s', avatarHue: 240, streak: 0, weekXp: 610 },
  { id: 'r18', username: 'malika.ink', avatarHue: 160, streak: 1, weekXp: 485 },
  { id: 'r19', username: 'jahon.v', avatarHue: 15, streak: 0, weekXp: 320 },
]
