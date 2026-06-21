'use client'

import { useMemo, useState } from 'react'
import styles from './QuestionsPage.module.css'

const GRADES_MAP = {
  'lop-1': 'Lớp 1',
  'lop-2': 'Lớp 2',
  'lop-3': 'Lớp 3',
  'lop-4': 'Lớp 4',
  'lop-5': 'Lớp 5'
}

const QUESTION_TYPES = [
  ['choose_1_of_2', 'Choose 1 of 2'],
  ['multiple_choice', 'Multiple Choice'],
  ['matching', 'Matching'],
  ['listen_select', 'Listen & Select'],
  ['drag_drop', 'Drag & Drop']
]

const DIFFICULTIES = ['1', '2', '3', 'easy', 'medium', 'hard']
const STATUSES = [
  ['draft', 'Draft'],
  ['review', 'Review'],
  ['published', 'Published'],
  ['archived', 'Archived']
]
const GAME_TYPES = ['choose_1_of_2', 'quiz', 'multiple_choice', 'matching', 'listen_select', 'drag_drop']
const SUBJECTS = ['Toán', 'Tiếng Việt', 'Tự nhiên & Xã hội', 'Chung']

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

function getQuestionText(question) {
  return question.question || question.q || question.word || question.left || ''
}

function getQuestionOptions(question) {
  if (Array.isArray(question.answers) && question.answers.length) {
    return question.answers.map(answer => answer.text).filter(Boolean)
  }

  if (Array.isArray(question.options)) return question.options
  if (Array.isArray(question.options_array)) return question.options_array
  if (question.type === 'matching' && (question.right || question.options)) return [question.right || question.options]

  if (typeof question.options === 'string') {
    try {
      const parsed = JSON.parse(question.options)
      if (Array.isArray(parsed)) return parsed
    } catch {}
    return question.options.split(',').map(item => item.trim()).filter(Boolean)
  }

  return []
}

function getQuestionAnswers(question) {
  if (Array.isArray(question.answers) && question.answers.length) {
    return question.answers.map((answer, index) => ({
      id: answer.id || String.fromCharCode(65 + index),
      text: answer.text || '',
      isCorrect: Boolean(answer.isCorrect)
    }))
  }

  const options = getQuestionOptions(question)
  const correct = Number(question.correct || 0)
  return options.map((text, index) => ({
    id: String.fromCharCode(65 + index),
    text,
    isCorrect: index === correct
  }))
}

function getQuestionSubject(question, fallback = 'Chung') {
  return question.subject || question.subjectName || fallback
}

function getQuestionTopic(question, fallback = 'Chung') {
  return question.topic || question.levelTitle || fallback
}

function getTypeLabel(type) {
  return QUESTION_TYPES.find(item => item[0] === type)?.[1] || type || 'Question'
}

function createAnswer(index, text = '', isCorrect = false) {
  return { id: String.fromCharCode(65 + index), text, isCorrect }
}

function answersForType(type) {
  if (type === 'multiple_choice') {
    return [createAnswer(0, '', true), createAnswer(1), createAnswer(2), createAnswer(3)]
  }
  if (type === 'matching') return [createAnswer(0, '', true)]
  return [createAnswer(0, '', true), createAnswer(1)]
}

function defaultGameTypes(type) {
  if (type === 'choose_1_of_2') return ['choose_1_of_2', 'quiz']
  if (type === 'multiple_choice') return ['multiple_choice', 'quiz']
  return [type]
}

function createEmptyForm({ selectedGrade, selectedWorld, selectedLevel, activeLevel }) {
  return {
    id: '',
    grade: selectedGrade,
    worldId: selectedWorld,
    levelId: selectedLevel,
    type: 'choose_1_of_2',
    q: '',
    answers: answersForType('choose_1_of_2'),
    subject: 'Toán',
    topic: activeLevel?.title || 'Chung',
    skill: '',
    difficulty: '1',
    explanation: '',
    imageUrl: '',
    audioUrl: '',
    gameTypes: ['choose_1_of_2', 'quiz'],
    status: 'published',
    emoji: '❓',
    tags: ''
  }
}

function createFormFromQuestion(question, fallback) {
  const type = question.type || 'choose_1_of_2'
  const answers = getQuestionAnswers(question)
  const normalizedAnswers = answers.length ? answers : answersForType(type)

  return {
    ...createEmptyForm(fallback),
    id: question.id || '',
    grade: question.grade || fallback.selectedGrade,
    worldId: question.worldId || question.world || fallback.selectedWorld,
    levelId: question.levelId || question.level || fallback.selectedLevel,
    type,
    q: getQuestionText(question),
    answers: normalizedAnswers,
    subject: getQuestionSubject(question),
    topic: getQuestionTopic(question, fallback.activeLevel?.title || 'Chung'),
    skill: question.skill || '',
    difficulty: String(question.difficulty || '1'),
    explanation: question.explanation || '',
    imageUrl: question.imageUrl || '',
    audioUrl: question.audioUrl || '',
    gameTypes: Array.isArray(question.gameTypes) && question.gameTypes.length ? question.gameTypes : defaultGameTypes(type),
    status: question.status || 'published',
    emoji: question.emoji || '❓',
    tags: question.tags || ''
  }
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function QuestionPreview({ question }) {
  const answers = getQuestionAnswers(question)

  return (
    <article className={styles.previewQuestionCard}>
      <div className={styles.previewQuestionTop}>
        <span className={styles.typePill}>{getTypeLabel(question.type)}</span>
        <span className={question.status === 'published' ? styles.statusPublished : styles.statusDraft}>
          {question.status || 'published'}
        </span>
      </div>
      <h3>{getQuestionText(question)}</h3>
      <div className={styles.previewAnswers}>
        {answers.map(answer => (
          <div key={answer.id} className={answer.isCorrect ? styles.answerCorrect : styles.answerItem}>
            <strong>{answer.id}</strong>
            <span>{answer.text}</span>
            {answer.isCorrect && <MaterialIcon>check_circle</MaterialIcon>}
          </div>
        ))}
      </div>
      {question.explanation && (
        <p className={styles.previewExplanation}>{question.explanation}</p>
      )}
    </article>
  )
}

export default function QuestionsPage({
  selectedGrade,
  setSelectedGrade,
  selectedWorld,
  setSelectedWorld,
  selectedLevel,
  setSelectedLevel,
  availableWorlds,
  availableLevels,
  activeWorld,
  activeLevel,
  questions,
  loading,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  getGradeData,
  showToast
}) {
  const formContext = { selectedGrade, selectedWorld, selectedLevel, activeLevel }
  const [filters, setFilters] = useState({
    q: '',
    type: 'all',
    subject: 'all',
    topic: 'all',
    skill: 'all',
    difficulty: 'all',
    status: 'all'
  })
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [form, setForm] = useState(() => createEmptyForm(formContext))
  const [previewQuestion, setPreviewQuestion] = useState(null)

  const allQuestions = useMemo(() => [
    ...(questions.customQuestions || []),
    ...(questions.staticQuestions || [])
  ], [questions])

  const filterOptions = useMemo(() => {
    const unique = (field) => Array.from(new Set(allQuestions.map(item => item[field]).filter(Boolean))).sort()
    return {
      subjects: Array.from(new Set([...SUBJECTS, ...unique('subject')])),
      topics: unique('topic'),
      skills: unique('skill'),
      difficulties: Array.from(new Set([...DIFFICULTIES, ...unique('difficulty').map(String)])),
      statuses: Array.from(new Set(['published', 'draft', 'review', 'archived', ...unique('status')])),
      types: Array.from(new Set(QUESTION_TYPES.map(item => item[0]).concat(unique('type'))))
    }
  }, [allQuestions])

  const visibleQuestions = useMemo(() => allQuestions.filter(question => {
    const text = [
      getQuestionText(question),
      getQuestionOptions(question).join(' '),
      getQuestionSubject(question),
      getQuestionTopic(question),
      question.skill,
      question.explanation,
      question.tags
    ].join(' ').toLowerCase()
    const query = filters.q.trim().toLowerCase()
    if (query && !text.includes(query)) return false
    if (filters.type !== 'all' && question.type !== filters.type) return false
    if (filters.subject !== 'all' && getQuestionSubject(question) !== filters.subject) return false
    if (filters.topic !== 'all' && getQuestionTopic(question) !== filters.topic) return false
    if (filters.skill !== 'all' && question.skill !== filters.skill) return false
    if (filters.difficulty !== 'all' && String(question.difficulty || '') !== filters.difficulty) return false
    if (filters.status !== 'all' && (question.status || 'published') !== filters.status) return false
    return true
  }), [allQuestions, filters])

  const customVisible = visibleQuestions.filter(question => !question.isStatic)
  const staticVisible = visibleQuestions.filter(question => question.isStatic)
  const publishedCount = allQuestions.filter(question => (question.status || 'published') === 'published').length

  const openCreateForm = () => {
    setFormMode('create')
    setForm(createEmptyForm(formContext))
    setFormOpen(true)
  }

  const openEditForm = (question) => {
    setFormMode('edit')
    setForm(createFormFromQuestion(question, formContext))
    setFormOpen(true)
  }

  const updateFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }))
  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const updateType = (type) => {
    setForm(prev => ({
      ...prev,
      type,
      answers: answersForType(type),
      gameTypes: defaultGameTypes(type)
    }))
  }

  const updateAnswer = (index, patch) => {
    setForm(prev => ({
      ...prev,
      answers: prev.answers.map((answer, answerIndex) => {
        if (answerIndex !== index) return patch.isCorrect ? { ...answer, isCorrect: false } : answer
        return { ...answer, ...patch }
      })
    }))
  }

  const addAnswer = () => {
    setForm(prev => ({
      ...prev,
      answers: [...prev.answers, createAnswer(prev.answers.length)]
    }))
  }

  const removeAnswer = (index) => {
    setForm(prev => {
      const answers = prev.answers.filter((_, answerIndex) => answerIndex !== index)
        .map((answer, answerIndex) => ({ ...answer, id: String.fromCharCode(65 + answerIndex) }))
      return { ...prev, answers: answers.length ? answers : answersForType(prev.type) }
    })
  }

  const toggleGameType = (gameType) => {
    setForm(prev => ({
      ...prev,
      gameTypes: prev.gameTypes.includes(gameType)
        ? prev.gameTypes.filter(item => item !== gameType)
        : [...prev.gameTypes, gameType]
    }))
  }

  const submitForm = async (event) => {
    event.preventDefault()
    const cleanedAnswers = form.answers.filter(answer => answer.text.trim())
    if (!form.q.trim() || cleanedAnswers.length === 0) {
      showToast('Cần nhập nội dung câu hỏi và đáp án', 'error')
      return
    }

    const payload = {
      ...form,
      answers: cleanedAnswers,
      correctAnswer: cleanedAnswers.find(answer => answer.isCorrect)?.id || cleanedAnswers[0]?.id || 'A',
      grade: selectedGrade,
      worldId: selectedWorld,
      levelId: selectedLevel
    }

    if (formMode === 'edit') await onEditQuestion(payload)
    else await onAddQuestion(payload)
    setFormOpen(false)
  }

  const duplicateQuestion = async (question) => {
    await onDuplicateQuestion(createFormFromQuestion(question, formContext))
  }

  const exportQuestionsCSV = () => {
    const headers = [
      'id', 'grade', 'subject', 'topic', 'skill', 'type', 'difficulty', 'question',
      'answers', 'correctAnswer', 'explanation', 'imageUrl', 'audioUrl', 'gameTypes', 'status'
    ]
    const rows = visibleQuestions.map(question => [
      question.id || '',
      selectedGrade,
      getQuestionSubject(question),
      getQuestionTopic(question),
      question.skill || '',
      question.type || '',
      question.difficulty || '',
      getQuestionText(question),
      getQuestionAnswers(question).map(answer => `${answer.id}:${answer.text}`).join(' | '),
      getQuestionAnswers(question).find(answer => answer.isCorrect)?.id || 'A',
      question.explanation || '',
      question.imageUrl || '',
      question.audioUrl || '',
      Array.isArray(question.gameTypes) ? question.gameTypes.join('|') : '',
      question.status || 'published'
    ])
    const csvContent = [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hocvui_question_bank_${selectedGrade}_w${selectedWorld}_l${selectedLevel}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Đã xuất Question Bank CSV')
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>Question Bank</h1>
          <p>Kho câu hỏi trung tâm cho Game, Learning Map, Bài tập, Kiểm tra và AI Generator.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={() => showToast('Import Excel sẽ làm sau khi CRUD/filter ổn định', 'info')} className={styles.refreshBtn}>
            <MaterialIcon>upload_file</MaterialIcon>
            Import Excel
          </button>
          <button type="button" onClick={exportQuestionsCSV} className={styles.exportBtn}>
            <MaterialIcon>download</MaterialIcon>
            Export
          </button>
          <button type="button" onClick={openCreateForm} className={styles.addBtn}>
            <MaterialIcon>add</MaterialIcon>
            Thêm câu hỏi
          </button>
        </div>
      </div>

      <div className={styles.questionBankStats}>
        <article>
          <MaterialIcon>quiz</MaterialIcon>
          <span>Tổng câu hỏi</span>
          <strong>{allQuestions.length}</strong>
        </article>
        <article>
          <MaterialIcon>edit_note</MaterialIcon>
          <span>Admin</span>
          <strong>{questions.customQuestions?.length || 0}</strong>
        </article>
        <article>
          <MaterialIcon>menu_book</MaterialIcon>
          <span>Hệ thống</span>
          <strong>{questions.staticQuestions?.length || 0}</strong>
        </article>
        <article>
          <MaterialIcon>published_with_changes</MaterialIcon>
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </article>
      </div>

      <div className={styles.questionFilter}>
        <div className={styles.filterGroup}>
          <label><MaterialIcon className={styles.inputLabelIcon}>school</MaterialIcon> Lớp</label>
          <select value={selectedGrade} onChange={event => {
            setSelectedGrade(event.target.value)
            const nextGradeData = getGradeData(event.target.value)
            const nextWorld = nextGradeData.WORLDS?.[0]
            setSelectedWorld(nextWorld?.id || 1)
            setSelectedLevel(nextWorld?.levels?.[0]?.id || 1)
          }}>
            {Object.entries(GRADES_MAP).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label><MaterialIcon className={styles.inputLabelIcon}>public</MaterialIcon> World</label>
          <select value={activeWorld?.id || selectedWorld} onChange={event => {
            const worldId = Number.parseInt(event.target.value, 10)
            const nextWorld = availableWorlds.find(world => world.id === worldId)
            setSelectedWorld(worldId)
            setSelectedLevel(nextWorld?.levels?.[0]?.id || 1)
          }}>
            {availableWorlds.map(world => <option key={world.id} value={world.id}>World {world.id}: {world.name}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label><MaterialIcon className={styles.inputLabelIcon}>flag</MaterialIcon> Level</label>
          <select value={activeLevel?.id || selectedLevel} onChange={event => setSelectedLevel(Number.parseInt(event.target.value, 10))}>
            {availableLevels.map(level => <option key={level.id} value={level.id}>Level {level.id}: {level.title}</option>)}
          </select>
        </div>
        <div className={`${styles.filterGroup} ${styles.questionSearchGroup}`}>
          <label><MaterialIcon className={styles.inputLabelIcon}>search</MaterialIcon> Tìm kiếm</label>
          <input value={filters.q} onChange={event => updateFilter('q', event.target.value)} placeholder="Tìm câu hỏi, đáp án, skill, giải thích..." />
        </div>
        <div className={styles.filterGroup}>
          <label>Loại câu hỏi</label>
          <select value={filters.type} onChange={event => updateFilter('type', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.types.map(type => <option key={type} value={type}>{getTypeLabel(type)}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Môn học</label>
          <select value={filters.subject} onChange={event => updateFilter('subject', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Chủ đề</label>
          <select value={filters.topic} onChange={event => updateFilter('topic', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Kỹ năng</label>
          <select value={filters.skill} onChange={event => updateFilter('skill', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.skills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Độ khó</label>
          <select value={filters.difficulty} onChange={event => updateFilter('difficulty', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.difficulties.map(difficulty => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Trạng thái</label>
          <select value={filters.status} onChange={event => updateFilter('status', event.target.value)}>
            <option value="all">Tất cả</option>
            {filterOptions.statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className={styles.questionSummary}>
          <span className={styles.qCountCustom}>Admin: {customVisible.length}/{questions.customQuestions?.length || 0}</span>
          <span className={styles.qCountSystem}>Hệ thống: {staticVisible.length}/{questions.staticQuestions?.length || 0}</span>
          <span className={styles.qCountLesson}>{activeLevel?.title || `Level ${selectedLevel}`}</span>
        </div>
      </div>

      {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tải Question Bank...</div> : (
        <div className={styles.questionTableCard}>
          <div className={styles.tableHeader}>
            <div>
              <span>Data table</span>
              <h2>{visibleQuestions.length} câu hỏi đang hiển thị</h2>
            </div>
            <button type="button" onClick={() => setPreviewQuestion(visibleQuestions[0] || null)} disabled={visibleQuestions.length === 0} className={styles.refreshBtn}>
              <MaterialIcon>visibility</MaterialIcon>
              Preview đầu tiên
            </button>
          </div>
          <div className={styles.questionTableWrap}>
            <table className={styles.questionTable}>
              <thead>
                <tr>
                  <th>Câu hỏi</th>
                  <th>Phân loại</th>
                  <th>Kỹ năng</th>
                  <th>Đáp án</th>
                  <th>Trạng thái</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuestions.map(question => {
                  const answers = getQuestionAnswers(question)
                  return (
                    <tr key={`${question.isStatic ? 'static' : 'custom'}-${question.id}`}>
                      <td>
                        <div className={styles.questionCell}>
                          <span className={question.isStatic ? styles.sourceSystem : styles.sourceAdmin}>{question.isStatic ? 'System' : 'Admin'}</span>
                          <strong>{getQuestionText(question)}</strong>
                          <small>{question.explanation || 'Chưa có giải thích'}</small>
                        </div>
                      </td>
                      <td>
                        <span className={styles.typePill}>{getTypeLabel(question.type)}</span>
                        <small>{getQuestionSubject(question)} · {getQuestionTopic(question)}</small>
                      </td>
                      <td>
                        <strong>{question.skill || 'Chưa gắn skill'}</strong>
                        <small>Độ khó {question.difficulty || '1'}</small>
                      </td>
                      <td>
                        <div className={styles.answerMiniList}>
                          {answers.slice(0, 3).map(answer => (
                            <span key={answer.id} className={answer.isCorrect ? styles.answerMiniCorrect : ''}>{answer.id}. {answer.text}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={(question.status || 'published') === 'published' ? styles.statusPublished : styles.statusDraft}>
                          {question.status || 'published'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button type="button" onClick={() => setPreviewQuestion(question)} title="Preview"><MaterialIcon>visibility</MaterialIcon></button>
                          <button type="button" onClick={() => duplicateQuestion(question)} title="Duplicate"><MaterialIcon>content_copy</MaterialIcon></button>
                          {!question.isStatic && <button type="button" onClick={() => openEditForm(question)} title="Sửa"><MaterialIcon>edit</MaterialIcon></button>}
                          {!question.isStatic && <button type="button" onClick={() => onDeleteQuestion(question.id)} title="Xóa" className={styles.tableDangerBtn}><MaterialIcon>delete</MaterialIcon></button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {visibleQuestions.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className={styles.emptyQCard}>
                        <span><MaterialIcon>quiz</MaterialIcon></span>
                        <p>Không có câu hỏi khớp bộ lọc</p>
                        <button type="button" onClick={openCreateForm} className={styles.addBtn}>Thêm câu hỏi đầu tiên</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {previewQuestion && (
        <div className={styles.modalOverlay} onClick={() => setPreviewQuestion(null)}>
          <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={event => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2><MaterialIcon className={styles.modalTitleIcon}>visibility</MaterialIcon> Preview câu hỏi</h2>
              <button type="button" onClick={() => setPreviewQuestion(null)} className={styles.closeBtn}>x</button>
            </div>
            <div className={styles.previewMetaGrid}>
              <span>{previewQuestion.isStatic ? 'System' : 'Admin'}</span>
              <span>{getTypeLabel(previewQuestion.type)}</span>
              <span>{getQuestionSubject(previewQuestion)}</span>
              <span>{getQuestionTopic(previewQuestion)}</span>
            </div>
            <div className={styles.previewCardWrap}>
              <QuestionPreview question={previewQuestion} />
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className={styles.modalOverlay} onClick={() => setFormOpen(false)}>
          <div className={`${styles.modalContent} ${styles.largeModal}`} onClick={event => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <MaterialIcon className={styles.modalTitleIcon}>{formMode === 'edit' ? 'edit' : 'add_circle'}</MaterialIcon>
                {formMode === 'edit' ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className={styles.closeBtn}>x</button>
            </div>
            <div className={styles.modalMeta}>
              {GRADES_MAP[selectedGrade]} · {activeWorld?.name || `World ${selectedWorld}`} · {activeLevel?.title || `Level ${selectedLevel}`}
            </div>
            <form onSubmit={submitForm} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Loại câu hỏi</label>
                  <select value={form.type} onChange={event => updateType(event.target.value)}>
                    {QUESTION_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Trạng thái</label>
                  <select value={form.status} onChange={event => updateForm('status', event.target.value)}>
                    {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Môn học</label>
                  <select value={form.subject} onChange={event => updateForm('subject', event.target.value)}>
                    {SUBJECTS.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Độ khó</label>
                  <select value={form.difficulty} onChange={event => updateForm('difficulty', event.target.value)}>
                    {DIFFICULTIES.map(difficulty => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Nội dung câu hỏi</label>
                <textarea value={form.q} onChange={event => updateForm('q', event.target.value)} placeholder="Ví dụ: 3 + 2 = ?" required />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Chủ đề</label>
                  <input value={form.topic} onChange={event => updateForm('topic', event.target.value)} placeholder="addition" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Kỹ năng</label>
                  <input value={form.skill} onChange={event => updateForm('skill', event.target.value)} placeholder="add_within_10" />
                </div>
              </div>
              <div className={styles.answerBuilder}>
                <div className={styles.answerBuilderHeader}>
                  <label>Đáp án</label>
                  {form.type !== 'choose_1_of_2' && form.type !== 'matching' && (
                    <button type="button" onClick={addAnswer}><MaterialIcon>add</MaterialIcon> Thêm đáp án</button>
                  )}
                </div>
                {form.answers.map((answer, index) => (
                  <div key={answer.id} className={styles.answerEditorRow}>
                    <button type="button" onClick={() => updateAnswer(index, { isCorrect: true })} className={answer.isCorrect ? styles.correctToggleActive : styles.correctToggle}>
                      {answer.id}
                    </button>
                    <input value={answer.text} onChange={event => updateAnswer(index, { text: event.target.value })} placeholder={form.type === 'matching' ? 'Vế phải cần ghép' : `Đáp án ${answer.id}`} required />
                    {form.answers.length > 2 && <button type="button" onClick={() => removeAnswer(index)} className={styles.removeAnswerBtn}><MaterialIcon>close</MaterialIcon></button>}
                  </div>
                ))}
              </div>
              <div className={styles.inputGroup}>
                <label>Giải thích</label>
                <textarea value={form.explanation} onChange={event => updateForm('explanation', event.target.value)} placeholder="Giải thích ngắn gọn để học sinh/phụ huynh hiểu đáp án." />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Image URL</label>
                  <input value={form.imageUrl} onChange={event => updateForm('imageUrl', event.target.value)} placeholder="https://..." />
                </div>
                <div className={styles.inputGroup}>
                  <label>Audio URL</label>
                  <input value={form.audioUrl} onChange={event => updateForm('audioUrl', event.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className={styles.checkboxGroup}>
                <label>Game tương thích</label>
                <div>
                  {GAME_TYPES.map(gameType => (
                    <button
                      key={gameType}
                      type="button"
                      onClick={() => toggleGameType(gameType)}
                      className={form.gameTypes.includes(gameType) ? styles.gameTypeActive : styles.gameTypeBtn}
                    >
                      {gameType}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setFormOpen(false)} className={styles.cancelBtn}>Hủy</button>
                <button type="submit" className={styles.saveBtn}>
                  <MaterialIcon className={styles.btnIcon}>save</MaterialIcon>
                  {formMode === 'edit' ? 'Lưu thay đổi' : 'Tạo câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
