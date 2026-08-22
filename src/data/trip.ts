/**
 * 旅行データの型と、2026年8月30日〜31日の旅程。
 * 画面側に旅程をハードコードせず、別旅行へ差し替えられる境界として扱う。
 */
export type StopKind = 'start' | 'event' | 'sightseeing' | 'meal' | 'transfer' | 'finish'

export type MapLinks = {
  view: string
  route: string
}

export type TripStop = {
  id: string
  time: string
  title: string
  place?: string
  description: string
  transport?: string
  kind: StopKind
  flexible?: boolean
  map?: MapLinks
  note?: string
}

export type TripDay = {
  id: string
  date: string
  dayOfWeek: string
  theme: string
  intro: string
  routeLabel: string
  stops: TripStop[]
}

export type Trip = {
  title: string
  dateRange: string
  days: TripDay[]
}

const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

const mapsDirectionsUrl = (destination: string, origin?: string) => {
  const params = new URLSearchParams({
    api: '1',
    destination,
    travelmode: 'transit',
  })

  if (origin) params.set('origin', origin)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

const mapLinks = (place: string, origin?: string): MapLinks => ({
  view: mapsSearchUrl(place),
  route: mapsDirectionsUrl(place, origin),
})

export const trip: Trip = {
  title: '神奈川旅行',
  dateRange: '2026/8/30〜8/31',
  days: [
    {
      id: '2026-08-30',
      date: '8月30日',
      dayOfWeek: '日',
      theme: '舞台 ＋ 横浜観光',
      intro: '舞台を楽しんだあと、横浜の海沿いを歩いて中華街へ向かいます。',
      routeLabel: '川崎駅 → すくらむ21 → 横浜 → 川崎駅',
      stops: [
        {
          id: 'kawasaki-start',
          time: '10:15頃',
          title: '川崎駅を出発',
          place: '川崎駅',
          description: 'JR南武線などを利用して、武蔵溝ノ口・溝の口方面へ向かいます。',
          transport: '電車で移動',
          kind: 'start',
          map: mapLinks('川崎駅'),
        },
        {
          id: 'scrum21',
          time: '11:15頃',
          title: 'すくらむ21',
          place: '川崎市男女共同参画センター',
          description: '市民ミュージカルの会場に到着する目安です。',
          transport: '溝の口駅から徒歩',
          kind: 'event',
          map: mapLinks('すくらむ21 川崎市男女共同参画センター', '川崎駅'),
        },
        {
          id: 'musical',
          time: '12:00',
          title: '市民ミュージカル開演',
          place: 'すくらむ21',
          description: '家族の出演する舞台を観ます。',
          transport: '会場内',
          kind: 'event',
          map: mapLinks('すくらむ21 川崎市男女共同参画センター'),
          note: '終演時間は決めません。終演後に次の予定へ進みます。',
        },
        {
          id: 'yokohama-transfer',
          time: '終演後',
          title: '横浜方面へ移動',
          description: '舞台が終わったら、横浜駅方面へ向かいます。',
          transport: '電車で横浜方面へ',
          kind: 'transfer',
          flexible: true,
          note: '舞台の終演時間に合わせて、ここからの時刻は柔軟に動きます。',
          map: mapLinks('横浜駅', 'すくらむ21 川崎市男女共同参画センター'),
        },
        {
          id: 'red-brick',
          time: '午後',
          title: '横浜赤レンガ倉庫',
          place: 'みなとみらい・新港エリア',
          description: '海沿いの景色を楽しみながら、横浜観光をスタートします。',
          transport: '徒歩で次の場所へ',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('横浜赤レンガ倉庫', '横浜駅'),
        },
        {
          id: 'yamashita-park',
          time: '午後',
          title: '山下公園',
          place: '横浜港・山下公園',
          description: '赤レンガ倉庫から海沿いを歩いて向かいます。',
          transport: '海沿いを徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('山下公園 横浜', '横浜赤レンガ倉庫'),
        },
        {
          id: 'china-town',
          time: '夕方〜夜',
          title: '横浜中華街',
          place: '横浜中華街',
          description: '山下公園から歩いて中華街へ。周辺で夕食をとります。',
          transport: '徒歩で移動・夕食',
          kind: 'meal',
          flexible: true,
          map: mapLinks('横浜中華街', '山下公園 横浜'),
        },
        {
          id: 'kawasaki-return',
          time: '夜',
          title: '川崎駅へ戻る',
          description: '夕食後、電車で川崎駅へ戻ります。',
          transport: '電車で帰る',
          kind: 'finish',
          flexible: true,
          map: mapLinks('川崎駅', '横浜中華街'),
        },
      ],
    },
    {
      id: '2026-08-31',
      date: '8月31日',
      dayOfWeek: '月',
      theme: '鎌倉観光 ＋ 東京駅へ',
      intro: '鎌倉を歩いて観光し、帰りは川崎駅へ戻らず東京駅へ向かいます。',
      routeLabel: '川崎駅 → 鎌倉 → 長谷 → 東京駅',
      stops: [
        {
          id: 'kawasaki-start-day2',
          time: '9:00頃',
          title: '川崎駅を出発',
          place: '川崎駅',
          description: '鎌倉へ向けて出発します。',
          transport: '電車で移動',
          kind: 'start',
          map: mapLinks('川崎駅'),
        },
        {
          id: 'kamakura-station',
          time: '10:00頃',
          title: '鎌倉駅',
          place: '鎌倉駅',
          description: '駅を起点に、午前中は小町通りと鶴岡八幡宮を歩きます。',
          transport: '徒歩で観光',
          kind: 'transfer',
          map: mapLinks('鎌倉駅', '川崎駅'),
        },
        {
          id: 'komachi-dori',
          time: '午前',
          title: '小町通り',
          place: '鎌倉 小町通り',
          description: 'お店を見ながら、鶴岡八幡宮方面へ歩きます。',
          transport: '徒歩',
          kind: 'sightseeing',
          map: mapLinks('小町通り 鎌倉', '鎌倉駅'),
        },
        {
          id: 'tsurugaoka-hachimangu',
          time: '午前',
          title: '鶴岡八幡宮',
          place: '鶴岡八幡宮',
          description: '境内をゆっくり参拝します。',
          transport: '小町通りから徒歩',
          kind: 'sightseeing',
          map: mapLinks('鶴岡八幡宮', '小町通り 鎌倉'),
        },
        {
          id: 'kamakura-lunch',
          time: '12:00頃',
          title: '鎌倉駅周辺で昼食',
          description: '午後の観光に備えて、鎌倉駅周辺で昼食をとります。',
          transport: '徒歩で戻る',
          kind: 'meal',
          map: mapLinks('鎌倉駅', '鶴岡八幡宮'),
        },
        {
          id: 'enoden-to-hase',
          time: '午後',
          title: '江ノ電で長谷駅へ',
          place: '長谷駅',
          description: '鎌倉駅から江ノ電に乗り、長谷方面へ向かいます。',
          transport: '江ノ電',
          kind: 'transfer',
          flexible: true,
          map: mapLinks('長谷駅（神奈川県）', '鎌倉駅'),
        },
        {
          id: 'hasedera',
          time: '午後',
          title: '長谷寺',
          place: '長谷寺',
          description: '長谷駅から歩いて向かい、境内を見学します。',
          transport: '長谷駅から徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('長谷寺 鎌倉', '長谷駅（神奈川県）'),
        },
        {
          id: 'kotoku-in',
          time: '午後',
          title: '鎌倉大仏（高徳院）',
          place: '高徳院 鎌倉大仏',
          description: '長谷寺から歩いて鎌倉大仏へ向かいます。',
          transport: '徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('高徳院 鎌倉大仏', '長谷寺 鎌倉'),
        },
        {
          id: 'tokyo-station',
          time: '観光終了後',
          title: '東京駅へ向かう',
          place: '東京駅',
          description: '鎌倉観光が終わったら、そのまま東京駅へ向かいます。',
          transport: '電車で移動',
          kind: 'finish',
          flexible: true,
          note: '川崎駅には戻りません。帰りの新幹線時刻は未定のため、東京駅への出発時刻は固定しません。',
          map: mapLinks('東京駅', '高徳院 鎌倉大仏'),
        },
      ],
    },
  ],
}
