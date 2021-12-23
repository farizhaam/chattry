import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    
    render() {
        const { bgcolor } = this.props.route.params;
        return (
        
        <View style={{
            flex: 1,
            alignItems:'center', 
            justifyContent:'center', 
            backgroundColor: bgcolor ? bgcolor : "white",}}>
                <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
                />
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {/* <Text style={styles.title}>You'll see your chat here</Text> */}
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 45,
        fontWeight: "bold",
        color: 'white',
        textAlign: "center",
        padding: 20
    },
})