import React from "react";
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import Home from "./components/pages/landing/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Claim from "./components/pages/claim/Index"
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main className="main_wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/claim" element={<Claim />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;