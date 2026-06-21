export const STITCH_PROJECT_ID = '9227577490891885848'

export const STITCH_SCREENS = {
  studentDashboard: { id: '4689f693a36d45b48b48e865a2f80d95', title: 'Trang chủ Học sinh - Tổng quan (Branded)' },
  learningCenter: { id: '69ba35da69aa4f3c870c6377d98ccc32', title: 'Trung tâm Học tập & Kiểm tra (Branded)' },
  achievements: { id: '8dd779238bc54666901fd5b0193a2439', title: 'Thành tích & Huy hiệu (Synchronized)' },
  parentDashboard: { id: '7dd539bbffda4bd5a6dea406bb3ec4b6', title: 'Dashboard Phụ huynh - Gamified' },
  questionBank: { id: '4c7a671773934d839b53a4df457e7dae', title: 'Ngân hàng Câu hỏi' },
}

export function stitchScreenUrl(screenKey) {
  const screen = STITCH_SCREENS[screenKey]
  if (!screen) return null
  return `https://stitch.withgoogle.com/projects/${STITCH_PROJECT_ID}/screens/${screen.id}`
}
