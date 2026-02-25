import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AuthForm from "./components/AuthForm";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";
import Filters from "./components/Filters";

// localStorage에 저장할 키 이름.
// 앱을 새로고침해도 동일한 데이터를 복구하기 위해 사용한다.
const STORAGE_KEY = "bug-tracker-items";
// 사용자 테마 선택값(light/dark)을 저장하는 키.
const THEME_STORAGE_KEY = "bug-tracker-theme";
// UI 언어 선택값(ko/en)을 저장하는 키.
const LANGUAGE_STORAGE_KEY = "bug-tracker-language";
// 회원 계정 목록을 저장하는 키.
const USERS_STORAGE_KEY = "bug-tracker-users";
// 현재 로그인한 사용자 아이디를 저장하는 키.
const CURRENT_USER_STORAGE_KEY = "bug-tracker-current-user";
// 회원가입 시 선택 가능한 역할 목록.
const ROLE_OPTIONS = ["Developer", "QA", "Customer"];

// 다국어 문자열 사전.
// language 상태값(ko/en)을 키로 사용해 화면 문구를 동적으로 바꾼다.
const TRANSLATIONS = {
  ko: {
    logoSubtitle: "이슈 대시보드",
    menuList: "목록",
    menuSetting: "설정",
    logout: "로그아웃",
    settingTitle: "설정",
    settingThemeDesc: "테마 모드를 선택할 수 있습니다.",
    whiteMode: "화이트 모드",
    darkMode: "다크 모드",
    settingLangDesc: "언어를 선택할 수 있습니다.",
    korean: "한글",
    english: "영어",
    issueBoard: "이슈 보드",
    issueDesc: "상태별로 버그를 추적하고 해결하세요",
    createBug: "+ 버그 등록",
    authLogin: "로그인",
    authSignup: "회원가입",
    authForgot: "비밀번호 찾기",
    authOnlyMsg: "로그인한 사용자만 대시보드를 사용할 수 있습니다.",
    authCreateMsg: "아이디와 비밀번호를 등록해 계정을 생성하세요.",
    authForgotMsg: "아이디와 새 비밀번호를 입력해 비밀번호를 재설정하세요.",
    authLoginId: "로그인 아이디",
    authPassword: "비밀번호",
    authRole: "회원 구분",
    authLanguage: "언어",
    authNoAccount: "계정이 없나요?",
    authHasAccount: "이미 계정이 있나요?",
    authForgotHint: "비밀번호를 잊으셨나요?",
    authCreateAccount: "계정 생성",
    authResetPassword: "비밀번호 재설정",
    authErrorRequired: "아이디와 비밀번호를 입력해주세요.",
    authErrorTaken: "이미 사용 중인 아이디입니다.",
    authErrorInvalid: "아이디 또는 비밀번호가 올바르지 않습니다.",
    authErrorNoUser: "해당 아이디를 찾을 수 없습니다.",
    authResetDone: "비밀번호가 재설정되었습니다. 로그인해 주세요.",
    formCreateTitle: "버그 등록",
    formEditTitle: "버그 수정",
    formBack: "목록으로",
    formTitlePlaceholder: "버그 제목",
    formDescPlaceholder: "설명 (선택)",
    formSeverity: "심각도",
    formStatus: "상태",
    formSave: "수정 저장",
    formRegister: "등록하기",
    formDelete: "버그 삭제",
    formAssignee: "담당 개발자",
    formUnassigned: "미지정",
    deleteConfirm: "삭제하면 모든 수정 이력이 사라지며 복구할 수 없습니다. 삭제할까요?",
    historyTitle: "수정 이력",
    historyCreated: "버그 생성",
    historyUpdated: "버그 수정",
    historyNoChanges: "변경 없음",
    historyBy: "수정자",
    historyAssigneeNone: "미지정",
    historyEmpty: "아직 이력이 없습니다.",
    commentsTitle: "코멘트",
    commentsPlaceholder: "수정한 내용이나 전달사항을 남겨주세요",
    commentsAdd: "코멘트 등록",
    commentsEmpty: "아직 코멘트가 없습니다.",
    commentsYou: "나",
    commentsEdit: "수정",
    commentsDelete: "삭제",
    commentsSaveEdit: "코멘트 수정 저장",
    commentsCancelEdit: "수정 취소",
    commentsDeleteConfirm: "이 코멘트를 삭제하시겠습니까?",
    sectionShow: "펼치기",
    sectionHide: "숨기기",
    fieldLabels: {
      title: "제목",
      description: "설명",
      severity: "심각도",
      status: "상태",
      assigneeId: "담당 개발자",
    },
    filtersStatus: "상태",
    filtersSeverity: "심각도",
    filtersSearch: "제목 또는 설명 검색",
    all: "전체",
    noIssues: "이슈 없음",
    showing: "표시",
    of: "/",
    issuesUnit: "건",
    userRole: "역할",
    roles: {
      Developer: "개발자",
      QA: "QA",
      Customer: "고객",
    },
    statusLabels: {
      Open: "Open",
      "In Progress": "In Progress",
      Done: "Done",
    },
  },
  en: {
    logoSubtitle: "Issue Dashboard",
    menuList: "List",
    menuSetting: "Setting",
    logout: "Logout",
    settingTitle: "Setting",
    settingThemeDesc: "Choose your theme mode.",
    whiteMode: "White Mode",
    darkMode: "Dark Mode",
    settingLangDesc: "Choose your language.",
    korean: "Korean",
    english: "English",
    issueBoard: "Issue Board",
    issueDesc: "Track and resolve bugs by status",
    createBug: "+ Create Bug",
    authLogin: "Login",
    authSignup: "Sign Up",
    authForgot: "Forgot Password",
    authOnlyMsg: "Only logged-in users can use this dashboard.",
    authCreateMsg: "Create an account with your login ID and password.",
    authForgotMsg: "Enter your login ID and new password to reset it.",
    authLoginId: "Login ID",
    authPassword: "Password",
    authRole: "Role",
    authLanguage: "Language",
    authNoAccount: "No account yet?",
    authHasAccount: "Already have an account?",
    authForgotHint: "Forgot your password?",
    authCreateAccount: "Create Account",
    authResetPassword: "Reset Password",
    authErrorRequired: "Please enter both login ID and password.",
    authErrorTaken: "This login ID is already in use.",
    authErrorInvalid: "Login ID or password is incorrect.",
    authErrorNoUser: "No account found with this login ID.",
    authResetDone: "Password reset complete. Please log in.",
    formCreateTitle: "Create Bug",
    formEditTitle: "Edit Bug",
    formBack: "Back to List",
    formTitlePlaceholder: "Bug title",
    formDescPlaceholder: "Description (optional)",
    formSeverity: "Severity",
    formStatus: "Status",
    formSave: "Save Changes",
    formRegister: "Register Bug",
    formDelete: "Delete Bug",
    formAssignee: "Assignee",
    formUnassigned: "Unassigned",
    deleteConfirm:
      "Deleting this bug will remove all history and cannot be undone. Continue?",
    historyTitle: "History",
    historyCreated: "Bug Created",
    historyUpdated: "Bug Updated",
    historyNoChanges: "No field changes",
    historyBy: "Edited by",
    historyAssigneeNone: "Unassigned",
    historyEmpty: "No history yet.",
    commentsTitle: "Comments",
    commentsPlaceholder: "Leave notes about changes or discussion points",
    commentsAdd: "Add Comment",
    commentsEmpty: "No comments yet.",
    commentsYou: "You",
    commentsEdit: "Edit",
    commentsDelete: "Delete",
    commentsSaveEdit: "Save Comment",
    commentsCancelEdit: "Cancel Edit",
    commentsDeleteConfirm: "Delete this comment?",
    sectionShow: "Show",
    sectionHide: "Hide",
    fieldLabels: {
      title: "Title",
      description: "Description",
      severity: "Severity",
      status: "Status",
      assigneeId: "Assignee",
    },
    filtersStatus: "Status",
    filtersSeverity: "Severity",
    filtersSearch: "Search title or description",
    all: "All",
    noIssues: "No issues",
    showing: "Showing",
    of: "of",
    issuesUnit: "issues",
    userRole: "Role",
    roles: {
      Developer: "Developer",
      QA: "QA",
      Customer: "Customer",
    },
    statusLabels: {
      Open: "Open",
      "In Progress": "In Progress",
      Done: "Done",
    },
  },
};

// 버그 등록 폼의 초기 상태값.
// 등록 완료 후 이 값으로 되돌려 입력 필드를 비운다.
const initialForm = {
  title: "",
  description: "",
  severity: "Medium",
  status: "Open",
  assigneeId: "",
};

// 앱 시작 시 localStorage에서 기존 버그 목록을 불러온다.
// 데이터가 없거나 JSON 파싱에 실패하면 빈 배열로 안전하게 시작한다.
function loadInitialBugs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 마지막으로 선택한 테마를 복원한다.
// 값이 없거나 예외가 발생하면 light를 기본값으로 사용한다.
function loadInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function loadInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}

// 저장된 회원 목록을 복원한다.
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((user) => ({
      ...user,
      role: ROLE_OPTIONS.includes(user.role) ? user.role : "Customer",
    }));
  } catch {
    return [];
  }
}

// 마지막 로그인 사용자를 복원한다.
function loadCurrentUser() {
  try {
    return localStorage.getItem(CURRENT_USER_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

// 수정 이력 엔트리를 표준 형태로 생성한다.
// action: created | updated, by: 사용자 아이디, changes: 변경 필드 목록.
function createHistoryEntry(action, by, changes = []) {
  return {
    id: crypto.randomUUID(),
    action,
    by,
    at: new Date().toISOString(),
    changes,
  };
}

function App() {
  // 전체 버그 데이터(단일 소스 오브 트루스).
  // 앱의 모든 화면은 이 상태를 기준으로 렌더링된다.
  const [bugs, setBugs] = useState(loadInitialBugs);
  // Create Bug 화면의 폼 상태.
  const [form, setForm] = useState(initialForm);
  // 상단 필터/검색 상태.
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  // 현재 화면 모드: list | create | setting
  const [screen, setScreen] = useState("list");
  // 앱 테마: light | dark
  const [theme, setTheme] = useState(loadInitialTheme);
  const [language, setLanguage] = useState(loadInitialLanguage);
  // 인증 관련 상태: 회원 목록 + 로그인 사용자.
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    role: "Customer",
  });
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  // 코멘트 입력창의 draft 텍스트.
  const [commentDraft, setCommentDraft] = useState("");
  // 수정 중인 코멘트 id. null이면 신규 코멘트 등록 모드.
  const [editingCommentId, setEditingCommentId] = useState(null);
  // 수정 중인 버그 id. null이면 새 버그 등록 모드.
  const [editingBugId, setEditingBugId] = useState(null);

  // bugs가 바뀔 때마다 localStorage에 즉시 동기화한다.
  // 덕분에 브라우저 새로고침 이후에도 데이터가 유지된다.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
  }, [bugs]);

  // 테마가 변경될 때마다 선택값을 localStorage에 저장한다.
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  // 회원 목록 변경 시 localStorage에 동기화한다.
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // 로그인 사용자 변경 시 localStorage에 동기화한다.
  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, currentUser);
  }, [currentUser]);

  // 필터/검색 조건을 만족하는 버그 목록을 계산한다.
  // useMemo로 감싸서 관련 상태가 바뀔 때만 다시 계산한다.
  const t = TRANSLATIONS[language];
  // Assign 대상은 Developer 역할 사용자만 추린다.
  const developers = useMemo(
    () => users.filter((user) => user.role === "Developer"),
    [users],
  );
  // 현재 로그인 사용자의 프로필(역할 포함).
  const currentUserProfile = useMemo(
    () => users.find((user) => user.username === currentUser) || null,
    [users, currentUser],
  );
  // 현재 편집 중인 버그 상세.
  const editingBug = useMemo(
    () => bugs.find((bug) => bug.id === editingBugId) || null,
    [bugs, editingBugId],
  );

  const filteredBugs = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return bugs.filter((bug) => {
      const matchesStatus =
        statusFilter === "All" ? true : bug.status === statusFilter;
      const matchesSeverity =
        severityFilter === "All" ? true : bug.severity === severityFilter;
      const matchesSearch = normalizedSearch
        ? `${bug.title} ${bug.description}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [bugs, searchText, severityFilter, statusFilter]);

  // 등록/수정 공용 폼 제출 핸들러.
  // editingBugId가 있으면 수정, 없으면 신규 등록으로 동작한다.
  const handleSubmitBug = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      return;
    }

    if (editingBugId) {
      setBugs((prev) =>
        prev.map((bug) =>
          bug.id === editingBugId
            ? {
                ...bug,
                title,
                description,
                severity: form.severity,
                status: form.status,
                assigneeId: form.assigneeId,
                updatedAt: new Date().toISOString(),
                updatedBy: currentUser,
                history: [
                  ...(Array.isArray(bug.history) ? bug.history : []),
                  createHistoryEntry("updated", currentUser, [
                    ...(bug.title !== title
                      ? [{ field: "title", from: bug.title, to: title }]
                      : []),
                    ...(bug.description !== description
                      ? [
                          {
                            field: "description",
                            from: bug.description || "",
                            to: description || "",
                          },
                        ]
                      : []),
                    ...(bug.severity !== form.severity
                      ? [{ field: "severity", from: bug.severity, to: form.severity }]
                      : []),
                    ...(bug.status !== form.status
                      ? [{ field: "status", from: bug.status, to: form.status }]
                      : []),
                    ...(bug.assigneeId !== form.assigneeId
                      ? [
                          {
                            field: "assigneeId",
                            from: bug.assigneeId || "",
                            to: form.assigneeId || "",
                          },
                        ]
                      : []),
                  ]),
                ],
              }
            : bug,
        ),
      );
      setEditingBugId(null);
      setForm(initialForm);
      setCommentDraft("");
      setEditingCommentId(null);
      setScreen("list");
      return;
    }

    const newBug = {
      id: crypto.randomUUID(),
      title,
      description,
      severity: form.severity,
      status: form.status,
      assigneeId: form.assigneeId,
      createdAt: new Date().toISOString(),
      authorId: currentUser,
      history: [createHistoryEntry("created", currentUser)],
      comments: [],
    };

    setBugs((prev) => [newBug, ...prev]);
    setForm(initialForm);
    setCommentDraft("");
    setEditingCommentId(null);
    setScreen("list");
  };

  // 카드 삭제 버튼 클릭 시 해당 버그를 목록에서 제거한다.
  const deleteBug = (id) => {
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    if (editingBugId === id) {
      setEditingBugId(null);
      setForm(initialForm);
      setCommentDraft("");
      setEditingCommentId(null);
      setScreen("list");
    }
  };

  // 카드 클릭 시 해당 버그를 폼에 주입해 편집 화면으로 이동한다.
  const selectBugForEdit = (bug) => {
    setEditingBugId(bug.id);
    setForm({
      title: bug.title,
      description: bug.description,
      severity: bug.severity,
      status: bug.status,
      assigneeId: bug.assigneeId || "",
    });
    setCommentDraft("");
    setEditingCommentId(null);
    setScreen("create");
  };

  // 폼 화면의 취소 동작: 편집 상태를 초기화하고 리스트로 복귀한다.
  const cancelBugForm = () => {
    setEditingBugId(null);
    setForm(initialForm);
    setCommentDraft("");
    setEditingCommentId(null);
    setScreen("list");
  };

  // 폼 화면에서 현재 편집 중인 버그를 직접 삭제한다.
  const deleteBugFromForm = () => {
    if (!editingBugId) {
      return;
    }
    const confirmed = window.confirm(t.deleteConfirm);
    if (!confirmed) {
      return;
    }
    deleteBug(editingBugId);
  };

  const addCommentToBug = () => {
    if (!editingBugId) {
      return;
    }
    const message = commentDraft.trim();
    if (!message) {
      return;
    }
    // editingCommentId가 있으면 기존 코멘트 수정, 없으면 신규 코멘트 등록.
    setBugs((prev) =>
      prev.map((bug) =>
        bug.id === editingBugId
          ? {
              ...bug,
              comments: editingCommentId
                ? (Array.isArray(bug.comments) ? bug.comments : []).map((comment) =>
                    comment.id === editingCommentId && comment.by === currentUser
                      ? { ...comment, message, at: new Date().toISOString() }
                      : comment,
                  )
                : [
                    ...(Array.isArray(bug.comments) ? bug.comments : []),
                    {
                      id: crypto.randomUUID(),
                      by: currentUser,
                      message,
                      at: new Date().toISOString(),
                    },
                  ],
            }
          : bug,
      ),
    );
    setCommentDraft("");
    setEditingCommentId(null);
  };

  const startCommentEdit = (comment) => {
    // 본인 코멘트만 수정 가능.
    if (comment.by !== currentUser) {
      return;
    }
    setEditingCommentId(comment.id);
    setCommentDraft(comment.message);
  };

  const cancelCommentEdit = () => {
    setEditingCommentId(null);
    setCommentDraft("");
  };

  // 코멘트 삭제는 본인 작성 코멘트만 허용한다.
  const deleteCommentFromBug = (commentId) => {
    if (!editingBugId) {
      return;
    }
    const confirmed = window.confirm(t.commentsDeleteConfirm);
    if (!confirmed) {
      return;
    }
    setBugs((prev) =>
      prev.map((bug) =>
        bug.id === editingBugId
          ? {
              ...bug,
              comments: (Array.isArray(bug.comments) ? bug.comments : []).filter(
                (comment) => !(comment.id === commentId && comment.by === currentUser),
              ),
            }
          : bug,
      ),
    );
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setCommentDraft("");
    }
  };

  // 로그인/회원가입/비밀번호 재설정 공용 제출 핸들러.
  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const username = authForm.username.trim();
    const password = authForm.password.trim();
    setAuthInfo("");

    if (!username || !password) {
      setAuthError(t.authErrorRequired);
      return;
    }

    if (authMode === "signup") {
      const exists = users.some((user) => user.username === username);
      if (exists) {
        setAuthError(t.authErrorTaken);
        return;
      }
      setUsers((prev) => [...prev, { username, password, role: authForm.role }]);
      setCurrentUser(username);
      setAuthForm({ username: "", password: "", role: "Customer" });
      setAuthError("");
      return;
    }

    if (authMode === "forgot") {
      const exists = users.some((user) => user.username === username);
      if (!exists) {
        setAuthError(t.authErrorNoUser);
        return;
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.username === username ? { ...user, password } : user,
        ),
      );
      setAuthForm({ username: "", password: "", role: "Customer" });
      setAuthError("");
      setAuthInfo(t.authResetDone);
      setAuthMode("login");
      return;
    }

    const matchedUser = users.find(
      (user) => user.username === username && user.password === password,
    );
    if (!matchedUser) {
      setAuthError(t.authErrorInvalid);
      return;
    }

    setCurrentUser(username);
    setAuthForm({ username: "", password: "", role: "Customer" });
    setAuthError("");
  };

  // 로그아웃 시 현재 사용자와 편집 상태를 초기화한다.
  const handleLogout = () => {
    setCurrentUser("");
    setEditingBugId(null);
    setForm(initialForm);
    setAuthForm({ username: "", password: "", role: "Customer" });
    setAuthInfo("");
    setScreen("list");
    setAuthMode("login");
  };

  if (!currentUser) {
    return (
      <main className={`auth-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
        <AuthForm
          t={t}
          roleOptions={ROLE_OPTIONS}
          language={language}
          setLanguage={setLanguage}
          mode={authMode}
          setMode={(nextMode) => {
            setAuthMode(nextMode);
            setAuthError("");
            setAuthInfo("");
            setAuthForm((prev) => ({ ...prev, role: "Customer" }));
          }}
          authForm={authForm}
          setAuthForm={setAuthForm}
          onSubmit={handleAuthSubmit}
          errorMessage={authError}
          infoMessage={authInfo}
        />
      </main>
    );
  }

  return (
    <main className={`layout ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* 좌측 네비게이션: 로고 + 주요 메뉴(List / Setting). */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-mark">BT</div>
          <div>
            <p className="logo-title">Bug Tracker</p>
            <p className="logo-subtitle">{t.logoSubtitle}</p>
          </div>
        </div>

        <nav className="menu">
          <button
            type="button"
            className={screen === "list" ? "menu-item active" : "menu-item"}
            onClick={() => setScreen("list")}
          >
            {t.menuList}
          </button>
          <button
            type="button"
            className={screen === "setting" ? "menu-item active" : "menu-item"}
            onClick={() => setScreen("setting")}
          >
            {t.menuSetting}
          </button>
        </nav>

        <div className="user-box">
          <p className="user-id">@{currentUser}</p>
          <p className="user-role">
            {t.userRole}: {t.roles[currentUserProfile?.role || "Customer"]}
          </p>
          <button type="button" className="menu-item logout" onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
      </aside>

      {/* 우측 메인 영역: screen 상태값에 따라 화면을 조건부 렌더링한다. */}
      <section className="content">
        {/* Create Bug 전용 화면. 등록 또는 취소 후 List로 돌아간다. */}
        {screen === "create" ? (
          <BugForm
            form={form}
            setForm={setForm}
            t={t}
            language={language}
            isEditing={Boolean(editingBugId)}
            developers={developers}
            history={editingBug?.history || []}
            comments={editingBug?.comments || []}
            currentUser={currentUser}
            editingCommentId={editingCommentId}
            commentDraft={commentDraft}
            setCommentDraft={setCommentDraft}
            onAddComment={addCommentToBug}
            onStartCommentEdit={startCommentEdit}
            onCancelCommentEdit={cancelCommentEdit}
            onDeleteComment={deleteCommentFromBug}
            onSubmit={handleSubmitBug}
            onCancel={cancelBugForm}
            onDelete={deleteBugFromForm}
          />
        ) : null}

        {/* Setting 임시 화면(확장 포인트). */}
        {screen === "setting" ? (
          <section className="panel">
            <h2>{t.settingTitle}</h2>
            <p className="muted">{t.settingThemeDesc}</p>
            <div className="theme-options">
              <button
                type="button"
                className={theme === "light" ? "theme-option active" : "theme-option"}
                onClick={() => setTheme("light")}
              >
                {t.whiteMode}
              </button>
              <button
                type="button"
                className={theme === "dark" ? "theme-option active" : "theme-option"}
                onClick={() => setTheme("dark")}
              >
                {t.darkMode}
              </button>
            </div>
            <p className="muted setting-lang">{t.settingLangDesc}</p>
            <div className="theme-options">
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
          </section>
        ) : null}

        {/* 기본 대시보드 화면: 상단 헤더 + 필터 + 칸반 보드. */}
        {screen === "list" ? (
          <>
            <header className="topbar">
              <div>
                <h1>{t.issueBoard}</h1>
                <p className="muted">{t.issueDesc}</p>
              </div>
              <button
                type="button"
                className="create-link"
                onClick={() => {
                  setEditingBugId(null);
                  setForm({
                    ...initialForm,
                    assigneeId:
                      currentUserProfile?.role === "Developer" ? currentUser : "",
                  });
                  setScreen("create");
                }}
              >
                {t.createBug}
              </button>
            </header>

            {/* 상태/심각도/검색 조건을 설정하는 컨트롤 영역. */}
            <Filters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              searchText={searchText}
              setSearchText={setSearchText}
              totalCount={bugs.length}
              filteredCount={filteredBugs.length}
              t={t}
            />

            {/* Open / In Progress / Done 컬럼 보드. */}
            <BugList
              bugs={filteredBugs}
              onSelectBug={selectBugForEdit}
              t={t}
              language={language}
            />
          </>
        ) : null}
      </section>
    </main>
  );
}

export default App;
