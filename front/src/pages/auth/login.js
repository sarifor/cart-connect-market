import { useState, useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { Form, Input, Button, Row } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../reducers/member';

// Q. useEffect에서, deps 배열에 [loginDone]을 넣어서 loginDone이 false에서 true로 변할 때 메인 페이지로 리다이렉트되는 걸 의도했는데, 왜 로그인 화면 들어오자마자 다시 메인 페이지로 리다이렉트되는 거지?
// A. useEffect가 처음 마운트될 때도 실행되므로, loginDone이 false일 때 실행될 수도 있어. loginDone이 false일 땐 아무 일도 하지 않고, true로 변할 때만 실행되도록 수정하자 (ChatGPT)
// Q. '아직 회원이 아니신가요? 회원 가입' 부분이 로그인 버튼 아래에 오게 하려면?
// A. 로그인 버튼과 해당 텍스트를 같은 컨테이너 안에 넣으면 해결됩니다 (ChatGPT)
const Login = () => {
  const [ email, setEmail ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const { loginLoading, loginDone, loginError } = useSelector(state => state.member);

  const router = useRouter();
  const dispatch = useDispatch();

  // Q. CommonLayout.js에서 메뉴 구성이 바뀌는 기준을 me로 변경했으니, login.js도 그러는 게 좋지 않을까?
  useEffect(() => {
    if (loginDone) {
      router.push("/");
    }
  }, [loginDone]);

  const onSubmitForm = () => {
    dispatch({
      type: loginRequest.type,
      data: { email, password },
    });
  };

  return (
    <CommonLayout title="로그인">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form name="loginform" onFinish={onSubmitForm}>
          <Form.Item 
            // label="email" 
            name="email" 
            rules={[{
              required: true,
              message: 'Please input your email!',
            }]}
          >
            <Input placeholder="이메일" onChange={ (event) => setEmail(event.target.value) } />
          </Form.Item>

          <Form.Item
            // label="password"
            name="password"
            rules={[{
              required: true,
              message: 'Please input your password!',
            }]}
          >
            <Input.Password placeholder="패스워드" onChange={ (event) => setPassword(event.target.value) } />
          </Form.Item>
          
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: "30px" }}>
          아직 회원이 아니신가요? <Link href="/auth/signup" style={{ color: "skyblue" }}>회원 가입</Link>
        </div>
        { loginLoading && (
          <div>로그인 중...</div>
        )}
        { loginError && (
          <div>로그인에 실패하였습니다: {loginError}</div>
        )}
      </div>
    </CommonLayout>
  );
};

export default Login;