import { Text, View } from '@/components/Themed';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      {/*       
      <Link href="/settings" push asChild>
        <TouchableOpacity style={styles.settings}>
          <FontAwesome name="gear" size={40} color="black" />
        </TouchableOpacity>
      </Link> */}
      <StatusBar style="dark" />
      {/* Speak Mode */}
      <Text style={styles.title}>Home</Text>
      <Link href="/speakWithBot" push asChild>
        <TouchableOpacity style={styles.bigButton}>
          <Text style={styles.bigButtonText}>Speak with Clara</Text>
          <View style={styles.iconHolder}>
            <FontAwesome name="microphone" size={40} color="white" />
          </View>
        </TouchableOpacity>
      </Link>
      
      {/* Text Mode */}
      <Link href="/textBot" push asChild>
        <TouchableOpacity style={styles.bigButton}>
          <Text style={styles.bigButtonText}>Text Clara</Text>
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
    backgroundColor: 'white'
  },
  settings: {
    height: 60,
    width: 60,
    borderWidth: 2,
    borderRadius: 200,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
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
  button :{

  }
});