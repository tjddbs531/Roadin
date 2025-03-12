import React, {useState} from 'react';
import './Main.css';
import toggle_abroad from '../../assets/img/toggle_abroad.svg';
import toggle_domestic from '../../assets/img/toggle_domestic.svg';
import ImgSlide from '../../components/ImgSlide/ImgSlide';
import like_active from '../../assets/img/ic_like_active.svg';
import like_unactive from '../../assets/img/ic_like_unactive.svg';

function Main() {
  const [isDomestic, setIsDomestic] = useState(true);

  const toggleLocation = () => {
    setIsDomestic(!isDomestic);
  };

  const toggle_location = isDomestic ? toggle_domestic : toggle_abroad;

  return (
    <div className='main_container'>
        <section className='select'>
            <h1>어디로 가시나요?</h1>
            <img src={toggle_location} alt='toggle_location' onClick={toggleLocation}/>
        </section>

        <section className='areas'>
          <h3>{isDomestic ? '국내 여행지' : '해외 여행지'}</h3>
          <p>어디로 가시나요?</p>
          <ImgSlide boxWidth={268} boxHeight={240} gap={20} totalBoxes={7}/>
        </section>

        <section className='popular_area'>
          <div className='popular_container'>
            <h3>인기 장소 Top 3</h3>
            <div className='img_container'>
              <div className="popular_box">
                <img src={like_active}/>
              </div>
              <div className="popular_box">
                <img src={like_unactive}/>
              </div>
              <div className="popular_box">
                <img src={like_unactive}/>
              </div>
            </div>
          </div>
        </section>

        <section className='popular_hashtags'>
          <h3>인기 해시태그</h3>
          <p>어떤 테마를 원하시나요?</p>
          <div className='popular_hashtags_container'>
            <div className='popular_hashtag'>#</div>
            <div className='popular_hashtag'>활동적인</div>
            <div className='popular_hashtag'>휴식</div>
            <div className='popular_hashtag'>부모님과 함께</div>
            <div className='popular_hashtag'>활동적인</div>
            <div className='popular_hashtag'>휴식</div>
            <div className='popular_hashtag'>부모님과 함께</div>
            <div className='popular_hashtag'>활동적인</div>
            <div className='popular_hashtag'>휴식</div>
            <div className='popular_hashtag'>부모님과 함께</div>
            <div className='popular_hashtag'>활동적인</div>
          </div>
        </section>
    </div>
  );
}

export default Main;