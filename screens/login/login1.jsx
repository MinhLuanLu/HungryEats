import { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native";
import Animated,{
    useSharedValue,
    withTiming,
    withSpring,
    Easing,
    useAnimatedStyle,
    FadeInUp
} from "react-native-reanimated";


export default function Login1({displayLogin}){
    const display = useSharedValue(-400)
    const opacity = useSharedValue(0.5)

    useEffect(()=>{
        if(displayLogin){
            display.value = withTiming(0, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(1, {duration:850})
        }else{
            display.value = withTiming(-400, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(0.5, {duration:800})
        }
    },[displayLogin])

    const AnimateLoginContainer = useAnimatedStyle(()=>{
        return{
            bottom: display.value,
            opacity: opacity.value
        }
    })

    return(
        <>
            <Animated.View style={[styles.Container, AnimateLoginContainer]}>
                <Text>iuyhuiyh</Text>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    Container:{
        backgroundColor: 'grey',
        height:'50%',
        position:'absolute',
        zIndex:999,
        width:'100%',
        bottom: -400
    }
})