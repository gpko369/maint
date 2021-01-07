import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CREATE_TOSS = gql`
  mutation CreateToss($applyId: ID!) {
    createToss(applyId: $applyId) {
      checkoutPage
    }
  }
`;

const TossPayment = ({ match, history, location }) => {
  const [createToss, { error, loading, data }] = useMutation(CREATE_TOSS);

  const goBackAndToss = async () => {
    await history.goBack();
    window.location.href = data.createToss.checkoutPage;
  };
  useEffect(() => {
    if (match.params.id) {
      createToss({ variables: { applyId: match.params.id } });
    }
  }, []);
  useEffect(() => {
    if (data && data.createToss) {
      goBackAndToss();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      history.goBack();
      alert(error.message);
    }
  }, [error]);
  if (loading) {
    return <div>토스 결제페이지로 이동 중입니다...</div>;
  }
  return null;
};

export default TossPayment;
