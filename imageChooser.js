import * as ImagePicker from 'expo-image-picker';
import { useImgStore } from "./store";
import { useEffect } from 'react';
import { View } from "react-native";

export default function ImageChooser() {
  const { meep, setMeep } = useImgStore();

  useEffect(() => {
    console.log("doing stuff");
    const dostuff = async () => {
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
    dostuff();
  }, [])
  
  return (
    <View style={{opacity: 0}}>
    </View>
  )
};
