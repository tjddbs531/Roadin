import React, { useState } from "react";
import { findPassword } from "../api/api"; // API 함수 임포트
import ErrorModal from "../components/ErrorModal"; // 에러 모달 사용
import "./FindPwd.css";
import { Link } from "react-router-dom"; // ❗ React Router Link 추가 (페이지 이동 가능)

function FindPwd() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // 아이디 입력 추가
  const [foundPassword, setFoundPassword] = useState("");
  const [error, setError] = useState("");

  const handleFindPassword = async () => {
    setError("");
    setFoundPassword("");

    try {
      const response = await findPassword(email, name);
      setFoundPassword(response.password); // 찾은 비밀번호 설정
    } catch (error) {
      setError(error); // 에러 설정 (모달로 표시)
    }
  };

  return (
    <div className="findpwd-container">
      <div className="findpwd-box">
        <h2 className="findpwd-title">비밀번호 찾기</h2>

        {/* 이메일 입력 필드 */}
        <input
          type="email"
          placeholder="가입한 이메일을 입력하세요"
          className="findpwd-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 아이디 입력 필드 (추가) */}
        <input
          type="text"
          placeholder="가입한 아이디를 입력하세요"
          className="findpwd-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="findpwd-button" onClick={handleFindPassword}>
          비밀번호 찾기
        </button>

        {foundPassword && <p className="findpwd-result">당신의 비밀번호: {foundPassword}</p>}

        <div className="signup-links">
          <Link to="/FindId" className="link-item">아이디 찾기</Link> |  
          <Link to="/FindPwd" className="link-item">비밀번호 찾기</Link> |  
          <Link to="/Signup" className="link-item">회원가입</Link>
        </div>

        <ErrorModal message={error} onClose={() => setError("")} />
      </div>
    </div>
  );
}

export default FindPwd;
