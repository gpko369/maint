import React, { useState, useEffect } from "react";
import {
  Menu,
  Image,
  Container,
  Search,
  Input,
  Responsive,
  Sidebar,
  Icon,
  Segment,
  Divider
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { Query } from "react-apollo";
import _ from "lodash";
import MobileHeader from "./MobileHeader";

const LOGOUT_MUTATION = gql`
  mutation {
    logoutToken {
      message
    }
  }
`;

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
    }
  }
`;

const ALL_PROJECTS = gql`
  query {
    allProjects {
      edges {
        node {
          title
          coach {
            name
          }
        }
      }
    }
  }
`;

const initialState = { isLoading: false, results: [], value: "" };

const SearchBar = props => {
  const [search, setSearch] = useState(initialState);

  let source = [];
  props.data.allProjects.edges.map((project, i) => {
    source.push({ title: project.node.title, coach: project.node.coach.name });
  });

  const handleResultSelect = (e, { result }) =>
    setSearch({ value: result.title });

  const handleSearchChange = (e, { value }) => {
    setSearch({ isLoading: true, value: value });

    setTimeout(() => {
      //if (search.value.length < 4) return setSearch(initialState);

      const re = new RegExp(_.escapeRegExp(search.value), "i");
      const isMatch = result => re.test(result.title);

      setSearch({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 500);
  };

  const { isLoading, value, results } = search;

  return (
    <Search
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 100, {
        leading: true
      })}
      results={results}
      value={value}
      {...props}
      style={{ width: 300 }}
    />
  );
};

//헤더 컴포넌트
const Header = props => {
  const [activeItem, setActiveItem] = useState("");
  const [logoutQuery] = useMutation(LOGOUT_MUTATION);
  const [auth, { data }] = useLazyQuery(IS_AUTHENTICATED);

  const handleLogout = () => {
    logoutQuery();
  };

  const moveToLogin = () => {
    return <Redirect to="/login" />;
  };

  const onClickMenuItem = (e, { name }) => {
    setActiveItem(name);
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <Menu style={{ marginBottom: 0, borderRadius: 0 }} borderless>
      <Responsive
        as={Container}
        minWidth={1080}
        fluid
        style={{
          height: 55,
          paddingLeft: 50,
          paddingRight: 50,
          width: "100%"
        }}
      >
        <Menu.Item style={{ border: "0 0 0 0" }} href="/">
          <Image
            src="https://i.ibb.co/b2T5ZbV/logo-black-2x.png"
            alt="logo-black-2x"
            style={{ height: 32 }}
          />
        </Menu.Item>
        <Menu.Item style={{ border: "0 0 0 0" }}>
          <Input
            className="icon"
            icon="search"
            placeholder="프로젝트에 관심이 있으신가요?"
            style={{ width: 450 }}
          />
          {/* <Query query={ALL_PROJECTS}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return null;
              return <SearchBar data={data} />;
            }}
          </Query> */}
        </Menu.Item>
        <Menu
          secondary
          style={{ alignItems: "flex-end", marginLeft: "auto", marginRight: 0 }}
        >
          <Menu.Item name="프로젝트" href="/project" />
          <Menu.Item name="마이페이지" href="/mypage" />
          <Query query={IS_AUTHENTICATED}>
            {({ error, loading, data }) => {
              if (loading) return null;
              if (error)
                return (
                  <Menu.Item
                    name="로그인"
                    onClick={moveToLogin}
                    href="/login"
                  />
                );
              if (data)
                return (
                  <Menu.Item
                    name="로그아웃"
                    onClick={handleLogout}
                    href="/login"
                  />
                );
            }}
          </Query>
        </Menu>
      </Responsive>
      <MobileHeader />
    </Menu>
  );
};

export default Header;
