import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../Context_API/user_context";
import {SERVER_IP} from '@env'
import { useNavigation } from "@react-navigation/native";

const app_logo = require('../assets/images/app_logo.png')
const google = require('../assets/icons/google.png')
const facebook = require('../assets/icons/facebook.png')
const apple = require('../assets/icons/apple.png')

export default function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigation()

    const {public_Username, setPublic_Username} = useContext(UserContext)
    const { publicEmail, setPuclicEmail} = useContext(UserContext)

    function Handle_Login_Button(){
        let data = {
            "Email": email,
            "Password": password
        }

        if(email == "" || password == ""){
            alert('Emty email or Password')
        }else{
            Handle_login(data)
        }
    }

    async function Handle_login(data){
        await fetch(`${SERVER_IP}/login/api`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res=>{
            if(res.ok){
                return res.json().then(data=>{
                    if(data){   
                        
                        if(data.User_info[0]['Role'] == "User"){
                            setPublic_Username(data.User_info[0]["Username"])
                            setPuclicEmail(data.User_info[0]["Email"])
                            navigate.navigate("Home")
                        }
                    }
                })
            }
            if(res === 400){
                return res.json()
            }
        })
        .catch(error=>{
            console.error(error)
        })

    }

    useEffect(()=>{
        if(publicEmail != ""){
            setEmail(publicEmail)
        }
    },[])

    return(
        <View  style={styles.Container}>
            <View style={styles.top_Layer}>
                <Image resizeMode="cover" style={{width:110, height:110}} source={app_logo}/>
                <Text style={{fontSize:25, fontWeight:600, letterSpacing:2}}>HungryEats</Text>
            </View>
            <View style={styles.middle_Layer}>
                
                <View style={{width:'95%', alignSelf:'center'}}>
                    <Text>Email</Text>
                    <TextInput placeholder="Your email" style={styles.text_Input}
                         onChangeText={text=>{setEmail(text)}}
                         value={email}
                    />
                    <Text>Password</Text>
                    <TextInput placeholder="Your password" style={styles.text_Input}
                        onChangeText={text=>{setPassword(text)}}
                        value={password}
                    />
                </View>

                <TouchableWithoutFeedback>
                    <Text style={{width:'95%', alignSelf:'center', fontSize:15, textDecorationLine:'underline', fontWeight:400, marginBottom:15}}>forgot password</Text>
                </TouchableWithoutFeedback>

                <TouchableOpacity style={styles.login_button} onPress={()=> Handle_Login_Button()}>
                    <Text style={{fontSize:18, fontWeight:500, color:'#FFFFFF', textAlign:'center'}}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop:20}} onPress={()=> navigate.navigate("register")}>
                    <Text style={{textAlign:'center', fontSize:16, textDecorationLine:'underline'}}>Register</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottom_Layer}>
                <TouchableOpacity style={{backgroundColor:'#d7d7d7', width:65, height:65, borderRadius:60, marginLeft:15, marginRight:15, justifyContent:'center', alignItems:'center'}}>
                    <Image resizeMode="cover" style={{width:37, height:37}} source={google}/>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor:'#d7d7d7', width:65, height:65, borderRadius:60, marginLeft:15, marginRight:15, justifyContent:'center', alignItems:'center'}}>
                    <Image resizeMode="cover" style={{width:40, height:40}} source={apple}/>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor:'#d7d7d7', width:65, height:65,borderRadius:60, marginLeft:15, marginRight:15, justifyContent:'center', alignItems:'center'}}>
                    <Image resizeMode="cover" style={{width:40, height:40}} source={facebook}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
    },

    top_Layer:{
        flex:1.3,
        justifyContent:'center',
        alignItems:'center'
    },

    middle_Layer:{
        flex:2,
    },

    bottom_Layer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center'
    },

    text_Input:{
        borderWidth:0.2,
        paddingLeft:10,
        marginTop:8,
        marginBottom:15,
        height:50,
        fontSize:15,
        borderRadius:5
    },

    login_button:{
        backgroundColor:'#008080',
        height:50,
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        justifyContent:'center'
    }



})