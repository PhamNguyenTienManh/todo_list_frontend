import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../utils/tokenStorage.js';

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    function handleExpired() {
      navigate('/login', { replace: true });
    }

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [navigate]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Todo Workbench</h1>
        </div>
        <button className="button button-secondary" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}
