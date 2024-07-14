// useApi.ts
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { selectAuth, refreshTokenThunk } from '@/app/lib/features/auth/authSlice';

const useApi = (baseURL: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, refreshToken } = useSelector(selectAuth);

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (refreshToken) {
        dispatch(refreshTokenThunk({ refreshToken }));
      }
    };

    const interceptors = axios.interceptors.request.use(
      async (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await refreshAccessToken();
          const { accessToken: newAccessToken } = useSelector(selectAuth); // Re-select auth to get the updated access token
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptors);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, baseURL, dispatch]);

  const api = axios.create({
    baseURL,
  });

  return api;
};

export default useApi;
