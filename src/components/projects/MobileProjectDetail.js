import React, { useState, useEffect } from "react";
import {
  Rail,
  Sticky,
  Card,
  Grid,
  Label,
  Divider,
  Progress,
  Header,
  Message,
  Icon,
  Button,
  Responsive,
  Image
} from "semantic-ui-react";
import LikeButton from "./LikeButton";
import ApplyButton from "./ApplyButton";
import KakaoLink from "./KakaoLink";
import ChannelService from "../utility/ChannelService";

function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toDate(date) {
  var t = new Date(date); // Epoch
  t = t.getMonth() + 1 + "월 " + t.getDate() + "일";
  return t;
}

function getWeekDay(date) {
  var t = new Date(date);
  t = t.getDay();
  if (t == 1) {
    return "월";
  } else if (t == 2) {
    return "화";
  } else if (t == 3) {
    return "수";
  } else if (t == 4) {
    return "목";
  } else if (t == 5) {
    return "금";
  } else if (t == 6) {
    return "토";
  } else {
    return "일";
  }
}

const MobileProjectDetail = props => {
  const [weekDay, setWeekDay] = useState([]);
  var weekDayTemp = [];
  useEffect(() => {
    props.project &&
      props.project.classes &&
      props.project.classes.map(classes => {
        weekDayTemp.push(getWeekDay(classes.startDate));
      });
    setWeekDay(weekDayTemp);
  }, []);
  const onClickChannelTalk = () => {
    window.ChannelIO("show");
  };

  return (
    <div>
      {/* <Header
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 10
        }}
      >
        {props.project.title}
      </Header>

      <Grid style={{ margin: 0 }}>
        <Grid.Row
          style={{
            fontWeight: "bold",
            marginBottom: 5,
            paddingBottom: 0
          }}
        >
          <Image
            src={require("../../img/award.png")}
            style={{
              width: 16,
              height: 16,
              verticalAlign: "middle",
              marginRight: 8
            }}
          />{" "}
          프로젝트 목표
        </Grid.Row>
        <Grid.Row style={{ paddingTop: 0 }}>
          {props.project.projectGoal}
        </Grid.Row>
      </Grid> */}
      <Grid style={{ margin: 0 }}>
        <Grid.Row
          style={{
            fontSize: 10,
            paddingBottom: 0,
            fontWeight: "bold",
            paddingTop: 16
          }}
        >
          <a style={{ color: "#ff7878" }}>
            {parseInt(
              (props.project.salePrice /
                (props.project.price + props.project.salePrice)) *
                100
            )}
            % 할인
          </a>
          <span
            style={{
              color: "#7f7f7f",
              textDecoration: "line-through",
              marginLeft: 5
            }}
          >
            {numberFormat(props.project.price + props.project.salePrice)}원
          </span>
        </Grid.Row>
        <Grid.Row style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Header style={{ fontSize: 26, fontWeight: 500 }}>
            {numberFormat(props.project.price)}원
          </Header>
          <span
            style={{
              marginLeft: 12,
              fontSize: 8,
              color: "#7f7f7f",
              lineHeight: 1.4
            }}
          >
            <div>5개월(무) 적용 시</div>
            <div>월 {numberFormat(parseInt(props.project.price / 5))}원</div>
          </span>
        </Grid.Row>
      </Grid>
      <Divider style={{ margin: "0 -25px 5px -25px" }} />
      <Grid
        style={{
          marginTop: 0,
          marginBottom: 0,
          padding: 15
        }}
      >
        <Grid.Row style={{ paddingTop: 0 }}>
          <Header style={{ fontSize: 16 }}>프로젝트 정보</Header>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail">
          <Grid.Column width={5} style={{ paddingLeft: 0 }}>
            <i className="ri-stack-line ri-xl"></i>
            <strong> 기간</strong>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div>{props.project.projectTermDetail}</div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail">
          <Grid.Column width={5} style={{ paddingLeft: 0 }}>
            <i className="ri-calendar-check-line ri-xl"></i>
            <strong> 시작일자</strong>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingLeft: 0 }}>
            <div>
              {props.project.classes.map((classes, i) => {
                return (
                  <Label
                    basic
                    style={{
                      marginRight: 20,
                      border: "none",
                      fontWeight: "normal",
                      fontSize: 14,
                      padding: 0
                    }}
                  >
                    {toDate(classes.startDate) +
                      "(" +
                      getWeekDay(classes.startDate) +
                      ")"}
                  </Label>
                );
              })}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail">
          <Grid.Column width={5} style={{ paddingRight: 0, paddingLeft: 0 }}>
            <i className="ri-calendar-event-line ri-xl"></i>
            <strong> 요일</strong>
          </Grid.Column>
          <Grid.Column
            className="weekday-label"
            width={11}
            style={{ paddingRight: 0, paddingLeft: 0 }}
          >
            <Label
              circular
              basic={weekDay.includes("월") ? false : true}
              color={weekDay.includes("월") ? "red" : null}
            >
              월
            </Label>
            <Label
              circular
              basic={weekDay.includes("화") ? false : true}
              color={weekDay.includes("화") ? "red" : null}
            >
              화
            </Label>
            <Label
              circular
              basic={weekDay.includes("수") ? false : true}
              color={weekDay.includes("수") ? "red" : null}
            >
              수
            </Label>
            <Label
              circular
              basic={weekDay.includes("목") ? false : true}
              color={weekDay.includes("목") ? "red" : null}
            >
              목
            </Label>
            <Label
              circular
              basic={weekDay.includes("금") ? false : true}
              color={weekDay.includes("금") ? "red" : null}
            >
              금
            </Label>
            <Label
              circular
              basic={weekDay.includes("토") ? false : true}
              color={weekDay.includes("토") ? "red" : null}
            >
              토
            </Label>
            <Label
              circular
              basic={weekDay.includes("일") ? false : true}
              color={weekDay.includes("일") ? "red" : null}
            >
              일
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail" style={{ paddingTop: 9 }}>
          <Grid.Column width={5} style={{ paddingLeft: 0 }}>
            <i className="ri-timer-2-line ri-xl"></i>
            <strong> 시간</strong>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingLeft: 0 }}>
            <div>{props.project.projectTime}</div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail">
          <Grid.Column width={5} style={{ paddingLeft: 0 }}>
            <i className="ri-group-line ri-xl"></i>
            <strong> 최소 정원</strong>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingLeft: 0 }}>
            <div>{props.project.minCapacity}명</div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="mobile-project-detail">
          <Grid.Column width={5} style={{ paddingLeft: 0 }}>
            <i className="ri-map-pin-4-line ri-xl"></i>
            <strong> 장소</strong>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingLeft: 0 }}>
            <div>{props.project.place}</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider
        style={{
          marginTop: 0,
          marginBottom: 6,
          marginLeft: -25,
          marginRight: -25
        }}
      />
      <Grid style={{ margin: -3 }}>
        <Grid.Row
          columns={2}
          style={{
            paddingBottom: 3
          }}
        >
          <Grid.Column style={{ padding: "3px 4px 3px 0px" }}>
            <LikeButton
              like={props.like}
              onChangeLike={props.onChangeLike}
              project={props.id}
              history={props.history}
            />
          </Grid.Column>
          <Grid.Column style={{ padding: "3px 0px 3px 4px" }}>
            <KakaoLink project={props.project} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ paddingTop: 2 }}>
          <Button
            fluid
            onClick={onClickChannelTalk}
            style={{
              color: "white",
              backgroundColor: "rgb(53,53,53)",
              margin: 0
            }}
          >
            <i
              class="ri-questionnaire-line ri-lg"
              style={{ marginRight: 10 }}
            ></i>
            문의하기
          </Button>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default MobileProjectDetail;
