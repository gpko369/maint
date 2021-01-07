import React, { useEffect } from "react";
import { Grid, Container, Header, Label } from "semantic-ui-react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import CategoryHeader from "./CategoryHeader";
import ProjectCard from "../projects/ProjectCard";
import BottomFixedMenu from "../common/BottomFixedMenu";
import ProjectSwiper from "./ProjectSwiper";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";

const CATEGORY_QUERY = gql`
  query Category($id: ID!) {
    category(id: $id) {
      id
      category
      image
      introduction
      projects {
        edges {
          node {
            id
            status
            category {
              id
              category
            }
            title
            titleImageUrl
            titleImage
            earlybirdDue
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
  }
`;

const Category = ({ match, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const params1 = {
    slidesPerView: 2,
    spaceBetween: 12,
    slideOffsetAfter: 50,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    }
  };

  return (
    <div>
      <Query query={CATEGORY_QUERY} variables={{ id: match.params.id }}>
        {({ error, loading, data }) => {
          if (error) return null;
          if (loading) return null;
          return (
            <div>
              <CategoryHeader
                history={history}
                category={data ? data.category.category : null}
              />
              <div
                style={{
                  marginTop: 19,
                  position: "relative",
                  width: "100%",
                  backgroundImage:
                    "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                    data.category.image +
                    "')",
                  backgroundSize: "cover",
                  backgroundPositionX: "center",
                  height: 421
                }}
              >
                <Grid
                  style={{
                    margin: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.4)"
                  }}
                >
                  <Container
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      padding: 0,
                      color: "white"
                    }}
                  >
                    <Label
                      color="white"
                      style={{ padding: "5px 7px 2px 7px", borderRadius: 2 }}
                    >
                      커리큘럼
                    </Label>
                    <Header
                      style={{
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                        marginTop: 5,
                        marginBottom: 5
                      }}
                    >
                      {data ? data.category.category : null}
                    </Header>
                    {data.category.introduction}
                  </Container>
                </Grid>
              </div>
              <Grid
                textAlign="center"
                verticalAlign="middle"
                style={{ margin: 0 }}
              >
                <Grid.Row className="main-swiper" style={{ marginTop: 26 }}>
                  <Container>
                    <Header
                      style={{
                        textAlign: "left",
                        marginLeft: 25,
                        fontSize: 20,
                        marginBottom: 28
                      }}
                    >
                      모든 프로젝트
                    </Header>
                    <ProjectSwiper
                      projectList={data.category.projects.edges}
                      history={history}
                      swiperParams={params1}
                    />
                  </Container>
                </Grid.Row>
              </Grid>
            </div>
          );
        }}
      </Query>
      <BottomFixedMenu history={history} />
    </div>
  );
};

export default Category;
