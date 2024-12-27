// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ETH from "./pages/ETH";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ETH />} />
            </Routes>
        </Router>
    );
};

export default App;