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
import KakaoLogin from "./KakaoLogin";
import FacebookLoginButton from "./FacebookLoginButton";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
      rUser {
        id
        name
        phoneNumber
      }
    }
  }
`;

const LoginComponent = props => {
  const [login, { data, error }] = useMutation(LOGIN_MUTATION);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  const onClickSignUpLink = () => {
    if (props.nextPath) {
      props.history.push({
        pathname: "/signup",
        nextPath: props.nextPath
      });
    } else {
      props.history.push("/signup");
    }
  };

  const onClickLogin = () => {
    login({ variables: { email: email, password: password } });
  };

  const handleLogin = e => {
    if (data) {
      if (props.nextPath) {
        if (!data.tokenAuth.rUser.phoneNumber) {
          props.history.push({
            pathname: "/signup",
            nextPath: props.nextPath
          });
        } else {
          props.history.push({
            pathname: props.nextPath
          });
        }
      } else if (!data.tokenAuth.rUser.phoneNumber) {
        props.history.push("/signup");
      } else {
        props.history.push("/");
        window.location.reload();
      }
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
    <Grid.Row textAlign="center" style={{ marginTop: 0, marginBottom: "auto" }}>
      <Header
        as="h1"
        textAlign="left"
        style={{ fontSize: 24, marginBottom: 0 }}
      >
        로그인
      </Header>
      <Header
        textAlign="left"
        as="h3"
        style={{
          marginTop: 0,
          fontWeight: "normal",
          fontSize: "14px",
          marginBottom: 10
        }}
      >
        아직 마인트 회원이 아니신가요?
      </Header>
      <Header
        onClick={onClickSignUpLink}
        style={{
          fontSize: 14,
          color: "#eb4c2a",
          textDecoration: "underline",
          marginTop: 10
        }}
      >
        회원가입
      </Header>
      <Form style={{ marginTop: 24 }} size="large">
        <Form.Input
          style={{ fontSize: 14 }}
          name="email"
          fluid
          placeholder="이메일"
          onChange={onChangeEmail}
          value={email}
        />
        <Form.Input
          style={{ fontSize: 14 }}
          name="password"
          fluid
          placeholder="비밀번호"
          type="password"
          onChange={onChangePassword}
          value={password}
        />
        <Button
          onClick={onClickLogin}
          style={{ marginTop: 36, marginBottom: 24 }}
          fluid
          size="large"
          color="red"
        >
          로그인
        </Button>
      </Form>
      <KakaoLogin history={props.history} nextPath={props.nextPath} />
      <FacebookLoginButton history={props.history} nextPath={props.nextPath} />
    </Grid.Row>
  );
};

export default LoginComponent;
