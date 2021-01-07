import React, { useState } from "react";
import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const EMAIL_LIST = gql`
  query {
    allUsers {
      email
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $email: String!
    $password: String!
    $name: String!
    $gender: String!
    $birth: Date
  ) {
    updateUser(
      email: $email
      password: $password
      name: $name
      gender: $gender
      birth: $birth
    ) {
      user {
        id
        name
      }
    }
  }
`;

const yearOptions = [];
for (var i = 1950; i < 2019; i++) {
  yearOptions.push({ key: String(i), value: String(i), text: String(i) });
}

const monthOptions = [];
for (i = 1; i < 13; i++) {
  monthOptions.push({
    key: String(i),
    value: String(i),
    text: String(i)
  });
}

const dayOptions = [];
for (i = 1; i < 32; i++) {
  dayOptions.push({
    key: String(i),
    value: String(i),
    text: String(i)
  });
}

const RegisterComponent = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birth, setBirth] = useState("");
  const [style1, setStyle1] = useState({});
  const [style2, setStyle2] = useState({});

  const { data } = useQuery(EMAIL_LIST);
  const emailList = [];
  if (data) {
    console.log(data);
    for (i = 0; i < data.allUsers.length; i++) {
      emailList[i] = data.allUsers[i].email;
    }
  }

  const onChangeEmail = e => {
    if (emailList.indexOf(e.target.value) !== -1) {
      setMessage("이미 사용 중인 이메일입니다.");
    } else {
      setMessage("사용 가능한 이메일입니다.");
    }
    setEmail(e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
  };

  const onChangePassword2 = e => {
    if (password !== e.target.value) {
      setMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setMessage("비밀번호가 일치합니다.");
    }

    setPassword2(e.target.value);
  };

  const onChangeName = e => {
    setName(e.target.value);
  };

  const onChangeGender1 = e => {
    setGender(e.target.value);
    setStyle1({ backgroundColor: "#eb4c2a", color: "white" });
    setStyle2({});
  };

  const onChangeGender2 = e => {
    setGender(e.target.value);
    setStyle1({});
    setStyle2({ backgroundColor: "#eb4c2a", color: "white" });
  };

  const onChangeYear = e => {
    setYear(e.target.value);
    if (month.length === 1 && day.length !== 1) {
      setBirth(e.target.value + "-0" + month + "-" + day);
    } else if (month.length !== 1 && day.length === 1) {
      setBirth(e.target.value + "0" + month + "-0" + day);
    } else if (month.length === 1 && day.length === 1) {
      setBirth(e.target.value + "-0" + month + "-0" + day);
    } else {
      setBirth(e.target.value + "-" + month + "-" + day);
    }
  };

  const onChangeMonth = e => {
    setMonth(e.target.value);
    if (month.length === 1 && day.length !== 1) {
      setBirth(year + "-0" + e.target.value + "-" + day);
    } else if (month.length !== 1 && day.length === 1) {
      setBirth(year + "0" + e.target.value + "-0" + day);
    } else if (month.length === 1 && day.length === 1) {
      setBirth(year + "-0" + e.target.value + "-0" + day);
    } else {
      setBirth(year + "-" + e.target.value + "-" + day);
    }
  };

  const onChangeDay = e => {
    setDay(e.target.value);
    if (month.length === 1 && e.target.value.length !== 1) {
      setBirth(year + "-0" + month + "-" + e.target.value);
    } else if (month.length !== 1 && e.target.value.length === 1) {
      setBirth(year + "0" + month + "-0" + e.target.value);
    } else if (month.length === 1 && e.target.value.length === 1) {
      setBirth(year + "-0" + month + "-0" + e.target.value);
    } else {
      setBirth(year + "-" + month + "-" + e.target.value);
    }
  };

  return (
    <Grid.Row style={{ marginTop: 40 }}>
      <Header as="h2" textAlign="left">
        회원가입
      </Header>
      <Header
        as="h3"
        style={{
          fontWeight: "normal",
          fontSize: "16px",
          marginBottom: 5
        }}
      >
        이미 마인트 회원이신가요?
      </Header>
      <Header
        as={Link}
        to="/login"
        textAlign="left"
        style={{ color: "#eb4c2a", fontSize: "14px", marginBottom: 5 }}
      >
        로그인하기
      </Header>

      <Form size="large">
        <Form.Input
          name="email"
          fluid
          icon="mail"
          iconPosition="left"
          placeholder="이메일"
          onChange={onChangeEmail}
          value={email}
        />
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
        <Form.Input
          name="name"
          fluid
          icon="tag"
          iconPosition="left"
          placeholder="이름"
          onChange={onChangeName}
          value={name}
        />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column style={{ paddingRight: 5 }}>
              <Button
                fluid
                size="large"
                onClick={onChangeGender1}
                value="M"
                style={style1}
              >
                남자
              </Button>
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 5 }}>
              <Button
                style={style2}
                size="large"
                fluid
                onClick={onChangeGender2}
                value="F"
              >
                여자
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* <Dropdown
                placeholder="생년"
                options={yearOptions}
                search
                selection
                style={{ maxWidth: 100 }}
                onChange={onChangeYear}
                value={year}
              />
              <Dropdown
                placeholder="월"
                search
                selection
                options={monthOptions}
                style={{ maxWidth: 100 }}
                onChange={onChangeMonth}
              />
              <Dropdown
                placeholder="일"
                search
                selection
                options={dayOptions}
                style={{ maxWidth: 100 }}
                onChange={onChangeDay}
              /> */}
        <Grid>
          <Grid.Row columns={3} style={{ paddingTop: 0 }}>
            <Grid.Column style={{ paddingRight: 5 }}>
              <Form.Input
                name="year"
                fluid
                placeholder="생년"
                onChange={onChangeYear}
                value={year}
              />
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 5, paddingRight: 5 }}>
              <Form.Input
                name="month"
                fluid
                placeholder="월"
                onChange={onChangeMonth}
                value={month}
              />
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 5 }}>
              <Form.Input
                name="day"
                fluid
                placeholder="일"
                onChange={onChangeDay}
                value={day}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Message>{message}</Message>
        <Mutation
          mutation={REGISTER_MUTATION}
          variables={{ email, password, name, gender, birth }}
          onCompleted={() => props.history.push("/login")}
        >
          {mutation => (
            <Button
              type="submit"
              style={{ backgroundColor: "#eb4c2a", color: "white" }}
              fluid
              size="large"
              onClick={mutation}
            >
              회원가입
            </Button>
          )}
        </Mutation>
      </Form>
    </Grid.Row>
  );
};

export default RegisterComponent;
