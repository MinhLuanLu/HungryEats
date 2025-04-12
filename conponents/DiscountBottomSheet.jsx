import Animated,{withSequence, withTiming, withSpring, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image , TextInput} from "react-native";
import { useEffect, useState } from "react";
import {SERVER_IP} from '@env';
import axios from "axios";
import log from "minhluanlu-color-log";
import { Chase } from "react-native-animated-spinkit";
import { FONT } from "../fontConfig";

const discountIcon = require('../assets/icons/discount.png')

export default function DiscountBottomSheet({publicCart, display, onclose, submitCode}){

    const [discountCode, setDiscountCode] = useState([]);
    const [activeInput, setActiveInput] = useState(null)
    const [discountCodeList, setDiscountCodeList] = useState(false);
    const [applyCode, setApplyCode] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [codeData, setCodeData] = useState()

    const height = useSharedValue(0);
    const headerHeight = useSharedValue(23)

    const bottomSheetAnimation = useAnimatedStyle(()=>{
        return{
          height: `${height.value}%`
        }
    });

    const headerAnimation = useAnimatedStyle(()=>{
        return{
            height: `${headerHeight.value}%`
        }
    })

    const increseHeight = (value) =>{
        if(value){
            height.value = withTiming(50, {duration:100})
            headerHeight.value = withTiming(25, {duration:200})
        }
        if(!value){
            height.value = withTiming(35, {duration:100})
            headerHeight.value = withTiming(23, {duration:200})
        }
    }


    useEffect(()=>{
        height.value = withTiming(0)
        setSubmit(false)
        setApplyCode(false)
    },[])

    useEffect(()=>{
        display  ? height.value = withTiming(35, {duration:800}) : height.value = withTiming(0, {duration:800})
    },[display])

    
    useEffect(()=>{
        async function Check_Purchase_Log() {
            try{
                const getDiscountCode = await axios.post(`${SERVER_IP}/getDiscountCode/api`,{
                    User: publicCart.User,
                    Store: publicCart.Store
                })
                if(getDiscountCode?.data?.success){
                    log.info(getDiscountCode?.data?.message)
                    setDiscountCodeList(getDiscountCode.data.data);
                }else{
                    log.info(getDiscountCode?.data?.message)
                }
            }catch(error){
                console.log(error)
            }
        }
        Check_Purchase_Log()
    },[]);


    function applyCodeHandler(){
        discountCode == "" || discountCode == undefined ? alert('enter your code.') : AppyingCodeHandler()
    }
    
    async function AppyingCodeHandler() {
        try{
            const applyCode = await axios.post(`${SERVER_IP}/ApplyDiscountCode/api`,{
                User: publicCart.User,
                Store: publicCart.Store,
                DiscountCode: discountCode
            })

            if(applyCode.data.success){
                console.log(applyCode.data.data)
                setApplyCode(true)
                setCodeData(applyCode.data.data)
                return
            }

            setApplyCode(undefined)

        }catch(error){
            console.log(error)
        }
    }

    async function submitCodeHandler() {
        setSubmit(true)
        setTimeout(() => {
            //submitCode(codeData)
            onclose()
            setSubmit(false)
        }, 2000);
    }
   

    return (
       <Animated.View style={[styles.Container,bottomSheetAnimation ]}>
            <Animated.View style={[styles.header, headerAnimation]} onPress={()=> onclose()}>
                <View style={{width:'90%',display:'flex',
                            flexDirection:'row',
                            justifyContent:'space-between',
                            alignItems:'center',
                            alignSelf:'center'
                        }}>
                    <TouchableOpacity style={{flex:1}} onPress={()=> onclose()}>
                        <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:13, color:'#008080'}}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:15, flex:1, textAlign:'center'}}>Redeem code</Text>
                    
                    {applyCode ?
                        <View style={{flex:1}}>
                            {submit ?
                                <View style={{alignSelf:'flex-end'}}>
                                    <Chase size={25} color="grey"/>
                                </View>
                                :
                                <TouchableOpacity style={{flex:1, alignSelf:'flex-end'}} onPress={()=> submitCodeHandler()}>
                                    <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:13, color:'#008080'}}>Submit</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        :
                        <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                            <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:13, color:'grey'}}>Submit</Text>
                        </TouchableOpacity>
                    }
                </View>
            </Animated.View>

            <View style={{flex:1}}>
                <View style={{width:'90%', alignSelf:'center'}}>
                    <Text style={{fontFamily:FONT.SoraRegular, paddingBottom:10, paddingTop:20,}}>Enter you promo code below to claim your benefits.</Text>
                    <View style={{justifyContent:'center'}}>
                        <TextInput
                            placeholder="Redeem code"
                            style={[styles.input, {borderColor: activeInput ? '#008080' : 'grey', borderWidth: activeInput ? 1.5 : 1}]}
                            value={discountCode}
                            onChangeText={text => setDiscountCode(text)}
                            onFocus={()=> {setActiveInput(true), increseHeight(true)}}
                            onBlur={()=>  {setActiveInput(false), increseHeight(false)}}
                        />

                        {applyCode ?
                            <TouchableOpacity style={styles.xButton} onPress={()=> {setDiscountCode(""), setApplyCode(false)}}>
                                <Text style={{fontFamily:FONT.SoraExtraBold}}>X</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{position:'absolute', right:20}} onPress={()=> applyCodeHandler()}>
                                <Text style={{fontFamily:FONT.SoraSemiBold}}>Apply</Text>
                            </TouchableOpacity>
                        }
                                     
                    </View>
                    {applyCode === undefined ?
                        <Text style={{color:'red',padding:5, fontFamily:FONT.SoraRegular, fontSize:13}}>Your code is invalid. Please try another code.</Text>
                        :
                        null
                    }
                </View>
            </View>
            
       </Animated.View>
    );
    
}

const styles = StyleSheet.create({

    Container:{
        position:'absolute',
        width:'100%',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        bottom:0,
        backgroundColor:'#f8f8f8'
    },
    header:{
        backgroundColor:'#e0e0e0',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        justifyContent:'center'
    },

    input:{
        width:'100%',
        height:50,
        borderRadius:10,
        paddingLeft:10,
        position:'relative'
    },

    xButton:{
        backgroundColor:'#e0e0e0', 
        width:25, 
        height:25, 
        borderRadius:25, 
        justifyContent:'center', 
        alignItems:'center',
        position:'absolute',
        right:20

    }
})