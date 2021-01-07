import React, { useEffect, useState } from "react";
import { Image, Container, Grid, Button, Divider } from "semantic-ui-react";
import numberFormat from "../../utility/numberFormat";
import TitleHeader from "../../common/TitleHeader";

function togetherSale(price, quantity) {
  var sale = 0;
  if (quantity == 1) {
    return sale;
  } else if (quantity == 2) {
    return price * 0.2;
  } else if (quantity == 3) {
    return price * 0.2 + price * 0.3;
  } else if (quantity == 4) {
    return price * 0.2 + price * 0.3 + price * 0.4;
  }
  return sale;
}

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

const MyPaymentInfo = ({ match, location, history }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickChannelTalk = () => {
    window.ChannelIO("show");
  };

  useEffect(() => {
    if (!location.state) {
      alert("잘못된 접근입니다.");
      history.push("/");
    } else {
      setPaymentInfo(location.state.payment);
    }
  }, []);

  const onClickPaymentCancel = () => {
    history.push({
      pathname: "/mypage/payment/" + match.params.id + "/cancel",
      state: { payment: paymentInfo }
    });
  };

  const onClickReceipt = () => {
    if (paymentInfo) {
      window.open(paymentInfo.receiptUrl);
    }
  };

  return paymentInfo ? (
    <div>
      <TitleHeader history={history} type={"결제내역"} />
      <Image
        src={
          "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
          paymentInfo.apply.pClass.project.titleImage
        }
        style={{ width: "100%" }}
      />
      <Container>
        <Grid style={{ margin: 0, fontSize: 12 }}>
          <Grid.Row
            style={{
              fontWeight: "bold",
              fontSize: 16,
              paddingBottom: 0,
              marginTop: 7
            }}
          >
            {paymentInfo.apply.pClass.project.title}
          </Grid.Row>
          <Grid.Row style={{ paddingTop: 0 }}>
            <h1
              style={{
                textDecoration: "underline",
                color: "#eb4c2a",
                fontSize: 12
              }}
              onClick={onClickChannelTalk}
            >
              결제 취소 문의하기
            </h1>
          </Grid.Row>
          <Divider
            style={{
              margin: "0px -25px 0px -25px",
              border: "solid 0.5px rgb(233,234,234)",
              width: "calc(100% + 50px)",
              opacity: 0.4
            }}
          />
          <Grid.Row columns={2}>
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              주문 번호
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {paymentInfo.apply.orderId}
            </Grid.Column>
          </Grid.Row>
          <Divider
            style={{
              margin: "0px -25px 0px -25px",
              border: "solid 0.5px rgb(233,234,234)",
              width: "calc(100% + 50px)",
              opacity: 0.4
            }}
          />
          <Grid.Row columns={2}>
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              결제일
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {toDate(paymentInfo.purchasedAt)}
            </Grid.Column>
          </Grid.Row>
          <Divider
            style={{
              margin: "0px -25px 0px -25px",
              border: "solid 0.5px rgb(233,234,234)",
              width: "calc(100% + 50px)",
              opacity: 0.4
            }}
          />
          <Grid.Row columns={2}>
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              결제 수단
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {paymentInfo.method === "card" ? "카드결제" : paymentInfo.method}
            </Grid.Column>
          </Grid.Row>
          <Divider
            style={{
              margin: "0px -25px 0px -25px",
              border: "solid 0.5px rgb(233,234,234)",
              width: "calc(100% + 50px)",
              opacity: 0.4
            }}
          />
          <Grid.Row columns={2} style={{ paddingBottom: 0 }}>
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              상품 금액
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {numberFormat(
                (paymentInfo.apply.pClass.project.price +
                  paymentInfo.apply.pClass.project.salePrice) *
                  paymentInfo.apply.quantity
              )}
              원
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2} style={{ padding: 0 }}>
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              할인 금액
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              -{" "}
              {numberFormat(
                paymentInfo.apply.pClass.project.salePrice *
                  paymentInfo.apply.quantity
              )}
              원
            </Grid.Column>
          </Grid.Row>
          {paymentInfo.apply.coupon[0] ? (
            <Grid.Row columns={2} style={{ padding: 0 }}>
              <Grid.Column
                style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
              >
                쿠폰 할인
              </Grid.Column>
              <Grid.Column style={{ padding: 0, textAlign: "right" }}>
                - {numberFormat(paymentInfo.apply.coupon[0].amount)}원
              </Grid.Column>
            </Grid.Row>
          ) : null}
          {paymentInfo.apply.quantity > 1 ? (
            <Grid.Row columns={2} style={{ padding: 0 }}>
              <Grid.Column
                style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
              >
                같이 할인
              </Grid.Column>
              <Grid.Column style={{ padding: 0, textAlign: "right" }}>
                -{" "}
                {numberFormat(
                  togetherSale(
                    paymentInfo.apply.pClass.project.price,
                    paymentInfo.apply.quantity
                  )
                )}
                원
              </Grid.Column>
            </Grid.Row>
          ) : null}
          <Grid.Row
            columns={2}
            style={{ fontWeight: "bold", fontSize: 14, marginBottom: 9 }}
          >
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              총 결제 금액
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {numberFormat(paymentInfo.price)}원
            </Grid.Column>
          </Grid.Row>
          <Button
            onClick={onClickReceipt}
            color="red"
            fluid
            style={{ margin: 0 }}
          >
            영수증 받기
          </Button>
        </Grid>
      </Container>
    </div>
  ) : null;
};

export default MyPaymentInfo;
