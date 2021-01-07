import React, { useState } from "react";
import {
  Grid,
  Image,
  Modal,
  Card,
  Form,
  Button,
  Header
} from "semantic-ui-react";
import numberFormat from "../utility/numberFormat";
import CouponCard from "./CouponCard";

const CouponModal = props => {
  const [couponCode, setCouponCode] = useState("");
  const [modalState, setModalState] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const modalOpen = () => {
    setModalState(true);
  };

  const modalClose = () => {
    setModalState(false);
  };

  const onChangeCouponCode = e => {
    setCouponCode(e.target.value);
  };

  const onClickCoupon = (e, value) => {
    if (
      value.coupon.minPrice <= props.price &&
      value.coupon.maxPrice >= props.price
    ) {
      setSelectedCoupon(value.coupon);
    } else {
      alert("현재 상품에 사용할 수 없는 쿠폰입니다.");
    }
  };

  const onClickSubmitCoupon = () => {
    if (!selectedCoupon) {
      alert("쿠폰을 선택해주세요.");
    } else {
      props.onSelectCoupon(selectedCoupon);
      modalClose();
    }
  };

  return (
    <Modal
      trigger={
        <Grid
          columns={2}
          style={{ paddingTop: 10, paddingBottom: 10 }}
          onClick={modalOpen}
        >
          <Grid.Column
            textAlign="left"
            verticalAlign="middle"
            style={{
              paddingBottom: 10,
              paddingTop: 10
            }}
          >
            쿠폰 사용
          </Grid.Column>
          <Grid.Column
            textAlign="right"
            style={{ paddingBottom: 5, paddingTop: 5 }}
          >
            <Image
              style={{ maxHeight: 25, marginRight: 0, marginLeft: "auto" }}
              src={require("../../img/right_angle.png")}
            />
          </Grid.Column>
        </Grid>
      }
      open={modalState}
      onClose={modalClose}
      size="tiny"
      closeIcon
    >
      <Modal.Content>
        <Grid.Row style={{ padding: "40px 20px 5px 20px" }}>
          <Grid columns={2}>
            <Grid.Column width={12} style={{ paddingRight: 0 }}>
              <Form.Input
                placeholder="쿠폰코드를 입력해주세요"
                className="coupon-modal"
                fluid
                onChange={onChangeCouponCode}
                value={couponCode}
              />
            </Grid.Column>
            <Grid.Column width={4} style={{ paddingLeft: 4 }}>
              <Button
                style={{
                  height: "100%",
                  backgroundColor: "#eb4c2a",
                  color: "white",
                  fontSize: 15,
                  margin: 0
                }}
                className="coupon-modal"
                size="large"
                fluid
              >
                등록
              </Button>
            </Grid.Column>
          </Grid>
        </Grid.Row>

        {props.coupon[0] ? (
          <Card.Group style={{ padding: "20px 20px 40px 20px" }}>
            {props.coupon.map(coupon => {
              var date = new Date(coupon.due);
              if (Date.now() <= date.getTime() + 24 * 60 * 60 * 1000) {
                if (!coupon.apply) {
                  return (
                    <CouponCard
                      coupon={coupon}
                      onClickCoupon={onClickCoupon}
                      selectedCoupon={selectedCoupon}
                      key={coupon.id}
                    />
                  );
                } else if (!coupon.apply.payment) {
                  return (
                    <CouponCard
                      coupon={coupon}
                      onClickCoupon={onClickCoupon}
                      selectedCoupon={selectedCoupon}
                    />
                  );
                } else if (!coupon.apply.payment.verified) {
                  return (
                    <CouponCard
                      coupon={coupon}
                      onClickCoupon={onClickCoupon}
                      selectedCoupon={selectedCoupon}
                    />
                  );
                } else {
                  return null;
                }
              } else {
                return null;
              }
            })}
          </Card.Group>
        ) : (
          <Grid.Row
            style={{
              paddingLeft: 20,
              paddingRight: 20
            }}
          >
            <Header
              as="p"
              style={{
                marginTop: 30,
                marginBottom: 50,
                fontSize: 15,
                fontWeight: "normal",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              사용 가능한 쿠폰이 없습니다.
            </Header>
          </Grid.Row>
        )}
        <Grid.Row
          style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
        >
          <Button
            size="large"
            style={{ backgroundColor: "#eb4c2a", color: "white", fontSize: 14 }}
            fluid
            onClick={onClickSubmitCoupon}
          >
            쿠폰 적용
          </Button>
        </Grid.Row>
      </Modal.Content>
    </Modal>
  );
};

export default CouponModal;
