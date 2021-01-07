import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Input,
  Grid,
  Button,
  Image,
  Header,
  Divider,
  Responsive,
  Dropdown
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import TitleHeader from "../../common/TitleHeader";

const MY_PAGE = gql`
  query {
    mypage {
      id
      name
      email
      registerDate
      phoneNumber
      img
      enrolledClass {
        project {
          id
          title
          titleImageUrl
          titleImage
          projectTerm
          category {
            id
            category
          }
          minCapacity
          projectShortintro
          coach {
            name
          }
        }
      }
    }
  }
`;

const yearOptions = [];
for (var i = 1950; i < 2021; i++) {
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

const MyProfileSetting = props => {
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birth, setBirth] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChangePhone = e => {
    setPhone(e.target.value);
  };

  const onChangeGender1 = e => {
    setGender(e.target.value);
    setStyle1({ backgroundColor: "#eb4c2a", color: "white" });
    setStyle2({
      backgroundColor: "white",
      border: "solid 1px rgb(223,227,233)"
    });
  };

  const onChangeGender2 = e => {
    setGender(e.target.value);
    setStyle1({
      backgroundColor: "white",
      border: "solid 1px rgb(223,227,233)"
    });
    setStyle2({ backgroundColor: "#eb4c2a", color: "white" });
  };

  const onChangeYear = (e, { value }) => {
    setYear(value);
    if (month.length === 1 && day.length !== 1) {
      setBirth(value + "-0" + month + "-" + day);
    } else if (month.length !== 1 && day.length === 1) {
      setBirth(value + "0" + month + "-0" + day);
    } else if (month.length === 1 && day.length === 1) {
      setBirth(value + "-0" + month + "-0" + day);
    } else {
      setBirth(value + "-" + month + "-" + day);
    }
  };

  const onChangeMonth = (e, { value }) => {
    setMonth(value);
    if (value.length === 1 && day.length !== 1) {
      setBirth(year + "-0" + value + "-" + day);
    } else if (value.length !== 1 && day.length === 1) {
      setBirth(year + "-" + value + "-0" + day);
    } else if (value.length === 1 && day.length === 1) {
      setBirth(year + "-0" + value + "-0" + day);
    } else {
      setBirth(year + "-" + value + "-" + day);
    }
  };

  const onChangeDay = (e, { value }) => {
    setDay(value);
    if (month.length === 1 && value.length !== 1) {
      setBirth(year + "-0" + month + "-" + value);
    } else if (month.length !== 1 && value.length === 1) {
      setBirth(year + "-" + month + "-0" + value);
    } else if (month.length === 1 && value.length === 1) {
      setBirth(year + "-0" + month + "-0" + value);
    } else {
      setBirth(year + "-" + month + "-" + value);
    }
  };

  const [style1, setStyle1] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });
  const [style2, setStyle2] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });

  return (
    <div>
      <TitleHeader history={props.history} type={"프로필 설정"} />
      <Query query={MY_PAGE}>
        {({ error, loading, data }) => {
          if (error) {
            alert("로그인하세요");
            props.history.push("/login");
            return null;
          }
          if (loading) return null;
          return (
            <div>
              <Grid
                centered
                style={{
                  height: 224,
                  margin: 0
                }}
              >
                <Container
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto"
                  }}
                >
                  <Grid centered>
                    <Grid.Row>
                      <Image
                        style={{ height: 94 }}
                        src={require("../../../img/default_user.png")}
                      />
                    </Grid.Row>
                    <Grid.Row
                      style={{
                        paddingBottom: 0,
                        fontSize: 22,
                        fontWeight: "bold"
                      }}
                    >
                      {data.mypage.name}
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 0 }}>
                      {data.mypage.email}
                    </Grid.Row>
                  </Grid>
                </Container>
              </Grid>
              <Divider style={{ marginBottom: 22, marginTop: 0 }} />
              <Container>
                <Grid.Row
                  style={{ fontSize: 12, fontWeight: "bold", marginBottom: 11 }}
                >
                  전화 번호
                </Grid.Row>
                <Grid.Row>
                  <Form.Input
                    className="payment"
                    name="phone"
                    fluid
                    icon="mobile alternate"
                    iconPosition="left"
                    placeholder={
                      data.mypage.phoneNumber
                        ? data.mypage.phoneNumber
                        : "전화번호를 입력해주세요."
                    }
                    onChange={onChangePhone}
                    value={phone}
                  />
                </Grid.Row>
              </Container>

              <Divider style={{ marginBottom: 22, marginTop: 19 }} />

              <Container>
                <Grid.Row style={{ fontSize: 12, fontWeight: "bold" }}>
                  생년월일
                </Grid.Row>
                <Grid.Row style={{ marginTop: 6 }}>
                  <Grid.Row>
                    <Grid style={{ margin: 0 }}>
                      <Grid.Row
                        columns={3}
                        style={{
                          paddingTop: 5,
                          paddingBottom: 0
                        }}
                      >
                        <Grid.Column
                          style={{ paddingRight: 0, paddingLeft: 0 }}
                        >
                          <Dropdown
                            placeholder="생년"
                            options={yearOptions}
                            fluid
                            selection
                            onChange={onChangeYear}
                            value={year}
                          />
                        </Grid.Column>
                        <Grid.Column
                          style={{ paddingRight: 0, paddingLeft: 10 }}
                        >
                          <Dropdown
                            placeholder="월"
                            fluid
                            selection
                            options={monthOptions}
                            onChange={onChangeMonth}
                            value={month}
                          />
                        </Grid.Column>
                        <Grid.Column
                          style={{ paddingRight: 0, paddingLeft: 10 }}
                        >
                          <Dropdown
                            placeholder="일"
                            fluid
                            selection
                            options={dayOptions}
                            onChange={onChangeDay}
                            value={day}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Row>
                </Grid.Row>
              </Container>
              <Divider style={{ marginBottom: 22, marginTop: 19 }} />

              <Container>
                <Grid.Row style={{ fontSize: 12, fontWeight: "bold" }}>
                  성별
                </Grid.Row>
                <Grid.Row style={{ marginTop: 11 }}>
                  <Grid style={{ margin: 0 }}>
                    <Grid.Row style={{ paddingTop: 0 }} columns={2}>
                      <Grid.Column style={{ paddingRight: 5, paddingLeft: 0 }}>
                        <Button
                          fluid
                          className="payment"
                          size="large"
                          onClick={onChangeGender1}
                          value="M"
                          style={style1}
                        >
                          남자
                        </Button>
                      </Grid.Column>
                      <Grid.Column style={{ paddingLeft: 5, paddingRight: 0 }}>
                        <Button
                          style={style2}
                          size="large"
                          className="payment"
                          fluid
                          onClick={onChangeGender2}
                          value="F"
                        >
                          여자
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Row>
                <Grid.Row style={{ marginTop: 18 }}>
                  <Button fluid color="red">
                    설정완료
                  </Button>
                </Grid.Row>
              </Container>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default MyProfileSetting;
