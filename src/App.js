import React from "react";
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import Home from "./components/pages/landing/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
          <main className="main_wrap">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
          </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;