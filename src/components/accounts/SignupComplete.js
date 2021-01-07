import React, { useEffect } from "react";
import { Grid, Container, Button, Header, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CREATE_COUPON = gql`
  mutation CreateCoupon(
    $amount: Int
    $description: String
    $due: Date
    $identifier: String
    $maxPrice: Int
    $minPrice: Int
  ) {
    createCoupon(
      amount: $amount
      description: $description
      due: $due
      identifier: $identifier
      maxPrice: $maxPrice
      minPrice: $minPrice
    ) {
      coupon {
        id
      }
    }
  }
`;

const SignupComplete = props => {
  const [createNewRegisterCoupon, { error, loading, data }] = useMutation(
    CREATE_COUPON
  );

  const onClickHome = () => {
    //회원가입 쿠폰 이벤트 (2020/04/28~)
    createNewRegisterCoupon({
      variables: {
        amount: 20000,
        description: "신규회원 환영 쿠폰",
        due: "2020-09-01",
        identifier: "회원가입쿠폰",
        maxPrice: 999999999,
        minPrice: 0
      }
    });
    // props.history.push("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) {
      alert("신규회원 환영 20,000원 쿠폰이 지급되었습니다.");
      props.history.push("/");
      window.location.reload();
    } else if (error) {
      props.history.push("/");
      window.location.reload();
    }
  }, [data, error]);

  return (
    <Grid
      style={{
        margin: 0,
        width: "100%",
        height: "100vh",
        backgroundImage:
          "linear-gradient(to bottom,rgb(235,76,42),rgb(237,18,94))"
      }}
      className="signup-complete"
      centered
    >
      <Container
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          width: "100%"
        }}
      >
        <Grid.Row>
          <Header style={{ fontSize: 28, color: "white", marginBottom: 60 }}>
            회원가입이
            <br />
            완료되었습니다.
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Image
            style={{ width: 175, marginLeft: "auto", marginRight: "auto" }}
            src={require("../../img/maintwhitelogo.png")}
          />
        </Grid.Row>
        <Grid.Row
          style={{
            fontSize: 15,
            color: "white",
            marginBottom: 70,
            marginTop: 73
          }}
        >
          "당신의 꿈과 도전을 마인트가 응원합니다."
        </Grid.Row>
        <Grid.Row>
          <Button
            basic
            inverted
            onClick={onClickHome}
            size="large"
            fluid
            style={{
              color: "white",
              boxShadow: "0px 0px 0px 1px #FFFFFF inset"
            }}
          >
            홈으로 이동
          </Button>
        </Grid.Row>
      </Container>
    </Grid>
  );
};

export default SignupComplete;
