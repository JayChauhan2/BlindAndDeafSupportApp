import AudioRecorderComponent from '@/components/AudioRecorder';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabOneScreen() {

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Oneeeeeeee</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />

      <AudioRecorderComponent></AudioRecorderComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button :{

  }
});



// export default function AudioRecorderComponent() {
//   const [recording, setRecording] = useState();
//   const [message, setMessage] = useState('');

//   // Use the hook to get recorder instance and request permissions
//   const { recorder, status, requestPermissions } = Audio.useAudioRecorder();

//   async function startRecording() {
//     try {
//       // Request permissions before starting
//       await requestPermissions(); 
//       if (status?.canRecord) {
//         // Start recording with high quality preset options
//         await recorder.start(Audio.RecordingPresets.HIGH_QUALITY);
//         setMessage('Recording started...');
//         setRecording(recorder);
//       } else {
//         setMessage('Permission to access microphone denied or cannot record');
//       }
//     } catch (err) {
//       console.error('Failed to start recording', err);
//       setMessage('Failed to start recording');
//     }
//   }

//   async function stopRecording() {
//     setMessage('Stopping recording...');
//     await recording.stop();
//     const uri = recording.getURI();
//     console.log('Recording stopped and stored at', uri);
//     setMessage('Recording stopped!');
//     setRecording(undefined);
//   }

//   return (
//     <View style={styles.container}>
//       <Button
//         title={recording ? 'Stop Recording' : 'Start Recording'}
//         onPress={recording ? stopRecording : startRecording}
//         color={recording ? 'red' : 'green'}
//       />
//       {/* You can display the recording status */}
//       {status && <Text>{message}</Text>} 
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
