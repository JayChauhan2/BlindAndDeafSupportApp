import { FontAwesome } from '@expo/vector-icons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient'; // or 'react-native-linear-gradient'
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function speakWithBot() {

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingPath, setRecordingPath] = useState('');
  const [isPressed, setPressed] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [listOfMessages, setlistOfMessages] = useState(["Hey! How's your day going?"]);

  const sendUserMessageToModel = async (recordingUri) => {

    const formData = new FormData();

    // Extract filename
    const uriParts = recordingUri.split('/');
    const fileName = uriParts[uriParts.length - 1];

    formData.append('user_location', "User latitude is " + location?.coords.latitude + ". User longitude is " + location?.coords.longitude);
    console.log("user location is : " + location?.coords);
    
    formData.append('file', {
      uri: recordingUri,
      name: fileName,
      type: 'audio/m4a',
    } as any);

    try {
      const response = await fetch(`${API_URL}/speak-with-model`, { // used to be /generate-text-response
        method: 'POST',
        body: formData, //get rid of file://
      });

      const data = await response.json(); //stuff returned from backend
      //order matters
      Speech.speak(data.model_text_response); //say the response aloud
      setlistOfMessages([...listOfMessages, data.user_text, data.model_text_response])
    } catch (error) {
      console.error('Error sending signal:', error);
      console.log('Failed to send signal. Check console and IP address.');
    }
  }

  const record = async () => {
    setPressed(!isPressed);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    Speech.stop();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    // const sound = require('../speech.wav');
    setPressed(!isPressed);
    await audioRecorder.stop();
    if ((audioRecorder?.uri) && (audioRecorder.uri.length > 0)) {
      setRecordingPath(audioRecorder.uri);
      sendUserMessageToModel(audioRecorder.uri);
    }
    // console.log(typeof audioRecorder.uri);
  };

  useEffect(() => { //microphone permission
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => { //location permission
    (async () => {
      // 1. Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // 2. Get current position
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords);
  }

  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
          {listOfMessages.map((item, index) => (
            <Text key={index} style={[styles.baseText, index % 2 === 0 ? styles.evenText : styles.oddText]}>{item}</Text>
          ))}
          <View style={{marginBottom: 250}}></View>
        </ScrollView>

      <LinearGradient
        // Fade from solid black to fully transparent
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
        pointerEvents="none"
        style={{ height: 340, width: '100%', position: 'absolute', bottom: 0}}
      />
      <View style={styles.buttonHolder}>
        <TouchableOpacity onPress={recorderState.isRecording ? stopRecording : record} style={styles.button}>
        <FontAwesome name={recorderState.isRecording ? 'check' : "microphone"} size={50} color="white" />
      </TouchableOpacity></View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  baseText: {
    fontSize: 16,
    width: 185,
    padding: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: 'white',

  },
  evenText: {
    backgroundColor: '#0077b6'
  },
  oddText: {
    // left: 200
    alignSelf: 'flex-end',
    backgroundColor: '#006400',
  },
  scrollView: {
    padding: 6,
    paddingTop: 20,
    paddingBottom: 200
  },
  buttonHolder: {
    alignItems: 'center',
  },
  button: { // maybe pentagon shape taking inspiration from something hmmm
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#006400',
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    marginBottom: 80,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  }
});
