import { useState, useRef, useEffect } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Alert, TouchableOpacity, StyleSheet } from 'react-native' 
import * as Haptics from 'expo-haptics';
import { useImgStore } from "./store";
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 
import ImageChooser from "./imageChooser";

export default function CameraThingy() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const { meep, setMeep } = useImgStore();
  const router = useRouter();
  const [squid, setSquid] = useState(false);

  useEffect(() => {
    if (meep) {
      router.push("./checkImg");
    }
  }), []

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
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function openPictures() {
    setSquid(true);
  }

  return (
    <View style={{flex: 1}}>
      <CameraView 
        ref={cameraRef}
        style={styles.cameraView}
        facing={facing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.galleryButton} 
            onPress={openPictures}
          >
            <FontAwesome6 name="images" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={takePicture}
          />
          <TouchableOpacity 
            style={styles.flipButton} 
            onPress={toggleCameraFacing}
          >  
            <MaterialIcons name="flip-camera-android" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
      {squid && <ImageChooser />}
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
    justifyContent: "space-evenly", 
    alignItems: "flex-end",
    flexDirection: "row"
  }, 
  galleryButton: {
    backgroundColor: "#9cf", 
    padding: 11, 
    marginBottom: 40, 
    borderRadius: 25, 
    width: 50, 
    height: 50
  },
  cameraButton: {
    backgroundColor: "#fff", 
    padding: 15,
    marginBottom: 30, 
    borderRadius: 40, 
    width: 70, 
    height: 70
  }, 
  flipButton: {
    backgroundColor: "#9cf", 
    padding: 12, 
    marginBottom: 40, 
    borderRadius: 25, 
    width: 50, 
    height: 50
  }
});
