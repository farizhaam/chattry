import React, {Component} from 'react';
import { ImageBackground, Image, StyleSheet, View, Text, TextInput, Pressable} from 'react-native';

const image = require('../assets/images/bg.png');
const icon = require('../assets/username_icon.svg');

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };
    }

    render() {
        return (
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode='cover' style={styles.image}>
                <View style={styles.titlebox}>
                    <Text style={styles.title}>Chattry</Text>                
                </View>
                <View style={styles.box}>
                    <View style={styles.inputbox}>
                        <Image source={icon} style={styles.usericon}/>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                            placeholder='Your Name'
                        ></TextInput>
                    </View>
                    <View style={styles.colorbox}>
                        <Text style={styles.colortext}>Choose Background Color</Text>
                        <View style={styles.colorpalette}>
                            <View style={styles.color1}></View>
                            <View style={styles.color2}></View>
                            <View style={styles.color3}></View>
                            <View style={styles.color4}></View>
                        </View>
                    </View>
                    <Pressable style={styles.button} onPress={() => this.props.navigation.navigate('Chat')}>  
                        <Text style={styles.buttontext}>Start Chatting</Text>
                    </Pressable>
                </View>
            </ImageBackground>

        </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titlebox:{
        height: "44%",
        width: "88%"
    },
    title: {
        fontSize: 45,
        fontWeight: "bold",
        color: 'white',
        textAlign: "center",
        padding: 20
    },
    box: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white", 
        height: "44%",
        width: "88%"
    },
    inputbox: {
        flexDirection: 'row',
        width:"88%",
        borderColor: '#757083', 
        borderWidth: 1,
        padding: 10
    },
    usericon:{
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 0.5
    },
    colorbox:{
        flexDirection: 'column',
        padding: 20,
        marginRight: 'auto',
        width: "88%"
    },
    colortext:{
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 1,
        padding: 5,
    },
    colorpalette: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    color1:{
        flexDirection: 'row',
        backgroundColor: '#090C08',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    color2:{
        flexDirection: 'row',
        backgroundColor: '#474056',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    color3:{
        flexDirection: 'row',
        backgroundColor: '#8A95A5',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    color4:{
        flexDirection: 'row',
        backgroundColor: '#B9C6AE',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    button: {
        flexDirection: 'column',
        backgroundColor: "#757083", 
        width: "88%"
    },
    buttontext: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'white',
        textAlign: "center",
        padding: 20
    }
});