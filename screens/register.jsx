import { StyleSheet, View, Text, TextInput, TouchableOpacity , Image} from "react-native";
import { useState, useEffect } from "react";
import {SERVER_IP} from '@env'
const google = require('../assets/icons/google.png')
const apple = require('../assets/icons/apple.png')
const facebook = require('../assets/icons/facebook.png')

export default function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirm_Password] = useState('')
    const [username, setUsername] = useState('')
    const [accept_term_condition, setAccept_Term_Condition] = useState(false)


    async function Handle_Continue_Button(){
        let data = {
            "Email": email,
            "Username": username,
            "Password": password,
            "Accept_term_condition": accept_term_condition,
            "Role": "User"
        }
        if(email == "" || username == "" || password == '' || password != confirm_password){
            alert('Input values are not correct. Try again.')
        }
        else{
            await fetch(`${SERVER_IP}/register/api`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            .then(res=>{
                if(res.ok){
                    return res.json().then(data=>{
                        if(data){
                            console.log(data)
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
    }
    

    return(
        <View style={styles.Conatiner}>
            <View style={styles.middle_layer}>
                <View style={{width:'90%', alignSelf:'center'}}>
                    <Text style={{fontWeight:'semibold', paddingTop:30, fontSize:16, fontWeight:500}}>Email</Text>
                    <TextInput placeholder="Enter your email" style={styles.input} value={email} onChangeText={text => setEmail(text)}/>

                    <Text style={{fontWeight:'semibold', fontSize:16, fontWeight:500}}>Username</Text>
                    <TextInput placeholder="Enter Username" style={styles.input} value={username} onChangeText={text => setUsername(text)}/>

                    <Text style={{fontWeight:'semibold', fontSize:16, fontWeight:500}}>Password</Text>
                    <TextInput placeholder="Enter password" style={styles.input} value={password} onChangeText={text => setPassword(text)}/>

                    <Text style={{fontWeight:'semibold', fontSize:16, fontWeight:500}}>Confirm Password</Text>
                    <TextInput placeholder="Enter password" style={styles.input} value={confirm_password} onChangeText={text => setConfirm_Password(text)}/>

                    <View style={{marginTop:10}}>
                        <Text style={{ fontSize:15, fontWeight:500}}>I accept the terms & Condition</Text>
                    </View>
                </View>
                
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'70%', alignSelf:'center', marginTop:30}}>
                    <TouchableOpacity style={styles.image_Container}>
                        <Image resizeMode="cover" style={styles.image} source={google}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.image_Container}>
                        <Image resizeMode="cover" style={styles.image} source={apple}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.image_Container}>
                        <Image resizeMode="cover" style={styles.image} source={facebook}/>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.bottom_layer}>
                <View style={{flex:1, justifyContent:'center'}}>
                    <TouchableOpacity style={styles.continue_button} onPress={()=> Handle_Continue_Button()}>
                        <Text style={{fontWeight:'semibold', fontSize:18, color:'#FFFFFF', textAlign:'center'}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Conatiner:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        backgroundColor:'#F9F9F9'
    },

    middle_layer:{
        flex:2,
    },

    bottom_layer:{
        flex:1,
        justifyContent:'center'
    },

    input:{
        borderWidth:0.5,
        borderRadius:5,
        borderColor:'#636366',
        marginTop:10,
        marginBottom:10,
        paddingLeft:10,
        height:45,
        fontSize:15
    },

    continue_button:{
        width:'90%',
        height:56,
        backgroundColor:'#008080',
        borderRadius:10,
        alignSelf:'center',
        justifyContent:'center'
    },

    image_Container:{
        backgroundColor:'#FFFFFF',
        height:64,
        width:64,
        borderWidth:0.2,
        borderRadius:64,
        justifyContent:'center'
    },

    image:{
        width:'50%',
        height:'50%',
        alignSelf:'center'
    }
})