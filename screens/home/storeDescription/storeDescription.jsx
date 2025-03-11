import { StyleSheet, View, Text , ScrollView, TouchableOpacity, Button, TouchableWithoutFeedback} from "react-native";
import axios from "axios";
import {SERVER_IP} from '@env';
import { useContext, useState, useRef, useEffect } from "react";
import { StoreContext } from "../../../contextApi/store_context";
import { UserContext } from "../../../contextApi/user_context";
import PopUpMessage from "../../../conponents/popUpMessage";
import log from "minhluanlu-color-log"



export default function Store_Description({display_store_detail, store_status, store_description, store_id}){

    const { public_StoreName, setPublic_Store_Name }                        = useContext(StoreContext);
    const { public_Store_Status, setPublic_Store_Status}                    = useContext(StoreContext);
    const { publicEmail, setPublicEmail}                                    = useContext(UserContext);
    const [displayPopUpMessage, setDisplayPopUpMessage] = useState(false);
    const [discount_value, setDiscountValue] = useState()
    const [discount_code, setDiscount_Code] = useState()

    async function HandleClickButton(){
        display_store_detail();
        Check_Purchase_Log()
    }

    async function Check_Purchase_Log() {
        const checkDiscount = await axios.post(`${SERVER_IP}/purchaseLog/api`,{
            Email: publicEmail,
            Store_id: store_id
        })
        if(checkDiscount?.data?.success){
            log.info(checkDiscount?.data?.message)
            setDisplayPopUpMessage(true)
            setDiscount_Code(checkDiscount.data.data.Discount_code)
            setDiscountValue(checkDiscount.data.data.Discount_value)              
        }
    }

    if(displayPopUpMessage) {
        return <PopUpMessage 
            displayPopUpMessage={displayPopUpMessage} 
            title={`Discount ${discount_value}%`} 
            message={`Code: ${discount_code}`} 
            onclose={()=> setDisplayPopUpMessage(false)}
        />
    }
 
    return(
        <View style={{ flexGrow: 1, backgroundColor:'transparent'}}>
            { store_status === 1 &&
                <TouchableWithoutFeedback onPress={()=> HandleClickButton()}>
                    <View style={styles.Container}>  
                        <View style={{flex:2, height:'100%',backgroundColor:'#333333', width:'100%', borderWidth:1,marginBottom:2,borderRadius:3, justifyContent:'center'}}>
                            { public_Store_Status == '1' 
                                ? 
                                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                        <View style={{flex:0.5, marginLeft:8}}>
                                            <TouchableOpacity style={{width:65, height:65, backgroundColor:'#008080', justifyContent:'center', borderRadius:3}} onPress={()=> HandleClickButton() }>
                                                    <Text style={{textAlign:'center', fontSize:14, fontWeight:500, color:'#FFFFFF'}}>Click to Order</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex:2, height:'100%', justifyContent:'center'}}>
                                            <Text style={{fontSize:18, fontWeight:'600', textAlign:'center', color:'#FFFFFF'}} >{public_StoreName} - <Text  style={{fontSize:15, color:'#FF9F0D'}}>Open</Text></Text> 
                                            <View style={{width:'100%', height:20, alignSelf:'center'}}>
                                                <Text style={{color:'#D7D7D7', textAlign:'center', overflow:'hidden'}}>{store_description}</Text>
                                            </View>
                                        </View>
                                    </View>
                                : 
                                    <Text style={{fontSize:18, textAlign:'center', fontWeight:'600'}}>Status: <Text  style={{fontSize:15, color:'red'}}>Close</Text></Text>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            }  
        </View>
        
    )
}

const styles = StyleSheet.create({
    Container:{
        height:80,
        backgroundColor:'transparent',
        width:'95%',
        alignSelf:'center',
        borderRadius:5,
        marginTop:5,
        zIndex:999,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})