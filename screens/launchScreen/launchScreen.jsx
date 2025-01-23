import { StyleSheet,View,Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../../contextApi/user_context";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";
const background = require('../../assets/images/launch_image_background.png')


export default function Launch_Screen(){
    const navigate = useNavigation()
    const {public_Order_Status, setPublic_Order_Status}         = useContext(UserContext)

    
        useFocusEffect(
            useCallback(() => {
              setPublic_Order_Status([])
            }, []) 
          );
    
    

    return(
        <View style={styles.Container}>
            <View style={styles.top_Layer}>
                <Image style={styles.background_Image} source={background}/>
            </View>
            <View style={styles.bottom_Layer}>
                <View>
                    <Text style={{fontWeight:'bold', fontSize:38, textAlign:'center', paddingTop:10}}>Fast & easy food {'\n'} for you</Text>
                    <Text style={{fontSize:16, textAlign:'center', paddingTop:5}}>Our food is ready for you. {'\n'} You will get what you want in no time.</Text>
                    <LottieView
                        autoPlay
                        source={require('../../assets/lottie/food.json')}
                        style={{width:60, height:70, alignSelf:'center'}}
                    />
                </View>

                <View style={styles.button_Container}>
                    <TouchableOpacity style={styles.start_Button} onPress={()=> navigate.navigate('login')}>
                        <Text style={{fontSize:22, fontWeight:'300', color:'#FFFFFF', textAlign:'center'}}>Get started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius:30,
        borderBottomLeftRadius:30,
        backgroundColor:'#E0E0E0'
    },

    background_Image:{
        width:'90%',
        height:'90%',
        borderRadius:40
    },

    bottom_Layer:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },

    button_Container:{
        flex:1,
        justifyContent:'center',
        width:'85%',
    },

    start_Button:{
        backgroundColor:'#008080',
        height:66,
        justifyContent:'center',
        borderWidth:0,
        borderRadius:15,
    }


})