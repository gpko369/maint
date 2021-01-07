import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Divider,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import TempKakaoLogin from "./TempKakaoLogin";
import TempFacebookLoginButton from "./TempFacebookLoginButton";
import TempSimpleEmailLogin from "./TempSimpleEmailLogin";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
      rUser {
        id
        name
      }
    }
  }
`;

const TempLoginComponent = props => {
  const [loginComponentState, setLoginComponentState] = useState(true);
  const [login, { data, error }] = useMutation(LOGIN_MUTATION);

  const changeToRegister = () => {
    setLoginComponentState(false);
  };

  const changeToLogin = () => {
    setLoginComponentState(true);
  };

  const handleLogin = e => {
    if (data) {
      props.history.push({
        pathname: "/saebaecoupon"
      });
    } else {
      alert("아이디 혹은 비밀번호가 잘못되었습니다.");
    }
  };

  useEffect(() => {
    if (data || error) {
      handleLogin();
    }
  }, [data, error]);

  return (
    <Grid.Row
      textAlign="center"
      style={{ marginTop: 80, marginBottom: "auto" }}
    >
      <Image
        style={{ padding: "0 25pt 0 25pt" }}
        src="https://s3.ap-northeast-2.amazonaws.com/maint.img/media/etc/group13%403x.png"
      />
      <svg width="100%" height={25} style={{ marginTop: 50 }}>
        <rect
          x={"calc(50% - 28px)"}
          width={56}
          height={4}
          style={{ color: "rgb(53,53,53)" }}
        />
      </svg>

      <Header as="h1" textAlign="center">
        환영합니다!
      </Header>
      <Header
        textAlign="center"
        as="h3"
        style={{
          marginTop: 0,
          fontWeight: "normal",
          fontSize: "14px",
          marginBottom: 85
        }}
      >
        간편하게 SNS로 가입하고, 마인트와 함께 프로젝트를 도전해보세요!
      </Header>

      {loginComponentState ? (
        <div>
          <TempKakaoLogin history={props.history} />
          <TempFacebookLoginButton history={props.history} />
          <Divider horizontal>또는</Divider>
          <Button basic fluid size="large" onClick={changeToRegister}>
            <Image
              style={{ height: 28, width: 28, marginRight: 20, color: "black" }}
              src={require("../../img/mail_icon.png")}
              avatar
            />
            <span>이메일로 간편가입하기</span>
          </Button>
          <Grid centered>
            <Grid.Row style={{ marginTop: 10, opacity: 0.9, fontSize: 13 }}>
              이미 계정이 있나요?{" "}
              <a
                href={"/saebaecoupon/login"}
                style={{
                  color: "#353535",
                  fontWeight: 700,
                  marginLeft: 20
                }}
              >
                {" "}
                로그인하기
              </a>
            </Grid.Row>
          </Grid>
        </div>
      ) : (
        <div>
          <Header
            as="p"
            style={{ fontSize: 14, cursor: "pointer" }}
            onClick={changeToLogin}
          >
            <i
              className="ri-arrow-left-line"
              style={{
                height: 16,
                fontSize: 16,
                verticalAlign: "middle",
                marginRight: 5
              }}
            ></i>
            돌아가기
          </Header>
          <TempSimpleEmailLogin history={props.history} />
        </div>
      )}
    </Grid.Row>
  );
};

export default TempLoginComponent;
