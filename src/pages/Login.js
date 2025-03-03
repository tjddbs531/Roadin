import React, { useState } from "react";
import { login } from "../api/api"; // ✅ 로그인 API 요청 함수 추가
import ErrorModal from "../components/ErrorModal"; // ✅ 에러 모달 사용
import "./Login.css";
import { Link, useNavigate } from "react-router-dom"; // ✅ 페이지 이동 가능하도록 추가

function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ 로그인 성공 시 페이지 이동

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 로그인 요청 함수
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await login(formData); // ✅ 로그인 API 호출
      alert(response.message || "로그인 성공!");
      navigate("/"); // ✅ 로그인 후 메인 페이지로 이동 (필요에 따라 변경 가능)
    } catch (error) {
      setError(error); // 에러 메시지 저장
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인하여 여행을 계획하세요</h2>

        <div className="input-container">
          {/* 아이디 또는 이메일 입력 */}
          <input
            type="text"
            name="emailOrUsername"
            placeholder="아이디 또는 이메일"
            className="login-input"
            value={formData.emailOrUsername}
            onChange={handleChange}
          />

          {/* 비밀번호 입력 */}
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* 로그인 버튼 */}
        <button className="login-main-button" onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {/* 아이디 찾기 | 비밀번호 찾기 | 회원가입 링크 */}
        <div className="signup-links">
          <Link to="/FindId" className="link-item">아이디 찾기</Link> |  
          <Link to="/FindPwd" className="link-item">비밀번호 찾기</Link> |  
          <Link to="/Signup" className="link-item">회원가입</Link>
        </div>

        {/* 에러 모달 */}
        <ErrorModal message={error} onClose={() => setError("")} />
      </div>
    </div>
  );
}

export default Login;
