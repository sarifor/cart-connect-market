import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Menu, Row, Button, Drawer, Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { logoutRequest } from '../reducers/member';

const Header = Layout.Header;
const Footer = Layout.Footer;
// const { Header, Footer } = Layout;

// Q. localhost:3000에 접속하면 가끔 const CommonLayout = ({ title, children }) => { 이 부분에서 에러가 났다는 메시지가 뜬다. 원인? 해결법?
const CommonLayout = ({ title, children }) => {
  const [ open, setOpen ] = useState(false);
  let { logoutLoading, logoutError, me } = useSelector((state) => state.member);
  
  let memberId;

  if (me) {
    memberId = me.member_id;
  }

  const dispatch = useDispatch();
  const router = useRouter();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onLogout = () => {
    dispatch({
      type: logoutRequest.type,
    });
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: '100vh',
    }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          top: 0,
          left: 0,
          right: 0,
          position: "fixed",          
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#3CB371"
        }}
      >

        <div style={{ flex: 1, padding: "15px" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }} onClick={handleHomeClick}>
            <img src="/logo.png" style={{ width: "10%", height: "auto" }} />
            <div style={{ paddingLeft: "10px" }}>Cart Connect Market</div>
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "center", padding: "15px" }}>
          <Link href="/public-cart" style={{ textDecorationLine: "none", color: "black" }}>みんな何食べてるんだろう？</Link>
        </div>

        <div style={{ flex: 1, textAlign: "right", padding: "15px" }}>
          <MenuOutlined onClick={showDrawer} />
        </div>

      </div>

      <Drawer onClose={onClose} open={open}>
        {me ? (
          <div style={{ display: "flex", flexDirection: "column", padding: "0px", rowGap: "15px" }}>
            <div><Link href={`/member/${memberId}`}>マイページ</Link></div>
            <div><Link href={`/cart`}>カート</Link></div>
            <div><Link href="/product/category">カテゴリー</Link></div>
            <div><Link href="/public-cart">公開カート</Link></div>
            <div onClick={onLogout}>ログアウト{logoutLoading && ("（ログアウト中...）")}{logoutError && ("（失敗）")}</div> 
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", padding: "0px", rowGap: "15px" }}>
            <div><Link href="/auth/login">ログイン</Link> ／ <Link href="/auth/signup">会員登録</Link></div>
            <div><Link href="/product/category">カテゴリー</Link></div>
            <div><Link href="/public-cart">公開カート</Link></div>
          </div>
        )}
      </Drawer>

      <Row style={{ paddingTop: '60px' }}>
        <header
          style={{ 
            // backgroundColor: 'yellow',
            padding: "15px",
            width: "100%",
          }}
        >
          {title}
        </header>
      </Row>

      <Row style={{ flex: 1 }}>
        {children}
      </Row>

      {/* Q. Antd FooterのMarginを0にする方法？ */}
      <Footer style={{ 
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center',
        columnGap: "10px",
      }}>
        <div>©2025 Sarifor. All rights reserved.</div>
        <a href="https://github.com/sarifor" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://qiita.com/sarifor" target="_blank" rel="noopener noreferrer">Qiita</a>
        <a href="https://forms.gle/gfZxSvzLnBdbe1KQ9" target="_blank" rel="noopener noreferrer">ご意見をどうぞ！</a>        
      </Footer>
    </div>
  )
};

export default CommonLayout;