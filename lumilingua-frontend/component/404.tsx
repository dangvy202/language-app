import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Notfound = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lottie/404.json")}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
    </View>
  );
};

export default Notfound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
