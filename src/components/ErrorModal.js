import React from "react";
import "./ErrorModal.css"; // 스타일 추가

const ErrorModal = ({ message, onClose }) => {
  if (!message) return null; // 에러 메시지가 없으면 모달을 표시하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
