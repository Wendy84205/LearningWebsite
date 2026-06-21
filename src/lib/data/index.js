import * as lop1 from './lop-1'
import * as lop2 from './lop-2'
import * as lop3 from './lop-3'
import * as lop4 from './lop-4'
import * as lop5 from './lop-5'
import { getSupplementalContent, getSupplementalQuestionsForGame } from './supplemental-primary'

const GRADES = {
  'lop-1': lop1,
  'lop-2': lop2,
  'lop-3': lop3,
  'lop-4': lop4,
  'lop-5': lop5,
}

function mergeGradeData(gradeSlug, gradeData) {
  const supplemental = getSupplementalContent(gradeSlug)

  return {
    ...gradeData,
    CURRICULUM_FOCUS: supplemental.curriculumFocus || [],
    CHOOSE_QUESTIONS: [
      ...(gradeData.CHOOSE_QUESTIONS || []),
      ...(supplemental.chooseQuestions || [])
    ],
    LISTEN_QUESTIONS: [
      ...(gradeData.LISTEN_QUESTIONS || []),
      ...(supplemental.listenQuestions || [])
    ],
    MATCHING_PAIRS_ALL: [
      ...(gradeData.MATCHING_PAIRS_ALL || []),
      ...(supplemental.matchingPairs || [])
    ],
    getQuestionsForGame(worldId, levelId, isBoss = false) {
      const baseQuestions = typeof gradeData.getQuestionsForGame === 'function'
        ? gradeData.getQuestionsForGame(worldId, levelId, isBoss)
        : []
      const supplementalQuestions = getSupplementalQuestionsForGame(gradeSlug, worldId, levelId, isBoss)

      return [...baseQuestions, ...supplementalQuestions]
    }
  }
}

const MERGED_GRADES = Object.fromEntries(
  Object.entries(GRADES).map(([gradeSlug, gradeData]) => [
    gradeSlug,
    mergeGradeData(gradeSlug, gradeData)
  ])
)

/**
 * Trả về dữ liệu học tập (WORLDS, CHOOSE_QUESTIONS, v.v.) và các hàm tiện ích
 * dựa trên gradeSlug của lớp học. Nếu chưa có dữ liệu, mặc định trả về Lớp 1.
 */
export function getGradeData(gradeSlug) {
  const normalized = String(gradeSlug || '').toLowerCase()
  return MERGED_GRADES[normalized] || MERGED_GRADES['lop-1']
}
