import { useState, useEffect } from 'react';
import CommonLayout from '../../components/CommonLayout';
import { Form, Input, Button, Row } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../reducers/member';

const Login = () => {
  const [ email, setEmail ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const { me, loginLoading, loginError } = useSelector(state => state.member);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

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