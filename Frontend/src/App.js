import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main/Main"; // 메인 페이지 추가
import Login from "./pages/Login"; // 로그인 페이지 추가
import MyPage from "./pages/Main/MyPage/MyPage";
import MyPageEdit from "./pages/Main/MyPage/MyPageEdit";

function App() {
  return (
    <Router>
      <Layout>
        <Routes> {/* 모든 페이지에 헤더&푸터 설정 */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/myPage/edit" element={<MyPageEdit />} />
        </Routes>
      </Layout>  
    </Router>
  );
}

export default App;
