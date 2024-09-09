import {
  View, 
  Text, 
  StyleSheet,
  Button,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react"; 
import { useImgStore } from "./store";
import { useState } from "react"
import ImageChooser from "./imageChooser";

export default function ImageUploader() {
  const router = useRouter();
  const { meep, setMeep } = useImgStore();
  const [tim, setTim] = useState(false);

  useEffect(() => {
    if (meep) {
      setTim(false);
      router.push('/inBetweenScreen');
    }
  }, [meep]);

  const pickImg = () => {
    setTim(true);
  }

  const takePicture = () => {
    router.push('/cameraThingy');
  }

  return (
    <View style={styles.container}>
      <Button 
        title="Take a picture" 
        onPress={takePicture}
      />
      <Text style={styles.orBtn}>or</Text>
      <Button
        title="Upload an image"
        onPress={pickImg}
      />
      {tim && <ImageChooser />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }, 
  orBtn: {
    marginTop: 10,
    marginBottom: 10,
  }
});