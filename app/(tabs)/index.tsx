import { Text, View } from '@/components/Themed';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.settingsHolder}>
        <Link href="/settings" push asChild>
          <TouchableOpacity style={styles.settings} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <FontAwesome name="gear" size={40} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.title}>Welcome, Name</Text>

      <Link href="/speakWithBot" push asChild>
        <TouchableOpacity style={styles.bigButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Text style={styles.bigButtonText}>Speak with Zoe</Text>
          <View style={styles.iconHolder}>
            <FontAwesome name="microphone" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </Link>
      

      <Link href="/textBot" push asChild>
        <TouchableOpacity style={styles.bigButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
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
  settings: {
    height: 60,
    width: 60,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
  },
  settingsHolder: {
    top: -25,
    alignItems: 'flex-end',
    width: "96%"
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bigButton: {
    backgroundColor: '#0077b6',
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
    paddingRight: 6,
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
});
