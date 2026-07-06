const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TodoItem({ work, changingStatusId, onEdit, onStatusChange, onDelete }) {
  const isChanging = changingStatusId === work.id;

  return (
    <article className="todo-item">
      <div className="todo-main">
        <div className="todo-title-line">
          <span className={`status-badge status-${work.status?.toLowerCase()}`}>{work.status}</span>
          <h3>{work.title}</h3>
        </div>
        <p>{work.description || 'No description'}</p>
      </div>

      <div className="todo-controls">
        <label className="status-select">
          <span>Status</span>
          <select
            value={work.status}
            onChange={(event) => onStatusChange(work.id, event.target.value)}
            disabled={isChanging}
          >
            {STATUSES.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className="todo-actions">
          <button className="button button-secondary" type="button" onClick={() => onEdit(work)}>
            Edit
          </button>
          <button className="button button-danger" type="button" onClick={() => onDelete(work)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
