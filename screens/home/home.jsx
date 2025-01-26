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
import Order_Status from "./orderStatus/order_status";
import {SERVER_IP} from '@env';


export default function Home(){

    const [time, setTime]                                               = useState(new Date());

    const [display_store_detail, setDisplay_store_detail]               = useState(false)
    const [display_Payment, setDisplay_Payment]                         = useState(false)
    const [display_sideBar, setDisplay_SideBar]                         = useState(false)

    const {public_Order_Status, setPublic_Order_Status}                 = useContext(UserContext)
    const [display_Order_Status, setDisplay_order_status]               = useState(false)

    const {public_Username, setPublic_Username}                         = useContext(UserContext)
    const {publicEmail, setPuclicEmail}                                 = useContext(UserContext)
    const {public_StoreName, setPublic_Store_Name }                     = useContext(StoreContext);

    const [order_confirm, setOrder_Comfirm]                             = useState(null)
    const [update_food_quantity, setUpdate_Food_Quantity]               = useState([])

    const socketIO                                                      = useRef(null)
    const [orderStatusTab, setOrderStatusTab]                           = useState(false)

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

        if(order_confirm){
            setOrder_Comfirm(null)
        }

        socketIO.current = io(`${SOCKET_SERVER}`)
        socketIO.current.on('connect', ()=>{
            console.log('Connect to SocketIO successfully..')
            console.log(socketIO.current.id)
            socketIO.current.emit('connection',{
                Socket_id: socketIO.current.id,
                Email: publicEmail,
                Username: public_Username
            });

            socketIO.current.on('sending_order_status',(order)=>{
                setPublic_Order_Status((prevOrder) => [...prevOrder, order[0]])
                //console.log(order)
            })

            /// Get update order Status from on socketio [Accept or Waitting]
            socketIO.current.on('update_order', (order)=>{
                setPublic_Order_Status(order)
            })

            /// confirm the order has sent to the store on socketio
            socketIO.current.on('confirm_received_order', (data)=>{
                setTimeout(() => {
                    setOrder_Comfirm(true)
                }, 5000);
                
            })

            /// Get Update food qauntity on socketio
            socketIO.current.on('update_food_quantity',(food_list)=>{
                console.log('update food quantity successfully..')
                setUpdate_Food_Quantity(food_list)
            })

        });

    },[])

    let date = time.getFullYear() + '-' + 
      String(time.getMonth() + 1).padStart(2, '0') + '-' + 
      String(time.getDate()).padStart(2, '0'); // Format the date as YYYY-MM-DD

    useEffect(()=>{
            async function Handle_Get_Order_status(data) {
                await fetch(`${SERVER_IP}/order_status/api`,{
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(res=>{
                    if(res.ok){
                        return res.json().then(data=>{
                            if(data){
                                console.info(data.message)
                                setPublic_Order_Status(data.Order_status)
                            }
                        })
                    }
                    if(res === 400){
                        return res.json()
                    }
                })
                .catch(error=>{
                    console.debug(error)
                })
            }    
            let data = {
                "Email": publicEmail
            }
            setTimeout(()=>{
                Handle_Get_Order_status(data)
            },3000)
        },[])

    
    return(
        <>
            <View>
                <Maps socketIO={socketIO} display_store_detail={()=>{ setDisplay_store_detail(true)}} display_Payment={()=> setDisplay_Payment(true)} display_sideBar={()=> {setDisplay_SideBar(true)}}/>
                <Store_Detail display_store_detail={display_store_detail} onclose={()=>{setDisplay_store_detail(false)}} socketIO={socketIO} display_payment={()=> setDisplay_Payment(true)} update_food_quantity={update_food_quantity}/>
            </View>
            
            <Payment display_Payment={display_Payment} onclose={()=> setDisplay_Payment(false)} socketIO={socketIO} order_confirm={order_confirm} order_to_fasle={()=> setOrder_Comfirm(false)} setOrder_Comfirm_to_null={()=> setOrder_Comfirm(null)} setOrder_Confirm_to_failed={()=> setOrder_Comfirm("failed")}/>
            
            {/*Handle display order status*/}
            <View style={{position:'absolute', top:100, right:15}}>
                { public_Order_Status.length > 0 &&
                    <TouchableOpacity style={{  width:50, height:50, borderRadius:50, backgroundColor:'#F8F8F8', justifyContent:'flex-start', borderWidth:1, borderColor:'#333333',
                                                shadowColor: '#FF9F0D', 
                                                shadowOffset: { width: 0, height: 5 },
                                                shadowOpacity: 0.5, 
                                                shadowRadius: 10, 
                                                elevation: 10
                    }} onPress={()=> setDisplay_order_status(true)}>
                        <LottieView
                            autoPlay
                            source={require('../../assets/lottie/food.json')}
                            style={{width:'100%', height:'100%', alignSelf:'center', marginTop:-5}}
                        />
                       
                        <View style={{backgroundColor:'#008080', width:20, borderRadius:10, position:'absolute', right:-5, top:-3}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{public_Order_Status.length}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            
            {/*Handle display order status*/}
            <Order_Status display_Order_Status={display_Order_Status} order_status_list={public_Order_Status} socketIO={socketIO} onclose={()=> setDisplay_order_status(false)} email={publicEmail} defineTab={orderStatusTab}/>
            
            <SideBar display_sideBar={display_sideBar} onclose={()=> setDisplay_SideBar(false)} displayOrderStatus={()=> {setDisplay_order_status(true), setOrderStatusTab(false)}} displayOrderStatusHistory={()=> {setDisplay_order_status(true), setOrderStatusTab(true)}}/>
            
        </>
    );
}

