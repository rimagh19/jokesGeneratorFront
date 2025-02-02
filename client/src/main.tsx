import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { StrictMode } from 'react';
import App from './App';
import Jokes from './jokes';
import Add from './Add';
import './style/index.css'; 
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router>
            <nav className="navbar">  {/* Navbar */}
                <div className="navbar-content"> {/* Content wrapper for better alignment */}
                    <img src="../public/logo.png" id="logo"></img>
                    <Link to="/" className="navbar-brand">نـــكـتـــة</Link> {/* App Name/Logo */}
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/jokes" element={<Jokes />} />
                <Route path="/add" element={<Add />} />
            </Routes>
            <footer>
                <p>تم التطوير من قبل</p>
                <a href="https://github.com/rimagh19"><u>@rima-gh</u></a>
            </footer>
        </Router>
    </StrictMode>
);