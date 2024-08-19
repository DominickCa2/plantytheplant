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

export default function InBetweenScreen() {
  const organs = ["auto", "leaf", "bark", "fruit", "flower"];

  const router = useRouter();

  const setPlants = usePlantStore(state => state.setPlant); 
  const { meep, setMeep } = useImgStore();
  const { bubby, setBubby } = useBubbyStore();
  const [organ, setOrgan] = useState("");

  const API_KEY = "2b10IYefYkVQY8mBB8KF48UE0u";
  const API_URL = "https://my-api.plantnet.org/v2/identify/all";

  const identifyPlant = async () => {
    if (!meep) {
      Alert.alert("Error", "No image selected");
      return;
    }
    necesitasHelp(false);
    if (!Array.isArray(bubby)) {
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
    formData.append('organs', parts);
    formData.append('images', imgs);

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
      router.push('/stuff');
    }
    catch (error) {
      console.error("Failed to identify plant", error);
      Alert.alert("Error", "Failed to identify plant");
    }
  }

  // upload another image
  const necesitasHelp = (pear) => {
    const newbub = {
      organ: organ, 
      img: meep
    }
    setMeep(null);
    setOrgan("");
    setBubby(prevbub => [...prevbub, newbub]);
    if (pear) // if user wants to upload another image
      router.push('/imageUploader');
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
            setOrgan(butt)
            console.log(butt);
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
        // Change meep[0] later
      )}
      <Text style={styles.prompt}>Select Plant Part</Text>
      <View style={styles.subcontainer}>
        <Ham />
      </View>
      <Button title="Identify Plant" onPress={identifyPlant} />
      <Text style={{textAlign: "center"}}>OR</Text>
      <Button title="Upload Another Image" onPress={() => necesitasHelp(true)}/>
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
