import React, {useState} from 'react';
import './Main.css';
import toggle_abroad from '../../assets/img/toggle_abroad.svg';
import toggle_domestic from '../../assets/img/toggle_domestic.svg';

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

    </div>
  );
}

export default Main;