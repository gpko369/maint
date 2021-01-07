import React from "react";
import { Menu, Grid, Container } from "semantic-ui-react";

const MainHeader = ({ option, history }) => {
  const onClickHome = () => {
    history.push("/");
  };

  const onClickEarlyBird = () => {
    history.push("/earlybird");
  };
  return (
    <Menu
      className="main-header"
      widths={5}
      pointing
      secondary
      style={{ height: 35 }}
    >
      <Menu.Item
        style={{ width: "17%" }}
        name="홈"
        active={option === "홈"}
        onClick={onClickHome}
      />
      <Menu.Item
        style={{ width: "23%" }}
        name="얼리버드"
        active={option === "얼리버드"}
        onClick={onClickEarlyBird}
      />
      <Menu.Item name="기획전" />
      <Menu.Item name="인기" />
      <Menu.Item name="이벤트" />
    </Menu>
  );
};

export default MainHeader;
