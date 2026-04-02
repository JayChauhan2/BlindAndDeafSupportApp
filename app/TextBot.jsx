import { useHeaderHeight } from '@react-navigation/elements';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

export default function TextBot() {
    const [messages, setMessages] = useState([])

    // keyboardVerticalOffset = distance from screen top to GiftedChat container
    // useHeaderHeight() returns status bar + navigation header height
    const headerHeight = useHeaderHeight()

    const sendTextToBackend = async (user_text) => {
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
        
        } catch (error) {
        console.error('Error sending text:', error);
        console.log('Error', 'Failed to send message. Check console and network connection.');
        }
    };

    useEffect(() => {
        setMessages([ //default messages to load
            {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'John Doe',
                avatar: 'https://placeimg.com/140/140/any',
            },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        sendTextToBackend(messages[0]['text'])
    }, [])

    return (
    <View style={styles.container}>
    <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        style={styles.giftedChat}
        user={{
        _id: 1,
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
    />
    <Text>asd</Text>
    </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
    },
    giftedChat: {
        marginBottom: 20,
    },
});