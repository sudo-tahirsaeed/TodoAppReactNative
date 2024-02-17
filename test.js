import * as React from "react";
import { SearchBar } from "@rneui/base";
export default () => {
  const [value, setValue] = React.useState("");
  return (
    <SearchBar
      platform="default"
      clearIcon={{
        name: "close",
        color: "#D03632",
        size: 25,
      }}
      cancelIcon={{ name: "edit", color: "red" }}
      containerStyle={{
        width: "80%",
        borderRadius: "35px",
      }}
      inputContainerStyle={{ backgroundColor: "white" }}
      inputStyle={{}}
      leftIconContainerStyle={{}}
      rightIconContainerStyle={{ margin: "10px" }}
      lightTheme
      loadingProps={{}}
      onChangeText={(newVal) => setValue(newVal)}
      onClearText={() => console.log(onClearText())}
      placeholder="Search Task"
      placeholderTextColor="#888"
      round
      showCancel
      showLoading
      cancelButtonTitle="Close"
      cancelButtonProps={{}}
      onCancel={() => console.log(onCancel())}
      value={value}
    />
  );
};
