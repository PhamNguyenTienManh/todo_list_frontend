import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (form.username.trim().length < 3) {
      return 'Username must be at least 3 characters.';
    }

    if (form.password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (!form.fullName.trim()) {
      return 'Full name is required.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await registerUser({
        username: form.username.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">New workspace</p>
        <h1>Create your account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder="Nguyen Van A"
              autoComplete="name"
            />
          </label>
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
              placeholder="at least 8 characters"
              type="password"
              autoComplete="new-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary full-width" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
