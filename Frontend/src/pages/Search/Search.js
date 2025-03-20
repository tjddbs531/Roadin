import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import './Search.css';
import PlaceList from '../../components/PlaceList/PlaceList.js';

function Search() {
  const navigate = useNavigate();

  // params에서 검색어 받아오기 
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // ✅ 검색 결과 유무 상태 관리 -> API 호출 후 데이터가 있다면 true, 없다면 false로 설정해주시면 됩니다.
  const [hasPlaces, setHasPlaces] = useState(false);
  const [hasTags, setHasTags] = useState(false);
  const [Places, setPlaces] = useState([]);
  const [Tags, setTags] = useState([]);

  // ✅ 테스트용 임시 데이터 -> API 호출 후 해당 데이터로 넣어주세요
  const places = [
    {
        "geo_id": 1,
        "place_name": "서울",
        "place_info": "대한민국 수도",
        "korea": 1,
        "count(pl.place_id)": 1,
        "tag_name" : ["수도", "활동적인"]
    },
    {
        "geo_id": 2,
        "place_name": "경기도",
        "place_info": null,
        "korea": 1,
        "count(pl.place_id)": 2,
        "tag_name" : ["힐링"]
    }
  ];
  useEffect(() => {
  const search = async (name) => {
    try{
      const response_place = await axios.get(`http://localhost:3000/search/place/${name}`);
        setPlaces(response_place.data.data);
        setHasPlaces(!hasPlaces);
    } catch (error) {
        try{
            const response_tag = await axios.get(`http://localhost:3000/search/tag/${name}`);
            setTags(response_tag.data.data);
            setHasTags(!hasTags);
        } catch (error){
            console.error("해당하는 검색어가 없습니다.", error);
        }
    }
  };
  search(query);
  },[]);

  return (
    <div className='search_container'>
        <section className='search_content_container'>
            <h1>여행지</h1>
            { hasPlaces && Places.length > 0 ? 
                <PlaceList placesData={Places} /> // ✅ 검색 결과 목록 컴포넌트입니다. 여기에 데이터 변수를 넣어주시면 됩니다. 
                : <p className='no_results'>"<span style={{color : '#5A81FA', fontWeight: 'bold'}}>{query}</span>" 검색어와 일치하는 여행지가 없습니다.</p>
            }
            
        </section>

        <section className='search_content_container'>
            <h1>태그</h1>
            { hasTags ? 
                <PlaceList placesData={Tags} /> // ✅ 검색 결과 목록 컴포넌트입니다. 여기에 데이터 변수를 넣어주시면 됩니다.
                : <p className='no_results'>"<span style={{color : '#5A81FA', fontWeight: 'bold'}}>{query}</span>" 검색어와 일치하는 태그가 없습니다.</p>
            }
        </section>
    </div>
  );
}

export default Search;