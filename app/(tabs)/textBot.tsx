import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function textBot() {
    const [height, setHeight] = useState(0); // Initial height
    const [text, setText] = useState('');
    const [listOfMessages, setlistOfMessages] = useState(["What's on your mind?", "What's on your mind?", "What's on your mind?","What's on your mind?", "What's on your mind?", "What's on your mind?","What's on your mind?", "What's on your mind?", "What's on your mind?"]);


    const sendUserMessageToModel = async (recordingUri) => {

        const formData = new FormData();

        // Extract filename
        const uriParts = recordingUri.split('/');
        const fileName = uriParts[uriParts.length - 1];

        // formData.append('user_location', "User latitude is " + location?.coords.latitude + ". User longitude is " + location?.coords.longitude);
        
        formData.append('file', {
            uri: recordingUri,
            name: fileName,
            type: 'audio/m4a',
        } as any);

        try {
            const response = await fetch(`${API_URL}/speak-with-model`, { // used to be /generate-text-response
            method: 'POST',
            body: formData, //get rid of file://
            });

            const data = await response.json(); //stuff returned from backend
            //order matters
            setlistOfMessages([...listOfMessages, data.user_text, data.model_text_response])
        } catch (error) {
            console.error('Error sending signal:', error);
            console.log('Failed to send signal. Check console and IP address.');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

            <ScrollView style={styles.scrollView}>
                {listOfMessages.map((item, index) => (
                <Text key={index} style={[styles.baseText, index % 2 === 0 ? styles.evenText : styles.oddText]}>{item}</Text>
                ))}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textBoxHolder}>
                
                <TextInput
                placeholder="Type away..."
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                multiline={true}
                onContentSizeChange={(event) => {
                    // Update height state based on content size
                    setHeight(event.nativeEvent.contentSize.height);
                }}
                onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}}
                style={[styles.textBox]} //minimum height
                />
                <Pressable onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}} style={({ pressed }) => [{ backgroundColor: pressed ? '#8bae8d' : '#8ed792' }, styles.sendButton]}>
                    <Ionicons name="send" size={30} color="black" />
                </Pressable>
            </KeyboardAvoidingView>
        
        </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollView: {
        padding: 6,
        paddingTop: 20,
    },
    textBoxHolder: {
        backgroundColor: '#dfdfdf',
        padding: 10,
        flexDirection: 'row',
    },
    textBox: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 6,
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