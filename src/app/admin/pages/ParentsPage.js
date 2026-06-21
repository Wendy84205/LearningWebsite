'use client'

import { useState, useMemo } from 'react'
import styles from './ParentsPage.module.css'

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

export default function ParentsPage({
  parents,
  loading,
  onDeleteParent
}) {
  const [parentSearch, setParentSearch] = useState('')
  const [viewingParent, setViewingParent] = useState(null)

  const filteredParents = useMemo(() => {
    return parents.filter(parent => {
      return (parent.email || '').toLowerCase().includes(parentSearch.toLowerCase())
    })
  }, [parents, parentSearch])

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>Parents Directory</h1>
          <p>Quản lý {parents.length} tài khoản phụ huynh và các hồ sơ học sinh trực thuộc.</p>
        </div>
      </div>

      <div className={styles.peopleKpiGrid}>
        <article className={styles.kpiCard}>
          <div><span>Total Parents</span><MaterialIcon>family_restroom</MaterialIcon></div>
          <strong>{formatNumber(parents.length)}</strong>
          <p>Linked family accounts</p>
        </article>
        <article className={styles.kpiCard}>
          <div><span>Linked Students</span><MaterialIcon>group</MaterialIcon></div>
          <strong>{formatNumber(parents.reduce((sum, parent) => sum + (parent._count?.profiles || parent.profiles?.length || 0), 0))}</strong>
          <p>Profiles under parent accounts</p>
        </article>
        <article className={styles.kpiCard}>
          <div><span>Active Families</span><MaterialIcon>verified</MaterialIcon></div>
          <strong>{formatNumber(parents.filter(parent => (parent._count?.profiles || parent.profiles?.length || 0) > 0).length)}</strong>
          <p>Has at least one child profile</p>
        </article>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <MaterialIcon>search</MaterialIcon>
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
                  {parent._count?.profiles || parent.profiles?.length || 0} bé
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
                      <span className={styles.childStar}>
                        <MaterialIcon filled className={styles.starIconMini}>star</MaterialIcon>
                        <span>{child.progress?.stars || 0}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.parentCardActions}>
                <button onClick={() => setViewingParent(parent)} className={styles.viewBtn}>
                  <MaterialIcon className={styles.btnIcon}>visibility</MaterialIcon> Xem chi tiết
                </button>
                <button onClick={() => onDeleteParent(parent.id, parent.email)} className={styles.deleteBtnSm}>
                  <MaterialIcon className={styles.btnIcon}>delete</MaterialIcon> Xóa tài khoản
                </button>
              </div>
            </div>
          ))}
          {filteredParents.length === 0 && (
            <div className={styles.emptyState}>
              <span><MaterialIcon className={styles.emptyIcon}>sentiment_dissatisfied</MaterialIcon></span>
              <p>Không tìm thấy phụ huynh nào</p>
            </div>
          )}
        </div>
      )}

      {/* View Parent Modal */}
      {viewingParent && (
        <div className={styles.modalOverlay} onClick={() => setViewingParent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <MaterialIcon className={styles.modalTitleIcon}>family_restroom</MaterialIcon>
                Chi tiết phụ huynh
              </h2>
              <button onClick={() => setViewingParent(null)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.parentDetail}>
              <div className={styles.parentDetailAvatar}>{viewingParent.email?.charAt(0).toUpperCase()}</div>
              <h3>{viewingParent.email}</h3>
              <p className={styles.mutedText}>Tham gia: {new Date(viewingParent.createdAt).toLocaleDateString('vi-VN')}</p>
              <div className={styles.detailSectionHeader}>
                <h4>Danh sách học sinh</h4>
                <span className={styles.qBadge}>{viewingParent._count?.profiles || viewingParent.profiles?.length || 0}</span>
              </div>
              <div className={styles.modalChildrenList}>
                {viewingParent.profiles?.map(child => (
                  <div key={child.id} className={styles.childRowDetailed}>
                    <span className={styles.childAvatar}>{child.avatar || '🐱'}</span>
                    <div>
                      <strong>{child.name}</strong>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{child.grade}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <MaterialIcon filled className={styles.starIconMini}>star</MaterialIcon>
                          {child.progress?.stars || 0}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-orange-600 font-semibold">
                          <MaterialIcon className={styles.fireIconMini}>local_fire_department</MaterialIcon>
                          {child.progress?.streak || 0} ngày
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!viewingParent.profiles || viewingParent.profiles.length === 0) && (
                  <p className={styles.noChildren}>Chưa liên kết tài khoản học sinh nào.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
