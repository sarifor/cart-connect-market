import React, { useEffect } from 'react';
import CommonLayout from '../../../components/CommonLayout';
import {
  Descriptions,
  Button,
} from 'antd';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// Q. 왜 ShippingAddresses 이렇게 복수가 되어 있지?
// Q. Cannot read properties of null (reading 'member_id')를 막으려면?
// A. me && 혹은 me? 쓰기 (ChatGPT)
const Profile = () => {
  const router = useRouter();
  const { me } = useSelector(state => state.member);

  let basicInfo;
  let shippingAddressInfo;

  if (Number(me && me.member_id) === Number(router.query.id)) {
    basicInfo = [
      {
        key: '1',
        label: '성',
        children: me.family_name,
      },
      {
        key: '2',
        label: '이름',
        children: me.first_name,
      },
      {
        key: '3',
        label: '닉네임',
        children: me.nickname,
      },
      {
        key: '4',
        label: '이메일',
        children: me.email,
      },
      {
        key: '5',
        label: '가입일시',
        children: me.created_at,
      },
    ];

    shippingAddressInfo = [
      {
        key: '1',
        label: '받는 사람',
        children: me.ShippingAddresses[0]?.receiver || "미입력",
      },
      {
        key: '2',
        label: '우편번호',
        children: me.ShippingAddresses[0]?.postcode || "미입력",
      },
      {
        key: '3',
        label: '주소',
        children: me.ShippingAddresses[0]?.address || "미입력",
      },
    ];  
  }

  useEffect(() => {
    if (!me || Number(me.member_id) !== Number(router.query.id)) {
      router.replace("/");
    }
  }, [me]);
  
  const onHandleGoBack = () => {
    router.back();
  };

  return (
    <CommonLayout title="회원 정보">
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          maxWidth: 600, 
          margin: '0', 
          width: '100%'
        }}
      >
        <Descriptions title="기본 정보" items={basicInfo} column={1} /><br/>
        <Descriptions title="배송 주소" items={shippingAddressInfo} column={1} /><br/>
        <Button type="primary" style={{ width: '100px' }} disabled block>수정하기</Button><br/>
        <Button type="primary" style={{ width: '100px' }} onClick={onHandleGoBack} >돌아가기</Button>        
      </div>
    </CommonLayout>
  );
};

export default Profile;