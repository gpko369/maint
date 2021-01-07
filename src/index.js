import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "semantic-ui-css/semantic.min.css";
import "remixicon/fonts/remixicon.css";
import App from "./components/App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import * as serviceWorker from "./serviceWorker";
import getCookie from "./components/utility/getCookie";
import "semantic-ui-less/semantic.less";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";
import Kakao from "kakaojs";
import ChannelService from "./components/utility/ChannelService";
import ReactHelmet from "./components/utility/ReactHelmet";
import { HelmetProvider } from "react-helmet-async";

if (!getCookie("csrftoken")) {
  fetch("/get_csrf/").then(() => {
    window.location.reload();
  });
}

const httpLink = createHttpLink({
  uri: "/graphql/",
  credentials: "same-origin",
  headers: {
    "X-CSRFTOKEN": getCookie("csrftoken")
  }
});

// const httpLink = createHttpLink({
//   uri: "http://localhost:8000/graphql/",
//   credentials: "include",
//   headers: {
//     "X-CSRFTOKEN": getCookie("csrftoken")
//   }
// });

Kakao.init("9745c02de1495c143e55fc956f64215c");

ChannelService.boot({
  pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a",
  hideDefaultLauncher: true
});

ReactPixel.init("344446192914870");
ReactPixel.fbq("track", "PageView");
ReactGA.initialize("UA-143581050-1");
ReactGA.pageview(window.location.pathname + window.location.search);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <HelmetProvider>
      <ReactHelmet
        keywords="마인트, 투잡, 수익창출, 온라인, 쇼핑몰, 주식, 재테크, 창업, SNS, 마케팅, 공방"
        description="좋아하는 일 하며 사는 법. 온라인 쇼핑몰, 핸드메이드, 크리에이팅, SNS 마케팅, 공간임대 사업, 재테크, 오프라인 창업까지, 새로운 시장 전반에 걸쳐 다양한 직업, 사업을 시도하는 모든 이들과 함께합니다."
        title="마인트 | 좋아하는 일 하며 사는 법"
        image={require("./img/maintlogo.png")}
        favicon={require("./img/maintlogo.png")}
      />
      <App location={window.location} />
    </HelmetProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
