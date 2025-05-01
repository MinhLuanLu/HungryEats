import { StyleSheet,Text, TouchableOpacity, View, Image } from "react-native";
import { useEffect, useState } from "react";
import log from "minhluanlu-color-log";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FONT } from "../fontConfig";
import { responsiveSize } from "../utils/responsive";


const downArrow = require('../assets/icons/down_arrow.png')

export default function OrderHeader({orderAgain, onclose, status}){

    const [orderAgainStatus, setOrderAgainStatus] = useState(false)

    const navigate = useNavigation()

    useEffect(()=>{
        if(status == true){
            setOrderAgainStatus(true)
        }else{
            setOrderAgainStatus(false)
        }
    },[])


    function orderAgainHandler(){
        orderAgain();
        setOrderAgainStatus(true)
    }

    function oncloseHandler(){
        setOrderAgainStatus(false)
        onclose()
    }

    return(
        <View style={styles.header}>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center', flex:1, alignItems:'center'}}>
                <TouchableOpacity style={styles.iconContainer} onPress={()=> navigate.navigate('Home')}>
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
                <View style={{width:'50%', textAlign:'center', backgroundColor:'#f8f8f8',alignItems:'center', justifyContent:'center',height:'100%', borderRadius:50, position:'absolute', right: orderAgainStatus && 0}}></View>
                <TouchableOpacity style={{flex:1, alignItems:'center'}}  onPress={()=> oncloseHandler()}>
                    <Text style={{textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Shopping carts</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{flex:1, alignItems:'center'}} onPress={()=> orderAgainHandler()}>
                    <Text style={{textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Order again</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
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