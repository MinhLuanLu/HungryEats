import { StyleSheet, View, Text, TouchableOpacity,Modal, Image , ScrollView, TextInput, TouchableWithoutFeedback} from "react-native";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contextApi/user_context";
import {SERVER_IP} from '@env'
import { useNavigation } from "@react-navigation/native";
import log from 'minhluanlu-color-log';
import axios from "axios";
import { config } from "../../config";
import { SocketioContext } from "../../contextApi/socketio_context";
import SendOrderLoading from "../../conponents/sendOrderLoading";
import {FONT} from "../../fontConfig";
import { useStripe } from "@stripe/stripe-react-native";
import Animated, {withTiming, withSequence, withSpring, useSharedValue, useAnimatedStyle, FadeInUp, FadeInDown} from "react-native-reanimated";
import { Chase } from "react-native-animated-spinkit";


const leftArow = require('../../assets/icons/left_arrow.png')
const cartIcon = require('../../assets/icons/emtyCart.png')


export default function Cart1(){

    const {publicUser, setPublicUser} = useContext(UserContext);
    const {publicSocketio, setPublicSocketio} = useContext(SocketioContext);
    const {publishableKey, setPublishableKey} = useContext(UserContext)

    const {publicCart, setPublicCart} = useContext(UserContext);
    const [sendOrderLoading, setSendOrderLoading] = useState(false);
    const navigate = useNavigation()

    const [discountCode, setDiscountCode] = useState("");
    const [applyCode, setApplyCode] = useState(false);
    const [activeInput, setActiveInput] = useState(false)
    const [afterMonsPrice, setAfterMonsPrice] = useState(null);
    const [displayCode, setDisplayCode] = useState(false);
    const [discountData, setDiscountData] = useState({});


    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const now = new Date();
    const currentTime = now.toLocaleTimeString(); // e.g., "3:27:15 PM"

    // todo sum all food price * total quantity
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

            setAfterMonsPrice(publicCart.Total_price + publicCart.Total_price * 0.25);
        }

        console.log(publicCart)

    },[publicCart])


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

    ////////////////////////////////////////
    const applyButtonScale = useSharedValue(1);
    const loadingScale = useSharedValue(0);
    const cancelButtonScale = useSharedValue(0)
    const LoadingAnimated = Animated.createAnimatedComponent(Chase)

    const applyButtonAnimation = useAnimatedStyle(()=>{
        return{
            transform:[{scale: applyButtonScale.value}]
        }
    })
    const loadingAnimation = useAnimatedStyle(()=>{
        return{
            transform:[{scale: loadingScale.value}]
        }
    })

    const cancleButtonAnimation = useAnimatedStyle(()=>{
        return{
            transform:[{scale: cancelButtonScale.value}]
        }
    })

    function applyDiscountCodeHandler(){
        discountCode === "" ? alert('please insert promo code') : checkCode()
    }

    function cancleDiscountCodeHandler(){
        applyButtonScale.value = withTiming(1, {duration:500})
        loadingScale.value = withTiming(0, {duration:200});
        cancelButtonScale.value = withTiming(0, {duration:500})
        log.info('---------- Cleared Discount code ----------------')
        setDiscountData({})
        setDiscountCode("");
        setApplyCode(false)
    }

    async function checkCode() {
        applyButtonScale.value = withTiming(0, {duration:200})
        loadingScale.value = withTiming(1, {duration:200})
        
        console.log(' ---------------- Checking Promo code -----------------------')
        try{
            const applyDiscountCode = await axios.post(`${SERVER_IP}/ApplyDiscountCode/api`,{
                User: publicCart.User,
                Store: publicCart.Store,
                DiscountCode: discountCode
            });
            if(applyDiscountCode.data.success){
                console.log(applyDiscountCode.data.data)
                setTimeout(() => {
                    loadingScale.value = withTiming(0, {duration:500});
                    cancelButtonScale.value = withTiming(1, {duration:500})
                    setApplyCode(true)
                }, 2000);
            }
        }
        catch(error){
            console.log(error)
        }
    }

    // method => True or False
    //True add discount to total price
    //False remove discount from total price
    function calculateDiscountCode(method,data){
 
    }

    ////////////////////////////////////////////////////////////////
    // ================= Payment Handler =================== //

    async function sendOrderHandler() {
        publicCart.Moms = publicCart.Total_price * 0.25 // set moms price 
        publicCart.Pickup_time = currentTime // set pickup time
        // Todo make user select time to pickup//
        // Todo Add picup time for order ////
        const createPayment = await createPaymentIntent()
        const {customer, ephemeralKey, paymentIntent, publishableKey } = createPayment
        setPublishableKey(publishableKey

        )
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            defaultBillingDetails: {
                email: publicUser.Email,
                name: publicUser.Username,
            }
          });
        if(error){
            console.log(error)
        }

        openPaymentSheet()
    }

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
    
        if (error) {
          alert(`Cancel Payment: ${error.code}`, error.message);
        } 
        else{
            /*
            publicSocketio.current.emit("user.newOrderHandler.1", publicCart); // send order
            setSendOrderLoading(true) // set display to the payment preccess
            */
           alert('Paymeny successfully')
        }
    
      };

    
    async function createPaymentIntent() {
        try{
            const paymentIntent = await axios.post(`${SERVER_IP}/payment/api`,{
                User: publicUser,
                Order: publicCart
            })
            return paymentIntent.data
        }catch(error){
            console.log(error)
        }
    }

    return(
        <Modal
            animationType="slide"
        >
            
            <TouchableOpacity onPress={()=> navigate.navigate("Home")} style={{backgroundColor:'#f8f8f8', width:40, height:40, borderRadius:40, borderWidth:0.2, position:'absolute', top:15, left:10, justifyContent:'center', alignItems:'center'}}>
                <Image resizeMode="cover" style={{width:'60%', height:'60%'}} source={leftArow}/>
            </TouchableOpacity>
            
            <TouchableWithoutFeedback onPress={()=>{ setDisplayCode(!displayCode)}}>
            <View style={styles.Container}>
                <View style={styles.topContainer}>
                    <Text style={{flex:1, color:'#000000', fontSize:28, fontFamily:FONT.SoraSemiBold}}>Cart</Text>
                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:15, color:'grey', paddingRight:8, fontFamily:FONT.SoraMedium}}>Pickup time</Text>
                        <TouchableOpacity style={{width:'auto', height:30, borderRadius:20, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:14, color:'#000000', fontFamily:FONT.SoraRegular}}>{currentTime}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.middleContainer}>
                    <ScrollView>
                        { Object.keys(publicCart).length > 0
                            ? publicCart.Food_item.map((item, index) =>(
                                <TouchableWithoutFeedback key={index}>
                                    <View style={styles.foodContainer}> 
                                        <View style={styles.imageContainer}>
                                            <Image resizeMode="cover" style={{width:60, height:60, borderRadius:5}} source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                                        </View>
                                        <View style={styles.foodInfoContainer}>
                                            <Text style={{fontSize:15, fontFamily:FONT.SoraMedium}}>{item.Food_name}</Text>
                                            <View style={styles.foodQuantityContainer}>
                                                <Text style={{flex:1, fontSize:15, fontFamily:FONT.SoraRegular}}>{item.Price * item.Food_quantity}Kr</Text>
                                                <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                                    <TouchableOpacity onPress={()=> foodQuantityHandler(false, item)} style={{width:30, height:30, backgroundColor:'#ffffff', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                        <Text>-</Text>
                                                    </TouchableOpacity>

                                                        <Text style={{paddingLeft:8, paddingRight:8, fontSize:15, fontWeight:500}}>{item.Food_quantity}</Text>

                                                    <TouchableOpacity onPress={()=> foodQuantityHandler(true, item)} style={{width:30, height:30, backgroundColor:'#008080', borderRadius:30, justifyContent:'center', alignItems:'center', borderWidth:0.2}}>
                                                        <Text>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))
                            :
                            <View style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginTop:20}}>
                                <Image resizeMode="cover" style={{width:60, height:60}} source={cartIcon}/>
                                <Text style={{fontSize:20, fontFamily:FONT.SoraSemiBold}}>Your Cart is Emty</Text>
                                <Text style={{fontFamily:FONT.SoraRegular, textAlign:'center'}}>Select a store and add food to cart to place an order</Text>

                                <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{width:'60%',height:50, backgroundColor:'#008080', marginTop:10, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:16, fontFamily:FONT.SoraMedium, color:'#ffffff'}}>Find Store</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        { Object.keys(publicCart).length > 0 &&
                            publicCart.Drink_item.map((item, index) =>(
                                <TouchableWithoutFeedback key={index}>
                                    <View style={styles.foodContainer}> 
                                        <View style={styles.imageContainer}>
                                            <Image resizeMode="cover" style={{width:60, height:60, borderRadius:5}} source={{uri: `${SERVER_IP}/${item.Drink_image}`}}/>
                                        </View>
                                        <View style={styles.foodInfoContainer}>
                                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:15}}>{item.Drink_name}</Text>
                                            <View style={styles.foodQuantityContainer}>
                                                <Text style={{flex:1, fontFamily:FONT.SoraRegular, fontSize:15}}>{item.Drink_price * item.Drink_quantity}Kr</Text>
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
                                </TouchableWithoutFeedback>
                            ))
                        }
                    </ScrollView>
                </View>

                <View style={{flex:1, width:'90%', alignSelf:'center', alignItems:'center',justifyContent:'center', borderBottomWidth: !activeInput ? 0.5 : 0}}>
                    <View style={{justifyContent:'center', width:'98%'}}>
                        <TextInput
                            style={[styles.discountInput, {borderColor: activeInput ? '#008080' : 'grey', borderWidth: activeInput ? 1 : 0.5, fontFamily: applyCode ? FONT.SoraMedium : FONT.SoraRegular}]}
                            value={discountCode}
                            placeholder="Promo code"
                            onChangeText={text => setDiscountCode(text)}
                            onFocus={()=> {setActiveInput(true), setDisplayCode(!displayCode)}}
                            onBlur={()=>{setActiveInput(false), setDisplayCode(!displayCode)}}
                        />
                        {!applyCode ?
                            <TouchableOpacity onPress={()=> applyDiscountCodeHandler()} style={styles.applybutton}>
                                <Animated.Text style={[{fontSize:15, color:'#008080',fontFamily:FONT.Sora}, applyButtonAnimation]}>Apply</Animated.Text>
                                <Animated.View style={[{position:'absolute'}, loadingAnimation]}>
                                    <LoadingAnimated size={30} color="grey"/>
                                </Animated.View>
                            </TouchableOpacity>  
                            :
                            
                            <TouchableOpacity onPress={()=> cancleDiscountCodeHandler()} style={styles.applybutton}>                                                          
                                    <Animated.Text style={[{fontSize:16, color:'#008080',fontFamily:FONT.SoraSemiBold}, cancleButtonAnimation]}>X</Animated.Text>                                                              
                            </TouchableOpacity>  
                            
                        }
                    </View>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'98%', alignSelf:'center', marginTop:10}}>
                        <View>
                            <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Subtotal</Text>
                            <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Moms</Text>
                            <Text style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Total</Text>
                            {applyCode && <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000)} style={{fontSize:14, color:"grey", fontFamily:FONT.Sora}}>Discount</Animated.Text>}
                        </View>
                        <View>
                            <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? publicCart.Total_price : 0}Kr</Text>
                            <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(publicCart.Total_price * 0.25) : 0}Kr</Text>
                            <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(afterMonsPrice) : 0}Kr</Text>
                            {applyCode && <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000)} style={{fontSize:14, color:"green", fontFamily:FONT.Sora}}>-150Kr</Animated.Text>}
                        </View>
                    </View>
                </View>
                
                <View style={[styles.bottomContainer, { opacity: activeInput ? 0 : 1 }]}>
                    <View style={styles.price_Container}>
                        <Text style={{fontSize:18, fontFamily:FONT.SoraMedium, color:'#3C2F2F'}}>Total</Text>
                        <Text style={{fontSize:32, fontWeight:'semibold', color:'#000000'}}>{Object.keys(publicCart).length > 0 ? Math.round(afterMonsPrice) : 0}Kr</Text>
                    </View>

                    <TouchableOpacity style={Object.keys(publicCart).length > 0 ? styles.orderButton : styles.disableButton} onPress={()=> Object.keys(publicCart).length > 0 && sendOrderHandler()} >
                        <Text style={{fontSize:18, fontFamily:FONT.SoraMedium, color:'#ffffff', textAlign:'center'}}>Order now</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            </TouchableWithoutFeedback>
            
            {sendOrderLoading ?
                <SendOrderLoading 
                    onclose={()=> {
                        setPublicCart({}),
                        setSendOrderLoading(false)}} 
                    order={publicCart} 
                    cancle={()=> setSendOrderLoading(false)}/>
                :
                null
            }
        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1,
        marginTop:40
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
        //borderBottomWidth:0.2,
        marginTop:8,
        backgroundColor: '#f8f8f8', 
        height:80,
        alignItems:'center',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
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
        alignItems:'center',
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
        alignItems:'center',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
        
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
    },

    discountInput:{
        backgroundColor:"#f8f8f8",
        width:'100%',
        alignSelf:'center',
        height:55, 
        borderRadius:5,
        paddingLeft:10,
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
    },

    applybutton:{
        position:'absolute',
        width:50,
        height:'70%',
        backgroundColor:'transparent',
        right:10,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    }

})