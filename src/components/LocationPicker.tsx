import { useState, useEffect } from 'react' // ★ useEffectを追加
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 画像をインポート
import pinImage from '../assets/pin_neko_360.png'

// カスタムアイコンを定義
const customIcon = L.icon({
  iconUrl: pinImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

type Props = {
  onConfirm: (lat: number, lng: number) => void
  onCancel: () => void
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng)
    },
  })
  return null
}

export function LocationPicker({ onConfirm, onCancel }: Props) {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  
  // ★追加: 中心座標のState（初期値は東京駅だが、ローディング中に上書きされる）
  const [center, setCenter] = useState<[number, number]>([35.6812, 139.7671])
  // ★追加: ローディング状態
  const [isLocating, setIsLocating] = useState(true)

  // ★追加: マウント時に現在地を取得
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // 成功したら中心座標を更新
        setCenter([pos.coords.latitude, pos.coords.longitude])
        setIsLocating(false)
      },
      (err) => {
        console.error("現在地取得失敗:", err)
        // 失敗しても地図は表示する（東京駅中心）
        setIsLocating(false)
      },
      { timeout: 5000 }
    )
  }, [])

  const handleConfirm = () => {
    if (position) {
      onConfirm(position.lat, position.lng)
    }
  }

  // ★追加: 取得中はローディング表示（白い画面で待機）
  if (isLocating) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>現在地を取得中...</div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 20000, background: 'white', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={center} // ★取得した center を使用
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapEvents onLocationSelect={setPosition} />

          {position && <Marker position={position} icon={customIcon} />}
        </MapContainer>
      </div>

      <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #ddd', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={onCancel}
          style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: '#fff' }}
        >
          キャンセル
        </button>
        <button 
          onClick={handleConfirm}
          disabled={!position}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            background: position ? '#0b76ef' : '#ccc', 
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          この場所で決定
        </button>
      </div>
    </div>
  )
}