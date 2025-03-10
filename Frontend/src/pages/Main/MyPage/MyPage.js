import React, {useState} from 'react';
import './MyPage.css';
import profile from '../../../assets/img/profile.svg';
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();
  
  return (
    <div className='mypage_container'>
        <div className='porfile_container'>
            <img src={profile} />

            <div className='information'>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이름</p>
                    <p className='info_content'>가나다</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이메일</p>
                    <p className='info_content'>abc@email.com</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>연락처</p>
                    <p className='info_content'>010-1234-5678</p>
                </div>

                <div className='btn_container'>
                  <button className='delete_btn'>계정탈퇴</button>
                  <button className='edit_btn' onClick={() => navigate("/myPage/edit")}>수정하기</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default MyPage;