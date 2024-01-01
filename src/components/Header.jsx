import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

export default function Header(){
    return (
    <div>
        <nav className="navbar">
          <img className="nav-logo navbar-brand" src="images/IT-Logo.png" alt="Logo" />
          <h1 className="main-title">Innovative Trucking LLC</h1>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </nav>
    </div>
)}