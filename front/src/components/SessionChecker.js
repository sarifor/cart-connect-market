import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from '@/reducers/member';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'https://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

const SessionChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      const res = await axios.post(`${backURL}/member/me`, {}, { withCredentials: true });

      if (res.status === 200 && res.data) {
        const sessionObj = {
          ...res.data,
          justCheck: "サーバからのセッションオブジェクト！"
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