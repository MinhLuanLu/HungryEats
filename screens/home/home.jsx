import { StyleSheet, View, Text, ScrollView , TouchableOpacity, BackHandler} from "react-native";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import LottieView from "lottie-react-native";
import { UserContext } from "../../contextApi/user_context";
import { StoreContext } from "../../contextApi/store_context";
import Maps from "./map/maps";
import SideBar from "../sideBar/sideBar";
import Store_Detail from "../storeDetail/store_detail";
import {io} from 'socket.io-client'
import {SOCKET_SERVER} from '@env'
import Payment from "../payment/payment";
import { useFocusEffect } from "@react-navigation/native";
import PendingOrders from "./pendingOrders/pendingOrder";
import {SERVER_IP} from '@env';
import axios from "axios";


export default function Home(){

    const [time, setTime]                                               = useState(new Date());

    const [display_store_detail, setDisplay_store_detail]               = useState(false)
    const [display_Payment, setDisplay_Payment]                         = useState(false)
    const [display_sideBar, setDisplay_SideBar]                         = useState(false)

    const {public_PendingOrder, setPublic_PendingOrder}                 = useContext(UserContext)
    const [display_Pending_Order, setDisplay_Pending_Order]               = useState(false)

    const {public_Username, setPublic_Username}                         = useContext(UserContext)
    const {publicEmail, setPublicEmail}                                 = useContext(UserContext)
    const {public_StoreName, setPublic_Store_Name }                     = useContext(StoreContext);
    const [store_id, setStore_id] = useState()

    const [update_food_quantity, setUpdate_Food_Quantity]               = useState([])

    const socketIO                                                      = useRef(null)
    const [pendingOrderTab, setPendingOrderTab]                           = useState(false)

    // setDisplay_SideBar to false to be able to display side bar again after navigate back from orther screen.
    useFocusEffect(
        useCallback(() => {
          setDisplay_SideBar(false)
        }, []) 
    );

    useEffect(()=>{
        BackHandler.addEventListener('hardwareBackPress', () => {
            setDisplay_SideBar(false)
        })

        setTimeout(async () => {
            const pendingOrder = await axios.post(`${SERVER_IP}/pendingOrder/api`,{
                Email: publicEmail
            })
            if(pendingOrder?.data?.success){
                console.info(pendingOrder?.data?.message);
                setPublic_PendingOrder(data?.data)
            }
        }, 3000);
    },[])

    socketIO.current = io(`${SOCKET_SERVER}`)
    socketIO.current.on('connect', ()=>{
          console.log('Connect to SocketIO successfully..')
          console.log(socketIO.current.id)
          socketIO.current.emit('connection',{
              Socket_id: socketIO.current.id,
              Email: publicEmail,
              Username: public_Username
          });

          socketIO.current.on('pendingOrder',(order)=>{
              setPublic_PendingOrder((prevOrder) => [...prevOrder, order[0]])
              //console.log(order)
          })

          /// Get update order Status from on socketio [Accept or Waitting]
          socketIO.current.on('update_order', (order)=>{
              setPublic_PendingOrder(order)
          })

          /// Get Update food qauntity on socketio
          socketIO.current.on('update_food_quantity',(food_list)=>{
              console.log('update food quantity successfully..')
              setUpdate_Food_Quantity(food_list)
          })

      });
      
    function HandleStore_id(store_id){
        setStore_id(store_id)
    }

    return(
        <>
            <View>
                <Maps 
                    socketIO={socketIO} 
                    display_store_detail={()=>{ setDisplay_store_detail(true)}} 
                    display_Payment={()=> setDisplay_Payment(true)} 
                    display_sideBar={()=> {setDisplay_SideBar(true)}} 
                    sendStore_id={HandleStore_id}
                />
                <Store_Detail 
                    display_store_detail={display_store_detail} 
                    onclose={()=>{setDisplay_store_detail(false)}} 
                    socketIO={socketIO} 
                    display_payment={()=> setDisplay_Payment(true)} 
                    update_food_quantity={update_food_quantity} 
                    store_id={store_id}
                />
            </View>
            
            <Payment 
                display_Payment={display_Payment} 
                onclose={()=> setDisplay_Payment(false)} 
                socketIO={socketIO}
                store_id={store_id}
            />
            
            {/*Handle display order status*/}
            <View style={{position:'absolute', top:100, right:15}}>
                { public_PendingOrder.length > 0 &&
                    <TouchableOpacity style={{  
                        width:50, 
                        height:50, 
                        borderRadius:50, 
                        backgroundColor:'#F8F8F8', 
                        justifyContent:'flex-start', 
                        borderWidth:1, 
                        borderColor:'#333333',
                        shadowColor: '#FF9F0D', 
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.5, 
                        shadowRadius: 10, 
                        elevation: 10
                    }} onPress={()=> setDisplay_Pending_Order(true)}>
                        <LottieView
                            autoPlay
                            source={require('../../assets/lottie/food.json')}
                            style={{width:'100%', height:'100%', alignSelf:'center', marginTop:-5}}
                        />
                       
                        <View style={{backgroundColor:'#008080', width:20, borderRadius:10, position:'absolute', right:-5, top:-3}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{public_PendingOrder.length}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            
            {/*Handle display order status*/}
            <PendingOrders 
                display_Pending_Order={display_Pending_Order} 
                order_status_list={public_PendingOrder} 
                socketIO={socketIO} 
                onclose={()=> setDisplay_Pending_Order(false)} 
                email={publicEmail} 
                defineTab={pendingOrderTab}
            />
            
            <SideBar 
                display_sideBar={display_sideBar} 
                onclose={()=> setDisplay_SideBar(false)} 
                display_Pending_Order={()=> {setDisplay_Pending_Order(true), setPendingOrderTab(false)}} 
                displayOrderHistory={()=> {setDisplay_Pending_Order(true), setPendingOrderTab(true)}}
            />
            
        </>
    );
}

