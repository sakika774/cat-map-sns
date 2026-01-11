/**
 * 時間帯を取得する関数
 * 0-3: 夜、4-9: 朝、10-14: 昼、15-17: 夕、18-23: 夜
 */
function getTimeOfDay(hour: number): string {
  if (hour >= 0 && hour < 4) return '夜'
  if (hour >= 4 && hour < 10) return '朝'
  if (hour >= 10 && hour < 15) return '昼'
  if (hour >= 15 && hour < 18) return '夕'
  return '夜' // 18-23
}

/**
 * 日付をフォーマットする関数
 * - 7日以内: "○日前 時間帯"
 * - 7日以上: "○年○月○日 時間帯"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  // 日本時間（JST）で日付のみを比較
  const dateYear = date.getFullYear()
  const dateMonth = date.getMonth()
  const dateDate = date.getDate()
  
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDate = now.getDate()

  // 日数差を計算
  const dateStart = new Date(dateYear, dateMonth, dateDate, 0, 0, 0, 0)
  const nowStart = new Date(nowYear, nowMonth, nowDate, 0, 0, 0, 0)

  const diffTime = nowStart.getTime() - dateStart.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // 時間帯を取得（日本時間を使用）
  const hour = date.getHours()
  const timeOfDay = getTimeOfDay(hour)

  // 7日以内の場合は「○日前 時間帯」
  if (diffDays < 7) {
    let dateLabel = ''
    if (diffDays === 0) {
      dateLabel = '今日'
    } else if (diffDays === 1) {
      dateLabel = '昨日'
    } else {
      dateLabel = `${diffDays}日前`
    }
    return `${dateLabel} ${timeOfDay}`
  }

  // 7日以上の場合は「○年○月○日 時間帯」
  const year = dateYear
  const month = String(dateMonth + 1).padStart(2, '0')
  const day = String(dateDate).padStart(2, '0')

  return `${year}年${month}月${day}日 ${timeOfDay}`
}
