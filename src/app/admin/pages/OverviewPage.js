'use client'

import styles from './OverviewPage.module.css'

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

function formatDate(value) {
  if (!value) return 'Chưa lên lịch'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa lên lịch'

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const statusLabels = {
  draft: 'Draft',
  in_review: 'Review',
  scheduled: 'Scheduled',
  active: 'Published',
  disabled: 'Disabled',
  archived: 'Archived'
}

const actionLabels = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  modernize: 'Modernized',
  revision: 'Revision',
  'audit-log': 'Audit'
}

const moduleTabMap = {
  content: 'curriculum',
  curriculum: 'curriculum',
  questions: 'questions',
  games: 'games',
  'learning-map': 'learningMap',
  assignments: 'assignments',
  assessments: 'tests',
  tests: 'tests',
  achievements: 'achievements',
  reports: 'reports',
  'ai-studio': 'aiGenerator',
  ai: 'aiGenerator',
  media: 'media',
  settings: 'settings',
  roles: 'settings'
}

function getTabForModule(moduleName) {
  return moduleTabMap[moduleName] || 'curriculum'
}

function KpiCard({ label, value, icon, tone, change, trend = 'arrow_upward' }) {
  return (
    <article className={`${styles.dashboardKpiCard} ${styles[`dashboardKpi_${tone}`] || ''}`}>
      <div className={styles.dashboardKpiTop}>
        <span>{label}</span>
        <div className={styles.dashboardKpiIcon}>
          <MaterialIcon>{icon}</MaterialIcon>
        </div>
      </div>
      <strong>{formatNumber(value)}</strong>
      <div className={styles.dashboardKpiDelta}>
        <span className={trend === 'horizontal_rule' ? styles.neutralDelta : styles.goodDelta}>
          <MaterialIcon>{trend}</MaterialIcon>
          {change}
        </span>
        <small>dữ liệu thật</small>
      </div>
      <div className={styles.dashboardSparkline} aria-hidden="true" />
    </article>
  )
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

export default function OverviewPage({
  stats,
  loading,
  activityMetrics,
  subjectMetrics,
  subjectMax,
  completionMetrics,
  recentActivity,
  loadStats,
  setActiveTab,
  exportStudentsCSV
}) {
  const kpis = [
    { label: 'Total Students', value: stats.totalStudents, icon: 'group', tone: 'blue', change: `${stats.active30Days || 0} active` },
    { label: 'Total Parents', value: stats.totalParents, icon: 'family_restroom', tone: 'orange', change: `${stats.totalParents || 0} accounts` },
    { label: 'Total Questions', value: stats.totalQuestions, icon: 'quiz', tone: 'yellow', change: `${stats.totalCustomQuestions || 0} admin` },
    { label: 'Total Lessons', value: stats.totalLessons, icon: 'menu_book', tone: 'slate', change: `${stats.totalSubjects || 0} subjects`, trend: 'horizontal_rule' },
  ]
  const secondaryMetrics = [
    ['Tests', stats.totalTests || 0, 'checklist'],
    ['Games', stats.totalGames || 0, 'videogame_asset'],
    ['Learning Maps', stats.totalLearningMaps || 0, 'map'],
    ['Badges', stats.totalBadges || 0, 'workspace_premium'],
  ]
  const activityIcons = ['person_add', 'library_add', 'post_add', 'assignment']
  const activityStatuses = ['Completed', 'Published', 'Review', 'Ready']
  const cmsDashboard = stats.cmsDashboard || {}
  const cmsWorkflow = [
    ['Draft', cmsDashboard.statusCounts?.draft || 0, 'edit_note'],
    ['Review', cmsDashboard.statusCounts?.in_review || 0, 'rate_review'],
    ['Scheduled', cmsDashboard.scheduledItems || cmsDashboard.statusCounts?.scheduled || 0, 'event_upcoming'],
    ['Published', cmsDashboard.statusCounts?.active || 0, 'published_with_changes'],
  ]
  const cmsCoverage = [
    ['Governance', cmsDashboard.governanceCoverage ?? 0],
    ['SEO', cmsDashboard.seoCoverage ?? 0],
    ['Content types', cmsDashboard.contentTypeCoverage ?? 0],
    ['Quality', cmsDashboard.qualityScore ?? 0],
  ]
  const editorialBoard = cmsDashboard.editorialBoard || []
  const contentCalendar = cmsDashboard.contentCalendar || []
  const activityFeed = cmsDashboard.activityFeed || []
  const contentModels = cmsDashboard.contentModels || []
  const moduleHealth = cmsDashboard.moduleHealth || []

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back. Summary realtime từ hệ thống Học Vui.</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={loadStats} className={styles.refreshBtn}>
            <MaterialIcon>refresh</MaterialIcon>
            Làm mới
          </button>
          <button onClick={exportStudentsCSV} className={styles.exportBtn}>
            <MaterialIcon>download</MaterialIcon>
            Export Report
          </button>
        </div>
      </div>

      {loading ? <div className={styles.loader}><div className={styles.spinner} /> Đang tổng hợp...</div> : (
        <>
          <div className={styles.dashboardKpiGrid}>
            {kpis.map(item => <KpiCard key={item.label} {...item} />)}
          </div>

          <div className={styles.dashboardMiniStats}>
            {secondaryMetrics.map(([label, value, icon]) => (
              <div key={label}>
                <MaterialIcon>{icon}</MaterialIcon>
                <span>{label}</span>
                <strong>{formatNumber(value)}</strong>
              </div>
            ))}
          </div>

          <div className={styles.cmsDashboardPanel}>
            <div className={styles.cmsDashboardHeader}>
              <div>
                <span className={styles.cmsEyebrow}>Modern CMS Health</span>
                <h2>Content Governance Dashboard</h2>
                <p>Workflow, versioning, audit, SEO và content model coverage từ dữ liệu thật.</p>
              </div>
              <button type="button" onClick={() => setActiveTab('reports')}>
                <MaterialIcon>rule_settings</MaterialIcon>
                Quality Reports
              </button>
            </div>
            <div className={styles.cmsHealthGrid}>
              <article className={styles.cmsScoreCard}>
                <span>Quality Score</span>
                <strong>{cmsDashboard.qualityScore ?? 0}%</strong>
                <small>{formatNumber(cmsDashboard.totalItems || 0)} CMS items tracked</small>
              </article>
              <article className={styles.cmsScoreCard}>
                <span>Revisions</span>
                <strong>{formatNumber(cmsDashboard.revisionCount || 0)}</strong>
                <small>{formatNumber(cmsDashboard.auditLogCount || 0)} audit events</small>
              </article>
              <article className={styles.cmsScoreCard}>
                <span>Content Types</span>
                <strong>{formatNumber(cmsDashboard.contentTypeCount || 0)}/{formatNumber(cmsDashboard.contentTypeTotal || 0)}</strong>
                <small>{cmsDashboard.contentTypeCoverage || 0}% registry coverage</small>
              </article>
            </div>
            <div className={styles.cmsWorkflowGrid}>
              {cmsWorkflow.map(([label, value, icon]) => (
                <div key={label} className={styles.cmsWorkflowItem}>
                  <MaterialIcon>{icon}</MaterialIcon>
                  <span>{label}</span>
                  <strong>{formatNumber(value)}</strong>
                </div>
              ))}
            </div>
            <div className={styles.cmsCoverageGrid}>
              {cmsCoverage.map(([label, value]) => (
                <div key={label} className={styles.cmsCoverageItem}>
                  <div>
                    <span>{label}</span>
                    <strong>{value}%</strong>
                  </div>
                  <div className={styles.chartTrack}>
                    <div className={styles.chartFill} style={{ width: `${value}%`, background: value >= 80 ? '#10b981' : '#2563eb' }} />
                  </div>
                </div>
              ))}
            </div>
            {Array.isArray(cmsDashboard.qualityIssues) && cmsDashboard.qualityIssues.length > 0 && (
              <div className={styles.cmsIssueList}>
                {cmsDashboard.qualityIssues.slice(0, 4).map(issue => (
                  <button key={issue.id} type="button" onClick={() => setActiveTab('reports')}>
                    <MaterialIcon>warning</MaterialIcon>
                    <span>{issue.title}</span>
                    <small>{issue.warnings.join(', ')}</small>
                  </button>
                ))}
              </div>
            )}
            <div className={styles.cmsOpsGrid}>
              <article className={`${styles.cmsOpsCard} ${styles.cmsOpsCardWide}`}>
                <div className={styles.cmsOpsHeader}>
                  <div>
                    <span>Editorial workflow</span>
                    <h3>Production Board</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab('curriculum')}>
                    <MaterialIcon>view_kanban</MaterialIcon>
                    Open CMS
                  </button>
                </div>
                <div className={styles.editorialBoard}>
                  {editorialBoard.map(column => (
                    <div key={column.status} className={styles.editorialColumn} data-status={column.status}>
                      <div className={styles.editorialColumnHeader}>
                        <span>{statusLabels[column.status] || column.status}</span>
                        <strong>{formatNumber(column.count)}</strong>
                      </div>
                      <div className={styles.editorialItems}>
                        {column.items?.length ? column.items.map(item => (
                          <button key={item.id} type="button" onClick={() => setActiveTab(getTabForModule(item.module))}>
                            <strong>{item.title}</strong>
                            <span>{item.module} · {item.type}</span>
                          </button>
                        )) : (
                          <div className={styles.cmsEmptyState}>Không có item</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className={styles.cmsOpsCard}>
                <div className={styles.cmsOpsHeader}>
                  <div>
                    <span>Publishing</span>
                    <h3>Content Calendar</h3>
                  </div>
                  <MaterialIcon>event_note</MaterialIcon>
                </div>
                <div className={styles.calendarList}>
                  {contentCalendar.length ? contentCalendar.map(item => (
                    <button key={item.id} type="button" onClick={() => setActiveTab(getTabForModule(item.module))}>
                      <span>{formatDate(item.scheduledAt)}</span>
                      <strong>{item.title}</strong>
                      <small>{item.module} · {item.status}</small>
                    </button>
                  )) : (
                    <div className={styles.cmsEmptyState}>Chưa có lịch xuất bản</div>
                  )}
                </div>
              </article>
            </div>

            <div className={styles.cmsOpsGrid}>
              <article className={styles.cmsOpsCard}>
                <div className={styles.cmsOpsHeader}>
                  <div>
                    <span>Governance</span>
                    <h3>Audit & Revision Feed</h3>
                  </div>
                  <MaterialIcon>history</MaterialIcon>
                </div>
                <div className={styles.activityFeed}>
                  {activityFeed.length ? activityFeed.map(event => (
                    <div key={event.id} className={styles.activityFeedItem}>
                      <span>{actionLabels[event.action] || event.action}</span>
                      <strong>{event.itemTitle}</strong>
                      <small>{formatDate(event.createdAt)} · {event.actor}</small>
                    </div>
                  )) : (
                    <div className={styles.cmsEmptyState}>Chưa có audit log</div>
                  )}
                </div>
              </article>

              <article className={`${styles.cmsOpsCard} ${styles.cmsOpsCardWide}`}>
                <div className={styles.cmsOpsHeader}>
                  <div>
                    <span>Content architecture</span>
                    <h3>Model Registry & Module Health</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab('settings')}>
                    <MaterialIcon>schema</MaterialIcon>
                    Registry
                  </button>
                </div>
                <div className={styles.modelAndModuleGrid}>
                  <div className={styles.contentModelGrid}>
                    {contentModels.slice(0, 6).map(model => (
                      <div key={model.id || model.key} className={styles.contentModelCard}>
                        <span>{model.module} · {model.type}</span>
                        <strong>{model.label}</strong>
                        <small>{model.required?.length || 0} required · {model.fields?.length || 0} fields</small>
                      </div>
                    ))}
                  </div>
                  <div className={styles.moduleHealthList}>
                    {moduleHealth.length ? moduleHealth.map(module => (
                      <div key={module.module} className={styles.moduleHealthItem}>
                        <div>
                          <span>{module.module}</span>
                          <strong>{formatNumber(module.count)}</strong>
                        </div>
                        <div className={styles.chartTrack}>
                          <div className={styles.chartFill} style={{ width: `${module.percent}%`, background: '#005da7' }} />
                        </div>
                      </div>
                    )) : (
                      <div className={styles.cmsEmptyState}>Chưa có module CMS</div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className={styles.dashboardChartGrid}>
            <article className={`${styles.analyticsCard} ${styles.chartCardWide}`}>
              <div className={styles.chartCardHeader}>
                <h3>Active Students per Window</h3>
                <select defaultValue="last90">
                  <option value="last90">Last 90 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last7">Last 7 Days</option>
                </select>
              </div>
              <MiniLineChart metrics={activityMetrics} />
            </article>

            <article className={styles.analyticsCard}>
              <div className={styles.chartCardHeader}>
                <h3>Most Studied Subjects</h3>
              </div>
              <div className={styles.subjectBarList}>
                {subjectMetrics.slice(0, 4).map(item => (
                  <div key={item.label} className={styles.subjectBarItem}>
                    <div>
                      <span>{item.label}</span>
                      <strong>{formatNumber(item.value)}</strong>
                    </div>
                    <div className={styles.chartTrack}>
                      <div
                        className={styles.chartFill}
                        style={{ width: `${Math.max(((item.value || 0) / subjectMax) * 100, item.value > 0 ? 8 : 0)}%`, background: '#2563eb' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className={styles.dashboardChartGrid}>
            <article className={styles.analyticsCard}>
              <div className={styles.chartCardHeader}>
                <h3>World Completion</h3>
              </div>
              <div className={styles.completionGrid}>
                {completionMetrics.slice(0, 3).map(item => (
                  <div key={item.label} className={styles.completionItem}>
                    <strong>{item.percent || 0}%</strong>
                    <span>{item.label}</span>
                    <div className={styles.chartTrack}>
                      <div className={styles.chartFill} style={{ width: `${item.percent || 0}%`, background: '#10b981' }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.analyticsCard} ${styles.chartCardWide}`}>
              <div className={styles.chartCardHeader}>
                <h3>Recent Activity</h3>
                <button type="button" onClick={() => setActiveTab('reports')}>View All</button>
              </div>
              <div className={styles.activityTableWrap}>
                <table className={styles.activityTable}>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Type</th>
                      <th>Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.slice(0, 4).map((item, index) => (
                      <tr key={`${item.label}-${item.meta}`}>
                        <td>
                          <div className={styles.activityCell}>
                            <span>
                              <MaterialIcon>{activityIcons[index] || 'history'}</MaterialIcon>
                            </span>
                            <div>
                              <strong>{item.label}</strong>
                              <small>{item.meta}</small>
                            </div>
                          </div>
                        </td>
                        <td>{item.label.includes('Học sinh') ? 'User' : 'Content'}</td>
                        <td>Admin API</td>
                        <td><span className={styles.tableStatus}>{activityStatuses[index] || 'Ready'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <div className={styles.quickActions}>
            <h3 className={styles.cardTitle}>Thao tác nhanh</h3>
            <div className={styles.quickGrid}>
              <button className={styles.quickBtn} onClick={() => setActiveTab('students')}>
                <MaterialIcon>group</MaterialIcon><span>Quản lý học sinh</span>
              </button>
              <button className={styles.quickBtn} onClick={() => setActiveTab('parents')}>
                <MaterialIcon>family_restroom</MaterialIcon><span>Quản lý phụ huynh</span>
              </button>
              <button className={styles.quickBtn} onClick={() => setActiveTab('questions')}>
                <MaterialIcon>add_circle</MaterialIcon><span>Thêm câu hỏi</span>
              </button>
              <button className={styles.quickBtn} onClick={exportStudentsCSV}>
                <MaterialIcon>download</MaterialIcon><span>Xuất CSV học sinh</span>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
