import { useRouter } from "expo-router";
import {
    View, 
    Text, 
    Button, 
    Image, 
    StyleSheet
} from "react-native";
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import { useBobStore, usePlantStore } from "./store";
import { Audio } from 'expo-av';


export default function Stuff() {
    const plants = usePlantStore(state => state.plant);
    const bob = useBobStore(state => state.bob);
    const router = useRouter();
    const [sound, setSound] = useState();
    const [info, setInfo] = useState({
        common_name: "",
        image_url: "", 
        edible: false, 
        confidence: 0
    });

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
           require('../assets/cars.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync(); 
    }
    
    useEffect(() => {
        return sound 
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        if (plants.bobo === 'smalltim') {
            setInfo({
                ...plants
            });
        }
        else if (plants.bobo === 'bigbobby') {
            setInfo({
                common_name: plants.results[0].species.commonNames[0], 
                confidence: plants.results[0].score, 
                image_url: plants.results[0].images[0].url.o
            });
        }
    }, [])

    const handlePress = () => {
        playSound();
        router.push('/');
        Haptics.selectionAsync();
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            {
                info ? (
                    <>
                        <Text style={styles.commonName}>Here's a {info.common_name}</Text>
                        <Image source={{uri: info.image_url}} style={styles.image}/>
                        <Text>Can I eat that?</Text>
                        <Text>{info.edible ? "Yes" : "No"}</Text>
                        <Text>Confidence: {info.confidence}</Text>
                    </>
                ) : (
                    <Text style={styles.commonName}>No idea what a {bob} is</Text>
                )
            }
            <View style={styles.button}>
                <Button title="am a squid" onPress={handlePress}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }, 
    commonName: {
        fontSize: 24,
        paddingBottom: 10
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 5
    }, 
    button: {
        top: 100
    }
});
