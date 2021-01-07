import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SMSAUTH_VERIFY = gql`
  mutation smsAuthVerify($phoneNumber: String!, $authNumber: String) {
    smsAuth(phoneNumber: $phoneNumber, authNumber: $authNumber) {
      result
    }
  }
`;

const PhoneVerifyLabel = props => {
  const [enabled, setEnabled] = useState(true);
  const [smsAuthVerify, { error, loading, data }] = useMutation(SMSAUTH_VERIFY);

  const onClickSMSVerify = () => {
    if (props.verificationNumber === "") {
      alert("인증번호를 입력해주세요.");
    } else {
      smsAuthVerify({
        variables: {
          phoneNumber: props.phone,
          authNumber: props.verificationNumber
        }
      });
    }
  };

  useEffect(() => {
    if (error) {
      alert("올바르지 않거나 만료된 인증번호입니다. 다시 발급 받아주세요.");
      props.setVerificationNumber("");
    }
    if (data) {
      if (data.smsAuth.result === "인증에 성공하였습니다") {
        alert("인증에 성공하였습니다.");
        props.setPhoneVerified(true);
      }
    }
  }, [data, error]);

  return (
    <span
      className="label"
      style={{
        color: "#EB4C2A",
        fontWeight: "bold",
        borderBottom: "1px solid rgb(151,151,151)"
      }}
      onClick={!props.phoneVerified ? onClickSMSVerify : null}
    >
      인증
    </span>
  );
};

export default PhoneVerifyLabel;
