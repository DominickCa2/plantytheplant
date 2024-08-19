import React from "react";
import { View, StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";

export default function AppLoader() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
      <LottieView
        source={require("../assets/animation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    opacity: 0.8,
  },
  text: {
    paddingTop: 100,
    fontSize: 20,
    marginBottom: 20,
  },
  animation: {
    width: 100,
    height: 100
  }
});
