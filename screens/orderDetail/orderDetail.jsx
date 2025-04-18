import { StyleSheet, View, Text, TouchableOpacity, Modal, Image , SafeAreaView} from "react-native";
import { useEffect, useState } from "react";
import { FONT } from "../../fontConfig";
import { responsiveSize } from "../../utils/responsive";


const downArrow = require('../../assets/icons/down_arrow.png')

export default function OrderDetail({onclose}){

    return(
        <Modal
            visible={true}
            animationType="fade"
        >
            <SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center', flex:1, alignItems:'center'}}>
                        <TouchableOpacity style={styles.iconContainer} onPress={()=> onclose()}>
                            <Image resizeMode="cover" source={downArrow} style={{width:30, height:30}}/>
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:17}}>Your orders</Text>
                        </View>
                        <View style={styles.editContainer}>
                            <TouchableOpacity onPress={()=> editButtonHandler()}>
                                <Text style={{fontFamily:FONT.SoraRegular}}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:0.5, backgroundColor:'#ffffff', width:'90%', alignSelf:'center', marginBottom:8, borderRadius:50, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', position:'relative'}}>
                        <View style={{width:'50%', textAlign:'center', backgroundColor:'#f8f8f8',alignItems:'center', justifyContent:'center',height:'100%', borderRadius:50, position:'absolute'}}></View>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Shopping carts</Text>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Order again</Text>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1
    },

    header:{
        width:'100%',
        height:responsiveSize(100),
        marginBottom:10,
        backgroundColor:'#e0e0e0'
    },

    iconContainer:{
        backgroundColor:'#c0c0c0',
        width:40, 
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:40,
    },
})