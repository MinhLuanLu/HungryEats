import { StyleSheet, SafeAreaView,View, Text, TouchableOpacity, Image, ScrollView, Modal} from "react-native";
import Animated,{useSharedValue, useAnimatedStyle, withTiming, withSpring,FadeInDown} from "react-native-reanimated";
import { useEffect, useState, useContext } from "react";
import {SERVER_IP} from "@env";
import { useSocketio } from "../../contextApi/socketio_context";
import { FONT } from "../../fontConfig";
import { UserContext } from "../../contextApi/user_context";
import { SocketioContext } from "../../contextApi/socketio_context";
import DiscountBottomSheet from "../../conponents/DiscountBottomSheet";
import { useNavigation } from "@react-navigation/native";
import { discountType } from "../../config";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import log from "minhluanlu-color-log";
import { responsiveSize } from "../../utils/responsive";
import OrderLoading from "../../conponents/OrderLoading";
import { config } from "../../config";
import EmtyCart from "../../conponents/emtyCart";
import CustomOrder from "../customOrder/customOrder";
import OrderHeader from "../../conponents/orderHeader";
import Orders from "../../conponents/orders";


const downArrow = require('../../assets/icons/down_arrow.png')
const rightArrow = require('../../assets/icons/right_arrow.png')


export default function Cart(){
    const navigate = useNavigation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const {publicCart, setPublicCart} = useContext(UserContext);
    const {publicUser, setPublicUser} = useContext(UserContext);
    const {socket} = useSocketio()
    const {publishableKey, setPublishableKey} = useContext(UserContext);
    const {publicPendingOrder, setPublicPendingOrder} = useContext(UserContext);

    const [displayOrderLoading, setDisplayOrderLoading] =useState(false);
    const [orderDetailDisplay, setOrderDetailDispaly] = useState(false)
    const [edit, setEdit] = useState(false);
    const [selectOption, setSelectOption] = useState(false);
    const [orderAgain, setOrderAgain] = useState(false)
    const [orderAgainList, setOrderAgainList] = useState([])
    
    const [applyDiscount, setApplyDiscount] = useState(false);
    const [afterMonsPrice, setAfterMonsPrice] = useState(null);
    const [momPrice, setMomPrice] = useState()
    const [displayDiscount, setDisplayDiscount] =  useState(false);
    const [discountInfo, setDiscountInfo] = useState({});
    const [subTotal, setSubtotal] = useState()
    const [totalPrice, setTotalPrice] = useState()

    const [order, setOrder] = useState([]);

    const [paymentIntentId, setPaymentIntentId] = useState()


    useEffect(() => {
        if (!socket) return;

        const handleOrderUnprocessing = (order) => {
          log.debug({
            message: 'Received order unprocessing status from socketIO',
            order: order
          });
          setOrder(order);
          /*
          setPublicPendingOrder((prevOrder) => [...prevOrder, order]);
          setOrder(order);
          */
          socket.off(config.orderUnprocessing, handleOrderUnprocessing);
        };
      
        const handleConfirmReceivedOrder = (order) => {
          log.debug({
            message:'Received order confirm status from socketIO',
            order: order
          });
          setPublicPendingOrder((prevOrder) => [...prevOrder, order]);
          setOrder(order);
          socket.off(config.confirmRecivedOrder, handleConfirmReceivedOrder);
        };
      
        const handleFailedReceivedOrder = (order) => {
          log.err({
            message: 'Failed to send Order',
            order: order
          });
          setOrder(order);
          refundHandler()
          socket.off(config.failedRecivedOrder, handleFailedReceivedOrder);
        };
      
        socket.on(config.orderUnprocessing, handleOrderUnprocessing);
        socket.on(config.confirmRecivedOrder, handleConfirmReceivedOrder);
        socket.on(config.failedRecivedOrder, handleFailedReceivedOrder);
      
        return () => {
            socket.off(config.orderUnprocessing, handleOrderUnprocessing);
            socket.off(config.confirmRecivedOrder, handleConfirmReceivedOrder);
            socket.off(config.failedRecivedOrder, handleFailedReceivedOrder);
          };
    
      }, [displayOrderLoading]);

    
    useEffect(()=>{
        !displayOrderLoading && setOrder({})
    },[displayOrderLoading])
      
    ////////////////////////////////////////////////////////////////////
    // Calculate the order price when cart open //

    useEffect(()=>{
        calculateOrderPrice() // run calculate price function //
        setDisplayDiscount(false); // set discount bottomSheet to false as default //
        setApplyDiscount(false) // set apply discount to false as default //
        setOrder(false)
        
    },[]);

    function calculateOrderPrice(){
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

            console.log('List Price', listPrice)
            const total = listPrice.reduce((acc, curr) => acc + curr, 0); // sum price
            publicCart.Total_price = total; // update the order total Price
            setSubtotal(total)

            setAfterMonsPrice(publicCart.Total_price + publicCart.Total_price * 0.25);
            setMomPrice(publicCart.Total_price * 0.25); // calculate mom value as 25% af total price
          
            publicCart.Total_price = total; // it is total price of order without mom as 25%
            setTotalPrice(publicCart.Total_price)
        }
    }


    function calculateDiscount(discountData){
        let discountValue = discountData.Discount_value;
        if(typeof(discountData.Discount_value) === "string"){
            discountValue = Number(discountData.Discount_value);
        }

        console.log(`Discount Value: ${discountValue}%`)
        const discountPrice = publicCart.Total_price * (discountValue / 100);
        
        log.debug(`Discount price: TotalPrice of Order (${publicCart.Total_price}) * discount% (${discountValue / 100}) = ${discountPrice}`);
        publicCart.Total_price = publicCart.Total_price - discountPrice;
        publicCart.Discount = discountData;

        setMomPrice(publicCart.Total_price * 0.25); // calculate mom value as 25% af total price
        setTotalPrice(publicCart.Total_price);

        setDiscountInfo(discountData)
        setApplyDiscount(true)
        
    }

    async function createPaymentIntent() {
        // set moms to order
        publicCart.Moms = {
            Moms_price: publicCart.Total_price * 0.25,
            Moms_value: '25%',
          };
          log.debug({
            message: 'set moms info to Order.',
            momInfo: publicCart.Moms,
          });
          
        try{
            console.log('------------ create Payment Intent ---------------------')
            const paymentIntent = await axios.post(`${SERVER_IP}/payment/api`,{
                User: publicUser,
                Order: publicCart
            })
            return paymentIntent.data
        }catch(error){
            console.log(error)
        }
    }

    

    async function CheckoutHandler() {
      
        // 1. Create payment intent
        const createPayment = await createPaymentIntent();
        const { customer, ephemeralKey, paymentIntent, publishableKey,paymentIntentId } = createPayment;
      
        // 2. Save publishable key
        setPublishableKey(publishableKey); // <- fixed this line
        setPaymentIntentId(paymentIntentId)
      
        // 3. Initialize payment sheet
        const { error } = await initPaymentSheet({
          merchantDisplayName: 'Example, Inc.',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          defaultBillingDetails: {
            email: publicUser.Email,
            name: publicUser.Username,
          },
          returnURL: `${SERVER_IP}/payment/api`,
        });
      
        if (error) {
          console.log(error);
          return;
        }
      
        // 4. Now open the payment sheet
        await openPaymentSheet();
      }
      
      const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
      
        if (error) {
          alert(`Cancel Payment: ${error.code}, ${error.message}`);
          log.warn(error);
        } else {
        
          log.debug('Payment successfully, sending order.');
          socket.emit( config.newOrderHandler, publicCart); // send order
          setDisplayOrderLoading(true)
        }
      };


    function selectButtonHandler(){
        selectOption ? setSelectOption(false) : setSelectOption(true)
    }

    // when the CustomOrder close, calculate the order price again ///
    function oncloseHandler(){
        setOrderDetailDispaly(false);

        console.log('---- Update order ------')
        calculateOrderPrice()
        
        if(publicCart.Food_item.length === 0 && publicCart.Drink_item.length === 0){
            setPublicCart({})
        }
    }

    // listen to order again to display orders //
    useEffect(()=>{
        if(orderAgain){
            const orderHistoryHandler = async () => {
            try{
                const orderHistory = await axios.post(`${SERVER_IP}/orderHistory/api`,{
                User: publicUser
                })
        
                if(orderHistory?.data?.success){
                console.log(orderHistory?.data?.message);
                setOrderAgainList(orderHistory?.data?.data);
                console.log(orderHistory?.data?.data)
                return
                }
        
            }
            catch(error){
                log.warn(error)
            }
            }
            
            orderHistoryHandler()
        }
    },[orderAgain]);

    // handle refund when orderfailed
    const refundHandler = async () => {
        log.warn("--------- Order failed, start refund process --------------");

        const refund = await axios.get(`${SERVER_IP}/payments/refund/${paymentIntentId}`)
        if(refund.data.success){
            log.debug(refund.data.message);
            alert('Refund your order payemnt successfully')
            /// it should crate a notification ///
            return
        }

        alert("Failed to refund order payment")
        /// it should crate a notification ///
        
    }

    
    
    if(displayOrderLoading) return <OrderLoading order={order} store={publicCart.Store} failedClose={()=> setDisplayOrderLoading(false)} confirmClose={()=> { setDisplayOrderLoading(false), setPublicCart({}) }} paymentIntentId={paymentIntentId}/>
    if(Object.keys(publicCart).length === 0 ) return <EmtyCart/>
    if(orderDetailDisplay) return <CustomOrder onclose={()=> oncloseHandler()} order={publicCart}/>


    return(
        <Modal
            animationType="slide"
        >
            <SafeAreaView style={styles.Container}>
                <OrderHeader orderAgain={()=> setOrderAgain(true)} onclose={()=> setOrderAgain(false)}/>
                { !orderAgain ?
                    <ScrollView style={styles.middelContainer}>
                        <View style={styles.orderContainer}>
                            {edit ?
                                <TouchableOpacity onPress={()=> selectButtonHandler()} style={styles.optionButton}>
                                    {selectOption && <TouchableOpacity onPress={()=> selectButtonHandler()} style={styles.optionButton1}></TouchableOpacity>}
                                </TouchableOpacity>
                                :
                                null
                            }

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
                                <View style={{flex:1, flexDirection:'row', marginTop:10,flexWrap: 'wrap'}}>
                                    {publicCart.Food_item.map((item, index)=>(
                                        <Image key={index} resizeMode="cover" style={{width:65, height:45, borderRadius:10, marginRight:10, marginBottom:5}}  source={{uri: item.Food_image}}/>
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
                                        <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(momPrice) : 0}Kr</Text>
                                        <Text style={{fontSize:14, color:"#000000", fontFamily:FONT.SoraMedium}}>{Object.keys(publicCart).length > 0 ? Math.round(totalPrice + momPrice) : 0}Kr</Text>
                                        {applyDiscount && <Animated.Text entering={FadeInDown.springify().mass(2).stiffness(100).duration(2000)} style={{fontSize:14, color:"green", fontFamily:FONT.Sora}}>- {Object.keys(discountInfo).length !== 0 ? Math.round(totalPrice * (discountInfo.Discount_value / 100)) : 0}Kr</Animated.Text>}
                                    </View>
                                </View>
                            </View>
                            <View style={{height:responsiveSize(60), width:'90%', justifyContent:'center', alignSelf:'center'}}>
                                <TouchableOpacity onPress={()=> setOrderDetailDispaly(true)} style={{width:'100%', height: responsiveSize(40), backgroundColor:'#c0c0c0', borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:'#008080', fontFamily: FONT.SoraMedium}}>View detail</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    :
                    <Orders display={orderAgain} onclose={()=> setOrderAgain(false)} orderList={orderAgainList} />
                }

                {!orderAgain ?
                    <>
                        <View style={{flex:0.4}}>
                            <TouchableOpacity style={{display:'flex', flexDirection:'row',alignItems:'center', width:'90%', height:50,alignSelf:'centers', alignSelf:'center', justifyContent:'space-between'}} onPress={()=> {setDisplayDiscount(true)}}>
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
                    </>
                    : 
                    null
                }
            </SafeAreaView>
            
            
            <DiscountBottomSheet publicCart={publicCart} submitCode={(discountData) => calculateDiscount(discountData)} display={displayDiscount} onclose={()=> setDisplayDiscount(false)}/>
           
           
        </Modal>
    )
}


const styles = StyleSheet.create({
    Container:{
        flex:1,
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
        height: responsiveSize(45), 
        alignSelf:'center', 
        position:'absolute', 
        bottom: responsiveSize(30), 
        borderRadius:5, 
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
    },

    optionButton:{
        width:20,
        height:20,
        backgroundColor:'#e0e0e0',
        borderRadius:20,
        position:'absolute',
        top:10,
        right:10,
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10,
        borderWidth:0.5,
        justifyContent:'center',
        alignItems:'center'
    },

    optionButton1:{
        width:'85%',
        height:'85%',
        backgroundColor:'#008080',
        borderRadius:25,
        position:'absolute',
    }
})