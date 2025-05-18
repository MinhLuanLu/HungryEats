import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView,Modal } from "react-native";
import { useEffect, useState , useContext} from "react";
import { FONT } from "../fontConfig";
import { responsiveSize } from "../utils/responsive";
import {SERVER_IP} from "@env"
import { UserContext } from "../contextApi/user_context";
import axios from "axios";
import OrderHeader from "./orderHeader";



export default function Orders({orderList, backgroundColor}){

    return(
        <ScrollView style={styles.middelContainer}>
            { orderList.length != 0 && orderList.map((orders, index)=>(
                <View key={index} style={[styles.orderContainer,{backgroundColor:backgroundColor}]}>
                    { orders.Store &&
                        <View style={{
                            display:'flex',
                            flexDirection:'row',
                            borderBottomWidth:0.5,
                            borderColor:'#C0C0C0',
                            borderStyle:'dashed',
                            height:80,
                            alignItems:'center',
                            width:'90%',
                            alignSelf:'center'
                        }}>
                            <Image resizeMode="cover" style={{width:60, height:60, borderRadius:10, marginRight:10}}/>
                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:14, flex:1}}>{/*orders.Store.Store_name*/} - {/*orders.Store.Address*/} </Text>
                        </View>
                    }
                    <Text style={{position:'absolute', right:15, top:10, fontFamily: FONT.SoraMedium, fontSize: responsiveSize(12)}}>#{orders.Order_id}</Text>
                    <View style={{width:'90%', height:'auto', minHeight:80, width:'90%', alignSelf:'center', justifyContent:'center'}}>
                        <View style={{flex:1, flexDirection:'row', marginTop:10,flexWrap: 'wrap'}}>
                            {orders.Food_item.map((item, index)=>(
                                <Image key={index} resizeMode="cover" style={{width:65, height:45, borderRadius:10, marginRight:10, marginBottom:5}}  source={{uri: item.Food_image}}/>
                            ))}
                            {orders.Drink_item.map((item, index)=>(
                                <Image key={index} resizeMode="cover" style={{width:65, height:45,  borderRadius:10, marginRight:10}} source={{uri: `${SERVER_IP}/${item.Drink_image}`}}/>
                            ))}
                            
                        </View>

                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', alignSelf:'center', marginTop:10}}>
                            <View>
        
                                <Text style={{fontSize:14, color:backgroundColor == undefined ? "grey" : "#e0e0e0e", fontFamily:FONT.Sora}}>Total</Text>
                                {orders.Order_status && <Text style={{fontSize:14, color:backgroundColor == undefined ? "grey" : "#e0e0e0e", fontFamily:FONT.Sora}}>Status</Text>}
    
                            </View>
                            <View style={{paddingRight:10}}>
                                <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{orders.Total_price}Kr</Text>
                                {orders.Order_status && <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{orders.Order_status}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={{height:responsiveSize(60), width:'90%', justifyContent:'center', alignSelf:'center'}}>
                        <TouchableOpacity onPress={()=> alert('Order gain error 404')} style={{width:'100%', height: responsiveSize(40), backgroundColor:'#c0c0c0', borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'#008080', fontFamily: FONT.SoraMedium}}>Order again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}




const styles = StyleSheet.create({
    middelContainer:{
        flex:1
    },

    orderContainer:{
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        borderWidth:0.8,
        borderColor:'#C0C0C0',
        marginTop:10
    },
    
    checkoutButton:{
        width:'90%', 
        backgroundColor:'#008080', 
        height: responsiveSize(45), 
        alignSelf:'center', 
        position:'absolute', 
        bottom: responsiveSize(30), 
        borderRadius:5, 
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
    },

    optionButton:{
        width:20,
        height:20,
        backgroundColor:'#e0e0e0',
        borderRadius:20,
        position:'absolute',
        top:10,
        right:10,
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10,
        borderWidth:0.5,
        justifyContent:'center',
        alignItems:'center'
    },

    optionButton1:{
        width:'85%',
        height:'85%',
        backgroundColor:'#008080',
        borderRadius:25,
        position:'absolute',
    }
})