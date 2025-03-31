import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Row, Button, Drawer, Layout } from 'antd';
import Link from 'next/link';
import { logoutRequest } from '../reducers/member';

const Header = Layout.Header;
const Footer = Layout.Footer;

const CommonLayout = ({ title, children }) => {
  const [ open, setOpen ] = useState(false);
  let { logoutLoading, logoutError, me } = useSelector((state) => state.member);

  const dispatch = useDispatch();

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

  return (
    <div>
      <Menu 
        mode="horizontal" 
        style={{ 
          top: 0,
          left: 0,
          position: "fixed",
          width: "100%"
        }}
      >
        <Menu.Item>
          사이트 아이콘
        </Menu.Item>

        <Menu.Item>
          Cart Connect Market
        </Menu.Item>

        <Menu.Item onClick={showDrawer}>
          삼선 버튼
        </Menu.Item>

        <Menu.Item>
          <Drawer onClose={onClose} open={open}>
            {me ? (
              <div>
                <p><Link href="">마이페이지</Link></p>
                <p><Link href="">장바구니</Link></p>
                <p><Link href="">검색</Link></p>
                <p><Link href="">카테고리별 상품</Link></p>
                <div>
                  <p onClick={onLogout}>로그아웃</p>
                  {logoutLoading && (<p>Loading...</p>)}
                  {logoutError && (<p>로그아웃 실패: {logoutError}</p>)} 
                </div>                
              </div>
            ) : (
              <div>
                <p><Link href="/auth/login">로그인</Link> / <Link href="/auth/signup">회원가입</Link></p>
                <p><Link href="">검색</Link></p>
                <p><Link href="">카테고리별 상품</Link></p>
              </div>
            )}
          </Drawer>
        </Menu.Item>
      </Menu>

      <Row style={{ paddingTop: '60px', backgroundColor: 'skyblue' }}>
        <Header style={{ backgroundColor: 'white' }}>
          {title}
        </Header>
      </Row>

      <Row>
        {children}
      </Row>

      <Footer style={{ textAlign: 'center' }}>
        ©2025 Sarifor. All rights reserved. [GitHub 링크] [Qiita 링크]
      </Footer>
    </div>
  )
};

export default CommonLayout;