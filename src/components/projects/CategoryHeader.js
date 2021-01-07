import React, { useState } from "react";
import { Menu, Transition, Container } from "semantic-ui-react";
import CategoryBox from "./CategoryBox";

const CategoryHeader = ({ history, category }) => {
  const [visible, setVisible] = useState(false);

  const handleVisible = () => {
    setVisible(!visible);
  };

  const onClickGoBack = () => {
    history.goBack();
  };

  const onClickSearch = () => {
    history.push("/search");
  };

  return (
    <div className="category-header">
      <Menu
        borderless
        style={{ height: 63, border: "none", boxShadow: "none" }}
      >
        <Menu.Menu position="left">
          <Menu.Item onClick={onClickGoBack} style={{ paddingLeft: 25 }}>
            <i class="ri-arrow-go-back-line ri-xl"></i>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Item
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: "bold"
          }}
        >
          {category} 카테고리
        </Menu.Item>
        <Menu.Menu position="right" style={{ marginLeft: 0 }}>
          <Menu.Item>
            <i
              onClick={onClickSearch}
              style={{ paddingRight: 7 }}
              class="ri-search-line ri-xl"
            ></i>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Transition.Group animation="fade down" duration={200}>
        {visible && (
          <div
            style={{
              marginBottom: 30,
              paddingTop: 17,
              position: "absolute",
              display: "block",
              width: "100%",
              maxWidth: 640,
              top: 63,
              zIndex: 100
            }}
          >
            <div style={{ backgroundColor: "white", marginBottom: -10 }}>
              <CategoryBox history={history} />
            </div>
            <Menu
              borderless
              style={{
                paddingTop: 30,
                height: 59,
                border: "none",
                borderRadius: 10,
                boxShadow: "0 4px 4px -2px rgba(0,0,0,0.2)",
                zIndex: 1,
                marginTop: -10
              }}
              className="more-category"
            >
              <Menu.Item
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  color: "#eb4c2a",
                  fontSize: 12,
                  fontWeight: "bold",
                  paddingBottom: 17,
                  paddingTop: 0
                }}
                onClick={handleVisible}
              >
                카테고리 더보기{" "}
                <i class="ri-arrow-up-s-line" style={{ marginLeft: 5 }}></i>
              </Menu.Item>
            </Menu>
          </div>
        )}
      </Transition.Group>
      <Transition.Group animation="fade up" duration={1}>
        {!visible && (
          <div>
            <Menu
              borderless
              style={{
                height: 29,
                border: "none",
                borderRadius: 10,
                boxShadow: "0 4px 4px -2px rgba(0,0,0,0.2)",
                position: "absolute",
                width: "100%",
                top: 63,
                zIndex: 1
              }}
              className="more-category"
            >
              <Menu.Item
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  color: "#eb4c2a",
                  fontSize: 12,
                  fontWeight: "bold",
                  paddingBottom: 17,
                  paddingTop: 0
                }}
                onClick={handleVisible}
              >
                카테고리 더보기{" "}
                <i class="ri-arrow-down-s-line" style={{ marginLeft: 5 }}></i>
              </Menu.Item>
            </Menu>
          </div>
        )}
      </Transition.Group>
    </div>
  );
};

export default CategoryHeader;
