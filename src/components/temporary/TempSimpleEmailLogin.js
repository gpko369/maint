import React, { useState, useEffect } from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const REGISTER_AND_LOGIN = gql`
  mutation RegisterAndLogin($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      user {
        id
      }
    }
    tokenAuth(email: $email, password: $password) {
      token
      rUser {
        id
        name
      }
    }
  }
`;

const TempSimpleEmailLogin = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registerAndLogin, { error, loading, data }] = useMutation(
    REGISTER_AND_LOGIN
  );

  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  const onChangePassword2 = e => {
    setPassword2(e.target.value);
  };

  const onClickRegister = () => {
    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
    } else {
      registerAndLogin({ variables: { email: email, password: password } });
    }
  };

  useEffect(() => {
    if (error) {
      alert("이미 사용 중인 이메일입니다.");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      props.history.push({
        pathname: "/saebaecoupon"
      });
    }
  }, [data]);

  return (
    <Form size="large">
      <div style={{ marginBottom: 5, fontSize: 14 }}>이메일</div>
      <Form.Input
        name="email"
        fluid
        icon="mail"
        iconPosition="left"
        placeholder="이메일"
        onChange={onChangeEmail}
        value={email}
      />
      <div style={{ marginBottom: 5, fontSize: 14 }}>비밀번호</div>
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
      <Form.Input
        name="password2"
        fluid
        icon="key"
        iconPosition="left"
        type="password"
        placeholder="비밀번호 확인"
        onChange={onChangePassword2}
        value={password2}
      />
      <Button
        style={{
          backgroundColor: "#eb4c2a",
          color: "white",
          marginTop: 18
        }}
        fluid
        size="large"
        onClick={onClickRegister}
      >
        가입 및 진행
      </Button>
    </Form>
  );
};

export default TempSimpleEmailLogin;
