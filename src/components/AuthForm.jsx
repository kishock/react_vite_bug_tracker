// 인증 화면 컴포넌트(로그인/회원가입 공용).
// mode 값에 따라 로그인 입력 UI와 회원가입 입력 UI를 전환한다.
function AuthForm({
  t,
  roleOptions,
  mode,
  setMode,
  authForm,
  setAuthForm,
  onSubmit,
  errorMessage,
}) {
  const isLogin = mode === "login";

  return (
    <section className="auth-card">
      <p className="auth-badge">Bug Tracker</p>
      <h1>{isLogin ? t.authLogin : t.authSignup}</h1>
      <p className="muted">
        {isLogin ? t.authOnlyMsg : t.authCreateMsg}
      </p>

      <form className="form" onSubmit={onSubmit}>
        <label>
          {t.authLoginId}
          <input
            type="text"
            placeholder="your-id"
            value={authForm.username}
            onChange={(event) =>
              setAuthForm((prev) => ({ ...prev, username: event.target.value }))
            }
            required
          />
        </label>
        <label>
          {t.authPassword}
          <input
            type="password"
            placeholder="password"
            value={authForm.password}
            onChange={(event) =>
              setAuthForm((prev) => ({ ...prev, password: event.target.value }))
            }
            required
          />
        </label>
        {!isLogin ? (
          <label>
            {t.authRole}
            <select
              value={authForm.role}
              onChange={(event) =>
                setAuthForm((prev) => ({ ...prev, role: event.target.value }))
              }
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {t.roles[role]}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        <button type="submit" className="auth-submit">
          {isLogin ? t.authLogin : t.authCreateAccount}
        </button>
      </form>

      <div className="auth-switch">
        {isLogin ? t.authNoAccount : t.authHasAccount}
        <button
          type="button"
          className="ghost"
          onClick={() => setMode(isLogin ? "signup" : "login")}
        >
          {isLogin ? t.authSignup : t.authLogin}
        </button>
      </div>
    </section>
  );
}

export default AuthForm;
