'use client'
import { useState, useEffect } from 'react'
import styles from './page.module.css'

const GRADES_MAP = {
  'lop-1': 'Lớp 1', 'lop-2': 'Lớp 2', 'lop-3': 'Lớp 3', 'lop-4': 'Lớp 4', 'lop-5': 'Lớp 5'
}
const GRADE_TO_SLUG = {
  'Lớp 1': 'lop-1', 'Lớp 2': 'lop-2', 'Lớp 3': 'lop-3', 'Lớp 4': 'lop-4', 'Lớp 5': 'lop-5'
}
const NEXT_GRADE = {
  'Lớp 1': 'Lớp 2', 'Lớp 2': 'Lớp 3', 'Lớp 3': 'Lớp 4', 'Lớp 4': 'Lớp 5', 'Lớp 5': null
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Overview
  const [stats, setStats] = useState({
    totalParents: 0, totalStudents: 0, totalCustomQuestions: 0,
    totalStars: 0, avgStreak: 0, gradeDistribution: [], topStudents: []
  })

  // Students
  const [students, setStudents] = useState([])
  const [studentSearch, setStudentSearch] = useState('')
  const [studentGradeFilter, setStudentGradeFilter] = useState('all')
  const [editingStudent, setEditingStudent] = useState(null)
  const [viewingStudent, setViewingStudent] = useState(null)

  // Parents
  const [parents, setParents] = useState([])
  const [parentSearch, setParentSearch] = useState('')
  const [viewingParent, setViewingParent] = useState(null)

  // Questions
  const [selectedGrade, setSelectedGrade] = useState('lop-1')
  const [selectedWorld, setSelectedWorld] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [questions, setQuestions] = useState({ staticQuestions: [], customQuestions: [] })
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [newQuestionModal, setNewQuestionModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    type: 'choose', q: '', optionA: '', optionB: '', correct: 0, emoji: '❓', subject: 'Toán', topic: 'Chung'
  })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(res => { if (res.ok) setAuthenticated(true) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!authenticated) return
    if (activeTab === 'overview') loadStats()
    else if (activeTab === 'students') loadStudents()
    else if (activeTab === 'parents') loadParents()
    else if (activeTab === 'questions') loadQuestions()
  }, [authenticated, activeTab, selectedGrade, selectedWorld, selectedLevel])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) { setAuthenticated(true) }
      else { setLoginError(data.error || 'Tài khoản hoặc mật khẩu không đúng') }
    } catch { setLoginError('Lỗi kết nối máy chủ') }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
    setEmail('')
    setPassword('')
  }

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data && !data.error) setStats(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      const data = await res.json()
      if (Array.isArray(data)) setStudents(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadParents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/parents')
      const data = await res.json()
      if (Array.isArray(data)) setParents(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/questions?grade=${selectedGrade}&world=${selectedWorld}&level=${selectedLevel}`)
      const data = await res.json()
      if (data && !data.error) setQuestions(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  // Student Actions
  const handleEditStudentSave = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editingStudent.name,
          grade: editingStudent.grade,
          stars: editingStudent.progress?.stars || 0,
          streak: editingStudent.progress?.streak || 0
        })
      })
      if (res.ok) {
        setEditingStudent(null)
        loadStudents()
        showToast('Đã cập nhật thông tin học sinh ✅')
      } else { showToast('Cập nhật thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleDeleteStudent = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa học sinh "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' })
      if (res.ok) { loadStudents(); showToast(`Đã xóa hồ sơ "${name}"`) }
      else { showToast('Xóa thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handlePromoteStudent = async (student) => {
    const next = NEXT_GRADE[student.grade]
    if (!next) { showToast(`${student.name} đã học đến Lớp 5 rồi!`, 'info'); return }
    if (!confirm(`Lên lớp "${student.name}" từ ${student.grade} → ${next}?`)) return
    try {
      const res = await fetch('/api/profile/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: student.id })
      })
      if (res.ok) { loadStudents(); showToast(`🎉 Đã lên lớp ${student.name} lên ${next}!`) }
      else { showToast('Lên lớp thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleResetProgress = async (student) => {
    if (!confirm(`Reset toàn bộ tiến trình học của "${student.name}"? Hành động không thể hoàn tác.`)) return
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: student.id, name: student.name, grade: student.grade, stars: 0, streak: 0, resetProgress: true })
      })
      if (res.ok) { loadStudents(); showToast(`Đã reset tiến trình của ${student.name}`) }
      else { showToast('Reset thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  // Parent Actions
  const handleDeleteParent = async (id, emailP) => {
    if (!confirm(`Xóa tài khoản phụ huynh "${emailP}"? Tất cả học sinh liên quan cũng bị xóa.`)) return
    try {
      const res = await fetch(`/api/admin/parents?id=${id}`, { method: 'DELETE' })
      if (res.ok) { loadParents(); showToast('Đã xóa tài khoản phụ huynh') }
      else { showToast('Xóa thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  // Question Actions
  const handleAddQuestion = async (e) => {
    e.preventDefault()
    const optionsStr = newQuestion.type === 'matching'
      ? newQuestion.optionB
      : JSON.stringify([newQuestion.optionA, newQuestion.optionB])
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedGrade, worldId: selectedWorld, levelId: selectedLevel,
          type: newQuestion.type, q: newQuestion.q, options: optionsStr,
          correct: parseInt(newQuestion.correct, 10), emoji: newQuestion.emoji,
          subject: newQuestion.subject, topic: newQuestion.topic
        })
      })
      if (res.ok) {
        setNewQuestionModal(false)
        setNewQuestion({ type: 'choose', q: '', optionA: '', optionB: '', correct: 0, emoji: '❓', subject: 'Toán', topic: 'Chung' })
        loadQuestions()
        showToast('Đã thêm câu hỏi mới ✅')
      } else { showToast('Thêm câu hỏi thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleEditQuestionSave = async (e) => {
    e.preventDefault()
    const optionsStr = editingQuestion.type === 'matching'
      ? editingQuestion.optionB
      : JSON.stringify([editingQuestion.optionA, editingQuestion.optionB])
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuestion.id, q: editingQuestion.q, options: optionsStr,
          correct: parseInt(editingQuestion.correct, 10), emoji: editingQuestion.emoji,
          subject: editingQuestion.subject, topic: editingQuestion.topic
        })
      })
      if (res.ok) { setEditingQuestion(null); loadQuestions(); showToast('Đã lưu thay đổi câu hỏi ✅') }
      else { showToast('Cập nhật thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Xóa câu hỏi tùy chỉnh này?')) return
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' })
      if (res.ok) { loadQuestions(); showToast('Đã xóa câu hỏi') }
      else { showToast('Xóa thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  // Export CSV
  const exportStudentsCSV = () => {
    const headers = ['Tên học sinh', 'Email phụ huynh', 'Khối lớp', 'Tổng sao', 'Chuỗi ngày học']
    const rows = students.map(s => [
      s.name, s.parent?.email || '', s.grade,
      s.progress?.stars || 0, s.progress?.streak || 0
    ])
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'hocvui_hocsinh.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Đã xuất file CSV ✅')
  }

  // Filters
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.parent?.email?.toLowerCase().includes(studentSearch.toLowerCase())
    const matchGrade = studentGradeFilter === 'all' || s.grade === studentGradeFilter
    return matchSearch && matchGrade
  })

  const filteredParents = parents.filter(p =>
    p.email?.toLowerCase().includes(parentSearch.toLowerCase())
  )

  // ─── Login Page ───────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <span className={styles.loginLogo}>🛠️</span>
            <h1>Học Vui Admin</h1>
            <p>Trang quản trị hệ thống học tập</p>
          </div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label>Email quản trị viên</label>
              <input type="email" placeholder="admin@hocvui.vn" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Mật khẩu</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            {loginError && <p className={styles.errorMsg}>⚠️ {loginError}</p>}
            <button type="submit" className={styles.loginBtn}>ĐĂNG NHẬP 🔐</button>
          </form>
        </div>
      </div>
    )
  }

  // ─── Admin Dashboard ──────────────────────────────────────────────────────
  return (
    <div className={styles.adminContainer}>
      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>🎒</span>
          <div>
            <h2>Học Vui</h2>
            <p className={styles.sidebarSubtitle}>Admin Panel</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { key: 'overview', icon: '📊', label: 'Tổng quan' },
            { key: 'students', icon: '👦', label: 'Học sinh', badge: students.length || null },
            { key: 'parents', icon: '👨‍👩‍👧', label: 'Phụ huynh', badge: parents.length || null },
            { key: 'questions', icon: '📚', label: 'Ngân hàng câu hỏi' },
          ].map(item => (
            <button key={item.key}
              className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge > 0 && <span className={styles.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminBadge}>
            <span>👤</span>
            <div>
              <p className={styles.adminRole}>Quản trị viên</p>
              <p className={styles.adminEmail}>wendy84205@gmail.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1>📊 Tổng quan hệ thống</h1>
                <p>Thống kê hiệu suất và phân bố học sinh toàn hệ thống</p>
              </div>
              <button onClick={loadStats} className={styles.refreshBtn}>🔄 Làm mới</button>
            </div>

            {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tổng hợp...</div> : (
              <>
                {/* KPI Cards */}
                <div className={styles.kpiGrid}>
                  <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
                    <div className={styles.kpiIcon}>👨‍👩‍👧</div>
                    <div className={styles.kpiInfo}>
                      <h3>{stats.totalParents}</h3>
                      <p>Tài khoản Phụ huynh</p>
                    </div>
                    <div className={styles.kpiDecor}>PH</div>
                  </div>
                  <div className={`${styles.kpiCard} ${styles.kpiCyan}`}>
                    <div className={styles.kpiIcon}>👦</div>
                    <div className={styles.kpiInfo}>
                      <h3>{stats.totalStudents}</h3>
                      <p>Hồ sơ Học sinh</p>
                    </div>
                    <div className={styles.kpiDecor}>HS</div>
                  </div>
                  <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
                    <div className={styles.kpiIcon}>⭐</div>
                    <div className={styles.kpiInfo}>
                      <h3>{stats.totalStars?.toLocaleString()}</h3>
                      <p>Tổng sao tích lũy</p>
                    </div>
                    <div className={styles.kpiDecor}>★</div>
                  </div>
                  <div className={`${styles.kpiCard} ${styles.kpiOrange}`}>
                    <div className={styles.kpiIcon}>🔥</div>
                    <div className={styles.kpiInfo}>
                      <h3>{stats.avgStreak} ngày</h3>
                      <p>Chuỗi học TB</p>
                    </div>
                    <div className={styles.kpiDecor}>🔥</div>
                  </div>
                  <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
                    <div className={styles.kpiIcon}>📝</div>
                    <div className={styles.kpiInfo}>
                      <h3>{stats.totalCustomQuestions}</h3>
                      <p>Câu hỏi tùy chỉnh</p>
                    </div>
                    <div className={styles.kpiDecor}>Q</div>
                  </div>
                </div>

                {/* Analytics Row */}
                <div className={styles.analyticsRow}>
                  {/* Grade Distribution */}
                  <div className={styles.analyticsCard}>
                    <h3 className={styles.cardTitle}>📈 Phân bố học sinh theo Khối lớp</h3>
                    <div className={styles.chartArea}>
                      {stats.gradeDistribution.length > 0 ? stats.gradeDistribution.map(g => {
                        const maxCount = Math.max(...stats.gradeDistribution.map(i => i.count), 1)
                        const pct = (g.count / maxCount) * 100
                        const colors = ['#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626']
                        const idx = ['Lớp 1','Lớp 2','Lớp 3','Lớp 4','Lớp 5'].indexOf(g.grade)
                        return (
                          <div key={g.grade} className={styles.chartBarRow}>
                            <span className={styles.chartLabel}>{g.grade}</span>
                            <div className={styles.chartTrack}>
                              <div className={styles.chartFill}
                                style={{ width: `${pct}%`, background: colors[idx] || '#0284c7' }} />
                            </div>
                            <span className={styles.chartValue}>{g.count} bé</span>
                          </div>
                        )
                      }) : <p className={styles.emptyNote}>Chưa có dữ liệu</p>}
                    </div>
                  </div>

                  {/* Top Students */}
                  <div className={styles.analyticsCard}>
                    <h3 className={styles.cardTitle}>🏆 Bảng vàng học sinh xuất sắc</h3>
                    <div className={styles.leaderboard}>
                      {stats.topStudents.map((ts, i) => (
                        <div key={ts.id} className={styles.leaderRow}>
                          <div className={`${styles.rankBadge} ${i < 3 ? styles[`rank${i}`] : ''}`}>{i + 1}</div>
                          <span className={styles.leaderAvatar}>{ts.avatar || '🐱'}</span>
                          <div className={styles.leaderInfo}>
                            <strong>{ts.name}</strong>
                            <small>{ts.grade} • {ts.parentEmail}</small>
                          </div>
                          <div className={styles.leaderStats}>
                            <span className={styles.starChip}>⭐ {ts.stars}</span>
                            <span className={styles.fireChip}>🔥 {ts.streak}d</span>
                          </div>
                        </div>
                      ))}
                      {stats.topStudents.length === 0 && (
                        <p className={styles.emptyNote}>Chưa có dữ liệu xếp hạng</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className={styles.quickActions}>
                  <h3 className={styles.cardTitle}>⚡ Thao tác nhanh</h3>
                  <div className={styles.quickGrid}>
                    <button className={styles.quickBtn} onClick={() => setActiveTab('students')}>
                      <span>👦</span><span>Quản lý học sinh</span>
                    </button>
                    <button className={styles.quickBtn} onClick={() => setActiveTab('parents')}>
                      <span>👨‍👩‍👧</span><span>Quản lý phụ huynh</span>
                    </button>
                    <button className={styles.quickBtn} onClick={() => { setActiveTab('questions'); }}>
                      <span>➕</span><span>Thêm câu hỏi</span>
                    </button>
                    <button className={styles.quickBtn} onClick={() => { setActiveTab('students'); setTimeout(exportStudentsCSV, 500) }}>
                      <span>📥</span><span>Xuất CSV học sinh</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* ─── TAB 2: STUDENTS ─── */}
        {activeTab === 'students' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1>👦 Quản lý học sinh</h1>
                <p>Xem, chỉnh sửa, lên lớp và quản lý {students.length} học sinh toàn hệ thống</p>
              </div>
              <button onClick={exportStudentsCSV} className={styles.exportBtn}>📥 Xuất CSV</button>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <span>🔍</span>
                <input type="text" placeholder="Tìm theo tên học sinh hoặc email phụ huynh..."
                  value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  className={styles.searchInput} />
                {studentSearch && <button className={styles.clearSearch} onClick={() => setStudentSearch('')}>✕</button>}
              </div>
              <select value={studentGradeFilter} onChange={e => setStudentGradeFilter(e.target.value)}
                className={styles.gradeFilterSelect}>
                <option value="all">Tất cả khối lớp</option>
                <option value="Lớp 1">Lớp 1</option>
                <option value="Lớp 2">Lớp 2</option>
                <option value="Lớp 3">Lớp 3</option>
                <option value="Lớp 4">Lớp 4</option>
                <option value="Lớp 5">Lớp 5</option>
              </select>
              <span className={styles.resultCount}>{filteredStudents.length} kết quả</span>
            </div>

            {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tải...</div> : (
              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Học sinh</th>
                      <th>Email phụ huynh</th>
                      <th>Khối lớp</th>
                      <th>Sao ⭐</th>
                      <th>Chuỗi 🔥</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>
                          <div className={styles.studentCell}>
                            <span className={styles.avatar}>{student.avatar || '🐱'}</span>
                            <div>
                              <span className={styles.studentName}>{student.name}</span>
                              <span className={styles.studentId}>ID: {student.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.mutedText}>{student.parent?.email || 'N/A'}</td>
                        <td>
                          <span className={`${styles.gradePill} ${styles[`grade_${GRADE_TO_SLUG[student.grade]?.replace('-', '')}`]}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className={styles.starText}>⭐ {student.progress?.stars || 0}</td>
                        <td className={styles.fireText}>🔥 {student.progress?.streak || 0}</td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button onClick={() => setViewingStudent(student)} className={styles.viewBtn} title="Xem chi tiết">
                              👁️
                            </button>
                            <button onClick={() => setEditingStudent({
                              ...student,
                              progress: student.progress || { stars: 0, streak: 0 }
                            })} className={styles.editBtn} title="Chỉnh sửa">
                              ✏️
                            </button>
                            <button onClick={() => handlePromoteStudent(student)}
                              className={styles.promoteBtn} title="Lên lớp"
                              disabled={student.grade === 'Lớp 5'}>
                              🚀
                            </button>
                            <button onClick={() => handleResetProgress(student)} className={styles.resetBtn} title="Reset tiến trình">
                              🔄
                            </button>
                            <button onClick={() => handleDeleteStudent(student.id, student.name)}
                              className={styles.deleteBtn} title="Xóa học sinh">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="6" className={styles.emptyRow}>
                          <span>😕</span> Không tìm thấy học sinh nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 3: PARENTS ─── */}
        {activeTab === 'parents' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1>👨‍👩‍👧 Quản lý phụ huynh</h1>
                <p>Quản lý {parents.length} tài khoản phụ huynh và các hồ sơ học sinh trực thuộc</p>
              </div>
            </div>

            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <span>🔍</span>
                <input type="text" placeholder="Tìm theo email phụ huynh..."
                  value={parentSearch} onChange={e => setParentSearch(e.target.value)}
                  className={styles.searchInput} />
                {parentSearch && <button className={styles.clearSearch} onClick={() => setParentSearch('')}>✕</button>}
              </div>
              <span className={styles.resultCount}>{filteredParents.length} kết quả</span>
            </div>

            {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tải...</div> : (
              <div className={styles.parentGrid}>
                {filteredParents.map(parent => (
                  <div key={parent.id} className={styles.parentCard}>
                    <div className={styles.parentCardHeader}>
                      <div className={styles.parentAvatar}>
                        {parent.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.parentInfo}>
                        <strong>{parent.email}</strong>
                        <small>Tham gia: {new Date(parent.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                      <span className={styles.childCountBadge}>
                        {parent._count?.profiles || 0} bé
                      </span>
                    </div>

                    {/* Children list */}
                    {parent.profiles && parent.profiles.length > 0 && (
                      <div className={styles.childrenList}>
                        {parent.profiles.map(child => (
                          <div key={child.id} className={styles.childRow}>
                            <span>{child.avatar || '🐱'}</span>
                            <span className={styles.childName}>{child.name}</span>
                            <span className={styles.childGrade}>{child.grade}</span>
                            <span className={styles.childStar}>⭐ {child.progress?.stars || 0}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.parentCardActions}>
                      <button onClick={() => setViewingParent(parent)} className={styles.viewBtn}>
                        👁️ Xem chi tiết
                      </button>
                      <button onClick={() => handleDeleteParent(parent.id, parent.email)} className={styles.deleteBtnSm}>
                        🗑️ Xóa tài khoản
                      </button>
                    </div>
                  </div>
                ))}
                {filteredParents.length === 0 && (
                  <div className={styles.emptyState}>
                    <span>😕</span>
                    <p>Không tìm thấy phụ huynh nào</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 4: QUESTIONS ─── */}
        {activeTab === 'questions' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h1>📚 Ngân hàng câu hỏi</h1>
                <p>Quản lý câu hỏi hệ thống và thêm câu hỏi tùy chỉnh</p>
              </div>
              <button onClick={() => setNewQuestionModal(true)} className={styles.addBtn}>
                ➕ Thêm câu hỏi
              </button>
            </div>

            {/* Filter Controls */}
            <div className={styles.questionFilter}>
              <div className={styles.filterGroup}>
                <label>📘 Khối lớp</label>
                <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
                  <option value="lop-1">Lớp 1</option>
                  <option value="lop-2">Lớp 2</option>
                  <option value="lop-3">Lớp 3</option>
                  <option value="lop-4">Lớp 4</option>
                  <option value="lop-5">Lớp 5</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>🌍 Thế giới</label>
                <select value={selectedWorld} onChange={e => setSelectedWorld(parseInt(e.target.value, 10))}>
                  {[1,2,3,4,5,6].map(w => <option key={w} value={w}>Thế giới {w}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>⚔️ Ải (Level)</label>
                <select value={selectedLevel} onChange={e => setSelectedLevel(parseInt(e.target.value, 10))}>
                  {[1,2,3,4,5,6,7].map(l => <option key={l} value={l}>Ải {l}</option>)}
                </select>
              </div>
              <div className={styles.questionSummary}>
                <span className={styles.qCountCustom}>Admin: {questions.customQuestions.length}</span>
                <span className={styles.qCountSystem}>Hệ thống: {questions.staticQuestions.length}</span>
              </div>
            </div>

            {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tải câu hỏi...</div> : (
              <div className={styles.questionList}>
                {/* Custom Questions */}
                <div className={styles.qSection}>
                  <div className={styles.qSectionHeader}>
                    <h3>✨ Câu hỏi do Admin thêm</h3>
                    <span className={styles.qBadge}>{questions.customQuestions.length}</span>
                  </div>
                  <div className={styles.questionGrid}>
                    {questions.customQuestions.map(q => (
                      <QuestionCard key={q.id} q={q} isCustom={true}
                        onEdit={() => {
                          let opts = []
                          if (q.type !== 'matching') {
                            try { opts = JSON.parse(q.options) } catch { opts = q.options.split(',') }
                          }
                          setEditingQuestion({
                            id: q.id, type: q.type, q: q.q,
                            optionA: q.type === 'matching' ? '' : opts[0] || '',
                            optionB: q.type === 'matching' ? q.options : opts[1] || '',
                            correct: q.correct, emoji: q.emoji, subject: q.subject, topic: q.topic
                          })
                        }}
                        onDelete={() => handleDeleteQuestion(q.id)}
                      />
                    ))}
                    {questions.customQuestions.length === 0 && (
                      <div className={styles.emptyQCard}>
                        <span>📝</span>
                        <p>Chưa có câu hỏi tùy chỉnh nào</p>
                        <button onClick={() => setNewQuestionModal(true)} className={styles.addBtn}>
                          ➕ Thêm ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Questions */}
                <div className={styles.qSection}>
                  <div className={styles.qSectionHeader}>
                    <h3>🏛️ Câu hỏi hệ thống</h3>
                    <span className={styles.qBadge}>{questions.staticQuestions.length}</span>
                  </div>
                  <div className={styles.questionGrid}>
                    {questions.staticQuestions.map((q, idx) => (
                      <QuestionCard key={idx} q={q} isCustom={false} />
                    ))}
                    {questions.staticQuestions.length === 0 && (
                      <div className={styles.emptyQCard}>
                        <span>📚</span>
                        <p>Không có câu hỏi hệ thống cho ải này</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ─── MODALS ─── */}

      {/* View Student Detail Modal */}
      {viewingStudent && (
        <div className={styles.modalOverlay} onClick={() => setViewingStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📋 Chi tiết học sinh</h2>
              <button onClick={() => setViewingStudent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.studentDetail}>
              <div className={styles.detailAvatar}>{viewingStudent.avatar || '🐱'}</div>
              <h3>{viewingStudent.name}</h3>
              <span className={styles.gradePill}>{viewingStudent.grade}</span>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Email phụ huynh</label>
                  <value>{viewingStudent.parent?.email || 'N/A'}</value>
                </div>
                <div className={styles.detailItem}>
                  <label>Tổng sao tích lũy</label>
                  <value>⭐ {viewingStudent.progress?.stars || 0}</value>
                </div>
                <div className={styles.detailItem}>
                  <label>Chuỗi ngày học</label>
                  <value>🔥 {viewingStudent.progress?.streak || 0} ngày</value>
                </div>
                <div className={styles.detailItem}>
                  <label>Khối lớp tiếp theo</label>
                  <value>{NEXT_GRADE[viewingStudent.grade] || '🎓 Đã tốt nghiệp'}</value>
                </div>
              </div>
              <div className={styles.detailActions}>
                <button onClick={() => {
                  setViewingStudent(null)
                  setEditingStudent({ ...viewingStudent, progress: viewingStudent.progress || { stars: 0, streak: 0 } })
                }} className={styles.saveBtn}>✏️ Chỉnh sửa</button>
                <button onClick={() => { handlePromoteStudent(viewingStudent); setViewingStudent(null) }}
                  className={styles.promoteModalBtn}
                  disabled={viewingStudent.grade === 'Lớp 5'}>
                  🚀 Lên lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className={styles.modalOverlay} onClick={() => setEditingStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>✏️ Chỉnh sửa học sinh</h2>
              <button onClick={() => setEditingStudent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleEditStudentSave} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Tên học sinh</label>
                <input type="text" value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Khối lớp</label>
                <select value={editingStudent.grade}
                  onChange={e => setEditingStudent({ ...editingStudent, grade: e.target.value })}>
                  {['Lớp 1','Lớp 2','Lớp 3','Lớp 4','Lớp 5'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>⭐ Sao tích lũy</label>
                  <input type="number" min="0"
                    value={editingStudent.progress.stars}
                    onChange={e => setEditingStudent({
                      ...editingStudent,
                      progress: { ...editingStudent.progress, stars: parseInt(e.target.value, 10) || 0 }
                    })} />
                </div>
                <div className={styles.inputGroup}>
                  <label>🔥 Chuỗi ngày học</label>
                  <input type="number" min="0"
                    value={editingStudent.progress.streak}
                    onChange={e => setEditingStudent({
                      ...editingStudent,
                      progress: { ...editingStudent.progress, streak: parseInt(e.target.value, 10) || 0 }
                    })} />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setEditingStudent(null)} className={styles.cancelBtn}>Hủy</button>
                <button type="submit" className={styles.saveBtn}>💾 Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Parent Modal */}
      {viewingParent && (
        <div className={styles.modalOverlay} onClick={() => setViewingParent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>👨‍👩‍👧 Chi tiết phụ huynh</h2>
              <button onClick={() => setViewingParent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.parentDetail}>
              <div className={styles.parentDetailAvatar}>{viewingParent.email?.charAt(0).toUpperCase()}</div>
              <h3>{viewingParent.email}</h3>
              <p className={styles.mutedText}>Tham gia: {new Date(viewingParent.createdAt).toLocaleDateString('vi-VN')}</p>
              <div className={styles.qSectionHeader} style={{marginTop:'20px'}}>
                <h4>Danh sách học sinh</h4>
                <span className={styles.qBadge}>{viewingParent._count?.profiles || 0}</span>
              </div>
              {viewingParent.profiles?.map(child => (
                <div key={child.id} className={styles.childRowDetailed}>
                  <span className={styles.childAvatar}>{child.avatar || '🐱'}</span>
                  <div>
                    <strong>{child.name}</strong>
                    <p>{child.grade} • ⭐ {child.progress?.stars || 0} • 🔥 {child.progress?.streak || 0} ngày</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {newQuestionModal && (
        <div className={styles.modalOverlay} onClick={() => setNewQuestionModal(false)}>
          <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>➕ Thêm câu hỏi tùy chỉnh</h2>
              <button onClick={() => setNewQuestionModal(false)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.modalMeta}>
              Đang thêm vào: <strong>{GRADES_MAP[selectedGrade]}</strong> → Thế giới <strong>{selectedWorld}</strong> → Ải <strong>{selectedLevel}</strong>
            </div>
            <form onSubmit={handleAddQuestion} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Loại trò chơi</label>
                <select value={newQuestion.type}
                  onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value, optionA: '', optionB: '' })}>
                  <option value="choose">🎯 Trắc nghiệm (Choose 1 of 2)</option>
                  <option value="listen">🎧 Nghe viết từ vựng (Listen & Select)</option>
                  <option value="matching">🔗 Ghép cặp (Matching)</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>
                  {newQuestion.type === 'choose' && 'Nội dung câu hỏi'}
                  {newQuestion.type === 'listen' && 'Từ vựng cần đọc/phát âm'}
                  {newQuestion.type === 'matching' && 'Nội dung thẻ vế trái'}
                </label>
                <input type="text" placeholder="Nhập nội dung..." value={newQuestion.q}
                  onChange={e => setNewQuestion({ ...newQuestion, q: e.target.value })} required />
              </div>
              {newQuestion.type === 'matching' ? (
                <div className={styles.inputGroup}>
                  <label>Nội dung thẻ vế phải</label>
                  <input type="text" placeholder="Nội dung tương ứng..."
                    value={newQuestion.optionB}
                    onChange={e => setNewQuestion({ ...newQuestion, optionB: e.target.value })} required />
                </div>
              ) : (
                <>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Lựa chọn A</label>
                      <input type="text" placeholder="Đáp án A..."
                        value={newQuestion.optionA}
                        onChange={e => setNewQuestion({ ...newQuestion, optionA: e.target.value })} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Lựa chọn B</label>
                      <input type="text" placeholder="Đáp án B..."
                        value={newQuestion.optionB}
                        onChange={e => setNewQuestion({ ...newQuestion, optionB: e.target.value })} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Đáp án đúng</label>
                    <select value={newQuestion.correct}
                      onChange={e => setNewQuestion({ ...newQuestion, correct: parseInt(e.target.value, 10) })}>
                      <option value={0}>✅ Đáp án A</option>
                      <option value={1}>✅ Đáp án B</option>
                    </select>
                  </div>
                </>
              )}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Emoji biểu tượng</label>
                  <input type="text" placeholder="🍎" value={newQuestion.emoji}
                    onChange={e => setNewQuestion({ ...newQuestion, emoji: e.target.value })} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Môn học</label>
                  <input type="text" value={newQuestion.subject}
                    onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Chủ đề (Topic)</label>
                <input type="text" placeholder="Ví dụ: Phân số bằng nhau..."
                  value={newQuestion.topic}
                  onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value })} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setNewQuestionModal(false)} className={styles.cancelBtn}>Hủy</button>
                <button type="submit" className={styles.saveBtn}>💾 Thêm câu hỏi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className={styles.modalOverlay} onClick={() => setEditingQuestion(null)}>
          <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>✏️ Sửa câu hỏi</h2>
              <button onClick={() => setEditingQuestion(null)} className={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleEditQuestionSave} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Loại trò chơi</label>
                <input type="text" disabled
                  value={editingQuestion.type === 'choose' ? '🎯 Trắc nghiệm' : editingQuestion.type === 'listen' ? '🎧 Nghe viết' : '🔗 Ghép cặp'} />
              </div>
              <div className={styles.inputGroup}>
                <label>Nội dung câu hỏi / thẻ trái</label>
                <input type="text" value={editingQuestion.q}
                  onChange={e => setEditingQuestion({ ...editingQuestion, q: e.target.value })} required />
              </div>
              {editingQuestion.type === 'matching' ? (
                <div className={styles.inputGroup}>
                  <label>Nội dung thẻ vế phải</label>
                  <input type="text" value={editingQuestion.optionB}
                    onChange={e => setEditingQuestion({ ...editingQuestion, optionB: e.target.value })} required />
                </div>
              ) : (
                <>
                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Lựa chọn A</label>
                      <input type="text" value={editingQuestion.optionA}
                        onChange={e => setEditingQuestion({ ...editingQuestion, optionA: e.target.value })} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Lựa chọn B</label>
                      <input type="text" value={editingQuestion.optionB}
                        onChange={e => setEditingQuestion({ ...editingQuestion, optionB: e.target.value })} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Đáp án đúng</label>
                    <select value={editingQuestion.correct}
                      onChange={e => setEditingQuestion({ ...editingQuestion, correct: parseInt(e.target.value, 10) })}>
                      <option value={0}>✅ Đáp án A</option>
                      <option value={1}>✅ Đáp án B</option>
                    </select>
                  </div>
                </>
              )}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Emoji</label>
                  <input type="text" value={editingQuestion.emoji}
                    onChange={e => setEditingQuestion({ ...editingQuestion, emoji: e.target.value })} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Môn học</label>
                  <input type="text" value={editingQuestion.subject}
                    onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Chủ đề</label>
                <input type="text" value={editingQuestion.topic}
                  onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setEditingQuestion(null)} className={styles.cancelBtn}>Hủy</button>
                <button type="submit" className={styles.saveBtn}>💾 Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Question Card Sub-component ─────────────────────────────────────────────
function QuestionCard({ q, isCustom, onEdit, onDelete }) {
  const typeLabel = q.type === 'choose' ? '🎯 Trắc nghiệm' : q.type === 'listen' ? '🎧 Nghe viết' : '🔗 Ghép cặp'
  let opts = []
  if (q.type !== 'matching') {
    try { opts = q.options ? JSON.parse(q.options) : (q.options_array || []) } catch { opts = q.options?.split(',') || [] }
  }
  return (
    <div className={`${styles.qCard} ${isCustom ? styles.qCardCustom : styles.qCardSystem}`}>
      <div className={styles.qCardTop}>
        <span className={isCustom ? styles.badgeAdmin : styles.badgeSys}>{isCustom ? 'Admin' : 'Hệ thống'}</span>
        <span className={styles.typeBadge}>{typeLabel}</span>
        <span className={styles.qEmoji}>{q.emoji || '❓'}</span>
      </div>
      <p className={styles.qText}>{q.q || q.word || q.left}</p>
      {q.type === 'matching' ? (
        <div className={styles.matchingRow}>
          <span className={styles.leftCard}>{q.q || q.left}</span>
          <span className={styles.matchArrow}>⟶</span>
          <span className={styles.rightCard}>{q.options || q.right}</span>
        </div>
      ) : (
        <div className={styles.optsList}>
          {opts.map((opt, i) => (
            <span key={i} className={`${styles.optChip} ${i === (q.correct ?? -1) ? styles.correctChip : ''}`}>
              {i === 0 ? 'A' : 'B'}. {opt} {i === (q.correct ?? -1) ? '✓' : ''}
            </span>
          ))}
        </div>
      )}
      <div className={styles.qMeta}>
        <span>📚 {q.subject}</span>
        <span>•</span>
        <span>🏷️ {q.topic}</span>
      </div>
      {isCustom && (
        <div className={styles.qActions}>
          <button onClick={onEdit} className={styles.editBtnSm}>✏️ Sửa</button>
          <button onClick={onDelete} className={styles.deleteBtnSm}>🗑️ Xóa</button>
        </div>
      )}
    </div>
  )
}
