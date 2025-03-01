import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";  //헤더 추가
import Footer from "./components/Footer";  //푸터 추가
import Login from "./pages/Login"; // 로그인 페이지 추가

function App() {
  return (
    <Router>
      <Header />  {/*모든 페이지에 헤더 적용 */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />  {/*모든 페이지에 푸터 적용 */}
    </Router>
  );
}

export default App;
