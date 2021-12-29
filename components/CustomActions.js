import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
//const firebase = require("firebase");
//require("firebase/firestore");
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {

  imagePicker = async () => {
    //expo permission
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      try {
        if (status === 'granted') {
            //pick image
          const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: "Images",//Only images allowed
          }).catch((error) => console.log(error));
          //cancelled process
          if(!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({
              image: imageUrl
            });
          }
      }
      } catch (error) {
          console.log(error.message);
      }
      };

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA, 
      Permissions.MEDIA_LIBRARY
      );
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

getLocation = async () => {
  //asking user for permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  try {
    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({})
      .catch((error) => {
      console.error(error);
      });
      //send latitude and longitude to determine position on the map
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if (result) {
        this.props.onSend({
          location: {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}



  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel',];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
    {
        options,
        cancelButtonIndex,
    },
    async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
              console.log('user wants to pick an image');
              return this.imagePicker();
          case 1:
              console.log('user wants to take a photo');
              return this.takePhoto();
          case 2:
              console.log('user wants to get their location');
              return this.getLocation();
        }
    }
  );
};


    render() {
        return (
            <TouchableOpacity 
            accessible={true}
            accessibilityLabel="More options"
            accessibilityHint="Lets you choose to send an image or your geolocation."
            style={[styles.container]} 
            onPress={this.onActionPress}>
              <View style={[styles.wrapper, this.props.wrapperStyle]}>
                <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
              </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};