import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/reducers/user';

// Q. /user/me의 Request Headers에 Cookie: connect.sid=... 항목이 없어
// A. axios.post('/user/me', {}, { withCredentials: true })처럼 config 객체에 따로 설정해야 쿠키가 포함돼! (ChatGPT)
const SessionChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      const res = await axios.post('http://localhost:4000/user/me', {}, { withCredentials: true });

      if (res.status === 200 && res.data) {
        console.log("세션 확인 성공:", res.data);

        const sessionObj = {
          id: res.data.id,
          name: res.data.name,
          address: res.data.address,
          justCheck: "서버에서 가져온 세션 객체!"
        };

        dispatch(loginSuccess(sessionObj));
      }
    }
    checkSession();
  }, [dispatch]);

  return null;
};

export default SessionChecker;