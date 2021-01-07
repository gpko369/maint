import React from "react";
import {
  Grid,
  Container,
  Header,
  Card,
  Image,
  Divider,
  Responsive,
  Loader
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import ProjectCard from "../projects/ProjectCard";
import Slider from "react-slick";
import ProjectSwiper from "../projects/ProjectSwiper";
import Swiper from "react-id-swiper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css/swiper.css";

const PROJECT_QUERY = gql`
  query {
    allProjects {
      edges {
        node {
          id
          status
          title
          titleImageUrl
          titleImage
          category {
            id
            category
          }
          projectShortintro
          projectTerm
          minCapacity
          coach {
            name
          }
        }
      }
    }
  }
`;

export const LIKE_PROJECTS = gql`
  query {
    likeProjects {
      id
      status
      title
      like
      projectShortintro
      category {
        id
        category
      }
      titleImage
      minCapacity
      projectTerm
    }
  }
`;

const MyLike = ({ history }) => {
  const params = {
    slidesPerView: 1,
    spaceBetween: 12,
    slideOffsetAfter: 50
  };
  return (
    <Container className="mypage-like">
      <Header style={{ marginLeft: 25 }}>좋아요한 프로젝트</Header>

      <Query query={LIKE_PROJECTS}>
        {({ error, loading, data }) => {
          if (loading) return <Loader active inline="centered" />;
          if (error) return null;
          if (data === null) return null;
          return (
            <ProjectSwiper
              projectList={data.likeProjects}
              history={history}
              swiperParams={params}
            />
          );
        }}
      </Query>
    </Container>
  );
};

const MyProject = props => {
  return (
    <Grid style={{ margin: 0 }} textAlign="left" verticalAlign="middle">
      {/* <Grid.Row>
        <Container className="slick-carousel">
          <Header>내 프로젝트</Header>

          <Query query={PROJECT_QUERY}>
            {({ error, loading, data }) => {
              if (loading) return <Loader active inline="centered" />;
              if (error) return null;
              if (props.enrolled.edges === [])
                return (
                  <Grid.Row>
                    <Header
                      style={{ marginTop: 70, marginBottom: 70 }}
                      textAlign="center"
                      as="h2"
                    >
                      아직 참여 중인 프로젝트가 없어요!
                    </Header>
                  </Grid.Row>
                );
              return (
                <div>
                  <Responsive as={Card.Group} minWidth={1080} itemsPerRow={4}>
                    {props.enrolled.edges.map((project, i) => {
                      return <ProjectCard key={i} project={project.node} />;
                    })}
                  </Responsive>
                  <Responsive as={Card.Group} maxWidth={1080} itemsPerRow={2}>
                    {props.enrolled.edges.map((project, i) => {
                      return <ProjectCard key={i} project={project.node} />;
                    })}
                  </Responsive>
                </div>
              );
            }}
          </Query>
        </Container>
      </Grid.Row>
      <Divider /> */}
      <Grid.Row className="main-swiper" style={{ paddingTop: 40 }}>
        <MyLike history={props.history} />
      </Grid.Row>
    </Grid>
  );
};

export default MyProject;
