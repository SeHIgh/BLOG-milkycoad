import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = `API 호출 실패: ${status}`;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);
