import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'; // or 'react-native-linear-gradient'
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function transcription() {
  const [recording, setRecording] = useState();
  const [transcript, setTranscript] = useState("");

  async function startRecording() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);

    // Stop and send chunk every 3 seconds
    setTimeout(() => stopAndSend(recording), 3000);
  }

  async function stopAndSend(rec) {
    await rec.stopAndUnloadAsync();
    const uri = rec.getURI();
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('file', { uri, type: 'audio/m4a', name: 'speech.m4a' });

    // Send to FastAPI
    const response = await fetch(`${API_URL}/transcribe`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = await response.json();
    setTranscript(prev => prev + " " + data.text);

    // Restart recording for the next chunk
    startRecording();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#141414', paddingTop: 20 }}>
      <Pressable onPress={startRecording} style={{height: 40, width: 200, position: 'absolute', zIndex: 20, bottom: 2, alignSelf: 'center'}}><Text style={{color: '#4055F2', fontSize: 20,}}>Start Transcribing</Text></Pressable>
      
      <LinearGradient
        // Fade from solid black to fully transparent
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)']}
        pointerEvents="none"
        style={{ height: 80, width: '100%', position: 'absolute', bottom: 0}}
      />
      <ScrollView style={{height: 20, paddingTop: 20,}}>
        <Text style={{color: 'white', fontSize: 20, padding: 10}}>{transcript}</Text>
      </ScrollView>
    </View>
  );
}
