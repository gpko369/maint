import React from "react";
import { Menu, Grid } from "semantic-ui-react";
import Kakao from "kakaojs";

const ProjectTestHeader = ({
  history,
  project,
  setActiveIndex,
  setProjectIndex,
  activeIndex,
  projectIndex
}) => {
  const onClickHome = () => {
    history.push("/");
  };
  const onClickKakaoLink = () => {
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: project.title,
        description: project.projectGoal,
        imageUrl:
          "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
          project.titleImage,
        link: {
          mobileWebUrl: "https://maint.me/project/" + project.id,
          webUrl: "https://maint.me/project/" + project.id
        }
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: "https://maint.me/project/" + project.id,
            webUrl: "https://maint.me/project/" + project.id
          }
        }
      ]
    });
  };

  const onClickCoachIntro = () => {
    setProjectIndex(1);
    setActiveIndex(-1);
  };

  const onClickProjectIntro = () => {
    setProjectIndex(2);
    setActiveIndex(-1);
  };

  const onClickCurriculumIntro = () => {
    setProjectIndex(-1);
    setActiveIndex(0);
  };

  return (
    <div
      style={{
        height: 64,
        width: "100%",
        maxWidth: 640
      }}
      className="project-navigation-header"
    >
      <Menu
        borderless
        className="project-navigation-header"
        style={{ height: 64 }}
      >
        <Menu.Menu style={{ width: "100%" }}>
          <Menu.Item
            style={{
              fontSize: 11,
              width: "33%"
            }}
            onClick={onClickCoachIntro}
          >
            <Grid
              centered
              className={
                projectIndex === 1 ? "active-header" : "inactive-header"
              }
              style={{ margin: 0 }}
            >
              <Grid.Row className="header-content">코치소개</Grid.Row>
              <Grid.Row className="header-dot">•</Grid.Row>
            </Grid>
          </Menu.Item>
          <Menu.Item
            style={{
              fontSize: 11,
              width: "34%"
            }}
            onClick={onClickProjectIntro}
          >
            <Grid
              centered
              className={
                projectIndex === 2 ? "active-header" : "inactive-header"
              }
              style={{ margin: 0 }}
            >
              <Grid.Row className="header-content">프로젝트</Grid.Row>
              <Grid.Row className="header-dot">•</Grid.Row>
            </Grid>
          </Menu.Item>
          <Menu.Item
            style={{
              fontSize: 11,
              width: "33%"
            }}
            onClick={onClickCurriculumIntro}
          >
            <Grid
              centered
              className={
                activeIndex !== -1 ? "active-header" : "inactive-header"
              }
              style={{ margin: 0 }}
            >
              <Grid.Row className="header-content">커리큘럼</Grid.Row>
              <Grid.Row className="header-dot">•</Grid.Row>
            </Grid>
          </Menu.Item>
        </Menu.Menu>

        <Menu.Item
          style={{ marginLeft: "auto", padding: 0 }}
          onClick={onClickKakaoLink}
        >
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0, paddingTop: 8 }}>
              <i
                style={{ color: "rgb(53,53,53)" }}
                class="ri-share-forward-box-line ri-xl"
              ></i>
            </Grid.Row>
            <Grid.Row
              style={{
                padding: 0,
                paddingTop: 7,
                fontSize: 8,
                fontWeight: "bold"
              }}
            >
              공유하기
            </Grid.Row>
          </Grid>
        </Menu.Item>
        <Menu.Item
          style={{ paddingRight: 15, paddingLeft: 0 }}
          onClick={onClickHome}
        >
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0, paddingTop: 8 }}>
              <i
                style={{ color: "rgb(53,53,53)" }}
                class="ri-home-line ri-xl"
              ></i>
            </Grid.Row>
            <Grid.Row
              style={{
                padding: 0,
                paddingTop: 7,
                fontSize: 8,
                fontWeight: "bold"
              }}
            >
              메인이동
            </Grid.Row>
          </Grid>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default ProjectTestHeader;
