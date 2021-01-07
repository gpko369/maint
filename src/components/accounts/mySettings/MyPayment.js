import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Input,
  Grid,
  Button,
  Image,
  Header,
  Divider,
  Responsive,
  Dropdown,
  Card
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import TitleHeader from "../../common/TitleHeader";
import numberFormat from "../../utility/numberFormat";
import PaymentCard from "./PaymentCard";

const MY_PAYMENT = gql`
  query {
    myPayment {
      apply {
        id
        paid
        pClass {
          project {
            id
            title
            titleImage
            price
            salePrice
          }
        }
        quantity
        coupon {
          amount
        }
        orderId
      }
      id
      receiptId
      verified
      purchasedAt
      receiptUrl
      method
      price
    }
  }
`;

const MyPayment = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const onClickSearch = () => {
    props.history.push("/search");
  };
  return (
    <div>
      <TitleHeader history={props.history} type={"결제내역"} />
      <Container>
        <Grid centered style={{ margin: 0, paddingTop: 32 }}>
          <Query query={MY_PAYMENT}>
            {({ error, loading, data }) => {
              if (error) return null;
              if (loading) return null;
              if (!data.myPayment[0]) {
                return (
                  <div style={{ padding: 0, marginTop: 93 }}>
                    <Image
                      src={require("../../../img/noprojectenrolled.png")}
                    />
                    <Grid.Row style={{ marginTop: 50 }}>
                      결제된 프로젝트가 없습니다. <br />
                      마인트와 함께 당신의 목표를 이루어보세요.
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: 94 }}>
                      <Button onClick={onClickSearch} fluid color="red">
                        프로젝트 둘러보기
                      </Button>
                    </Grid.Row>
                  </div>
                );
              } else {
                return data.myPayment.map((payment, i) => {
                  if (payment.verified) {
                    return (
                      <PaymentCard
                        history={props.history}
                        payment={payment}
                        key={i}
                      />
                    );
                  } else {
                    return null;
                  }
                });
              }
            }}
          </Query>
        </Grid>
      </Container>
    </div>
  );
};

export default MyPayment;
