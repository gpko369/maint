import React, { useState, useEffect } from "react";
import {
  Header,
  Card,
  Image,
  Grid,
  Form,
  Button,
  Container,
  Input,
  Responsive,
  Menu,
  Divider
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import MyProfileSetting from "./MyProfileSetting";
import ChannelService from "../../utility/ChannelService";

const LOGOUT_MUTATION = gql`
  mutation {
    logoutToken {
      message
    }
  }
`;

const MySetting = props => {
  const [logout, { error, loading, data }] = useMutation(LOGOUT_MUTATION);

  const personalOptions = [
    {
      name: "개인 정보",
      icon: <i value="/mypage/profile" class="ri-profile-line ri-xl"></i>,
      link: "/mypage/profile"
    },
    {
      name: "결제 내역",
      icon: <i value="/mypage/profile" class="ri-file-list-3-line ri-xl"></i>,
      link: "/mypage/payment"
    },
    {
      name: "포인트 및 쿠폰 관리",
      icon: <i value="/mypage/profile" class="ri-coupon-3-line ri-xl"></i>,
      link: "/mypage/coupon"
    }
  ];

  const supportOptions = [
    {
      name: "서비스 약관",
      icon: <i value="/mypage/profile" class="ri-newspaper-line ri-xl"></i>,
      link: "/agreement"
    }
  ];

  const [options, setOptions] = useState(personalOptions);

  const onClickOption = link => {
    props.history.push(link);
  };

  const onClickExternalLink = link => {
    window.open(link);
  };

  useEffect(() => {
    ChannelService.boot({
      pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a",
      hideDefaultLauncher: true
    });
  }, []);

  const onClickChannelTalk = () => {
    window.ChannelIO("show");
  };

  const onClickLogout = () => {
    logout();
  };

  useEffect(() => {
    if (data) {
      if (data.logoutToken.message) {
        props.history.push("/");
        window.location.reload();
      }
    }
  }, [data]);

  return (
    <div>
      <Container>
        <Grid style={{ margin: "0 -25px" }} columns={2}>
          <Grid.Row
            style={{
              paddingBottom: 0,
              paddingTop: 34,
              paddingLeft: 25,
              fontSize: 12,
              color: "rgb(190,190,190)",
              fontWeight: "bold"
            }}
          >
            개인 설정
          </Grid.Row>
          {options.map((option, i) => {
            return (
              <Grid.Row
                onClick={() => onClickOption(option.link)}
                link={option.link}
                style={{
                  borderBottom: "0.5px solid rgb(211,211,211)",
                  padding: "24px 11px"
                }}
              >
                <Grid.Column value={option.link} style={{ fontSize: 14 }}>
                  {option.name}
                </Grid.Column>
                <Grid.Column value={option.link} textAlign="right">
                  {option.icon}
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
        <Grid style={{ margin: -25, marginTop: 0 }} columns={2}>
          <Grid.Row
            style={{
              paddingBottom: 0,
              paddingTop: 55,
              paddingLeft: 25,
              fontSize: 12,
              color: "rgb(190,190,190)",
              fontWeight: "bold"
            }}
          >
            지원 센터
          </Grid.Row>
          <Grid.Row
            onClick={() =>
              onClickExternalLink("https://forms.gle/sCqnDBVE7quHZNBY8")
            }
            style={{
              borderBottom: "0.5px solid rgb(211,211,211)",
              padding: "24px 11px"
            }}
          >
            <Grid.Column style={{ fontSize: 14 }}>코치 지원하기</Grid.Column>
            <Grid.Column textAlign="right">
              <i value="/mypage/profile" class="ri-service-line ri-xl"></i>
            </Grid.Column>
          </Grid.Row>
          {supportOptions.map((option, i) => {
            return (
              <Grid.Row
                onClick={() => onClickOption(option.link)}
                link={option.link}
                style={{
                  borderBottom: "0.5px solid rgb(211,211,211)",
                  padding: "24px 11px"
                }}
              >
                <Grid.Column value={option.link} style={{ fontSize: 14 }}>
                  {option.name}
                </Grid.Column>
                <Grid.Column value={option.link} textAlign="right">
                  {option.icon}
                </Grid.Column>
              </Grid.Row>
            );
          })}
          <Grid.Row
            style={{
              borderBottom: "0.5px solid rgb(211,211,211)",
              padding: "24px 11px"
            }}
            onClick={onClickChannelTalk}
          >
            <Grid.Column style={{ fontSize: 14 }}>
              서비스 피드백 남기기
            </Grid.Column>
            <Grid.Column textAlign="right">
              <i value="/mypage/profile" class="ri-feedback-line ri-xl"></i>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            style={{
              padding: "24px 11px"
            }}
            onClick={onClickLogout}
          >
            <Grid.Column
              style={{ fontSize: 14, color: "#eb4c2a", fontWeight: "bold" }}
            >
              로그아웃
            </Grid.Column>
            <Grid.Column textAlign="right">
              <i className="ri-login-box-line ri-xl"></i>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default MySetting;
