import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";  //헤더 추가
import Footer from "./components/Footer";  //푸터 추가
import Login from "./pages/Login"; // 로그인 페이지 추가
import Sginup from './pages/Signup'; //회원가입 페이지 추가
import FindId from "./pages/FindId"; //아이디 찾기 페이지 추가
import FindPwd from "./pages/FindPwd"; //비밀먼호 찾기 페이지 추가
function App() {
  return (
    <Router>
      <Header />  {/*모든 페이지에 헤더 적용 */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Sginup />} />
        <Route path="/FindId" element={<FindId />} />
        <Route path="/FindPwd" element={<FindPwd />} />
      </Routes>
      <Footer />  {/*모든 페이지에 푸터 적용 */}
    </Router>
  );
}

export default App;
