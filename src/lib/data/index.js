import * as lop1 from './lop-1'
import * as lop2 from './lop-2'
import * as lop3 from './lop-3'
import * as lop4 from './lop-4'
import * as lop5 from './lop-5'

const GRADES = {
  'lop-1': lop1,
  'lop-2': lop2,
  'lop-3': lop3,
  'lop-4': lop4,
  'lop-5': lop5,
}

/**
 * Trả về dữ liệu học tập (WORLDS, CHOOSE_QUESTIONS, v.v.) và các hàm tiện ích
 * dựa trên gradeSlug của lớp học. Nếu chưa có dữ liệu, mặc định trả về Lớp 1.
 */
export function getGradeData(gradeSlug) {
  const normalized = String(gradeSlug || '').toLowerCase()
  return GRADES[normalized] || GRADES['lop-1']
}
