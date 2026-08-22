/**
 * Google Mapsの場所検索・経路検索リンクを共通表示するコンポーネント。
 * APIは使わず、旅程データに定義された通常URLだけを新しいタブで開く。
 */
import { Icon } from './Icon'
import type { MapLinks } from '../data/trip'

type MapButtonsProps = {
  map: MapLinks
}

export function MapButtons({ map }: MapButtonsProps) {
  return (
    <div className="map-actions">
      <a className="map-button map-button-primary" href={map.view} target="_blank" rel="noopener noreferrer">
        <Icon name="map" />
        地図を見る
        <Icon name="external" />
      </a>
      <a className="map-button map-button-secondary" href={map.route} target="_blank" rel="noopener noreferrer">
        <Icon name="navigation" />
        ここまでの経路
      </a>
    </div>
  )
}
