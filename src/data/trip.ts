/**
 * 旅行データの型と、2026年8月30日〜31日の旅程。
 * 画面側に旅程をハードコードせず、別旅行へ差し替えられる境界として扱う。
 */
export type StopKind = 'preparation' | 'start' | 'event' | 'sightseeing' | 'meal' | 'transfer' | 'finish'

export type StopEmphasis = 'important' | 'critical'

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
  emphasis?: StopEmphasis
  badge?: string
  map?: MapLinks
  note?: string
  officialUrl?: string
}

export type TripDay = {
  id: string
  date: string
  dayOfWeek: string
  theme: string
  intro: string
  routeLabel: string
  preparations?: TripStop[]
  stops: TripStop[]
  optionalStops?: TripStop[]
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
      routeLabel: '東京駅 → 川崎のホテル → すくらむ21 → 赤レンガ → 山下公園 → 中華街 → 川崎',
      preparations: [
        {
          id: 'kitakami-arrival-and-hotel',
          time: '東京到着後',
          title: 'まず川崎のホテルへ',
          place: '川崎駅周辺の宿泊ホテル',
          description: '北上から東京駅に着いたら、観光へは向かわず川崎へ直行します。チェックイン前なら、ホテルに荷物だけ預けます。',
          transport: '東京駅からJR東海道線などで川崎駅へ',
          kind: 'preparation',
          flexible: true,
          emphasis: 'important',
          badge: '先に荷物を軽くする',
          map: mapLinks('川崎駅', '東京駅'),
          note: '10:15に川崎駅を出られる新幹線を選びます。ホテル名と東京駅の到着時刻が決まったら、荷物預けを含めて間に合うか最終確認します。',
        },
      ],
      stops: [
        {
          id: 'kawasaki-start',
          time: '10:15頃',
          title: '川崎駅を出発',
          place: '川崎駅',
          description: 'JR南武線などを利用して、武蔵溝ノ口・溝の口方面へ向かいます。',
          transport: 'JR南武線で武蔵溝ノ口駅へ',
          kind: 'start',
          map: mapLinks('武蔵溝ノ口駅', '川崎駅'),
        },
        {
          id: 'scrum21',
          time: '11:15頃',
          title: 'すくらむ21',
          place: '川崎市男女共同参画センター',
          description: '市民ミュージカルの会場に到着する目安です。',
          transport: 'JR武蔵溝ノ口駅北口／東急溝の口駅東口から徒歩約10分',
          kind: 'event',
          map: mapLinks('すくらむ21 川崎市男女共同参画センター', '川崎駅'),
          officialUrl: 'https://www.scrum21.or.jp/facility/access',
        },
        {
          id: 'musical',
          time: '12:00',
          title: '市民ミュージカル開演',
          place: 'すくらむ21',
          description: '家族の出演する舞台を観ます。',
          transport: '会場内',
          kind: 'event',
          emphasis: 'critical',
          badge: '最優先・12:00開演',
          map: mapLinks('すくらむ21 川崎市男女共同参画センター'),
          note: '終演時間は決めません。終演後に次の予定へ進みます。',
          officialUrl: 'https://www.scrum21.or.jp/facility/access',
        },
        {
          id: 'yokohama-transfer',
          time: '終演後',
          title: '赤レンガ倉庫へ移動',
          description: '舞台が終わったら、横浜観光の最初の目的地へ向かいます。',
          transport: '武蔵溝ノ口から武蔵小杉で乗り換え、みなとみらい線の馬車道駅方面へ',
          kind: 'transfer',
          flexible: true,
          note: '舞台の終演時間に合わせて、ここからの時刻は柔軟に動きます。',
          map: mapLinks('横浜赤レンガ倉庫', 'すくらむ21 川崎市男女共同参画センター'),
        },
        {
          id: 'red-brick',
          time: '午後',
          title: '横浜赤レンガ倉庫',
          place: 'みなとみらい・新港エリア',
          description: 'マストの立ち寄り先です。海沿いの景色と、最終日を迎える夏イベントを楽しみます。',
          transport: '徒歩で次の場所へ',
          kind: 'sightseeing',
          flexible: true,
          emphasis: 'important',
          badge: '必ず行く',
          map: mapLinks('横浜赤レンガ倉庫', 'すくらむ21 川崎市男女共同参画センター'),
          note: '8/30は「Red Brick Sunset 2026」最終日。11:00〜22:00、入場無料です。混雑や暑さが強ければ滞在を短くします。',
          officialUrl: 'https://www.yokohama-akarenga.jp/event/redbrick-summer/',
        },
        {
          id: 'yamashita-park',
          time: '午後',
          title: '山下公園',
          place: '横浜港・山下公園',
          description: '赤レンガ倉庫から海沿いを歩いて向かいます。',
          transport: '象の鼻パークを通る海沿いルートを徒歩。暑さ・疲れが強ければバスかタクシー',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('山下公園 横浜', '横浜赤レンガ倉庫'),
        },
        {
          id: 'china-town',
          time: '夕方〜夜',
          title: '横浜中華街',
          place: '横浜中華街',
          description: '山下公園から歩いて中華街へ。塩分を控えめにできる、落ち着いた店を選んで夕食をとります。',
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
          transport: 'JR石川町駅から京浜東北・根岸線で川崎方面へ',
          kind: 'finish',
          flexible: true,
          map: mapLinks('川崎駅', '横浜中華街'),
        },
      ],
      optionalStops: [
        {
          id: 'osambashi-option',
          time: '30分〜',
          title: '横浜港大さん橋',
          place: '大さん橋国際客船ターミナル',
          description: '海を見ながらひと休みできます。赤レンガ倉庫から山下公園へ向かう途中に寄れる候補です。',
          transport: '赤レンガ倉庫から海沿いを徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('横浜港大さん橋国際客船ターミナル', '横浜赤レンガ倉庫'),
          note: '海を見たいときにおすすめです。',
        },
        {
          id: 'marine-and-walk-option',
          time: '30分〜',
          title: 'MARINE & WALK YOKOHAMA',
          place: '赤レンガ倉庫の隣',
          description: 'お店を見たり、カフェでひと休みしたりできます。',
          transport: '横浜赤レンガ倉庫から徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('MARINE & WALK YOKOHAMA', '横浜赤レンガ倉庫'),
          note: '買い物や休憩をしたいときにおすすめです。',
        },
        {
          id: 'hikawamaru-option',
          time: '45分〜',
          title: '日本郵船氷川丸',
          place: '山下公園内',
          description: '山下公園にある船を見学できます。街歩きとは違う楽しみ方ができる候補です。',
          transport: '山下公園内を徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('日本郵船氷川丸 横浜', '山下公園 横浜'),
          note: '開館日・営業時間・料金は当日に確認します。',
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
      preparations: [
        {
          id: 'checkout-and-luggage',
          time: 'ホテル出発前',
          title: 'チェックアウトと荷物確認',
          place: '川崎駅周辺の宿泊ホテル',
          description: 'この日は川崎へ戻りません。荷物を持ってホテルを出て、大きな荷物は鎌倉駅のロッカーなどに預けます。',
          transport: 'ホテルから川崎駅へ徒歩',
          kind: 'preparation',
          emphasis: 'important',
          badge: '川崎には戻らない',
          note: 'ロッカーが満室の場合に備え、ホテルからの配送が使えるか前日に確認できると安心です。',
          map: mapLinks('川崎駅'),
        },
      ],
      stops: [
        {
          id: 'kawasaki-start-day2',
          time: '9:00頃',
          title: '川崎駅を出発',
          place: '川崎駅',
          description: '鎌倉へ向けて出発します。',
          transport: 'JR東海道線で大船方面へ進み、JR横須賀線に乗り換えて鎌倉駅へ',
          kind: 'start',
          map: mapLinks('川崎駅'),
        },
        {
          id: 'kamakura-station',
          time: '10:00頃',
          title: '鎌倉駅',
          place: '鎌倉駅',
          description: '大きな荷物を駅のロッカーなどに預けてから、小町通りと鶴岡八幡宮を歩きます。',
          transport: '荷物を預けたら東口から徒歩で観光',
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
          note: '境内は6:00〜20:00。月曜休館の鶴岡ミュージアムは本線に入れません。',
          officialUrl: 'https://www.hachimangu.or.jp/access/',
        },
        {
          id: 'kamakura-lunch',
          time: '12:00頃',
          title: '鎌倉駅周辺で昼食',
          description: '午後の観光に備え、座って休める落ち着いた店で昼食をとります。注文時に塩分控えめを相談します。',
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
          description: '長谷駅から歩いて向かい、境内を見学します。受付終了が早いため先に向かいます。',
          transport: '長谷駅から徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('長谷寺 鎌倉', '長谷駅（神奈川県）'),
          note: '通常期間は8:00〜16:30受付、17:00閉山。拝観料は大人400円です。',
          officialUrl: 'https://www.hasedera.jp/guide/',
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
          note: '4〜9月は8:00〜17:30、入場は17:15まで。拝観料は一般300円です。',
          officialUrl: 'https://kotoku-in.jp/',
        },
        {
          id: 'tokyo-station',
          time: '観光終了後',
          title: '東京駅へ向かう',
          place: '東京駅',
          description: '長谷駅から鎌倉駅へ戻り、預けた荷物を回収してから東京駅へ向かいます。',
          transport: '江ノ電で鎌倉駅へ戻り、JR横須賀線で東京駅へ',
          kind: 'finish',
          flexible: true,
          emphasis: 'critical',
          badge: '19:00前に東京駅',
          note: '川崎駅には戻りません。帰りの新幹線時刻が決まったら、余裕を持って到着できるよう観光の終了時刻を逆算します。',
          map: mapLinks('東京駅', '高徳院 鎌倉大仏'),
        },
      ],
      optionalStops: [
        {
          id: 'goryo-jinja-option',
          time: '20分〜',
          title: '御霊神社',
          place: '長谷駅周辺',
          description: '江ノ電の踏切そばにある神社です。長谷寺・鎌倉大仏とあわせて、短時間で立ち寄れます。',
          transport: '長谷駅から徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('御霊神社 鎌倉', '長谷駅（神奈川県）'),
          note: '歴史のある場所に寄りたいときにおすすめです。',
        },
        {
          id: 'yuigahama-option',
          time: '30分〜',
          title: '由比ヶ浜',
          place: '由比ヶ浜海岸',
          description: '海を見ながら休憩できます。長谷駅から歩いて立ち寄れる候補です。',
          transport: '長谷駅から徒歩',
          kind: 'sightseeing',
          flexible: true,
          map: mapLinks('由比ヶ浜海岸', '長谷駅（神奈川県）'),
          note: '夏は暑さに注意し、無理のない範囲で立ち寄ります。',
        },
      ],
    },
  ],
}
