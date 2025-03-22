import { StyleSheet, View, Text, TouchableOpacity,Modal, Image , ScrollView} from "react-native";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contextApi/user_context";
import { SocketioContext } from "../../contextApi/socketio_context";
import {SERVER_IP} from '@env'
import { useNavigation } from "@react-navigation/native";
import log from 'minhluanlu-color-log';
import { config } from "../../config";

const leftArow = require('../../assets/icons/left_arrow.png')
const cartIcon = require('../../assets/icons/emtyCart.png')


export default function Cart(){

    const {publicCart, setPublicCart} = useContext(UserContext);
    const {publicSocketio, setPublicSocketio} = useContext(SocketioContext)
    const navigate = useNavigation()

    function foodQuantityHandler(action, food) {
        
        setPublicCart(prevCart => {
            return {
                ...prevCart,  // Keep other properties unchanged
                Food_item: prevCart.Food_item.map(item => 
                    item.Food_id === food.Food_id 
                        ? { ...item, Food_quantity: action ? item.Food_quantity + 1 : Math.max(1, item.Food_quantity - 1) }
                        : item
                )
            };
        });
        
        // if the food quantity is 1 then stop update the Total price
        if(food.Food_quantity > 1){
            const foodPrice = food.Price;
            setPublicCart(prevCart => ({
                ...prevCart,
                Total_price: action 
                    ? prevCart.Total_price + foodPrice  // Add price if action is true
                    : prevCart.Total_price - foodPrice  // Subtract price if action is false
            }));
        }
        else if (food.Food_quantity === 1) { 
            if (action) {  //  Only add price, no subtraction
                const FoodPrice = food.Price;
                setPublicCart(prevCart => ({
                    ...prevCart,
                    Total_price: prevCart.Total_price + FoodPrice
                }));
            }
        }
    }

    function drinkQuantityHandler(action, drink) {
        setPublicCart(prevCart => {
            return {
                ...prevCart,  // Keep other properties unchanged
                Drink_item: prevCart.Drink_item.map(item => 
                    item.Drink_id === drink.Drink_id 
                        ? { ...item, Drink_quantity: action ? item.Drink_quantity + 1 : Math.max(1, item.Drink_quantity - 1) }
                        : item
                )
            };
        });
        
        // if the food quantity is 1 then stop update the Total price
        log.err(drink.Drink_quantity)
        if(drink.Drink_quantity > 1 ){
            const drinkPrice = drink.Drink_price;
            setPublicCart(prevCart => ({
                ...prevCart,
                Total_price: action 
                    ? prevCart.Total_price + drinkPrice  // Add price if action is true
                    : prevCart.Total_price - drinkPrice  // Subtract price if action is false
            }));
        }else if (drink.Drink_quantity === 1) { 
            if (action) {  //  Only add price, no subtraction
                const drinkPrice = drink.Drink_price;
                setPublicCart(prevCart => ({
                    ...prevCart,
                    Total_price: prevCart.Total_price + drinkPrice
                }));
            }
        }
    }

    async function sendOrderHandler() {
        publicSocketio.current.emit("user.newOrderHandler.1", publicCart);

        // make the loading screen to want oder send to store
    }

    useEffect(()=>{
        log.debug({Cart: publicCart})
    },[])
    

    return(
        <Modal
            animationType="slide"
        >
            
            <TouchableOpacity onPress={()=> navigate.navigate("Home")} style={{backgroundColor:'#f8f8f8', width:40, height:40, borderRadius:40, borderWidth:0.2, position:'absolute', top:10, left:10, justifyContent:'center', alignItems:'center'}}>
                <Image resizeMode="cover" style={{width:'60%', height:'60%'}} source={leftArow}/>
            </TouchableOpacity>
            
            <View style={styles.Container}>
                <View style={styles.topContainer}>
                    <Text style={{flex:1, color:'#000000', fontSize:30, fontWeight:500}}>Cart</Text>
                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:16, color:'grey', paddingRight:8}}>Pickup time</Text>
                        <TouchableOpacity style={{width:60, height:30, backgroundColor:'#008080', borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:14, fontWeight:400, color:'#ffffff'}}>15:12</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.middleContainer}>
                    <ScrollView>
                        { Object.keys(publicCart).length > 0
                            ? publicCart.Food_item.map((item, index) =>(
                                <View key={index} style={styles.foodContainer}> 
                                    <View style={styles.imageContainer}>
                                        <Image resizeMode="cover" style={{width:60, height:60}} source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                                    </View>
                                    <View style={styles.foodInfoContainer}>
                                        <Text>{item.Food_name}</Text>
                                        <View style={styles.foodQuantityContainer}>
                                            <Text style={{flex:1}}>{item.Price * item.Food_quantity}Kr</Text>
                                            <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=> foodQuantityHandler(false, item)} style={{width:30, height:30, backgroundColor:'#ffffff', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                    <Text>-</Text>
                                                </TouchableOpacity>

                                                    <Text style={{paddingLeft:8, paddingRight:8, fontSize:15, fontWeight:500}}>{item.Food_quantity}</Text>

                                                <TouchableOpacity onPress={()=> foodQuantityHandler(true, item)} style={{width:30, height:30, backgroundColor:'#008080', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                    <Text>-</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                            :
                            <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginTop:20}}>
                                <Image resizeMode="cover" style={{width:60, height:60}} source={cartIcon}/>
                                <Text style={{fontSize:20, fontWeight:500}}>Your Cart is Emty</Text>
                                <Text>Select a store and add food to cart to place an order</Text>

                                <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{width:'60%',height:50, backgroundColor:'#008080', marginTop:10, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:16, fontWeight:500, color:'#ffffff'}}>Find Store</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        { Object.keys(publicCart).length > 0 &&
                            publicCart.Drink_item.map((item, index) =>(
                                <View key={index} style={styles.foodContainer}> 
                                    <View style={styles.imageContainer}>
                                        <Image resizeMode="cover" style={{width:60, height:60}} source={{uri: `${SERVER_IP}/${item.Drink_image}`}}/>
                                    </View>
                                    <View style={styles.foodInfoContainer}>
                                        <Text>{item.Food_name}</Text>
                                        <View style={styles.foodQuantityContainer}>
                                            <Text style={{flex:1}}>{item.Drink_price * item.Drink_quantity}Kr</Text>
                                            <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=> drinkQuantityHandler(false, item)} style={{width:30, height:30, backgroundColor:'#ffffff', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                    <Text>-</Text>
                                                </TouchableOpacity>

                                                    <Text style={{paddingLeft:8, paddingRight:8, fontSize:15, fontWeight:500}}>{item.Drink_quantity}</Text>

                                                <TouchableOpacity onPress={()=> drinkQuantityHandler(true, item)} style={{width:30, height:30, backgroundColor:'#008080', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                    <Text>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
                
                <View style={styles.bottomContainer}>
                    <View style={styles.price_Container}>
                        <Text style={{fontSize:18, fontWeight:'semibold', color:'#3C2F2F'}}>Total</Text>
                        <Text style={{fontSize:32, fontWeight:'semibold', color:'#000000'}}>{Object.keys(publicCart).length > 0 ? publicCart.Total_price : 0}Kr</Text>
                    </View>

                    <TouchableOpacity style={Object.keys(publicCart).length > 0 ? styles.orderButton : styles.disableButton} onPress={()=> Object.keys(publicCart).length > 0 && sendOrderHandler()} >
                        <Text style={{fontSize:18, fontWeight:'semibold', color:'#ffffff', textAlign:'center'}}>Order now</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1,
        marginTop:30
    },

    
    topContainer: {
        flex:0.5  ,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:'95%', 
        alignSelf:'center'
    },

    //////////////////////////
    middleContainer: {
        flex:2,
        overflow:'hidden',
    },

    foodContainer:{
        display:'flex',
        flexDirection:'row',
        width:'90%', 
        alignSelf:'center',
        borderBottomWidth:0.2,
        marginTop:8
    },

    imageContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:8
    },

    foodInfoContainer:{
        flex:3
    },

    foodQuantityContainer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    },
    ////////////////////////////
    bottomContainer: {
        flex:1,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },

    price_Container:{
        flex:1,
        marginLeft:15
    },

    orderButton:{
        flex:1.5,
        backgroundColor:'#008080',
        height:55,
        borderRadius:15,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center'
    },

    disableButton:{
        flex:1.5,
        backgroundColor:'grey',
        height:55,
        borderRadius:15,
        marginRight:15,
        justifyContent:'center',
        alignItems:'center', 
        opacity:0.7
    }

})