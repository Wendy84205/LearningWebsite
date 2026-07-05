export const PRIMARY_GRADES = [
  { name: 'Lớp 1', slug: 'lop-1' },
  { name: 'Lớp 2', slug: 'lop-2' },
  { name: 'Lớp 3', slug: 'lop-3' },
  { name: 'Lớp 4', slug: 'lop-4' },
  { name: 'Lớp 5', slug: 'lop-5' },
]

export const GRADE_SLUGS = Object.fromEntries(PRIMARY_GRADES.map(grade => [grade.name, grade.slug]))
export const GRADE_NAMES = Object.fromEntries(PRIMARY_GRADES.map(grade => [grade.slug, grade.name]))

export function getGradeSlug(gradeOrSlug) {
  if (!gradeOrSlug) return 'lop-1'
  const value = String(gradeOrSlug).trim()
  if (GRADE_SLUGS[value]) return GRADE_SLUGS[value]
  if (GRADE_NAMES[value]) return value
  if (/^[1-5]$/.test(value)) return `lop-${value}`
  return 'lop-1'
}

export function getGradeName(gradeOrSlug) {
  const slug = getGradeSlug(gradeOrSlug)
  return GRADE_NAMES[slug] || 'Lớp 1'
}
