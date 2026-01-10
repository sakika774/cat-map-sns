// src/components/DetailModal.tsx
import type { CatPost } from '../types/CatPost'
import { formatDate } from '../lib/formatDate'
import './DetailModal.css'

/**
 * DetailModalコンポーネント
 *
 * 役割:
 * - 選択中の CatPost 詳細表示
 * - 編集や削除などの操作は持たない
 */


type DetailModalProps = {
  post: CatPost
  onClose: () => void
  position?: { x: number; y: number }
}

export function DetailModal({ post, onClose, position }: DetailModalProps) {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // オーバーレイ背景クリックで閉じる
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className={`modal-overlay ${position ? '' : 'with-background'}`}
      onClick={handleBackgroundClick}
    >
      <div 
        className="modal"
        style={position ? {
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -100%)',
          marginTop: '-45px',
        } : {
          position: 'relative',
        }}
      >
        <button className="modal-close" onClick={onClose} aria-label="モーダルを閉じる">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 3L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal-image-container">
          <img src={post.imageUrl} alt="猫の写真" className="modal-image" />
        </div>

        <div className="modal-content">
          <p className="modal-comment">{post.comment}</p>

          <div className="modal-divider"></div>

          {post.createdAt && (
            <small className="modal-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="modal-date-icon">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {formatDate(post.createdAt)}
            </small>
          )}
        </div>
      </div>
    </div>
  )
}