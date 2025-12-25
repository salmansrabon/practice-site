import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: 'Male',
    agreement: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setSuccess('Signup successful! Redirecting to login page...');
      setCountdown(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Create Your Account</h1>
          <p className="text-muted mb-0">Fill in the details below to sign up.</p>
        </div>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h2 className="card-title mb-3">User Registration</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && (
              <div className="alert alert-success">
                {success}
                {countdown !== null && <div className="mt-2">Redirecting in {countdown} seconds...</div>}
              </div>
            )}
            <form onSubmit={onSubmit} className="needs-validation" noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input className="form-control" value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} required placeholder="Jane" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input className="form-control" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} required placeholder="Doe" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setField('email', e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" value={form.phoneNumber} onChange={(e) => setField('phoneNumber', e.target.value)} required placeholder="123-456-7890" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={form.password} onChange={(e) => setField('password', e.target.value)} required placeholder="Create a password" />
              </div>
              <div className="mb-3">
                <label className="form-label me-3">Gender</label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="genderMale" checked={form.gender === 'Male'} onChange={() => setField('gender', 'Male')} />
                  <label className="form-check-label" htmlFor="genderMale">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="genderFemale" checked={form.gender === 'Female'} onChange={() => setField('gender', 'Female')} />
                  <label className="form-check-label" htmlFor="genderFemale">Female</label>
                </div>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="agreement" checked={form.agreement} onChange={(e) => setField('agreement', e.target.checked)} />
                <label className="form-check-label" htmlFor="agreement">I agree to the terms</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-success" type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
