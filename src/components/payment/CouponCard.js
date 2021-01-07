import React from "react";
import { Card } from "semantic-ui-react";
import numberFormat from "../utility/numberFormat";

function toDate(date) {
  var t = new Date(date); // Epoch
  t =
    t.getFullYear() + "년 " + (t.getMonth() + 1) + "월 " + t.getDate() + "일 ";
  return t;
}

const CouponCard = ({ coupon, onClickCoupon, selectedCoupon }) => {
  const unselectedStyle = {
    padding: 17,
    color: "black"
  };

  const selectedStyle = {
    padding: 17,
    border: "1px solid #eb4c2a",
    color: "black"
  };

  return (
    <Card
      className="coupon-modal"
      fluid
      style={
        selectedCoupon
          ? selectedCoupon.id == coupon.id
            ? selectedStyle
            : unselectedStyle
          : unselectedStyle
      }
      onClick={onClickCoupon}
      key={coupon.id}
      coupon={coupon}
    >
      <Card.Description style={{ fontWeight: "bold" }} coupon={coupon}>
        {coupon.description}
      </Card.Description>
      <Card.Meta
        style={{ fontSize: 12, color: "rgb(53,53,53)" }}
        value={coupon.id}
      >
        {toDate(coupon.due)} 만료
      </Card.Meta>
      <Card.Header
        coupon={coupon}
        style={{ fontWeight: "800", fontSize: 22, marginTop: 15 }}
      >
        {numberFormat(coupon.amount)}원
      </Card.Header>
      <Card.Meta style={{ fontSize: 12 }} value={coupon.id}>
        {coupon.minPrice == 0
          ? coupon.maxPrice == 999999999
            ? null
            : coupon.maxPrice + "원까지 사용 가능"
          : coupon.maxPrice == 999999999
          ? coupon.minPrice + "원 이상 사용 가능"
          : coupon.minPrice + "원~" + coupon.maxPrice + "원까지 사용 가능"}
      </Card.Meta>
    </Card>
  );
};

export default CouponCard;
