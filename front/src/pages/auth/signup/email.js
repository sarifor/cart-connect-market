import React, { useState, useEffect } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import {
  Button,
  Checkbox,
  Form,
  Input,
} from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequest } from '../../../reducers/member';

// Q. 입력 폼의 가로 길이를 더 늘리고 화면 왼쪽에 붙게 하려면?
// A. Form에 maxWidth와 width를 지정하고 margin: '0'으로 설정 (ChatGPT)
// Q. <Form.Item>의 rules의 로직은 어디에 있는 거야?
// A. antd에서 Form.Item의 rules는 내부적으로 rc-field-form이라는 라이브러리를 통해 검증 로직이 실행돼요 (ChatGPT)
const EmailSignup = () => {
  const [ email, setEmail ] = useState(null);
  const [ familyname, setFamilyname ] = useState(null);
  const [ firstname, setFirstname ] = useState(null);
  const [ nickname, setNickname ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ receiver, setReceiver ] = useState(null);
  const [ postalnumber, setPostalnumber ] = useState(null);
  const [ address, setAddress ] = useState(null);
  const { signupLoading, signupError, me } = useSelector(state => state.member);

  const router = useRouter();
  const dispatch = useDispatch();

  // Q. router.replace vs push ?
  // A. Router.push()는 페이지 이동을 히스토리에 남기고, replace()는 현재 기록을 덮어씁니다. 로그인/회원가입 리디렉션처럼 뒤로가기가 필요 없는 경우엔 replace()가 더 적절합니다 (ChatGPT)
  useEffect(() => {
    if (me) {
      router.replace("/");
    }
  }, [me]);  

  /*
    Q. antd 폼 자체 기능으로 비밀번호 일치 여부를 검증하는 원리?
    
    A. Form.Item에서 rules 속성에 함수형 validator를 정의하고, 그 안에서 전달되는 getFieldValue()로 원본 비밀번호 값을 가져와 현재 값과 비교합니다.
    두 값이 일치하면 Promise.resolve()로 검증을 통과시키고, 
    일치하지 않으면 Promise.reject(new Error(...))로 에러를 반환합니다. 
    이때 validator 함수는 (rule, value) 형식이며, 
    반환 타입은 반드시 Promise여야 하고, 
    rule을 사용하지 않을 경우 관례적으로 _로 표기합니다. (ChatGPT)

    Q. Form.Item에서 체크박스의 체크 여부를 validator에 넘기려면?
    
    A. 기본적으로 Form.Item은 value prop에 바인딩되지만, Checkbox나 Switch는 값을 checked로 관리합니다. 
    따라서 valuePropName="checked"를 지정해 해당 컴포넌트가 checked를 통해 값을 전달하도록 설정해야 validator에 true/false 값이 정확히 전달됩니다. (ChatGPT)
  */
  const onSubmitForm = () => {
    dispatch({
      type: signupRequest.type,
      data: { email, familyname, firstname, nickname, password, receiver, postalnumber, address },
    });
  };

  return (
    <CommonLayout title="이메일로 회원 가입">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form
          // {...formItemLayout} 
          layout="vertical"
          style={{ 
            maxWidth: 600, 
            margin: '0', 
            width: '100%'
          }}
          onFinish={onSubmitForm}
        >
          <Form.Item 
            name="email" 
            label="メールアドレス"
            rules={[
              {
                type: 'email',
                message: '유효한 이메일 형식이 아닙니다. 다시 입력해 주세요.'
              },
              {
                required: true,
                message: '이메일을 입력해 주세요.'
              },
            ]}>
            <Input onChange={ (event) => setEmail(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="familyname" 
            label="姓"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}          
          >
            <Input onChange={ (event) => setFamilyname(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="firstname" 
            label="名"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}
          >
            <Input onChange={ (event) => setFirstname(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="nickname" 
            label="ニックネーム"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}
          >
            <Input onChange={ (event) => setNickname(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="パスワード"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해 주세요.'
              },
            ]}
          >
            <Input.Password onChange={ (event) => setPassword(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="confirm-password" 
            label="パスワード確認"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div>---- 배송지 정보 ----</div>
  
          <Form.Item 
            name="receiver" 
            label="받는 사람"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}
          >
            <Input onChange={ (event) => setReceiver(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="postalnumber" 
            label="우편번호"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}
          >
            <Input onChange={ (event) => setPostalnumber(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="address" 
            label="주소"
            rules={[
              {
                required: true,
                message: '입력 필수입니다.'
              },
            ]}
          >
            <Input onChange={ (event) => setAddress(event.target.value) } />
          </Form.Item>

          <Form.Item 
            name="agreement" 
            valuePropName="checked"
            rules={[
              {
                validator(_, value) {
                  if (value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('회원 가입 하시려면 동의는 필수입니다.'));
                },
              },
            ]} 
          >
            <Checkbox>
              상품 구매 및 배송을 위한 필수 정보 제공에 동의합니다.
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sign up
            </Button>
          </Form.Item>
        </Form>
        { signupLoading && (
          <div>회원 가입 중...</div>
        )}
        { signupError && (
          <div>회원 가입에 실패하였습니다: {signupError}</div>
        )}        
      </div>
    </CommonLayout>
  );
};

export default EmailSignup;