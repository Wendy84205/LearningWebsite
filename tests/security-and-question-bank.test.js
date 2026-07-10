import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isDefaultAdminLoginEnabled } from '../src/lib/admin-config.js'
import { checkRateLimit } from '../src/lib/rate-limit.js'
import { getSupplementalContent } from '../src/lib/data/supplemental-primary.js'

const GRADES = ['lop-1', 'lop-2', 'lop-3', 'lop-4', 'lop-5']

function requestFromIp(ip) {
  return new Request('https://hocvui.test/api/auth/login', {
    headers: {
      'x-forwarded-for': ip,
    },
  })
}

describe('rate-limit', () => {
  it('blocks requests after the configured threshold per client key', () => {
    const options = {
      key: `test-auth-${Date.now()}`,
      limit: 2,
      windowMs: 60_000,
    }

    assert.equal(checkRateLimit(requestFromIp('203.0.113.10'), options).ok, true)
    assert.equal(checkRateLimit(requestFromIp('203.0.113.10'), options).ok, true)

    const blocked = checkRateLimit(requestFromIp('203.0.113.10'), options)
    assert.equal(blocked.ok, false)
    assert.ok(blocked.retryAfter > 0)

    const otherClient = checkRateLimit(requestFromIp('203.0.113.11'), options)
    assert.equal(otherClient.ok, true)
  })
})

describe('admin auth configuration', () => {
  it('disables default admin credentials in production unless explicitly enabled', () => {
    assert.equal(isDefaultAdminLoginEnabled({ NODE_ENV: 'production' }), false)
    assert.equal(isDefaultAdminLoginEnabled({ NODE_ENV: 'production', ENABLE_DEFAULT_ADMIN_LOGIN: 'true' }), true)
    assert.equal(isDefaultAdminLoginEnabled({ NODE_ENV: 'development' }), true)
    assert.equal(isDefaultAdminLoginEnabled({ NODE_ENV: 'development', DISABLE_DEFAULT_ADMIN_LOGIN: 'true' }), false)
  })
})

describe('supplemental question bank coverage', () => {
  it('provides diverse static coverage for every primary grade', () => {
    for (const grade of GRADES) {
      const content = getSupplementalContent(grade)
      const allItems = [
        ...content.chooseQuestions,
        ...content.listenQuestions,
        ...content.matchingPairs,
      ]
      const subjects = new Set(allItems.map(item => item.subject).filter(Boolean))

      assert.ok(content.chooseQuestions.length >= 6, `${grade} has choice questions`)
      assert.ok(content.listenQuestions.length >= 2, `${grade} has listening questions`)
      assert.ok(content.matchingPairs.length >= 3, `${grade} has matching pairs`)
      assert.ok(subjects.has('Toán'), `${grade} has math coverage`)
      assert.ok(subjects.has('Tiếng Việt'), `${grade} has Vietnamese coverage`)
      assert.ok(subjects.has('Tiếng Anh'), `${grade} has English coverage`)
    }
  })
})
