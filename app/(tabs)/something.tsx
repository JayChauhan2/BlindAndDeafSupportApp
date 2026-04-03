// you left off trying to figure out how to create stack whenever user presses the click button camera
import * as Haptics from 'expo-haptics';

import {
    CameraMode,
    CameraType,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { useRef, useState } from "react";
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState('');
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // no videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) { //image has been selected!
      setUri(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const formData = new FormData();

    // Extract filename
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg', // or 'image/png'
    } as any);

    const url = selectedIndex === 0 ? 'read-text' : 'describe-scene';
    
    try {
      const response = await fetch(`${API_URL}/` + url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json(); //stuff returned from backend
      Speech.speak(data.model_text_response); //say the response aloud
    } catch (error) {
      console.error('Error sending signal:', error);
      console.log('Failed to send signal. Check console and IP address.');
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }




  const renderPicture = () => {
    return (
      <View style={styles.holder}>

        <Pressable style={styles.backButton} onPress={() => {setUri(""); Speech.stop();}} ><Text style={styles.buttonText}>Take another picture</Text></Pressable>
        <Image
          source="app/favicon.png"
          contentFit="contain"
          style={styles.image}
        />
        <ScrollView style={styles.scroll}>
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec urna in sapien sagittis laoreet sit amet in quam. Cras maximus tempus venenatis. Vestibulum tincidunt suscipit ante, eu tristique metus consectetur sit amet. Phasellus eget sem vulputate, facilisis magna sed, convallis risus</Text>
        </ScrollView>

      </View>
    );
  };


  return (
    <View style={styles.container}>
      {renderPicture()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#0000FF',
    textDecorationLine: 'underline', // This underlines the text
  },
  gradient: {
    height: 100, width: 320, position: 'absolute', bottom: 44, zIndex: 0
  },
  scroll: {
    padding: 15,
    width: 320,
    maxHeight: 300,
    zIndex: 1,
  },
  text: {
    padding: 2,
    fontSize: 18,
    paddingBottom: 20,
  },
  holder: {
    alignItems: 'center',
  },
  image: {
    width: 320, 
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'red' 
  }
});