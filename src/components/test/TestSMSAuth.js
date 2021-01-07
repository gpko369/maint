import React, { useState, useEffect } from "react";
import { Input, Button, Container, Grid } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

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

const AuthNumberCheck = ({ phoneNumber }) => {
  const [authNumber, setAuthNumber] = useState("");
  const [smsVerify, { error, loading, data }] = useMutation(SMS_VERIFY);

  const onChangeAuthNumber = e => {
    setAuthNumber(e.target.value);
  };

  const onClickVerify = () => {
    smsVerify({
      variables: { phoneNumber: phoneNumber, authNumber: authNumber }
    });
  };

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  return (
    <div>
      <Input value={authNumber} onChange={onChangeAuthNumber} />
      <Button onClick={onClickVerify}>인증</Button>
    </div>
  );
};

const TestSMSAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsRequest, { error, loading, data }] = useMutation(SMS_REQUEST);

  const onChangePhoneNumber = e => {
    setPhoneNumber(e.target.value);
  };

  const onClickRequest = () => {
    smsRequest({ variables: { phoneNumber: phoneNumber } });
  };

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  return (
    <Container>
      <Input onChange={onChangePhoneNumber} value={phoneNumber} />
      <Button onClick={onClickRequest}>요청</Button>
      <AuthNumberCheck phoneNumber={phoneNumber} />
    </Container>
  );
};

export default TestSMSAuth;
