export default function Pagination({ page, totalPages, totalElements, onPageChange, loading }) {
  if (totalPages <= 1 && totalElements === 0) {
    return null;
  }

  const currentPage = page + 1;

  return (
    <nav className="pagination" aria-label="Pagination">
      <p>
        Page {currentPage} of {Math.max(totalPages, 1)} · {totalElements} total
      </p>
      <div>
        <button
          className="button button-secondary"
          type="button"
          disabled={loading || page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className="button button-secondary"
          type="button"
          disabled={loading || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
