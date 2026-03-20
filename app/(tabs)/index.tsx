import { Text, View } from '@/components/Themed';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      
      <Link href="/AudioRecorder" push asChild>
        <TouchableOpacity style={styles.bigButton}>
          <Text style={styles.bigButtonText}>Speak with Zoe</Text>
          <View style={styles.iconHolder}>
            <FontAwesome name="microphone" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </Link>
      

      <Link href="/" push asChild>
        <TouchableOpacity style={styles.bigButton}>
          <Text style={styles.bigButtonText}>Text Zoe</Text>
          <View style={styles.iconHolder}>
            <Feather name="message-square" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </Link>
      
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
  bigButton: {
    backgroundColor: 'blue',
    height: 220,
    width: 320,
    margin: 10,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between'
  },
  iconHolder: {
    display: 'flex',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  bigButtonText: {
    fontSize: 26,
    color: 'white',
    paddingTop: 4,
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
