import React from "react";
import { Menu, Container, Icon, Image } from "semantic-ui-react";

const TestHeader = props => {
  const onClickGoBack = () => {
    props.history.goBack();
  };

  return (
    <Menu style={{ height: 60, borderRadius: 0, border: "none" }} borderless>
      <Container>
        <Menu.Item position="left" onClick={onClickGoBack}>
          {/* <Icon name="angle left" size="large" /> */}
          <Image
            src={require("../../img/left_angle.png")}
            style={{ maxHeight: 20, paddingLeft: 10 }}
          />
        </Menu.Item>
        <Menu.Item
          style={{ marginLeft: "auto", marginRight: "auto", fontSize: 16 }}
        >
          {props.type}
        </Menu.Item>
        <Menu.Item position="right">
          <Icon size="large" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default TestHeader;
