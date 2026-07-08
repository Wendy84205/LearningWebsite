'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getGradeSlug } from '@/lib/grades'
import styles from './page.module.css'

function ParentLoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || ''
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login')
  const [role, setRole] = useState(searchParams.get('role') === 'admin' ? 'admin' : 'parent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const switchTab = (nextTab) => {
    if (role === 'admin' && nextTab === 'register') return
    setTab(nextTab)
    setError('')
    setSuccess('')
    setConfirmPassword('')
  }

  const switchRole = (nextRole) => {
    setRole(nextRole)
    setTab('login')
    setError('')
    setSuccess('')
    setConfirmPassword('')
  }

  const getAuthErrorMessage = (message, fallback) => {
    const normalized = String(message || '').toLowerCase()
    if (normalized.includes('database') || normalized.includes('cơ sở dữ liệu')) {
      return 'Hệ thống đang chưa kết nối được cơ sở dữ liệu. Bố mẹ vui lòng thử lại sau ít phút.'
    }
    if (normalized.includes('invalid credentials')) return 'Email hoặc mật khẩu chưa đúng.'
    if (normalized.includes('email already registered')) return 'Email này đã có tài khoản. Bố mẹ hãy chuyển sang Đăng nhập.'
    if (normalized.includes('email and password required')) return 'Vui lòng nhập đầy đủ email và mật khẩu.'
    return message || fallback
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Mật khẩu cần có ít nhất 6 ký tự.')
    if (password !== confirmPassword) return setError('Mật khẩu không khớp!')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) return setError(getAuthErrorMessage(data.error, 'Đăng ký thất bại. Vui lòng thử lại.'))
      localStorage.setItem('parentEmail', data.email)
      setSuccess('Tạo tài khoản thành công. Tiếp theo, bố mẹ thêm hồ sơ cho bé.')
      setTimeout(() => router.push('/add-profile'), 800)
    } catch (err) {
      setLoading(false)
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) return setError(getAuthErrorMessage(data.error, 'Đăng nhập thất bại. Vui lòng thử lại.'))
      localStorage.setItem('parentEmail', data.email)
      
      if (data.profiles && data.profiles.length > 0) {
        if (data.profiles.length === 1) {
          const profile = data.profiles[0]
          const slug = getGradeSlug(profile.grade)
          localStorage.setItem('profileId', profile.id)
          localStorage.setItem('profileName', profile.name)
          localStorage.setItem('mascotName', profile.mascotName || 'Tin Tin')
          localStorage.setItem('mascotEmoji', profile.mascotImage || '🤖')
          localStorage.setItem('gradeSlug', slug)
          router.push(`/learning/${slug}`)
        } else {
          router.push('/profile-select')
        }
      } else {
        router.push('/add-profile')
      }
    } catch (err) {
      setLoading(false)
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) return setError(data.error || 'Tài khoản hoặc mật khẩu quản trị không chính xác.')
      const safeNext = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/admin'
      setSuccess('Đăng nhập admin thành công. Đang mở CMS...')
      setTimeout(() => router.push(safeNext), 250)
    } catch (err) {
      setLoading(false)
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.')
    }
  }

  const handleGoogleCallback = useCallback(async (response) => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) return setError(data.error || 'Đăng nhập Google thất bại')
      
      localStorage.setItem('parentEmail', data.email)
      
      if (data.profiles && data.profiles.length > 0) {
        if (data.profiles.length === 1) {
          const profile = data.profiles[0]
          const slug = getGradeSlug(profile.grade)
          localStorage.setItem('profileId', profile.id)
          localStorage.setItem('profileName', profile.name)
          localStorage.setItem('mascotName', profile.mascotName || 'Tin Tin')
          localStorage.setItem('mascotEmoji', profile.mascotImage || '🤖')
          localStorage.setItem('gradeSlug', slug)
          router.push(`/learning/${slug}`)
        } else {
          router.push('/profile-select')
        }
      } else {
        router.push('/add-profile')
      }
    } catch (err) {
      setLoading(false)
      setError('Đã có lỗi xảy ra khi kết nối Google. Vui lòng thử lại.')
    }
  }, [router])

  useEffect(() => {
    if (role === 'admin') return undefined
    let initialized = false
    const initGoogleSignIn = () => {
      if (initialized) return
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        if (!clientId) {
          initialized = true
          setError('Google Login chưa được cấu hình client ID.')
          return
        }
        
        initialized = true
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        })

        const btnElement = document.getElementById('google-signin-btn')
        if (btnElement) {
          window.google.accounts.id.renderButton(
            btnElement,
            { theme: 'outline', size: 'large', width: btnElement.offsetWidth || 300, text: 'signin_with' }
          )
        }
      }
    }

    // Try initializing, or retry after a small delay to make sure GSI script is loaded
    initGoogleSignIn()
    const timer = setTimeout(initGoogleSignIn, 800)
    return () => { clearTimeout(timer); initialized = true }
  }, [tab, role, handleGoogleCallback])

  return (
    <div className={styles.page}>
      {/* Back button */}
      <Link href="/" className={styles.backBtn}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        Trang chủ
      </Link>

      {/* Main content area */}
      <main className={styles.main}>
        {/* Background Blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        <div className={styles.container}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logoIconBox}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`} style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <h1 className={styles.logoTitle}>Học Vui</h1>
            <p className={styles.logoDesc}>Đồng hành cùng bé kiến tạo tương lai</p>
          </div>

          {/* Auth Card */}
          <div className={styles.card}>
            <div className={styles.roleSwitch} aria-label="Chọn loại tài khoản">
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'parent' ? styles.roleButtonActive : ''}`}
                onClick={() => switchRole('parent')}
              >
                <span className="material-symbols-outlined" aria-hidden="true">family_restroom</span>
                Phụ huynh
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'admin' ? styles.roleButtonActive : ''}`}
                onClick={() => switchRole('admin')}
              >
                <span className="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
                Admin
              </button>
            </div>

            {/* Tab Switcher */}
            {role === 'parent' ? (
              <div className={styles.tabs}>
                <button
                  id="tab-login"
                  className={`${styles.tab} ${tab === 'login' ? styles.tabActive : styles.tabInactive}`}
                  onClick={() => switchTab('login')}
                >
                  Đăng nhập
                </button>
                <button
                  id="tab-register"
                  className={`${styles.tab} ${tab === 'register' ? styles.tabActive : styles.tabInactive}`}
                  onClick={() => switchTab('register')}
                >
                  Đăng ký
                </button>
              </div>
            ) : (
              <div className={styles.adminModeBanner}>
                <span className="material-symbols-outlined" aria-hidden="true">shield_lock</span>
                <div>
                  <strong>Đăng nhập quản trị CMS</strong>
                  <p>Dùng tài khoản trong cấu hình ADMIN_EMAIL và ADMIN_PASSWORD.</p>
                </div>
              </div>
            )}

            {/* Forms */}
            {role === 'admin' ? (
              <form id="form-admin-login" onSubmit={handleAdminLogin} className={styles.form}>
                <div className={styles.formIntro}>
                  <h2 className={styles.formTitle}>Admin Dashboard CMS</h2>
                  <p className={styles.formDesc}>Một trang đăng nhập chung cho phụ huynh và đội quản trị Học Vui.</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="admin-email">Email quản trị viên</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>alternate_email</span>
                    <input
                      id="admin-email"
                      className={styles.input}
                      type="email"
                      placeholder="admin@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="admin-password">Mật khẩu admin</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>key</span>
                    <input
                      id="admin-password"
                      className={styles.passwordInput}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu admin"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className={styles.noticeBox}>
                  <span className="material-symbols-outlined">verified_user</span>
                  <span>Phiên admin được lưu bằng cookie HttpOnly riêng, tách biệt với phiên phụ huynh.</span>
                </div>

                {error && (
                  <div className={styles.error}>
                    <span className="material-symbols-outlined">warning</span>
                    {error}
                  </div>
                )}
                {success && (
                  <div className={styles.successMsg}>
                    <span className="material-symbols-outlined">check_circle</span>
                    {success}
                  </div>
                )}

                <button
                  id="btn-admin-login"
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {loading ? 'Đang xác thực...' : 'Đăng nhập Admin'}
                </button>
                <p className={styles.helperText}>Sau khi đăng nhập, hệ thống sẽ chuyển thẳng vào Admin Dashboard.</p>
              </form>
            ) : tab === 'register' ? (
              <form id="form-register" onSubmit={handleRegister} className={styles.form}>
                <div className={styles.formIntro}>
                  <h2 className={styles.formTitle}>Tạo tài khoản phụ huynh</h2>
                  <p className={styles.formDesc}>Dùng email của bố mẹ để quản lý hồ sơ học tập, tiến độ và báo cáo của bé.</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-email">Email của bố mẹ</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                    <input
                      id="input-email-reg"
                      className={styles.input}
                      type="email"
                      placeholder="vi-du@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-password">Mật khẩu</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                    <input
                      id="input-pass-reg"
                      className={styles.passwordInput}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ít nhất 6 ký tự"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-confirm-password">Xác nhận mật khẩu</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                    <input
                      id="input-confirm-pass"
                      className={styles.passwordInput}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className={styles.error}>
                    <span className="material-symbols-outlined">warning</span>
                    {error}
                  </div>
                )}
                {success && (
                  <div className={styles.successMsg}>
                    <span className="material-symbols-outlined">check_circle</span>
                    {success}
                  </div>
                )}

                <button
                  id="btn-register"
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản phụ huynh'}
                </button>
                <p className={styles.helperText}>Sau khi đăng ký, hệ thống sẽ chuyển bố mẹ sang bước thêm hồ sơ cho bé.</p>
              </form>
            ) : (
              <form id="form-login" onSubmit={handleLogin} className={styles.form}>
                <div className={styles.formIntro}>
                  <h2 className={styles.formTitle}>Đăng nhập tài khoản phụ huynh</h2>
                  <p className={styles.formDesc}>Tiếp tục vào hồ sơ của bé, bản đồ học tập và báo cáo tiến độ đã lưu.</p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="login-email">Email của bố mẹ</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                    <input
                      id="input-email-login"
                      className={styles.input}
                      type="email"
                      placeholder="vi-du@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="login-password">Mật khẩu</label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                    <input
                      id="input-pass-login"
                      className={styles.passwordInput}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className={styles.noticeBox}>
                  <span className="material-symbols-outlined">info</span>
                  <span>Chức năng đặt lại mật khẩu sẽ được bổ sung sau. Nếu quên mật khẩu, bố mẹ vui lòng tạo tài khoản mới tạm thời.</span>
                </div>

                {error && (
                  <div className={styles.error}>
                    <span className="material-symbols-outlined">warning</span>
                    {error}
                  </div>
                )}

                <button
                  id="btn-login"
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
                <p className={styles.helperText}>Nếu tài khoản có nhiều bé, bố mẹ sẽ được chọn hồ sơ trước khi vào trang học.</p>
              </form>
            )}

            {role === 'parent' && (
              <>
                {/* Divider */}
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>hoặc</span>
                </div>

                {/* Social Login Button */}
                <div id="google-signin-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }} />
              </>
            )}


            {/* Bottom Footer Info */}
            <div className={styles.footerText}>
              {role === 'admin' ? (
                <>
                  Dùng tài khoản phụ huynh?{' '}
                  <button
                    className={styles.footerTextLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => switchRole('parent')}
                  >
                    Chuyển sang phụ huynh
                  </button>
                </>
              ) : tab === 'login' ? (
                <>
                  Chưa có tài khoản?{' '}
                  <button
                    className={styles.footerTextLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => switchTab('register')}
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{' '}
                  <button
                    className={styles.footerTextLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => switchTab('login')}
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Mascot */}
        <div className={styles.mascotWrapper}>
          <div className={styles.mascotBubble}>
            <p className={styles.mascotBubbleText}>Chào mừng bố mẹ!</p>
            <div className={styles.mascotBubbleArrow} />
          </div>
          <img
            alt="Mascot Robot"
            className={styles.mascotImg}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjMDxYUb6IdLqhhu6s5B89Hx9TN-Jz7M65mi6w5Kuq-sg2JzNPnTI0OWJImOMQpItWvpLmfsmrYhLk6O99cFL-4VPvkUurUYV7RTMBFVJOq8SBodutfpFy0da1Y1jsq3DV6E2_668bLKnOtzoUMNp-HYzn1OA4tV4l2E60OPRFFWXwh5C3i_L9rrGW1g1LP4q8KmbIPlhi98WBZXxO-H9rzjA57EkN37dxRhcZEFStKjI2Au3yp1LeXCGFPNFqR8kfxSFMSKTKi2s"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerCopyright}>© 2026 Học Vui – Học tập là niềm vui</p>
          <div className={styles.footerLinks}>
            <a className={styles.footerLink} href="#">Điều khoản</a>
            <a className={styles.footerLink} href="#">Bảo mật</a>
            <a className={styles.footerLink} href="#">Trợ giúp</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ParentLoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>Đang tải...</div>}>
      <ParentLoginInner />
    </Suspense>
  )
}
