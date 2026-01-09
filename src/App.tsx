import { useState } from 'react'
import { dummyPosts } from './data/dummyPosts'
import type { CatPost } from './types/CatPost'

import { MapView } from './components/MapView'
import { DetailModal } from './components/DetailModal'
import { PostModal } from './components/PostModal'

export default function App() {
  /**
   * 投稿一覧（最初はダミーデータ）
   * → PostModal から追加される
   */
  const [posts, setPosts] = useState<CatPost[]>(dummyPosts)

  /**
   * 選択中の投稿（ピンクリックで入る）
   */
  const [selectedPost, setSelectedPost] = useState<CatPost | null>(null)

  /**
   * 投稿モーダルの開閉
   */
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  /**
   * 新しい投稿を追加（ローカルのみ）
   */
  const handleSubmitPost = (post: CatPost) => {
    console.log('🆕 [App] new post submitted:', post)
    console.log('🆕 [App] posts before:', posts.length)

    setPosts(prev => {
      const next = [...prev, post]
      console.log('🆕 [App] posts after:', next.length)
      return next
    })

    setIsPostModalOpen(false)
  }

  return (
    <>
      {/* マップ表示 */}
      <MapView
        posts={posts}
        onPinClick={(post) => {
          console.log('📍 [App] pin clicked:', post)
          setSelectedPost(post)
        }}
      />

      {/* 投稿詳細モーダル */}
      {selectedPost && (
        <>
          {console.log('🪟 [App] open DetailModal:', selectedPost)}
          <DetailModal
            post={selectedPost}
            onClose={() => {
              console.log('❌ [App] close DetailModal')
              setSelectedPost(null)
            }}
          />
        </>
      )}

      {/* 投稿モーダル */}
      {isPostModalOpen && (
        <>
          {console.log('🪟 [App] open PostModal')}
          <PostModal
            onSubmit={handleSubmitPost}
            onClose={() => {
              console.log('❌ [App] close PostModal')
              setIsPostModalOpen(false)
            }}
          />
        </>
      )}

      {/* 仮の投稿ボタン（デザイン後回し） */}
      <button
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => {
          console.log('➕ [App] open PostModal button clicked')
          setIsPostModalOpen(true)
        }}
      >
        ＋ 投稿
      </button>
    </>
  )
}