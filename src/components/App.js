// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login.jsx';
import Home from './Home.jsx';
import AddUser from './AddUser.jsx';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CleanTruck from './CleanTruck.jsx';


const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/cleantruck" element={<CleanTruck />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
