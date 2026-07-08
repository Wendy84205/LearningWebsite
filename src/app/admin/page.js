'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getGradeData } from '@/lib/data/index'
import CurriculumPage from './pages/CurriculumPage'
import OverviewPage from './pages/OverviewPage'
import StudentsPage from './pages/StudentsPage'
import ParentsPage from './pages/ParentsPage'
import QuestionsPage from './pages/QuestionsPage'
import GamesPage from './pages/GamesPage'
import LearningMapPage from './pages/LearningMapPage'
import AssignmentsPage from './pages/AssignmentsPage'
import TestsPage from './pages/TestsPage'
import AchievementsPage from './pages/AchievementsPage'
import ReportsPage from './pages/ReportsPage'
import AiGeneratorPage from './pages/AiGeneratorPage'
import MediaPage from './pages/MediaPage'
import SettingsPage from './pages/SettingsPage'
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
const DEFAULT_ADMIN_EMAIL = 'wendy84205@gmail.com'
const ADMIN_NAV = [
  { key: 'overview', icon: 'dashboard', label: 'Dashboard' },
  { key: 'curriculum', icon: 'menu_book', label: 'Curriculum' },
  { key: 'questions', icon: 'quiz', label: 'Question Bank' },
  { key: 'games', icon: 'videogame_asset', label: 'Games' },
  { key: 'learningMap', icon: 'map', label: 'Learning Map' },
  { key: 'students', icon: 'group', label: 'Students' },
  { key: 'parents', icon: 'family_restroom', label: 'Parents' },
  { key: 'assignments', icon: 'assignment', label: 'Assignments' },
  { key: 'tests', icon: 'checklist', label: 'Tests' },
  { key: 'achievements', icon: 'workspace_premium', label: 'Achievements' },
  { key: 'reports', icon: 'assessment', label: 'Reports' },
  { key: 'aiGenerator', icon: 'auto_awesome', label: 'AI Generator' },
  { key: 'media', icon: 'perm_media', label: 'Media Library' },
  { key: 'settings', icon: 'settings', label: 'Settings' },
]
const CMS_AUTOMATION_ACTIONS = {
  'complete-cms-bootstrap': {
    icon: 'rocket_launch',
    label: 'Hoàn thiện CMS',
    description: 'Seed đủ dữ liệu nền cho curriculum, map, game, media, settings, reports và workflow.',
    confirm: true
  },
  'seed-content-types': {
    icon: 'schema',
    label: 'Content types',
    description: 'Seed registry content model/schema cho CMS hiện đại.'
  },
  'modernize-cms-governance': {
    icon: 'verified',
    label: 'Modernize records',
    description: 'Bổ sung slug, SEO, version và governance metadata cho dữ liệu cũ.',
    confirm: true
  },
  'create-cms-quality-report': {
    icon: 'rule_settings',
    label: 'Quality report',
    description: 'Tạo báo cáo kiểm tra metadata, workflow và validation của CMS.'
  },
  'sync-static-curriculum': {
    icon: 'sync',
    label: 'Sync chương trình',
    description: 'Tạo bản ghi CMS còn thiếu từ chương trình hiện có.',
    confirm: true
  },
  'publish-all-drafts': {
    icon: 'published_with_changes',
    label: 'Xuất bản drafts',
    description: 'Chuyển toàn bộ bản nháp của module hiện tại sang active.',
    confirm: true
  },
  'archive-disabled': {
    icon: 'archive',
    label: 'Archive disabled',
    description: 'Dọn các item disabled khỏi dữ liệu đang vận hành.',
    confirm: true,
    danger: true
  },
  'create-assignment-plan': {
    icon: 'assignment_add',
    label: 'Tạo bài giao nhanh',
    description: 'Tạo assignment thật từ học sinh và lesson hiện có.'
  },
  'create-test-blueprint': {
    icon: 'fact_check',
    label: 'Tạo quiz blueprint',
    description: 'Sinh đề nháp từ question bank và chương trình.'
  },
  'create-report-snapshot': {
    icon: 'monitoring',
    label: 'Snapshot báo cáo',
    description: 'Lưu ảnh chụp số liệu hệ thống vào Reports.'
  },
  'seed-media-library': {
    icon: 'perm_media',
    label: 'Seed media',
    description: 'Tạo thư mục media cốt lõi cho audio, ảnh và mascot.'
  },
  'seed-default-settings': {
    icon: 'settings_suggest',
    label: 'Seed settings',
    description: 'Tạo cấu hình website, gamification và bảo mật mặc định.'
  },
  'generate-achievement-rules': {
    icon: 'workspace_premium',
    label: 'Sinh luật thưởng',
    description: 'Tạo badge/reward draft từ dữ liệu tiến độ.'
  },
  'generate-ai-draft': {
    icon: 'auto_awesome',
    label: 'Tạo AI draft',
    description: 'Lưu prompt/draft vào AI Generator để admin duyệt.'
  }
}
const STITCH_MODULES = {
  curriculum: {
    icon: '🧭',
    title: 'Quản lý học liệu',
    subtitle: 'Bám màn Stitch “Quản lý Học liệu - Khối lớp & Môn học”, tập trung vào khối lớp, thế giới học tập và độ phủ bài.',
    accent: 'blue',
    chips: ['Khối lớp', 'Môn học', 'Lộ trình'],
    cards: [
      ['Lớp 1', '5 thế giới học tập', 'Đang dùng chương trình mở rộng theo Toán, Tiếng Việt, Tự nhiên & Xã hội.'],
      ['Độ phủ câu hỏi', 'Theo từng ải', 'Admin có thể kiểm tra số câu hệ thống và bổ sung câu hỏi riêng ở ngân hàng câu hỏi.'],
      ['Trạng thái nội dung', 'Sẵn sàng rà soát', 'Ưu tiên các bài Tiếng Việt nghe chọn, ghép đôi và toán phạm vi 100.'],
    ],
    rows: [
      ['Lớp 1', 'Đang hoạt động', '36 ải thường', 'Đủ dữ liệu cơ bản'],
      ['Lớp 2-5', 'Khung dữ liệu', 'Chờ mở rộng', 'Không ảnh hưởng Lớp 1'],
    ],
  },
  learningCenter: {
    icon: '🎯',
    title: 'Trung tâm học tập & kiểm tra',
    subtitle: 'Gom màn “Trung tâm Học tập & Kiểm tra” và “Quản lý Bài tập & Kiểm tra” thành trung tâm vận hành bài học.',
    accent: 'green',
    chips: ['Bài học', 'Kiểm tra', 'Phân loại'],
    cards: [
      ['Bài luyện nhanh', '3 chế độ chính', 'Chọn 1 trong 2, nghe và chọn, ghép cặp đơn giản.'],
      ['Bài kiểm tra', 'Theo thế giới', 'Sẵn UI cho tạo phiên kiểm tra theo khối, môn, ải.'],
      ['Dữ liệu học sinh', 'Theo tiến trình thật', 'Kết quả hiện lấy từ Progress của từng hồ sơ.'],
    ],
    rows: [
      ['Chọn 1 trong 2', 'Toán / TNXH', 'Hoạt động', 'Dùng câu hỏi hệ thống + admin'],
      ['Nghe và chọn', 'Tiếng Việt', 'Hoạt động', 'Ưu tiên phát âm và vần'],
      ['Ghép cặp', 'Toán & Tiếng Việt', 'Hoạt động', 'Luyện ghi nhớ hình - chữ'],
    ],
  },
  aiGenerator: {
    icon: '✨',
    title: 'AI Generator',
    subtitle: 'Bám màn Stitch “AI Generator - Tự động hóa nội dung”: nơi chuẩn bị prompt, duyệt nháp và đưa câu hỏi vào ngân hàng.',
    accent: 'violet',
    chips: ['Prompt', 'Duyệt nháp', 'Đưa vào ngân hàng'],
    cards: [
      ['Tạo câu hỏi', 'Theo khối và ải', 'UI đã có chỗ cho luồng sinh nội dung trước khi lưu vào CustomQuestion.'],
      ['Kiểm duyệt', 'Admin duyệt thủ công', 'Không tự ghi DB khi chưa có bước xác nhận rõ ràng.'],
      ['Chuẩn chương trình', 'Theo WORLDS', 'Sinh nội dung gắn với đúng thế giới và bài học.'],
    ],
    rows: [
      ['Prompt theo bài', 'Sẵn UI', 'Chưa nối model', 'Cần API AI riêng'],
      ['Duyệt câu hỏi', 'Sẵn UI', 'Chưa tự động', 'Dùng ngân hàng câu hỏi để lưu'],
    ],
  },
  rewards: {
    icon: '🏅',
    title: 'Cấu hình trò chơi & thưởng',
    subtitle: 'Bám màn Stitch “Cấu hình Trò chơi & Kinh tế Phần thưởng”: quản lý sao, streak, huy chương và động lực học.',
    accent: 'amber',
    chips: ['Sao', 'Streak', 'Huy chương'],
    cards: [
      ['Sao thưởng', 'Theo lượt chơi', 'Progress đang lưu tổng sao thật cho từng bé.'],
      ['Chuỗi học', 'Theo streak', 'Admin có thể xem và reset trong quản lý học sinh.'],
      ['Huy chương world', 'Theo boss', 'Đồng bộ với logic tiến trình và completedLevels.'],
    ],
    rows: [
      ['Sao', 'Đang lưu DB', 'progress.stars', 'Hiển thị ở dashboard'],
      ['Streak', 'Đang lưu DB', 'progress.streak', 'Có thể chỉnh từ admin'],
      ['Huy chương', 'Từ completedLevels', 'Tính theo boss', 'Dùng ở dashboard phụ huynh'],
    ],
  },
  reports: {
    icon: '📈',
    title: 'Báo cáo & phân tích',
    subtitle: 'Bám màn Stitch “Báo cáo & Phân tích chi tiết”: tổng hợp sức khỏe hệ thống, phân bố lớp và học sinh nổi bật.',
    accent: 'cyan',
    chips: ['KPI', 'Top học sinh', 'Phân bố lớp'],
    cards: [
      ['Phụ huynh', 'Dữ liệu thật', 'Lấy từ Parent trong DB.'],
      ['Học sinh', 'Dữ liệu thật', 'Lấy từ ChildProfile kèm Progress.'],
      ['Câu hỏi admin', 'Dữ liệu thật', 'Lấy từ CustomQuestion.'],
    ],
    rows: [
      ['Tổng phụ huynh', 'Realtime API', 'Đã nối', 'GET /api/admin/stats'],
      ['Tổng sao', 'Realtime API', 'Đã nối', 'Aggregate Progress'],
      ['Top học sinh', 'Realtime API', 'Đã nối', 'Sắp theo sao và streak'],
    ],
  },
  importExport: {
    icon: '📦',
    title: 'Nhập & xuất dữ liệu',
    subtitle: 'Bám màn Stitch “Nhập & Xuất Dữ liệu Hệ thống”: chuẩn hóa các luồng CSV, backup, và kiểm tra dữ liệu.',
    accent: 'slate',
    chips: ['CSV', 'Backup', 'Kiểm tra'],
    cards: [
      ['Xuất học sinh', 'Đã hoạt động', 'Nút xuất CSV đang dùng dữ liệu học sinh thật.'],
      ['Nhập câu hỏi', 'Sẵn UI', 'Có thể nối sau vào CustomQuestion theo batch.'],
      ['Sao lưu dữ liệu', 'Sẵn UI', 'Chờ chính sách backup DB.'],
    ],
    rows: [
      ['Xuất học sinh CSV', 'Hoạt động', 'Frontend', 'hocvui_hocsinh.csv'],
      ['Nhập câu hỏi CSV', 'Chờ backend', 'CustomQuestion', 'Cần validate định dạng'],
      ['Backup hệ thống', 'Chờ backend', 'Database', 'Cần quyền admin cao'],
    ],
  },
  media: {
    icon: '🖼️',
    title: 'Thư viện đa phương tiện',
    subtitle: 'Bám màn Stitch “Thư viện Đa phương tiện”: quản lý hình, âm thanh, mascot và tài nguyên bài học.',
    accent: 'rose',
    chips: ['Ảnh', 'Âm thanh', 'Mascot'],
    cards: [
      ['Mascot', 'Đang dùng emoji/image', 'Hồ sơ học sinh có mascotName và mascotImage.'],
      ['Âm thanh Tiếng Việt', 'Cần chuẩn hóa', 'Phục vụ game nghe và chọn.'],
      ['Hình minh họa', 'Theo bài học', 'Sẵn khu vực phân loại theo world/level.'],
    ],
    rows: [
      ['Mascot học sinh', 'Đang lưu profile', 'Hoạt động', 'ChildProfile mascot fields'],
      ['Audio phát âm', 'Chờ thư viện', 'Ưu tiên', 'Tiếng Việt Lớp 1'],
      ['Ảnh bài học', 'Chờ thư viện', 'Trung bình', 'Theo chủ đề'],
    ],
  },
  settings: {
    icon: '⚙️',
    title: 'Cài đặt hệ thống & phân quyền',
    subtitle: 'Bám màn Stitch “Cài đặt Hệ thống & Phân quyền”: quản lý tài khoản admin, bảo mật và trạng thái hệ thống.',
    accent: 'dark',
    chips: ['Admin', 'Bảo mật', 'Phân quyền'],
    cards: [
      ['Đăng nhập admin', 'Đã hoạt động', 'Cookie admin token và API /api/admin/auth.'],
      ['Biến môi trường', 'Đã hỗ trợ', 'ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET.'],
      ['Phân quyền chi tiết', 'Sẵn UI', 'Có thể mở rộng role sau.'],
    ],
    rows: [
      ['Admin auth', 'Hoạt động', 'Cookie ký HMAC', '7 ngày'],
      ['Route guard', 'Hoạt động', 'getAdminSession', 'Đã await đúng'],
      ['Role nâng cao', 'Chờ schema', 'Không đổi schema', 'Để phase sau'],
    ],
  },
}
const CMS_MODULES = {
  ...STITCH_MODULES,
  curriculum: {
    ...STITCH_MODULES.curriculum,
    module: 'curriculum',
    title: 'Curriculum CMS',
    subtitle: 'Quản lý lớp, môn, chủ đề, kỹ năng và bài học. Đây là nguồn cấu trúc học liệu chính của hệ thống.',
    chips: ['Grade', 'Subject', 'Topic', 'Skill', 'Lesson'],
    types: ['grade', 'subject', 'topic', 'skill', 'lesson'],
    primaryAction: 'Thêm học liệu'
  },
  games: {
    icon: '🎮',
    module: 'games',
    title: 'Games CMS',
    subtitle: 'Quản lý game, phần thưởng và mapping giữa Game → Question Pool → Skill.',
    accent: 'violet',
    chips: ['Game Config', 'XP', 'Coin', 'Stars'],
    types: ['game', 'question-pool', 'game-config'],
    primaryAction: 'Thêm game',
    cards: [
      ['Choose 1 of 2', 'Đang hoạt động', 'Game trắc nghiệm 2 đáp án cho Toán và TNXH.'],
      ['Simple Matching', 'Đang hoạt động', 'Game ghép đôi cho chữ, số và hình ảnh.'],
      ['Listen & Select', 'Đang hoạt động', 'Game nghe chọn cho Tiếng Việt lớp 1.'],
    ],
    rows: [
      ['Choose 1 of 2', 'active', 'question-pool', 'XP/Coin/Stars cấu hình theo game'],
      ['Simple Matching', 'active', 'question-pool', 'Ghép đôi theo skill'],
      ['Listen & Select', 'active', 'question-pool', 'Cần audio/voice chuẩn hóa'],
    ],
  },
  learningMap: {
    icon: '🗺️',
    module: 'learning-map',
    title: 'Learning Map Builder',
    subtitle: 'Builder bản đồ học tập theo World, Stage, Level, Boss Level và Reward.',
    accent: 'green',
    chips: ['World', 'Stage', 'Level', 'Boss', 'Reward'],
    types: ['world', 'stage', 'level', 'boss', 'reward', 'unlock-rule'],
    primaryAction: 'Thêm node bản đồ',
    cards: [
      ['World', 'Khu vực học', 'Ví dụ: Ngôi làng số học, Khu rừng chữ cái.'],
      ['Level', 'Game + Question Pool', 'Mỗi level trỏ về game, pool câu hỏi, XP, coin, stars.'],
      ['Boss & Reward', 'Cuối chương', 'Boss mở huy hiệu, medal và reward.'],
    ],
    rows: [
      ['World', 'CRUD', 'learning-map', 'Có thể sắp xếp và preview map'],
      ['Level', 'CRUD', 'game mapping', 'Gắn question pool và skill'],
      ['Unlock rule', 'CRUD', 'progress', 'Điều kiện mở khóa theo level/world'],
    ],
  },
  assignments: {
    icon: '📋',
    module: 'assignments',
    title: 'Assignments CMS',
    subtitle: 'Tạo bài tập, chọn lớp/môn/kỹ năng và giao cho học sinh, nhóm học sinh hoặc cả lớp.',
    accent: 'slate',
    chips: ['Assign', 'Class', 'Skill', 'Score'],
    types: ['assignment', 'assignment-template', 'target-group'],
    primaryAction: 'Tạo bài tập',
    cards: [
      ['Giao bài', 'Một hoặc nhiều học sinh', 'Chọn lớp, môn, kỹ năng và deadline.'],
      ['Theo dõi', 'Đã làm / chưa làm', 'Sẵn cấu trúc để nối kết quả làm bài.'],
      ['Điểm số', 'Theo assignment', 'Lưu thang điểm và mô tả.'],
    ],
    rows: [
      ['Quick assignment', 'CRUD', 'assignment', 'Giao bài nhanh theo skill'],
      ['Class assignment', 'CRUD', 'target-group', 'Giao cả lớp'],
      ['Result tracking', 'Chờ kết quả', 'report', 'Sẽ nối với lịch sử học'],
    ],
  },
  tests: {
    icon: '✅',
    module: 'tests',
    title: 'Tests CMS',
    subtitle: 'Quản lý Quick Test, Topic Test, Chapter Test, Semester Test, hẹn giờ và chấm điểm.',
    accent: 'cyan',
    chips: ['Quick', 'Topic', 'Chapter', 'Semester'],
    types: ['quick-test', 'topic-test', 'chapter-test', 'semester-test', 'test-rule'],
    primaryAction: 'Tạo bài kiểm tra',
    cards: [
      ['Quick Test', '5 câu', 'Kiểm tra nhanh sau bài học.'],
      ['Topic Test', '10 câu', 'Kiểm tra theo chủ đề hoặc kỹ năng.'],
      ['Chapter/Semester', '20-30 câu', 'Đề dài có hẹn giờ và thang điểm.'],
    ],
    rows: [
      ['Random câu hỏi', 'Cấu hình', 'question-pool', 'Chọn số câu theo difficulty'],
      ['Hẹn giờ', 'Cấu hình', 'test-rule', 'Thời lượng theo loại đề'],
      ['Chấm điểm', 'Cấu hình', 'rubric', 'Có đáp án và giải thích'],
    ],
  },
  achievements: {
    icon: '🏆',
    module: 'achievements',
    title: 'Achievements CMS',
    subtitle: 'Quản lý huy hiệu, huy chương và điều kiện mở khóa theo XP, streak, world hoặc test.',
    accent: 'amber',
    chips: ['Badge', 'Medal', 'Unlock Rule'],
    types: ['badge', 'medal', 'unlock-condition'],
    primaryAction: 'Thêm huy hiệu',
    cards: [
      ['Nhà toán học', 'Badge', 'Mở khóa khi hoàn thành chuỗi kỹ năng Toán.'],
      ['Chăm học', 'Streak', 'Mở khóa khi học liên tiếp nhiều ngày.'],
      ['Hoàn thành World', 'Medal', 'Nhận khi vượt boss cuối chương.'],
    ],
    rows: [
      ['Badge', 'CRUD', 'achievement', 'Icon, tên, mô tả'],
      ['Medal', 'CRUD', 'world reward', 'Gắn với boss/world'],
      ['Condition', 'CRUD', 'unlock rule', 'XP, streak, completion'],
    ],
  },
  reports: {
    ...STITCH_MODULES.reports,
    module: 'reports',
    title: 'Reports Center',
    subtitle: 'Báo cáo học sinh, curriculum, câu hỏi và export Excel/PDF.',
    chips: ['Student', 'Curriculum', 'Question', 'Export'],
    types: ['student-report', 'curriculum-report', 'question-report', 'export-template'],
    primaryAction: 'Tạo mẫu báo cáo'
  },
  aiGenerator: {
    ...STITCH_MODULES.aiGenerator,
    module: 'ai',
    title: 'AI Generator',
    subtitle: 'Tạo câu hỏi, bài học và đề kiểm tra bằng AI theo lớp, môn, chủ đề, số lượng.',
    chips: ['Questions', 'Lessons', 'Tests'],
    types: ['question-prompt', 'lesson-prompt', 'test-prompt', 'ai-draft'],
    primaryAction: 'Tạo prompt'
  },
  media: {
    ...STITCH_MODULES.media,
    module: 'media',
    title: 'Media Library',
    subtitle: 'Kho hình ảnh, audio, video, mascot, badge, sticker; có tag, search và preview.',
    chips: ['Image', 'Audio', 'Video', 'Mascot', 'Badge'],
    types: ['image', 'audio', 'video', 'mascot', 'badge-asset', 'sticker'],
    primaryAction: 'Thêm tài nguyên'
  },
  settings: {
    ...STITCH_MODULES.settings,
    module: 'settings',
    title: 'Settings',
    subtitle: 'Thiết lập website, gamification, role, permission và notification.',
    chips: ['Website', 'Gamification', 'Role', 'Notification'],
    types: ['website', 'gamification', 'role', 'permission', 'notification'],
    primaryAction: 'Thêm cấu hình'
  }
}
const LEGACY_CMS_MODULES = CMS_MODULES
const ADMIN_CMS_MODULES = {
  curriculum: {
    ...LEGACY_CMS_MODULES.curriculum,
    module: 'content',
    title: 'Curriculum',
    subtitle: 'Quản lý chương trình học từ Grade, Subject, Topic, Skill đến Lesson theo cấu trúc Education CMS.',
    icon: '📚',
    accent: 'blue',
    chips: ['Grade', 'Subject', 'Topic', 'Skill', 'Lesson'],
    types: ['grade', 'subject', 'topic', 'skill', 'lesson'],
    primaryAction: 'Thêm nội dung',
    cards: [
      ['Grade Management', 'Lớp 1-5', 'Thêm, sửa, xóa và sắp xếp khối lớp.'],
      ['Subject & Topic', 'CRUD + ẩn hiện', 'Gắn môn với lớp, mô tả chủ đề và điều chỉnh thứ tự học.'],
      ['Skill & Lesson', 'Độ khó + học liệu', 'Quản lý kỹ năng, thời lượng, lý thuyết, ví dụ, ảnh, video và mini game.'],
    ],
    dataFields: [
      { name: 'theory', label: 'Lý thuyết', multiline: true },
      { name: 'example', label: 'Ví dụ', multiline: true },
      { name: 'mediaUrl', label: 'Ảnh / video / audio URL' },
      { name: 'miniGame', label: 'Mini game' },
      { name: 'estimatedMinutes', label: 'Thời lượng học' },
    ],
  },
  games: {
    ...LEGACY_CMS_MODULES.games,
    module: 'games',
    title: 'Games',
    subtitle: 'Quản lý game, phần thưởng và mapping giữa Game, Question Pool, Skill theo phong cách Stitch.',
    icon: '🎮',
    accent: 'violet',
    chips: ['Game Config', 'Question Pool', 'XP', 'Coin', 'Stars'],
    types: ['game', 'question-pool', 'game-config', 'reward-rule'],
    primaryAction: 'Thêm game',
    dataFields: [
      { name: 'gameRoute', label: 'Route trò chơi' },
      { name: 'questionPool', label: 'Question pool' },
      { name: 'rewardRule', label: 'Luật thưởng', multiline: true },
      { name: 'failureRule', label: 'Luật khi làm sai', multiline: true },
    ],
  },
  learningMap: {
    ...LEGACY_CMS_MODULES.learningMap,
    module: 'learning-map',
    title: 'Learning Map',
    subtitle: 'Builder bản đồ học tập: World, Stage, Level, Boss, Reward và điều kiện mở khóa.',
    icon: '🗺️',
    accent: 'green',
    chips: ['World', 'Stage', 'Level', 'Boss', 'Reward', 'Drag Drop'],
    types: ['world', 'stage', 'level', 'boss', 'reward', 'unlock-rule'],
    primaryAction: 'Thêm node bản đồ',
    cards: [
      ['World & Stage', 'Ảnh nền + màu sắc', 'Tạo thế giới học, stage, icon và màu chủ đạo.'],
      ['Level Builder', 'Game + Question Pool', 'Gắn mỗi level với game, pool câu hỏi, XP, coin và số sao.'],
      ['Boss & Reward', 'Badge + medal', 'Thiết lập boss cuối chương, phần thưởng và điều kiện mở khóa.'],
    ],
    dataFields: [
      { name: 'backgroundImage', label: 'Ảnh nền' },
      { name: 'iconUrl', label: 'Icon URL' },
      { name: 'color', label: 'Màu sắc' },
      { name: 'game', label: 'Game' },
      { name: 'questionPool', label: 'Question Pool' },
      { name: 'unlockRule', label: 'Điều kiện mở khóa', multiline: true },
      { name: 'rewardBadge', label: 'Badge / Medal' },
    ],
  },
  assignments: {
    ...LEGACY_CMS_MODULES.assignments,
    module: 'assignments',
    title: 'Assignments',
    subtitle: 'Tạo bài tập, chọn lớp/môn/kỹ năng và giao cho học sinh, nhóm học sinh hoặc cả lớp.',
    icon: '📋',
    accent: 'slate',
    chips: ['Assign', 'Class', 'Skill', 'Deadline', 'Score'],
    types: ['assignment', 'assignment-template', 'target-group', 'homework-policy'],
    primaryAction: 'Tạo bài tập',
    dataFields: [
      { name: 'targetGroup', label: 'Nhóm học sinh' },
      { name: 'deadline', label: 'Hạn nộp' },
      { name: 'scoringRule', label: 'Cách chấm điểm', multiline: true },
      { name: 'teacherNote', label: 'Ghi chú giáo viên', multiline: true },
    ],
  },
  tests: {
    ...LEGACY_CMS_MODULES.tests,
    module: 'tests',
    title: 'Tests',
    subtitle: 'Quản lý Practice, Quiz, Chapter Test, Semester Test, random câu hỏi, hẹn giờ và điểm đạt.',
    icon: '✅',
    accent: 'cyan',
    chips: ['Practice', 'Quiz', 'Chapter Test', 'Semester Test'],
    types: ['practice', 'quiz', 'chapter-test', 'semester-test', 'assessment-rule'],
    primaryAction: 'Tạo bài đánh giá',
    cards: [
      ['Practice', 'Luyện tập', 'Bài luyện theo skill, không áp lực điểm số.'],
      ['Quiz', '10-20 câu', 'Sinh tự động từ Question Bank và random đáp án.'],
      ['Chapter/Semester Test', 'Hẹn giờ', 'Cấu hình điểm đạt, thời lượng và thang điểm.'],
    ],
    dataFields: [
      { name: 'questionCount', label: 'Số câu' },
      { name: 'timerMinutes', label: 'Thời gian làm bài' },
      { name: 'passScore', label: 'Điểm đạt' },
      { name: 'randomize', label: 'Random câu / đáp án' },
      { name: 'rubric', label: 'Thang điểm', multiline: true },
    ],
  },
  achievements: {
    ...LEGACY_CMS_MODULES.achievements,
    module: 'achievements',
    title: 'Achievements',
    subtitle: 'Quản lý huy hiệu, huy chương và điều kiện mở khóa theo XP, streak, world hoặc bài kiểm tra.',
    icon: '🏆',
    accent: 'amber',
    chips: ['Badge', 'Medal', 'Unlock Rule', 'Reward'],
    types: ['badge', 'medal', 'unlock-condition', 'reward'],
    primaryAction: 'Thêm huy hiệu',
    dataFields: [
      { name: 'badgeIcon', label: 'Icon huy hiệu' },
      { name: 'unlockCondition', label: 'Điều kiện mở khóa', multiline: true },
      { name: 'rewardValue', label: 'Giá trị thưởng' },
      { name: 'celebrationCopy', label: 'Thông điệp chúc mừng', multiline: true },
    ],
  },
  reports: {
    ...LEGACY_CMS_MODULES.reports,
    module: 'reports',
    title: 'Reports',
    subtitle: 'Báo cáo học sinh, học tập, câu hỏi, phụ huynh và mẫu export PDF/Excel.',
    icon: '📊',
    accent: 'cyan',
    chips: ['Student', 'Learning', 'Question', 'Parent', 'Export'],
    types: ['student-report', 'learning-report', 'question-report', 'parent-report', 'export-template'],
    primaryAction: 'Tạo mẫu báo cáo',
    cards: [
      ['Student Report', 'Tiến độ + điểm số', 'Theo dõi môn mạnh, môn yếu và lộ trình hiện tại của từng bé.'],
      ['Learning Report', 'Tỷ lệ hoàn thành', 'Tổng hợp thời gian học, chuỗi học và tiến độ theo world.'],
      ['Question Report', 'Câu dễ / khó', 'Phát hiện câu sai nhiều, câu dễ nhất, câu khó nhất để cải thiện nội dung.'],
    ],
    dataFields: [
      { name: 'reportScope', label: 'Phạm vi báo cáo' },
      { name: 'cadence', label: 'Chu kỳ' },
      { name: 'exportFormat', label: 'Định dạng export' },
      { name: 'recipients', label: 'Người nhận' },
      { name: 'templateNote', label: 'Ghi chú mẫu', multiline: true },
    ],
  },
  media: {
    ...LEGACY_CMS_MODULES.media,
    module: 'media',
    title: 'Media Library',
    subtitle: 'Kho hình ảnh, audio, video, sticker, badge, mascot với folder, tag, search và preview.',
    icon: '🖼️',
    accent: 'rose',
    chips: ['Image', 'Audio', 'Video', 'Sticker', 'Badge', 'Mascot'],
    types: ['image', 'audio', 'video', 'sticker', 'badge', 'mascot', 'folder', 'tag'],
    primaryAction: 'Thêm tài nguyên',
    cards: [
      ['Upload & Folder', 'Nhiều file', 'Phân loại tài nguyên theo thư mục, chủ đề và khối lớp.'],
      ['Tag & Search', 'Tìm nhanh', 'Gắn tag để dùng lại trong bài học, game và reward.'],
      ['Preview', 'Ảnh/audio/video', 'Lưu metadata để admin kiểm tra tài nguyên trước khi đưa vào bài học.'],
    ],
    dataFields: [
      { name: 'fileUrl', label: 'File URL' },
      { name: 'folder', label: 'Folder' },
      { name: 'tags', label: 'Tags' },
      { name: 'altText', label: 'Alt text / lời đọc' },
      { name: 'license', label: 'Nguồn / bản quyền' },
    ],
  },
  aiGenerator: {
    ...LEGACY_CMS_MODULES.aiGenerator,
    module: 'ai-studio',
    title: 'AI Generator',
    subtitle: 'Tạo câu hỏi, bài học, đề kiểm tra và review chất lượng nội dung trước khi đưa vào CMS.',
    icon: '✨',
    accent: 'violet',
    chips: ['Generate Questions', 'Generate Lessons', 'Generate Exams', 'AI Review'],
    types: ['question-generator', 'lesson-generator', 'exam-generator', 'ai-review', 'ai-draft'],
    primaryAction: 'Tạo AI workflow',
    cards: [
      ['AI Generate Question', '20/50/100 câu', 'Nhập lớp, môn, topic, skill và số lượng để chuẩn bị prompt.'],
      ['AI Generate Lesson', 'Lý thuyết + ví dụ', 'Tạo bản nháp bài học, tóm tắt và hoạt động gợi ý.'],
      ['AI Review', 'Trùng lặp + lỗi', 'Kiểm tra câu hỏi trùng, lỗi diễn đạt và đề xuất chỉnh sửa.'],
    ],
    dataFields: [
      { name: 'prompt', label: 'Prompt', multiline: true },
      { name: 'outputCount', label: 'Số lượng output' },
      { name: 'reviewRule', label: 'Luật review', multiline: true },
      { name: 'tone', label: 'Giọng văn' },
    ],
  },
  settings: {
    ...LEGACY_CMS_MODULES.settings,
    module: 'settings',
    title: 'Settings',
    subtitle: 'Thiết lập website, gamification, notification, security và cấu hình hệ thống.',
    icon: '⚙️',
    accent: 'dark',
    chips: ['System', 'Gamification', 'Notification', 'Security', 'Role'],
    types: ['system', 'gamification', 'notification', 'security', 'role', 'permission'],
    primaryAction: 'Thêm cấu hình',
    cards: [
      ['System', 'Tên website + logo', 'Quản lý tên, logo, favicon và thông tin nhận diện.'],
      ['Gamification', 'XP + coin + level', 'Cấu hình kinh tế thưởng và cấp độ học sinh.'],
      ['Notification & Security', 'Email + push', 'Quản lý thông báo, bảo mật và trạng thái vận hành.'],
    ],
    dataFields: [
      { name: 'settingKey', label: 'Setting key' },
      { name: 'settingValue', label: 'Setting value', multiline: true },
      { name: 'appliesTo', label: 'Áp dụng cho' },
      { name: 'environment', label: 'Môi trường' },
      { name: 'permissionSet', label: 'Permission set', multiline: true },
    ],
  },
}
const CMS_TABS = Object.keys(ADMIN_CMS_MODULES)

function createEmptyCmsForm(moduleKey) {
  const moduleConfig = ADMIN_CMS_MODULES[moduleKey]
  const data = {
    description: '',
    content: '',
    xp: '',
    coin: '',
    stars: '',
    duration: '',
    questionCount: '',
    fileUrl: ''
  }
  moduleConfig?.dataFields?.forEach(field => {
    data[field.name] = ''
  })

  return {
    id: '',
    module: moduleConfig?.module || moduleKey,
    type: moduleConfig?.types?.[0] || 'item',
    title: '',
    status: 'active',
    grade: '',
    subject: '',
    topic: '',
    skill: '',
    difficulty: '',
    order: 0,
    data
  }
}

function getQuestionText(question) {
  return question.q || question.word || question.left || ''
}

function getQuestionOptions(question) {
  if (question.type === 'matching') {
    return [question.options || question.right || '']
  }

  if (Array.isArray(question.options)) {
    return question.options
  }

  if (Array.isArray(question.options_array)) {
    return question.options_array
  }

  if (typeof question.options === 'string') {
    try {
      const parsed = JSON.parse(question.options)
      return Array.isArray(parsed) ? parsed : question.options.split(',')
    } catch {
      return question.options.split(',')
    }
  }

  return []
}

function getQuestionSubject(question, fallback = 'Chung') {
  return question.subject || question.subjectName || fallback
}

function getQuestionTopic(question, fallback = 'Chung') {
  return question.topic || question.skill || question.levelTitle || fallback
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let quoted = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && quoted && next === '"') {
      current += '"'
      i += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

function parseQuestionImport(text, defaults) {
  const content = String(text || '').trim()
  if (!content) return []

  if (content.startsWith('[')) {
    const parsed = JSON.parse(content)
    return parsed.map(item => ({
      ...defaults,
      ...item,
      worldId: parseInt(item.worldId ?? defaults.worldId, 10),
      levelId: parseInt(item.levelId ?? defaults.levelId, 10)
    }))
  }

  const rows = content.split(/\r?\n/).map(row => row.trim()).filter(Boolean)
  if (rows.length < 2) return []

  const headers = parseCsvLine(rows[0]).map(header => header.toLowerCase())
  return rows.slice(1).map(row => {
    const cells = parseCsvLine(row)
    const record = headers.reduce((acc, header, index) => {
      acc[header] = cells[index] || ''
      return acc
    }, {})
    const answers = record.answers || record.options || [record.optiona, record.optionb].filter(Boolean).join('|')

    return {
      ...defaults,
      grade: record.grade || defaults.grade,
      worldId: parseInt(record.worldid || record.world || defaults.worldId, 10),
      levelId: parseInt(record.levelid || record.level || defaults.levelId, 10),
      type: record.type || 'choose',
      q: record.question || record.q || '',
      options: record.type === 'matching' ? answers : JSON.stringify(answers.split('|').map(item => item.trim()).filter(Boolean)),
      correct: parseInt(record.correct || '0', 10) || 0,
      emoji: record.emoji || '❓',
      subject: record.subject || 'Chung',
      topic: record.topic || 'Chung',
      skill: record.skill || '',
      difficulty: record.difficulty || 'easy',
      tags: record.tags || '',
      imageUrl: record.imageurl || record.image || '',
      audioUrl: record.audiourl || record.audio || '',
      explanation: record.explanation || '',
      gameTypes: record.gametypes || record.game_types || '',
      status: record.status || 'published'
    }
  }).filter(item => item.q)
}

function parseCmsImport(text, moduleConfig) {
  const content = String(text || '').trim()
  if (!content) return []

  if (content.startsWith('[')) {
    const parsed = JSON.parse(content)
    return parsed.map(item => ({
      status: 'draft',
      ...item,
      module: moduleConfig.module,
      data: typeof item.data === 'string' ? JSON.parse(item.data) : (item.data || {})
    }))
  }

  const rows = content.split(/\r?\n/).map(row => row.trim()).filter(Boolean)
  if (rows.length < 2) return []

  const headers = parseCsvLine(rows[0]).map(header => header.toLowerCase())
  return rows.slice(1).map(row => {
    const cells = parseCsvLine(row)
    const record = headers.reduce((acc, header, index) => {
      acc[header] = cells[index] || ''
      return acc
    }, {})
    const data = record.data_json
      ? JSON.parse(record.data_json)
      : {
          description: record.description || '',
          content: record.content || ''
        }

    return {
      module: moduleConfig.module,
      type: record.type || moduleConfig.types?.[0] || 'item',
      title: record.title || record.name || '',
      status: record.status || 'draft',
      grade: record.grade || '',
      subject: record.subject || '',
      topic: record.topic || '',
      skill: record.skill || '',
      difficulty: record.difficulty || '',
      order: parseInt(record.order || '0', 10) || 0,
      data
    }
  }).filter(item => item.title)
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

function buildQuestionPayload(questionData, context = {}) {
  const answers = Array.isArray(questionData.answers) && questionData.answers.length
    ? questionData.answers
    : [
        { id: 'A', text: questionData.optionA || '', isCorrect: Number(questionData.correct || 0) === 0 },
        { id: 'B', text: questionData.optionB || '', isCorrect: Number(questionData.correct || 0) === 1 }
      ].filter(answer => answer.text)

  return {
    id: questionData.id,
    grade: questionData.grade || context.grade,
    worldId: questionData.worldId || context.worldId,
    levelId: questionData.levelId || context.levelId,
    type: questionData.type || 'choose_1_of_2',
    question: questionData.question || questionData.q || '',
    q: questionData.q || questionData.question || '',
    answers,
    correctAnswer: questionData.correctAnswer || answers.find(answer => answer.isCorrect)?.id || 'A',
    correct: Number.isFinite(Number(questionData.correct)) ? Number(questionData.correct) : 0,
    emoji: questionData.emoji || '❓',
    subject: questionData.subject || 'Chung',
    topic: questionData.topic || 'Chung',
    skill: questionData.skill || '',
    difficulty: String(questionData.difficulty || '1'),
    tags: questionData.tags || '',
    imageUrl: questionData.imageUrl || '',
    audioUrl: questionData.audioUrl || '',
    explanation: questionData.explanation || '',
    gameTypes: questionData.gameTypes || [],
    status: questionData.status || 'published'
  }
}



export default function AdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [globalSearch, setGlobalSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null)

  // Overview
  const [stats, setStats] = useState({
    totalParents: 0, totalStudents: 0, totalCustomQuestions: 0,
    totalStars: 0, avgStreak: 0, gradeDistribution: [], topStudents: []
  })

  // Students
  const [students, setStudents] = useState([])

  // Parents
  const [parents, setParents] = useState([])

  // Questions
  const [selectedGrade, setSelectedGrade] = useState('lop-1')
  const [selectedWorld, setSelectedWorld] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [questions, setQuestions] = useState({ staticQuestions: [], customQuestions: [] })

  // CMS modules
  const [cmsItems, setCmsItems] = useState([])
  const [cmsSearch, setCmsSearch] = useState('')
  const [cmsTypeFilter, setCmsTypeFilter] = useState('all')
  const [cmsForm, setCmsForm] = useState(createEmptyCmsForm('curriculum'))
  const [cmsFormOpen, setCmsFormOpen] = useState(false)
  const [moduleDataByTab, setModuleDataByTab] = useState({})

  const gradeData = useMemo(() => getGradeData(selectedGrade), [selectedGrade])
  const availableWorlds = gradeData.WORLDS || []
  const activeWorld = availableWorlds.find(world => world.id === selectedWorld) || availableWorlds[0]
  const availableLevels = activeWorld?.levels || []
  const activeLevel = availableLevels.find(level => level.id === selectedLevel) || availableLevels[0]
  const activeCmsModule = ADMIN_CMS_MODULES[activeTab]
  const activeModuleData = moduleDataByTab[activeTab] || null
  const activeCmsQuickActions = useMemo(() => {
    if (!activeCmsModule || !Array.isArray(activeModuleData?.actions)) return []
    return activeModuleData.actions
      .map(action => ({ action, ...CMS_AUTOMATION_ACTIONS[action] }))
      .filter(item => item.label)
  }, [activeCmsModule, activeModuleData])
  const navItems = useMemo(() => ADMIN_NAV.map(item => ({
    ...item,
    badge: item.key === 'students' ? students.length : item.key === 'parents' ? parents.length : null
  })), [students.length, parents.length])
  const activeNavItem = navItems.find(item => item.key === activeTab) || navItems[0]
  const filteredCmsItems = cmsItems.filter(item => {
    const matchType = cmsTypeFilter === 'all' || item.type === cmsTypeFilter
    const text = [
      item.title, item.type, item.grade, item.subject, item.topic, item.skill, item.difficulty, item.status,
      item.data?.description, item.data?.content
    ].join(' ').toLowerCase()
    return matchType && text.includes(cmsSearch.toLowerCase())
  })

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const askConfirm = (dialog) => {
    setConfirmDialog(dialog)
  }

  const runConfirmedAction = async () => {
    if (!confirmDialog?.onConfirm) return
    const action = confirmDialog.onConfirm
    setConfirmDialog(null)
    await action()
  }

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(res => {
        if (res.ok) {
          setAuthenticated(true)
          return
        }
        router.replace('/parent-login?role=admin&next=/admin')
      })
      .catch(() => router.replace('/parent-login?role=admin&next=/admin'))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
    router.push('/parent-login?role=admin')
  }

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data && !data.error) setStats(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  const loadStudents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      const data = await res.json()
      if (Array.isArray(data)) setStudents(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  const loadParents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/parents')
      const data = await res.json()
      if (Array.isArray(data)) setParents(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/questions?grade=${selectedGrade}&world=${selectedWorld}&level=${selectedLevel}`)
      const data = await res.json()
      if (data && !data.error) setQuestions(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [selectedGrade, selectedWorld, selectedLevel])

  const loadCmsItems = useCallback(async () => {
    const moduleConfig = ADMIN_CMS_MODULES[activeTab]
    if (!moduleConfig) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/modules?module=${encodeURIComponent(moduleConfig.module)}`)
      const data = await res.json()
      if (res.ok && Array.isArray(data.items)) {
        setCmsItems(data.items)
        setModuleDataByTab(prev => ({ ...prev, [activeTab]: data }))
      } else {
        showToast(data.error || 'Không tải được dữ liệu module', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Lỗi kết nối khi tải module admin', 'error')
    }
    finally { setLoading(false) }
  }, [activeTab, showToast])

  useEffect(() => {
    if (!authenticated) return
    const timer = setTimeout(() => {
      if (activeTab === 'overview' || activeTab === 'reports' || CMS_TABS.includes(activeTab)) loadStats()
      if (activeTab === 'students') loadStudents()
      else if (activeTab === 'parents') loadParents()
      else if (activeTab === 'questions') loadQuestions()
      else if (CMS_TABS.includes(activeTab)) loadCmsItems()
    }, 0)
    return () => clearTimeout(timer)
  }, [authenticated, activeTab, loadStats, loadStudents, loadParents, loadQuestions, loadCmsItems])

  useEffect(() => {
    if (!ADMIN_CMS_MODULES[activeTab]) return
    const timer = setTimeout(() => {
      setCmsForm(createEmptyCmsForm(activeTab))
      setCmsTypeFilter('all')
      setCmsSearch('')
      setCmsFormOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleCmsFormChange = (field, value) => {
    setCmsForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCmsDataChange = (field, value) => {
    setCmsForm(prev => ({ ...prev, data: { ...prev.data, [field]: value } }))
  }

  const openNewCmsForm = () => {
    setCmsForm(createEmptyCmsForm(activeTab))
    setCmsFormOpen(true)
  }

  const openEditCmsForm = (item) => {
    setCmsForm({
      ...createEmptyCmsForm(activeTab),
      ...item,
      data: {
        ...createEmptyCmsForm(activeTab).data,
        ...(item.data || {})
      }
    })
    setCmsFormOpen(true)
  }

  const handleCmsSave = async (e) => {
    e.preventDefault()
    const method = cmsForm.id ? 'PUT' : 'POST'
    try {
      const res = await fetch('/api/admin/cms', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsForm)
      })
      const data = await res.json()
      if (res.ok && !data.error) {
        setCmsFormOpen(false)
        setCmsForm(createEmptyCmsForm(activeTab))
        loadCmsItems()
        loadStats()
        showToast(cmsForm.id ? 'Đã cập nhật CMS item ✅' : 'Đã tạo CMS item ✅')
      } else {
        showToast(data.error || 'Lưu CMS thất bại', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Lỗi kết nối khi lưu CMS', 'error')
    }
  }

  const handleCmsDelete = (item) => {
    askConfirm({
      title: 'Xóa CMS item',
      message: `Xóa "${item.title}" khỏi module ${activeCmsModule?.title || item.module}?`,
      confirmLabel: 'Xóa item',
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/cms?id=${item.id}`, { method: 'DELETE' })
          if (res.ok) { loadCmsItems(); loadStats(); showToast('Đã xóa CMS item') }
          else { showToast('Xóa CMS thất bại', 'error') }
        } catch (err) { console.error(err) }
      }
    })
  }

  const handleCmsModuleAction = async (item, action, extra = {}) => {
    if (!activeCmsModule || !action) return

    const runAction = async () => {
      try {
        const res = await fetch('/api/admin/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module: activeCmsModule.module,
            action,
            id: item?.id,
            ...extra
          })
        })
        const data = await res.json()
        if (res.ok && !data.error) {
          loadCmsItems()
          loadStats()
          showToast(data.message || 'Đã cập nhật module')
        } else {
          showToast(data.error || 'Thao tác module thất bại', 'error')
        }
      } catch (err) {
        console.error(err)
        showToast('Lỗi kết nối khi chạy thao tác module', 'error')
      }
    }

    if (item && action === 'archive-item') {
      askConfirm({
        title: 'Lưu trữ CMS item',
        message: `Chuyển "${item.title}" sang trạng thái archived? Item sẽ không còn là nội dung đang hoạt động.`,
        confirmLabel: 'Lưu trữ',
        danger: true,
        onConfirm: runAction
      })
      return
    }

    await runAction()
  }

  const handleSyncStaticCms = () => {
    if (!activeCmsModule) return
    const gradeName = GRADES_MAP[selectedGrade] || selectedGrade
    askConfirm({
      title: 'Đồng bộ chương trình vào CMS',
      message: `Tạo các CMS record còn thiếu cho ${gradeName} từ chương trình hiện có. Các record đã tồn tại sẽ được giữ nguyên, không ghi đè nội dung admin đã sửa.`,
      confirmLabel: 'Đồng bộ',
      onConfirm: () => handleCmsModuleAction(null, 'sync-static-curriculum', {
        grade: selectedGrade,
        status: 'active'
      })
    })
  }

  const runCmsAutomation = async (actionConfig) => {
    if (!activeCmsModule || !actionConfig?.action) return

    const extra = {
      grade: selectedGrade,
      world: selectedWorld,
      level: selectedLevel,
      status: 'active'
    }

    if (actionConfig.action === 'generate-ai-draft') {
      const prompt = window.prompt(
        'Nhập prompt để tạo AI draft:',
        `Tạo 5 câu hỏi ${activeLevel?.title || ''} cho ${GRADES_MAP[selectedGrade] || selectedGrade}`
      )
      if (!prompt) return
      extra.prompt = prompt
      extra.title = `AI draft - ${activeLevel?.title || activeCmsModule.title}`
      extra.subject = activeWorld ? (activeWorld.id === 2 ? 'Tiếng Việt' : activeWorld.id === 5 ? 'Tự nhiên & Xã hội' : 'Toán') : ''
      extra.topic = activeLevel?.title || activeWorld?.name || ''
    }

    const runAction = () => handleCmsModuleAction(null, actionConfig.action, extra)

    if (actionConfig.confirm) {
      askConfirm({
        title: actionConfig.label,
        message: actionConfig.description || `Chạy thao tác ${actionConfig.label} cho ${activeCmsModule.title}?`,
        confirmLabel: actionConfig.label,
        danger: actionConfig.danger,
        onConfirm: runAction
      })
      return
    }

    await runAction()
  }

  // Student Actions
  const handleEditStudentSave = async (studentData) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      })
      if (res.ok) {
        loadStudents()
        showToast('Đã cập nhật thông tin học sinh ✅')
      } else { showToast('Cập nhật thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleDeleteStudent = async (id, name) => {
    askConfirm({
      title: 'Xóa hồ sơ học sinh',
      message: `Bạn đang xóa hồ sơ "${name}". Tiến trình học đi kèm cũng sẽ bị xóa và không thể hoàn tác.`,
      confirmLabel: 'Xóa hồ sơ',
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' })
          if (res.ok) { loadStudents(); showToast(`Đã xóa hồ sơ "${name}"`) }
          else { showToast('Xóa thất bại', 'error') }
        } catch (err) { console.error(err) }
      }
    })
  }

  const handlePromoteStudent = async (student) => {
    const next = NEXT_GRADE[student.grade]
    if (!next) { showToast(`${student.name} đã học đến Lớp 5 rồi!`, 'info'); return }
    askConfirm({
      title: 'Xác nhận lên lớp',
      message: `Chuyển "${student.name}" từ ${student.grade} lên ${next}. Hệ thống sẽ cập nhật hồ sơ học sinh theo lộ trình mới.`,
      confirmLabel: 'Lên lớp',
      onConfirm: async () => {
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
    })
  }

  const handleResetProgress = async (student) => {
    askConfirm({
      title: 'Reset tiến trình học',
      message: `Đưa sao, streak, cấp hiện tại và danh sách ải đã xong của "${student.name}" về 0. Hành động này không thể hoàn tác.`,
      confirmLabel: 'Reset tiến trình',
      danger: true,
      onConfirm: async () => {
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
    })
  }

  // Parent Actions
  const handleDeleteParent = async (id, emailP) => {
    askConfirm({
      title: 'Xóa tài khoản phụ huynh',
      message: `Xóa "${emailP}" sẽ xóa toàn bộ hồ sơ học sinh và tiến trình học liên quan.`,
      confirmLabel: 'Xóa tài khoản',
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/parents?id=${id}`, { method: 'DELETE' })
          if (res.ok) { loadParents(); showToast('Đã xóa tài khoản phụ huynh') }
          else { showToast('Xóa thất bại', 'error') }
        } catch (err) { console.error(err) }
      }
    })
  }

  // Question Actions
  const handleAddQuestion = async (questionData) => {
    const payload = buildQuestionPayload(questionData, {
      grade: selectedGrade,
      worldId: selectedWorld,
      levelId: selectedLevel
    })

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        loadQuestions()
        showToast('Đã thêm câu hỏi mới ✅')
      } else { showToast('Thêm câu hỏi thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleEditQuestionSave = async (questionData) => {
    const payload = buildQuestionPayload(questionData, {
      grade: selectedGrade,
      worldId: selectedWorld,
      levelId: selectedLevel
    })

    try {
      const res = await fetch(`/api/admin/questions/${questionData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) { loadQuestions(); showToast('Đã lưu thay đổi câu hỏi ✅') }
      else { showToast('Cập nhật thất bại', 'error') }
    } catch (err) { console.error(err) }
  }

  const handleDeleteQuestion = async (id) => {
    askConfirm({
      title: 'Xóa câu hỏi tùy chỉnh',
      message: 'Câu hỏi do admin thêm sẽ bị xóa khỏi ngân hàng câu hỏi. Câu hỏi hệ thống không bị ảnh hưởng.',
      confirmLabel: 'Xóa câu hỏi',
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
          if (res.ok) { loadQuestions(); showToast('Đã xóa câu hỏi') }
          else { showToast('Xóa thất bại', 'error') }
        } catch (err) { console.error(err) }
      }
    })
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

  const exportCmsCSV = () => {
    if (!activeCmsModule) return
    const headers = ['module', 'type', 'title', 'status', 'grade', 'subject', 'topic', 'skill', 'difficulty', 'order', 'description', 'content', 'data_json']
    const rows = cmsItems.map(item => [
      item.module,
      item.type,
      item.title,
      item.status,
      item.grade || '',
      item.subject || '',
      item.topic || '',
      item.skill || '',
      item.difficulty || '',
      item.order || 0,
      item.data?.description || '',
      item.data?.content || '',
      JSON.stringify(item.data || {})
    ])
    const csvContent = [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hocvui_${activeCmsModule.module}_cms.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Đã xuất CMS CSV ✅')
  }

  const importCmsText = async () => {
    if (!activeCmsModule) return
    const sample = '[{"type":"lesson","title":"Bài học mới","status":"draft","grade":"lop-1","data":{"description":"Mô tả"}}]'
    const text = window.prompt(`Dán JSON array hoặc CSV có header để import vào ${activeCmsModule.title}:`, sample)
    if (!text) return

    try {
      const items = parseCmsImport(text, activeCmsModule)
      if (!items.length) {
        showToast('Không tìm thấy item hợp lệ để import', 'error')
        return
      }

      const res = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: activeCmsModule.module,
          action: 'bulk-import-cms',
          items
        })
      })
      const data = await res.json()
      if (res.ok && !data.error) {
        loadCmsItems()
        loadStats()
        showToast(data.message || `Đã import ${items.length} CMS items`)
      } else {
        showToast(data.error || 'Import CMS thất bại', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Dữ liệu import không hợp lệ', 'error')
    }
  }

  const handleDuplicateQuestion = async (question) => {
    const options = getQuestionOptions(question)
    const answers = Array.isArray(question.answers) && question.answers.length
      ? question.answers.map(answer => ({ ...answer, id: answer.id || 'A' }))
      : options.map((text, index) => ({
          id: String.fromCharCode(65 + index),
          text,
          isCorrect: index === (parseInt(question.correct, 10) || 0)
        }))
    const payload = buildQuestionPayload({
      ...question,
      q: getQuestionText(question),
      question: getQuestionText(question),
      answers,
      subject: getQuestionSubject(question, 'Chung'),
      topic: getQuestionTopic(question, activeLevel?.title || 'Chung'),
      skill: question.skill || '',
      difficulty: question.difficulty || '1',
      status: 'published',
      gameTypes: question.gameTypes || []
    }, {
      grade: selectedGrade,
      worldId: selectedWorld,
      levelId: selectedLevel
    })

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        loadQuestions()
        showToast('Đã nhân bản câu hỏi vào nhóm hiện tại ✅')
      } else {
        showToast('Nhân bản câu hỏi thất bại', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Lỗi kết nối khi nhân bản câu hỏi', 'error')
    }
  }

  const activityMetrics = [
    { label: '7 ngày', value: stats.active7Days || 0, color: '#0284c7' },
    { label: '30 ngày', value: stats.active30Days || 0, color: '#10b981' },
    { label: '90 ngày', value: stats.active90Days || stats.totalStudents || 0, color: '#f59e0b' },
  ]
  const subjectMetrics = Array.isArray(stats.subjectActivity) && stats.subjectActivity.length > 0
    ? stats.subjectActivity
    : [
        { label: 'Toán', value: stats.totalQuestions || 0 },
        { label: 'Tiếng Việt', value: Math.round((stats.totalQuestions || 0) * 0.45) },
        { label: 'Tiếng Anh', value: Math.round((stats.totalQuestions || 0) * 0.2) },
        { label: 'Khoa học', value: Math.round((stats.totalQuestions || 0) * 0.15) },
      ]
  const subjectMax = Math.max(...subjectMetrics.map(item => item.value || 0), 1)
  const completionMetrics = Array.isArray(stats.completionByWorld) && stats.completionByWorld.length > 0
    ? stats.completionByWorld
    : [
        { label: 'World 1', percent: 0 },
        { label: 'World 2', percent: 0 },
        { label: 'World 3', percent: 0 },
      ]
  const recentActivity = Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0
    ? stats.recentActivity
    : [
        { label: 'Học sinh mới', value: stats.totalStudents || 0, meta: 'Tổng hồ sơ hiện có' },
        { label: 'Bài học mới', value: stats.totalLessons || 0, meta: 'Từ chương trình + CMS' },
        { label: 'Câu hỏi mới', value: stats.totalCustomQuestions || 0, meta: 'Câu hỏi admin' },
        { label: 'Kiểm tra mới', value: stats.totalTests || 0, meta: 'Assessment CMS' },
      ]
  const studentStarTotal = students.reduce((sum, item) => sum + (item.progress?.stars || 0), 0)
  const studentAvgStreak = students.length
    ? Math.round(students.reduce((sum, item) => sum + (item.progress?.streak || 0), 0) / students.length)
    : (stats.avgStreak || 0)

  if (!authenticated) {
    return (
      <div className={styles.loginRedirectPage}>
        <div className={styles.loginRedirectCard}>
          <MaterialIcon>progress_activity</MaterialIcon>
          <strong>Đang mở trang đăng nhập admin...</strong>
          <span>Nếu trình duyệt không tự chuyển, hãy vào trang đăng nhập chung.</span>
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
          <span className={styles.sidebarLogo}>H</span>
          <div>
            <h2>Học Vui</h2>
            <p className={styles.sidebarSubtitle}>Admin Panel</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <button key={item.key}
              className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge > 0 && <span className={styles.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminBadge}>
            <span><MaterialIcon>admin_panel_settings</MaterialIcon></span>
            <div>
              <p className={styles.adminRole}>Quản trị viên</p>
              <p className={styles.adminEmail}>{DEFAULT_ADMIN_EMAIL}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <MaterialIcon>logout</MaterialIcon>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarSearch}>
            <MaterialIcon>search</MaterialIcon>
            <input
              type="search"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder={`Search ${activeNavItem?.label || 'resources'}...`}
            />
          </div>
          <div className={styles.topbarBrand}>Học Vui Admin</div>
          <div className={styles.topbarActions}>
            <button type="button" aria-label="Notifications">
              <MaterialIcon>notifications</MaterialIcon>
            </button>
            <button type="button" aria-label="Help">
              <MaterialIcon>help_outline</MaterialIcon>
            </button>
            <div className={styles.profileChip}>
              <span>HV</span>
              <strong>Admin Profile</strong>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
        {activeCmsModule && (
          <section className={styles.cmsAutomationBar}>
            <div className={styles.cmsAutomationInfo}>
              <span>
                <MaterialIcon>dashboard_customize</MaterialIcon>
              </span>
              <div>
                <strong>{activeCmsModule.title}</strong>
                <p>{activeModuleData?.health?.recommendation || 'Dữ liệu module đang được tải từ CMS.'}</p>
              </div>
            </div>
            <div className={styles.cmsAutomationMeta}>
              <span>{formatNumber(activeModuleData?.metrics?.totalItems || cmsItems.length)} items</span>
              <span>{formatNumber(activeModuleData?.metrics?.activeItems || 0)} active</span>
              <span>{formatNumber(activeModuleData?.metrics?.draftItems || 0)} draft</span>
              <strong>{formatNumber(activeModuleData?.health?.score || 0)}%</strong>
            </div>
            <div className={styles.cmsAutomationActions}>
              {activeCmsQuickActions.map(actionConfig => (
                <button
                  key={actionConfig.action}
                  type="button"
                  onClick={() => runCmsAutomation(actionConfig)}
                  className={actionConfig.danger ? styles.automationDangerBtn : styles.automationBtn}
                >
                  <MaterialIcon>{actionConfig.icon}</MaterialIcon>
                  {actionConfig.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <OverviewPage
            stats={stats}
            loading={loading}
            activityMetrics={activityMetrics}
            subjectMetrics={subjectMetrics}
            subjectMax={subjectMax}
            completionMetrics={completionMetrics}
            recentActivity={recentActivity}
            loadStats={loadStats}
            setActiveTab={setActiveTab}
            exportStudentsCSV={exportStudentsCSV}
          />
        )}

        {/* ─── TAB 2: STUDENTS ─── */}
        {activeTab === 'students' && (
          <StudentsPage
            students={students}
            loading={loading}
            studentAvgStreak={studentAvgStreak}
            studentStarTotal={studentStarTotal}
            stats={stats}
            onPromote={handlePromoteStudent}
            onReset={handleResetProgress}
            onDelete={handleDeleteStudent}
            onSave={handleEditStudentSave}
            onExport={exportStudentsCSV}
          />
        )}

        {/* ─── TAB 3: PARENTS ─── */}
        {activeTab === 'parents' && (
          <ParentsPage
            parents={parents}
            loading={loading}
            onDeleteParent={handleDeleteParent}
          />
        )}

        {/* ─── TAB 4: QUESTIONS ─── */}
        {activeTab === 'questions' && (
          <QuestionsPage
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            selectedWorld={selectedWorld}
            setSelectedWorld={setSelectedWorld}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            availableWorlds={availableWorlds}
            availableLevels={availableLevels}
            activeWorld={activeWorld}
            activeLevel={activeLevel}
            questions={questions}
            loading={loading}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestionSave}
            onDeleteQuestion={handleDeleteQuestion}
            onDuplicateQuestion={handleDuplicateQuestion}
            getGradeData={getGradeData}
            showToast={showToast}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumPage
            moduleConfig={ADMIN_CMS_MODULES.curriculum}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
            onSyncStaticCms={handleSyncStaticCms}
          />
        )}

        {activeTab === 'games' && (
          <GamesPage
            moduleConfig={ADMIN_CMS_MODULES.games}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'learningMap' && (
          <LearningMapPage
            moduleConfig={ADMIN_CMS_MODULES.learningMap}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
            onSyncStaticCms={handleSyncStaticCms}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsPage
            moduleConfig={ADMIN_CMS_MODULES.assignments}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'tests' && (
          <TestsPage
            moduleConfig={ADMIN_CMS_MODULES.tests}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsPage
            moduleConfig={ADMIN_CMS_MODULES.achievements}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPage
            moduleConfig={ADMIN_CMS_MODULES.reports}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'aiGenerator' && (
          <AiGeneratorPage
            moduleConfig={ADMIN_CMS_MODULES.aiGenerator}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'media' && (
          <MediaPage
            moduleConfig={ADMIN_CMS_MODULES.media}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            moduleConfig={ADMIN_CMS_MODULES.settings}
            items={filteredCmsItems}
            allItems={cmsItems}
            moduleData={activeModuleData}
            stats={stats}
            students={students}
            parents={parents}
            search={cmsSearch}
            typeFilter={cmsTypeFilter}
            form={cmsForm}
            formOpen={cmsFormOpen}
            loading={loading}
            onSearch={setCmsSearch}
            onTypeFilter={setCmsTypeFilter}
            onOpenForm={openNewCmsForm}
            onCloseForm={() => setCmsFormOpen(false)}
            onFormChange={handleCmsFormChange}
            onDataChange={handleCmsDataChange}
            onSave={handleCmsSave}
            onEdit={openEditCmsForm}
            onDelete={handleCmsDelete}
            onModuleAction={handleCmsModuleAction}
            onOpenQuestions={() => setActiveTab('questions')}
            onExportStudents={exportCmsCSV}
            onImportCms={importCmsText}
          />
        )}
        </main>
      </div>

      {/* ─── MODALS ─── */}

      {/* Confirm Action Modal */}
      {confirmDialog && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDialog(null)}>
          <div className={`${styles.modalContent} ${styles.confirmModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}>{confirmDialog.danger ? '⚠️' : '✅'}</div>
            <h2>{confirmDialog.title}</h2>
            <p>{confirmDialog.message}</p>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setConfirmDialog(null)} className={styles.cancelBtn}>Hủy</button>
              <button
                type="button"
                onClick={runConfirmedAction}
                className={confirmDialog.danger ? styles.dangerConfirmBtn : styles.saveBtn}
              >
                {confirmDialog.confirmLabel || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
