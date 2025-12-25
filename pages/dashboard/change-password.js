import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Optionally redirect to profile after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="card-title mb-3">Change Password</h2>
              <p className="text-muted mb-4">Update your account password</p>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.currentPassword}
                    onChange={(e) => setField('currentPassword', e.target.value)}
                    required
                    placeholder="Enter current password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.newPassword}
                    onChange={(e) => setField('newPassword', e.target.value)}
                    required
                    placeholder="Enter new password"
                  />
                  <div className="form-text">Password must be at least 6 characters</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={(e) => setField('confirmPassword', e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => router.push('/dashboard/profile')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  const me = getUserFromReq(context.req);
  if (!me) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
}
