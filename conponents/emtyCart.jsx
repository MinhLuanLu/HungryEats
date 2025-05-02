import { StyleSheet, Text, View,TouchableOpacity, Modal, Image , SafeAreaView} from "react-native";
import { useEffect, useState, useContext } from "react";
import { FONT } from "../fontConfig";
import { useNavigation } from "@react-navigation/native";
import { responsiveSize } from "../utils/responsive";
import OrderHeader from "./orderHeader";
import Orders from "./orders";
import {SERVER_IP} from "@env"
import axios from "axios";
import { UserContext } from "../contextApi/user_context";

const cartIcon = require('../assets/icons/emtyCart.png')
const down_arrow = require('../assets/icons/down_arrow.png')

export default function EmtyCart(){
    const [orderAgain, setOrderAgain] = useState(false);
    const [orderList, setOrderList] = useState([])
    const {publicUser, setPublicUser} = useContext(UserContext);

    const navigate = useNavigation()

    useEffect(()=>{
        if(orderAgain){
            const orderHistoryHandler = async () => {
                try{
                  const orderHistory = await axios.post(`${SERVER_IP}/orderHistory/api`,{
                    User: publicUser
                  })
            
                  if(orderHistory?.data?.success){
                    console.log(orderHistory?.data?.message);
                    setOrderList(orderHistory?.data?.data);
                    return
                  }
            
                }
                catch(error){
                  log.warn(error)
                }
            }
              
            orderHistoryHandler()
        }
    },[orderAgain])

    return(
        <Modal
            animationType="slide"
            visible={true}
        >
            <SafeAreaView style={styles.Container}>
                <View style={styles.header}>
                    <OrderHeader orderAgain={()=> setOrderAgain(true)} onclose={()=> setOrderAgain(false)}/>
                </View>
            { !orderAgain ?
                <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginTop:20}}>
                    <Image resizeMode="cover" style={{width:60, height:60}} source={cartIcon}/>
                    <Text style={{fontSize:20, fontFamily:FONT.SoraSemiBold}}>Your Cart is Emty</Text>
                    <Text style={{fontFamily:FONT.SoraRegular, textAlign:'center'}}>Select a store and add food to cart to place an order</Text>

                    <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{width:'60%',height:50, backgroundColor:'#008080', marginTop:10, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:16, fontFamily:FONT.SoraMedium, color:'#ffffff'}}>Find Store</Text>
                    </TouchableOpacity>
                </View>
                :
                <Orders orderList={orderList}/>
            }
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