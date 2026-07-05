import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildGameHref,
  getGradeGameCatalog,
  GRADE_GAME_CATALOG,
} from '../src/lib/games/grade-game-catalog.js'

const GRADES = ['lop-1', 'lop-2', 'lop-3', 'lop-4', 'lop-5']

describe('grade-game-catalog', () => {
  it('provides playable categories for every primary grade', () => {
    for (const gradeSlug of GRADES) {
      const catalog = getGradeGameCatalog(gradeSlug)
      assert.equal(catalog, GRADE_GAME_CATALOG[gradeSlug])
      assert.ok(catalog.headline)
      assert.ok(catalog.summary)
      assert.ok(catalog.categories.length >= 2)

      const items = catalog.categories.flatMap(category => category.items)
      assert.ok(items.length >= 5)
      assert.ok(items.every(item => item.href && item.theme?.label))
    }
  })

  it('builds grade-aware game links with lesson context', () => {
    const item = GRADE_GAME_CATALOG['lop-5'].categories[0].items[0]
    const href = buildGameHref(item, 'lop-5')
    assert.ok(href.startsWith('/game-quiz-runner-3d?'))
    assert.match(href, /grade=lop-5/)
    assert.match(href, /world=1/)
    assert.match(href, /level=3/)
  })

  it('varies game mix by grade difficulty band', () => {
    const gradeOneGames = GRADE_GAME_CATALOG['lop-1'].categories.flatMap(category => category.items.map(item => item.id))
    const upperGradeGames = ['lop-3', 'lop-4', 'lop-5'].flatMap(gradeSlug =>
      GRADE_GAME_CATALOG[gradeSlug].categories.flatMap(category => category.items.map(item => item.id))
    )

    assert.ok(gradeOneGames.includes('listen-and-select'))
    assert.ok(gradeOneGames.includes('simple-matching'))
    assert.ok(upperGradeGames.includes('quiz-runner-3d'))
    assert.ok(upperGradeGames.includes('math-battle'))
    assert.notDeepEqual(new Set(gradeOneGames), new Set(upperGradeGames))
  })
})
