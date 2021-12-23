import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


export default class Chat extends React.Component {
    render() {
        const { bgcolor } = this.props.route.params;
        return (
        
        <View style={{
            flex: 1,
            alignItems:'center', 
            justifyContent:'center', 
            backgroundColor: bgcolor ? bgcolor : "white",}}>
            <Text style={styles.title}>You'll see your chat here</Text>
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