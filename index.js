import {
  View, 
  Button, 
  Text,
  Alert, 
  StyleSheet, 
  TextInput
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { usePlantStore, useBobStore } from "./store";
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AppLoader from "./apploader"; 
import axios from "axios";

const API_URL = "https://trefle.io/api/v1/plants/";
const OTHER_URL = "https://trefle.io/api/v1/species/";
const API_TOKEN = "4UEuFiWGKUD7Nl-vk4Tzic4nupf-S7VTddr5bau3WWs";

export default function App() {
  const [grape, noGrape] = useState(false);
  const [finding, setFinding] = useState(false);
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef(null);
  const { bob, setBob } = useBobStore();

  const router = useRouter();
  const setPlants = usePlantStore(state => state.setPlant);

  useEffect(() => {
    noGrape(false);
  }, []);
  
  useEffect(() => {
    const findPlant = async () => {
      try {
        const res = await axios.get(API_URL, {
          params: {
            token: API_TOKEN, 
            "filter[common_name]": bob
          }
        });
        const thingy = res.data.data[0];
        if (!thingy) {
          console.log("Plant not found");
          setPlants(null);    // see if this is still necessary later
          router.push('/stuff');
        }

        // Get detailed response
        const plantRes = await axios.get(OTHER_URL + thingy.id, {
          params: {
            token: API_TOKEN
          }
        });

        const speces = plantRes.data.data;

        setPlants({
          bobo: 'smalltim',
          ...speces
        });
        router.push('/stuff');
      } catch (error) {
        console.error('Failed to find plant', error);
      }
    };
    if (grape)
      findPlant();
  }, [grape]); 

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync()
          .then(() => {
            console.log('Recorder unloaded successfully');
            recordingRef.current = null;
          })
          .catch(error => {
            console.log('Failed to unload recorder:', error.message);
            // Even if there's an error, we should null out the ref
            recordingRef.current = null;
          });
      }
    }
  }, []);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      recording.setOnRecordingStatusUpdate(statusUpdate);
      await recording.startAsync();

      recordingRef.current = recording;
      setRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        console.log('Recording stopped and unloaded');
      } else {
        console.log('No active recording to stop');
      }
    } catch (error) {
      console.error('Error stopping recording:', error.message);
    } finally {
      recordingRef.current = null;
      setRecording(false);
    }
  };

  const statusUpdate = (status) => {
    if (status.metering) {
      const currentVolume = status.metering;
      setVolume(currentVolume);

      // Check if the volume is above a certain threshold (indicating yelling)
      if (currentVolume > -20) { // Adjust this threshold as needed
        stopRecording();
        noGrape(prev => !prev);
        setFinding(true);
      }
    }
  };

  const handlePress = () => {
    Haptics.selectionAsync();
    noGrape(prev => !prev);
    setFinding(true);
    /*
    Alert.alert(
      "Big alert",
      "I am a squid", 
      [
        {
          text: "Yes", 
          onPress: () => router.push('/stuff')
        }
      ]
    );
    */
  };

  return (
      <View style={{
        backgroundColor: "#fff",
        flex: 1,
      }}>
        <Button
          title={recording ? "Stop Recording" : "Start Recording"}
          onPress={recording ? stopRecording : startRecording} 
          color="gray"
        />
        <View style={styles.container}>
          <Text style={styles.searchLabel}>What your plant called</Text>
          <TextInput 
            style={styles.input} 
            value={bob}
            onChangeText={(words) => setBob(words)}
          />
          <Button 
            title="Find a plant" 
            onPress={handlePress} 
            color="gray"
          />
          <Text style={styles.or}>or</Text>
          <Button 
            title="Take a Picture" 
            color="gray"
            onPress={() => router.push('/imageUploader')}
          />
        </View>
        {finding && <AppLoader />}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    width: 200,
    marginBottom: 10, 
    borderRadius: 5,
    paddingLeft: 5, 
    paddingRight: 5, 
    textAlign: "center"
  },
  searchLabel: {
    fontSize: 20,
    color: "white",
    paddingBottom: 5
  },
  or: {
    padding: 10, 
    fontSize: 20, 
    color: "white"
  }
});