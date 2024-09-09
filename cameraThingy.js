import { useState, useRef, useEffect } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, Alert, Button, TouchableOpacity, StyleSheet } from 'react-native' 
import * as Haptics from 'expo-haptics';
import { useImgStore } from "./store";
import { useRouter } from 'expo-router';
import CheckImg from "./checkImg";

export default function CameraThingy() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { meep, setMeep } = useImgStore();
  const router = useRouter();

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    Alert.alert(
      "Alert",
      "We need your permission to use the camera", 
      [
        {
          text: "Ok", 
          onPress: requestPermission
        }, 
        {
          text: "Cancel", 
          onPress: goBack
        }
      ]
    )
    return (
      <View style={styles.container}>
      </View>
    );
  }

  const goBack = () => {
    router.push("/");
  }

  const takePicture = async () => {
    console.log("taking picture");
    Haptics.selectionAsync();
    const picture = await cameraRef.current.takePictureAsync();
    console.log("Here's a picture: ");
    setMeep(picture.uri);
    router.push("./checkImg");
  }

  return (
    <View style={{flex: 1}}>
      <CameraView 
        ref={cameraRef}
        style={styles.cameraView}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={takePicture}
          />
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  cameraView: {
    flex: 1, 
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end", 
    alignItems: "center"
  },
  cameraButton: {
    backgroundColor: "#fff", 
    padding: 15,
    marginBottom: 30, 
    borderRadius: 40, 
    width: 70, 
    height: 70
  }
});