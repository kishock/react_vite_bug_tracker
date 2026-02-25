const STATUS_OPTIONS = ["Open", "In Progress", "Done"];
const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

// 리스트 화면 상단 필터 컴포넌트.
// props로 전달받은 상태 setter를 통해 App의 필터 상태를 직접 갱신한다.
// totalCount/filteredCount는 우측 요약 카운트 표시용이다.
function Filters({
  statusFilter,
  setStatusFilter,
  severityFilter,
  setSeverityFilter,
  searchText,
  setSearchText,
  totalCount,
  filteredCount,
  t,
}) {
  return (
    <section className="filters-wrap">
      <div className="filters">
        {/* 상태 필터: 특정 상태만 보거나(All) 전체를 볼 수 있다. */}
        <label>
          {t.filtersStatus}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">{t.all}</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {t.statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        {/* Severity 필터: Low/Medium/High/Critical 기반 필터링 */}
        <label>
          {t.filtersSeverity}
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
          >
            <option value="All">{t.all}</option>
            {SEVERITY_OPTIONS.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </label>

        {/* 제목 + 설명 문자열을 합쳐 부분 검색 */}
        <input
          type="text"
          placeholder={t.filtersSearch}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <p className="filters-summary">
          {/* 필터 적용 후 보여지는 개수 / 전체 개수 */}
          {t.showing} {filteredCount}
          {filteredCount !== totalCount ? ` ${t.of} ${totalCount}` : ""} {t.issuesUnit}
        </p>
      </div>
    </section>
  );
}

export default Filters;
