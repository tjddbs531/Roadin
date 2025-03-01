import React from "react";
import "./Login.css";

function Login() {
  return (
    
    <div className="login-container"> {/* 로그인 컨테이너 박스 */}
      
      {/* 로그인 박스 */}
      <div className="login-box">
        <h2 className="login-title">로그인하여 여행을 계획하세요</h2>

        {/*아이디 & 비밀번호 입력 필드 추가 */}
        <input type="text" placeholder="아이디 또는 이메일" className="login-input" />
        <input type="password" placeholder="비밀번호" className="login-input" />

        {/* 로그인 버튼 */}
        <button className="login-main-button">로그인</button>


        {/*아이디 찾기, 비밀번호 찾기, 회원가입 */}
        <div className="login-links">
          <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> | <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
