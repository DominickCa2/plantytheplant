import {
  View, 
  Text, 
  StyleSheet,
  Button,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react"; 
import { useImgStore, useBubbyStore } from "./store";


export default function ImageUploader() {
  const router = useRouter();
  const { meep, setMeep } = useImgStore();

  useEffect(() => {
    if (meep) {
      router.push('/inBetweenScreen');
    }
  }, [meep]);

  const pickImg = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images
      });
      if (!result.cancelled) {
        try {
          setMeep(result.assets[0].uri);
        }
        catch (err) {
          console.log(results.assets)
          Alert.alert("Error", "An error occurred while trying to upload the image");
        }
        console.log("Image picked successfully");
      }
      else {
        console.log("Image picker cancelled");
      }
    }
    catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while trying to upload the image");
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Take a picture"
      />
      <Text style={styles.orBtn}>or</Text>
      <Button
        title="Upload an image"
        onPress={pickImg}
      />
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
