import { SettingsButton } from '@/components/SettingsButton';
import { ThemeContext } from '@/components/ThemeContext';
import { View } from '@/components/Themed';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text } from 'react-native';

export default function SettingsPage() {

  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.section}>
        <Text style={styles.headingTitle}>
            Personalization
        </Text>
        
        <SettingsButton link="/aboutyou" title="About You" subtitle="Update your personal information"/>
        <SettingsButton title="About your AI" subtitle="Customize your AI's traits"/>
      </View>
      <View style={styles.section}>
        <Text style={styles.headingTitle}>
              asiuhdiaushd
        </Text>
        <SettingsButton title="Title" subtitle="Subtitle"/>  
        <View style={{marginBottom: 20}}>
            <Pressable onPress={() => console.log("poop")} style={({ pressed }) => [{ backgroundColor: pressed ? '#ececec' : '#ffffff', borderColor: pressed ? '#D16002' : 'orange' }, styles.button]}>
                <View style={styles.textsHolder}>
                    <Text style={styles.title}>a</Text> 
                    <Text style={styles.subtitle}>a</Text>
                </View>
                
                <View style={styles.iconHolder}>
                  <Switch 
                    value={currentTheme === "dark"}
                    onValueChange={() => 
                      toggleTheme(currentTheme === "light" ? "dark" : "light")
                    }
                  />
                </View>
            </Pressable>
          </View>
      </View>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 60,
    borderRadius: 20,
    flexDirection: 'row',
    borderWidth: 2,
  },
  textsHolder: {
    flex: 2,
    backgroundColor: 'none'
  },
  iconHolder: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'none'
  },
  title: {
    fontSize: 15,
    marginBottom: 8
    
  },
  subtitle: {
    fontSize: 15,
    color: '#868686'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  /////
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  headingTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  scrollView: {
    paddingTop: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'red',
  },
});
