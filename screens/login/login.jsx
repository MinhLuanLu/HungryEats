import { useEffect, useState , useContext, useCallback} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Platform} from "react-native";
import axios from "axios";
import { UserContext } from "../../contextApi/user_context";
import AUTHENTICATION from "../../config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {SERVER_IP} from '@env';
import Animated,{
    useSharedValue,
    withTiming,
    withSpring,
    Easing,
    useAnimatedStyle,
    FadeInUp
} from "react-native-reanimated";
import { FONT } from "../../fontConfig";
import { responsiveSize } from "../../utils/responsive";

const google    = require('../../assets/icons/google.png')
const meta      = require('../../assets/icons/facebook.png')


export default function Login({displayLogin}){
    const navigate = useNavigation()
    const [email, setEmail] = useState("")
    const [password, setPasword] = useState("");

    const {publicUser, setPublicUser} = useContext(UserContext)

    const display = useSharedValue(-400)
    const opacity = useSharedValue(0.5)
    const height = useSharedValue('50%');
    const marginTop = useSharedValue('0%')
    const tranlateY = useSharedValue(0);



    const [focus, setFocus] = useState(false)
    useFocusEffect(
            useCallback(() => {
                setPasword("")
                setFocus(false)
            }, []) 
        );

    useEffect(()=>{
        if(displayLogin){
            display.value = withTiming(0, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(1, {duration:850})
        }else{
            display.value = withTiming(-400, {duration:650, easing: Easing.ease});
            opacity.value = withTiming(0.5, {duration:800})
        }

        if(focus){
            height.value = withSpring(Platform.OS === 'android' ? '55%' : '65%', {duration:1000})
            marginTop.value = withTiming(Platform.OS === 'android' ? '25%' : '-10%', {duration:600})
            tranlateY.value = withTiming(200, {duration:300})
        }
        if(!focus){
            height.value = withTiming('50%', {duration:800})
            marginTop.value = withTiming('0%', {duration:500})
            tranlateY.value = withTiming(0, {duration:300})
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

    async function SignInHandler() {
        if(email == ""){
            alert('Email is emty.')
        }if(password == ""){
            alert('Password is emty.')
        }
        
        else{
            try{ 
                const Login = await axios.post(`${SERVER_IP}/login/api`,{
                    Email: "minhlu14206@gmail.com",
                    Password: password
                })
                if(Login?.data?.success){
                    console.log(Login?.data?.message)
                    const [User] = Login?.data?.data;
                    if(User?.Role == AUTHENTICATION.private){
                        setPublicUser(User)
                        navigate.navigate("Home")
                    }
                }
            }catch(error){
                alert('Login failed, please try again');
                log.error({
                    success: false,
                    message:'Login failed, please try again',
                    data: error
                })
            }
        }
    }

    return(
        <>
            <Animated.View style={[styles.Container, AnimateLoginContainer]}>
                <Animated.View style={[styles.textInputContainer, AnimateHeight]}>
                    <TextInput 
                        style={[styles.textInput, {height: responsiveSize(45)}]} 
                        placeholder={publicUser.Email != undefined ? `${publicUser.Email}` : 'Email' } 
                        onFocus={()=> setFocus(true)} 
                        onBlur={()=>setFocus(false)}
                        value={email}
                        onChangeText={text =>{setEmail(text)}}
                    />
                    <TextInput 
                        style={[styles.textInput]} 
                        placeholder="Password" 
                        onFocus={()=> setFocus(true)}
                        onBlur={() => setFocus(false)}
                        value={password}
                        onChangeText={text => {setPasword(text)}}
                    />
                    <TouchableOpacity style={[styles.loginButton, {height: responsiveSize(43)}]} onPress={()=> SignInHandler()}>
                        <Text style={{fontSize:16, color:'white', fontFamily: FONT.SoraMedium}}>Sign In</Text>
                    </TouchableOpacity>
                    <Text style={{paddingTop:15, fontSize:responsiveSize(12),fontFamily: FONT.SoraLight, width:'95%', textAlign:'center'}}>Don't have an account? Sign Up</Text>
                </Animated.View>

                <Animated.View style={[{display:'flex', flexDirection:'row', alignSelf:'center', width:'80%', flex:0.3}, AnimateTranslate]}>
                        <View style={{flex:1, height:10, borderBottomWidth:1}}></View>
                        <Text style={{paddingLeft:10, paddingRight:10, fontFamily: FONT.SoraSemiBold, fontSize: responsiveSize(12), textAlign:'center'}}>Or continue with</Text>
                        <View style={{flex:1, height:10, borderBottomWidth:1}}></View>
                </Animated.View>

                <View style={styles.otherSigninContainer}>
                    <TouchableWithoutFeedback onPress={()=> alert('function not working at the moment')}>
                        <Animated.View style={[styles.otherSignin, AnimateTranslate]}>
                            <Image source={google} style={{width:20, height:20, marginRight:5}}/>
                            <Text>Google</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={()=> alert('function not working at the moment')}>
                        <Animated.View style={[styles.otherSignin,AnimateTranslate]}>
                            <Image source={meta} style={{width:20, height:20, marginRight:5}}/>
                            <Text>Meta</Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    Container:{
        position:'absolute',
        zIndex:999,
        width:'100%',
        borderRadius:10,
        backgroundColor:'#FFFFFF'
    },

    textInputContainer:{
        flex:2,
        width:'80%',
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },

    textInput:{
        width:'100%',
        backgroundColor:'#E0E0E0',
        marginBottom:10,
        borderRadius:8,
        paddingLeft:10,
        height:responsiveSize(45)
    },
    loginButton:{
        width:'100%',
        backgroundColor:'#008080',
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center'
    },
    otherSigninContainer:{
        flex:0.8,
        width:'80%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignSelf:'center',
    },
    otherSignin:{
        height: responsiveSize(35),
        width: responsiveSize(120),
        borderWidth:0.5,
        borderRadius:5,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
})