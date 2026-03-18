import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function Texting() {
  const [text, setText] = useState(''); // Initialize state to store text

    const sendTextToBackend = async () => {
        try {
        const response = await fetch(`${API_URL}/text-model`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
        });

        const data = await response.json();
        console.log(data.model_text_response);
        } catch (error) {
        console.error('Error sending text:', error);
        console.log('Error', 'Failed to send message. Check console and network connection.');
        }
    };

  return (
    <View style={styles.container}>
      <Text>Enter text here:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        onChangeText={newText => setText(newText)} // Update the state
        defaultValue={text} // Set the value from the state
      />
      <Text style={styles.displayText}>
        You typed: {text}
      </Text>
      <Button
              title="Send"
              onPress={sendTextToBackend}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  displayText: {
    marginTop: 20,
    fontSize: 16,
  },
});
