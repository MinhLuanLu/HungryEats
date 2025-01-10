import { useState, useEffect} from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity , Image, SafeAreaView, Platform} from "react-native";
import { useContext } from "react";
import { UserContext } from "../../Context_API/user_context";
import { StoreContext } from "../../Context_API/store_context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StatusBar } from "expo-status-bar";

import Drink from "../drinks";

const down_arrow = require('../../assets/icons/down_arrow.png')
const left_arrow = require('../../assets/icons/left_arrow.png')


export default function Food_Order({display_food_order, onclose, food_name, food_description, price, socketIO}){


    const { public_StoreName, setPublic_Store_Name} = useContext(StoreContext)
    const {public_Cart_list, setPublic_Cart_List} = useContext(UserContext)
    const {public_Username, setPublic_Username} = useContext(UserContext)
    const { publicEmail, setPuclicEmail} = useContext(UserContext)

    const [total_price, setTotal_price] = useState(price)
    const [portion_Quantity, setPortion_Quantity] = useState(1)
    const [drink_Qauntity, setDrink_Qauntity] = useState(1)
    const [detected_add_click, setDetected_Add_Click] = useState(1)
    const [detected_remove_click, setDetected_Remove_Click] = useState(1)
    
    const [datetime, setDate] = useState(new Date())

    const [pickup_Time, setPickup_Time] = useState(null)
    const [open, setOpen] = useState(false);

    const [name_drink, setName_drink] = useState()
    const [drink_price, setDrink_Price] = useState()
    const [drink_list, setDrink_List] = useState([])

    const {public_Store_Order_List, setPublic_Store_Order_List} = useContext(StoreContext)
    const [order_detail, setOrder_Detail] = useState([])


    const formatDate = (dateObj) => {
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formatTime = (timeObj) => {
        const hours = timeObj.getHours().toString().padStart(2, "0"); // Ensure two digits
        const minutes = timeObj.getMinutes().toString().padStart(2, "0"); // Ensure two digits
        return `${hours}:${minutes}`; // 24-hour format
      };
      


      function Handle_Portion_Count_Add(){
            setPortion_Quantity(portion_Quantity + 1);
            setDetected_Add_Click(detected_add_click + 1)
      }

      function Handle_Portion_Count_Remove(){
        if(portion_Quantity > 1){
            setPortion_Quantity(portion_Quantity - 1)
            setDetected_Remove_Click(detected_remove_click - 1)
        }
      }


    useEffect(()=>{

        setTotal_price(price * portion_Quantity)

    },[detected_add_click])
    

    useEffect(()=>{
        setTotal_price(total_price - price)
        
    },[detected_remove_click])

    useEffect(()=>{
        setTotal_price(price * portion_Quantity)
    },[])


    function Handle_Get_Drink(drink_name, drink_price){
        setTotal_price(total_price + drink_price) // Add drink price to total price

        let drink_Quantity = 0
        let add_quantity = drink_Quantity + 1
        let list = {"Drink_name": drink_name, "Drink_price": drink_price, "Drink_quantity": add_quantity}
        setDrink_List((prevdrink_list) => [...prevdrink_list, list])
        add_quantity = 0   
    }


    function Handle_Add_Button() {
        if(pickup_Time == null){
            alert('Select Time to Pickup the food')
        } 
        else{
            let order_detail = {
                "Food_name": food_name, 
                "Food_price": price,
                "Food_quantity": portion_Quantity,
                "Total_price": total_price,
                "Drink": drink_list,
                "Order_at": formatTime(datetime),
                "Pickup_time": pickup_Time,
                "Sender_info": {"Sender_username": public_Username, "Sender_email": publicEmail}
            }

            const newStoreOrderList = [...public_Store_Order_List, order_detail];
            let data1 = {
                "Store_name": public_StoreName,
                "Order_detail": newStoreOrderList
            }

            if(public_Cart_list.length > 0){
                for(let i = 0; i< public_Cart_list.length; i++){
                    if(public_Cart_list[i]["Store_name"] === public_StoreName){
                        console.log('order is same store name')
                        setPublic_Cart_List((prevPublic_Cart_List) =>
                            prevPublic_Cart_List.filter(item => item["Store_name"] !== public_StoreName)
                        );

                        setPublic_Store_Order_List((prevpublic_Store_Order_List)=> [...prevpublic_Store_Order_List, order_detail])
                        setPublic_Cart_List((prevPublic_Cart_List) => [...prevPublic_Cart_List, data1])
                        
                    }else{
                        setPublic_Store_Order_List([])
                        if(public_Store_Order_List.length ===0){
                            console.log('order not same store name')
                            setPublic_Store_Order_List((prevpublic_Store_Order_List)=> [...prevpublic_Store_Order_List, order_detail])
                            setPublic_Cart_List((prevPublic_Cart_List) => [...prevPublic_Cart_List, data1])
                        }
                    }
                }
            }
            else{
                console.log('add to public cart list')
                setPublic_Store_Order_List((prevpublic_Store_Order_List)=> [...prevpublic_Store_Order_List, order_detail])
                setPublic_Cart_List((prevPublic_Cart_List) => [...prevPublic_Cart_List, data1])
            }

            setTotal_price(price)
            setPortion_Quantity(1)
            setDrink_List([])
            setDrink_Qauntity(0)
            onclose()

            
        
        }
    }

    return(
        <SafeAreaView style={styles.Container}>
            <Modal
                visible={display_food_order}
                animationType="slide"
                statusBarTranslucent={true}
                transparent={true}
                hardwareAccelerated={true}
            >
                <View style={styles.Container}>
                    
                    <View style={{justifyContent:'center',backgroundColor:'#D7D7D7', height:50}}>
                        <TouchableOpacity onPress={()=> {onclose(); setDrink_List([])}} style={{backgroundColor:'#F8F8F8', width:35, height:35, borderRadius:40, justifyContent:'center', marginLeft:10}}>
                            <Image style={{width:18, height:18, alignSelf:'center'}} resizeMode="cover" source={left_arrow}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.top_Layer}>
                        
                        <View style={styles.food_customize_Container}>
                            <View style={{width:'90%', alignSelf:'center', marginBottom:5, marginLeft:5}}>
                                <Text style={{fontSize:20, fontWeight:'bold', textDecorationLine:'underline'}}>{food_name}</Text>
                                <Text style={{fontSize:16, fontWeight:'semibold'}}>{food_description}</Text>
                            </View>


                            <TouchableOpacity onPress={()=> setOpen(true)} style={{height:40, backgroundColor:'#008080', width:'90%', alignSelf:'center', justifyContent:'center', borderRadius:5, display:'flex', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{textAlign:'center', color:'#FFFFFF', fontSize:15, fontWeight:500}}>Select time to pick up</Text>
                                <Image style={{width:18, height:18, marginLeft:3}} resizeMode="cover" source={down_arrow}/>
                                <DateTimePickerModal
                                    isVisible={open}
                                    mode="time"
                                    locale="en_GB"
                                    date={datetime}
                                    buttonTextColorIOS="grey"
                                    onConfirm={(selectedDate)=>{ setPickup_Time(formatTime(selectedDate)), setOpen(false)}}
                                    onCancel={()=> setOpen(false)}
                                    isDarkModeEnabled={true}
                                />
                            </TouchableOpacity>
                            
                            {pickup_Time != null && <Text style={{textAlign:'center', fontSize:16, fontWeight:500}}>PickUp Time: {pickup_Time}</Text>}

                            <View>
                                
                                <Text style={{fontSize:15, fontWeight:500,paddingBottom:10,width:'85%',alignSelf:'center'}}>Portion</Text>
                                <View style={styles.portion_container}>
                                    <TouchableOpacity onPress={()=> Handle_Portion_Count_Remove()} style={{width:40, height:40, backgroundColor:'#008080', borderRadius:10, justifyContent:'center'}}>
                                        <Text style={{color:'#FFFFFF', fontSize:30, textAlign:'center'}}>-</Text>
                                    </TouchableOpacity>

                                    <View style={{justifyContent:'center'}}>
                                        <Text style={{color:'#000000', fontSize:20, textAlign:'center', fontWeight:500}} >{portion_Quantity}</Text>
                                    </View>

                                    <TouchableOpacity onPress={()=> Handle_Portion_Count_Add()} style={{width:40, height:40, backgroundColor:'#008080', borderRadius:10, justifyContent:'center'}}>
                                        <Text style={{color:'#FFFFFF', fontSize:23, textAlign:'center'}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    
                    <View style={styles.middle_Layer}>
                        <Text style={{marginLeft:15, fontSize:20, fontWeight:'semibold', marginBottom:10}}>Drinks</Text>
                        <View style={{marginTop:5, width:'100%', height:150}}>
                            <Drink  Drink_name={Handle_Get_Drink}/>
                        </View>
                    </View>

                    <View style={styles.bottom_Layer}>
                        
                        <View style={styles.price_Container}>
                            <Text style={{fontSize:16, fontWeight:'semibold', color:'#808080'}}>Total price</Text>
                            <Text  style={{fontSize:36, fontWeight:'semibold'}}>{total_price}<Text style={{fontSize:24, fontWeight:'semibold',color:'#000000'}}>Kr</Text></Text>
                        </View>
                        <View style={styles.order_button_Container}>
                            <TouchableOpacity onPress={()=> Handle_Add_Button()} style={{backgroundColor:'#008080', height:70, width:200, borderRadius:10, justifyContent:'center'}}>
                                <Text style={{fontSize:18, fontWeight:'semibold', textAlign:'center', color:'#FFFFFF'}}>Add to cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 30
    },

    top_Layer:{
        flex:1,  
        backgroundColor:'#D7D7D7',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:10
    },

    food_Image_Container:{
        flex:1,
        marginLeft:10
    },

    food_customize_Container:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        height:'100%',
        justifyContent:'space-between'
    },

    portion_container:{
        display:'flex', 
        flexDirection:'row', 
        width:'80%',  
        alignSelf:'center',
        justifyContent:'space-between',
        marginBottom:10

    },

    middle_Layer:{
        flex:1,
        backgroundColor:'#D7D7D7',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center'
    },

    bottom_Layer:{
        flex:0.5,
        backgroundColor:'#D7D7D7',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },

    price_Container:{
        flex:1,
         marginLeft:20
    },

    order_button_Container:{
        flex:2,
        justifyContent:'center',
        alignItems:'center'
    }
    
})