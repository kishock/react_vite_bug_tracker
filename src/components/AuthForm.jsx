// 인증 화면 컴포넌트(로그인/회원가입 공용).
// mode 값에 따라 로그인 입력 UI와 회원가입 입력 UI를 전환한다.
function AuthForm({
  t,
  roleOptions,
  language,
  setLanguage,
  mode,
  setMode,
  authForm,
  setAuthForm,
  onSubmit,
  errorMessage,
  infoMessage,
}) {
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";

  return (
    <section className="auth-card">
      <p className="auth-badge">Bug Tracker</p>
      <h1>{isLogin ? t.authLogin : isForgot ? t.authForgot : t.authSignup}</h1>
      <p className="muted">
        {isLogin ? t.authOnlyMsg : isForgot ? t.authForgotMsg : t.authCreateMsg}
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
        {!isLogin && !isForgot ? (
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
        {infoMessage ? <p className="auth-info">{infoMessage}</p> : null}
        <button type="submit" className="auth-submit">
          {isLogin ? t.authLogin : isForgot ? t.authResetPassword : t.authCreateAccount}
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
      {isLogin ? (
        <div className="auth-switch">
          {t.authForgotHint}
          <button
            type="button"
            className="ghost"
            onClick={() => setMode("forgot")}
          >
            {t.authForgot}
          </button>
        </div>
      ) : null}

      <div className="auth-language">
        <span>{t.authLanguage}</span>
        <div className="auth-language-actions">
          <button
            type="button"
            className={language === "ko" ? "theme-option active" : "theme-option"}
            onClick={() => setLanguage("ko")}
          >
            {t.korean}
          </button>
          <button
            type="button"
            className={language === "en" ? "theme-option active" : "theme-option"}
            onClick={() => setLanguage("en")}
          >
            {t.english}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AuthForm;
