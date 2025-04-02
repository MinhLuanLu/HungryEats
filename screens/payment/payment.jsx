import { StyleSheet, View, Text, TouchableOpacity , Modal, Image} from "react-native";
import { useEffect, useState } from "react";
import log from "minhluanlu-color-log";
import Animated,{
    withSpring,
    withRepeat,
    withTiming, 
    useSharedValue,
    interpolate,
    useAnimatedStyle
} from "react-native-reanimated";

const visaIcon = require('../../assets/icons/visaIcon.png')
const credit = require('../../assets/icons/creditcard.png')
const mobilepay = require('../../assets/icons/mobilepay_icon.png');
const left_arrow = require('../../assets/icons/left_arrow1.png')


const data = [
    {id: 1, card: "Visa", cardNr: '**** **** **** 1235', icon: visaIcon},
    {id: 2, card: "Credit", cardNr: '**** **** **** 8888', icon: credit},
    {id: 3, card: "MobilePay", cardNr: '**** **** **** 5555', icon: mobilepay},
]



export default function Payment({display, onclose}){
    const PayButton  = Animated.createAnimatedComponent(TouchableOpacity)
    const buttonWidth = useSharedValue(300)

    const payAction = () => {
        if(buttonWidth.value == 55){
            buttonWidth.value = withTiming(300, {duration:800})
        }else{
            buttonWidth.value = withTiming(55, {duration:800})
        }
    }

    const ButtonAction = useAnimatedStyle(()=>{
        return{
            width: buttonWidth.value
        }
    })
    

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

                {data.length !== 0 && data.map((item, index)=>(
                    <View key={index} style={styles.paymentOption}>
                        <View style={styles.optionContainer}>
                            <View style={styles.iconContainer}>
                                <Image resizeMode="cover" source={item.icon} style={{width:'50%', height:'50%', position:'absolute'}}/>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text>{item.card}</Text>
                                <Text>{item.cardNr}</Text>
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity onPress={()=> console.log(item.id)} style={{width:25, height:25, backgroundColor:'#ffffff', borderRadius:25, borderWidth:1, position:'relative', justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=> console.log(item.id)} style={{width:18, height:18, backgroundColor:'#000000',borderRadius:18}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <PayButton onPress={payAction}  style={[{backgroundColor:'#008080', width:'90%', height:55, borderRadius:55, alignSelf:'center',position:'absolute', bottom:30, justifyContent:'center', alignItems:'center'}, ButtonAction]}>
                <Text style={{color:'#ffffff', fontSize:20, fontWeight:500}}>Pay</Text>
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