import { StyleSheet, View,Text, TouchableOpacity, Modal, FlatList,Image, TouchableWithoutFeedback, TextInput, BackHandler} from "react-native";
import { UserContext } from "../../contextApi/user_context";
import axios from "axios";
import log from 'minhluanlu-color-log'
import { useContext, useEffect, useState } from "react";
import popUpMessage from "../../conponents/popUpMessage";
import LottieView from "lottie-react-native";
import PopUpMessage from "../../conponents/popUpMessage";
import {SERVER_IP} from '@env';

const down_arrow                    = require('../../assets/icons/down_arrow.png')
const bin_icon                      = require('../../assets/icons/bin_icon.png')
const googlepay_icon                = require('../../assets/icons/googlepay_icon.png')
const mobilepay_icon                = require('../../assets/icons/mobilepay_icon.png')
const applepay_icon                 = require('../../assets/icons/applepay_icon.png')
const card_payment                  = require('../../assets/icons/card_payment.png')


export default function Payment({display_Payment, onclose, socketIO, store_id}){


    const {public_Cart_list, setPublic_Cart_List}                       = useContext(UserContext)
    const { publicEmail, setPublicEmail}                                = useContext(UserContext)
    const {pickup_Time, setPickup_Time} = useContext(UserContext)

    const [foodname_list, setFoodname_List] = useState([]);
    const [drink_list, setDrink_List] = useState([]);
    const [total_price, setTotal_Price] = useState([]);
    const [store_name, setStore_name] = useState("")
    const [sum_price, setSum_Price] = useState(0);
    const [food_quantity, setFood_Quantity] = useState([]);
    const [drink_quantity, setDrinkQuantity] = useState([])
    const [food_id, setFood_id] = useState([]);

    const [order_confirm, setOrder_Comfirm] = useState(null);
    const [discountCode, setDiscountCode] = useState("");
    const [insertCode, setInsertCode] = useState(false);
    const [applyStatus, setApplyStatus] = useState(false)
    const [discountPrice, setdiscountPrice] = useState()



    const render_Food_Item = ({ item }) =>(    
        <TouchableOpacity 
            style={{
                paddingBottom:2, 
                backgroundColor:'#C0C0C0', 
                marginBottom:5, height:'auto', 
                minHeight:80, 
                paddingLeft:10, 
                borderRadius:5,
                shadowColor: '#FFFFFF',
                shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
                shadowOpacity: 0.3,
                shadowRadius: 10, 
                elevation: 10,
                overflow:'hidden',
                width:'97%',
                alignSelf:'center',
                marginTop:5
            }}>    
            <View  style={styles.item}>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{flex:2, color:'#008080', fontWeight:500}}>{item.Food_item.Food_name} <Text style={{color:'#333333', fontWeight:500, fontSize:13}}>{item.Food_item.Food_quantity}(x)</Text></Text>
                </View>
                
                {item.Food_item.Drink.map((drink, index) => (
                    <Text key={index}>{drink.Drink_name} {drink.Drink_quantity}(x)</Text>
                ))}

                <Text>Total price:<Text style={{fontSize:15, fontWeight:500}}> {item.Total_price}Kr</Text></Text>
            </View>
            
            <TouchableWithoutFeedback onPress={()=> alert('delete')}>
                <Image resizeMode="cover" style={{width:15, height:20, position:'absolute', bottom:5, right:10}} source={bin_icon}/>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
    )

   
    useEffect(()=>{
        
        // Create arrays to hold values outside of the loop
        let tempFoodnameList = [];
        let tempTotalPrice = [];
        let tempDrinkList = [];
        let tempStoreName = '';
        let temFoodQuantity = [];
        let temDrinkQuantity = [];
        let temFoodID = []
    
        for (let i = 0; i < public_Cart_list.length; i++) {
            const Store_name = public_Cart_list[i]["Store_name"];
            const Food_name = public_Cart_list[i]["Food_item"]["Food_name"];
            const Food_quantity = public_Cart_list[i]["Food_item"]["Food_quantity"];
            const Food_id = public_Cart_list[i]["Food_item"]["Food_id"]
            const TotalPrice = public_Cart_list[i]["Total_price"];
            const Drink_list = public_Cart_list[i]["Food_item"]["Drink"];
            
            // Process food
            let Food = { "Food_name": `${Food_name}` };
            let FoodQuantity = {[Food_name]:Food_quantity}
            let FoodID = {[Food_name]: Food_id}
            tempFoodnameList.push(Food);
            tempTotalPrice.push(TotalPrice);
            temFoodQuantity.push(FoodQuantity)
            temFoodID.push(FoodID)
            
            // Process drinks
            if (Drink_list.length !== 0) {
                for (let j = 0; j < Drink_list.length; j++) {
                    const Drink_name = Drink_list[j]["Drink_name"];
                    const Drink_quantity = Drink_list[j]["Drink_quantity"];
                    let Drink = { "Drink": `${Drink_name}` };
                    tempDrinkList.push(Drink);
                    let DrinkQuantity = {[Drink_name]:Drink_quantity}
                    temDrinkQuantity.push(DrinkQuantity)
                }
            }
            // Store name (Assuming that all items have the same store name, if not you may need to adjust this)
            tempStoreName = Store_name;
        }

        // Update the state after the loop
        setFoodname_List(tempFoodnameList);
        setTotal_Price(tempTotalPrice);
        setDrink_List(tempDrinkList);
        setStore_name(tempStoreName);
        setFood_Quantity(temFoodQuantity);
        setDrinkQuantity(temDrinkQuantity);
        setFood_id(temFoodID)

        // sum the price of order
        let sum_Total_Price = 0
        for(let price = 0; price < total_price.length; price++){
                sum_Total_Price += total_price[price]
        }
        setSum_Price(sum_Total_Price)


    },[display_Payment, public_Cart_list])
    

    function Handle_Order_Button() {
       
       let order_detail = {
        "Sender":publicEmail, 
        "Store_name": store_name,
        "Store_id": store_id,
        "Food_item": foodname_list,
        "Food_quantity": food_quantity,
        "Drink_item": drink_list,
        "Drink_quantity": drink_quantity,
        "Total_price": sum_price,
        "Pickup_time": pickup_Time,
        "Food_id": food_id,
        "Discount": applyStatus,
        "Discount_code": discountCode
       }

       if(public_Cart_list.length != 0){
            socketIO.current.emit('processOrder',order_detail);
            setOrder_Comfirm(false)
       }else{
        alert("Your cart is emty")
       }
       setSum_Price("")
       ////////// clear all them after order comfirm////////
        setPublic_Cart_List([])
        setDrink_List([])
        setFoodname_List([])
        setStore_name("")
        setTotal_Price([])
        setInsertCode(false)
        setApplyStatus(false)
        setDiscountCode("")
    }

    // ============== Handle check the order is sending to store successfully or not ==================== //
    if(order_confirm == true){
        setTimeout(() => {
        setOrder_Comfirm(null)
        onclose()
        }, 3000);
    }

    if(order_confirm == false){
        setTimeout(() => {
        setOrder_Comfirm(true)
        onclose()
        }, 3000);
    }

    async function HandleApplyButton(){
        try{
            const applyCode = await axios.post(`${SERVER_IP}/discountcode/api`,{
                Email: publicEmail,
                Store_id: store_id,
                Discount_code: discountCode
            });
            if(applyCode?.data?.success){
                log.info(applyCode?.data?.message)
                const discountValue = applyCode?.data?.data?.Discount_value;
                const discountPrice = (Number(discountValue)/100) * sum_price;
                const newPrice = sum_price - discountPrice;
                setdiscountPrice(newPrice.toFixed());
                setApplyStatus(true)
                setDiscountCode(`${discountCode} ${discountValue}%`)
            }else{
                setApplyStatus(false)
                setDiscountCode(`Couldn't be applied`)
            }
        }
        catch(error){
            log.warn(error)
        }
    }

    function HandleCancelApplyCode(){
        setDiscountCode("");
        setApplyStatus(false)
    }

    useEffect(()=>{
        if(!applyStatus){
            setDiscountCode("")
        }
    },[insertCode])

 
    return(
        <Modal
            visible={display_Payment}
            animationType="slide"
        >
            <View style={styles.Container}>
            
                <View style={styles.top_Layer}>
                    { !insertCode &&
                        <View style={{flex:1, width:'90%', alignSelf:'center'}}>
                            <TouchableOpacity style={{backgroundColor:'#F8F8F8', width:40, height:40, justifyContent:'center', borderRadius:30, marginTop:15}} onPress={()=> {onclose()}}>
                                <Image resizeMode="cover" style={{width:20, height:20, alignSelf:'center'}} source={down_arrow}/>
                            </TouchableOpacity>

                            {public_Cart_list.length != 0      
                                ?<View style={{marginTop:10}}>
                                    <Text style={{fontSize:20, fontWeight:400, color:'#000000'}}>Current Order</Text>

                                    <View style={styles.order_info_Container}>
                                        <View style={{flex:1}}>
                                            <Text style={{color:'#000000', fontSize:17, fontWeight:500}}>{store_name}</Text>
                                            <FlatList
                                                data={public_Cart_list}
                                                renderItem={render_Food_Item}
                                            />
                                        </View>
                                    </View>
                                </View>
                                :<View style={{width:'100%', height:'100%', justifyContent:'center'}}>
                                    <Text style={{textAlign:'center', fontSize:20, color:'#000000', fontWeight:500}}>Cart is Emty..</Text>
                                </View>
                            }
                        </View>
                    }
                </View>
                
                {public_Cart_list.length != 0 && (
                    <View>
                        <Text style={{width:'85%', alignSelf:'center', paddingBottom:5, fontWeight:500, paddingLeft:3, fontSize:15}}>Apply promo code</Text>
                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', borderWidth:0.5, width:'85%', alignSelf:'center', borderRadius:3, marginBottom:15, borderColor: !applyStatus ? '#000000' : '#008080', backgroundColor: !applyStatus ? 'none' : '#d8ebeb'}}>
                            <TextInput
                                style={styles.discountInput}
                                placeholder="Promo code"
                                value={discountCode}
                                onChangeText={text => setDiscountCode(text)}
                                onFocus={()=> setInsertCode(true)}
                                onBlur={()=> setInsertCode(false)}
                            /> 
                            {!applyStatus
                                ?
                                <TouchableOpacity style={styles.applyButton} onPress={()=> HandleApplyButton()}>
                                    <Text style={{fontSize:15, fontWeight:500, textAlign:'center', color: insertCode || applyStatus ? '#008080' : 'grey'}}>Apply</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.applyButton} onPress={()=> HandleCancelApplyCode()}>
                                    <Text style={{fontSize:15, fontWeight:500, textAlign:'center', backgroundColor:'transparent', width:'35%', alignSelf:'center', fontSize:15, fontWeight:'thin'}}>X</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                )}

                { !insertCode &&
                    <View style={styles.middle_Layer}>
                        
                        <View style={{flex:1}}>
                            <Text style={{fontSize:18, fontWeight:500,width:'90%', alignSelf:'center'}}>Payment Method</Text>
                        </View>

                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center', flex:2}}>
                            <TouchableOpacity style={styles.payment_box}>
                                <Image resizeMode="cover" style={{width:'70%', height:'70%', alignSelf:'center'}} source={googlepay_icon} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.payment_box}>
                                <Image resizeMode="cover" style={{width:'80%', height:'50%', alignSelf:'center'}} source={mobilepay_icon} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.payment_box}>
                                <Image resizeMode="cover" style={{width:'60%', height:'60%', alignSelf:'center'}} source={applepay_icon} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.payment_box}>
                                <Image resizeMode="cover" style={{width:'60%', height:'60%', alignSelf:'center'}} source={card_payment} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <View style={styles.bottom_Layer}>
                    <View style={styles.price_Container}>
                        <Text style={{fontSize:18, fontWeight:'semibold', color:'#3C2F2F'}}>Total</Text>
                        <Text style={{fontSize:32, fontWeight:'semibold', color:'#000000'}}>{!applyStatus ? sum_price : discountPrice}Kr</Text>
                    </View>

                    <TouchableOpacity style={styles.order_Button} onPress={()=> !insertCode ? Handle_Order_Button() : alert("Please finish apply code..")}>
                        <Text style={{fontSize:18, fontWeight:'semibold', color:'#FFFFFF', textAlign:'center'}}>ORDER NOW</Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            { order_confirm == false  && (
                <View style={{width:'100%', height:'100%', position:'absolute', justifyContent:'center', zIndex:999}}>
                    <LottieView
                        autoPlay
                        style={{width:'50%', height:'50%', alignSelf:'center'}}
                        source={require('../../assets/lottie/loading_order.json')}
                    />
                </View>
            )}

            { order_confirm == true && (
                <PopUpMessage displayPopUpMessage={true} title={"Order Success!"} message={`Your order has been sent to store and waitting to accept.`} onclose={()=> onclose()}/>
            )}

        
        </Modal>
    )
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:'#D7D7D7',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
    },

    top_Layer:{
        flex:2,
        backgroundColor:'#D7D7D7'
    },

    middle_Layer:{
        flex:1,
        backgroundColor:'#D7D7D7',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },

    bottom_Layer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        backgroundColor:'#D7D7D7'
    },

    order_info_Container:{
        marginTop:15,
        height:250,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        backgroundColor:'#D7D7D7',
        overflow:'scroll',
        borderRadius:10,
        
    },

    order_Button:{
        height:70,
        width:'60%',
        backgroundColor:'#008080',
        justifyContent:'center',
        borderRadius:10
    },

    price_Container:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
    },

    payment_box:{
        backgroundColor:'#FFFFFF',
        width:75,
        height:75,
        justifyContent:'center',
        borderRadius:10,
        shadowColor: '#000000', // Color of the shadow
        shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
        shadowOpacity: 0.3, // Opacity of the shadow
        shadowRadius: 10, // Blur radius of the shadow
        elevation: 10
    },

    discountInput:{
        width:'75%',
        height:45,
        paddingLeft:10
    },
    applyButton:{
        width:'25%',
        height:45,
        justifyContent:'center',
    }



})