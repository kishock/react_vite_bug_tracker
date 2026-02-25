import BugItem from "./BugItem";

// 칸반 컬럼 순서(고정).
const STATUS_COLUMNS = ["Open", "In Progress", "Done"];

// 버그 보드 컴포넌트.
// 필터링이 끝난 bugs를 상태별 컬럼으로 분배해 렌더링한다.
function BugList({ bugs, onSelectBug, t, language }) {
  return (
    <section className="board">
      {STATUS_COLUMNS.map((status) => {
        // 현재 컬럼 status에 해당하는 카드만 추려낸다.
        const columnBugs = bugs.filter((bug) => bug.status === status);
        return (
          <article key={status} className="board-column">
            <div className="column-head">
              <h3>{t.statusLabels[status]}</h3>
              <span>{columnBugs.length}</span>
            </div>

            {columnBugs.length === 0 ? (
              <p className="empty">{t.noIssues}</p>
            ) : (
              // 각 카드는 BugItem이 담당하며 상태 변경/삭제 이벤트를 위임한다.
              <ul className="column-list">
                {columnBugs.map((bug) => (
                  <BugItem
                    key={bug.id}
                    bug={bug}
                    onSelectBug={onSelectBug}
                    language={language}
                    t={t}
                  />
                ))}
              </ul>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default BugList;
