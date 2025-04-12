import { StyleSheet, View, Text, TouchableOpacity , Modal, Image, TouchableWithoutFeedback} from "react-native";
import { useEffect, useState, useContext } from "react";
import log from "minhluanlu-color-log";
import axios from "axios";
import Animated,{
    withSpring,
    withRepeat,
    withTiming, 
    useSharedValue,
    interpolate,
    useAnimatedStyle,
    useAnimatedProps
} from "react-native-reanimated";
import { Flow } from "react-native-animated-spinkit";
import { paymentMethod } from "../../config";
import { UserContext } from "../../contextApi/user_context";
import {SERVER_IP} from "@env";


const visaIcon = require('../../assets/icons/visaIcon.png')
const creditIcon = require('../../assets/icons/creditcard.png')
const mobilePayIcon = require('../../assets/icons/mobilepay_icon.png');
const left_arrow = require('../../assets/icons/left_arrow1.png')




export default function Payment({display, onclose, displayPaymentProcess}){

    const {publicUser, setPublicUser} = useContext(UserContext)
   
    const [visa, setVisa] = useState({})
    const [credit, setCredit] = useState({});
    const [mobilePay, setmobilePay] = useState({});
    const [method, setMethod] = useState("");
    const [paymentProcess, setPaymentProcess] = useState(false)

    const PayButton  = Animated.createAnimatedComponent(TouchableOpacity)
    const FlowComponent = Animated.createAnimatedComponent(Flow);

    const buttonWidth = useSharedValue(300);
    const FlowOpacity = useSharedValue(0)
    const textOpacity = useSharedValue(1)

    /// set the button width to default ///
    useEffect(()=>{
        buttonWidth.value = withTiming(300);
        FlowOpacity.value = withTiming(0, {duration: 300})
        textOpacity.value = withTiming(1, {duration:200})
    },[display])

    //////////////////////////////////////////


    // Animation ///////////////
    const payAction = () => {
        buttonWidth.value = withTiming(55, {duration:500})
        FlowOpacity.value = withTiming(1, {duration: 300})
        textOpacity.value = withTiming(0, {duration:200})

        paymentHandler()
  
    }

    const ButtonAction = useAnimatedStyle(()=>{
        return{
            width: buttonWidth.value
        }
    });

    const FlowAnimated = useAnimatedStyle(()=>{
        return{
            opacity: FlowOpacity.value
        }
    })

    const TextAnimated = useAnimatedStyle(()=>{
        return{
            opacity: textOpacity.value
        }
    })
    

    ////////////////////////////////////////

    function selectPaymentMethod(selection){
        setMethod(selection)
    };


    async function paymentHandler() {
        try{
            const paymentRequest = await axios.post(`${SERVER_IP}/payment/api`,{
                User: publicUser
            });
            
            if(paymentRequest.data.success){
                log.debug(paymentRequest.data.message);
                displayPaymentProcess()
                onclose()
            }
            
        }catch(error){
            console.log(error)
        }
    }

    return(
        <Modal
            visible={display}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.bottom}>
                <View style={{width:'90%', alignSelf:'center', display:'flex', flexDirection:'row', height:50,alignItems:'center'}}>
                    <TouchableOpacity style={{height:40, width:40, justifyContent:'center', alignItems:'center'}} onPress={()=> onclose()}>
                        <Image resizeMode="cover" style={{width:25, height:25}} source={left_arrow}/>
                    </TouchableOpacity>
                    <Text style={{flex:1, paddingLeft:10, fontSize:20, fontWeight:500}}>Payment</Text>
                </View>

                
                <View style={styles.paymentOption}>
                    <TouchableWithoutFeedback>
                        <View style={styles.optionContainer}>
                            <View style={styles.iconContainer}>
                                <Image resizeMode="cover" source={visaIcon} style={{width:'50%', height:'50%', position:'absolute'}}/>
                            </View>
                            <View style={styles.cardInfo}>
                                {Object.keys(visa).length > 0 ?
                                    <>
                                        <Text>{visa.cardName}</Text>
                                        <Text>{visa.cardNr}</Text>
                                    </>
                                    :
                                    <>
                                        <Text>Visa</Text>
                                        <Text>**** **** **** ****</Text>
                                    </>
                                }
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.visa)} style={{width:25, height:25, backgroundColor:'#ffffff', borderRadius:25, borderWidth:1, position:'relative', justifyContent:'center', alignItems:'center'}}>
                                    {method === paymentMethod.visa && <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.visa)} style={{width:18, height:18, backgroundColor:'#000000',borderRadius:18}}/> }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback>
                        <View style={styles.optionContainer}>
                            <View style={styles.iconContainer}>
                                <Image resizeMode="cover" source={creditIcon} style={{width:'50%', height:'50%', position:'absolute'}}/>
                            </View>
                            <View style={styles.cardInfo}>
                                {Object.keys(credit).length > 0 ?
                                    <>
                                        <Text>{credit.cardName}</Text>
                                        <Text>{credit.cardNr}</Text>
                                    </>
                                    :
                                    <>
                                        <Text>Credit</Text>
                                        <Text>**** **** **** ****</Text>
                                    </>
                                }
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.credit)} style={{width:25, height:25, backgroundColor:'#ffffff', borderRadius:25, borderWidth:1, position:'relative', justifyContent:'center', alignItems:'center'}}>
                                    {method === paymentMethod.credit && <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.credit)} style={{width:18, height:18, backgroundColor:'#000000',borderRadius:18}}/> }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback>
                        <View style={styles.optionContainer}>
                            <View style={styles.iconContainer}>
                                <Image resizeMode="cover" source={mobilePayIcon} style={{width:'50%', height:'50%', position:'absolute'}}/>
                            </View>
                            <View style={styles.cardInfo}>
                                {Object.keys(mobilePay).length > 0 ?
                                    <>
                                        <Text>{mobilePay.cardName}</Text>
                                        <Text>{mobilePay.cardNr}</Text>
                                    </>
                                    :
                                    <>
                                        <Text>MobilePay</Text>
                                        <Text>**** **** **** ****</Text>
                                    </>
                                }
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.mobilePay)} style={{width:25, height:25, backgroundColor:'#ffffff', borderRadius:25, borderWidth:1, position:'relative', justifyContent:'center', alignItems:'center'}}>
                                    {method === paymentMethod.mobilePay && <TouchableOpacity onPress={()=> selectPaymentMethod(paymentMethod.mobilePay)} style={{width:18, height:18, backgroundColor:'#000000',borderRadius:18}}/>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                
            </View>

            <PayButton onPress={payAction}  style={[{backgroundColor:'#008080', width:'90%', height:55, borderRadius:55, alignSelf:'center',position:'absolute', bottom:30, justifyContent:'center', alignItems:'center'}, ButtonAction]}>
                <Animated.Text style={[{fontSize:17, color:'#ffffff', fontWeight:500}, TextAnimated]}>Pay</Animated.Text>
                <FlowComponent style={[{position:'absolute'}, FlowAnimated]} color="#ffffff" size={30}/>              
            </PayButton >

        </Modal>
    )
}

const styles = StyleSheet.create({
    bottom:{
        position:'absolute',
        height:'50%',
        width:'100%',
        backgroundColor:'#E0E0E0',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        bottom:0
    },

    paymentOption:{
        width:'90%', 
        alignSelf:'center'
    },

    optionContainer:{
        display:'flex', 
        flexDirection:'row',
        marginTop:10
    },

    iconContainer:{
        backgroundColor:'#ffffff', 
        width:50, 
        height:50, 
        borderRadius:60, 
        justifyContent:'center', 
        alignItems:'center',
        position:'relative'
    },

    cardInfo:{
        flex: 2, 
        paddingLeft:15
    }

})