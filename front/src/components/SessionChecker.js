import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from '@/reducers/member';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

// Q. /member/me의 Request Headers에 Cookie: connect.sid=... 항목이 없어
// A. axios.post('/member/me', {}, { withCredentials: true })처럼 config 객체에 따로 설정해야 쿠키가 포함돼! (ChatGPT)
const SessionChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      const res = await axios.post(`${backURL}/member/me`, {}, { withCredentials: true });

      if (res.status === 200 && res.data) {
        const sessionObj = {
          id: res.data.id,
          name: res.data.name,
          address: res.data.address,
          justCheck: "서버에서 가져온 세션 객체!"
        };

        dispatch(loginSuccess(sessionObj));
      } else {
        dispatch(logoutSuccess());
      }
    };
    checkSession();
  }, [dispatch]);

  return null;
};

export default SessionChecker;