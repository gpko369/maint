import React from "react";
import gql from "graphql-tag";
import { Container, Grid, Image } from "semantic-ui-react";

const CategoryBox = ({ history }) => {
  const onClickCategoryLink = link => {
    history.push(link);
  };
  const categoryList = [
    {
      name: "온라인쇼핑몰",
      image: require("../../img/category/shoppingmall.png")
    },
    {
      name: "핸드메이드",
      image: require("../../img/category/handmade.png")
    },
    { name: "크리에이팅", image: require("../../img/category/creating.png") },
    { name: "SNS마케팅", image: require("../../img/category/marketing.png") },
    { name: "공간임대", image: require("../../img/category/spacesharing.png") },
    { name: "재테크", image: require("../../img/category/investment.png") },
    {
      name: "오프라인창업",
      image: require("../../img/category/offlinebusiness.png")
    }
  ];
  return (
    <Grid columns={4} style={{ fontSize: 14, margin: 0 }}>
      {categoryList.map((category, i) => {
        return (
          <Grid.Column
            textAlign="center"
            style={{
              paddingLeft: 5,
              paddingRight: 5
            }}
            key={i}
            onClick={() => onClickCategoryLink("/category/" + (i + 1))}
          >
            <Grid.Row>
              <Image
                style={{
                  height: 32,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                src={category.image}
              />
            </Grid.Row>
            <Grid.Row style={{ marginTop: 10, color: "rgb(53,53,53)" }}>
              {category.name}
            </Grid.Row>
          </Grid.Column>
        );
      })}
    </Grid>
  );
};

export default CategoryBox;
