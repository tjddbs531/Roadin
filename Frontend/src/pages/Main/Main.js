import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Main.css';
import toggle_abroad from '../../assets/img/toggle_abroad.svg';
import toggle_domestic from '../../assets/img/toggle_domestic.svg';
import ImgSlide from '../../components/ImgSlide/ImgSlide';
import like_active from '../../assets/img/ic_like_active.svg';
import like_unactive from '../../assets/img/ic_like_unactive.svg';

function Main() {
  const navigate = useNavigate();
  
  const [isDomestic, setIsDomestic] = useState(true);
  const [allPlaces, setAllPlaces] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  const toggleLocation = () => {
    setIsDomestic(!isDomestic);
  };

  const toggle_location = isDomestic ? toggle_domestic : toggle_abroad;

  // API 호출
  useEffect(() => {    
    // 전체 장소 조회 API
    const fetchAllPlaces = axios.get(`http://localhost:3000/mainplace/korea`);

    // 인기 장소 조회 API
    const fetchPopularPlaces = axios.get(`http://localhost:3000/popular/place`);

    // 인기 태그 조회 API
    const fetchPopularTags = axios.get(`http://localhost:3000/popular/tag`);

    Promise.all([fetchAllPlaces, fetchPopularPlaces, fetchPopularTags])
      .then(([allPlacesResponse, popularPlacesResponse, popularTagsResponse]) => {
        setAllPlaces(allPlacesResponse.data.data);
        setPopularPlaces(popularPlacesResponse.data.data);
        setPopularTags(popularTagsResponse.data.data);
      })
      .catch((error) => {
        console.log('API 요청 오류 : ', error);
      });
  }, []);

  return (
    <div className='main_container'>
        <section className='select'>
            <h1>어디로 가시나요?</h1>
            <img src={toggle_location} alt='toggle_location' onClick={toggleLocation}/>
        </section>

        <section className='areas'>
          <h3>{isDomestic ? '국내 여행지' : '해외 여행지'}</h3>
          <p>어디로 가시나요?</p>
          <ImgSlide boxWidth={268} boxHeight={240} gap={20} placesData={allPlaces}/>
        </section>

        <section className='popular_area'>
          <div className='popular_container'>
            <h3>인기 장소 Top 3</h3>
            <div className='img_container'>
              {popularPlaces.map((place, index) => (
                <div key={index} className='popular_box'>
                  <img src={like_active} alt='like'/>
                  <div
                      className="place-name"
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
        </section>

        <section className='popular_hashtags'>
          <h3>인기 해시태그</h3>
          <p>어떤 테마를 원하시나요?</p>
          <div className='popular_hashtags_container'>
            <div className='popular_hashtag_default'>#</div>
            {popularTags.map((tag, index) => (
              <div className='popular_hashtag'>{tag.tag_name}</div>
            ))}
          </div>
        </section>
    </div>
  );
}

export default Main;