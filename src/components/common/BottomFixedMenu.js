import React, { useEffect, useState } from "react";
import { Menu, Grid, Container, Transition } from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const AUTH_CHECK = gql`
  query {
    mypage {
      id
    }
  }
`;

const BottomFixedMenu = ({ option, history }) => {
  const [style, setStyle] = useState({ height: 60 });
  const [scroll, setScroll] = useState(0);
  const [visible, setVisible] = useState(true);

  const onClickLink = link => {
    history.push(link);
  };

  window.onscroll = e => {
    setScroll(window.scrollY);
    if (window.scrollY - scroll > 10) {
      setVisible(false);
    } else if (window.scrollY - scroll < -7) {
      setVisible(true);
    }
  };
  window.onwheel = e => {
    if (e.deltaY > 50) {
      setVisible(false);
    } else if (e.deltaY < -40) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (window.outerHeight > 780) {
      setStyle({ height: 60 });
    } else {
      setStyle({ height: 60 });
    }
  }, [window.outerHeight]);
  return (
    <Transition visible={visible} animation="fade up" duration={500}>
      <Menu
        className="bottom-fixed-menu"
        widths={4}
        pointing
        borderless
        fixed="bottom"
        style={style}
      >
        <Menu.Item onClick={() => onClickLink("/")} active={option === "홈"}>
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0 }}>
              <i className="ri-home-line ri-2x"></i>
            </Grid.Row>
            <Grid.Row style={{ padding: 0, fontSize: 9, fontWeight: "bold" }}>
              홈
            </Grid.Row>
          </Grid>
        </Menu.Item>
        <Menu.Item
          onClick={() => onClickLink("/myproject")}
          active={option === "프로젝트"}
        >
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0 }}>
              <i className="ri-community-line ri-2x"></i>
            </Grid.Row>
            <Grid.Row style={{ padding: 0, fontSize: 9, fontWeight: "bold" }}>
              프로젝트
            </Grid.Row>
          </Grid>
        </Menu.Item>
        <Menu.Item
          onClick={() => onClickLink("/search")}
          active={option === "검색"}
        >
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0 }}>
              <i className="ri-search-line ri-2x"></i>
            </Grid.Row>
            <Grid.Row style={{ padding: 0, fontSize: 9, fontWeight: "bold" }}>
              검색
            </Grid.Row>
          </Grid>
        </Menu.Item>
        <Query query={AUTH_CHECK}>
          {({ data }) => {
            return (
              <Menu.Item
                onClick={
                  data
                    ? () => onClickLink("/mypage")
                    : () => onClickLink("/login")
                }
                active={option === "마이페이지"}
              >
                <Grid style={{ margin: 0 }} centered>
                  <Grid.Row style={{ padding: 0 }}>
                    <i className="ri-account-box-line ri-2x"></i>
                  </Grid.Row>
                  <Grid.Row
                    style={{ padding: 0, fontSize: 9, fontWeight: "bold" }}
                  >
                    마이페이지
                  </Grid.Row>
                </Grid>
              </Menu.Item>
            );
          }}
        </Query>
      </Menu>
    </Transition>
  );
};

export default BottomFixedMenu;
