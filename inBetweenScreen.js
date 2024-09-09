import {
  View, 
  Text, 
  StyleSheet, 
  Button, 
  Pressable, 
  Image,
  Alert
} from "react-native";
import { useEffect, useState } from "react";
import { useImgStore, usePlantStore, useBubbyStore } from "./store";
import { useRouter } from "expo-router";
import axios from "axios";
import AppLoader from "./apploader";
import ImageChooser from "./imageChooser";

export default function InBetweenScreen() {
  const organs = ["auto", "leaf", "bark", "fruit", "flower"];

  const router = useRouter();

  const setPlants = usePlantStore(state => state.setPlant); 
  const { meep, setMeep } = useImgStore();
  const bubby = useBubbyStore((state) => state.bubby);
  const addBubby = useBubbyStore((state) => state.addBubby);
  const clearBubby = useBubbyStore((state) => state.clearBubby)
  const [organ, setOrgan] = useState("auto");
  const [finding, setFinding] = useState(false);
  const [starbuck, setStarbuck] = useState(false);

  const API_KEY = "2b10IYefYkVQY8mBB8KF48UE0u";
  const API_URL = "https://my-api.plantnet.org/v2/identify/all"; 

  // Actually identify the plant using the images
  useEffect(() => {
    const jupermuper = async () => {
      if (!organ) {
        Alert.alert("Big error", "No plant parts selected");
        return;
      }

      if (!Array.isArray(bubby) || !bubby.length) {
        Alert.alert("Error", "No plant parts selected");
        return;
      }

      const parts = bubby.map(bub => bub.organ);
      const imgs = bubby.map(bub => ({
        uri: bub.img, 
        name: 'image.jpg',
        type: 'image/jpg'
      }));
      
      const formData = new FormData();
      
      for (let i = 0; i < parts.length; i++) {
        formData.append('organs', parts[i]);
        formData.append('images', imgs[i]);
      }

      try {
        const params = {
          "api-key": API_KEY, 
          "include-related-images": true
        }
        const response = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }, 
          params: params
        });
        setPlants({
          bobo: 'bigbobby',
          ...response.data
        });
        setMeep(null);
        setOrgan("");
        setStarbuck(false);
        clearBubby();
        router.push('/stuff');
      }
      catch (error) {
        console.error("Failed to identify plant", error);
        Alert.alert("Error", "Failed to identify plant");
      }
    }
    if (finding) {
      jupermuper();
    }
  }, [finding]);

  const identifyPlant = () => {
    if (!meep) {
      Alert.alert("Error", "No image selected");
      return;
    }
    necesitasHelp(false); // don't upload another image
    setFinding(true);
  }

  // upload another image
  const necesitasHelp = (pear) => {
    const newbub = {
      organ: organ, 
      img: meep
    }
    addBubby(newbub);
    // if user wants to upload another image
    if (pear) { 
      setMeep(null);
      setStarbuck(true);
    }
  }

  // list organs
  const Ham = () => (
    <>
    {
      organs.map(butt => (
        <Pressable
          style={({ pressed }) => [
            styles[butt],
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => {
            setOrgan(butt);
          }} 
          key={butt}
        >
          <Text style={styles.label} key={`${butt}Text`}>{butt}</Text>
        </Pressable>
      ))
    }
    </>
  )

  return (
    <View style={styles.container}>
      {meep && (
        <Image source={{ uri: meep }} style={styles.img} />
      )}
      <Text style={styles.prompt}>Select Plant Part</Text>
      <View style={styles.subcontainer}>
        <Ham />
      </View>
      <Button title="Identify Plant" onPress={identifyPlant} />
      <Text style={{textAlign: "center"}}>OR</Text>
      <Button title="Upload Another Image" onPress={() => necesitasHelp(true)}/>
      {finding && <AppLoader />}
      {starbuck && <ImageChooser />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  }, 
  prompt: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    padding: 10,
  },
  subcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  img: {
    height: 200, 
    width: "100%"
  },
  auto: {
    backgroundColor: "#3644a3",
    height: 100, 
    width: "50%"
  },
  leaf: {
    backgroundColor: "#49a1d4",
    height: 100, 
    width: "50%"
  }, 
  bark: {
    backgroundColor: "#68b9cd",
    height: 100, 
    width: "50%"
  }, 
  fruit: {
    backgroundColor: "#92cfb8",
    height: 100, 
    width: "50%"
  },
  flower: {
    backgroundColor: "#b7e0cb",
    height: 100, 
    width: "50%"
  }, 
  label: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
  }, 
  android_ripple: {
    color: "white",
    radius: 30
  }
});