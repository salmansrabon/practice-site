import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar() {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">Practice Site</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} href="/">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/signup" target="_blank">Signup</Link>
            </li>
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
  );
}
