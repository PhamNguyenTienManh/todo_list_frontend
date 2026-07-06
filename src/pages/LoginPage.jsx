import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi.js';
import { setToken } from '../utils/tokenStorage.js';

function getLoginErrorMessage(error) {
  const errorCode = error?.payload?.code;

  if (errorCode === 1003) {
    return 'Tài khoản này không có trong hệ thống.';
  }

  if (errorCode === 1006) {
    return 'Mật khẩu không đúng.';
  }

  return error.message || 'Login failed.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/todos';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.username.trim() || !form.password) {
      setError('Please enter username and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await login({
        username: form.username.trim(),
        password: form.password,
      });

      if (!result?.authenticated || !result?.token) {
        throw new Error('Login failed.');
      }

      setToken(result.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to Todo Workbench</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              value={form.username}
              onChange={(event) => updateField('username', event.target.value)}
              placeholder="username"
              autoComplete="username"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="password"
              type="password"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary full-width" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
