import React, { createRef, useState, useEffect, Fragment } from "react";
import {
  Grid,
  Image,
  Ref,
  Segment,
  Sticky,
  Container,
  Menu,
  Divider,
  Responsive,
  Rail,
  Icon,
  Header,
  Label
} from "semantic-ui-react";
import { Link, Element } from "react-scroll";
import { Query } from "react-apollo";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ReactPixel from "react-facebook-pixel";
import ReactHtmlParser from "react-html-parser";
import ProjectFixedMenu from "./ProjectFixedMenu";
import MobileProjectFixedMenu from "./MobileProjectFixedMenu";
import MobileProjectDetail from "./MobileProjectDetail";
import ProjectHeader from "./ProjectHeader";
import RecommendSwiper from "./RecommendSwiper";
import ReactHelmet from "../utility/ReactHelmet";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const PROJECT_INFO = gql`
  query projectInfo($id: ID!) {
    project(id: $id) {
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
      place
      projectintro {
        id
        projectSpecial
        projectProcess
        projectTolearn
      }
      projectTime
      projectTerm
      projectTermDetail
      classes {
        id
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

//개별 프로젝트 노출 컴포넌트
const Project = ({ match, history }) => {
  const [activeMenu, setActiveMenu] = useState("intro");

  const onClickMenu = menu => {
    setActiveMenu(menu);
  };

  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    ReactPixel.fbq("track", "ViewContent", { projectID: match.params.id });
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     setIsLike(data.project.like);
  //   }
  // }, [data]);

  const onChangeIsLike = value => {
    if (value) {
      setIsLike(value);
    } else {
      setIsLike(!isLike);
    }
  };

  const contextRef = createRef();

  // if (error) {
  //   if (
  //     error.message === "GraphQL error: Project matching query does not exist."
  //   ) {
  //     alert("삭제되었거나 존재하지 않는 프로젝트입니다.");
  //     history.goBack();
  //   } else if (
  //     error.message ===
  //     "Network error: Unexpected token < in JSON at position 1"
  //   ) {
  //     window.location.reload();
  //   }
  // }
  // if (loading) return <Loader active inline="centered" />;

  const id = match.params.id;

  return (
    <Query query={PROJECT_INFO} variables={{ id: match.params.id }}>
      {({ error, loading, data }) => {
        if (error) {
          if (
            error.message ===
            "GraphQL error: Project matching query does not exist."
          ) {
            alert("삭제되었거나 존재하지 않는 프로젝트입니다.");
            history.goBack();
          } else {
            return null;
          }
        }
        if (loading) return null;
        if (data) {
          setIsLike(data.project.like);
          return (
            <div>
              <ReactHelmet
                keywords={
                  data.project.title + ", " + data.project.category.category
                }
                title={"마인트 | " + data.project.title}
                description={data.project.projectGoal}
                image={data.project.titleImageUrl}
              />
              <Container className="project-detail" style={{ width: 1080 }}>
                <Ref innerRef={contextRef}>
                  <div>
                    {/* <Responsive
                  as={Segment}
                  minWidth={1080}
                  basic
                  style={{ marginRight: 440 }}
                >
                  <Container style={{ marginTop: 17, width: 620 }}>
                    <Image
                      src={
                        "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                        data.project.titleImage
                      }
                    />
                    <Sticky context={contextRef}>
                      <Menu
                        pointing
                        secondary
                        attached="top"
                        tabular
                        style={{
                          backgroundColor: "#fff",
                          paddingTop: "1em",
                          marginBottom: 50,
                          borderRadius: 0
                        }}
                      >
                        <Menu.Item as="a" active name="소개" />
                        <Menu.Item as="a" active={false} name="프로젝트" />
                        <Menu.Item
                          as="a"
                          href="#this"
                          active={false}
                          name="레슨"
                        />
                      </Menu>
                    </Sticky>
                    {ReactHtmlParser(data.project.projectintro.projectSpecial)}
                    <Icon
                      circular
                      inverted
                      color="grey"
                      size="massive"
                      name="instagram"
                      loading
                    />
                    <Divider />
                    {ReactHtmlParser(data.project.projectintro.projectProcess)}
                    <Divider />
                    {ReactHtmlParser(data.project.projectintro.projectTolearn)}
                    <Divider />
                    {ReactHtmlParser(
                      data.project.projectintro.projectAcquisition
                    )}
                    <Divider />
                    {ReactHtmlParser(
                      data.project.projectintro.projectRecommend
                    )}
                    <Divider />
                    {ReactHtmlParser(data.project.curriculum[0].content)}
                  </Container>
                  <ProjectFixedMenu
                    project={data.project}
                    id={id}
                    context={contextRef}
                    history={history}
                  />
                </Responsive> */}
                    <Responsive
                      as={Segment}
                      style={{ padding: 0, marginLeft: -25, marginRight: -25 }}
                      basic
                    >
                      <div
                        style={{
                          width: "100%",
                          backgroundImage:
                            "url('" + data.project.titleImageUrl + "')",
                          backgroundSize: "cover",
                          backgroundPositionX: "center",
                          height: 468
                        }}
                      >
                        <ProjectHeader
                          history={history}
                          project={data.project}
                        />
                        <div style={{ height: 156 }}></div>
                        <div
                          style={{
                            width: "100%",
                            height: 248,
                            verticalAlign: "bottom",
                            background:
                              "linear-gradient(to top, rgba(0,0,0, 0.80), rgba(0,0,0,0.40), rgba(0,0,0,0.0))"
                          }}
                        >
                          <Container
                            style={{
                              color: "white",
                              paddingTop: 120
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
                      </div>

                      {/* <Image
                    style={{
                      width: "100%",
                      marginBottom: 20
                    }}
                    src={
                      "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                      data.project.titleImage
                    }
                  /> */}
                      <Container>
                        <MobileProjectDetail
                          project={data.project}
                          id={id}
                          history={history}
                          like={isLike}
                          onChangeLike={onChangeIsLike}
                        />
                      </Container>

                      <Sticky context={contextRef}>
                        <Menu
                          pointing
                          secondary
                          widths={4}
                          className="project-detail-menu"
                          attached="top"
                          tabular
                          style={{
                            backgroundColor: "#fff",
                            paddingTop: "1em",
                            marginBottom: 50
                          }}
                        >
                          <Menu.Item
                            active={activeMenu === "intro"}
                            style={{ width: "18%" }}
                            name="소개"
                          >
                            <Link
                              spy={true}
                              activeClass="active"
                              offset={-42}
                              onSetActive={() => onClickMenu("intro")}
                              to="intro"
                            >
                              소개
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            active={activeMenu === "coach-intro"}
                            name="코치"
                            style={{ width: "18%" }}
                          >
                            <Link
                              spy={true}
                              onSetActive={() => onClickMenu("coach-intro")}
                              offset={-25}
                              activeClass="active"
                              to="coach-intro"
                            >
                              코치
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            active={activeMenu === "project-intro"}
                            name="프로젝트"
                            style={{ width: "23%" }}
                          >
                            <Link
                              spy={true}
                              onSetActive={() => onClickMenu("project-intro")}
                              offset={-25}
                              activeClass="active"
                              to="project-intro"
                            >
                              프로젝트
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            active={activeMenu === "curriculum"}
                            name="커리큘럼"
                            style={{ width: "23%" }}
                          >
                            <Link
                              spy={true}
                              onSetActive={() => onClickMenu("curriculum")}
                              activeClass="active"
                              to="curriculum"
                            >
                              커리큘럼
                            </Link>
                          </Menu.Item>
                          <Menu.Item
                            active={activeMenu === "recommend-project"}
                            name="추천"
                            style={{ width: "18%" }}
                          >
                            <Link
                              spy={true}
                              onSetActive={() =>
                                onClickMenu("recommend-project")
                              }
                              activeClass="active"
                              offset={-35}
                              to="recommend-project"
                            >
                              추천
                            </Link>
                          </Menu.Item>
                        </Menu>
                      </Sticky>
                      <Container>
                        <div className="project-detail-content">
                          <Element activeClass="active" name="intro">
                            {ReactHtmlParser(
                              data.project.projectintro.projectSpecial
                            )}
                          </Element>
                          <Element activeClass="active" name="coach-intro">
                            {ReactHtmlParser(
                              data.project.projectintro.projectProcess
                            )}
                          </Element>
                          <Element activeClass="active" name="project-intro">
                            {ReactHtmlParser(
                              data.project.projectintro.projectTolearn
                            )}
                          </Element>
                          <Element
                            activeClass="active"
                            name="curriculum"
                            style={{ paddingTop: 90, marginTop: -50 }}
                          >
                            {ReactHtmlParser(
                              data.project.curriculum[0].content
                            )}
                          </Element>
                        </div>
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
                      <Element activeClass="active" name="recommend-project">
                        <RecommendSwiper
                          categoryProject={data.project.category}
                          history={history}
                        />
                      </Element>
                    </Responsive>
                  </div>
                </Ref>
              </Container>
              <MobileProjectFixedMenu
                project={data.project}
                id={id}
                history={history}
                like={isLike}
                onChangeLike={onChangeIsLike}
              />
            </div>
          );
        }
      }}
    </Query>
  );
};

export default Project;
