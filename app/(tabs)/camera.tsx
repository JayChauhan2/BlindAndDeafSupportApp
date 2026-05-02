import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [modelResponse, setModelResponse] = useState("");

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
    
    // send request to API 
    try {
      const response = await fetch(`${API_URL}/` + url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json(); //stuff returned from backend
      console.log(data.model_text_response)
      Speech.speak(data.model_text_response); //say the response aloud
      setModelResponse(data.model_text_response);
    } catch (error) {
      console.error('Error sending signal:', error);
      console.log('Failed to send signal. Check console and IP address.');
    }
  };


  const pickImage = async () => {
    // Get users permissions to access their library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    // Haptic alert
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

  if (!permission) {
    return null;
  }

  // alert user of granting permission
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

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    console.log("The phone uri is " + photo?.uri)
    if (photo?.uri) setUri(photo.uri);
    // if (photo?.uri) sendUserPicToModel(String(photo.uri).slice(7));
    if (photo?.uri) uploadImage(photo.uri);
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  // switching from front to back camera and vice versa
  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderPicture = (uri: string) => {
    return (
      <View style={{flex: 1, paddingTop: 200, backgroundColor: "#eaeaea",alignItems: 'center', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'none'}}>
        <View>
          <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
          />
          <Button onPress={() => {setUri(""); Speech.stop(); setModelResponse("")}} title="Take another picture" />
          </View>
          <ScrollView>
            <Text>{modelResponse}</Text>
          </ScrollView>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />

        <View style={styles.shutterContainer}>
          <Pressable onPress={pickImage}>
            <AntDesign name="picture" size={32} color="white" />
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
        
        {/* toggling between read and describe mode */}
        <View style={styles.toggleHolder}>
          <SegmentedControl
            values={['Read', 'Describe']}
            selectedIndex={selectedIndex}
            tintColor="#007AFF" // Selected segment background
            backgroundColor="rgb(0, 0, 0, 1)" // Inactive segments background
            style={{height: 40, borderRadius: 200}}
            fontStyle={{ color: '#bcbcbc', fontSize: 20, }} // Unselected text color
            activeFontStyle={{ color: 'rgb(255, 255, 255)', fontSize: 20 }} // Selected text color
            onChange={(event) => {
              setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture(uri) : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleHolder: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: "absolute",
    bottom: 10,
    width: "100%",
    paddingLeft: 80,
    paddingRight: 80,
    height: 60,
  },
  cameraContainer: StyleSheet.absoluteFill,
  camera: StyleSheet.absoluteFill,
  shutterContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});