import { StyleSheet, View, Text , ScrollView, TouchableOpacity, Button, TouchableWithoutFeedback} from "react-native";
import axios from "axios";
import {SERVER_IP} from '@env';
import { useContext, useState, useRef, useEffect } from "react";
import { StoreContext } from "../../../contextApi/store_context";
import { UserContext } from "../../../contextApi/user_context";
import PopUpMessage from '../../../conponents/popUpMessage'
import log from "minhluanlu-color-log";
import { useNavigation } from "@react-navigation/native";
import { FONT } from "../../../fontConfig";
import Animated, {
    FadeInUp, 
    withTiming, 
    withSpring,
    useSharedValue,
    useAnimatedStyle 
} from "react-native-reanimated";
import { responsiveSize } from "../../../utils/responsive";



export default function Store_Description({store}){
    const navigate = useNavigation()
    const {publicUser, setPublicUser} = useContext(UserContext)

    const [displayPopUpMessage, setDisplayPopUpMessage] = useState(false);
    const [discount_value, setDiscountValue] = useState()
    const [discount_code, setDiscount_Code] = useState()

    useEffect(()=>{
        Check_Purchase_Log()
    },[store])

    async function HandleClickButton(){
        navigate.navigate('StoreDetail', {store: store})
    }

    async function Check_Purchase_Log() {
        const checkDiscount = await axios.post(`${SERVER_IP}/checkDiscount/api`,{
            User: publicUser,
            Store: store
        })
        if(checkDiscount?.data?.success){
            log.info(checkDiscount?.data?.message)
            console.log(checkDiscount.data.data)  
            setDisplayPopUpMessage(true)        
        }else{
            log.info(checkDiscount?.data?.message)
        }
    }

    if(displayPopUpMessage) return <PopUpMessage onclose={()=> setDisplayPopUpMessage(false)} title="Discounts" message="Discount code was found. Order now" type="discount"/>
 
    return(
        <Animated.View entering={FadeInUp.duration(500)} style={{ flexGrow: 1, backgroundColor:'transparent'}}>
            <TouchableWithoutFeedback onPress={()=> HandleClickButton()}>
                <View style={styles.Container}>  
                    <View style={{flex:2, height:'100%',backgroundColor:'#333333', width:'100%', borderWidth:1,marginBottom: responsiveSize(10),borderRadius:5, justifyContent:'center'}}>
                        { store.Status == 1
                            ? 
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                    <View style={{flex:0.5, marginLeft:8}}>
                                        <TouchableOpacity style={{width:responsiveSize(60), height:responsiveSize(60), backgroundColor:'#008080', justifyContent:'center', borderRadius:3}} onPress={()=> HandleClickButton() }>
                                                <Text style={{textAlign:'center', fontSize: responsiveSize(13), fontFamily: FONT.SoraMedium, color:'#FFFFFF'}}>Go to Store</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flex:2, height:'95%', justifyContent:'center'}}>
                                        <Text style={{fontSize: responsiveSize(17), fontWeight:'600', textAlign:'center', color:'#FFFFFF', fontFamily: FONT.SoraBold}} >{store.Store_name} - <Text  style={{fontSize:responsiveSize(13), color:'#FF9F0D', fontFamily: FONT.SoraBold}}>Open</Text></Text> 
                                        <View style={{width:'98%', height:20, alignSelf:'center'}}>
                                            <Text style={{color:'#D7D7D7', textAlign:'center', overflow:'hidden', fontFamily: FONT.Sora}}>{store.Store_description}</Text>
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
        height: responsiveSize(70),
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