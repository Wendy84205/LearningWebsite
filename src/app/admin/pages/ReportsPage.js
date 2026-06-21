'use client'

import { useState, useMemo } from 'react'
import styles from './ReportsPage.module.css'

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

function MiniLineChart({ metrics }) {
  const values = metrics.map(item => Number(item.value || 0))
  const max = Math.max(...values, 1)
  const points = values.map((value, index) => {
    const x = metrics.length === 1 ? 50 : (index / (metrics.length - 1)) * 100
    const y = 72 - (value / max) * 52
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `0,82 ${points} 100,82`

  return (
    <div className={styles.lineChartWrap}>
      <svg viewBox="0 0 100 86" role="img" aria-label="Biểu đồ học sinh hoạt động">
        <defs>
          <linearGradient id="adminActivityGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#adminActivityGradient)" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        {metrics.map((item, index) => {
          const x = metrics.length === 1 ? 50 : (index / (metrics.length - 1)) * 100
          const y = 72 - (Number(item.value || 0) / max) * 52
          return <circle key={item.label} cx={x} cy={y} r="3.2" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        })}
      </svg>
      <div className={styles.lineChartLabels}>
        {metrics.map(item => (
          <span key={item.label}>
            <strong>{formatNumber(item.value)}</strong>
            <small>{item.label}</small>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ReportsPage({
  moduleConfig,
  items,
  allItems,
  moduleData,
  stats,
  students,
  parents,
  search,
  typeFilter,
  form,
  formOpen,
  loading,
  onSearch,
  onTypeFilter,
  onOpenForm,
  onCloseForm,
  onFormChange,
  onDataChange,
  onSave,
  onEdit,
  onDelete,
  onModuleAction,
  onOpenQuestions,
  onExportStudents,
  onImportCms
}) {
  const moduleMetrics = moduleData?.metrics || {}
  const liveMetrics = [
    ['Phụ huynh', moduleMetrics.totalParents ?? stats.totalParents ?? parents.length ?? 0],
    ['Học sinh', moduleMetrics.totalStudents ?? stats.totalStudents ?? students.length ?? 0],
    ['CMS items', moduleMetrics.totalItems ?? allItems.length ?? 0],
    ['Tổng sao', moduleMetrics.totalStars ?? stats.totalStars ?? 0]
  ]

  const reportCards = useMemo(() => [
    ['Students', stats.totalStudents || students.length || 0, 'group'],
    ['Parents', stats.totalParents || parents.length || 0, 'family_restroom'],
    ['Stars', stats.totalStars || 0, 'star'],
    ['Questions', stats.totalQuestions || 0, 'quiz'],
  ], [stats, students, parents])
  const focusRows = useMemo(() => {
    const completionRows = Array.isArray(stats.completionByWorld)
      ? stats.completionByWorld.map(item => ({
          label: item.label,
          value: Math.max(0, 100 - Number(item.percent || 0))
        }))
      : []
    const payloadFocus = moduleData?.focus
      ? [{ label: moduleData.focus.label, value: moduleData.focus.value || 0 }]
      : []

    return [...payloadFocus, ...completionRows]
      .filter(item => item.label)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }, [stats.completionByWorld, moduleData])

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>{moduleConfig.title}</h1>
          <p>{moduleConfig.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={onOpenForm} className={styles.addBtn}>
            <MaterialIcon>add</MaterialIcon>
            {moduleConfig.primaryAction || 'Thêm item'}
          </button>
          <button type="button" onClick={onOpenQuestions} className={styles.refreshBtn}>
            <MaterialIcon>quiz</MaterialIcon>
            Question Bank
          </button>
        </div>
      </div>

      <div className={styles.moduleSnapshot}>
        {liveMetrics.map(([label, value]) => (
          <div key={label}>
            <strong>{Number(value).toLocaleString('vi-VN')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Reports Stitch Grid */}
      <div className={styles.stitchReportsGrid}>
        {reportCards.map(([label, value, icon]) => (
          <article key={label} className={styles.reportMetricCard}>
            <MaterialIcon>{icon}</MaterialIcon>
            <strong>{formatNumber(value)}</strong>
            <span>{label}</span>
          </article>
        ))}
        <div className={styles.reportChartCard}>
          <h3>Learning Activity Overview</h3>
          <MiniLineChart metrics={[
            { label: '7 ngày', value: stats.active7Days || 0 },
            { label: '30 ngày', value: stats.active30Days || 0 },
            { label: '90 ngày', value: stats.active90Days || stats.totalStudents || 0 },
          ]} />
        </div>
        <div className={styles.reportFocusCard}>
          <h3>Areas of Improvement</h3>
          {(focusRows.length ? focusRows : [{ label: 'Chưa có dữ liệu cần cải thiện', value: 0 }]).map(item => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.modulePanel}>
        <div className={styles.modulePanelHeader}>
          <div>
            <h3>Reports Records</h3>
            <p>CRUD dữ liệu CMS thật trong DB, tách theo module/type để tránh chồng chéo dữ liệu</p>
          </div>
          <div className={styles.moduleActions}>
            <button type="button" onClick={onOpenForm} className={styles.addBtn}>
              <MaterialIcon>add</MaterialIcon>
              {moduleConfig.primaryAction || 'Thêm item'}
            </button>
            <button type="button" onClick={onExportStudents} className={styles.exportBtn}>
              <MaterialIcon>download</MaterialIcon>
              Export CMS
            </button>
            {onImportCms && (
              <button type="button" onClick={onImportCms} className={styles.exportBtn}>
                <MaterialIcon>upload_file</MaterialIcon>
                Import CMS
              </button>
            )}
          </div>
        </div>

        <div className={styles.cmsToolbar}>
          <div className={styles.searchBox}>
            <MaterialIcon>search</MaterialIcon>
            <input
              type="text"
              placeholder="Tìm trong Reports..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select value={typeFilter} onChange={e => onTypeFilter(e.target.value)} className={styles.gradeFilterSelect}>
            <option value="all">Tất cả loại</option>
            {moduleConfig.types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <span className={styles.resultCount}>{items.length}/{allItems.length} records</span>
        </div>

        {formOpen && (
          <form onSubmit={onSave} className={styles.cmsForm}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Loại dữ liệu</label>
                <select value={form.type} onChange={e => onFormChange('type', e.target.value)}>
                  {moduleConfig.types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Trạng thái</label>
                <select value={form.status} onChange={e => onFormChange('status', e.target.value)}>
                  <option value="active">active</option>
                  <option value="draft">draft</option>
                  <option value="disabled">disabled</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Thứ tự</label>
                <input type="number" value={form.order} onChange={e => onFormChange('order', e.target.value)} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Tiêu đề</label>
              <input type="text" value={form.title} onChange={e => onFormChange('title', e.target.value)} required />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Lớp</label>
                <input type="text" placeholder="Lớp 1 / lop-1" value={form.grade || ''} onChange={e => onFormChange('grade', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Môn</label>
                <input type="text" placeholder="Toán / Tiếng Việt" value={form.subject || ''} onChange={e => onFormChange('subject', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Độ khó</label>
                <input type="text" placeholder="easy / medium / hard" value={form.difficulty || ''} onChange={e => onFormChange('difficulty', e.target.value)} />
              </div>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Chủ đề</label>
                <input type="text" value={form.topic || ''} onChange={e => onFormChange('topic', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Kỹ năng</label>
                <input type="text" value={form.skill || ''} onChange={e => onFormChange('skill', e.target.value)} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Mô tả</label>
              <textarea value={form.data?.description || ''} onChange={e => onDataChange('description', e.target.value)} rows="3" />
            </div>
            <div className={styles.inputGroup}>
              <label>Nội dung / cấu hình</label>
              <textarea value={form.data?.content || ''} onChange={e => onDataChange('content', e.target.value)} rows="4" />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>XP</label>
                <input type="number" value={form.data?.xp || ''} onChange={e => onDataChange('xp', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Coin</label>
                <input type="number" value={form.data?.coin || ''} onChange={e => onDataChange('coin', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Stars</label>
                <input type="number" value={form.data?.stars || ''} onChange={e => onDataChange('stars', e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label>Thời lượng</label>
                <input type="text" value={form.data?.duration || ''} onChange={e => onDataChange('duration', e.target.value)} />
              </div>
            </div>
            {moduleConfig.dataFields?.length > 0 && (
              <div className={styles.dynamicFieldGrid}>
                {moduleConfig.dataFields.map(field => (
                  <div key={field.name} className={field.multiline ? `${styles.inputGroup} ${styles.dynamicFieldWide}` : styles.inputGroup}>
                    <label>{field.label}</label>
                    {field.multiline ? (
                      <textarea value={form.data?.[field.name] || ''} onChange={e => onDataChange(field.name, e.target.value)} rows="3" />
                    ) : (
                      <input type="text" value={form.data?.[field.name] || ''} onChange={e => onDataChange(field.name, e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.modalActions}>
              <button type="button" onClick={onCloseForm} className={styles.cancelBtn}>Hủy</button>
              <button type="submit" className={styles.saveBtn}>
                <MaterialIcon>save</MaterialIcon>
                {form.id ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        )}

        <div className={styles.moduleTable}>
          {loading ? (
            <div className={styles.loader}><div className={styles.spinner} /> Đang tải Reports...</div>
          ) : items.length > 0 ? items.map(item => (
            <div key={item.id} className={styles.moduleTableRow}>
              <strong>{item.title}</strong>
              <span>{item.type} · {item.status}</span>
              <span>{[item.grade, item.subject, item.topic, item.skill].filter(Boolean).join(' / ') || moduleConfig.module}</span>
              <small>{item.data?.description || item.data?.content || item.difficulty || 'Chưa có mô tả'}</small>
              <div className={styles.cmsRowActions}>
                {onModuleAction && (
                  <button type="button" onClick={() => onModuleAction(item, 'duplicate-item')} className={styles.editBtnSm}>Nhân bản</button>
                )}
                {onModuleAction && (
                  <button
                    type="button"
                    onClick={() => onModuleAction(item, item.status === 'active' ? 'archive-item' : 'publish-item')}
                    className={item.status === 'active' ? styles.deleteBtnSm : styles.editBtnSm}
                  >
                    {item.status === 'active' ? 'Lưu trữ' : 'Xuất bản'}
                  </button>
                )}
                <button type="button" onClick={() => onEdit(item)} className={styles.editBtnSm}>Sửa</button>
                <button type="button" onClick={() => onDelete(item)} className={styles.deleteBtnSm}>Xóa</button>
              </div>
            </div>
          )) : (
            <div className={styles.cmsEmpty}>
              <span><MaterialIcon>analytics</MaterialIcon></span>
              <strong>Chưa có báo cáo nào</strong>
              <p>Tạo record đầu tiên cho module này để bắt đầu quản trị dữ liệu.</p>
              <button type="button" onClick={onOpenForm} className={styles.addBtn}>
                <MaterialIcon>add</MaterialIcon>
                {moduleConfig.primaryAction || 'Thêm item'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
