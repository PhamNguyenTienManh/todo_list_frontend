import { useEffect, useState } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

const emptyForm = {
  title: '',
  description: '',
  status: 'TODO',
};

export default function TodoForm({ mode, initialValue, submitting, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm(initialValue ? { ...emptyForm, ...initialValue } : emptyForm);
    setValidationError('');
  }, [initialValue]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setValidationError('Title is required.');
      return;
    }

    setValidationError('');
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Prepare sprint board"
            autoFocus
          />
        </label>

        {mode === 'edit' && (
          <label>
            <span>Status</span>
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              {STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <label>
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Add a short note"
          rows="4"
        />
      </label>

      {(validationError || error) && <p className="form-error">{validationError || error}</p>}

      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'edit' ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  );
}
