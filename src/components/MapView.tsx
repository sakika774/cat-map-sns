import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import pinImage from '../assets/pin_neko_360.png'
import type { CatPost } from '../types/CatPost'

// カスタムアイコン定義（pin_neko_360.pngの縦横比を保つ）
const customIcon = L.icon({
  iconUrl: pinImage,
  iconSize: [40, 40], // 縦横比を保ったサイズ（360x360なので1:1）
  iconAnchor: [20, 40], // アイコンの下部を座標点に合わせる
  popupAnchor: [0, -40], // ポップアップ表示位置
})

/**
 * MapViewコンポーネント
 *
 * 役割:
 * - 地図表示
 * - CatPost[] をピンで表示
 * - ピン押下時に親コンポーネントへ通知
 * - マップ動時にモーダル位置を更新
 *
 * 注意:
 * - stateを持たない（純粋に表示専用）
 * - データの保存や更新は親に任せる
 */

type Props = {
  posts: CatPost[]
  onPinClick: (post: CatPost, screenPosition?: { x: number; y: number }) => void
  selectedPost?: CatPost | null
  onModalPositionUpdate?: (position: { x: number; y: number }) => void
}

function MapContent({ posts, onPinClick, selectedPost, onModalPositionUpdate }: Props) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPost || !onModalPositionUpdate) return

    const updatePosition = () => {
      const containerPoint = map.latLngToContainerPoint([selectedPost.lat, selectedPost.lng])
      onModalPositionUpdate({ x: containerPoint.x, y: containerPoint.y })
    }

    // マップのパン・ズーム・リサイズイベントをリッスン
    map.on('move', updatePosition)
    map.on('zoom', updatePosition)
    map.on('resize', updatePosition)
    updatePosition() // 初期位置合わせ

    return () => {
      map.off('move', updatePosition)
      map.off('zoom', updatePosition)
      map.off('resize', updatePosition)
    }
  }, [map, selectedPost, onModalPositionUpdate])

  useEffect(() => {
    if (selectedPost) {
      const targetZoom = 15
      const offsetLat = 0.005

      map.flyTo(
        [selectedPost.lat + offsetLat, selectedPost.lng], // offsetLatを足す
        targetZoom, // ここに targetZoom を入れる
        {
          animate: true,
          duration: 1.5
        }
      )
    }
  }, [map, selectedPost])

  return (
    <>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {posts.map((post) => (
        <Marker
          key={post.id}
          position={[post.lat, post.lng]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              const containerPoint = map.latLngToContainerPoint([post.lat, post.lng])
              onPinClick(post, { x: containerPoint.x, y: containerPoint.y })
            },
          }}
        />
      ))}
    </>
  )
}

export function MapView({ posts, onPinClick, selectedPost, onModalPositionUpdate }: Props) {
  // ★1. 中心座標とローディング状態の管理
  const [initialCenter, setInitialCenter] = useState<[number, number]>([35.6812, 139.7671]) // デフォルト: 東京駅
  const [isLocating, setIsLocating] = useState(true)

  // ★2. マウント時に一度だけ現在地を取得
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported")
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 成功したらその位置を中心にする
        setInitialCenter([position.coords.latitude, position.coords.longitude])
        setIsLocating(false)
      },
      (error) => {
        console.error("現在地取得失敗:", error)
        // 失敗してもデフォルト位置（東京）で表示するためにローディングを終わらせる
        setIsLocating(false)
      },
      { timeout: 5000 } // 5秒待ってダメなら諦める
    )
  }, [])

  // ★3. 取得中はローディング画面を出す（これがないと東京駅が一瞬映ってしまう）
  if (isLocating) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <p>現在地を取得中...</p>
      </div>
    )
  }

  // ★4. 取得完了後にマップを描画
  return (
    <MapContainer
      center={initialCenter} // ★取得した現在地をセット
      zoom={15} // ★現在地なら少しズームしたほうが見やすい
      style={{ height: '100vh', width: '100vw' }}
    >
      <MapContent 
        posts={posts} 
        onPinClick={onPinClick} 
        selectedPost={selectedPost} 
        onModalPositionUpdate={onModalPositionUpdate} 
      />
    </MapContainer>
  )
}