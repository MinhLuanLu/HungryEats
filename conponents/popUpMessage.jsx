import { StyleSheet, Text, TouchableOpacity, View, Modal, Image } from "react-native";
import { useState, useEffect } from "react";
import { responsiveSize } from "../utils/responsive";
import { FONT } from "../fontConfig";

const checkedIcon = require('../assets/icons/checkedIcon.png')
const discountIcon = require('../assets/icons/discount.png')

export default function PopUpMessage ({displayPopUpMessage, title, message, onclose, type, data = undefined}){

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
                        <Image resizeMode="cover" style={{width:70, height:70}} source={type == "discount" ? discountIcon : checkedIcon}/>
                    </View>
                    <View style={styles.textConatiner}>
                        <Text style={{fontSize:30, fontWeight:'bold', textAlign:'center'}}>{title}</Text>
                        <Text style={{fontSize:14, fontWeight:'regular', textAlign:'center', width:'90%', alignSelf:'center'}}>{message}</Text>
                    </View>
                {data != undefined &&
                    <View>
                        {data.map((item, index)=>(
                            <Text style={{fontSize:14, fontWeight:'regular', textAlign:'center', width:'90%', alignSelf:'center'}} key={index}>{item.Discount_code} ({item.Discount_value}{item.Discount_type == "percentage" && "% Off"})</Text>
                        ))}
                    </View>
                }
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    messageContainer:{
        width:'80%',
        height:320,
        backgroundColor:'#f8f8f8',
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