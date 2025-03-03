import React, { useState } from "react";
import { findId } from "../api/api"; // API 함수 임포트
import ErrorModal from "../components/ErrorModal"; // 에러 모달 사용
import "./FindId.css";
import { Link } from "react-router-dom"; // ❗ React Router Link 추가 (페이지 이동 가능)

function FindId() {
  const [email, setEmail] = useState("");
  const [foundId, setFoundId] = useState("");
  const [error, setError] = useState("");

  const handleFindId = async () => {
    setError("");
    setFoundId("");

    try {
      const response = await findId(email);
      setFoundId(response.name); // 찾은 아이디 설정
    } catch (error) {
      setError(error); // 에러 설정 (모달로 표시)
    }
  };

  return (
    <div className="findid-container">
      <div className="findid-box">
        <h2 className="findid-title">아이디 찾기</h2>

        <input
          type="email"
          placeholder="가입한 이메일을 입력하세요"
          className="findid-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="findid-button" onClick={handleFindId}>
          아이디 찾기
        </button>

        {foundId && <p className="findid-result">당신의 아이디: {foundId}</p>}

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

export default FindId;
