import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const userData = await login(email, password);

    if (userData) {
      alert(`${userData.user_name}님 환영합니다.`);

      // ✅ 로그인 성공 후 localhost:3001로 이동
      navigate('/');
    } else {
      setError("로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-main-button">
            로그인
          </button>
        </form>
        <div className="login-links">
          <a href="/find-id">아이디 찾기</a> | <a href="/find-password">비밀번호 찾기</a> | <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;