import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;
  
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/dashboard/profile">Practice Site</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/dashboard/profile') ? 'active' : ''}`} href="/dashboard/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/dashboard/users') ? 'active' : ''}`} href="/dashboard/users">Users</Link>
              </li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <main className="container py-4 flex-grow-1">
        {children}
      </main>
      <footer className="bg-dark text-white-50 py-3 mt-auto">
        <div className="container small text-center">Practice Site · Next.js + Bootstrap</div>
      </footer>
    </div>
  );
}
