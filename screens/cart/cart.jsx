import { StyleSheet, View, Text, TouchableOpacity,Modal, Image } from "react-native";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contextApi/user_context";
import {SERVER_IP} from '@env'




export default function Cart(){

    const {publicCart, setPublicCart} = useContext(UserContext)

    useEffect(()=>{
        console.log(publicCart)
    },[])

    return(
        <Modal
            animationType="slide"
        >
            <View style={styles.Container}>
                <View style={styles.topContainer}>
                    <Text style={{flex:1, color:'#000000', fontSize:30, fontWeight:500}}>Cart</Text>
                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:16, color:'grey', paddingRight:8}}>Pickup time</Text>
                        <TouchableOpacity style={{width:60, height:30, backgroundColor:'#008080', borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:14, fontWeight:400, color:'#ffffff'}}>15:12</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.middleContainer}>
                    <View style={styles.foodContainer}> 
                        <View style={styles.imageContainer}>
                            <Image resizeMode="cover" style={{width:60, height:60}} source={{uri: `${SERVER_IP}/Fusion_Sushi_Platter.jpg`}}/>
                        </View>
                        <View style={styles.foodInfoContainer}>
                            <Text>SUSHI STOA</Text>
                            <View style={styles.foodQuantityContainer}>
                                <Text style={{flex:1}}>150Kr</Text>
                                <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity style={{width:30, height:30, backgroundColor:'#ffffff', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                        <Text>-</Text>
                                    </TouchableOpacity>

                                        <Text style={{paddingLeft:8, paddingRight:8, fontSize:15, fontWeight:500}}>5</Text>

                                    <TouchableOpacity style={{width:30, height:30, backgroundColor:'#008080', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomContainer}></View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1
    },

    
    topContainer: {
        flex:0.5  ,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:'95%', 
        alignSelf:'center'
    },

    //////////////////////////
    middleContainer: {
        flex:2,
        backgroundColor:'grey'
    },

    foodContainer:{
        display:'flex',
        flexDirection:'row',
        width:'90%', alignSelf:'center'
    },

    imageContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

    foodInfoContainer:{
        flex:3
    },

    foodQuantityContainer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    },
    ////////////////////////////
    bottomContainer: {
        flex:1,
        
    },

})