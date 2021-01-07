import React, { Component } from "react";
import { Button } from "semantic-ui-react";

const OrderButton = props => {
  const onClickOrder = () => {
    if (props.projectClass === -1) {
      alert("프로젝트 수강반을 선택해주세요.");
    } else {
      props.history.push({
        pathname: "/project/" + props.project.id + "/payment",
        state: {
          projectData: props.project,
          quantity: props.quantity,
          projectClass: props.projectClass
        }
      });
    }
  };

  return (
    <Button
      size="large"
      fluid
      style={{
        backgroundColor: "#eb4c2a",
        color: "white",
        marginTop: 40,
        paddingTop: 12
      }}
      onClick={onClickOrder}
    >
      다음 단계
    </Button>
  );
};

export default OrderButton;
