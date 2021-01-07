import React from "react";
import { Menu, Grid, Container, Image } from "semantic-ui-react";

const FixHeader = () => {
  const onClickHome = () => {
    window.location.href = "/";
  };
  const onClickSearch = () => {
    window.location.href = "/search";
  };
  return (
    <Menu borderless className="fix-header" style={{ height: 64 }}>
      <Menu.Menu position="left">
        <Menu.Item>
          <Image
            onClick={onClickHome}
            style={{ height: 33 }}
            src={require("../../img/maintlogo.png")}
          />
        </Menu.Item>
      </Menu.Menu>
      <Menu.Menu position="right">
        <Menu.Item>
          <i
            onClick={onClickSearch}
            style={{ paddingRight: 4 }}
            class="ri-search-line ri-xl"
          ></i>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default FixHeader;
