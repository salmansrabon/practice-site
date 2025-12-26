import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');

export default function UsersPage() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setRows(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total || 0);
    } catch (e) {
      setRows([]);
      setTotalPages(1);
      setTotal(0);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page]);

  return (
    <DashboardLayout>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
            <div>
              <h2 className="mb-0">Registered Users <span className="badge bg-secondary ms-2">{total}</span></h2>
              <div className="text-muted small">Search, paginate, and review registered accounts.</div>
            </div>
            <div className="input-group" style={{ maxWidth: 260 }}>
              <input className="form-control" placeholder="Search" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
              <button className="btn btn-outline-primary" onClick={load} disabled={loading}>Refresh</button>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>{u.firstName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber}</td>
                    <td><span className="badge bg-primary-subtle text-primary-emphasis">{u.gender}</span></td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                    <td>
                      <a className="btn btn-sm btn-outline-primary me-2" href={`/dashboard/users/${u.id}`}>View</a>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (!confirm(`Delete user ${u.email}?`)) return;
                          try {
                            const res = await fetch(`/api/users/${u.id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || 'Delete failed');
                            load();
                          } catch (err) {
                            setError(err.message);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">{loading ? 'Loading...' : 'No data'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <span className="text-muted">Page {page} / {totalPages}</span>
            <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
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
