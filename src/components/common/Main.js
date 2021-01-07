import React, { useEffect, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Grid,
  Card,
  Image,
  Container,
  Header,
  Responsive,
  Dimmer,
  Loader,
  Divider,
  Placeholder,
  Progress,
  Button,
  Label
} from "semantic-ui-react";
import ProjectCard from "../projects/ProjectCard";
import Slider from "react-slick";
import CategoryBox from "../projects/CategoryBox";
import MainHeader from "./MainHeader";
import FixHeader from "./FixHeader";
import BottomFixedMenu from "./BottomFixedMenu";
import ReactHtmlParser from "react-html-parser";
import ProjectSwiper from "../projects/ProjectSwiper";
import Swiper from "react-id-swiper";
import shuffleArray from "../utility/utilFunction";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css/swiper.css";

const MAIN_BANNER_QUERY = gql`
  query {
    allMainBanners {
      id
      image
      title
      tag
      href
      externalLink
      content
    }
  }
`;

const SUB_BANNER_QUERY = gql`
  query {
    allSubBanners {
      id
      image
      title
      href
      externalLink
      buttonText
      content
    }
  }
`;

export const ALL_PROJECT_QUERY = gql`
  query {
    allProjects {
      edges {
        node {
          id
          status
          category {
            id
            category
          }
          title
          like
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
`;

const HOT_PROJECT_QUERY = gql`
  query {
    allProjects(isHot: true) {
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

//메인 페이지 컴포넌트
const Main = props => {
  // useEffect(() => {
  //   window.location.href = "https://maint.me";
  // }, []);

  const [currentSlide1, setCurrentSlide1] = useState(0);
  const [currentSlide2, setCurrentSlide2] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickBanner = href => {
    props.history.push(href);
  };

  const onClickBannerExternal = href => {
    window.open(href);
  };

  const banner_params = {
    spaceBetween: 0,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    speed: 800,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction"
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false
    }
  };

  const sub_banner_params = {
    spaceBetween: 0,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    speed: 800,
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false
    }
  };

  const params1 = {
    slidesPerView: 2,
    slidesPerColumn: 2,
    spaceBetween: 12,
    slideOffsetAfter: 50,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar"
    }
  };

  const params2 = {
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
      <FixHeader />
      <Grid textAlign="center" verticalAlign="middle" style={{ margin: 0 }}>
        <Query query={MAIN_BANNER_QUERY}>
          {({ error, loading, data }) => {
            if (error) return null;
            if (loading)
              return (
                <Placeholder style={{ width: "100%", height: 461 }}>
                  <Placeholder.Image />
                </Placeholder>
              );
            return (
              <div className="main-banner-swiper">
                <Swiper className="main-banner-swiper" {...banner_params}>
                  {data &&
                    data.allMainBanners &&
                    data.allMainBanners.map((banner, i) => {
                      return (
                        <div key={i}>
                          <Grid
                            style={{
                              margin: 0,
                              padding: 0,
                              backgroundImage:
                                "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                                banner.image +
                                "')",
                              backgroundSize: "cover",
                              backgroundPositionX: "center",
                              width: "100%",
                              height: 461
                            }}
                          >
                            <Grid
                              style={{
                                margin: 0,
                                padding: 0,
                                width: "100%",
                                backgroundColor: "rgba(0,0,0,0)"
                              }}
                            >
                              <Container
                                textAlign="left"
                                style={{
                                  width: "100%",
                                  marginTop: 58,
                                  padding: 0
                                }}
                              >
                                {banner.tag ? (
                                  <Label
                                    basic
                                    style={{
                                      color: "white",
                                      background: "rgba(0,0,0,0)",
                                      border: "1px solid white",
                                      padding: "4px 10px 1px 10px",
                                      borderRadius: 2,
                                      marginBottom: 12
                                    }}
                                  >
                                    {banner.tag}
                                  </Label>
                                ) : null}

                                <div
                                  style={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    color: "white"
                                  }}
                                >
                                  {ReactHtmlParser(banner.content)}
                                </div>
                                {banner.href ? (
                                  <Button
                                    onClick={() => {
                                      banner.externalLink
                                        ? onClickBannerExternal(banner.href)
                                        : onClickBanner(banner.href);
                                    }}
                                    style={{
                                      marginTop: 40,
                                      borderRadius: 3,
                                      color: "rgb(35,35,35)",
                                      backgroundColor: "white"
                                    }}
                                  >
                                    더 알아보기
                                  </Button>
                                ) : null}
                              </Container>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
            );

            // data.allMainBanners.map(banner => {
            //   return (
            //     <Grid
            //       style={{
            //         padding: 0,
            //         backgroundImage:
            //           "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
            //           banner.image +
            //           "')",
            //         backgroundSize: "cover",
            //         backgroundPositionX: "center",
            //         width: "100%",
            //         height: 461
            //       }}
            //     >
            //       <Grid
            //         style={{
            //           margin: 0,
            //           padding: 0,
            //           width: "100%",
            //           backgroundColor: "rgba(0,0,0,0.3)"
            //         }}
            //       >
            //         <Container
            //           style={{
            //             width: "100%",
            //             marginTop: "auto",
            //             marginBottom: "auto",
            //             padding: 0
            //           }}
            //         >
            //           <Header
            //             style={{
            //               marginTop: "auto",
            //               marginBottom: "auto",
            //               color: "white",
            //               fontSize: 30
            //             }}
            //           >
            //             <p>나는 지식의 끝에 있다 </p>무한 피드백
            //           </Header>
            //           <Button style={{ marginTop: 63, borderRadius: 3 }}>
            //             더 알아보기
            //           </Button>
            //         </Container>
            //       </Grid>
            //     </Grid>
            //   );
            // });
          }}
        </Query>
        <Query query={SUB_BANNER_QUERY}>
          {({ error, loading, data }) => {
            if (error) return null;
            if (loading)
              return (
                <Placeholder
                  style={{
                    marginTop: 30,
                    marginBottom: 20,
                    marginLeft: 25,
                    marginRight: 25,
                    paddingLeft: 25,
                    paddingRight: 25,
                    borderRadius: 3,
                    width: "100%",
                    height: 79
                  }}
                >
                  <Placeholder.Image />
                </Placeholder>
              );
            return (
              <Grid
                style={{
                  backgroundImage:
                    "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                    data.allSubBanners[0].image +
                    "')",
                  backgroundSize: "cover",
                  backgroundPositionX: "center",
                  width: "100%",
                  height: 79,
                  borderRadius: 3,
                  margin: "30px 25px 30px 25px",
                  padding: 0
                }}
              >
                <Container
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    padding: 0
                  }}
                >
                  <div
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto"
                    }}
                  >
                    {ReactHtmlParser(data.allSubBanners[0].content)}
                  </div>
                </Container>
              </Grid>
            );
          }}
        </Query>
        <Container className="main-categorybox" style={{ padding: 0 }}>
          <CategoryBox history={props.history} />
        </Container>
        <svg
          width="100%"
          height={12}
          style={{ padding: 0, marginTop: 26, marginBottom: 0 }}
        >
          <rect
            className="block-divider"
            width={"100%"}
            height={12}
            style={{ fill: "rgb(246,246,246)" }}
          />
        </svg>
        <Grid.Row
          className="sub-banner-swiper"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <Query query={SUB_BANNER_QUERY}>
            {({ error, loading, data }) => {
              if (loading)
                return (
                  <Placeholder style={{ width: "100%", height: 284 }}>
                    <Placeholder.Image />
                  </Placeholder>
                );
              if (error) return null;
              return (
                <Swiper className="sub-banner-swiper" {...sub_banner_params}>
                  {data &&
                    data.allSubBanners &&
                    data.allSubBanners.slice(1).map((subBanner, i) => {
                      return (
                        <div key={i}>
                          <Grid
                            style={{
                              margin: 0,
                              height: 284,
                              padding: 0,
                              width: "100%",
                              backgroundImage:
                                "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                                subBanner.image +
                                "')",
                              backgroundSize: "cover",
                              backgroundPositionX: "right"
                            }}
                          >
                            <Container
                              style={{
                                marginTop: 25,
                                marginBottom: "auto",
                                padding: 0
                              }}
                            >
                              <div>{ReactHtmlParser(subBanner.content)}</div>
                              {subBanner.href ? (
                                <Button
                                  onClick={() => {
                                    subBanner.externalLink
                                      ? onClickBannerExternal(subBanner.href)
                                      : onClickBanner(subBanner.href);
                                  }}
                                  style={{
                                    marginTop: 20,
                                    borderRadius: 3,
                                    color: "rgb(35,35,35)",
                                    backgroundColor: "white"
                                  }}
                                >
                                  {subBanner.buttonText
                                    ? subBanner.buttonText
                                    : "더 알아보기"}
                                </Button>
                              ) : null}
                            </Container>
                          </Grid>
                        </div>
                      );
                    })}
                </Swiper>
              );
            }}
          </Query>
        </Grid.Row>

        <Grid.Row className="main-swiper" style={{ marginTop: 40 }}>
          <Container>
            <Header
              style={{
                textAlign: "left",
                marginLeft: 25,
                fontSize: 20,
                marginBottom: 28
              }}
            >
              마감 임박 프로젝트
            </Header>

            <Query query={HOT_PROJECT_QUERY}>
              {({ error, loading, data }) => {
                if (loading) return <Loader active inline="centered" />;
                if (error) return null;
                return (
                  <ProjectSwiper
                    projectList={data.allProjects.edges}
                    history={props.history}
                    swiperParams={params2}
                  />
                );
              }}
            </Query>
          </Container>
        </Grid.Row>
        <svg
          width="100%"
          height={12}
          style={{ padding: 0, marginTop: 26, marginBottom: 40 }}
        >
          <rect
            className="block-divider"
            width={"100%"}
            height={12}
            style={{ fill: "rgb(246,246,246)" }}
          />
        </svg>
        <Grid.Row className="main-swiper">
          <Container className="all-project">
            <Header
              style={{
                textAlign: "left",
                marginLeft: 25,
                fontSize: 20,
                marginBottom: 4
              }}
            >
              모든 프로젝트
            </Header>

            <Query query={ALL_PROJECT_QUERY}>
              {({ error, loading, data }) => {
                if (loading) return <Loader active inline="centered" />;
                if (error) return null;
                return (
                  <ProjectSwiper
                    projectList={shuffleArray(data.allProjects.edges)}
                    history={props.history}
                    swiperParams={params1}
                  />
                );
              }}
            </Query>
          </Container>
        </Grid.Row>
        {/* <Grid.Row style={{ fontWeight: "bold", verticalAlign: "middle" }}>
          프로젝트 더보기
          <i
            style={{ verticalAlign: "middle", paddingTop: 2.1 }}
            className="ri-arrow-right-s-line ri-lg"
          />
        </Grid.Row> */}
        {/* <svg
          width="100%"
          height={12}
          style={{ padding: 0, marginTop: 26, marginBottom: 40 }}
        >
          <rect
            className="block-divider"
            width={"100%"}
            height={12}
            style={{ fill: "rgb(246,246,246)" }}
          />
        </svg>
        <Grid.Row className="main-swiper">
          <Container>
            <Header
              style={{
                textAlign: "left",
                marginLeft: 25,
                fontSize: 20,
                marginBottom: 28
              }}
            >
              인기 프로젝트
            </Header>

            <Query query={HOT_PROJECT_QUERY}>
              {({ error, loading, data }) => {
                if (loading) return <Loader active inline="centered" />;
                if (error) return null;
                return (
                  <ProjectSwiper
                    projectList={data.allProjects.edges}
                    history={props.history}
                    swiperParams={params2}
                  />
                );
              }}
            </Query>
          </Container>
        </Grid.Row> */}
        {/* <Grid.Row style={{ fontWeight: "bold", verticalAlign: "middle" }}>
          프로젝트 더보기
          <i
            style={{ verticalAlign: "middle", paddingTop: 2.1 }}
            className="ri-arrow-right-s-line ri-lg"
          />
        </Grid.Row> */}
        {/* <svg
          width="100%"
          height={12}
          style={{ padding: 0, marginTop: 26, marginBottom: 40 }}
        >
          <rect
            className="block-divider"
            width={"100%"}
            height={12}
            style={{ fill: "rgb(246,246,246)" }}
          />
        </svg> */}
        {/* <Grid.Row>
        <Container>
          <Header>모든 프로젝트</Header>

          <Query query={PROJECT_QUERY}>
            {({ error, loading, data }) => {
              if (loading) return <Loader active inline="centered" />;
              if (error) return null;
              return (
                <div>
                  <Responsive
                    as={Card.Group}
                    className="card-list"
                    minWidth={1080}
                    itemsPerRow={4}
                  >
                    {data.allProjects.edges.map((project, i) => {
                      return <ProjectCard key={i} project={project.node} />;
                    })}
                  </Responsive>
                  <Responsive
                    as={Card.Group}
                    className="card-list"
                    maxWidth={1080}
                    itemsPerRow={2}
                  >
                    {data.allProjects.edges.map((project, i) => {
                      return <ProjectCard key={i} project={project.node} />;
                    })}
                  </Responsive>
                </div>
              );
            }}
          </Query>
        </Container>
      </Grid.Row> */}
        {/* <Query query={SUB_BANNER_QUERY}>
          {({ error, loading, data }) => {
            if (loading) return null;
            if (error) return null;
            return (
              <Grid.Row
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 0,
                  marginRight: 0
                }}
              >
                <Image
                  style={{ width: "100%" }}
                  src={
                    "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                    data.allSubBanners[1].image
                  }
                />
              </Grid.Row>
            );
          }}
        </Query> */}
        {/* <Grid.Row>
          <Container>
            <Header>인기 프로젝트</Header>
            <Query query={HOT_PROJECT_QUERY}>
              {({ error, loading, data }) => {
                if (loading) return <Loader active inline="centered" />;
                if (error) return null;
                return (
                  <div>
                    <Responsive
                      as={Card.Group}
                      className="card-list"
                      minWidth={1080}
                      itemsPerRow={4}
                    >
                      {data.allProjects.edges.map((project, i) => {
                        return <ProjectCard key={i} project={project.node} />;
                      })}
                    </Responsive>
                    <Responsive
                      as={Card.Group}
                      className="card-list"
                      maxWidth={1080}
                      itemsPerRow={2}
                    >
                      {data.allProjects.edges.map((project, i) => {
                        return <ProjectCard key={i} project={project.node} />;
                      })}
                    </Responsive>
                  </div>
                );
              }}
            </Query>
          </Container>
        </Grid.Row> */}
      </Grid>
      <BottomFixedMenu history={props.history} option="홈" />
    </div>
  );
};

export default Main;
