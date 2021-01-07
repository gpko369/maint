import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import BootPay from "bootpay-js";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css"; // import styles

const BootpayTest = () => {
  const onChange = content => {
    console.log("onChange", content);
  };

  return (
    <ReactSummernote
      value="Default value"
      options={{
        height: 350,
        fontSizeUnits: ["1px", "1pt"],
        toolbar: [
          ["style", ["style"]],
          ["font", ["bold", "underline", "clear", "fontsize", "fontsizeunit"]],
          ["fontname", ["fontname"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "video"]],
          ["view", ["fullscreen", "codeview", "help"]]
        ]
      }}
      onChange={onChange}
    />
  );
};

export default BootpayTest;
