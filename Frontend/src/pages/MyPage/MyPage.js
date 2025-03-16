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
  const [showModal, setShowModal] = useState(false); // 탈퇴 확인 모달
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  // 테스트용 토큰
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbmdAbWFpbC5jb20iLCJuYW1lIjoi7IiY7KCVIiwiaWF0IjoxNzQyMTE5NDYzLCJleHAiOjE3NDIxMjEyNjN9.hoYUw5VbT2y3nS5y2UPXC9pL6nej3q1IMQAAFLRIY28';

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

    // 좋아요 장소 조회 API
    const fetchFavoritePlaces = axios.get(`http://localhost:3000/mypage/favoriteplaces`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchUserData, fetchTags, fetchFavoriteTags, fetchFavoritePlaces])
      .then(([userDataResponse, tagsResponse, favoriteTagsResponse, favoritePlacesResponse]) => {
        setUserData(userDataResponse.data);
        setTags(tagsResponse.data.tags);
        setFavoriteTags(favoriteTagsResponse.data.tags ? favoriteTagsResponse.data.tags : []);
        setActiveTag(favoriteTagsResponse.data.tags ? favoriteTagsResponse.data.tags : []);
        setFavoritePlaces(favoritePlacesResponse.data);
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

  // 계정 탈퇴 API
  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3000/mypage', {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (error) {
      console.log('계정 탈퇴 오류 : ', error);
    }
  }

   const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // 여행지 좋아요 취소 API
  const deleteLikesPlace = async (place_id) => {
    try {
      await axios.delete(`http://localhost:3000/placeLikes/${place_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {user_id : 1} // 🚨 수정 필요 
      });
  
      setFavoritePlaces((prevPlaces) => prevPlaces.filter((place) => place.geo_id !== place_id));
    } catch (error) {
      console.log('좋아요 삭제 오류:', error);
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
                  <button className='delete_btn' onClick={openModal}>계정탈퇴</button>
                  {showModal && (
                    <div className="delete_modal">
                      <div className="delete_modal_content">
                        <p>정말로 계정을 탈퇴하시겠습니까?</p>
                        <div className="delete_modal_buttons">
                          <button onClick={closeModal} className="delete_cancel_btn">
                            취소
                          </button>
                          <button onClick={handleDeleteAccount} className="delete_confirm_btn">
                            확인
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

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
                {favoritePlaces.map((place, index) => (
                  <div key={index} className='myPlaces'>
                    <img src={like_active} alt='like' style={{cursor: 'pointer'}} onClick={() => deleteLikesPlace(place.geo_id)}/>
                    <div
                      className="myPlace_name"
                      style={{
                        position: 'absolute',
                        left: '21px',
                        bottom: '15px',
                        fontFamily: 'PretendardBold',
                        fontSize: '24px',
                        color: 'white',
                      }}
                    >
                      {place.place_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    </div>
  );
}

export default MyPage;