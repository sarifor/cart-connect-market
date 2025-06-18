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
    <CommonLayout title="ログイン">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form name="loginform" onFinish={onSubmitForm}>
          <Form.Item 
            // label="email" 
            name="email" 
            rules={[{
              required: true,
              message: 'メールアドレスを入力してください。',
            }]}
          >
            <Input placeholder="メールアドレス" onChange={ (event) => setEmail(event.target.value) } />
          </Form.Item>

          <Form.Item
            // label="password"
            name="password"
            rules={[{
              required: true,
              message: 'パスワードを入力してください。',
            }]}
          >
            <Input.Password placeholder="パスワード" onChange={ (event) => setPassword(event.target.value) } />
          </Form.Item>
          
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              ログイン
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: "30px" }}>
          まだ会員登録がお済みでない方は、<Link href="/auth/signup" style={{ color: "skyblue" }}>こちらから登録してください。</Link>
        </div>
        { loginLoading && (
          <div>ログイン処理中...</div>
        )}
        { loginError && (
          <div>ログインに失敗しました。</div>
        )}
      </div>
    </CommonLayout>
  );
};

export default Login;