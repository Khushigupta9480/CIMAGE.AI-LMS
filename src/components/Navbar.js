import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/student/home" className="nav-item">
        🏠 <span>Home</span>
      </NavLink>
      <NavLink to="/student/learn" className="nav-item">
        📚 <span>My Learnings</span>
      </NavLink>
      <NavLink to="/student/wishlist" className="nav-item">
        ❤️ <span>Wishlist</span>
      </NavLink>
      <NavLink to="/student/account" className="nav-item">
        👤 <span>My Account</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;
