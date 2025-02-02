import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import "./index.css";
import App from "./App.tsx";
import JokesPage from "./jokes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes> 
        <Route path="/" element={<App />} /> {/* Define the App component as the default route */}
        <Route path="/jokes" element={<JokesPage />} /> {/* Define the JokesPage route */} 
      </Routes>

      <footer>
        <p>تم التطوير من قبل</p>
        <a href="https://github.com/rimagh19"><u>@rima-gh</u></a>
      </footer>
    </Router>
  </StrictMode>
);