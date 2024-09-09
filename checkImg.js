import { View, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useImgStore } from "./store";
import { useEffect } from 'react';

export default function CheckImg() {
  const { meep, setMeep } = useImgStore();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: meep }} style={styles.img}/>
      <View style={styles.options}>
        <Button title="Retry" onPress={() => {router.push("./cameraThingy")}}/>
        <Button title="Ok" onPress={() => {router.push("inBetweenScreen")}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }, 
  img: {
    flex: 0.9,
    borderBottomEndRadius: 100
  }, 
  options: {
    flex: 0.1,
    flexDirection: "row", 
    justifyContent: "space-evenly",
    alignItems: "center", 
    backgroundColor: "#259"
  }
})
