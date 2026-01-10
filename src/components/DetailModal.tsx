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
}

export function DetailModal({ post, onClose }: DetailModalProps) {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // オーバーレイ背景クリックで閉じる
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackgroundClick}>
      <div className="modal">
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

          {post.createdAt && (
            <small className="modal-date">{formatDate(post.createdAt)}</small>
          )}
        </div>
      </div>
    </div>
  )
}