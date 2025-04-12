import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Modal} from "react-native";
import Animated,{useSharedValue, useAnimatedStyle, withTiming, withSpring,FadeInDown} from "react-native-reanimated";
import { useEffect, useState, useContext } from "react";
import {SERVER_IP} from "@env"
import { FONT } from "../../fontConfig";
import { UserContext } from "../../contextApi/user_context";
import DiscountBottomSheet from "../../conponents/DiscountBottomSheet";
import { discountType } from "../../config";

const downArrow = require('../../assets/icons/down_arrow.png')
const rightArrow = require('../../assets/icons/right_arrow.png')


export default function Cart(){
    
    const {publicCart, setPublicCart} = useContext(UserContext)
    const [applyDiscount, setApplyDiscount] = useState(false);
    const [afterMonsPrice, setAfterMonsPrice] = useState(null);
    const [displayDiscount, setDisplayDiscount] =  useState(false);
    const [discountInfo, setDiscountInfo] = useState({});
    const [subTotal, setSubtotal] = useState()
    const [totalPrice, setTotalPrice] = useState()

    useEffect(()=>{
        let listPrice = [];

        if(Object.keys(publicCart).length !== 0){
            for(const item of publicCart.Food_item){
                const price = item.Price;
                const quantity = item.Food_quantity;
                listPrice.push(price * quantity)
            }

            for(const drink of publicCart.Drink_item){
                const price = drink.Drink_price;
                const quantity = drink.Drink_quantity;
                listPrice.push(price * quantity)
            }
            const total = listPrice.reduce((acc, curr) => acc + curr, 0);
            publicCart.Total_price = total;
            setTotalPrice(publicCart.Total_price)
            setSubtotal(total)

            setAfterMonsPrice(publicCart.Total_price + publicCart.Total_price * 0.25);
        }
    },[])

    useEffect(()=>{
        setAfterMonsPrice(publicCart.Total_price + publicCart.Total_price * 0.25);
        setTotalPrice(publicCart.Total_price + publicCart.Total_price * 0.25)
    },[publicCart, totalPrice]);

    function calculateDiscount(discountData){
        let discountValue = discountData.Discount_value;
        if(typeof(discountData.Discount_value) === "string"){
            discountValue = Number(discountData.Discount_value);
        }

        const discountPrice = publicCart.Total_price * (discountValue / 100);
        publicCart.Total_price = publicCart.Total_price - discountPrice;
        publicCart.Discount = discountData
        setTotalPrice(publicCart.Total_price)
        setDiscountInfo(discountData)
        setApplyDiscount(true)
    }

    async function CheckoutHandler() {
        //publicCart.Total_price = 0
    }
    

    if (Object.keys(publicCart).length === 0) return <DiscountBottomSheet display={displayDiscount}/>

    return(
        <Modal
            animationType="slide"
        >
            <View style={styles.Container}>
                <View style={styles.header}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center', flex:1, alignItems:'center'}}>
                        <View style={styles.iconContainer}>
                            <Image resizeMode="cover" source={downArrow} style={{width:30, height:30}}/>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={{fontFamily:FONT.SoraSemiBold, fontSize:17}}>Your orders</Text>
                        </View>
                        <View style={styles.editContainer}>
                            <TouchableOpacity>
                                <Text style={{fontFamily:FONT.SoraRegular}}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:0.5, backgroundColor:'#ffffff', width:'90%', alignSelf:'center', marginBottom:8, borderRadius:50, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', position:'relative'}}>
                        <View style={{width:'50%', textAlign:'center', backgroundColor:'#f8f8f8',alignItems:'center', justifyContent:'center',height:'100%', borderRadius:50, position:'absolute'}}></View>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Shopping carts</Text>
                        <Text style={{flex:1, textAlign:'center', fontFamily:FONT.SoraSemiBold, fontSize:13}}>Order again</Text>
                    </View>
                </View>

                <ScrollView style={styles.middelContainer}>
                    <View style={styles.orderContainer}>
                        <View style={{
                            display:'flex',
                            flexDirection:'row',
                            borderBottomWidth:0.5,
                            borderColor:'#C0C0C0',
                            borderStyle:'dashed',
                            height:80,
                            alignItems:'center',
                            width:'90%',
                            alignSelf:'center'
                        }}>
                            <Image resizeMode="cover" style={{width:60, height:60, borderRadius:10, marginRight:10}} source={{uri: `${SERVER_IP}/${publicCart.Store.Store_image}`}}/>
                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:14, flex:1}}>{publicCart.Store.Store_name} - {publicCart.Store.Address} </Text>
                        </View>

                        <View style={{width:'90%', height:'auto', minHeight:80, width:'90%', alignSelf:'center', justifyContent:'center'}}>
                            <View style={{display:'flex', flexDirection:'row', marginTop:10}}>
                                {publicCart.Food_item.map((item, index)=>(
                                    <Image key={index} resizeMode="cover" style={{width:65, height:45, borderRadius:10, marginRight:10}}  source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                                ))}
                                {publicCart.Drink_item.map((item, index)=>(
                                    <Image key={index} resizeMode="cover" style={{width:65, height:45,  borderRadius:10, marginRight:10}} source={{uri: `${SERVER_IP}/${item.Drink_image}`}}/>
                                ))}
                            </View>
                            
                            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%', alignSelf:'center', marginTop:10}}>
                                <View>
                                    <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Subtotal</Text>
                                    <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Moms</Text>
                                    <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Total</Text>
                                    {applyDiscount && <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000)} style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Discount</Animated.Text>}
                                </View>
                                <View style={{paddingRight:10}}>
                                    <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{subTotal}Kr</Text>
                                    <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(publicCart.Total_price * 0.25) : 0}Kr</Text>
                                    <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(totalPrice) : 0}Kr</Text>
                                    {applyDiscount && <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000)} style={{fontSize:14, color:"green", fontFamily:FONT.Sora}}>- {Object.keys(discountInfo).length !== 0 ? Math.round(publicCart.Total_price * (discountInfo.Discount_value / 100)) : 0}Kr</Animated.Text>}
                                </View>
                            </View>
                        </View>
                        <View style={{height:60, width:'90%', justifyContent:'center', alignSelf:'center'}}>
                            <TouchableOpacity style={{width:'100%', height:40, backgroundColor:'#c0c0c0', borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#008080', fontFamily: FONT.SoraMedium}}>View detail</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <View style={{flex:0.4}}>
                    <TouchableOpacity style={{display:'flex', flexDirection:'row',alignItems:'center', width:'90%', height:50,alignSelf:'centers', alignSelf:'center', justifyContent:'space-between'}} onPress={()=> setDisplayDiscount(true)}>
                        <View style={{width:50, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{width:25, height:20, backgroundColor:'#008080', borderRadius:5, textAlign:'center', color:'#ffffff', fontWeight:500}}>%</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text style={{fontFamily:FONT.SoraMedium}}>Redeem code</Text>
                            <Text style={{fontFamily:FONT.SoraRegular, fontSize:13}}>Enter promo code here</Text>
                        </View>
                        
                        <Image resizeMode="cover" source={rightArrow} style={{width:25, height:25, position:'absolute', right:10}}/>
                        
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={()=> CheckoutHandler()}>
                    <Text style={{color:'#ffffff', fontFamily:FONT.SoraMedium}}>Go to checkout</Text>
                </TouchableOpacity>
            </View>
            
            <DiscountBottomSheet display={displayDiscount} onclose={()=> setDisplayDiscount(false)} publicCart={publicCart} submitCode={(discountData) => calculateDiscount(discountData)}/>
        </Modal>
    )
}


const styles = StyleSheet.create({
    Container:{
        flex:1,
    },

    header:{
        width:'100%',
        height:110,
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


    middelContainer:{
        flex:1
    },

    orderContainer:{
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        borderWidth:0.8,
        borderColor:'#C0C0C0'
    },
    
    checkoutButton:{
        width:'90%', 
        backgroundColor:'#008080', 
        height:50, 
        alignSelf:'center', 
        position:'absolute', 
        bottom:20, 
        borderRadius:5, 
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
    }
})