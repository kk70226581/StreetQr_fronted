import React from 'react';

function Header() {
  return (
    <header className="bg-warning py-3 shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">🚀 StreetQR</h1>
          <p className="mb-0 text-dark">Create your digital menu for free</p>
        </div>
        <nav className="mt-3 mt-md-0">
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="/vendor">Vendor Panel</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-semibold" href="/menu/demo">View Demo</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
