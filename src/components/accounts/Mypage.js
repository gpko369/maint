import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  Container,
  Header,
  Grid,
  Segment,
  Menu,
  Image,
  Button,
  Responsive
} from "semantic-ui-react";
import MySetting from "./mySettings/MySetting";
import MyProject from "./MyProject";
import SMSAuthModal from "./SMSAuthModal";
import BottomFixedMenu from "../common/BottomFixedMenu";
import FixedHeader from "../common/FixHeader";

const SUB_BANNER_QUERY = gql`
  query {
    allSubBanners {
      id
      image
      title
    }
  }
`;

const MY_PAGE = gql`
  query {
    mypage {
      id
      name
      email
      registerDate
      phoneNumber
      img
      enrolledClass {
        project {
          id
          title
          titleImageUrl
          titleImage
          projectTerm
          category {
            id
            category
          }
          minCapacity
          projectShortintro
          coach {
            name
          }
        }
      }
    }
  }
`;

const Mypage = props => {
  const [activeItem, setActiveItem] = useState("프로젝트");
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickProject = () => {
    props.history.push("/mypage");
  };

  const onClickSetting = () => {
    props.history.push("/mypage/setting");
  };

  const toDate = date => {
    var t = new Date(date); // Epoch
    t = t.getFullYear() + "." + (t.getMonth() + 1) + "." + t.getDate();
    return t;
  };

  const MypageSelection = props => {
    if (props.pathname == "/mypage/setting") {
      return <MySetting history={props.history} user={props.user} />;
    } else
      return <MyProject history={props.history} enrolled={props.enrolled} />;
  };

  return (
    <div>
      <FixedHeader />
      <Query query={MY_PAGE}>
        {({ error, loading, data }) => {
          if (error) {
            alert("로그인하세요");
            props.history.push("/login");
            return null;
          }
          if (loading) return null;

          if (data) setEnrolled(data.mypage.enrolledClass.project);
          if (data && data.mypage && !data.mypage.phoneNumber) {
            alert(
              "회원정보가 완전하지 않습니다.\n회원정보를 입력하여 회원가입을 완료해주세요."
            );

            props.history.push("/signup");
            return null;
          }
          return (
            <div>
              <Grid
                centered
                style={{
                  height: 224,
                  margin: 0
                }}
              >
                <Container
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto"
                  }}
                >
                  <Grid centered>
                    <Grid.Row>
                      <Image
                        style={{ height: 94 }}
                        src={require("../../img/default_user.png")}
                      />
                    </Grid.Row>
                    <Grid.Row
                      style={{
                        paddingBottom: 0,
                        fontSize: 22,
                        fontWeight: "bold"
                      }}
                    >
                      {data.mypage.name}
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 0 }}>
                      {data.mypage.email}
                    </Grid.Row>
                  </Grid>
                </Container>
              </Grid>
              <Grid
                style={{
                  margin: 0,
                  height: 93,
                  backgroundColor: "rgb(216,216,216)",
                  marginBottom: 4
                }}
              >
                <Container
                  style={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "auto",
                    padding: 0
                  }}
                >
                  <Header
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      fontSize: 15
                    }}
                  >
                    코치에 도전해보세요!{" "}
                    <p style={{ fontSize: 12, fontWeight: "normal" }}>
                      여러분의 지식을 모두를 위해 나눠주고 수익도 얻어가세요.
                    </p>
                  </Header>
                </Container>
              </Grid>

              <Container>
                <Menu widths={2} pointing secondary>
                  <Menu.Item
                    name="프로젝트"
                    active={props.location.pathname === "/mypage"}
                    onClick={onClickProject}
                  />
                  <Menu.Item
                    name="설정"
                    active={props.location.pathname === "/mypage/setting"}
                    onClick={onClickSetting}
                  />
                </Menu>
              </Container>
              <MypageSelection
                history={props.history}
                pathname={props.location.pathname}
                enrolled={enrolled}
                user={data.mypage}
              />
            </div>
          );
        }}
      </Query>
      <BottomFixedMenu history={props.history} option="마이페이지" />
    </div>
  );
};

export default Mypage;
