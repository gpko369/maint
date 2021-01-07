import React, { useState } from "react";
import {
  Menu,
  Grid,
  Responsive,
  Container,
  Button,
  Progress,
  Transition
} from "semantic-ui-react";
import KakaoLink from "./KakaoLink";
import MobileLikeButton from "./MobileLikeButton";
import ApplyButton from "./ApplyButton";
import ChannelService from "../utility/ChannelService";
import { mobileModel, deviceDetect } from "react-device-detect";

function numberFormat(inputNumber) {
  return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const MobileProjectFixedMenu = props => {
  const [scroll, setScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isIphone, setIsIphone] = useState(
    mobileModel == "iPhone" && window.screen.height >= 812 ? true : false
  );
  window.onscroll = e => {
    setScroll(window.scrollY);
    if (window.scrollY - scroll > 30) {
      setVisible(false);
    } else if (window.scrollY - scroll < -7) {
      setVisible(true);
    }
  };
  window.onwheel = e => {
    if (e.deltaY > 50) {
      setVisible(false);
    } else if (e.deltaY < -40) {
      setVisible(true);
    }
  };

  ChannelService.boot({
    pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a",
    hideDefaultLauncher: true
  });
  const onClickChannelTalk = () => {
    window.ChannelIO("show");
  };
  return (
    <Transition visible={true} animation="fade up" duration={500}>
      <Menu className="project-bottom-fixed-menu" fixed="bottom">
        <Container>
          <Grid
            style={
              isIphone
                ? { margin: 0, padding: "8px 10px 20px 10px", width: "100%" }
                : { margin: 0, padding: "8px 10px 8px 10px", width: "100%" }
            }
          >
            {/* <Grid.Row
            style={{
              paddingTop: 3,
              paddingBottom: 5
            }}
          >
            <Grid.Column
              textAlign="left"
              width={9}
              style={{ fontWeight: "bold", fontSize: 14 }}
            >
              {props.project.title}
            </Grid.Column>
            <Grid.Column
              textAlign="right"
              width={7}
              style={{ fontWeight: "bold", fontSize: 18 }}
            >
              {numberFormat(props.project.price)}원
            </Grid.Column>
          </Grid.Row> */}
            <Grid.Row
              style={{
                paddingTop: 0,
                paddingBottom: 0
              }}
            >
              <Grid.Column style={{ padding: 0, width: "calc(100% - 97px)" }}>
                <ApplyButton
                  id={props.id}
                  project={props.project}
                  history={props.history}
                />
              </Grid.Column>
              <Grid.Column
                textAlign="center"
                style={{ width: 52, paddingLeft: 7, paddingRight: 6 }}
              >
                <MobileLikeButton
                  like={props.like}
                  onChangeLike={props.onChangeLike}
                  project={props.id}
                  history={props.history}
                />
              </Grid.Column>
              <Grid.Column
                textAlign="center"
                style={{ width: 42, paddingLeft: 4, paddingRight: 0 }}
              >
                <Button
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: 43,
                    width: 43
                  }}
                  circular
                  icon="question circle outline"
                  onClick={onClickChannelTalk}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Menu>
    </Transition>
  );
};

export default MobileProjectFixedMenu;
