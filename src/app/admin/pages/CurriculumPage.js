'use client'

import styles from './CurriculumPage.module.css'

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

function getPreviewRows(items, moduleConfig) {
  if (items.length > 0) {
    return items.slice(0, 6).map(item => ({
      id: item.id,
      title: item.title,
      meta: `${item.type} • ${item.status}`,
      detail: [item.grade, item.subject, item.topic, item.skill].filter(Boolean).join(' / ') || moduleConfig.module,
      desc: item.data?.description || item.data?.content || item.difficulty || 'Chưa có mô tả'
    }))
  }

  return moduleConfig.cards.map(([title, meta, desc], index) => ({
    id: `${moduleConfig.module}-${index}`,
    title,
    meta,
    detail: moduleConfig.chips[index % moduleConfig.chips.length],
    desc
  }))
}

export default function CurriculumPage({
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
  const previewRows = getPreviewRows(allItems, moduleConfig)
  const moduleMetrics = moduleData?.metrics || {}
  const liveMetrics = [
    ['Phụ huynh', moduleMetrics.totalParents ?? stats.totalParents ?? parents.length ?? 0],
    ['Học sinh', moduleMetrics.totalStudents ?? stats.totalStudents ?? students.length ?? 0],
    ['CMS items', moduleMetrics.totalItems ?? allItems.length ?? 0],
    ['Bài học', moduleMetrics.typeCounts?.lesson ?? stats.totalLessons ?? 0]
  ]

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>Quản lý Học liệu</h1>
          <p>Manage curriculum structure, topics, and lessons theo đúng layout Stitch Curriculum.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={onOpenForm} className={styles.addBtn}>
            <MaterialIcon>add</MaterialIcon>
            Add New
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
            <strong>{formatNumber(value)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.stitchCurriculumGrid}>
        <aside className={styles.stitchStructurePane}>
          <h3>Structure</h3>
          {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'].map((grade, index) => (
            <div key={grade} className={`${styles.structureNode} ${index === 0 ? styles.structureNodeActive : ''}`}>
              <div>
                <MaterialIcon filled={index === 0}>{index === 0 ? 'folder_open' : 'folder'}</MaterialIcon>
                <span>{grade}</span>
              </div>
              <MaterialIcon>chevron_right</MaterialIcon>
            </div>
          ))}
          <div className={styles.structureSubjects}>
            {['Toán', 'Tiếng Việt', 'Tự nhiên & Xã hội'].map((subject, index) => (
              <span key={subject} className={index === 0 ? styles.structureSubjectActive : ''}>{subject}</span>
            ))}
          </div>
        </aside>

        <div className={styles.stitchHierarchyPane}>
          <div className={styles.hierarchyHeader}>
            <div>
              <span>Lớp 1</span>
              <MaterialIcon>chevron_right</MaterialIcon>
              <span>Toán</span>
              <MaterialIcon>chevron_right</MaterialIcon>
              <strong>Chủ đề học tập</strong>
            </div>
            <small>{previewRows.length} topics</small>
          </div>
          <div className={styles.hierarchyList}>
            {previewRows.map((row, index) => (
              <article key={row.id} className={styles.hierarchyItem}>
                <MaterialIcon>drag_indicator</MaterialIcon>
                <span className={styles.hierarchyIcon}>
                  <MaterialIcon filled>topic</MaterialIcon>
                </span>
                <div>
                  <h4>{row.title}</h4>
                  <p>{row.meta} • {row.detail}</p>
                </div>
                <div className={styles.hierarchyActions}>
                  <MaterialIcon>edit</MaterialIcon>
                  <MaterialIcon>content_copy</MaterialIcon>
                  <MaterialIcon>{index === 0 ? 'expand_more' : 'chevron_right'}</MaterialIcon>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.modulePanel}>
        <div className={styles.modulePanelHeader}>
          <div>
            <h3>Curriculum Records</h3>
            <p>CRUD dữ liệu học liệu thật trong DB, tách theo grade/subject/topic/skill/lesson.</p>
          </div>
          <div className={styles.moduleActions}>
            <button type="button" onClick={onOpenForm} className={styles.addBtn}>
              <MaterialIcon>add</MaterialIcon>
              {moduleConfig.primaryAction || 'Thêm nội dung'}
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
              placeholder="Search curriculum, grades..."
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
            <div className={styles.dynamicFieldGrid}>
              {moduleConfig.dataFields?.map(field => (
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
            <div className={styles.loader}><div className={styles.spinner} /> Đang tải Curriculum...</div>
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
              <span><MaterialIcon>menu_book</MaterialIcon></span>
              <strong>Chưa có curriculum record nào</strong>
              <p>Tạo grade, subject, topic, skill hoặc lesson đầu tiên để bắt đầu quản trị học liệu.</p>
              <button type="button" onClick={onOpenForm} className={styles.addBtn}>
                <MaterialIcon>add</MaterialIcon>
                {moduleConfig.primaryAction || 'Thêm nội dung'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
