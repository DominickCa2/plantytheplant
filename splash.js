import React from "react";
import { View, StyleSheet } from "react-native"; 
import LottieView from "lottie-react-native";

export default function Splash({ setIsLoading }) {
  console.log("splashy");
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/tree_animation.json")}
        autoPlay
        loop={false} 
        style={styles.animation}
        onAnimationFinish={() => setIsLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#abc",
    alignItems: "center",
    justifyContent: "center",
    margin: 0
  }, 
  animation: {
    width: 500,
    height: 500
  }
});
