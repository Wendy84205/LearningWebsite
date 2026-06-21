'use client'

import { useState, useMemo } from 'react'
import styles from './AiGeneratorPage.module.css'

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

export default function AiGeneratorPage({
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

  const rows = useMemo(() => {
    if (allItems.length > 0) {
      return allItems.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        meta: `${item.type} • ${item.status}`,
        detail: [item.grade, item.subject, item.topic, item.skill].filter(Boolean).join(' / ') || 'aiGenerator',
        desc: item.data?.description || item.data?.content || item.difficulty || 'Chưa có mô tả'
      }))
    }

    return (moduleConfig.cards || []).map(([title, meta, desc], index) => ({
      id: `ai-${index}`,
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

      {/* AI Generator Grid */}
      <div className={styles.stitchAiGrid}>
        <aside className={styles.aiParamsCard}>
          <h3><MaterialIcon>tune</MaterialIcon> Target Parameters</h3>
          <div className={styles.gradePicker}>
            {['1', '2', '3', '4', '5'].map((grade, index) => (
              <button key={grade} className={index === 0 ? styles.gradeActive : ''}>
                {grade}
              </button>
            ))}
          </div>
          <label>Subject</label>
          <select defaultValue="vietnamese">
            <option value="math">Mathematics</option>
            <option value="vietnamese">Vietnamese</option>
            <option value="science">Science</option>
          </select>
          <label>Output Requirements</label>
          {['Lesson Summary', 'Examples (3)', 'Multiple Choice Questions (5)', 'Matching Exercise'].map((label, index) => (
            <span key={label} className={styles.checkLine}>
              <input type="checkbox" defaultChecked={index < 3} readOnly /> {label}
            </span>
          ))}
          <button
            type="button"
            className={styles.aiGenerateBtn}
            onClick={() => onModuleAction?.(null, 'generate-ai-draft', {
              title: 'AI Draft - Tiếng Việt lớp 1',
              prompt: form.data?.prompt || 'Tạo bài học Tiếng Việt lớp 1 về từ vựng và phát âm',
              grade: 'lop-1',
              subject: 'Tiếng Việt',
              topic: 'Từ vựng & Phát âm'
            })}
          >
            <MaterialIcon filled>auto_awesome</MaterialIcon> Generate with AI
          </button>
        </aside>
        <article className={styles.aiDraftCard}>
          <div className={styles.aiDraftHeader}>
            <h3><MaterialIcon>edit_document</MaterialIcon> Draft Content</h3>
            <span>Unsaved</span>
          </div>
          <div className={styles.aiDraftBody}>
            <h2>Bài học: Từ vựng lớp 1</h2>
            <p>Grade 1 • Vietnamese • Vocabulary Building</p>
            {rows.slice(0, 3).map(row => (
              <section key={row.id}>
                <h4>{row.title}</h4>
                <p>{row.desc}</p>
              </section>
            ))}
          </div>
        </article>
      </div>

      <div className={styles.modulePanel}>
        <div className={styles.modulePanelHeader}>
          <div>
            <h3>AI Generator Records</h3>
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
              placeholder="Tìm trong AI Generator..."
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
            <div className={styles.loader}><div className={styles.spinner} /> Đang tải AI Generator...</div>
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
                <MaterialIcon filled>auto_awesome</MaterialIcon>
              </span>
              <strong>Chưa có câu hỏi/bài học sinh bằng AI nào</strong>
              <p>Tạo record đầu tiên cho module này để bắt đầu lưu trữ.</p>
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
