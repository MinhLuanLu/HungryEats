import { StyleSheet, View, Text, TouchableOpacity, Image , Dimensions, TouchableWithoutFeedback} from "react-native";
import Animated,{withTiming, useSharedValue, useAnimatedStyle} from "react-native-reanimated";
import { useEffect, useState } from "react";
import {SERVER_IP} from '@env';
import { FONT } from "../fontConfig";
import { responsiveSize } from "../utils/responsive";
import { Gesture, GestureDetector } from "react-native-gesture-handler";


const {width} = Dimensions.get('window')

export default function SwipeAble({data, image, name, price, quantity, deleteHandler, quantityHandler}){
    

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const deleteButtonTranslateX = useSharedValue(0);
    const backGroundMove = useSharedValue(0)

    const foodSwipeAble = Gesture.Pan()
        .onUpdate((event)=>{
            if (event.translationX < 0) { // allow left swipe only
                translateX.value = event.translationX;
              }
            if (event.translationX != 0){
                translateX.value = event.translationX;
            }
            //console.log('X', event.translationX);
        })
        .onEnd(() => {
            if (translateX.value < -130) { // Trigger deletion on swipe past -100
              translateX.value = withTiming(0); // Slide out the item
            } 
    
            if (translateX.value > 0) { // Trigger deletion on swipe past -100
                translateX.value = withTiming(0); // Slide out the item
              } 
            
          });

    const foodAnimatedStyle = useAnimatedStyle(()=>{
    return{
        transform: [
            { translateX: translateX.value }
            ],
    }
    })

    const deleteAnimation = useAnimatedStyle(()=>{
        return{
            right: deleteButtonTranslateX.value
        }
    })

    function DeleteAnimation(){
        translateX.value = withTiming(-width);
        deleteButtonTranslateX.value  = withTiming(+width);
        backGroundMove.value = withTiming(width * 2);
        deleteHandler()
    }

    const  moveBackground = useAnimatedStyle(()=>{
        return{
            marginRight: backGroundMove.value
        }
    })

    
    return(
        <GestureDetector gesture={foodSwipeAble}>
            <Animated.View style={[{display:'flex', backgroundColor:'transparent', width:'95%', alignSelf:'center', height:responsiveSize(70), marginTop: responsiveSize(8), position:'relative'}, moveBackground]}>
                <Animated.View style={[styles.itemContainer, foodAnimatedStyle]}>
                    <Image resizeMode="cover" style={{width:70, borderRadius:5,height:'85%', backgroundColor:'#000000', marginLeft:5}} source={image}/>
                    
                    <View style={{flex:2, marginLeft:8}}>
                        <Text style={styles.itemName}>{name}</Text>
                        <Text style={styles.itemPrice}>{price}Kr</Text>
                    </View>

                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginRight:10}}>
                        <TouchableOpacity style={styles.button} onPress={()=> quantityHandler(false)}>
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={{fontFamily:FONT.SoraSemiBold}}>{quantity}</Text>

                        <TouchableOpacity style={styles.button} onPress={()=> quantityHandler(true)}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <TouchableWithoutFeedback onPress={()=> DeleteAnimation()}>
                    <Animated.View style={[styles.deleteButton, deleteAnimation]}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({


    itemContainer:{
        backgroundColor:'#f8f8f8',
        width:'100%',
        alignSelf:'center',
        height: responsiveSize(70),
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderRadius:10,
        shadowColor: '#000000', // Color of the shadow
        shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
        shadowOpacity: 0.3, // Opacity of the shadow
        shadowRadius: 10, // Blur radius of the shadow
        elevation: 10,
        zIndex:999
    },

    deleteButton:{
        backgroundColor:'red', 
        width:80, 
        height:'100%',
        position:'absolute', 
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },

    button:{
        backgroundColor:'#008080',
        width: responsiveSize(25),
        height: responsiveSize(25),
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    },
    
    buttonText:{
        color:'#ffffff',
        fontFamily: FONT.SoraMedium
    },

    itemName:{
        fontFamily: FONT.SoraMedium,
        fontSize: responsiveSize(13)
    },
    itemPrice:{
        fontFamily: FONT.SoraSemiBold
    },

})