import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function textBot() {
    const [text, setText] = useState('');
    const [listOfMessages, setlistOfMessages] = useState(["What's on your mind?"]);

    const sendTextToBackend = async (user_text) => {
        setText("")
        setlistOfMessages(listOfMessages => [...listOfMessages, user_text]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            const response = await fetch(`${API_URL}/text-model`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: user_text }),
            });

            const data = await response.json();
            console.log(data.model_text_response);
            setlistOfMessages(listOfMessages => [...listOfMessages, data.model_text_response]);

        } catch (error) {
            console.error('Error sending text:', error);
            console.log('Error', 'Failed to send message. Check console and network connection.');
        }
    };

    return (
        
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {listOfMessages.map((item, index) => (
                <Text key={index} style={[styles.baseText, index % 2 === 0 ? styles.evenText : styles.oddText]}>{item}</Text>
                ))}

            </ScrollView>
            {/* platform that moves up while typing */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textBoxHolder}>
                <TextInput
                placeholder="Type away..."
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                multiline={true}
                onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}}
                style={[styles.textBox]} //minimum height
                />
                <Pressable onPress={() => sendTextToBackend(text)} style={({ pressed }) => [{ backgroundColor: pressed ? '#8bae8d' : '#8ed792' }, styles.sendButton]}>
                    <Ionicons name="send" size={30} color="black" />
                </Pressable>
            </KeyboardAvoidingView>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#dfdfdf'
    },
    baseText: {
        fontSize: 16,
        width: 185,
        padding: 8,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: 'white',

    },
    evenText: {
        backgroundColor: '#0077b6',
    },
    oddText: {
        // left: 200
        alignSelf: 'flex-end',
        backgroundColor: '#0e583d',
    },
    scrollView: {
        padding: 6,
    },
    textBoxHolder: {
        backgroundColor: '#dfdfdf',
        padding: 10,
        flexDirection: 'row',
        marginBottom: 100,
    },
    textBox: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 6,
        paddingTop: 10,
        minHeight: 40,
        flex: 2.5,
        maxHeight: 85,
        textAlignVertical: 'top',
    },
    sendButton: {
        flex: 0.6,
        marginLeft: 6,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        minHeight: 40,

    }
    
});