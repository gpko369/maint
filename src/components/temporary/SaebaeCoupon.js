import React, { useState, useEffect } from "react";
import { Image, Grid, Container, Button } from "semantic-ui-react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Query } from "react-apollo";
import TestHeader from "../common/TestHeader";
import gql from "graphql-tag";
import ChannelService from "../utility/ChannelService";

const MY_COUPON = gql`
  query {
    mypage {
      coupon {
        identifier
      }
    }
  }
`;

const CREATE_COUPON = gql`
  mutation createCoupon(
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

const SaebaeCoupon = props => {
  ChannelService.boot({ pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a" });

  const [createCoupon, { error, loading, data }] = useMutation(CREATE_COUPON);

  useEffect(() => {
    if (error) {
      alert("이미 지급된 쿠폰입니다.");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      alert("쿠폰이 지급되었습니다.");
    }
  }, [data]);

  const onClickSaebae1 = () => {
    createCoupon({
      variables: {
        amount: 25000,
        description: "열정 할인 쿠폰",
        due: "2020-09-30",
        identifier: "세배쿠폰1",
        maxPrice: 300000,
        minPrice: 100000
      }
    });
  };

  const onClickSaebae2 = () => {
    createCoupon({
      variables: {
        amount: 55000,
        description: "열정 할인 쿠폰",
        due: "2020-09-30",
        identifier: "세배쿠폰2",
        maxPrice: 500000,
        minPrice: 300000
      }
    });
  };
  const onClickSaebae3 = () => {
    createCoupon({
      variables: {
        amount: 85000,
        description: "열정 할인 쿠폰",
        due: "2020-09-30",
        identifier: "세배쿠폰3",
        maxPrice: 999999999,
        minPrice: 500000
      }
    });
  };

  return (
    <div>
      <Query query={MY_COUPON}>
        {({ loading, error, data }) => {
          if (error) {
            if (
              error.message ===
              "GraphQL error: You do not have permission to perform this action"
            ) {
              props.history.push("/saebaecoupon/register");
            }
          }
          return null;
        }}
      </Query>
      <TestHeader history={props.history} type="쿠폰 발급" />
      <Container style={{ paddingTop: 35, maxWidth: 500 }}>
        <Grid
          style={{
            margin: 0,
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Grid.Row>
            <Image
              style={{
                paddingLeft: 26,
                width: "100%",
                height: "auto",
                minHeight: 100,
                maxHeight: 217
              }}
              src={require("../../img/saebae1.png")}
              onClick={onClickSaebae1}
            />
          </Grid.Row>
          <Grid.Row>
            <Image
              style={{
                paddingLeft: 26,
                width: "100%",
                height: "auto",
                minHeight: 100,
                maxHeight: 217
              }}
              src={require("../../img/saebae2.png")}
              onClick={onClickSaebae2}
            />
          </Grid.Row>
          <Grid.Row>
            <Image
              style={{
                paddingLeft: 26,
                width: "100%",
                height: "auto",
                minHeight: 100,
                maxHeight: 217
              }}
              src={require("../../img/saebae3.png")}
              onClick={onClickSaebae3}
            />
          </Grid.Row>
          <Grid.Row>
            <Button
              href="https://maint.me"
              size="large"
              style={{
                marginTop: 10,
                marginLeft: 26,
                marginRight: 26,
                paddingTop: 12,
                height: 38
              }}
              fluid
            >
              돌아가기
            </Button>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default SaebaeCoupon;
