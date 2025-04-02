import { StyleSheet, View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export default function Loading() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View style={styles.Container}>
            <Animated.View style={[styles.animateContainer, animatedStyle]}>
                <View style={styles.box}></View>
            </Animated.View>
            <Text style={{paddingTop:10, color:'#ffffff', fontSize:18, fontWeight:'600', textAlign:'center'}}>Waiting...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    animateContainer: {
        width: 50,
        height: 50,
        backgroundColor: "#008080",
        justifyContent: "center",
        alignItems: "center",
    },

    box: {
        width: 40,
        height: 40,
        backgroundColor: "#FF9F0D",
    },
});