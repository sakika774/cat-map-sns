import './PostButton.css'

type Props = {
  onClick: () => void
}

export function PostButton({ onClick }: Props) {
  return (
    <button className="fab-btn" onClick={onClick} aria-label="投稿する">
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* 全体を動かすグループ (<g>)
           translate(横位置, 縦位置) で調整してください！
           例: translate(0, 1) なら「真ん中で、ちょっと下」になります。
        */}
        <g transform="translate(0, 1)">
          {/* 4つの指 (指を広げたいときは cx をいじってください) */}
          <circle cx="3.0" cy="8.5" r="3.0" />
          <circle cx="8.5" cy="4.5" r="3.0" />
          <circle cx="15.0" cy="4.5" r="3.0" />
          <circle cx="20.5" cy="8.5" r="3.0" />
          
          {/* 真ん中の大きな肉球 */}
          <ellipse cx="12" cy="14.5" rx="7.5" ry="5.5" />
        </g>
      </svg>
    </button>
  )
}