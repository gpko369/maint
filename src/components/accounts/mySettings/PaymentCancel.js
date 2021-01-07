import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Image,
  Divider,
  Header,
  Button
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import numberFormat from "../../utility/numberFormat";
import TitleHeader from "../../common/TitleHeader";

const CANCEL_PROJECT = gql`
  mutation CancelProject($projectId: ID!) {
    removeProject(projectId: $projectId) {
      message
    }
  }
`;

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

const PaymentCancel = ({ history, location, match }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [cancelProject, { error, loading, data }] = useMutation(CANCEL_PROJECT);

  const onClickCancelProject = () => {
    if (paymentInfo) {
      cancelProject({
        variables: { projectId: paymentInfo.apply.pClass.project.id }
      });
    }
  };

  const onClickGoBack = () => {
    history.goBack();
  };

  useEffect(() => {
    if (!location.state) {
      alert("잘못된 접근입니다.");
      history.push("/");
    } else {
      setPaymentInfo(location.state.payment);
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert("환불 과정에서 오류가 발생했습니다. 관리자에게 문의해주세요.");
    } else if (data) {
      history.push("/mypage/payment/" + match.params.id + "/cancelComplete");
    }
  }, [data, error]);
  return paymentInfo ? (
    <div>
      <TitleHeader history={history} type={"결제취소"} />
      <Container style={{ marginTop: 23 }}>
        <Grid style={{ margin: 0, fontSize: 12 }}>
          <Grid.Row
            style={{ fontWeight: "bold", fontSize: 20, paddingBottom: 0 }}
          >
            환불금액
          </Grid.Row>
          <Grid.Row style={{ fontSize: 14, paddingTop: 0 }}>
            환불 금액을 다시 한 번 확인해주세요.
          </Grid.Row>
          <Image
            src={
              "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
              paymentInfo.apply.pClass.project.titleImage
            }
            style={{ width: "100%", padding: 0 }}
          />
          <Grid.Row
            style={{
              fontWeight: "bold",
              fontSize: 16,
              paddingBottom: 0,
              marginTop: 5
            }}
          >
            {paymentInfo.apply.pClass.project.title}
          </Grid.Row>

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
          <Divider
            style={{
              margin: "5px -25px 0px -25px",
              border: "solid 0.5px rgb(233,234,234)",
              width: "calc(100% + 50px)",
              opacity: 0.4
            }}
          />
          <Grid.Row
            columns={2}
            style={{ fontWeight: "bold", fontSize: 14, marginBottom: 41 }}
          >
            <Grid.Column
              style={{ padding: 0, textAlign: "left", color: "#eb4c2a" }}
            >
              총 환불 금액
            </Grid.Column>
            <Grid.Column style={{ padding: 0, textAlign: "right" }}>
              {numberFormat(paymentInfo.price)}원
            </Grid.Column>
          </Grid.Row>
          <Button
            fluid
            color="red"
            style={{ margin: 0 }}
            onClick={onClickCancelProject}
          >
            환불 요청하기
          </Button>
          <Button fluid style={{ margin: "8px 0 0 0" }} onClick={onClickGoBack}>
            돌아가기
          </Button>
        </Grid>
      </Container>
    </div>
  ) : null;
};

export default PaymentCancel;
