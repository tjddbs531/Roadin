import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PlaceList.css';

function PlaceList({placesData}) {
    const navigate = useNavigate();
    // const [tags, settags] = useState();
    // console.log("get_id",placesData.data.geo_id);

    // useEffect(()=> {
    //     const search_tags = async (place_id) => {
    //         try{
    //             const response = await axios.get(`http://localhost:3000/place_tags/${place_id}`);
    //             settags(response.data.data);
    //             console.log("api 성공", response.data);
    //         } catch (error) {
    //             console.error("태그 검색 실패", error);
    //         }
    //     };
    //     search_tags(placesData.ged_id);
    // }, []);

  
  return (
    <div>
    { placesData.map((place, index) => (
        <div className="list_container" onClick={() => navigate(`/place/${place.place_name}`)}>
            <div className="place_img_box"></div>
            <div className="list_text_container">
                <div className="list_content_container">
                    <p className="list_title">{place.place_name}</p>
                    <p className="list_intro">{place.place_info}</p>
                </div>
                
                {/* <div className='list_tags_container'>
                    <div className='list_tag_default'>#</div>
                    {  tags ? (
                    tags.map((tag, tagIndex) => (
                        <div className="list_tags" key={tagIndex}>{tag}</div>
                        )))
                        :
                        (<p>태그 없음</p>)
                    }
                </div> */}
            </div>
        </div>
    ))}
    </div>
  )
}

export default PlaceList;
