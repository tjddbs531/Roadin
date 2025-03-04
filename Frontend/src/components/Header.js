import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
    
        <div className="logo">
          <img 
            src={`${process.env.PUBLIC_URL}/img/logo.png`} 
            alt="로고" 
          />
          <span className="logo-text">여행지 소개글</span>
        </div>

        {/*검색창*/}
        <div className="search-bar">
          <input type="text" placeholder="검색" />
        </div>

        {/*네비게이션 메뉴*/}
        <nav className="nav-menu">
          <a href="#">살펴보기</a>
          <a href="#">인기</a>
          <span className="login_btn">로그인</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;
