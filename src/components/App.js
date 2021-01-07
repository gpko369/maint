import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../styles/App.css";
import ReactHelmet from "./utility/ReactHelmet";
import Loader from "react-loader-spinner";

const Main = lazy(() => import("./common/Main"));
const Login = lazy(() => import("./accounts/Login"));
const Project = lazy(() => import("./projects/Project"));
const Mypage = lazy(() => import("./accounts/Mypage"));
const Footer = lazy(() => import("./common/Footer"));
const Payment = lazy(() => import("./payment/Payment"));
const OrderProject = lazy(() => import("./payment/OrderProject"));
const PurchaseComplete = lazy(() => import("./payment/PurchaseComplete"));
const SaebaeCoupon = lazy(() => import("./temporary/SaebaeCoupon"));
const EmailLogin = lazy(() => import("./accounts/EmailLogin"));
const SignUp = lazy(() => import("./accounts/SignUp"));
const BootpayTest = lazy(() => import("./test/BootpayTest"));
const Category = lazy(() => import("./projects/Category"));
const EarlyBird = lazy(() => import("./common/EarlyBird"));
const Search = lazy(() => import("./common/Search"));
const MyProjects = lazy(() => import("./common/MyProjects"));
const MyProfileSetting = lazy(() =>
  import("./accounts/mySettings/MyProfileSetting")
);
const ReviewCreate = lazy(() => import("./projects/ReviewCreate"));
const MyPayment = lazy(() => import("./accounts/mySettings/MyPayment"));
const MyPaymentInfo = lazy(() => import("./accounts/mySettings/MyPaymentInfo"));
const MyCoupon = lazy(() => import("./accounts/mySettings/MyCoupon"));
const ServiceAgreement = lazy(() => import("./common/ServiceAgreement"));
const PaymentCancel = lazy(() => import("./accounts/mySettings/PaymentCancel"));
const CancelComplete = lazy(() =>
  import("./accounts/mySettings/CancelComplete")
);
const SignupComplete = lazy(() => import("./accounts/SignupComplete"));
const Events = lazy(() => import("./common/Events"));
const FullpageProject = lazy(() => import("./temporary/FullpageProject"));
const TestSMSAuth = lazy(() => import("./test/TestSMSAuth"));
const TossPayComplete = lazy(() => import("./payment/TossPayComplete"));
const TossPayment = lazy(() => import("./payment/TossPayment"));
const TestProjectDetail = lazy(() => import("./temporary/TestProjectDetail"));
const PrivacyPolicy = lazy(() => import("./common/PrivacyPolicy"));

const App = props => {
  return (
    <Router>
      {/* <Header /> */}
      {/* <TestHeader /> */}
      <ReactHelmet
        keywords="마인트, 투잡, 수익창출, 온라인, 쇼핑몰, 주식, 재테크, 창업, SNS, 마케팅, 공방"
        description="좋아하는 일 하며 사는 법. 온라인 쇼핑몰, 핸드메이드, 크리에이팅, SNS 마케팅, 공간임대 사업, 재테크, 오프라인 창업까지, 새로운 시장 전반에 걸쳐 다양한 직업, 사업을 시도하는 모든 이들과 함께합니다."
        title="마인트 | 좋아하는 일 하며 사는 법"
        image={require("../img/maintlogo.png")}
        favicon={require("../img/maintlogo.png")}
      />
      <div
        className="background"
        style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}
      >
        <div
          className="wrapper"
          style={{
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "white"
          }}
        >
          <Suspense
            fallback={
              <div className="loader-page">
                <img src={require("../img/loaderspinner.gif")} />
              </div>
            }
          >
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/emailLogin" component={EmailLogin} />
              <Route exact path="/pay/:id" component={Login} />
              <Route exact path="/project/:id" component={Project} />
              <Route exact path="/pay/:id/login" component={EmailLogin} />
              <Route
                exact
                path="/toss/payment/applyId/:id"
                component={TossPayment}
              />
              <Route exact path="/project/:id/payment" component={Payment} />
              <Route exact path="/project/:id/order" component={OrderProject} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/signupComplete" component={SignupComplete} />
              <Route exact path="/category/:id" component={Category} />
              <Route exact path="/earlybird" component={EarlyBird} />
              <Route exact path="/event/:id" component={Events} />
              <Route exact path="/myproject" component={MyProjects} />
              <Route
                exact
                path="/project/:id/review"
                component={ReviewCreate}
              />

              <Route
                exact
                path="/purchaseComplete/:id"
                component={PurchaseComplete}
              />
              <Route
                exact
                path="/purchaseComplete"
                component={TossPayComplete}
              />
              <Route exact path="/mypage" component={Mypage} />
              <Route exact path="/mypage/setting" component={Mypage} />
              <Route
                exact
                path="/mypage/profile"
                component={MyProfileSetting}
              />
              <Route exact path="/mypage/payment" component={MyPayment} />
              <Route
                exact
                path="/mypage/payment/:id"
                component={MyPaymentInfo}
              />
              <Route
                exact
                path="/mypage/payment/:id/cancel"
                component={PaymentCancel}
              />
              <Route
                exact
                path="/mypage/payment/:id/cancelComplete"
                component={CancelComplete}
              />
              <Route exact path="/mypage/coupon" component={MyCoupon} />
              <Route exact path="/agreement" component={ServiceAgreement} />
              <Route exact path="/privacy" component={PrivacyPolicy} />

              {/* <Route exact path="/fullpagetest" component={FullpageProject} />
              <Route
                exact
                path="/fullpageproject"
                component={TestProjectDetail}
              /> */}
            </Switch>

            <Footer />
          </Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;
