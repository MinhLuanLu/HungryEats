import { StyleSheet, View, Text , ScrollView, TouchableOpacity, Button, TouchableWithoutFeedback} from "react-native";
import axios from "axios";
import {SERVER_IP} from '@env';
import { useContext, useState, useRef, useEffect } from "react";
import { StoreContext } from "../../../contextApi/store_context";
import { UserContext } from "../../../contextApi/user_context";
import PopUpMessage from "../../../conponents/popUpMessage";
import log from "minhluanlu-color-log";
import { useNavigation } from "@react-navigation/native";
import Animated, {
    FadeInUp, 
    withTiming, 
    withSpring,
    useSharedValue,
    useAnimatedStyle 
} from "react-native-reanimated";



export default function Store_Description({store}){
    const navigate = useNavigation()
    const {publicUser, setPublicUser} = useContext(UserContext)

    const [displayPopUpMessage, setDisplayPopUpMessage] = useState(false);
    const [discount_value, setDiscountValue] = useState()
    const [discount_code, setDiscount_Code] = useState()

    async function HandleClickButton(){
        //display_store_detail();
        navigate.navigate('StoreDetail', {store: store})
        Check_Purchase_Log()
    }

    async function Check_Purchase_Log() {
        const checkDiscount = await axios.post(`${SERVER_IP}/purchaseLog/api`,{
            Email: publicUser.Email,
            Store_id: store.Store_id
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
        <Animated.View entering={FadeInUp.duration(500)} style={{ flexGrow: 1, backgroundColor:'transparent'}}>
            <TouchableWithoutFeedback onPress={()=> HandleClickButton()}>
                <View style={styles.Container}>  
                    <View style={{flex:2, height:'100%',backgroundColor:'#333333', width:'100%', borderWidth:1,marginBottom:2,borderRadius:3, justifyContent:'center'}}>
                        { store.Status == 1
                            ? 
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                    <View style={{flex:0.5, marginLeft:8}}>
                                        <TouchableOpacity style={{width:65, height:65, backgroundColor:'#008080', justifyContent:'center', borderRadius:3}} onPress={()=> HandleClickButton() }>
                                                <Text style={{textAlign:'center', fontSize:14, fontWeight:500, color:'#FFFFFF'}}>Click to Order</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flex:2, height:'100%', justifyContent:'center'}}>
                                        <Text style={{fontSize:18, fontWeight:'600', textAlign:'center', color:'#FFFFFF'}} >{store.Store_name} - <Text  style={{fontSize:15, color:'#FF9F0D'}}>Open</Text></Text> 
                                        <View style={{width:'100%', height:20, alignSelf:'center'}}>
                                            <Text style={{color:'#D7D7D7', textAlign:'center', overflow:'hidden'}}>{store.Store_description}</Text>
                                        </View>
                                    </View>
                                </View>
                            : 
                                <Text style={{fontSize:18, textAlign:'center', fontWeight:'600'}}>Status: <Text  style={{fontSize:15, color:'red'}}>Close</Text></Text>
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>  
        </Animated.View>
        
    )
}

const styles = StyleSheet.create({
    Container:{
        height:80,
        backgroundColor:'transparent',
        width:'95%',
        alignSelf:'center',
        borderRadius:5,
        marginTop:10,
        zIndex:999,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})