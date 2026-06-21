'use client'

import { useState, useMemo } from 'react'
import styles from './StudentsPage.module.css'

const GRADE_TO_SLUG = {
  'Lớp 1': 'lop-1', 'Lớp 2': 'lop-2', 'Lớp 3': 'lop-3', 'Lớp 4': 'lop-4', 'Lớp 5': 'lop-5'
}
const NEXT_GRADE = {
  'Lớp 1': 'Lớp 2', 'Lớp 2': 'Lớp 3', 'Lớp 3': 'Lớp 4', 'Lớp 4': 'Lớp 5', 'Lớp 5': null
}

function MaterialIcon({ children, className = '', filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {children}
    </span>
  )
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('vi-VN')
}

export default function StudentsPage({
  students,
  loading,
  studentAvgStreak,
  studentStarTotal,
  stats,
  onPromote,
  onReset,
  onDelete,
  onSave,
  onExport
}) {
  const [studentSearch, setStudentSearch] = useState('')
  const [studentGradeFilter, setStudentGradeFilter] = useState('all')
  const [viewingStudent, setViewingStudent] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchGrade = studentGradeFilter === 'all' || student.grade === studentGradeFilter
      const searchLower = studentSearch.toLowerCase()
      const matchSearch =
        student.name.toLowerCase().includes(searchLower) ||
        (student.parent?.email || '').toLowerCase().includes(searchLower)
      return matchGrade && matchSearch
    })
  }, [students, studentSearch, studentGradeFilter])

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editingStudent) return
    onSave({
      id: editingStudent.id,
      name: editingStudent.name,
      grade: editingStudent.grade,
      stars: editingStudent.progress?.stars || 0,
      streak: editingStudent.progress?.streak || 0
    })
    setEditingStudent(null)
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>People Management</h1>
          <p>Manage students, track progress, and coordinate with parents.</p>
        </div>
        <button onClick={onExport} className={styles.exportBtn}>
          <MaterialIcon>download</MaterialIcon>
          Xuất CSV
        </button>
      </div>

      <div className={styles.peopleKpiGrid}>
        <article className={styles.kpiCard}>
          <div><span>Total Students</span><MaterialIcon>trending_up</MaterialIcon></div>
          <strong>{formatNumber(students.length)}</strong>
          <p>Active across all grades</p>
        </article>
        <article className={styles.kpiCard}>
          <div><span>Avg. Streak</span><MaterialIcon>local_fire_department</MaterialIcon></div>
          <strong>{formatNumber(studentAvgStreak)}d</strong>
          <p>Calculated from progress records</p>
        </article>
        <article className={styles.kpiCard}>
          <div><span>Stars Awarded</span><MaterialIcon>stars</MaterialIcon></div>
          <strong>{formatNumber(studentStarTotal || stats.totalStars || 0)}</strong>
          <p>Total reward economy</p>
        </article>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <MaterialIcon>search</MaterialIcon>
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
                <th>Sao <MaterialIcon filled className={styles.headerIcon}>star</MaterialIcon></th>
                <th>Chuỗi <MaterialIcon className={styles.headerIcon}>local_fire_department</MaterialIcon></th>
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
                  <td className={styles.starText}>
                    <div className="flex items-center gap-1">
                      <MaterialIcon filled className={styles.starIcon}>star</MaterialIcon>
                      <span>{student.progress?.stars || 0}</span>
                    </div>
                  </td>
                  <td className={styles.fireText}>
                    <div className="flex items-center gap-1">
                      <MaterialIcon className={styles.fireIcon}>local_fire_department</MaterialIcon>
                      <span>{student.progress?.streak || 0}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button onClick={() => setViewingStudent(student)} className={styles.viewBtn} title="Xem chi tiết">
                        <MaterialIcon>visibility</MaterialIcon>
                      </button>
                      <button onClick={() => setEditingStudent({
                        ...student,
                        progress: student.progress || { stars: 0, streak: 0 }
                      })} className={styles.editBtn} title="Chỉnh sửa">
                        <MaterialIcon>edit</MaterialIcon>
                      </button>
                      <button onClick={() => onPromote(student)}
                        className={styles.promoteBtn} title="Lên lớp"
                        disabled={student.grade === 'Lớp 5'}>
                        <MaterialIcon>rocket_launch</MaterialIcon>
                      </button>
                      <button onClick={() => onReset(student)} className={styles.resetBtn} title="Reset tiến trình">
                        <MaterialIcon>restart_alt</MaterialIcon>
                      </button>
                      <button onClick={() => onDelete(student.id, student.name)}
                        className={styles.deleteBtn} title="Xóa học sinh">
                        <MaterialIcon>delete</MaterialIcon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>
                    <span className={styles.emptyIcon}><MaterialIcon>sentiment_dissatisfied</MaterialIcon></span> Không tìm thấy học sinh nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Student Detail Modal */}
      {viewingStudent && (
        <div className={styles.modalOverlay} onClick={() => setViewingStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <MaterialIcon className={styles.modalTitleIcon}>assignment</MaterialIcon>
                Chi tiết học sinh
              </h2>
              <button onClick={() => setViewingStudent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.studentDetail}>
              <div className={styles.detailAvatar}>{viewingStudent.avatar || '🐱'}</div>
              <h3>{viewingStudent.name}</h3>
              <span className={styles.gradePill}>{viewingStudent.grade}</span>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Email phụ huynh</label>
                  <span>{viewingStudent.parent?.email || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Tổng sao tích lũy</label>
                  <span className="flex items-center gap-1">
                    <MaterialIcon filled className={styles.starIcon}>star</MaterialIcon>
                    {viewingStudent.progress?.stars || 0}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Chuỗi ngày học</label>
                  <span className="flex items-center gap-1">
                    <MaterialIcon className={styles.fireIcon}>local_fire_department</MaterialIcon>
                    {viewingStudent.progress?.streak || 0} ngày
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Khối lớp tiếp theo</label>
                  <span>{NEXT_GRADE[viewingStudent.grade] || '🎓 Đã tốt nghiệp'}</span>
                </div>
              </div>
              <div className={styles.detailActions}>
                <button onClick={() => {
                  setViewingStudent(null)
                  setEditingStudent({ ...viewingStudent, progress: viewingStudent.progress || { stars: 0, streak: 0 } })
                }} className={styles.saveBtn}>
                  <MaterialIcon className={styles.btnIcon}>edit</MaterialIcon> Chỉnh sửa
                </button>
                <button onClick={() => { onPromote(viewingStudent); setViewingStudent(null) }}
                  className={styles.promoteModalBtn}
                  disabled={viewingStudent.grade === 'Lớp 5'}>
                  <MaterialIcon className={styles.btnIcon}>rocket_launch</MaterialIcon> Lên lớp
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
              <h2>
                <MaterialIcon className={styles.modalTitleIcon}>edit</MaterialIcon>
                Chỉnh sửa học sinh
              </h2>
              <button onClick={() => setEditingStudent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.modalForm}>
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
                  <label>
                    <MaterialIcon filled className={styles.inputLabelIcon}>star</MaterialIcon>
                    Sao tích lũy
                  </label>
                  <input type="number" min="0"
                    value={editingStudent.progress.stars}
                    onChange={e => setEditingStudent({
                      ...editingStudent,
                      progress: { ...editingStudent.progress, stars: parseInt(e.target.value, 10) || 0 }
                    })} />
                </div>
                <div className={styles.inputGroup}>
                  <label>
                    <MaterialIcon className={styles.inputLabelIcon}>local_fire_department</MaterialIcon>
                    Chuỗi ngày học
                  </label>
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
                <button type="submit" className={styles.saveBtn}>
                  <MaterialIcon className={styles.btnIcon}>save</MaterialIcon> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
