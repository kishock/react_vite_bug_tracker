import { useState } from "react";

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
const STATUS_OPTIONS = ["Open", "In Progress", "Done"];

// 버그 생성 화면 컴포넌트.
// props:
// - form: 현재 입력값 객체
// - setForm: 입력 변경 시 form 상태를 업데이트하는 함수
// - onSubmit: 등록 버튼(폼 제출) 처리 함수
// - onCancel: 목록 화면으로 복귀하는 함수
// - isEditing: 수정 모드 여부
// - onDelete: 수정 모드에서 삭제 처리 함수
// - history/comments: 현재 버그의 이력/코멘트 데이터
// - editingCommentId/commentDraft: 코멘트 편집 상태
// - onAddComment/onStartCommentEdit/onCancelCommentEdit/onDeleteComment: 코멘트 액션
// - developers: assign 가능한 개발자 목록
function BugForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  isEditing,
  onDelete,
  t,
  history,
  comments,
  currentUser,
  editingCommentId,
  commentDraft,
  setCommentDraft,
  onAddComment,
  onStartCommentEdit,
  onCancelCommentEdit,
  onDeleteComment,
  language,
  developers,
}) {
  // 이력/코멘트는 최신 항목이 먼저 보이도록 내림차순 정렬.
  const [showHistory, setShowHistory] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const sortedHistory = [...history].sort((a, b) => new Date(b.at) - new Date(a.at));
  const sortedComments = [...comments].sort((a, b) => new Date(b.at) - new Date(a.at));
  const developerMap = new Map(developers.map((user) => [user.username, user.username]));

  const formatValue = (field, value) => {
    if (field === "status") {
      return t.statusLabels[value] || value;
    }
    if (field === "assigneeId") {
      return value ? `@${developerMap.get(value) || value}` : t.historyAssigneeNone;
    }
    return value || "-";
  };

  return (
    <section className="panel create-page">
      <div className="create-head">
        <h2>{isEditing ? t.formEditTitle : t.formCreateTitle}</h2>
        {/* 작성 취소 후 리스트 화면으로 복귀 */}
        <button type="button" className="ghost" onClick={onCancel}>
          {t.formBack}
        </button>
      </div>
      {/* submit 이벤트는 부모(App)의 handleCreateBug로 위임 */}
      <form className="form create-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder={t.formTitlePlaceholder}
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          required
        />
        <textarea
          // 설명은 선택 입력이며 비워도 등록 가능
          className="description-input"
          placeholder={t.formDescPlaceholder}
          value={form.description}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, description: event.target.value }))
          }
          rows={3}
        />
        <div className="row">
          <label>
            {t.formSeverity}
            <select
              // 심각도 선택값을 form 상태에 반영
              value={form.severity}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, severity: event.target.value }))
              }
            >
              {SEVERITY_OPTIONS.map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.formStatus}
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          {t.formAssignee}
          <select
            value={form.assigneeId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, assigneeId: event.target.value }))
            }
          >
            <option value="">{t.formUnassigned}</option>
            {developers.map((developer) => (
              <option key={developer.username} value={developer.username}>
                @{developer.username}
              </option>
            ))}
          </select>
        </label>
        <div className="create-actions">
          <button type="submit">{isEditing ? t.formSave : t.formRegister}</button>
          {isEditing ? (
            <button type="button" className="ghost danger-text" onClick={onDelete}>
              {t.formDelete}
            </button>
          ) : null}
        </div>
      </form>

      {isEditing ? (
        <section className="history-wrap">
          <div className="section-head">
            <h3>{t.historyTitle}</h3>
            <button
              type="button"
              className="section-toggle"
              title={showHistory ? t.sectionHide : t.sectionShow}
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {showHistory ? "⬆️" : "⬇️"}
            </button>
          </div>
          {showHistory ? (
            sortedHistory.length === 0 ? (
              <p className="empty">{t.historyEmpty}</p>
            ) : (
              <ul className="history-list">
                {sortedHistory.map((entry) => (
                  <li key={entry.id} className="history-item">
                    <p className="history-head">
                      {entry.action === "created" ? t.historyCreated : t.historyUpdated}
                    </p>
                    <p className="history-meta">
                      {t.historyBy}: @{entry.by} ·{" "}
                      {new Date(entry.at).toLocaleString(
                        language === "en" ? "en-US" : "ko-KR",
                      )}
                    </p>
                    {entry.action === "updated" ? (
                      entry.changes && entry.changes.length > 0 ? (
                        <ul className="history-changes">
                          {entry.changes.map((change, index) => (
                            <li key={`${entry.id}-${change.field}-${index}`}>
                              {t.fieldLabels[change.field] || change.field}:{" "}
                              {formatValue(change.field, change.from)} →{" "}
                              {formatValue(change.field, change.to)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="history-no-change">{t.historyNoChanges}</p>
                      )
                    ) : null}
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </section>
      ) : null}

      {isEditing ? (
        <section className="comments-wrap">
          <div className="section-head">
            <h3>{t.commentsTitle}</h3>
            <button
              type="button"
              className="section-toggle"
              title={showComments ? t.sectionHide : t.sectionShow}
              onClick={() => setShowComments((prev) => !prev)}
            >
              {showComments ? "⬆️" : "⬇️"}
            </button>
          </div>
          {showComments ? (
            <>
              {sortedComments.length === 0 ? (
                <p className="empty">{t.commentsEmpty}</p>
              ) : (
                <ul className="comments-list">
                  {sortedComments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <div className="comment-head-row">
                        <p className="comment-head">
                          @{comment.by}
                          {comment.by === currentUser ? ` (${t.commentsYou})` : ""}
                        </p>
                        {comment.by === currentUser ? (
                          <div className="comment-actions">
                            <button
                              type="button"
                              className="ghost comment-action-btn"
                              onClick={() => onStartCommentEdit(comment)}
                            >
                              {t.commentsEdit}
                            </button>
                            <button
                              type="button"
                              className="ghost danger-text comment-action-btn"
                              onClick={() => onDeleteComment(comment.id)}
                            >
                              {t.commentsDelete}
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <p className="comment-meta">
                        {new Date(comment.at).toLocaleString(
                          language === "en" ? "en-US" : "ko-KR",
                        )}
                      </p>
                      <p className="comment-text">{comment.message}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="comment-input-wrap">
                {/* 코멘트 신규 등록/수정 모두 동일한 입력창을 재사용한다. */}
                <textarea
                  className="comment-input"
                  placeholder={t.commentsPlaceholder}
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  rows={3}
                />
                <div className="comment-editor-actions">
                  <button type="button" onClick={onAddComment}>
                    {editingCommentId ? t.commentsSaveEdit : t.commentsAdd}
                  </button>
                  {editingCommentId ? (
                    <button
                      type="button"
                      className="ghost"
                      onClick={onCancelCommentEdit}
                    >
                      {t.commentsCancelEdit}
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      <div className="form-bottom-nav">
        <button type="button" className="ghost" onClick={onCancel}>
          {t.formBack}
        </button>
      </div>
    </section>
  );
}

export default BugForm;
