import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  Grid,
  Container,
  Label,
  Header,
  Button,
  Modal,
  Divider,
  Transition
} from "semantic-ui-react";
import gql from "graphql-tag";
import ProjectHeader from "../projects/ProjectHeader";
import parse from "html-react-parser";

function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getWeekDay(date) {
  var t = new Date(date);
  t = t.getDay();
  if (t == 1) {
    return "월";
  } else if (t == 2) {
    return "화";
  } else if (t == 3) {
    return "수";
  } else if (t == 4) {
    return "목";
  } else if (t == 5) {
    return "금";
  } else if (t == 6) {
    return "토";
  } else {
    return "일";
  }
}

function toDate(date) {
  var t = new Date(date); // Epoch
  t =
    t.getFullYear() +
    "." +
    (t.getMonth() + 1) +
    "." +
    t.getDate() +
    " (" +
    getWeekDay(date) +
    ")";
  return t;
}

function toMonthDay(date) {
  var t = new Date(date); // Epoch
  t = t.getMonth() + 1 + "월 " + t.getDate() + "일";
  return t;
}

const PROJECT = gql`
  query {
    project(id: 1) {
      id
      status
      title
      coach {
        name
      }
      price
      like
      salePrice
      category {
        category
        id
      }
      place
      projectintro {
        id
        projectSpecial
        projectProcess
        projectTolearn
      }
      projectTime
      projectCaution
      projectTerm
      curriculum {
        week
        content
      }
      projectTermDetail
      classes {
        id
        name
        endDate
        startDate
      }
      maxCapacity
      minCapacity
      difficulty
      projectGoal
      titleImageUrl
      titleImage
      curriculum {
        id
        week
        content
      }
    }
  }
`;

const TestProjectDetail = props => {
  const [activeMenu, setActiveMenu] = useState("about");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { error, loading, data } = useQuery(PROJECT);

  const handleOpen = curriculumSet => {
    setModalContent(
      curriculumSet.map((curriculum, j) => {
        return (
          <>
            <Grid style={{ margin: 0 }} columns={2}>
              <Grid.Row style={{ paddingBottom: 24 }}>
                <Grid.Column className="curriculum-week-mark">
                  <Label>
                    {curriculum.week.toString().length === 1
                      ? "0" + curriculum.week
                      : curriculum.week}
                  </Label>
                </Grid.Column>
                <Grid.Column
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingTop: 8
                  }}
                >
                  주차에서는
                  <br />
                  이런 것들을 배워요
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ padding: 0 }}>
                <svg className="curriculum-small-divider" width="35" height="4">
                  <rect
                    width="35"
                    height="4"
                    style={{ fill: "rgb(53,53,53)" }}
                  />
                </svg>
                <Divider className="thin-90-divider" />
              </Grid.Row>

              <Grid.Row style={{ marginBottom: 24 }}>
                {parse(curriculum.content)}
              </Grid.Row>
            </Grid>
          </>
        );
      })
    );
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.async = true;
  //   script.src =
  //     "https://dapi.kakao.com/v2/maps/sdk.js?appkey=9745c02de1495c143e55fc956f64215c&autoload=false";
  //   document.head.appendChild(script);

  //   script.onload = () => {
  //     window.kakao.maps.load(() => {
  //       let container = document.getElementById("map");
  //       let options = {
  //         center: new window.kakao.maps.LatLng(37.478228, 126.95292),
  //         level: 3
  //       };
  //       const map = new window.kakao.maps.Map(container, options);
  //     });
  //   };
  // }, []);

  if (loading) return <div className="fullscreen" />;
  if (error) return null;
  if (data)
    return (
      <div className="fullscreen">
        <Grid style={{ margin: 0 }}>
          <div className="project-detail-top-label">
            <ProjectHeader history={props.history} project={data.project} />
            <Container
              style={{
                color: "white",
                paddingTop: 80,
                paddingBottom: 14
              }}
            >
              <Grid.Row
                className="project-tag"
                style={{
                  paddingBottom: 8,
                  paddingTop: 8
                }}
              >
                <Label
                  as="a"
                  color="green"
                  style={{
                    border: "1px solid #21BA45"
                  }}
                >
                  {data.project.category.category}
                </Label>
                <Label
                  as="a"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.0)",
                    color: "white",
                    border: "1px solid white"
                  }}
                >
                  {data.project.projectTerm}주과정
                </Label>
              </Grid.Row>
              <Header
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white",
                  marginTop: 0,
                  marginBottom: 12
                }}
              >
                {data.project.title}
              </Header>
              <Grid style={{ margin: 0 }}>
                <Grid.Row style={{ paddingTop: 0, fontSize: 15 }}>
                  {data.project.projectGoal}
                </Grid.Row>
              </Grid>
            </Container>
          </div>
          <Container className="project-test-detail-content">
            <Grid
              style={{ margin: 0 }}
              columns={3}
              className="project-test-detail-content-menu"
            >
              <Grid.Column
                width={2}
                onClick={() => {
                  setActiveMenu("about");
                }}
              >
                <Grid
                  style={{ margin: 0 }}
                  centered
                  className={
                    activeMenu === "about" ? "active-menu" : "inactive-menu"
                  }
                >
                  <Grid.Row className="menu-content">About</Grid.Row>
                  <Grid.Row className="menu-dot">•</Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column
                width={6}
                onClick={() => {
                  setActiveMenu("curriculum");
                }}
              >
                <Grid
                  style={{ margin: 0 }}
                  centered
                  className={
                    activeMenu === "curriculum"
                      ? "active-menu"
                      : "inactive-menu"
                  }
                >
                  <Grid.Row className="menu-content">Curriculum</Grid.Row>
                  <Grid.Row className="menu-dot">•</Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column
                width={2}
                onClick={() => {
                  setActiveMenu("coach");
                }}
              >
                <Grid
                  style={{ margin: 0 }}
                  centered
                  className={
                    activeMenu === "coach" ? "active-menu" : "inactive-menu"
                  }
                >
                  <Grid.Row className="menu-content">Coach</Grid.Row>
                  <Grid.Row className="menu-dot">•</Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid>
            <Grid
              className={
                "about-detail " +
                (activeMenu === "about" ? "active" : "inactive")
              }
              style={{ margin: 0 }}
            >
              <Grid.Row style={{ fontSize: 13, fontWeight: "bold" }}>
                <Grid.Column style={{ width: 35, textAlign: "center" }}>
                  <i
                    class="ri-timer-2-line ri-xl"
                    style={{ lineHeight: "0.9" }}
                  ></i>
                </Grid.Column>
                <Grid.Column style={{ width: "calc(100% - 35px)" }}>
                  <Grid.Row style={{ marginBottom: 8 }}>
                    {toDate(data.project.classes[0].startDate) +
                      " ~ " +
                      toDate(data.project.classes[0].endDate) +
                      " 총 " +
                      data.project.projectTerm +
                      "주"}
                  </Grid.Row>

                  {data.project.classes.map((classes, i) => {
                    return (
                      <Grid.Row style={{ fontWeight: "normal", opacity: 0.5 }}>
                        {classes.name +
                          " - " +
                          getWeekDay(classes.startDate) +
                          "요일 " +
                          toMonthDay(classes.startDate) +
                          " 시작"}
                      </Grid.Row>
                    );
                  })}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row
                style={{ fontSize: 13, fontWeight: "bold", paddingBottom: 0 }}
              >
                <Grid.Column style={{ width: 35, textAlign: "center" }}>
                  <i
                    class="ri-map-pin-line ri-xl"
                    style={{ lineHeight: "0.9" }}
                  ></i>
                </Grid.Column>
                <Grid.Column style={{ width: "calc(100% - 35px)" }}>
                  <Grid.Row style={{ marginBottom: 8 }}>
                    {data.project.place}
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Container>
                <Grid.Row
                  style={{ fontWeight: "normal", opacity: 0.5, fontSize: 12 }}
                >
                  *코치님의 사정에 따라 장소가 변동될 수 있으며, 변동 내용은
                  추후 마인트 알림 매체를 통해 알려드립니다.
                </Grid.Row>
              </Container>
            </Grid>
            <Grid
              centered
              className={
                "curriculum-detail " +
                (activeMenu === "curriculum" ? "active" : "inactive")
              }
              style={{ margin: 0, paddingTop: 8 }}
            >
              <Transition visible={modalOpen} animation="scale" duration={200}>
                <Modal
                  className="curriculum-modal"
                  open={modalOpen}
                  onClose={handleClose}
                >
                  <Container>
                    <Grid centered style={{ margin: 0 }}>
                      <Grid.Row>{modalContent}</Grid.Row>
                      <Divider />
                      <Grid.Row
                        onClick={handleClose}
                        style={{ color: "#eb4c2a" }}
                        className="modal-close"
                      >
                        닫기
                      </Grid.Row>
                    </Grid>
                  </Container>
                </Modal>
              </Transition>
              <Grid.Row style={{ fontSize: 13, fontWeight: "bold" }}>
                커리큘럼(총 {data.project.projectTerm}주):{" "}
                {data.project.projectTermDetail}
              </Grid.Row>

              {data.project.curriculum.map((curriculum, i) => {
                if (
                  (i + 1) % 2 === 1 &&
                  i === data.project.curriculum.length - 1
                ) {
                  return (
                    <Grid.Row>
                      <Button
                        circular
                        basic
                        fluid
                        onClick={() =>
                          handleOpen(data.project.curriculum.slice(i, i + 1))
                        }
                      >
                        {curriculum.week} 주차
                      </Button>
                    </Grid.Row>
                  );
                } else if ((i + 1) % 2 === 0) {
                  return (
                    <Grid.Row>
                      <Button
                        circular
                        basic
                        fluid
                        onClick={() =>
                          handleOpen(
                            data.project.curriculum.slice(i - 1, i + 1)
                          )
                        }
                      >
                        {curriculum.week - 1 + " - " + curriculum.week} 주차
                      </Button>
                    </Grid.Row>
                  );
                } else return null;
              })}
            </Grid>
            <Grid
              className={
                "coach-detail " +
                (activeMenu === "coach" ? "active" : "inactive")
              }
              style={{ margin: 0, paddingTop: 8 }}
            >
              {parse(data.project.projectCaution)}
            </Grid>
          </Container>
          <Container className="project-detail-test-container">
            <Grid columns={2} style={{ margin: 0 }}>
              <Grid.Column>
                <Grid.Row
                  style={{
                    fontSize: 10,
                    paddingBottom: 0,
                    fontWeight: "bold",
                    paddingTop: 0
                  }}
                >
                  <a style={{ color: "#ff7878" }}>
                    {parseInt(
                      (data.project.salePrice /
                        (data.project.price + data.project.salePrice)) *
                        100
                    )}
                    % 할인
                  </a>
                  <span
                    style={{
                      color: "#7f7f7f",
                      textDecoration: "line-through",
                      marginLeft: 5
                    }}
                  >
                    {numberFormat(data.project.price + data.project.salePrice)}
                    원
                  </span>
                </Grid.Row>
                <Grid.Row
                  style={{ paddingBottom: 0, paddingTop: 0, marginTop: -8 }}
                >
                  <Header style={{ fontSize: 26, fontWeight: 500 }}>
                    {numberFormat(data.project.price)}원
                  </Header>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <Button
                  circular
                  className="project-detail-test-apply-button"
                  color="black"
                  fluid
                  style={{ backgroundColor: "rgb(53,53,53)" }}
                  onClick={() => {
                    props.history.push("project/" + data.project.id + "/order");
                  }}
                >
                  프로젝트 신청하기
                </Button>
              </Grid.Column>
            </Grid>
          </Container>
        </Grid>
      </div>
    );
};

export default TestProjectDetail;
