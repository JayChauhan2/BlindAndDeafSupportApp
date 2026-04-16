// import { Text, View } from '@/components/Themed';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeContext } from '@/components/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {

  const { currentTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, {backgroundColor: currentTheme === "dark" ? Colors.darkBg : Colors.lightBg}]}>

      <View style={styles.settingsHolder}>
          <TouchableOpacity style={[styles.settings, {borderColor: currentTheme === "dark" ? Colors.lightBg : Colors.darkBg}]} >
          <Link href="/settings" push asChild onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <FontAwesome name="gear" size={40} color={currentTheme === "dark" ? Colors.lightBg : Colors.darkBg} />
          </Link>
          </TouchableOpacity>
      </View>

      <Text style={[styles.title, {color: currentTheme === "dark" ? Colors.lightBg : Colors.darkBg}]}>Welcome, Name</Text>
      
      {/* ITS THE FREAKING LINK ELEMENT THATS CAUSING THINGS TO BREAK. IM GONNA BREAK ITS NECK. */}
        {/* <TouchableOpacity  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}> */}

        <Link href="/speakWithBot" push asChild style={[styles.bigButton, {zIndex: 20000, backgroundColor: currentTheme === "dark" ? Colors.lightBg : Colors.userValue}, {justifyContent: 'space-between',}]}>
          <View> 
          <Text style={[styles.bigButtonText, {color: currentTheme === "dark" ? Colors.userValue : Colors.lightBg}]}>Speak with Zoe</Text>
          <View style={styles.iconHolder}>
            <FontAwesome name="microphone" size={40} color={currentTheme === "dark" ? Colors.userValue : Colors.lightBg} />
          </View>
          </View>
        </Link>
        
        {/* </TouchableOpacity> */}
      

      
        <TouchableOpacity style={[styles.bigButton, {backgroundColor: currentTheme === "dark" ? Colors.lightBg : Colors.userValue}]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Link href="/textBot" push asChild style={{justifyContent: 'space-between', height: "100%"}}>
          <View>
          <Text style={[styles.bigButtonText, {color: currentTheme === "dark" ? Colors.userValue : Colors.lightBg}]}>Text Zoe</Text>
          <View style={styles.iconHolder}>
            <Feather name="message-square" size={40} color={currentTheme === "dark" ? Colors.userValue : Colors.lightBg} />
          </View>
          </View>
          </Link>
        </TouchableOpacity>
      

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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    borderWidth: 2,
    borderColor: 'black'
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
