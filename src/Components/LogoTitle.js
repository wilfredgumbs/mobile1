import React from "react";
import { Image, Platform } from "react-native";

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={{
          uri:
            "https://raw.githubusercontent.com/wilfredgumbs/React-Frelief/master/client/src/pages/Home/logo.png"
        }}
        style={{ width: 30, height: 30, marginRight: "auto" }}
      />
    );
  }
}

export default LogoTitle;
