import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { printIntrospectionSchema } from "graphql";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";

const USER_AUTH = gql`
  query {
    mypage {
      id
      name
      email
      phoneNumber
    }
  }
`;

const ApplyButton = props => {
  const { error, loading, data } = useQuery(USER_AUTH);
  const onClickApply = () => {
    ReactPixel.fbq("track", "InitiateCheckout");
    ReactGA.event({ category: "결제", action: "신청 시작" });
    if (data && data.mypage) {
      if (!data.mypage.phoneNumber) {
        alert(
          "회원정보가 불완전하여 결제를 진행할 수 없습니다.\n회원정보를 입력하여 회원가입을 완료해주세요."
        );
        props.history.push("/signup");
      } else {
        props.history.push({
          pathname: "/project/" + props.id + "/order"
        });
      }
    } else if (error)
      props.history.push({
        pathname: "/login",
        nextPath: "/project/" + props.id + "/order"
      });
  };
  if (props.project.status === "0") {
    return (
      <Button className="apply-button" fluid disabled>
        신청 마감
      </Button>
    );
  } else
    return (
      <Button
        className="apply-button"
        fluid
        style={{
          backgroundColor: "#eb4c2a",
          color: "white"
        }}
        onClick={onClickApply}
      >
        프로젝트 신청하기
      </Button>
    );
};

export default ApplyButton;
