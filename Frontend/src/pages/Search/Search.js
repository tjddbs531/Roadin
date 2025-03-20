import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import './Search.css';
import PlaceList from '../../components/PlaceList/PlaceList.js';

function Search() {
  const navigate = useNavigate();

  // 검색어 받아오기
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // 검색 결과 상태
  const [hasPlaces, setHasPlaces] = useState(false);
  const [hasTags, setHasTags] = useState(false);
  const [Places, setPlaces] = useState([]);
  const [Tags, setTags] = useState([]);

  // 검색 결과를 즉시 반영하도록 수정
  useEffect(() => {
    const search = async (name) => {
      try {
        // 여행지 검색 API 호출
        const response_place = await axios.get(`http://localhost:3000/search/place/${name}`);
        const placesData = response_place.data.data || [];
        setPlaces(placesData);
        setHasPlaces(placesData.length > 0);
      } catch (error) {
        console.error("여행지 검색 실패", error);
        setPlaces([]); // 검색 실패 시 초기화
        setHasPlaces(false);
      }

      try {
        // 태그 검색 API 호출
        const response_tag = await axios.get(`http://localhost:3000/search/tag/${name}`);
        const tagsData = response_tag.data.data || [];
        setTags(tagsData);
        setHasTags(tagsData.length > 0); 
      } catch (error) {
        console.error("태그 검색 실패", error);
        setTags([]); // 검색 실패 시 초기화
        setHasTags(false);
      }
    };

    if (query) {
      search(query);
    }
  }, [query]); 

  return (
    <div className='search_container'>
      <section className='search_content_container'>
        <h1>여행지</h1>
        {hasPlaces && Places.length > 0 ? (
          <PlaceList placesData={Places} /> 
        ) : (
          <p className='no_results'>
            "<span style={{ color: '#5A81FA', fontWeight: 'bold' }}>{query}</span>" 검색어와 일치하는 여행지가 없습니다.
          </p>
        )}
      </section>

      <section className='search_content_container'>
        <h1>태그</h1>
        {hasTags && Tags.length > 0 ? (
          <PlaceList placesData={Tags} /> 
        ) : (
          <p className='no_results'>
            "<span style={{ color: '#5A81FA', fontWeight: 'bold' }}>{query}</span>" 검색어와 일치하는 태그가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}

export default Search;