/** Client-side API for parent flows */

export async function getChildProgress() {
  const res = await fetch('/api/dashboard', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load parent dashboard')
  return res.json()
}

export async function getNotifications(profileId) {
  const data = await getChildProgress()
  const profile = data.profiles?.find(p => p.id === profileId) || data.profiles?.[0]
  if (!profile) return []

  const notifications = []
  const stats = profile.activityStats || {}

  if (stats.attempts?.length) {
    const latest = stats.attempts[0]
    notifications.push({
      id: `attempt-${latest.id}`,
      type: 'activity',
      title: `${profile.name} vừa hoàn thành: ${latest.title}`,
      body: `Điểm ${latest.scorePct}% · +${latest.xp} XP`,
      at: latest.createdAt,
    })
  }

  if (stats.badges?.length) {
    stats.badges.slice(0, 3).forEach(badge => {
      notifications.push({
        id: `badge-${badge.id}`,
        type: 'badge',
        title: `${profile.name} đạt huy hiệu mới`,
        body: badge.name,
        at: badge.unlockedAt,
      })
    })
  }

  if (stats.weakSkills?.length) {
    notifications.push({
      id: `weak-${stats.weakSkills[0].skill}`,
      type: 'alert',
      title: 'Cần hỗ trợ thêm',
      body: `Kỹ năng yếu: ${stats.weakSkills[0].skill}`,
      at: new Date().toISOString(),
    })
  }

  if (profile.progress?.streak >= 3) {
    notifications.push({
      id: 'streak',
      type: 'success',
      title: 'Chuỗi học tập tốt',
      body: `${profile.name} đã học liên tiếp ${profile.progress.streak} ngày`,
      at: new Date().toISOString(),
    })
  }

  return notifications
}

export async function getParentSettings() {
  const res = await fetch('/api/auth/me', { cache: 'no-store' })
  if (!res.ok) return { email: localStorage.getItem('parentEmail') || '' }
  return res.json()
}
