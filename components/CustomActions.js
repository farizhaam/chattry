import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import * as firebase from 'firebase';
import "firebase/firestore";

export default class CustomActions extends React.Component {

    //allow user to pick image from phone library
    pickImage = async () => {
        //permission to access media library
        const { status } = await ImagePicker.useMediaLibraryPermissions();
        try{
            if(status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));
            
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({
                        image: imageUrl  
                    })
                }
            }
        } catch(error) {
            console.log(error.message);
        }
    }

    //allow user take a photo from camera
    takePhoto = async () => {
        //permission to access camera and media library
        const { status } = await Camera.requestPermissionsAsync();
            try {
                if (status === "granted") {
                    const result = await ImagePicker.launchCameraAsync().catch((error) => console.log(error));
        
                if(!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    //allow users to get their location by using GPS
    getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const result = await Location.getCurrentPositionAsync(
                {}
            ).catch((error) => console.log(error));
            const longitude = JSON.stringify(result.coords.longitude);
            const altitude = JSON.stringify(result.coords.latitude);
            if (result) {
                this.props.onSend({
                    location: {
                    longitude: result.coords.longitude,
                    latitude: result.coords.latitude,
                    },
                });
            }}
        } catch (error) {
            console.log(error.message);
        }
    };

    //store uploaded image to firebase  as blobs
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Button
                title="Pick an image from the library"
                onPress={this.pickImage}
                />
        
                <Button
                title="Take a photo"
                onPress={this.takePhoto}
                />
        
                {this.state.image &&
                <Image source={{ uri: this.state.image.uri }} style={{ width: 200, height: 200 }} />}
        
                <Button
                title="Get my location"
                onPress={this.getLocation}
                />
        
                {this.state.location &&
                <MapView
                    style={{ width: 300, height: 200 }}
                    region={{
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                />}
            </View>
        );
    }
}