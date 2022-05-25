import axios from 'axios';
import { setGlobalMessage } from '../redux/slices/global';
import { dispatch } from '../redux/store';

const domain = 'http://1.14.48.224:8088';
const baseUrl = `${domain}/go/`;

const request = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  method: 'post',
});

request.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

request.interceptors.request.use(
  (config) => {
    // const userInfo = window.localStorage.getItem('USER_INFO');
    // let token = 'Bearer 048029d7-5a20-4e4e-89d2-7122a8a5dd9a';
  // if (userInfo) {
    //   token = JSON.parse(userInfo).token;
    // }
    // console.log(config)
    if (/authenticators\/oauth\/token/.test(config.url)) {
      config.baseURL = domain;
      config.headers.Authorization = 'Basic Z28tcHJvOjEyMzQ1Njc4OQ==';
    } else {
      const accessToken = window.localStorage.getItem('accessToken') || window.sessionStorage.getItem('accessToken');
    
      if (accessToken) {
        config.headers.Authorization = accessToken;
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const errorHandle = (error) => {
  if (error.response) {
    const { data = {}, status, config, statusText } = error.response;
    if (!config.silent) {
      // Boolean(config.silent)为false, 就在这统一处理报错
      dispatch(setGlobalMessage({
        variant: 'error',
        // i18nKey: data.message ? '' : 'statusCode',
        msg: data.message || statusText,
      }));
    }

    if ([401].includes(status) && !/authenticators\/oauth\/token/.test(config.url)) {
      // 未登录
      window.localStorage.removeItem('accessToken');
      window.sessionStorage.removeItem('accessToken');
      window.location.reload();
    } 
    return Promise.reject(data);
  }
  dispatch(setGlobalMessage({
    variant: 'error',
    i18nKey: 'networkError',
  }));
  return Promise.reject(error);
};
request.interceptors.response.use((response) => {
  const isFile = response.config.data
    ? response.config.data.type === 'file'
    : false;
  if (isFile) return response;
  // 登录接口返回的结构不一样
  if (!response.data || (!response.data.result && !response.data.access_token)) return errorHandle({ response });
  return response.data;
}, errorHandle);

export default request;
