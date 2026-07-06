import { useCallback, useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/AppLayout.jsx';
import Pagination from '../components/Pagination.jsx';
import TodoForm from '../components/TodoForm.jsx';
import TodoList from '../components/TodoList.jsx';
import TodoToolbar from '../components/TodoToolbar.jsx';
import {
  createWork,
  deleteWork,
  getWorks,
  updateWork,
  updateWorkStatus,
} from '../api/workApi.js';

const PAGE_SIZE = 10;

export default function TodoPage() {
  const [works, setWorks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const isFormOpen = Boolean(formMode);

  const filters = useMemo(
    () => ({
      keyword: keyword.trim(),
      status: statusFilter,
      page,
      size: PAGE_SIZE,
    }),
    [keyword, page, statusFilter],
  );

  const loadWorks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getWorks(filters);
      setWorks(result?.content || []);
      setPage(result?.number || 0);
      setTotalPages(result?.totalPages || 0);
      setTotalElements(result?.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Could not load todos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  function handleKeywordChange(value) {
    setKeyword(value);
    setPage(0);
  }

  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(0);
  }

  function openCreateForm() {
    setSelectedWork(null);
    setFormMode('create');
    setFormError('');
  }

  function openEditForm(work) {
    setSelectedWork(work);
    setFormMode('edit');
    setFormError('');
  }

  function closeForm() {
    setFormMode(null);
    setSelectedWork(null);
    setFormError('');
  }

  async function handleFormSubmit(payload) {
    setSubmitting(true);
    setFormError('');

    try {
      if (formMode === 'edit' && selectedWork) {
        await updateWork(selectedWork.id, payload);
      } else {
        await createWork({
          title: payload.title,
          description: payload.description,
        });
      }

      closeForm();
      await loadWorks();
    } catch (err) {
      setFormError(err.message || 'Could not save todo.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusUpdate(id, status) {
    const previousWorks = works;
    setChangingStatusId(id);
    setWorks((current) => current.map((work) => (work.id === id ? { ...work, status } : work)));

    try {
      await updateWorkStatus(id, status);
    } catch (err) {
      setWorks(previousWorks);
      setError(err.message || 'Could not update status.');
    } finally {
      setChangingStatusId(null);
    }
  }

  function openDeleteConfirm(work) {
    setDeleteTarget(work);
    setError('');
  }

  function closeDeleteConfirm() {
    if (!deleteSubmitting) {
      setDeleteTarget(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleteSubmitting(true);
    setError('');

    try {
      await deleteWork(deleteTarget.id);

      if (works.length === 1 && page > 0) {
        setPage((current) => current - 1);
      } else {
        await loadWorks();
      }

      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || 'Could not delete todo.');
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <TodoToolbar
        keyword={keyword}
        statusFilter={statusFilter}
        loading={loading}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onCreateClick={openCreateForm}
      />

      {error && <div className="alert">{error}</div>}

      {isFormOpen && (
        <div className="modal-backdrop" onMouseDown={closeForm}>
          <div
            className="form-panel modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="todo-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="panel-heading">
              <h2 id="todo-form-title">{formMode === 'edit' ? 'Edit Todo' : 'Add Todo'}</h2>
              <button className="icon-button" type="button" aria-label="Close" onClick={closeForm}>
                X
              </button>
            </div>
            <TodoForm
              mode={formMode}
              initialValue={selectedWork}
              submitting={submitting}
              error={formError}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop" onMouseDown={closeDeleteConfirm}>
          <div
            className="form-panel confirm-panel"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-message"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="panel-heading">
              <h2 id="delete-confirm-title">Delete Todo</h2>
              <button className="icon-button" type="button" aria-label="Close" onClick={closeDeleteConfirm}>
                X
              </button>
            </div>
            <p className="confirm-message" id="delete-confirm-message">
              Are you sure you want to delete "{deleteTarget.title}"? This action cannot be undone.
            </p>
            <div className="form-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={closeDeleteConfirm}
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={confirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <TodoList
        works={works}
        loading={loading}
        changingStatusId={changingStatusId}
        onEdit={openEditForm}
        onStatusChange={handleStatusUpdate}
        onDelete={openDeleteConfirm}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={loading}
        onPageChange={setPage}
      />
    </AppLayout>
  );
}
