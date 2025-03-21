import { StyleSheet, Text, TouchableOpacity, View, Modal, Image } from "react-native";
import { useState, useEffect } from "react";

const checkedIcon = require('../assets/icons/checkedIcon.png')

export default function PopUpMessage ({displayPopUpMessage, title, message, onclose}){

    return(
        <Modal
            visible={displayPopUpMessage}
            animationType="fade"
            hardwareAccelerated={true}
            transparent={true}
        >
            <View style={styles.Container}>
                <View style={styles.messageContainer}>
                    <View style={styles.iconContainer}>
                        <Image resizeMode="cover" style={{width:70, height:70}} source={checkedIcon}/>
                    </View>
                    <View style={styles.textConatiner}>
                        <Text style={{fontSize:30, fontWeight:'bold', textAlign:'center'}}>{title}</Text>
                        <Text style={{fontSize:14, fontWeight:'regular', textAlign:'center', width:'90%', alignSelf:'center'}}>{message}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={()=> onclose()}>
                            <Text style={{fontSize:18, fontWeight:'semibold', color:'#fff', textAlign:'center'}}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
    },

    messageContainer:{
        width:'80%',
        height:320,
        backgroundColor:'#fff',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10,
        borderRadius:5
    },

    iconContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

    textConatiner:{
        flex:1,
        justifyContent:'center'
    },

    buttonContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

    button:{
        backgroundColor:'#008080',
        width:'70%',
        height:60,
        borderRadius:10,
        justifyContent:'center'
    }

})