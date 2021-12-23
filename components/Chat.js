import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000',
                        opacity: 0.75
                    }
                }}
            />
        )
    }

    componentDidMount() {
        const name = this.props.route.params.name;

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
                    text: name + ' has joined the chat.',
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
                <View 
                style={styles.giftedChat}>
                    <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                    />                
                </View>

                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {/* <Text style={styles.title}>You'll see your chat here</Text> */}
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center', 
        justifyContent:'center'
    },
    giftedChat: {
        flex: 1,
        width: "88%",
        paddingBottom: 10,
        justifyContent: "center",
        borderRadius: 5,
    },
})