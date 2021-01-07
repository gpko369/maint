import React from "react";
import { Menu, Grid } from "semantic-ui-react";
import Kakao from "kakaojs";

const ProjectHeader = ({ history, project }) => {
  const onClickGoBack = () => {
    history.goBack();
  };
  const onClickSearch = () => {
    history.push("/search");
  };
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

  return (
    <div
      style={{
        height: 64,
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.0))"
      }}
      className="project-header-back"
    >
      <Menu borderless className="project-header" style={{ height: 64 }}>
        <Menu.Item style={{ paddingLeft: 27 }} onClick={onClickGoBack}>
          <i style={{ color: "white" }} class="ri-arrow-go-back-line ri-xl"></i>
        </Menu.Item>
        <Menu.Item
          style={{ marginLeft: "auto", padding: 0 }}
          onClick={onClickKakaoLink}
        >
          <Grid style={{ margin: 0 }} centered>
            <Grid.Row style={{ padding: 0, paddingTop: 8 }}>
              <i
                style={{ color: "white" }}
                class="ri-share-forward-box-line ri-xl"
              ></i>
            </Grid.Row>
            <Grid.Row
              style={{
                padding: 0,
                paddingTop: 7,
                fontSize: 8,
                color: "white",
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
              <i style={{ color: "white" }} class="ri-home-line ri-xl"></i>
            </Grid.Row>
            <Grid.Row
              style={{
                padding: 0,
                paddingTop: 7,
                fontSize: 8,
                color: "white",
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

export default ProjectHeader;
