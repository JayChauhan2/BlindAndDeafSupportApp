import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

const API_URL = 'http://127.0.0.1:8000';

export default function AudioRecorderComponent() {

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingPath, setRecordingPath] = useState('');
  
  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    Speech.stop();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    // const sound = require('../speech.wav');
    await audioRecorder.stop();
    setRecordingPath(audioRecorder.uri.slice(7))
    console.log(recordingPath)
    try {
      const response = await fetch(`${API_URL}/generate-text-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signal_data: recordingPath || 'No uri path' }) //get rid of file://
      });

      const data = await response.json(); //stuff returned from backend
      Speech.speak(data.model_text_response); //say the response aloud
    } catch (error) {
      console.error('Error sending signal:', error);
      console.log('Failed to send signal. Check console and IP address.');
    }
  };

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={recorderState.isRecording ? stopRecording : record}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
