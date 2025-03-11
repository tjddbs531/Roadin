import React, { useState } from "react";
import { signup } from "../api/api"; // API 함수 임포트
import ErrorModal from "../components/ErrorModal"; // ❗ 모달 컴포넌트 추가
import "./Signup.css";
import { Link } from "react-router-dom"; // ❗ React Router Link 추가 (페이지 이동 가능)

function Signup() {
  // 회원가입 폼 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    contact: "",
  });

  // 로딩 상태 및 에러 메시지 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 회원가입 요청 함수
  const handleSignup = async () => {
    setLoading(true);
    setError(""); // 에러 메시지 초기화

    try {
      const response = await signup(formData);
      alert(response.message || "회원가입 성공!");
      setFormData({ email: "", name: "", password: "", contact: "" }); // 입력 필드 초기화
    } catch (error) {
      setError(error); // ❗ 모달을 띄울 수 있도록 에러 메시지 저장
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입을 진행해주세요</h2>

        <div className="input-container">
          <input type="email" name="email" placeholder="이메일" className="email-input" value={formData.email} onChange={handleChange} />
          <input type="text" name="name" placeholder="이름" className="name-input" value={formData.name} onChange={handleChange} />
          <input type="text" name="contact" placeholder="연락처" className="phone-input" value={formData.contact} onChange={handleChange} />
          <input type="password" name="password" placeholder="비밀번호" className="pwd-input" value={formData.password} onChange={handleChange} />
        </div>

        {/* 회원가입 버튼 */}
        <button className="signup-main-button" onClick={handleSignup} disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>

        {/* 🔹 추가된 아이디 찾기 | 비밀번호 찾기 | 로그인 링크 */}
        <div className="signup-links">
          <Link to="/FindId" className="link-item">아이디 찾기</Link> |  
          <Link to="/FindPwd" className="link-item">비밀번호 찾기</Link> |  
          <Link to="/login" className="link-item">로그인</Link>
        </div>

        {/* ❗ 에러 모달 추가 */}
        <ErrorModal message={error} onClose={() => setError("")} />
      </div>
    </div>
  );
}

export default Signup;
