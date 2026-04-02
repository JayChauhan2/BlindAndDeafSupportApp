// import {
//     AudioModule,
//     RecordingPresets,
//     setAudioModeAsync,
//     useAudioRecorder,
//     useAudioRecorderState
// } from 'expo-audio';
// import * as Speech from 'expo-speech';
// import * as SpeechTranscriber from "expo-speech-transcriber";
// import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

// const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function transcribe() {
//  //once every 4 seconds
//   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
//   const recorderState = useAudioRecorderState(audioRecorder);
//   const [recordingPath, setRecordingPath] = useState('');
//   const intervalRef = useRef(0);

//   const sendUserMessageToModel = async (recordingUri) => {

//     const formData = new FormData();

//     // Extract filename
//     const uriParts = recordingUri.split('/');
//     const fileName = uriParts[uriParts.length - 1];

//     formData.append('file', {
//       uri: recordingUri,
//       name: fileName,
//       type: 'audio/m4a',
//     } as any);

//     try {
//         const response = await fetch(`${API_URL}/transcribe`, { // used to be /generate-text-response
//             method: 'POST',
//             body: formData, //get rid of file://
//             headers: {
//             'Content-Type': 'multipart/form-data',
//             },
//         });

//         const data = await response.json(); //stuff returned from backend
//         // Speech.speak(data.model_text_response); //say the response aloud
//         console.log("model response: " + data.model_text_response);
//     } catch (error) {
//         console.error('Error sending signal:', error);
//         console.log('Failed to send signal. Check console and IP address.');
//     }
//     }

//     const record = async () => {
//         await audioRecorder.prepareToRecordAsync();
//         audioRecorder.record();
//         Speech.stop();
//     };

//     const stopRecording = async () => {
//         // The recording will be available on `audioRecorder.uri`.
//         // const sound = require('../speech.wav');
//         await audioRecorder.stop();
//         if ((audioRecorder?.uri) && (audioRecorder.uri.length > 0)) {
//             setRecordingPath(audioRecorder.uri);
//             sendUserMessageToModel(audioRecorder.uri);
//         }
//         console.log(typeof audioRecorder.uri)
//     };

//     useEffect(() => {
//         (async () => {
//             const status = await AudioModule.requestRecordingPermissionsAsync();
//             if (!status.granted) {
//                 Alert.alert('Permission to access microphone was denied');
//             }

//             setAudioModeAsync({
//                 playsInSilentMode: true,
//                 allowsRecording: true,
//             });
//         })();

//     }, []);

//     const liveTranscription = async () => {

//         // Request permissions
//         // Note: requestPermissions() is only needed on iOS
//         if (Platform.OS === "ios") {
//             const speechPermission = await SpeechTranscriber.requestPermissions();
//             if (speechPermission !== "authorized") {
//                 console.log("Speech permission denied");
//                 // return;
//             }
//         }

//         const micPermission = await SpeechTranscriber.requestMicrophonePermissions();
//         if (micPermission !== "granted") {
//             console.log("Microphone permission denied");
//             // return;
//         }

//         // Use the hook for realtime updates
//         const { text, isFinal, error, isRecording } =
//         SpeechTranscriber.useRealTimeTranscription();

//         // Start transcription
//         await SpeechTranscriber.recordRealTimeAndTranscribe();
//         console.log(text)
//         // Stop when done
//         // SpeechTranscriber.stopListening();
//     };

//     useEffect(() => {
//         liveTranscription();

//     }, []);
    
//     return (
//         <View style={styles.container}>
//             <Button
//             title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
//             onPress={recorderState.isRecording ? stopRecording : record}
//             />
//         </View>
//     );
    return (
        <View>
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//     },
// });
