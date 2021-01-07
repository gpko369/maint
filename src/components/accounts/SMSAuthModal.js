import React, { useState, useEffect, Fragment } from "react";
import { Button, Header, Modal, Form, Grid } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SMS_REQUEST = gql`
  mutation SmsAuth($phoneNumber: String!) {
    smsAuth(phoneNumber: $phoneNumber) {
      result
    }
  }
`;

const SMS_VERIFY = gql`
  mutation SmsAuth($phoneNumber: String!, $authNumber: String!) {
    smsAuth(phoneNumber: $phoneNumber, authNumber: $authNumber) {
      result
    }
  }
`;

const VerifyComponent = props => {
  const [authCode, setAuthCode] = useState("");
  const [smsVerify, { data, error }] = useMutation(SMS_VERIFY);

  const onChangeAuthCode = e => {
    setAuthCode(e.target.value);
  };

  const onClickVerify = () => {
    smsVerify({
      variables: { phoneNumber: props.phoneNumber, authNumber: authCode }
    });
  };

  useEffect(() => {
    if (data) {
      if (data.smsAuth.result === "인증에 성공하였습니다") {
        alert("인증에 성공하였습니다.");
        window.location.reload();
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      alert("인증에 실패하였습니다. 인증 번호를 재발급 받아주세요.");
    }
  }, [error]);

  return (
    <Fragment>
      <Grid.Row style={{ paddingBottom: 0, paddingTop: 10 }}>
        <Grid.Column verticalAlign="middle">인증번호</Grid.Column>
      </Grid.Row>
      <Grid.Column width={16}>
        <Form.Group>
          <Form.Input
            name="authCode"
            fluid
            placeholder="인증번호"
            onChange={onChangeAuthCode}
            value={authCode}
          />
        </Form.Group>
      </Grid.Column>
      <Grid.Row>
        <Grid.Column>
          {props.verifyRequested ? (
            <Button
              style={{
                backgroundColor: "#eb4c2a",
                color: "white"
              }}
              fluid
              onClick={onClickVerify}
            >
              인증
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "#eb4c2a",
                color: "white"
              }}
              fluid
              disabled
            >
              인증
            </Button>
          )}
        </Grid.Column>
      </Grid.Row>
    </Fragment>
  );
};

const SMSAuthModal = ({ location }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsRequest, { data, error }] = useMutation(SMS_REQUEST);
  const [modalState, setModalState] = useState(false);
  const [buttonText, setButtonText] = useState("인증번호 요청");
  const [verifyRequested, setVerifyRequested] = useState(false);

  const onChangePhoneNumber = e => {
    setPhoneNumber(e.target.value);
  };

  const modalOpen = () => {
    setModalState(true);
  };

  const modalClose = () => {
    setModalState(false);
  };

  const onClickRequestCode = () => {
    setButtonText("재요청");
    smsRequest({ variables: { phoneNumber: phoneNumber } });
    setVerifyRequested(true);
    alert("인증번호가 요청되었습니다.");
  };

  return (
    <Modal
      size="mini"
      trigger={<Button onClick={modalOpen}>휴대폰 인증</Button>}
      open={modalState}
      onClose={modalClose}
    >
      <Modal.Header>휴대폰 인증</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Grid>
            <Grid.Row style={{ paddingBottom: 0, paddingTop: 10 }}>
              <Grid.Column verticalAlign="bottom">번호</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={9}>
                <Form.Group>
                  <Form.Input
                    name="phoneNumber"
                    fluid
                    placeholder="전화번호"
                    onChange={onChangePhoneNumber}
                    value={phoneNumber}
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={7} style={{ paddingLeft: 0 }}>
                <Button fluid onClick={onClickRequestCode}>
                  {buttonText}
                </Button>
              </Grid.Column>
            </Grid.Row>
            <VerifyComponent
              phoneNumber={phoneNumber}
              verifyRequested={verifyRequested}
              location={location}
            />
          </Grid>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default SMSAuthModal;
