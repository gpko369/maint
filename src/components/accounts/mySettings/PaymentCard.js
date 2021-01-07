import React, { useState, useEffect } from "react";
import { Card } from "semantic-ui-react";
import numberFormat from "../../utility/numberFormat";

function toDate(date) {
  date = date.replace(" ", "T");
  var t = new Date(date + "Z"); // Epoch
  var time = t.getTime();
  var offset = t.getTimezoneOffset() * 60 * 1000;
  t = new Date(time + offset);
  t =
    t.getFullYear() +
    "년 " +
    (t.getMonth() + 1) +
    "월 " +
    t.getDate() +
    "일 " +
    t.getHours() +
    ":" +
    t.getMinutes();
  return t;
}

const PaymentCard = ({ payment, history }) => {
  const onClickPaymentInfo = () => {
    history.push({
      pathname: "/mypage/payment/" + payment.receiptId,
      state: { payment: payment }
    });
  };
  return (
    <Card
      className="payment-card"
      style={{
        textAlign: "left",
        padding: 20,
        border: "none",
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2)",
        margin: "8px 0px 8px 0px",
        color: "rgb(53,53,53)",
        borderRadius: 3
      }}
      fluid
      onClick={onClickPaymentInfo}
    >
      <Card.Description style={{ fontWeight: "bold", fontSize: 14 }}>
        {payment.apply.pClass.project.title}
      </Card.Description>
      <Card.Meta style={{ fontSize: 12, lineHeight: 1 }}>
        결제일: {toDate(payment.purchasedAt)}
      </Card.Meta>
      <Card.Header style={{ marginTop: 25, fontWeight: 800, fontSize: 24 }}>
        {numberFormat(payment.price)}원
      </Card.Header>
    </Card>
  );
};

export default PaymentCard;
