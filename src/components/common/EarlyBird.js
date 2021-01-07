import React, { useEffect } from "react";
import {
  Grid,
  Container,
  Header,
  Loader,
  Responsive,
  Card
} from "semantic-ui-react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ProjectCard from "../projects/ProjectCard";
import MainHeader from "./MainHeader";
import FixHeader from "./FixHeader";
import BottomFixedMenu from "./BottomFixedMenu";
import Countdown from "react-countdown";

const PROJECT_QUERY = gql`
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

const EarlyBird = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  var date = new Date("2020-03-22");
  // console.log(date.getTime());
  // console.log(Date.now());

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <div>
      <FixHeader />
      <MainHeader history={props.history} option="얼리버드" />
      <Grid
        className="early-bird"
        style={{
          margin: 0,
          backgroundSize: "cover",
          backgroundPositionX: "center",
          width: "100%",
          height: 254
        }}
      >
        <Container style={{ color: "white", fontSize: 12 }}>
          <div
            style={{
              marginTop: 65,
              marginBottom: "auto",
              backgroundColor: "rgba(242, 174, 143, 0.85)",
              border: "10px solid rgba(242, 174, 143, 0.1)",
              boxShadow: "0 0 30px 20px rgba(242, 174, 143, 0.99)",
              verticalAlign: "middle",
              borderRadius: 10
            }}
          >
            빨리 일어나는 새가 벌레는 잡는다
            <div style={{ fontSize: 30, fontWeight: "bold", marginTop: 4 }}>
              얼리버드 할인전
            </div>
          </div>
        </Container>
      </Grid>
      <Countdown
        date={tomorrow}
        renderer={props => (
          <Container
            className="early-bird-timer"
            style={{ width: "100%", height: 98, marginTop: -73 }}
          >
            <Grid centered style={{ margin: 0 }}>
              <Grid.Row
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "white",
                  paddingBottom: 8,
                  paddingTop: 12
                }}
              >
                늦기 전에 신청하세요
              </Grid.Row>
              <Grid.Row style={{ fontSize: 12, color: "white", paddingTop: 0 }}>
                <div className="early-bird-timer-font">
                  <p style={{ marginTop: 2.2 }}>{props.hours}</p>
                </div>
                <div
                  style={{
                    marginLeft: 6,
                    marginRight: 6,
                    marginTop: "auto"
                  }}
                >
                  시간
                </div>
                <div className="early-bird-timer-font">
                  <p style={{ marginTop: 2.2 }}>{props.minutes}</p>
                </div>
                <div
                  style={{ marginLeft: 6, marginRight: 6, marginTop: "auto" }}
                >
                  분
                </div>
                <div className="early-bird-timer-font">
                  <p style={{ marginTop: 2.2 }}>{props.seconds}</p>
                </div>
                <div style={{ marginLeft: 6, marginTop: "auto" }}>초</div>
              </Grid.Row>
            </Grid>
          </Container>
        )}
      />
      <Grid style={{ margin: 0, marginTop: 40 }}>
        <Grid.Row>
          <Grid.Row>
            <Container>
              <Header>금주 얼리버드 할인 프로젝트</Header>
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
                          date = new Date(project.node.earlybirdDue);
                          if (
                            Date.now() <=
                            date.getTime() + 24 * 60 * 60 * 1000
                          ) {
                            return (
                              <ProjectCard
                                history={props.history}
                                key={i}
                                project={project.node}
                              />
                            );
                          }
                        })}
                      </Responsive>
                      <Responsive
                        as={Card.Group}
                        className="card-list"
                        maxWidth={1080}
                        itemsPerRow={2}
                      >
                        {data.allProjects.edges.map((project, i) => {
                          date = new Date(project.node.earlybirdDue);
                          if (
                            Date.now() <=
                            date.getTime() + 24 * 60 * 60 * 1000
                          ) {
                            return (
                              <ProjectCard
                                history={props.history}
                                key={i}
                                project={project.node}
                              />
                            );
                          }
                        })}
                      </Responsive>
                    </div>
                  );
                }}
              </Query>
            </Container>
          </Grid.Row>
        </Grid.Row>
      </Grid>
      <BottomFixedMenu history={props.history} option="홈" />
    </div>
  );
};

export default EarlyBird;
