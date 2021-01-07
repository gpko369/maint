import React, { useState, useEffect } from "react";
import {
  Menu,
  Image,
  Container,
  Responsive,
  Sidebar,
  Icon,
  Divider,
  Header
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Query } from "react-apollo";
import _ from "lodash";

const LOGOUT_MUTATION = gql`
  mutation {
    logoutToken {
      message
    }
  }
`;

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
      name
      email
      img
    }
  }
`;

const MobileHeader = () => {
  const [visible, setVisible] = useState(false);
  const [logoutQuery] = useMutation(LOGOUT_MUTATION);

  const handleLogout = () => {
    logoutQuery();
  };

  const moveToLogin = () => {
    return <Redirect to="/login" />;
  };

  const onClickSideMenu = () => {
    setVisible(true);
  };

  const onClickCloseSide = () => {
    setVisible(false);
  };

  return (
    <Responsive
      as={Container}
      maxWidth={1080}
      fluid
      style={{
        height: 55,
        width: "100%"
      }}
    >
      <Menu.Item style={{ border: "0 0 0 0" }} href="/">
        <Image
          src="https://i.ibb.co/b2T5ZbV/logo-black-2x.png"
          alt="logo-black-2x"
          style={{ height: 32 }}
        />
      </Menu.Item>
      <Menu
        secondary
        style={{ alignItems: "flex-end", marginLeft: "auto", marginRight: 0 }}
      >
        <Menu.Item>
          <Icon name="bars" size="large" onClick={onClickSideMenu} />
        </Menu.Item>
      </Menu>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        onHide={() => setVisible(false)}
        vertical
        direction="right"
        visible={visible}
        style={{ width: 240 }}
      >
        <Icon
          name="bars"
          size="large"
          style={{ margin: "0 0 0 177px", padding: 15 }}
          onClick={onClickCloseSide}
        />
        <Query query={IS_AUTHENTICATED}>
          {({ error, loading, data }) => {
            if (loading) return null;
            if (error)
              return (
                <Menu.Item>
                  <Image
                    src="https://s3.ap-northeast-2.amazonaws.com/maint.img/media/accounts/user/2019/12/24/default_user.png"
                    style={{
                      borderRadius: 25,
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                  />
                  <Header as="h3">로그인이 필요합니다</Header> 아직 마인트
                  회원이 아니신가요?
                </Menu.Item>
              );
            return (
              <Menu.Item>
                <Image
                  src={data.mypage.img}
                  style={{
                    borderRadius: 25,
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                />
                <Header as="h3">{data.mypage.name}</Header>
                {data.mypage.email}
              </Menu.Item>
            );
          }}
        </Query>

        <Divider />
        <Menu.Item href="/">홈</Menu.Item>
        <Menu.Item href="/mypage">마이페이지</Menu.Item>
        <Query query={IS_AUTHENTICATED}>
          {({ error, loading, data }) => {
            if (loading) return null;
            if (error)
              return (
                <Menu.Item name="로그인" onClick={moveToLogin} href="/login" />
              );
            if (data)
              return (
                <Menu.Item
                  name="로그아웃"
                  onClick={handleLogout}
                  href="/login"
                />
              );
          }}
        </Query>
      </Sidebar>
    </Responsive>
  );
};

export default MobileHeader;
