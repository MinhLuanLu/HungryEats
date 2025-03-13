import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import Animated,{
    useSharedValue,
    withTiming,
    withSpring,
    Easing,
    useAnimatedStyle,
    FadeInUp
} from "react-native-reanimated";

const google                                                    = require('../../assets/icons/google.png')
const meta                                                  = require('../../assets/icons/facebook.png')


export default function Login1({displayLogin}){
    const display = useSharedValue(-400)
    const opacity = useSharedValue(0.5)
    const height = useSharedValue('50%');
    const marginTop = useSharedValue('0%')
    const tranlateY = useSharedValue(0)

    const [focus, setFocus] = useState(false)

    useEffect(()=>{
        if(displayLogin){
            display.value = withTiming(0, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(1, {duration:850})
        }else{
            display.value = withTiming(-400, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(0.5, {duration:800})
        }

        if(focus){
            height.value = withSpring('55%', {duration:1000})
            marginTop.value = withTiming('25%', {duration:600})
            tranlateY.value = withTiming(200, {duration:100})
        }
        if(!focus){
            height.value = withTiming('50%', {duration:800})
            marginTop.value = withTiming('0%', {duration:500})
            tranlateY.value = withTiming(0, {duration:100})
        }
    },[displayLogin, focus])

    const AnimateLoginContainer = useAnimatedStyle(()=>{
        return{
            bottom: display.value,
            opacity: opacity.value,
            height: height.value,
        }
    })

    const AnimateHeight = useAnimatedStyle(()=>{
        return{
            marginTop: marginTop.value
        }
    })

    const AnimateTranslate = useAnimatedStyle(()=>{
        return{
            transform: [{translateY: tranlateY.value}]
        }
    })

    return(
        <>
            <Animated.View style={[styles.Container, AnimateLoginContainer]}>
                <Animated.View style={[styles.textInputContainer, AnimateHeight]}>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="Email" 
                        onFocus={()=> setFocus(true)} 
                        onBlur={()=>setFocus(false)}
                    />
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="Password" 
                        onFocus={()=> setFocus(true)}
                    />
                    <TouchableOpacity style={styles.loginButton}>
                        <Text>Sign In</Text>
                    </TouchableOpacity>
                    <Text>Don't have an account? Sign Up</Text>
                    <Text>Or continue with</Text>
                </Animated.View>
                
                <View style={styles.otherSigninContainer}>
                    <Animated.View style={[styles.otherSignin, AnimateTranslate]}>
                        <Image source={google} style={{width:20, height:20}}/>
                        <Text>Google</Text>
                    </Animated.View>
                    <Animated.View style={[styles.otherSignin,AnimateTranslate]}>
                        <Image source={meta} style={{width:20, height:20}}/>
                        <Text>Meta</Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    Container:{
        backgroundColor: 'white',
        height:'50%',
        position:'absolute',
        zIndex:999,
        width:'100%',
    },

    textInputContainer:{
        flex:2,
        width:'80%',
        alignSelf:'center',
        justifyContent:'center'
    },

    textInput:{
        width:'100%',
        height:45,
        backgroundColor:'#C0c0c0',
        marginBottom:10,
        borderRadius:8
    },
    loginButton:{
        width:'100%',
        height:45,
        backgroundColor:'#008080',
        borderRadius:8
    },
    otherSigninContainer:{
        flex:1,
        width:'80%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
    },
    otherSignin:{
        height:50,
        width:'50%',
        borderWidth:1,
    }
})