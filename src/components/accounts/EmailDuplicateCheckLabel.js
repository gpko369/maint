import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const EMAIL_DUP_CHECK = gql`
  mutation EmailDuplicateCheck($email: String!) {
    emailDuplicateCheck(email: $email) {
      result
    }
  }
`;

function isEmailValid(email) {
  var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  return regExp.test(email); // 형식에 맞는 경우 true 리턴
}

const EmailDuplicateCheckLabel = props => {
  const [enabled, setEnabled] = useState(true);
  const [emailDupCheck, { error, loading, data }] = useMutation(
    EMAIL_DUP_CHECK
  );

  const onClickDupCheck = email => {
    if (props.email === "") {
      props.setEmailError(true);
      alert("이메일을 입력해주세요.");
    } else if (!isEmailValid(props.email)) {
      props.setEmailError(true);
      alert("이메일 형식이 맞지 않습니다.");
    } else {
      emailDupCheck({ variables: { email: props.email } });
    }
  };

  useEffect(() => {
    if (data) {
      if (data.emailDuplicateCheck.result) {
        if (props.userEmail && props.userEmail == props.email) {
          console.log(props.userEmail);
          var result = window.confirm(
            "사용가능한 이메일입니다. 사용하시겠습니까?"
          );
          if (result) {
            props.setEmailFixed(true);
            setEnabled(false);
          }
        } else {
          props.setEmailError(true);
          alert("이미 해당 이메일로 가입된 회원이 존재합니다.");
        }
      } else {
        var result = window.confirm(
          "사용가능한 이메일입니다. 사용하시겠습니까?"
        );
        if (result) {
          props.setEmailFixed(true);
          setEnabled(false);
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
      onClick={enabled ? onClickDupCheck : null}
    >
      중복 확인
    </span>
  );
};

export default EmailDuplicateCheckLabel;
