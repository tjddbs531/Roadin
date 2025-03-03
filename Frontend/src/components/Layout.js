import React from "react";
import Header from "./Header";  //헤더 추가
import Footer from "./Footer";  //푸터 추가

function Layout({ children }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, paddingTop: "60px" }}> {/* 헤더 높이만큼 여백 추가 */}
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
export default Layout;