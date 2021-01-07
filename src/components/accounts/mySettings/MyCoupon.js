import React, { useState } from "react";
import { Container, Form, Grid, Button } from "semantic-ui-react";
import TitleHeader from "../../common/TitleHeader";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import CouponCard from "../../payment/CouponCard";

const MY_COUPON = gql`
  query {
    myCoupon {
      id
      description
      due
      amount
      minPrice
      maxPrice
      apply {
        payment {
          verified
        }
      }
    }
  }
`;

const MyCoupon = props => {
  const [couponCode, setCouponCode] = useState("");

  const onClickCouponRegister = () => {
    alert("유효하지 않은 코드입니다.");
  };
  const onChangeCouponCode = e => {
    setCouponCode(e.target.value);
  };
  return (
    <div>
      <TitleHeader history={props.history} type={"쿠폰관리"} />
      <Container>
        <Grid style={{ margin: 0 }}>
          <Grid.Row
            columns={2}
            className="couponcode-input"
            style={{ marginTop: 10 }}
          >
            <Grid.Column style={{ padding: 0 }} width={13}>
              <Form.Input
                placeholder="쿠폰코드를 입력해주세요"
                fluid
                onChange={onChangeCouponCode}
                value={couponCode}
                style={{ height: 38 }}
              />
            </Grid.Column>
            <Grid.Column style={{ padding: "0 0 0 4px" }} width={3}>
              <Button
                style={{ paddingLeft: 5, paddingRight: 5 }}
                fluid
                onClick={onClickCouponRegister}
                color="red"
              >
                등록
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Query query={MY_COUPON}>
            {({ error, loading, data }) => {
              if (error) return null;
              if (loading) return null;
              return data.myCoupon.map(coupon => {
                var date = new Date(coupon.due);
                if (Date.now() <= date.getTime() + 24 * 60 * 60 * 1000) {
                  if (!coupon.apply) {
                    return <CouponCard coupon={coupon} key={coupon.id} />;
                  } else if (!coupon.apply.payment) {
                    return <CouponCard coupon={coupon} />;
                  } else if (!coupon.apply.payment.verified) {
                    return <CouponCard coupon={coupon} />;
                  } else {
                    return null;
                  }
                } else {
                  return null;
                }
              });
            }}
          </Query>
        </Grid>
      </Container>
    </div>
  );
};

export default MyCoupon;
