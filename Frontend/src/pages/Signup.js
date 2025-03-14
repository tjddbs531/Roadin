import React, { useState } from "react";
import axios from "axios";
import ErrorModal from "../components/ErrorModal";
import "./Signup.css";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      // 백엔드에서는 아래의 필드명을 기대합니다:
      // user_email, user_name, user_pwd, user_phone
      const response = await axios.post(
        "http://localhost:3000/join",
        {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          phone: formData.phone,
        },
        {
          withCredentials: true, // CORS 쿠키 허용
        }
      );

      alert(response.data.message || "회원가입 성공!");
      setFormData({ email: "", name: "", password: "", phone: "" });
    } catch (error) {
      console.log(error)
      if (error.response) {
        setError(error.response.data?.message || "회원가입 실패");
      } else if (error.request) {
        setError("서버 응답이 없습니다. 백엔드가 실행 중인지 확인하세요.");
      } else {
        setError("회원가입 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입을 진행해주세요</h2>

        <div className="input-container">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            className="email-input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            className="name-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="연락처"
            className="phone-input"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="pwd-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="signup-main-button"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <div className="signup-links">
          <Link to="/FindId" className="link-item">
            아이디 찾기
          </Link>{" "}
          |{" "}
          <Link to="/FindPwd" className="link-item">
            비밀번호 찾기
          </Link>{" "}
          |{" "}
          <Link to="/login" className="link-item">
            로그인
          </Link>
        </div>

        {error && <ErrorModal message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
}

export default Signup;
