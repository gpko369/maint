import React, { Component } from "react";
import { Grid, Container, Header } from "semantic-ui-react";
import ProjectCard from "./ProjectCard";
import ProjectSwiper from "./ProjectSwiper";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";

const RecommendSwiper = props => {
  const params1 = {
    slidesPerView: 2,
    spaceBetween: 12,
    slideOffsetAfter: 50,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    }
  };
  if (props.categoryProject)
    return (
      <>
        <Grid
          className="recommend-project"
          textAlign="center"
          verticalAlign="middle"
          style={{ margin: 0 }}
        >
          <Grid.Row className="main-swiper" style={{ marginTop: 26 }}>
            <Container style={{ margin: 0 }}>
              <Header
                style={{
                  textAlign: "left",
                  marginLeft: 25,
                  fontSize: 20,
                  marginBottom: 28
                }}
              >
                {props.categoryProject.category} 프로젝트 추천
              </Header>
              <ProjectSwiper
                projectList={props.categoryProject.projects.edges}
                history={props.history}
                swiperParams={params1}
              />
            </Container>
          </Grid.Row>
        </Grid>
      </>
    );
  else {
    return null;
  }
};

export default RecommendSwiper;
