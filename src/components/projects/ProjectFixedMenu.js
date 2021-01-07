import React, { Component } from "react";
import {
  Rail,
  Sticky,
  Card,
  Grid,
  Label,
  Divider,
  Progress,
  Message,
  Icon,
  Button,
  Responsive
} from "semantic-ui-react";
import LikeButton from "./LikeButton";
import ApplyButton from "./ApplyButton";
import KakaoLink from "./KakaoLink";

function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ProjectFixedMenu = props => {
  return (
    <Responsive
      as={Rail}
      position="right"
      minWidth={1080}
      style={{ paddingLeft: 0 }}
    >
      <Sticky context={props.context} style={{ minWidth: 400, marginTop: 30 }}>
        <Card
          raised
          style={{
            minWidth: 400
          }}
        >
          <Card.Content style={{ padding: 20 }}>
            <Grid.Row>
              <Label as="a" basic>
                8주플랜
              </Label>
              <Label as="a" basic>
                정원12명
              </Label>
            </Grid.Row>
            <Card.Header
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10
              }}
            >
              {props.project.title}
            </Card.Header>
            <Card.Description>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={9}>
                    {props.project.coach.name} 코치
                  </Grid.Column>
                  <Grid.Column
                    width={7}
                    style={{ fontWeight: "bold", fontSize: 24 }}
                  >
                    {numberFormat(props.project.price)}원
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Description>
            <Divider />
            <Card.Description>
              <Grid style={{ margin: 0 }}>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Icon name="trophy" size="large" color="yellow" />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Grid.Row
                      style={{
                        fontWeight: "bold",
                        marginBottom: 5
                      }}
                    >
                      프로젝트 목표
                    </Grid.Row>
                    <Grid.Row>{props.project.projectGoal}</Grid.Row>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Description>
            <Grid
              style={{
                marginLeft: -20,
                marginRight: -20,
                marginTop: 0,
                marginBottom: 0,
                background: "linear-gradient(to right,#eb4c2a, #f75454 )",
                color: "white",
                padding: 15
              }}
            >
              <Grid.Row>
                <Grid.Column width={6}>
                  <Icon name="clock outline" />
                  <strong>강의 시간</strong>
                  <div>17시 ~ 19시</div>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Icon name="calendar alternate outline" />
                  <strong>요일</strong>{" "}
                  <div>{props.project.projectDayinweek}요일</div>
                </Grid.Column>
                <Grid.Column width={4} verticalAlign="middle">
                  <Icon name="users" />
                  <strong>정원</strong>{" "}
                  <div>최대 {props.project.maxCapacity}명</div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={6}>
                  <Icon inverted name="battery quarter" />
                  <strong>난이도</strong> <div>{props.project.difficulty}</div>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Icon name="map marker alternate" />
                  <strong>위치</strong> <div>{props.project.place}</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Progress
              style={{
                color: "#eb4c2a",
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 10,
                marginTop: 40,
                opacity: 0.8
              }}
              color="red"
              size="tiny"
              active
              percent={72}
            >
              5명 남음
            </Progress>
            <Grid style={{ margin: -3 }}>
              <Grid.Row
                columns={2}
                style={{
                  paddingBottom: 3
                }}
              >
                <Grid.Column style={{ padding: 3, paddingRight: 5 }}>
                  <LikeButton project={props.id} />
                </Grid.Column>
                <Grid.Column style={{ padding: 3, paddingLeft: 5 }}>
                  <KakaoLink />
                </Grid.Column>
                {/* <Grid.Column style={{ padding: 3 }}>
                  <Button fluid>
                    <Icon name="question circle outline" />
                    문의하기
                  </Button>
                </Grid.Column> */}
              </Grid.Row>
              <Grid.Row
                style={{
                  paddingTop: 3,
                  paddingLeft: 3,
                  paddingBottom: 0
                }}
              >
                <ApplyButton
                  id={props.id}
                  project={props.project}
                  history={props.history}
                />
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
        <Message>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <Message.Header>궁금한게 있으신가요?</Message.Header>
                <p style={{ fontSize: 12 }}>
                  직접 문의할 것이 있으시면 연락주세요.
                </p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Button
                  fluid
                  style={{
                    backgroundColor: "#353535",
                    color: "white"
                  }}
                >
                  <Icon name="question circle outline" />
                  문의하기
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message>
      </Sticky>
    </Responsive>
  );
};

export default ProjectFixedMenu;
