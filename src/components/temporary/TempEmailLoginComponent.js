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

const TempEmailLoginComponent = props => {
  const [login, { data, error }] = useMutation(LOGIN_MUTATION);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  const onClickLogin = () => {
    login({ variables: { email: email, password: password } });
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
          marginBottom: 60
        }}
      >
        간편하게 SNS로 가입하고, 마인트와 함께 프로젝트를 도전해보세요!
      </Header>
      <Form size="large">
        <div style={{ marginBottom: 5 }}>이메일</div>
        <Form.Input
          name="email"
          fluid
          icon="mail"
          iconPosition="left"
          placeholder="이메일"
          onChange={onChangeEmail}
          value={email}
        />
        <div style={{ marginBottom: 5 }}>비밀번호</div>
        <Form.Input
          name="password"
          fluid
          icon="key"
          iconPosition="left"
          placeholder="비밀번호"
          type="password"
          onChange={onChangePassword}
          value={password}
        />
        <Button
          style={{
            backgroundColor: "#eb4c2a",
            color: "white",
            marginTop: 35
          }}
          fluid
          size="large"
          onClick={onClickLogin}
        >
          로그인
        </Button>
      </Form>
    </Grid.Row>
  );
};

export default TempEmailLoginComponent;
