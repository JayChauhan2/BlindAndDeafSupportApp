
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';

export function SettingsButton(props) {
    return (
        <View style={{marginBottom: 20}}>
            <Pressable onPress={() => console.log("poop")} style={({ pressed }) => [{ backgroundColor: pressed ? '#ececec' : '#ffffff', borderColor: pressed ? '#D16002' : 'orange' }, styles.button]}>
                <View style={styles.textsHolder}>
                    <Text style={styles.title}>{props.title}</Text> 
                    <Text style={styles.subtitle}>{props.subtitle}</Text>
                </View>
                
                <View style={styles.iconHolder}>
                    <Text style={{fontSize: 20, color: 'orange'}}>></Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
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
});
