import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');
const { findUserByEmail } = require('../../lib/data');

export default function ProfilePage({ user }) {
  return (
    <DashboardLayout>
      <div className="card shadow-lg border-0 rounded-4">
      <div className="card-body p-4">
        <h2 className="card-title mb-3">Profile</h2>
        {!user ? (
          <div className="alert alert-warning">No user data</div>
        ) : (
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">First Name</span><span className="fw-semibold">{user.firstName}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Last Name</span><span className="fw-semibold">{user.lastName}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span className="fw-semibold">{user.email}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Phone</span><span className="fw-semibold">{user.phoneNumber}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Gender</span><span className="fw-semibold">{user.gender}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Joined</span><span className="fw-semibold">{new Date(user.createdAt).toLocaleString()}</span></li>
          </ul>
        )}
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
  const user = await findUserByEmail(me.email);
  return { props: { user: user || null } };
}
