import { StyleSheet, Text, View,TouchableOpacity, Modal, Image , SafeAreaView} from "react-native";
import { useEffect, useState } from "react";
import { FONT } from "../fontConfig";
import { useNavigation } from "@react-navigation/native";
import { responsiveSize } from "../utils/responsive";

const cartIcon = require('../assets/icons/emtyCart.png')
const down_arrow = require('../assets/icons/down_arrow.png')

export default function EmtyCart(){

    const navigate = useNavigation()

    return(
        <Modal
            animationType="slide"
            visible={true}
        >
            <SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center', flex:1, alignItems:'center'}}>
                        <TouchableOpacity style={styles.iconContainer} onPress={()=> navigate.navigate('Home')}>
                            <Image resizeMode="cover" source={down_arrow} style={{width:30, height:30}}/>
                        </TouchableOpacity>
                        <View style={styles.headerText}>
                            <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:17}}>Your orders</Text>
                        </View>
                        <View style={styles.editContainer}>
                            <TouchableOpacity>
                                <Text style={{fontFamily:FONT.SoraRegular}}>----</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:0.5, backgroundColor:'#ffffff', width:'90%', alignSelf:'center', marginBottom:8, borderRadius:50, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', position:'relative'}}>
                        <View style={{width:'50%', textAlign:'center', backgroundColor:'#f8f8f8',alignItems:'center', justifyContent:'center',height:'100%', borderRadius:50, position:'absolute'}}></View>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Shopping carts</Text>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Order again</Text>
                    </View>
                </View>

                <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginTop:20}}>
                    <Image resizeMode="cover" style={{width:60, height:60}} source={cartIcon}/>
                    <Text style={{fontSize:20, fontFamily:FONT.SoraSemiBold}}>Your Cart is Emty</Text>
                    <Text style={{fontFamily:FONT.SoraRegular, textAlign:'center'}}>Select a store and add food to cart to place an order</Text>

                    <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{width:'60%',height:50, backgroundColor:'#008080', marginTop:10, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:16, fontFamily:FONT.SoraMedium, color:'#ffffff'}}>Find Store</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1,
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