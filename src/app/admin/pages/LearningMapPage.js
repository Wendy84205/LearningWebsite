'use client'

import { useState, useMemo } from 'react'
import styles from './LearningMapPage.module.css'

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

export default function LearningMapPage({
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
  onImportCms,
  onSyncStaticCms
}) {
  const moduleMetrics = moduleData?.metrics || {}
  const liveMetrics = [
    ['Phụ huynh', moduleMetrics.totalParents ?? stats.totalParents ?? parents.length ?? 0],
    ['Học sinh', moduleMetrics.totalStudents ?? stats.totalStudents ?? students.length ?? 0],
    ['CMS items', moduleMetrics.totalItems ?? allItems.length ?? 0],
    ['Tổng sao', moduleMetrics.totalStars ?? stats.totalStars ?? 0]
  ]

  const rows = useMemo(() => {
    if (allItems.length > 0) {
      return allItems.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        meta: `${item.type} • ${item.status}`,
        detail: [item.grade, item.subject, item.topic, item.skill].filter(Boolean).join(' / ') || 'learning-map',
        desc: item.data?.description || item.data?.content || item.difficulty || 'Chưa có mô tả'
      }))
    }

    return (moduleConfig.cards || []).map(([title, meta, desc], index) => ({
      id: `learningMap-${index}`,
      title,
      meta,
      detail: moduleConfig.chips?.[index % moduleConfig.chips.length] || '',
      desc
    }))
  }, [allItems, moduleConfig])

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
            {moduleConfig.primaryAction || 'Thêm node bản đồ'}
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

      {/* Learning Map Visual Builder Canvas */}
      <div className={styles.stitchMapGrid}>
        <div className={styles.mapCanvas}>
          {[
            ['World 1', 'public', 0],
            ['Stage 1.1', 'route', 1],
            ['Level 1', 'flag', 2],
            ['Boss', 'workspace_premium', 3],
          ].map(([label, icon, index]) => (
            <article key={label} className={styles.mapNode} style={{ '--node-step': index }}>
              <MaterialIcon filled={index === 0}>{icon}</MaterialIcon>
              <div>
                <h3>{label}</h3>
                <p>{rows[index]?.title || moduleConfig.chips?.[index]}</p>
              </div>
            </article>
          ))}
        </div>
        <aside className={styles.mapInspector}>
          <h3>Node Inspector</h3>
          <p>World, Stage, Level, Boss và Reward được quản lý bằng CMS records thật.</p>
          <div className={styles.inspectorChips}>
            {(moduleConfig.chips || []).slice(0, 4).map(chip => <span key={chip}>{chip}</span>)}
          </div>
        </aside>
      </div>

      <div className={styles.modulePanel}>
        <div className={styles.modulePanelHeader}>
          <div>
            <h3>Learning Map Records</h3>
            <p>CRUD dữ liệu CMS thật trong DB, tách theo loại thực thể bản đồ học tập</p>
          </div>
          <div className={styles.moduleActions}>
            <button type="button" onClick={onOpenForm} className={styles.addBtn}>
              <MaterialIcon>add</MaterialIcon>
              {moduleConfig.primaryAction || 'Thêm node'}
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
            {onSyncStaticCms && (
              <button type="button" onClick={onSyncStaticCms} className={styles.refreshBtn}>
                <MaterialIcon>sync</MaterialIcon>
                Sync chương trình
              </button>
            )}
          </div>
        </div>

        <div className={styles.cmsToolbar}>
          <div className={styles.searchBox}>
            <MaterialIcon>search</MaterialIcon>
            <input
              type="text"
              placeholder="Tìm trong Learning Map..."
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
            <div className={styles.loader}><div className={styles.spinner} /> Đang tải Learning Map...</div>
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
              <span>
                <MaterialIcon filled>map</MaterialIcon>
              </span>
              <strong>Chưa có node nào</strong>
              <p>Tạo node đầu tiên để vẽ bản đồ học tập.</p>
              <button type="button" onClick={onOpenForm} className={styles.addBtn}>
                <MaterialIcon>add</MaterialIcon>
                {moduleConfig.primaryAction || 'Thêm node'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
