import { StyleSheet, View,Text, TouchableOpacity, Modal, FlatList,Image, TouchableWithoutFeedback} from "react-native";
import { UserContext } from "../../contextApi/user_context";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contextApi/store_context";
import LottieView from "lottie-react-native";

const down_arrow                    = require('../../assets/icons/down_arrow.png')
const bin_icon                      = require('../../assets/icons/bin_icon.png')
const googlepay_icon                = require('../../assets/icons/googlepay_icon.png')
const mobilepay_icon                = require('../../assets/icons/mobilepay_icon.png')
const applepay_icon                 = require('../../assets/icons/applepay_icon.png')
const card_payment                  = require('../../assets/icons/card_payment.png')


export default function Payment({display_Payment, onclose, socketIO, order_confirm, order_to_fasle, setOrder_Comfirm_to_null}){


    const {public_Cart_list, setPublic_Cart_List}                       = useContext(UserContext)
    const {public_Username, setPublic_Username}                         = useContext(UserContext)
    const { publicEmail, setPuclicEmail}                                = useContext(UserContext)
    const {public_Store_Order_List, setPublic_Store_Order_List}         = useContext(StoreContext)

    const [total_order_price, setTotal_order_price]                     = useState(null)
    const [total_order_price_list, setTotal_order_price_list]           = useState([])


    const render_Food_Item = ({ item }) =>(    
        <TouchableOpacity style={{paddingBottom:2, backgroundColor:'#C0C0C0', marginBottom:5, height:'auto', minHeight:80, paddingLeft:10, borderRadius:5,shadowColor: '#FFFFFF',
            shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
            shadowOpacity: 0.3,
            shadowRadius: 10, 
            elevation: 10,
            overflow:'hidden',
            width:'97%',
            alignSelf:'center',
            marginTop:5
            }}>    
            <Text style={{color:'#000000', fontSize:17, fontWeight:500}}>{item.Store_name}</Text>

            {item.Order_detail.map((food, foodIndex) => (
                <View key={foodIndex} style={styles.item}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{flex:2, color:'#008080', fontWeight:500}}>{food.Food_name} <Text style={{color:'#333333', fontWeight:500, fontSize:13}}>({food.Food_quantity}x)</Text></Text>
                        <Text style={{flex:1, fontSize:15, fontWeight:500}}>{food.Food_price}Kr</Text>
                    </View>

                    {food.Drink.map((drink, drinkIndex) => (
                        <View key={drinkIndex} style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{flex:2}}>- {drink.Drink_name} ({drink.Drink_quantity}x)</Text>
                            <Text style={{flex:1}}>{drink.Drink_price} Kr</Text>
                        </View>
                    ))}
                    <Text>Total price:<Text style={{fontSize:15, fontWeight:500}}> {food.Total_price} Kr</Text></Text>
                </View>
            ))}   
            
            <TouchableWithoutFeedback onPress={()=> alert('delete')}>
                <Image resizeMode="cover" style={{width:15, height:20, position:'absolute', bottom:5, right:10}} source={bin_icon}/>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
    )

    useEffect(()=>{
        for(let i = 0; i < public_Cart_list.length; i++){
            let order_detail = public_Cart_list[i]["Order_detail"]
            for(let j = 0; j < order_detail.length; j++){
                let price = order_detail[j]["Total_price"]
                setTotal_order_price_list((prevtotal_order_price_list)=> [...prevtotal_order_price_list, price])
            }
        }

        if(total_order_price_list.length > 1){
            const total = total_order_price_list.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            setTotal_order_price(total)
        }else{
            setTotal_order_price(total_order_price_list[0])
        }
    },[display_Payment, public_Cart_list])
    

    function Handle_Order_Button() {
        if(public_Cart_list.length > 0){
            socketIO.current.emit('sending_order',public_Cart_list)
            order_to_fasle()
            setPublic_Cart_List([])
            setTotal_order_price(0)
            setPublic_Store_Order_List([])
        }  
    }

    if(order_confirm == true){
        setTimeout(() => {
            setOrder_Comfirm_to_null()
            setTotal_order_price(0)
            onclose()
        }, 3000);
    }

    return(
        <Modal
            visible={display_Payment}
            animationType="slide"
        >
            <View style={styles.Container}>
                <View style={styles.top_Layer}>
                        <View style={{flex:1, width:'90%', alignSelf:'center'}}>
                            <TouchableOpacity style={{backgroundColor:'#F8F8F8', width:40, height:40, justifyContent:'center', borderRadius:30, marginTop:15}} onPress={()=> {onclose(), setTotal_order_price_list([]), setTotal_order_price(0)}}>
                                <Image resizeMode="cover" style={{width:20, height:20, alignSelf:'center'}} source={down_arrow}/>
                            </TouchableOpacity>

                            {public_Cart_list.length > 0      
                                ?<View style={{marginTop:10}}>
                                    <Text style={{fontSize:20, fontWeight:400, color:'#000000'}}>Current Order</Text>

                                    <View style={styles.order_info_Container}>
                                        <View style={{borderBottomWidth:0.5, flex:1}}>
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
                </View>

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

                <View style={styles.bottom_Layer}>
                    <View style={styles.price_Container}>
                        <Text style={{fontSize:18, fontWeight:'semibold', color:'#3C2F2F'}}>Total</Text>
                        <Text style={{fontSize:32, fontWeight:'semibold', color:'#000000'}}>{total_order_price}Kr</Text>
                    </View>

                    <TouchableOpacity style={styles.order_Button} onPress={()=> Handle_Order_Button()}>
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
                <View style={{width:'100%', height:'100%', position:'absolute', justifyContent:'center', zIndex:999}}>
                    <LottieView
                        autoPlay
                        style={{width:'30%', height:'30%', alignSelf:'center'}}
                        source={require('../../assets/lottie/order_confirmed.json')}
                    />
                </View>
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
        justifyContent:'center'
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
    }



})