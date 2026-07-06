import TodoItem from './TodoItem.jsx';

export default function TodoList({ works, loading, changingStatusId, onEdit, onStatusChange, onDelete }) {
  if (loading) {
    return <div className="state-panel">Loading todos...</div>;
  }

  if (!works.length) {
    return <div className="state-panel">No todos found.</div>;
  }

  return (
    <section className="todo-table" aria-label="Todo list">
      <div className="todo-table-header" aria-hidden="true">
        <span>Work</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <div className="todo-list">
        {works.map((work) => (
          <TodoItem
            work={work}
            key={work.id}
            changingStatusId={changingStatusId}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
