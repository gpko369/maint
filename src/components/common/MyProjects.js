import React, { useEffect } from "react";
import ProjectCard from "../projects/ProjectCard";
import BottomFixedMenu from "./BottomFixedMenu";
import FixHeader from "./FixHeader";
import {
  Grid,
  Container,
  Header,
  Image,
  Button,
  Responsive,
  Card,
  Label
} from "semantic-ui-react";
import ProjectCardGroup from "../projects/ProjectCardGroup";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import Swiper from "react-id-swiper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css/swiper.css";

export const MY_PAGE = gql`
  query {
    mypage {
      id
      name
      email
      registerDate
      phoneNumber
      img
      enrolledClass {
        id
        name
        startDate
        project {
          id
          status
          title
          status
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
    likeProjects {
      id
      status
      title
      titleImageUrl
      like
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
`;

function toDate(date) {
  var t = new Date(date); // Epoch
  t = t.getMonth() + 1 + "월 " + t.getDate() + "일 ";
  return t;
}

function projectStatus(statusNo) {
  if (statusNo === "0") {
    return null;
  } else if (statusNo === "1") {
    return "모집 중";
  } else if (statusNo === "2") {
    return "모집 마감";
  } else if (statusNo === "3") {
    return "진행 중";
  } else {
    return null;
  }
}

const MyProjects = ({ history, location }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickLogin = () => {
    history.push("/login");
  };

  const onClickSearch = () => {
    history.push("/search");
  };

  const params = {
    slidesPerView: 1,
    spaceBetween: 12,
    slideOffsetAfter: 50
  };

  return (
    <div>
      <FixHeader />
      <Query query={MY_PAGE}>
        {({ error, loading, data }) => {
          if (loading) return null;
          if (error)
            return (
              <Container>
                <Grid style={{ margin: 0 }}>
                  <div style={{ padding: 0 }}>
                    <Grid.Row style={{ paddingTop: 32 }}>
                      <Header style={{ fontSize: 24, marginBottom: 7 }}>
                        프로젝트
                      </Header>
                    </Grid.Row>
                    <Grid.Row style={{ padding: 0 }}>
                      예정된 프로젝트가 없습니다. 프로젝트를 신청하고 당신의
                      꿈을 마인트가 도와드리겠습니다.
                    </Grid.Row>
                    <Grid.Row style={{ paddingBottom: 26, paddingTop: 64 }}>
                      <Image src={require("../../img/noprojectenrolled.png")} />
                    </Grid.Row>
                    <Grid.Row>
                      <Button
                        onClick={onClickLogin}
                        fluid
                        color="red"
                        style={{ fontSize: 15 }}
                      >
                        로그인하기
                      </Button>
                    </Grid.Row>
                  </div>
                </Grid>
              </Container>
            );
          return (
            <div>
              <Grid style={{ margin: 0 }}>
                {!data.mypage.enrolledClass[0] ? (
                  <Container>
                    <div style={{ padding: 0 }}>
                      <Grid.Row style={{ paddingTop: 32 }}>
                        <Header style={{ fontSize: 24, marginBottom: 7 }}>
                          프로젝트
                        </Header>
                      </Grid.Row>
                      <Grid.Row style={{ padding: 0 }}>
                        예정된 프로젝트가 없습니다. 프로젝트를 신청하고 당신의
                        꿈을 마인트에서 도와드리겠습니다.
                      </Grid.Row>
                      <Grid.Row style={{ paddingBottom: 26, paddingTop: 64 }}>
                        <Image
                          src={require("../../img/noprojectenrolled.png")}
                        />
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          onClick={onClickSearch}
                          fluid
                          color="red"
                          style={{ fontSize: 15 }}
                        >
                          프로젝트 둘러보기
                        </Button>
                      </Grid.Row>
                    </div>
                  </Container>
                ) : (
                  <div style={{ padding: 0, width: "100%" }}>
                    <Container>
                      <Grid.Row style={{ paddingTop: 32, paddingBottom: 13 }}>
                        <Header style={{ fontSize: 24, marginBottom: 7 }}>
                          프로젝트
                        </Header>
                        <p style={{ fontWeight: "bold" }}>
                          시작 예정된 프로젝트
                        </p>
                      </Grid.Row>
                    </Container>

                    <div className="one-card">
                      {data && data.mypage.enrolledClass && (
                        <Swiper {...params}>
                          {data.mypage.enrolledClass.map((enroll, i) => {
                            return (
                              <div>
                                <Header
                                  style={{
                                    fontWeight: "normal",
                                    fontSize: 14,
                                    color: "#eb4c2a",
                                    marginBottom: 8
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 100,
                                      left: 5,
                                      top: 18
                                    }}
                                  >
                                    <Label
                                      color="yellow"
                                      style={{
                                        fontSize: 10,
                                        padding: "6px 10px 6px 10px",
                                        fontWeight: "bold",
                                        background: "rgb(231,180,22)",
                                        borderRadius: 2
                                      }}
                                    >
                                      {projectStatus(enroll.project.status)}
                                    </Label>
                                    <Label
                                      color="green"
                                      style={{
                                        fontSize: 10,
                                        marginLeft: 3,
                                        padding: "6px 10px 6px 10px",
                                        fontWeight: "bold",
                                        borderRadius: 2
                                      }}
                                    >
                                      {toDate(enroll.startDate)} 시작
                                    </Label>
                                  </div>
                                </Header>
                                <ProjectCard
                                  style={{ marginRight: 12 }}
                                  key={i}
                                  project={enroll.project}
                                  history={history}
                                />
                              </div>
                            );
                          })}
                        </Swiper>
                      )}
                    </div>
                  </div>
                )}
              </Grid>

              <svg
                width="100%"
                height={12}
                style={{ padding: 0, marginTop: 40, marginBottom: 0 }}
              >
                <rect
                  className="block-divider"
                  width={"100%"}
                  height={12}
                  style={{ fill: "rgb(246,246,246)" }}
                />
              </svg>
              <Container>
                <Grid style={{ margin: 0 }}>
                  <Grid.Row style={{ marginTop: 26 }}>
                    <Header style={{ marginBottom: 30, fontSize: 20 }}>
                      내가 좋아요한 프로젝트
                    </Header>
                    <ProjectCardGroup
                      projectList={data.likeProjects}
                      history={history}
                    />
                  </Grid.Row>
                </Grid>
              </Container>
            </div>
          );
        }}
      </Query>
      <BottomFixedMenu history={history} option="프로젝트" />
    </div>
  );
};

export default MyProjects;
