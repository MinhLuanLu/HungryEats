import { StyleSheet,View,Text, TouchableOpacity, Image, Pressable, TouchableWithoutFeedback, Dimensions , Platform} from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../../contextApi/user_context";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";
import Login from "../login/login";
import { FONT } from "../../fontConfig";
import { listFonts } from "../../fontConfig";
import { useFonts } from "expo-font";
import Animated,{
    Easing,
    FadeInDown,
    FadeInUp,
    FadeOutUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withDelay,
    withSpring
} from "react-native-reanimated";
const background = require('../../assets/images/launch_image_background.png');
import { responsiveSize } from "../../utils/responsive";
import {registerForPushNotificationsAsync} from "../../expo-Notification";



export default function Launch_Screen(){
    const navigate = useNavigation()
    const {publicPendingOrder, setPublicPendingOrder}         = useContext(UserContext);
    const {expoPushToken, setExpoPushToken}                   = useContext(UserContext)
    const [displayLogin, setDisplayLogin]                     = useState(false)

    const imageSize = useSharedValue('75%');
    const opacity = useSharedValue(1)
    const scrollDown = useSharedValue(0);
    const [loadFonts] = useFonts(listFonts);

    useEffect(()=>{
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
        }).catch(error => console.log(error))
    },[])

    useFocusEffect(
        useCallback(() => {
            setPublicPendingOrder([])
        }, [])
    );

    useEffect(()=>{
        imageSize.value = withSpring('90%', {duration:3000, easing: Easing.ease, mass:1});        
    },[]);

    
    
    const imageAnimation = useAnimatedStyle(()=>{
        return{
            width: imageSize.value,
            height: imageSize.value
        }
    })

    useEffect(()=>{
        if(displayLogin){
            opacity.value = withTiming(0, {duration:600});
            scrollDown.value = withTiming(-400, {duration:1000})
        }else{
            opacity.value = withTiming(1, {duration:1200})
            scrollDown.value = withSpring(0, {duration:3500, delay:800})
        }
    },[displayLogin])
    
    const AnimateScroll = useAnimatedStyle(()=>{
        return{
            opacity: opacity.value,
            bottom: scrollDown.value
        }
    })


    return(
        <>
            <View style={styles.Container}>
                <View style={styles.top_Layer}>
                    <TouchableWithoutFeedback onPress={()=> setDisplayLogin(false)}>
                        <Animated.Image style={[styles.background_Image, imageAnimation]} source={background}/>
                    </TouchableWithoutFeedback>
                </View>
                <Animated.View style={[styles.bottom_Layer, AnimateScroll]}>
                    <View style={{flex:1}}>
                        <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(1500)} style={{fontSize: responsiveSize(32), textAlign:'center', paddingTop:10, fontFamily: FONT.SoraSemiBold}}>Fast & easy food {'\n'} for you</Animated.Text>
                        <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000).delay(200)} style={{fontSize:responsiveSize(14), textAlign:'center', paddingTop:5, fontFamily: FONT.SoraRegular}}>Our food is ready for you. {'\n'} You will get what you want in no time.</Animated.Text>
                        <LottieView
                            autoPlay
                            source={require('../../assets/lottie/food.json')}
                            style={{width:100, height:80, alignSelf:'center'}}
                        />
                    </View>

                    <Animated.View  entering={FadeInDown.duration(500).delay(200)} style={styles.button_Container}>
                        <TouchableOpacity style={[styles.start_Button, {height: responsiveSize(50)}]} onPress={()=> setDisplayLogin(true)}>
                            <Text style={{fontSize: responsiveSize(17), color:'#FFFFFF', textAlign:'center', fontFamily: FONT.SoraLight}}>Get started</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </View>

            <Login displayLogin={displayLogin}/>
        </>
    )
}

const styles = StyleSheet.create({

    Container:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        backgroundColor:'#F9F9F9'
    },

    top_Layer:{
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius:30,
        borderBottomLeftRadius:30,
        backgroundColor:'#E0E0E0',
        position:'absolute',
        width:'100%',
        height:'50%',
    },

    background_Image:{
        width:'90%',
        height:'90%',
        borderRadius:40
    },

    bottom_Layer:{ 
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        position:'absolute',
        width:'100%',
        height:'50%',
        bottom:0
    },

    button_Container:{
        flex:1,
        justifyContent:'center',
        width:'75%',
    },

    start_Button:{
        backgroundColor:'#008080',
        justifyContent:'center',
        borderWidth:0,
        borderRadius:15,
    }


})