import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Divider,
  Icon,
  Input,
  Responsive,
  Dropdown,
  Checkbox
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";
import EmailDuplicateCheckLabel from "./EmailDuplicateCheckLabel";
import PhoneVerifyRequestLabel from "./PhoneVerifyRequestLabel";
import PhoneVerifyLabel from "./PhoneVerifyLabel";
import ServiceAgreementModal from "./ServiceAgreementModal";
import PrivacyPolicyAgreementModal from "./PrivacyPolicyAgreementModal";

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo(
    $id: ID
    $email: String
    $name: String
    $phone: String
    $gender: String
    $birth: Date
    $agree1: Boolean
    $agree2: Boolean
    $agree3: Boolean
  ) {
    updateUser(
      id: $id
      email: $email
      name: $name
      phone: $phone
      gender: $gender
      birth: $birth
      agree1: $agree1
      agree2: $agree2
      agree3: $agree3
    ) {
      user {
        id
      }
    }
  }
`;

function autoHypenPhone(str) {
  str = str.replace(/[^0-9]/g, "");
  var tmp = "";
  if (str.length < 4) {
    return str;
  } else if (str.length < 7) {
    tmp += str.substr(0, 3);
    tmp += "-";
    tmp += str.substr(3);
    return tmp;
  } else if (str.length < 11) {
    tmp += str.substr(0, 3);
    tmp += "-";
    tmp += str.substr(3, 3);
    tmp += "-";
    tmp += str.substr(6);
    return tmp;
  } else {
    tmp += str.substr(0, 3);
    tmp += "-";
    tmp += str.substr(3, 4);
    tmp += "-";
    tmp += str.substr(7);
    return tmp;
  }
  return str;
}

function removeHypen(str) {
  var res = str.replace(/-/gi, "");
  return res;
}

function isPasswordValid(password) {
  var regExpPw = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;
  return regExpPw.test(password);
}

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

const SignUpComponent = ({ history, user, project, nextPath, userEmail }) => {
  const [updateUser, { data, error }] = useMutation(UPDATE_USER_INFO);

  const [style1, setStyle1] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });
  const [style2, setStyle2] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVisual, setPhoneVisual] = useState("");
  const [verificationNumber, setVerificationNumber] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [emailFixed, setEmailFixed] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerifyRequested, setPhoneVerifyRequested] = useState(false);

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [allAgree, setAllagree] = useState(false);

  const onClickAgree1 = e => {
    e.preventDefault();
    setAgree1(!agree1);
  };
  const onClickAgree2 = e => {
    e.preventDefault();
    setAgree2(!agree2);
  };
  const onClickAgree3 = e => {
    e.preventDefault();
    setAgree3(!agree3);
  };

  const onClickAllAgree = e => {
    e.preventDefault();
    setAllagree(!allAgree);
    setAgree1(!allAgree);
    setAgree2(!allAgree);
    setAgree3(!allAgree);
  };

  const onChangeName = e => {
    if (nameError) {
      setNameError(false);
    }
    setName(e.target.value);
  };

  const onChangePhone = e => {
    if (phoneError) {
      setPhoneError(false);
    }
    setPhoneVisual(autoHypenPhone(e.target.value));
    setPhone(removeHypen(e.target.value));
  };

  const onChangeVerficationNumber = e => {
    setVerificationNumber(e.target.value);
  };

  const onChangeEmail = e => {
    if (emailError) {
      setEmailError(false);
    }
    setEmail(e.target.value);
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

  const onClickUpdateUser = () => {
    if (!emailFixed) {
      setEmailError(true);
      alert("이메일 중복확인을 해주세요.");
    } else if (name === "") {
      setNameError(true);
      alert("이름을 입력해주세요.");
    } else if (phone === "") {
      setPhoneError(true);
      alert("휴대폰 번호를 입력해주세요.");
    } else if (gender === "") {
      alert("성별을 입력해주세요.");
    } else if (birth === "") {
      alert("생년월일을 입력해주세요.");
    } else if (!agree1) {
      alert("이용약관에 동의해주셔야합니다.");
    } else if (!agree2) {
      alert("개인정보 이용 및 처리방침에 동의해주셔야합니다.");
    } else {
      updateUser({
        variables: {
          id: user,
          email: email,
          name: name,
          phone: phone,
          gender: gender,
          birth: birth,
          agree1: agree1,
          agree2: agree2,
          agree3: agree3
        }
      });
    }
  };

  useEffect(() => {
    if (data) {
      /* 회원가입 완료(등록완료) 추적 픽셀 */
      ReactPixel.fbq("track", "CompleteRegistration");
      /* GA 회원가입 이벤트*/
      ReactGA.event({ category: "회원", action: "회원 가입" });
      if (nextPath) {
        history.push({ pathname: nextPath });
      } else {
        history.push("/signupComplete");
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (
        error.message ===
        "GraphQL error: UNIQUE constraint failed: accounts_user.email"
      ) {
        alert("이미 해당 메일로 가입한 회원이 존재합니다.");
      }
    }
  }, [error]);

  return (
    <Grid.Row
      className="signup-component"
      textAlign="center"
      style={{ marginBottom: "auto" }}
    >
      <Grid.Row>
        <Header
          textAlign="left"
          as="h3"
          style={{ fontSize: 24, marginBottom: 20 }}
        >
          회원 정보 입력
        </Header>
      </Grid.Row>
      <Grid.Row style={{ marginTop: 36 }}>
        <Grid columns={2}>
          <Grid.Column
            textAlign="left"
            verticalAlign="middle"
            style={{ paddingBottom: 10, fontSize: 12, fontWeight: "bold" }}
          >
            이메일
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <Responsive as={Grid.Row} style={{ marginTop: 15 }}>
        <Grid.Row>
          <Input
            error={emailError}
            disabled={emailFixed}
            label={
              <EmailDuplicateCheckLabel
                email={email}
                setEmailError={setEmailError}
                setEmailFixed={setEmailFixed}
                userEmail={userEmail}
              />
            }
            labelPosition="right"
            className="payment"
            name="email"
            fluid
            placeholder="이메일을 입력해주세요."
            onChange={onChangeEmail}
            value={email}
          />
        </Grid.Row>
      </Responsive>
      <Grid.Row style={{ marginTop: 36 }}>
        <Grid columns={2}>
          <Grid.Column
            textAlign="left"
            verticalAlign="middle"
            style={{ paddingBottom: 10, fontSize: 12, fontWeight: "bold" }}
          >
            이름
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <Responsive as={Grid.Row} style={{ marginTop: 15 }}>
        <Grid.Row>
          <Input
            error={nameError}
            className="payment"
            name="name"
            fluid
            placeholder="이름을 입력해주세요."
            onChange={onChangeName}
            value={name}
          />
        </Grid.Row>
      </Responsive>
      <Grid.Row style={{ marginTop: 26 }}>
        <Grid style={{ marginTop: 0 }} columns={2}>
          <Grid.Column
            textAlign="left"
            verticalAlign="middle"
            style={{
              paddingBottom: 10,
              paddingTop: 10,
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            휴대폰 번호
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <Responsive as={Grid.Row} style={{ marginTop: 15 }}>
        <Grid.Row>
          <Input
            error={phoneError}
            className="payment"
            disabled={phoneVerified}
            label={
              <PhoneVerifyRequestLabel
                phone={phone}
                phoneVerified={phoneVerified}
                setPhoneVerifyRequested={setPhoneVerifyRequested}
                setPhoneError={setPhoneError}
              />
            }
            labelPosition="right"
            name="phone"
            fluid
            placeholder="휴대폰 번호를 '-' 없이 입력해주세요."
            onChange={onChangePhone}
            value={phoneVisual}
          />
        </Grid.Row>
      </Responsive>
      {!phoneVerified ? (
        phoneVerifyRequested ? (
          <>
            <Grid.Row style={{ marginTop: 26 }}>
              <Grid style={{ marginTop: 0 }} columns={2}>
                <Grid.Column
                  textAlign="left"
                  verticalAlign="middle"
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    fontSize: 12,
                    fontWeight: "bold"
                  }}
                >
                  인증 번호
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Responsive as={Grid.Row} style={{ marginTop: 15 }}>
              <Grid.Row>
                <Input
                  className="payment"
                  name="verificationNumber"
                  disabled={phoneVerified}
                  label={
                    <PhoneVerifyLabel
                      phone={phone}
                      phoneVerified={phoneVerified}
                      verificationNumber={verificationNumber}
                      setVerificationNumber={setVerificationNumber}
                      setPhoneVerified={setPhoneVerified}
                    />
                  }
                  labelPosition="right"
                  fluid
                  placeholder="4자리 인증번호를 입력해주세요"
                  onChange={onChangeVerficationNumber}
                  value={verificationNumber}
                />
              </Grid.Row>
            </Responsive>
          </>
        ) : null
      ) : null}
      <Grid.Row style={{ marginTop: 36 }}>
        <Grid columns={2}>
          <Grid.Column
            textAlign="left"
            style={{ fontSize: 12, fontWeight: "bold" }}
          >
            생년월일
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <Responsive as={Grid.Row} style={{ marginTop: 5 }}>
        <Grid.Row>
          <Grid>
            <Grid.Row
              columns={3}
              style={{
                paddingTop: 5,
                paddingBottom: 14,
                paddingRight: 14
              }}
            >
              <Grid.Column style={{ paddingRight: 0 }}>
                <Dropdown
                  placeholder="생년"
                  options={yearOptions}
                  fluid
                  selection
                  onChange={onChangeYear}
                  value={year}
                />
              </Grid.Column>
              <Grid.Column style={{ paddingRight: 0, paddingLeft: 10 }}>
                <Dropdown
                  placeholder="월"
                  fluid
                  selection
                  options={monthOptions}
                  onChange={onChangeMonth}
                  value={month}
                />
              </Grid.Column>
              <Grid.Column style={{ paddingRight: 0, paddingLeft: 10 }}>
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
      </Responsive>
      <Grid.Row style={{ marginTop: 26 }}>
        <Grid style={{ marginTop: 0 }} columns={2}>
          <Grid.Column
            textAlign="left"
            verticalAlign="middle"
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            성별
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <Responsive as={Grid.Row} style={{ marginTop: 5 }}>
        <Grid.Row>
          <Grid>
            <Grid.Row style={{ paddingTop: 10 }} columns={2}>
              <Grid.Column style={{ paddingRight: 5 }}>
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
              <Grid.Column style={{ paddingLeft: 5 }}>
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
      </Responsive>
      <Responsive
        as={Divider}
        className="payment"
        maxWidth={650}
        style={{
          marginLeft: -30,
          marginRight: -21,
          marginTop: 20,
          marginBottom: 20
        }}
      />
      <Grid.Row style={{ paddingTop: 8, paddingBottom: 8 }}>
        <Checkbox
          className="all-agree"
          checked={allAgree}
          onClick={onClickAllAgree}
          label="이용약관, 개인정보 이용 및 처리 방침, 프로모션 및 메일/알림 수신에 모두 동의합니다."
        />
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 4, paddingBottom: 4 }}>
        <Checkbox
          className="agree"
          checked={agree1}
          onClick={onClickAgree1}
          label="이용약관에 동의합니다. (필수)"
        />
        <ServiceAgreementModal />
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 4, paddingBottom: 4 }}>
        <Checkbox
          className="agree"
          checked={agree2}
          onClick={onClickAgree2}
          label="개인정보 이용 및 처리 방침에 동의합니다. (필수)"
        />
        <PrivacyPolicyAgreementModal />
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 4, paddingBottom: 4 }}>
        <Checkbox
          className="agree"
          checked={agree3}
          onClick={onClickAgree3}
          label="프로모션 및 안내 메일/알림 수신에 동의합니다. (선택)"
        />
      </Grid.Row>

      <Grid.Row>
        <Button
          size="large"
          fluid
          style={{
            backgroundColor: "#eb4c2a",
            color: "white",
            marginTop: 40
          }}
          onClick={onClickUpdateUser}
        >
          회원가입 완료
        </Button>
      </Grid.Row>
    </Grid.Row>
  );
};

export default SignUpComponent;
