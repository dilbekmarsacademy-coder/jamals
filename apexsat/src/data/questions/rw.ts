import type { Question } from '@/types'

/**
 * Reading & Writing items. Passages and questions are original, written in the
 * style of the digital SAT (one short passage per question). Like the real
 * test, the item text stays in English; explanations are localized.
 */

type RW = Omit<Question, 'id' | 'domain'>

const craft: RW[] = [
  {
    difficulty: 'easy',
    passage:
      'Marine biologist Ayesha Rahman spent three seasons tracking a pod of orcas off the coast of Norway. Her early hypothesis—that the pod hunted only herring—proved too ______: by the second season she had recorded the orcas feeding on seals, lumpfish, and even seabirds.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['narrow', 'ambitious', 'popular', 'technical'],
    answer: 0,
    explanation: {
      en: 'The colon introduces evidence that the orcas ate many kinds of prey, so a hypothesis limited to herring was too "narrow." Nothing suggests it was ambitious, popular or technical.',
      uz: 'Ikki nuqtadan keyin orkalar ko‘p turdagi o‘lja yeganini ko‘rsatadi — faqat seld haqidagi gipoteza juda "tor" (narrow) bo‘lib chiqdi. Matnda gipoteza dadil, mashhur yoki texnik bo‘lgani haqida gap yo‘q.',
      ru: 'После двоеточия приводятся доказательства, что косатки ели разную добычу, — гипотеза только о сельди оказалась слишком «узкой» (narrow). Ничто не говорит, что она была амбициозной, популярной или технической.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Although critics initially dismissed the novelist’s sparse prose as unfinished, later readers came to see her restraint as ______: each omitted detail invites the reader to imagine what the characters cannot bring themselves to say.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['accidental', 'deliberate', 'excessive', 'conventional'],
    answer: 1,
    explanation: {
      en: '"Although" sets up a contrast with "unfinished." The second half explains that each omission has a purpose, so the restraint is "deliberate."',
      uz: '"Although" "unfinished" so‘zi bilan qarama-qarshilik yaratadi. Ikkinchi qism har bir tushirib qoldirilgan detal maqsadli ekanini tushuntiradi — demak "deliberate" (ataylab).',
      ru: '«Although» создаёт контраст со словом «unfinished». Вторая часть объясняет, что каждое умолчание имеет цель, значит сдержанность «deliberate» (намеренная).',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'The city council’s new transit plan is anything but ______. Rather than adding a few bus routes, it redraws the entire network, eliminates dozens of underused stops, and introduces express lines that cross the river for the first time.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['comprehensive', 'incremental', 'controversial', 'expensive'],
    answer: 1,
    explanation: {
      en: '"Anything but" means "not at all." The plan is sweeping rather than small-step, so it is anything but "incremental." "Comprehensive" would reverse the meaning.',
      uz: '"Anything but" — "umuman emas" degani. Reja kichik qadamlar emas, balki keng ko‘lamli — demak "incremental" (bosqichma-bosqich) emas. "Comprehensive" ma’noni teskari qiladi.',
      ru: '«Anything but» значит «совсем не». План масштабный, а не постепенный, то есть совсем не «incremental». «Comprehensive» перевернул бы смысл.',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'For decades, astronomers assumed that the faint glow between galaxies was mostly instrument noise. A 2023 survey challenged that view, showing that the glow brightens predictably around large galaxy clusters. The researchers argue that the light comes from stars that were stripped from their home galaxies and now drift through intergalactic space.',
    prompt: 'Which choice best describes the overall structure of the text?',
    choices: [
      'It presents a long-held assumption, describes evidence that undermines it, and offers an alternative explanation.',
      'It describes a new instrument, explains how it was built, and lists its potential uses.',
      'It compares two competing theories and concludes that neither is supported by evidence.',
      'It summarizes a historical debate and argues that the debate was never resolved.',
    ],
    answer: 0,
    explanation: {
      en: 'Sentence 1 gives the old assumption (noise), sentence 2 gives evidence against it (predictable brightening), sentence 3 offers a new explanation (stripped stars). That is choice A.',
      uz: '1-gap eski taxmin (shovqin), 2-gap unga qarshi dalil (bashorat qilinadigan yorqinlik), 3-gap yangi tushuntirish (galaktikadan ajralgan yulduzlar). Bu A javob.',
      ru: '1-е предложение — старое допущение (шум), 2-е — опровергающие данные (предсказуемое свечение), 3-е — новое объяснение (вырванные звёзды). Это вариант A.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Many urban gardeners plant marigolds beside their tomatoes, believing the bright flowers repel pests. Entomologist Luis Ortega tested the practice in forty community plots. He found that marigolds did reduce one common pest, the root-knot nematode, but had no measurable effect on aphids or whiteflies.',
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      'To argue that urban gardeners should stop planting marigolds',
      'To explain how marigolds produce the chemicals that repel pests',
      'To report a study that partly supports a common gardening belief',
      'To compare the damage caused by nematodes, aphids, and whiteflies',
    ],
    answer: 2,
    explanation: {
      en: 'The text introduces a belief and reports a study showing it holds for one pest but not others — partial support. It never tells gardeners to stop, and it doesn’t explain chemistry or compare damage.',
      uz: 'Matn keng tarqalgan e’tiqodni keltiradi va u faqat bitta zararkunanda uchun to‘g‘ri ekanini ko‘rsatgan tadqiqotni bayon qiladi — qisman tasdiq. Marigoldni ekmaslikka chaqiruv yoki kimyo haqida gap yo‘q.',
      ru: 'Текст приводит распространённое убеждение и исследование, подтвердившее его лишь для одного вредителя, — частичное подтверждение. Призыва отказаться от бархатцев и объяснения химии нет.',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'Text 1: Some economists claim that four-day workweeks raise productivity because rested employees work more efficiently.\n\nText 2: Trials of four-day weeks have mostly been run at firms that volunteered for them. Such firms may already have flexible cultures, so their success may not predict what would happen at a typical company.',
    prompt: 'Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1?',
    choices: [
      'By agreeing that rested employees are always more efficient',
      'By cautioning that the evidence may not apply to companies in general',
      'By arguing that four-day weeks reduce productivity at most firms',
      'By suggesting that economists should stop studying working hours',
    ],
    answer: 1,
    explanation: {
      en: 'Text 2 questions how far the results generalize (self-selected firms). It doesn’t claim productivity falls; it warns the evidence may not apply broadly — choice B.',
      uz: '2-matn natijalarni umumlashtirish mumkinligiga shubha bildiradi (o‘z ixtiyori bilan qatnashgan firmalar). U unumdorlik pasayadi demaydi — faqat dalil hammaga tegishli bo‘lmasligi mumkinligini ogohlantiradi (B).',
      ru: 'Текст 2 сомневается, можно ли обобщать результаты (фирмы-добровольцы). Он не утверждает, что продуктивность падает, а предупреждает, что данные могут не распространяться на все компании (B).',
    },
  },
  {
    difficulty: 'easy',
    passage:
      'The museum’s new exhibit on ancient textiles is remarkably ______. Visitors can touch replica fabrics, try a working loom, and watch a weaver demonstrate techniques that are more than two thousand years old.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['fragile', 'interactive', 'brief', 'theoretical'],
    answer: 1,
    explanation: {
      en: 'Touching fabrics, using a loom and watching a demonstration are all hands-on activities, so the exhibit is "interactive."',
      uz: 'Matolarni ushlab ko‘rish, to‘quv dastgohini sinash va namoyishni tomosha qilish — bularning barchasi amaliy faoliyat, demak ko‘rgazma "interactive".',
      ru: 'Потрогать ткани, поработать на станке, посмотреть демонстрацию — всё это практическое участие, значит выставка «interactive».',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'In her memoir, the architect recalls designing her first library for a town that had never had one. She notes, with some irony, that the building’s most praised feature—its enormous windows—began as a compromise: the budget could not cover electric lighting for every reading room.',
    prompt: 'Which choice best describes the function of the phrase "with some irony" in the text as a whole?',
    choices: [
      'It suggests that the architect regrets the design of the library.',
      'It signals that a celebrated feature had an unglamorous origin.',
      'It indicates that the town disliked the large windows.',
      'It emphasizes that the architect had little experience with libraries.',
    ],
    answer: 1,
    explanation: {
      en: 'The irony is the gap between the praise the windows received and their humble cause — a budget shortfall. Nothing indicates regret or that the town disliked them.',
      uz: 'Kinoya — derazalar olgan maqtov bilan ularning oddiy sababi (byudjet yetishmasligi) o‘rtasidagi farq. Afsus yoki shahar ularni yoqtirmagani haqida hech narsa yo‘q.',
      ru: 'Ирония — в разрыве между похвалой окнам и их прозаичной причиной (нехватка бюджета). Ни о сожалении, ни о недовольстве горожан речи нет.',
    },
  },
]

const expression: RW[] = [
  {
    difficulty: 'easy',
    passage:
      'Honeybees communicate the location of food through a "waggle dance." The angle of the dance indicates direction relative to the sun. ______ the duration of the waggle tells other bees how far away the food is.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['However,', 'Meanwhile,', 'Additionally,', 'Instead,'],
    answer: 2,
    explanation: {
      en: 'The sentence adds a second piece of information the dance conveys (distance, after direction). "Additionally" signals addition; the others signal contrast, simultaneity or replacement.',
      uz: 'Gap raqs bildiradigan ikkinchi ma’lumotni qo‘shadi (yo‘nalishdan keyin masofa). "Additionally" qo‘shishni bildiradi; qolganlari zidlik, bir vaqtlilik yoki almashtirishni bildiradi.',
      ru: 'Предложение добавляет вторую информацию, которую передаёт танец (расстояние после направления). «Additionally» — добавление; остальные — контраст, одновременность или замена.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Early electric cars of the 1900s were quiet, clean, and easy to start. ______ they faded from the market within two decades, as cheap gasoline and longer driving ranges made combustion engines more practical.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'For example,', 'Similarly,', 'Therefore,'],
    answer: 0,
    explanation: {
      en: 'Despite their advantages, the cars disappeared — a contrast with what you would expect. "Nevertheless" expresses that unexpected contrast.',
      uz: 'Afzalliklariga qaramay mashinalar bozordan yo‘qoldi — kutilganiga zid natija. "Nevertheless" aynan shu kutilmagan qarama-qarshilikni ifodalaydi.',
      ru: 'Несмотря на достоинства, машины исчезли — вопреки ожиданиям. «Nevertheless» выражает именно такой неожиданный контраст.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'The Atacama Desert receives less than a millimeter of rain in some years. ______ NASA scientists have used its soil to test instruments designed to search for life on Mars.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['In contrast,', 'For this reason,', 'Even so,', 'Previously,'],
    answer: 1,
    explanation: {
      en: 'The extreme dryness is why the desert is a good stand-in for Mars. The second sentence is a consequence of the first, so "For this reason" fits.',
      uz: 'Haddan tashqari quruqlik — cho‘l Marsga o‘xshatish uchun yaroqli bo‘lishining sababi. Ikkinchi gap birinchisining natijasi, shuning uchun "For this reason".',
      ru: 'Крайняя сухость — причина, по которой пустыня подходит как аналог Марса. Второе предложение — следствие первого, поэтому «For this reason».',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'While researching a topic, a student has taken the following notes:\n• The Svalbard Global Seed Vault is located in Norway’s Arctic.\n• It stores over 1.2 million seed samples from nearly every country.\n• Its purpose is to protect crop diversity from disasters and war.\n• Its permafrost location keeps seeds frozen even without power.',
    prompt: 'The student wants to emphasize why the vault’s location was chosen. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Svalbard Global Seed Vault stores over 1.2 million seed samples from nearly every country.',
      'Located in Norway’s Arctic permafrost, the Svalbard vault can keep seeds frozen even if it loses power.',
      'The Svalbard Global Seed Vault protects crop diversity from disasters and war.',
      'Nearly every country has sent seed samples to a vault in Norway.',
    ],
    answer: 1,
    explanation: {
      en: 'The goal is the reason for the location. Only B connects the place (Arctic permafrost) to a benefit (seeds stay frozen without power).',
      uz: 'Maqsad — joy tanlanish sababi. Faqat B joyni (Arktika abadiy muzligi) foyda bilan bog‘laydi (elektrsiz ham urug‘lar muzlagan holda qoladi).',
      ru: 'Цель — объяснить выбор места. Только B связывает место (арктическая мерзлота) с преимуществом (семена остаются замороженными без электричества).',
    },
  },
  {
    difficulty: 'easy',
    passage:
      'The first public library in the United States opened in 1833 in Peterborough, New Hampshire. ______ hundreds of towns had followed its example by the end of the century.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'Over the following decades,', 'On the other hand,', 'In other words,'],
    answer: 1,
    explanation: {
      en: 'The second sentence moves forward in time ("by the end of the century"). "Over the following decades" captures that time sequence; nothing is a direct consequence, contrast or restatement.',
      uz: 'Ikkinchi gap vaqt bo‘yicha oldinga siljiydi ("asr oxiriga kelib"). "Over the following decades" shu ketma-ketlikni ifodalaydi; bu na natija, na zidlik, na qayta ifodalash.',
      ru: 'Второе предложение продвигается во времени («к концу века»). «Over the following decades» передаёт эту последовательность; это не следствие, не контраст и не пересказ.',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'While researching a topic, a student has taken the following notes:\n• Hedy Lamarr was a film actress in the 1930s and 1940s.\n• In 1941 she co-invented a frequency-hopping system with composer George Antheil.\n• The system was designed to prevent enemies from jamming radio-guided torpedoes.\n• Similar techniques are used today in Wi-Fi and Bluetooth.',
    prompt: 'The student wants to present Lamarr’s invention to an audience unfamiliar with it, highlighting its modern relevance. Which choice most effectively uses relevant information from the notes?',
    choices: [
      'Hedy Lamarr, a 1930s film actress, worked with composer George Antheil.',
      'In 1941, Hedy Lamarr and George Antheil designed a system to stop enemies from jamming torpedoes.',
      'Actress Hedy Lamarr co-invented frequency hopping in 1941, a technique that now underlies Wi-Fi and Bluetooth.',
      'Frequency hopping is used in Wi-Fi and Bluetooth.',
    ],
    answer: 2,
    explanation: {
      en: 'The goal has two parts: introduce the invention (for an unfamiliar audience) and highlight modern relevance. Only C names the invention, its inventor and its use today.',
      uz: 'Maqsad ikki qismli: ixtironi tanishtirish va uning bugungi ahamiyatini ko‘rsatish. Faqat C ixtiro, ixtirochi va bugungi qo‘llanilishini birga keltiradi.',
      ru: 'У цели две части: представить изобретение незнакомой аудитории и подчеркнуть его актуальность. Только C называет изобретение, изобретателя и современное применение.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Octopuses can change the color and texture of their skin in milliseconds. ______ they lack the color-sensing cells that most animals use to perceive color, a puzzle that has led some biologists to suspect their skin itself may detect light.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Surprisingly,', 'As a result,', 'Likewise,', 'Specifically,'],
    answer: 0,
    explanation: {
      en: 'It is unexpected that an animal so skilled at color matching can’t perceive color in the usual way — the text even calls it "a puzzle." "Surprisingly" fits.',
      uz: 'Rangni shunchalik mohir moslaydigan hayvon rangni odatiy usulda ko‘ra olmasligi kutilmagan holat — matn uni hatto "jumboq" deb ataydi. "Surprisingly" mos keladi.',
      ru: 'Неожиданно, что животное, так ловко меняющее цвет, не различает цвета обычным способом, — текст даже называет это «загадкой». Подходит «Surprisingly».',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Composting food scraps reduces the methane released by landfills. ______ the finished compost enriches soil, reducing the need for chemical fertilizers.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Moreover,', 'Nonetheless,', 'For instance,', 'Conversely,'],
    answer: 0,
    explanation: {
      en: 'The second sentence adds another benefit of composting. "Moreover" adds a supporting point; "for instance" would require an example of the first benefit.',
      uz: 'Ikkinchi gap kompostlashning yana bir foydasini qo‘shadi. "Moreover" qo‘shimcha dalil kiritadi; "for instance" birinchi foydaga misol talab qilardi.',
      ru: 'Второе предложение добавляет ещё одну пользу компостирования. «Moreover» добавляет довод; «for instance» потребовал бы примера первой пользы.',
    },
  },
]

/** Items from the placement diagnostic — they seed the Mistake Bank */
const diagnostic: RW[] = [
  {
    difficulty: 'medium',
    passage:
      'The documentary’s director avoided narration entirely, choosing instead to let the fishermen describe their work in their own words. The result is a film that feels less like a lecture than a ______ conversation.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['scripted', 'candid', 'formal', 'hostile'],
    answer: 1,
    explanation: {
      en: 'Letting people speak in their own words, without narration, produces an open, unrehearsed feel — "candid." "Scripted" and "formal" contradict that.',
      uz: 'Odamlarga o‘z so‘zlari bilan gapirishga imkon berish samimiy, tayyorlanmagan ohang yaratadi — "candid". "Scripted" va "formal" bunga zid.',
      ru: 'Когда люди говорят своими словами без закадрового текста, возникает искренняя, неотрепетированная интонация — «candid». «Scripted» и «formal» этому противоречат.',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'Some historians portray the printing press as the sole cause of the spread of literacy in early modern Europe. Historian Elena Petrova disagrees, noting that literacy rose fastest in regions where schools were already expanding before printers arrived.',
    prompt: 'Which choice best describes how Petrova would most likely view the claim of "some historians"?',
    choices: [
      'As overlooking another factor that contributed to literacy',
      'As correct about the timing but wrong about the regions involved',
      'As proof that the printing press had no effect on literacy',
      'As irrelevant to the study of early modern Europe',
    ],
    answer: 0,
    explanation: {
      en: 'Petrova points to schools as an additional cause, challenging the word "sole." She doesn’t say printing had no effect — she says it wasn’t the only factor.',
      uz: 'Petrova qo‘shimcha sabab sifatida maktablarni ko‘rsatadi va "sole" (yagona) so‘ziga e’tiroz bildiradi. U bosmaxona ta’sir qilmagan demaydi — faqat yagona omil emas, deydi.',
      ru: 'Петрова указывает на школы как на дополнительную причину и оспаривает слово «sole» (единственная). Она не говорит, что печать не влияла, — лишь что это не единственный фактор.',
    },
  },
  {
    difficulty: 'medium',
    passage:
      'Solar panels generate the most electricity at midday, when household demand is often low. ______ many homeowners now pair their panels with batteries that store surplus power for the evening.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['For this reason,', 'In comparison,', 'Despite this,', 'Similarly,'],
    answer: 0,
    explanation: {
      en: 'The mismatch between production and demand is why people buy batteries — cause and effect, so "For this reason."',
      uz: 'Ishlab chiqarish va talab o‘rtasidagi nomuvofiqlik — batareya sotib olish sababi. Sabab-natija munosabati: "For this reason".',
      ru: 'Несовпадение выработки и потребления — причина покупки аккумуляторов. Причинно-следственная связь: «For this reason».',
    },
  },
  {
    difficulty: 'hard',
    passage:
      'While researching a topic, a student has taken the following notes:\n• The axolotl is a salamander native to lakes near Mexico City.\n• It can regrow limbs, parts of its heart, and even parts of its brain.\n• Scientists study it to understand tissue regeneration.\n• Wild populations have declined sharply due to urban growth.',
    prompt: 'The student wants to explain why scientists are interested in the axolotl. Which choice most effectively uses relevant information from the notes?',
    choices: [
      'The axolotl is a salamander native to lakes near Mexico City.',
      'Because it can regrow limbs and even parts of its brain, the axolotl helps scientists study tissue regeneration.',
      'Wild axolotl populations have declined sharply due to urban growth.',
      'The axolotl, found near Mexico City, is a type of salamander that scientists study.',
    ],
    answer: 1,
    explanation: {
      en: 'Only B gives the reason for scientific interest — its regenerative ability — and links it to what scientists study. D mentions study but not why.',
      uz: 'Faqat B ilmiy qiziqish sababini — regeneratsiya qobiliyatini — keltiradi va uni tadqiqot bilan bog‘laydi. D tadqiqotni eslatadi, lekin sababini aytmaydi.',
      ru: 'Только B называет причину интереса — способность к регенерации — и связывает её с исследованиями. D упоминает исследования, но не объясняет почему.',
    },
  },
]

const toQuestions = (prefix: string, domain: Question['domain'], items: RW[]): Question[] =>
  items.map((q, i) => ({ ...q, id: `${prefix}-q${i + 1}`, domain }))

export const craftQuestions = toQuestions('hw-wic', 'craft_structure', craft)
export const expressionQuestions = toQuestions('hw-trans', 'expression_ideas', expression)
export const diagnosticRwQuestions = [
  ...toQuestions('diag-rw-cs', 'craft_structure', diagnostic.slice(0, 2)),
  ...toQuestions('diag-rw-ei', 'expression_ideas', diagnostic.slice(2)),
]
