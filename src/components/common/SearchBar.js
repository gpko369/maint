import React, { useState, useEffect } from "react";
import { Menu, Search } from "semantic-ui-react";
import _ from "lodash";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const PROJECT_QUERY = gql`
  query {
    allProjects {
      edges {
        node {
          status
          id
          title
          category {
            category
          }
        }
      }
    }
  }
`;

const SearchBar = props => {
  const initialState = { isLoading: false, results: [], value: "" };
  const { error, loading, data } = useQuery(PROJECT_QUERY);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [values, setValues] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [projectSet, setProjectSet] = useState([]);

  const handleResultSelect = (e, { result }) =>
    props.history.push("/search?search=" + result.title);

  const handleSearchChange = (e, { value }) => {
    setValues(value);
    setSearchKeyword(value);

    setTimeout(() => {
      if (value.length < 2) {
        var re = new RegExp(_.escapeRegExp(""), "i");
      } else {
        var re = new RegExp(_.escapeRegExp(value), "i");
      }
      const isMatch = result => re.test(result.title);

      setIsLoading(false);
      setResults(_.filter(projectSet, isMatch));
    }, 100);
  };

  useEffect(() => {
    if (data) {
      var temp = [];
      data.allProjects.edges.map((project, i) => {
        if (project.node.status != 0) {
          temp.push({
            title: project.node.title
          });
        }
      });
      setProjectSet(temp);
    }
  }, [data]);

  const onClickGoBack = () => {
    props.history.goBack();
  };

  const onClickSearch = () => {
    props.history.push("/search?search=" + searchKeyword);
  };

  return (
    <Menu
      className="search-bar"
      borderless
      style={{ height: 63, width: "100%" }}
    >
      <Menu.Menu position="left">
        <Menu.Item onClick={onClickGoBack} style={{ paddingLeft: 25 }}>
          <i class="ri-arrow-go-back-line ri-xl"></i>
        </Menu.Item>
      </Menu.Menu>
      <Menu.Item
        style={{
          paddingLeft: 1,
          paddingRight: 2,
          width: "calc(100% - 123px)"
        }}
      >
        <form
          onSubmit="return onClickSearch()"
          id="333"
          style={{ width: "100%" }}
        >
          <Search
            onKeyDown
            input={{ type: "text", name: "search" }}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 100, {
              leading: true
            })}
            results={results}
            showNoResults={false}
            loading={loading}
            value={values}
            {...props}
          />
        </form>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={onClickSearch} style={{ paddingRight: 25 }}>
          <i class="ri-search-line ri-xl"></i>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default SearchBar;
