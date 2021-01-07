import React, { Component, useEffect, useState, useRef } from "react";
import {
  Container,
  Grid,
  Label,
  Button,
  Image,
  Divider
} from "semantic-ui-react";
import parse from "html-react-parser";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ProjectTestHeader from "./ProjectTestHeader";

const PROJECT = gql`
  query {
    project(id: 1) {
      id
      title
      coach {
        name
      }
      price
      like
      salePrice
      category {
        id
        category
      }
      place
      projectintro {
        id
        projectSpecial
        projectProcess
        projectTolearn
      }
      quizSet {
        question
        correctText
        wrongText
        quizoptionsSet {
          answer
          correct
        }
        curriculumSet {
          week
          content
        }
      }
      projectTime
      projectTerm
      maxCapacity
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

const FullpageProject = props => {
  const { error, loading, data } = useQuery(PROJECT);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [projectIndex, setProjectIndex] = useState(1);
  const [answer, setAnswer] = useState(0);
  const [curCorrect, setCurCorrect] = useState(false);
  const slideRef = useRef(null);

  useEffect(() => {
    console.log(slideRef.current);
  }, [activeIndex, projectIndex]);

  if (loading) return <div className="fullscreen" />;
  if (error) return <div className="fullscreen" />;

  if (data)
    return (
      <div className="fullscreen">
        <ProjectTestHeader
          history={props.history}
          project={data.project}
          setActiveIndex={setActiveIndex}
          setProjectIndex={setProjectIndex}
          activeIndex={activeIndex}
          projectIndex={projectIndex}
        />
        <div className="project-detail-slide-container" ref={slideRef}>
          <div
            className={
              (projectIndex === 1
                ? "project-detail-slide-active first"
                : "project-detail-slide") + (projectIndex === 2 ? " prev" : "")
            }
          >
            <Grid style={{ margin: 0 }}>
              <div
                onClick={() => {
                  setProjectIndex(projectIndex + 1);
                }}
                className="next-icon"
              >
                <Grid.Row>
                  <Image
                    src={require("../../img/point-to.png")}
                    style={{
                      width: 18,
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                  />
                </Grid.Row>
                <Grid.Row>NEXT</Grid.Row>
              </div>
              <div
                className="direct-pay"
                onClick={() => {
                  props.history.push("/fullpageproject");
                }}
              >
                <Grid.Row style={{ marginBottom: -6 }}>
                  <i class="ri-shopping-cart-2-line ri-2x"></i>
                </Grid.Row>
                <Grid.Row style={{ fontSize: 10 }}>바로결제</Grid.Row>
              </div>
              <Container>
                {parse(data.project.projectintro.projectProcess)}
              </Container>
            </Grid>
          </div>
          <div
            className={
              (projectIndex === 2
                ? "project-detail-slide-active"
                : "project-detail-slide") +
              (projectIndex === 1 ? " next" : "") +
              (activeIndex === 0 ? " prev" : "")
            }
          >
            <Grid style={{ margin: 0 }}>
              <div
                onClick={() => {
                  setProjectIndex(-1);
                  setActiveIndex(0);
                }}
                className="next-icon"
              >
                <Grid.Row>
                  <Image
                    src={require("../../img/point-to.png")}
                    style={{
                      width: 18,
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                  />
                </Grid.Row>
                <Grid.Row>NEXT</Grid.Row>
              </div>
              <div
                className="direct-pay"
                onClick={() => {
                  props.history.push("/fullpageproject");
                }}
              >
                <Grid.Row style={{ marginBottom: -6 }}>
                  <i class="ri-shopping-cart-2-line ri-2x"></i>
                </Grid.Row>
                <Grid.Row style={{ fontSize: 10 }}>바로결제</Grid.Row>
              </div>
              <Container>
                {parse(data.project.projectintro.projectTolearn)}
              </Container>
            </Grid>
          </div>
          <div
            className={
              (activeIndex === 0
                ? "quiz-start project-detail-slide-active"
                : "quiz-start project-detail-slide") +
              (activeIndex === 1 ? " prev" : "") +
              (projectIndex === 2 ? " next" : "")
            }
          >
            <Grid centered style={{ margin: 0 }}>
              <Container>
                <Grid.Row>
                  <Image
                    src={require("../../img/quizstart.png")}
                    style={{ padding: "0 20px 20px 20px" }}
                  />
                </Grid.Row>
                <Grid.Row style={{ marginTop: 24 }}>
                  <h2>넌센스 테스트테스트!</h2>
                </Grid.Row>
                <Grid.Row style={{ marginTop: 40 }}>
                  <Button
                    fluid
                    circular
                    basic
                    onClick={() => {
                      props.history.push("/fullpageproject");
                    }}
                  >
                    아니요, 바로 신청할게요.
                  </Button>
                </Grid.Row>
                <Grid.Row>
                  <Button
                    fluid
                    circular
                    color="black"
                    onClick={() => {
                      setActiveIndex(1);
                    }}
                  >
                    테스트 고고!
                  </Button>
                </Grid.Row>
              </Container>
            </Grid>
          </div>
          {data.project.quizSet.map((quiz, i) => {
            return (
              <>
                <div
                  className={
                    (activeIndex === 3 * i + 1
                      ? "quiz project-detail-slide-active"
                      : "quiz project-detail-slide") +
                    (activeIndex === 3 * i ? " next" : "") +
                    (activeIndex === 3 * i + 2 ? " prev" : "")
                  }
                >
                  <Grid centered style={{ margin: 0 }}>
                    <Container>
                      <Grid.Row>
                        <p style={{ fontSize: 24, fontWeight: "bold" }}>
                          Q{i + 1}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ fontSize: 24, fontWeight: "bold" }}>
                        {quiz.question}
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: 20, marginBottom: 35 }}>
                        <svg width="35" height="4">
                          <rect
                            width="35"
                            height="4"
                            style={{ fill: "rgb(53,53,53)" }}
                          />
                        </svg>
                      </Grid.Row>
                      <Grid.Row className="option-button-container">
                        {quiz.quizoptionsSet.map((options, j) => {
                          return (
                            <Grid.Row className={"option-button-" + j}>
                              <Button
                                fluid
                                basic
                                circular
                                onClick={() => {
                                  if (options.correct) {
                                    setCurCorrect(true);
                                    setAnswer(answer + 1);
                                  } else {
                                    setCurCorrect(false);
                                  }
                                  setActiveIndex(activeIndex + 1);
                                }}
                              >
                                {options.answer}
                              </Button>
                            </Grid.Row>
                          );
                        })}
                      </Grid.Row>
                    </Container>
                  </Grid>
                </div>
                <div
                  className={
                    (activeIndex === 3 * i + 2
                      ? "quiz-result project-detail-slide-active"
                      : "quiz-result project-detail-slide") +
                    (activeIndex === 3 * i + 1 ? " next" : "") +
                    (activeIndex === 3 * i + 3 ? " prev" : "")
                  }
                >
                  <Grid centered style={{ margin: 0 }}>
                    <Container>
                      <Grid.Row>
                        {curCorrect ? (
                          <Image
                            src={require("../../img/correctmark.png")}
                            style={{
                              width: 88,
                              marginLeft: "auto",
                              marginRight: "auto"
                            }}
                          />
                        ) : (
                          <Image
                            src={require("../../img/wrongmark.png")}
                            style={{
                              width: 88,
                              marginLeft: "auto",
                              marginRight: "auto"
                            }}
                          />
                        )}
                      </Grid.Row>
                      <Grid.Row
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          marginTop: 12
                        }}
                      >
                        {curCorrect ? "정답입니다" : "오답입니다"}
                      </Grid.Row>
                      <Grid.Row style={{ marginBottom: 110, marginTop: 32 }}>
                        {curCorrect
                          ? parse(quiz.correctText)
                          : parse(quiz.wrongText)}
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          fluid
                          color="black"
                          circular
                          onClick={() => {
                            setActiveIndex(activeIndex + 1);
                          }}
                        >
                          다음
                        </Button>
                      </Grid.Row>
                    </Container>
                  </Grid>
                </div>
                <div
                  className={
                    (activeIndex === 3 * i + 3
                      ? "curriculum project-detail-slide-active"
                      : "curriculum project-detail-slide") +
                    (activeIndex === 3 * i + 2 ? " next" : "") +
                    (activeIndex === 3 * i + 4 ? " prev" : "")
                  }
                >
                  <Grid style={{ margin: 0 }}>
                    <Container className="quiz-curriculum">
                      {quiz.curriculumSet.map((curriculum, j) => {
                        return (
                          <>
                            <Grid style={{ margin: 0 }} columns={2}>
                              <Grid.Row>
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
                                    paddingTop: 3
                                  }}
                                >
                                  주차에서는
                                  <br />
                                  이런 것들을 배워요
                                </Grid.Column>
                              </Grid.Row>
                              <svg width="35" height="4">
                                <rect
                                  width="35"
                                  height="4"
                                  style={{ fill: "rgb(53,53,53)" }}
                                />
                              </svg>
                              <Divider className="thin-90-divider" />
                              <Grid.Row style={{ marginBottom: 32 }}>
                                {parse(curriculum.content)}
                              </Grid.Row>
                            </Grid>
                          </>
                        );
                      })}

                      <Grid.Row style={{ marginTop: 40 }}>
                        <Button
                          fluid
                          basic
                          circular
                          onClick={() => {
                            setActiveIndex(activeIndex + 1);
                          }}
                        >
                          다음
                        </Button>
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          fluid
                          color="black"
                          circular
                          onClick={() => {
                            props.history.push("/fullpageproject");
                          }}
                        >
                          바로 신청 고
                        </Button>
                      </Grid.Row>
                    </Container>
                  </Grid>
                </div>
              </>
            );
          })}
          <div
            className={
              (activeIndex === 3 * data.project.quizSet.length + 1
                ? "total-result project-detail-slide-active"
                : "total-result project-detail-slide") +
              (activeIndex === 3 * data.project.quizSet.length ? " next" : "")
            }
          >
            <Grid centered style={{ margin: 0 }}>
              <Container>
                <Grid.Row>
                  <Image
                    src={require("../../img/quizresult.png")}
                    style={{
                      width: 133,
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                  />
                </Grid.Row>
                <Grid.Row>
                  <div style={{ fontSize: 48, fontWeight: "bold" }}>
                    {answer}/{data.project.quizSet.length}
                  </div>
                </Grid.Row>
                <Grid.Row
                  style={{
                    marginTop: 38,
                    marginBottom: 108,
                    fontSize: 24,
                    fontWeight: "bold"
                  }}
                >
                  {data.project.quizSet.length}문제 중 {answer}문제를
                  맞추셨네요!
                </Grid.Row>

                <Grid.Row>
                  <Button
                    fluid
                    circular
                    basic
                    onClick={() => {
                      setAnswer(0);
                      setActiveIndex(0);
                    }}
                    style={{ marginTop: 4, marginBottom: 4 }}
                  >
                    다시 풀기
                  </Button>
                  <Button
                    fluid
                    circular
                    color="black"
                    onClick={() => {
                      props.history.push("/fullpageproject");
                    }}
                    style={{ marginTop: 4, marginBottom: 4 }}
                  >
                    신청페이지로 이동
                  </Button>
                </Grid.Row>
              </Container>
            </Grid>
          </div>
        </div>
      </div>
    );
};

export default FullpageProject;
