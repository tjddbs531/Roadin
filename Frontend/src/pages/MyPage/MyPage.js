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
  const [favoriteTags, setFavoriteTags] = useState([]) // 서버에서 가져온 초기 상태값
  const [activeTag, setActiveTag] = useState([]); // UI 변경을 위한 값

  // 테스트용 토큰
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbmdAbWFpbC5jb20iLCJuYW1lIjoi6rCV66-86rK9IiwiaWF0IjoxNzQxODU0MTg2LCJleHAiOjE3NDE4NTU5ODZ9.i4xW49ib1VMQLiZql0vcGvG_l-y5slunG7NYW-Us9_E';

  // API 호출
  useEffect(() => {    
    // 회원 정보 조회 API
    const fetchUserData = axios.get(`http://localhost:3000/mypage`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 전체 태그 조회 API
    const fetchTags = axios.get(`http://localhost:3000/mypage/favoritetags/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 선호 태그 조회 API
    const fetchFavoriteTags = axios.get(`http://localhost:3000/mypage/favoritetags`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchUserData, fetchTags, fetchFavoriteTags])
      .then(([userDataResponse, tagsResponse, favoriteTagsResponse]) => {
        setUserData(userDataResponse.data);
        setTags(tagsResponse.data.tags);
        setFavoriteTags(favoriteTagsResponse.data.tags ? favoriteTagsResponse.data.tags : []);
        setActiveTag(favoriteTagsResponse.data.tags ? favoriteTagsResponse.data.tags : []);
      })
      .catch((error) => {
        console.log('API 요청 오류 : ', error);
      });
  }, []);

  // 전체 태그 확인하는 함수
  const viewAll = () => { 
    setViewAllTags(!viewAllTags);
  }

  // 선호 태그 등록 및 취소
  const toggleTag = async (tagName) => {
    const isTagSelected = activeTag.includes(tagName);
  
    try {
      if (isTagSelected) {
        await removeTag(tagName);
        setActiveTag((prev) => prev.filter((tag) => tag !== tagName));
      } else {
        await addTag(tagName);
        setActiveTag((prev) => [...prev, tagName]);
      }
    } catch (error) {
      console.error('태그 업데이트 오류:', error);
    }
  };

  const addTag = async (tagName) => {
    await axios.post(
      `http://localhost:3000/mypage/favoritetags`,
      { tag_names: [tagName] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };
  
  const removeTag = async (tagName) => {
    const prevActiveTag = [...activeTag]; // 기존 상태 저장
    const updatedTags = activeTag.filter((tag) => tag !== tagName);
  
    setActiveTag(updatedTags);
  
    try {
      await axios.delete(`http://localhost:3000/mypage/favoritetags`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { tag_names: [tagName] },
      });
    } catch (error) {
      console.error('태그 삭제 오류:', error);
      setActiveTag(prevActiveTag); // 실패 시 원래 상태로 복구
    }
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
                  <button className='edit_btn' onClick={() => navigate("/myPage/edit", { state: { userData } })}>수정하기</button>
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