import React from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from "firebase";
import "firebase/firestore";

//chattry firebase credentials
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
    constructor() {
        super();
        this.state = {
            uid: 0,
                user: {
                _id: "",
                name: "",
                avatar: "",
            }
        }
        //initializing firebase
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }
        // reference to the Firestore message collection
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
        // To remove warning message in the console 
        LogBox.ignoreLogs([
            'Setting a timer',
            'Warning: ...',
            'undefined',
            'Animated.event now requires a second argument for options',
        ]);
    }



    componentDidMount() {
        const name = this.props.route.params.name;

        //user authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();//user can sign in as anonymous
            }

            this.setState({
                uid: user.uid,
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any'
                },
            });

            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
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
            user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
            }
        });
        });
        this.setState({
        messages: messages
        });
    };

    componentWillUnmount() {
        //unsubscribe from collection updates
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
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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