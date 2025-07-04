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

  // Q. useEffect 처리 하는 게 좋을까? me.member_id가 확실히 있을 때 값이 들어오도록.
  // Q. '가입일시'를 '2025/1/1 9:00AM'과 같이 표시하려면?
  if (Number(me && me.member_id) === Number(router.query.id)) {
    basicInfo = [
      {
        key: '1',
        label: '姓',
        children: me.family_name,
      },
      {
        key: '2',
        label: '名',
        children: me.first_name,
      },
      {
        key: '3',
        label: 'ニックネーム',
        children: me.nickname,
      },
      {
        key: '4',
        label: 'メールアドレス',
        children: me.email,
      },
      {
        key: '5',
        label: '登録日時',
        children: me.created_at,
      },
    ];

    shippingAddressInfo = [
      {
        key: '1',
        label: '受取人',
        children: me.ShippingAddresses[0]?.receiver || "未入力",
      },
      {
        key: '2',
        label: '郵便番号',
        children: me.ShippingAddresses[0]?.postcode || "未入力",
      },
      {
        key: '3',
        label: '配送先住所',
        children: me.ShippingAddresses[0]?.address || "未入力",
      },
    ];  
  }

  useEffect(() => {
    if (!me || Number(me.member_id) !== Number(router.query.id)) {
      router.replace("/");
    }
  }, [me]);
  
  const handleGoBackClick = () => {
    router.back();
  };

  return (
    <CommonLayout title="会員情報">
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          maxWidth: 600, 
          margin: '0', 
          width: '100%'
        }}
      >
        <Descriptions title="基本情報" items={basicInfo} column={1} /><br/>
        <Descriptions title="配送先住所" items={shippingAddressInfo} column={1} /><br/>
        <Button type="primary" style={{ width: '100px' }} disabled block>編集する</Button><br/>
        <Button type="primary" style={{ width: '100px' }} onClick={handleGoBackClick} >戻る</Button>        
      </div>
    </CommonLayout>
  );
};

export default Profile;