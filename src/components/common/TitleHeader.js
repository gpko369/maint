import React from "react";
import { Menu, Container, Icon, Image } from "semantic-ui-react";

const TitleHeader = props => {
  const onClickGoBack = () => {
    props.history.goBack();
  };

  return (
    <Menu
      className="title-header"
      style={{ height: 63, borderRadius: 0, zIndex: 100 }}
      borderless
    >
      <Container>
        <Menu.Item position="left" onClick={onClickGoBack}>
          {/* <Icon name="angle left" size="large" /> */}
          <i style={{ paddingLeft: 3 }} class="ri-arrow-left-s-line ri-2x"></i>
        </Menu.Item>
        <Menu.Item
          style={{ marginLeft: "auto", marginRight: "auto", fontSize: 15 }}
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

export default TitleHeader;
