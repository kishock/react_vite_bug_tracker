// 단일 버그 카드 컴포넌트.
// 카드 클릭 시 편집 화면으로 이동한다.
function BugItem({ bug, onSelectBug, language, t }) {
  // severity 텍스트를 CSS 클래스명으로 변환해 색상 뱃지를 적용한다.
  const severityClass = `severity severity-${bug.severity.toLowerCase()}`;
  const createdDate = bug.createdAt
    ? new Date(bug.createdAt).toLocaleDateString(language === "en" ? "en-US" : "ko-KR")
    : "-";
  // 수정자가 있으면 수정자 아이디를 우선 표시하고, 없으면 최초 작성자를 표시한다.
  const authorId = bug.updatedBy || bug.authorId || "";
  const assigneeId = bug.assigneeId || "";

  return (
    <li className="bug-card" onClick={() => onSelectBug(bug)}>
      <div className="bug-main">
        <p className="bug-title">{bug.title}</p>
        <div className="bug-meta-line">
          <span className={severityClass}>{bug.severity}</span>
          <div className="bug-meta-right">
            <span className="bug-author">{authorId ? `@${authorId}` : "-"}</span>
            <span className="bug-date">{createdDate}</span>
          </div>
        </div>
        <p className="bug-assignee">
          {t.formAssignee}: {assigneeId ? `@${assigneeId}` : t.formUnassigned}
        </p>
        {bug.description ? <p className="bug-desc">{bug.description}</p> : null}
      </div>
    </li>
  );
}

export default BugItem;
