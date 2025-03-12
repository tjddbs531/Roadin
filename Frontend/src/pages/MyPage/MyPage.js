import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './MyPage.css';
import profile from '../../assets/img/profile.svg';
import x from '../../assets/img/x.svg';
import plus from '../../assets/img/plus.svg';
import like_active from '../../assets/img/ic_like_active.svg';

function MyPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [tags, setTags] = useState([]);
  const [viewAllTags, setViewAllTags] = useState(false);
  const [activeTag, setActiveTag] = useState([]);

  // 회원 정보 조회 API 호출
  useEffect(() => {    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbmdAbWFpbC5jb20iLCJuYW1lIjoi6rCV66-86rK9IiwiaWF0IjoxNzQxNzcwNDI1LCJleHAiOjE3NDE3NzIyMjV9.7Qqp3Q2B2_0M3uzILMCWNhH9JeWKrgVhZjOzk_OctOY';

    const fetchUserData = axios.get(`http://localhost:3000/mypage`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchTags = axios.get(`http://localhost:3000/mypage/favoritetags/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchUserData, fetchTags])
      .then(([userDataResponse, tagsResponse]) => {
        setUserData(userDataResponse.data);
        setTags(tagsResponse.data.tags);
        console.log(tags);
      })
      .catch((error) => {
        console.log('API 요청 오류 : ', error);
      });
  }, []);

  // 전체 태그 확인하는 함수
  const viewAll = () => { 
    setViewAllTags(!viewAllTags);
  }

  // 태그 클릭 시 active 클래스를 토글하는 함수
  const toggleTag = (tag) => {
    setActiveTag((prevActiveTag) => {
      if (prevActiveTag.includes(tag)) {
        // 이미 활성화된 태그라면 비활성화
        return prevActiveTag.filter((t) => t !== tag);
      } else {
        // 비활성화된 태그라면 활성화
        return [...prevActiveTag, tag];
      }
    });
  }

  const removeTag = (tag) => {
    setActiveTag((prevActiveTag) => prevActiveTag.filter((t) => t !== tag));
  };
  
  return (
    <div className='mypage_container'>
        <div className='porfile_container'>
            <img src={profile} alt='profile'/>

            <div className='information'>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이름</p>
                    <p className='info_content'>{userData.user_name}</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>이메일</p>
                    <p className='info_content'>{userData.user_email}</p>
                </div>
                <div className='info_txt_contianer'>
                    <p className='info_title'>연락처</p>
                    <p className='info_content'>{userData.user_phone}</p>
                </div>

                <div className='btn_container'>
                  <button className='delete_btn'>계정탈퇴</button>
                  <button className='edit_btn' onClick={() => navigate("/myPage/edit")}>수정하기</button>
                </div>
            </div>

            <div className='likes_container'>
              <p className='like_title'>선호 해시태그</p>
              
              <div className='tags_container'>
                <div className='tag' style={{color: 'black'}}>#</div>
                {activeTag.map((tag, index) => (
                   <div key={index} className='tag'>
                   {tag}
                   <img
                     src={x} // X 아이콘
                     alt='remove'
                     onClick={() => removeTag(tag)} // 클릭 시 해당 태그 비활성화
                     style={{ cursor: 'pointer', marginLeft: '8px' }}
                   />
                 </div>
                ))}
                <div className='tag' style={{color: 'black', cursor: 'pointer'}} onClick={() => viewAll()}>
                  <img src={plus} width={14} alt='plus'/>
                </div>
              </div>

              {viewAllTags && (
                  <div className='all_tags_container'>
                    {tags.map((tag, index) => (
                      <div 
                        key={index}
                        className={`tags ${activeTag.includes(tag.tag_name) ? 'active' : ''}`} 
                        onClick={() => toggleTag(tag.tag_name)}
                      >
                        {tag.tag_name}
                      </div>
                    ))}
                  </div>
              )}
            </div>

            <div className='likes_container' style={{marginBottom: 80}}>
              <p className='like_title'>좋아요</p>
              <div className='like_places_container'>
                <div className="places">
                  <img src={like_active} alt='like'/>
                </div>
                <div className="places">
                  <img src={like_active} alt='like'/>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}

export default MyPage;