import React from "react";
import "./Header.css";
import logo from '../assets/img/logo.svg';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
    
        <div className="logo">
          <img 
            src={logo} 
            alt="로고" 
          />
        </div>

        {/*검색창*/}
        <div className="search-bar">
          <input type="text" placeholder="검색" />
        </div>

        {/*네비게이션 메뉴*/}
        <nav className="nav-menu">
          <a href="#">살펴보기</a>
          <a href="#">인기</a>
          <a className="login_btn" href='/myPage'>로그인</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
