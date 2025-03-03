import axios from "axios";

const API_BASE_URL = "http://localhost:7777"; // 백엔드 서버 주소 (포트 7777)

/**
 * ✅ 로그인 API 요청
 */
export const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "로그인 요청 실패";
  }
};


/**
 * 회원가입 API 요청
 */
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/join`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "회원가입 요청 실패";
  }
};

/**
 * 아이디 찾기 API 요청
 */
export const findId = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/find-id`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "아이디 찾기 요청 실패";
  }
};

/**
 * ✅ 비밀번호 찾기 API 요청 (이메일 + 아이디 입력)
 */
export const findPassword = async (email, name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/find-password`, { email, name });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "비밀번호 찾기 요청 실패";
  }
};

