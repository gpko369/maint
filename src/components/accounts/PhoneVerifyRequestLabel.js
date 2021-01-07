import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SMSAUTH_REQUEST = gql`
  mutation smsAuthRequest($phoneNumber: String!) {
    smsAuth(phoneNumber: $phoneNumber) {
      result
    }
  }
`;

const PhoneVerifyRequestLabel = props => {
  const [enabled, setEnabled] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [smsAuthRequest, { error, loading, data }] = useMutation(
    SMSAUTH_REQUEST
  );

  const onClickSMSRequest = () => {
    if (props.phone === "") {
      props.setPhoneError(true);
      alert("전화번호를 입력해주세요.");
    } else {
      setRequestCount(requestCount + 1);
      if (requestCount > 4) {
        alert(
          "인증번호 발급 최대횟수를 초과했습니다 (최대 5회). 처음부터 다시 시도해주세요."
        );
      } else {
        smsAuthRequest({ variables: { phoneNumber: props.phone } });
      }
    }
  };

  useEffect(() => {
    if (data) {
      if (data.smsAuth.result) {
        if (
          data.smsAuth.result === "이미 해당 번호로 가입한 회원이 존재합니다."
        ) {
          alert(data.smsAuth.result);
        } else {
          alert("인증번호가 발송되었습니다.");
          props.setPhoneVerifyRequested(true);
        }
      }
    }
  }, [data]);

  return (
    <span
      className="label"
      style={{
        color: "#EB4C2A",
        fontWeight: "bold",
        borderBottom: "1px solid rgb(151,151,151)"
      }}
      onClick={!props.phoneVerified ? onClickSMSRequest : null}
    >
      {props.phoneVerified ? "인증 완료" : "인증번호 받기"}
    </span>
  );
};

export default PhoneVerifyRequestLabel;
