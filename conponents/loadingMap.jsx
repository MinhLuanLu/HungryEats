import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
export default function LoadingMap() {
    const { height, width } = Dimensions.get('window'); // Get screen dimensions

    return (
        <View style={[styles.container, { height, width }]}>
            <LottieView
                autoPlay
                source={require('../assets/lottie/maps_loading.json')}
                style={styles.maps_loading}
            />
            <LottieView
                autoPlay
                source={require('../assets/lottie/text_loading.json')}
                style={styles.text_loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'stransparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    maps_loading: {
        width:200,
        height:200
    },
    text_loading:{
        width:150,
        height:100
    }
});
