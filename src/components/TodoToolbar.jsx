const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'TODO', value: 'TODO' },
  { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
  { label: 'DONE', value: 'DONE' },
];

export default function TodoToolbar({
  keyword,
  statusFilter,
  onKeywordChange,
  onStatusChange,
  onCreateClick,
  loading,
}) {
  return (
    <section className="toolbar" aria-label="Todo tools">
      <label className="search-field">
        <span>Search</span>
        <input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Find by title or description"
          type="search"
        />
      </label>

      <div className="status-tabs" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => (
          <button
            className={statusFilter === filter.value ? 'status-tab active' : 'status-tab'}
            type="button"
            key={filter.value || 'all'}
            onClick={() => onStatusChange(filter.value)}
            disabled={loading}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <button className="button button-primary" type="button" onClick={onCreateClick}>
        Add Todo
      </button>
    </section>
  );
}
