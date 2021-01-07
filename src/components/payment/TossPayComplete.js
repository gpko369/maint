import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Header,
  Image,
  Divider,
  Button,
  Responsive,
  Form
} from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import queryString from "query-string";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";

const VERIFY_TOSS = gql`
  mutation VerifyToss($applyId: ID!) {
    verifyToss(applyId: $applyId) {
      payment {
        id
        apply {
          orderId
          pClass {
            project {
              titleImage
            }
          }
        }
        verified
        price
        method
      }
    }
  }
`;

function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const TossPayComplete = ({ history, location }) => {
  const query = queryString.parse(location.search);
  const [orderId, setOrderId] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [projectImage, setProjectImage] = useState("");
  console.log(location.search);

  if (!query.status) {
    alert("잘못된 접근입니다.");
    history.push("/");
  }

  const [verifyToss, { error, loading, data }] = useMutation(VERIFY_TOSS);

  useEffect(() => {
    //결제 완료 추적 필셀
    ReactPixel.fbq("track", "Purchase");
    //GA 결제 완료 이벤트
    ReactGA.event({ category: "결제", action: "결제 완료" });
  }, []);

  useEffect(() => {
    if (location.search) {
      verifyToss({
        variables: { applyId: queryString.parse(location.search).orderNo }
      });
    }
  }, []);

  useEffect(() => {
    if (data && data.verifyToss.payment.verified) {
      setOrderId(data.verifyToss.payment.apply.orderId);
      setPrice(data.verifyToss.payment.price);
      setPaymentMethod(data.verifyToss.payment.method);
      setProjectImage(data.verifyToss.payment.apply.pClass.project.titleImage);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      alert("정상적으로 완료되지 않은 결제건입니다.\n고객센터에 문의해주세요.");
      history.push("/mypage");
    }
  }, [error]);

  return (
    <Grid style={{ margin: 0 }}>
      <Container style={{ margin: "50px 0 0 0" }}>
        <div style={{ maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
          <Grid.Row textAlign="left" style={{ marginBottom: 20 }}>
            <Header as="h3" textAlign="left">
              프로젝트 신청 완료
            </Header>
          </Grid.Row>
          <Grid.Row>
            <Grid style={{ marginTop: 20, marginBottom: 20 }} textAlign="left">
              <div>
                신청해주셔서 감사합니다. 해당 영수증은 기입하신 이메일로
                발송됩니다.
              </div>
              <div>
                영업일 기준 7일 이내에 환불이 가능하며, 3일 이내부터는 취소
                수수료가 부과되오니 유의바랍니다.
              </div>
            </Grid>
          </Grid.Row>
          <Image
            style={{
              marginBottom: 20,
              marginTop: 20
            }}
            src={
              projectImage
                ? "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                  projectImage
                : null
            }
          />
          <Grid.Row>
            <Grid columns={2}>
              <Grid.Column textAlign="left">주문번호</Grid.Column>
              <Grid.Column textAlign="right">
                <Header as="h5">{orderId ? orderId : null}</Header>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Divider style={{ marginLeft: -5, marginRight: -5 }} />
          <Grid.Row>
            <Grid columns={2}>
              <Grid.Column textAlign="left">결제 수단</Grid.Column>
              <Grid.Column textAlign="right">
                <Header as="h5">
                  {paymentMethod ? paymentMethod : null} 결제
                </Header>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Divider style={{ marginLeft: -5, marginRight: -5 }} />
          <Grid.Row>
            <Grid columns={2}>
              <Grid.Column textAlign="left">
                <Header as="h4" style={{ color: "#eb4c2a" }}>
                  최종 결제 금액
                </Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Header as="h4" style={{ color: "#eb4c2a" }}>
                  {price ? numberFormat(price) : null}원
                </Header>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row textAlign="left" style={{ marginTop: 25, fontSize: 13 }}>
            <p>*주문내역 확인을 위해 주문번호를 반드시 기억해주세요.</p>
          </Grid.Row>
          <Grid.Row>
            <Grid>
              <Grid.Column style={{ paddingLeft: 4 }}>
                <Button
                  fluid
                  style={{
                    backgroundColor: "#eb4c2a",
                    color: "white",
                    marginTop: 20
                  }}
                  href="http://maint.me"
                >
                  홈으로
                </Button>
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </div>
      </Container>
    </Grid>
  );
};

export default TossPayComplete;
