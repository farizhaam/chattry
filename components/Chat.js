import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, Day } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import * as firebase from 'firebase';
import "firebase/firestore";

//chattry firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQm3NiiTSHFSv1hCH0uIrty6eADzpc3FE",
    authDomain: "chattry-e3b2d.firebaseapp.com",
    projectId: "chattry-e3b2d",
    storageBucket: "chattry-e3b2d.appspot.com",
    messagingSenderId: "633452684804",
    appId: "1:633452684804:web:a2ef3999739ecb21203751",
    measurementId: "G-XHEPD4MNS1"
};


export default class Chat extends React.Component {
    constructor(props){
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
        };
    
        //initializing firebase
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }
        // reference to the Firestore messages collection
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
         // To remove warning message in the console 
        LogBox.ignoreLogs([
            'Setting a timer',
            'Warning: ...',
            'undefined',
            'Animated.event now requires a second argument for options',
        ]);
    
    }
    
    //retrieve chat from asyncStorage
    async getMessages(){
        let messages = '';
        try {
            //wait until asyncStorage promise settles
            messages = await AsyncStorage.getItem('messages') || [];//set empty if there is no storage item
            this.setState({
                messages: JSON.parse(messages)//convert the saved string back into an object
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        // Set the page title once Chat is loaded
        let { name } = this.props.route.params
        // Adds the name to top of screen
        this.props.navigation.setOptions({ title: name })
    
        // user can sign in anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
        
            //update user state with currently active user data
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });
            // listens for updates in the collection
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate)
        });
    
        //retrieve chat from asyncstorage
        this.getMessages();
    }
    
    
    // when updated set the messages state with the current data 
    onCollectionUpdate = (querySnapshot) => { 
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user
            });
        });
        this.setState({
            messages: messages
        });
    };

    //unsubscribe from collection updates
    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
    }
    
    // Add messages to database
    addMessages() { 
        const message = this.state.messages[0];
        // add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user
        });
    }
    
    //save newly added messages to state.messgaes
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    //delete stored messages
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    
    // calback function for when user sends a message
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages();
            this.saveMessages();
        })
    }
    
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000',
                        opacity: 0.75
                    },
                }}
            />
        )
    }

    //change color for day in system message
    renderDay(props) {
        return <Day {...props} textStyle={{ color: "#fff" }} />;
    }

    render() {
        // Set the background color selected from start screen
        const { bgColor } = this.props.route.params;
        return (
            <View style={{
                flex: 1,
                alignItems:'center', 
                justifyContent:'center', 
                backgroundColor: bgColor ? bgColor : "#fff",}}>
                <View style={styles.giftedChat}>
                <GiftedChat
                    renderDay={this.renderDay}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={this.renderBubble}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar
                    }}
                    />
                    { Platform.OS === 'android' ? (
                        <KeyboardAvoidingView behavior="height" />
                    ) : null}
                </View>
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