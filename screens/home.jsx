import { StyleSheet, View, Text, ScrollView , TouchableOpacity} from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import LottieView from "lottie-react-native";
import { UserContext } from "../Context_API/user_context";
import { StoreContext } from "../Context_API/store_context";
import Maps from "../conponents/maps";
import Store_Detail from "../conponents/modal/store_detail"
import {io} from 'socket.io-client'
import {SOCKET_SERVER} from '@env'
import Payment from "../conponents/modal/payment";
import Order_Status from "../conponents/order_status";
import {SERVER_IP} from '@env'

export default function Home(){

    const [time, setTime] = useState(new Date());

    const [display_store_detail, setDisplay_store_detail] = useState(false)
    const [display_Payment, setDisplay_Payment] = useState(false)

    const {public_Order_Status, setPublic_Order_Status} = useContext(UserContext)
    const [display_Order_Status, setDisplay_order_status]= useState(false)

    const {public_Username, setPublic_Username} = useContext(UserContext)
    const { publicEmail, setPuclicEmail} = useContext(UserContext)
    const { public_StoreName, setPublic_Store_Name } = useContext(StoreContext);

    const [display_tabBar, setDisplay_TabBar] = useState(false)

    const [order_confirm, setOrder_Comfirm] = useState(null)
    const [update_food_quantity, setUpdate_Food_Quantity] = useState([])

    const socketIO = useRef(null)


    useEffect(()=>{
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
                setPublic_Order_Status(order)
            })


            /// Get update order stauste from store Accept or Waitting
            socketIO.current.on('update_order', (order)=>{
                setPublic_Order_Status(order)
            })

            /// confirm the order has sent to the store
            socketIO.current.on('confirm_received_order', (data)=>{
                setTimeout(() => {
                    setOrder_Comfirm(true)
                }, 4000);
            })

            /// Get Update food  qauntity
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
                                console.log(data.message)
                                setPublic_Order_Status(data.Order_status)
                            }
                        })
                    }
                    if(res === 400){
                        return res.json()
                    }
                })
                .catch(error=>{
                    console.error(error)
                })
            }    
            let data = {
                "Email": publicEmail
            }
            setTimeout(()=>{
                Handle_Get_Order_status(data)
            },5000)
        },[])

    


    
    
    return(
        <>
            <View>
                <Maps socketIO={socketIO} display_store_detail={()=>{ setDisplay_store_detail(true)}} display_Payment={()=> setDisplay_Payment(true)}/>
                <Store_Detail display_store_detail={display_store_detail} onclose={()=>{setDisplay_store_detail(false)}} socketIO={socketIO} display_payment={()=> setDisplay_Payment(true)} update_food_quantity={update_food_quantity}/>
            </View>
            
            <Payment display_Payment={display_Payment} onclose={()=> setDisplay_Payment(false)} socketIO={socketIO} order_confirm={order_confirm} order_to_fasle={()=> setOrder_Comfirm(false)} setOrder_Comfirm_to_null={()=> setOrder_Comfirm(null)}/>
            
            {/*Handle display order status*/}
            <View style={{position:'absolute', top:100, right:15}}>
                { public_Order_Status.length > 0 &&
                    <TouchableOpacity style={{width:50, height:50, borderRadius:50, backgroundColor:'#F8F8F8'}} onPress={()=> setDisplay_order_status(true)}>
                        <LottieView
                            autoPlay
                            source={require('../assets/lottie/order_status.json')}
                            style={{width:'100%', height:'100%'}}
                        />
                        <View style={{position:'absolute',justifyContent:'center', width:'65%', height:'100%', alignSelf:'center'}}>
                            <Text style={{fontSize:8, fontWeight:500, color:'#FFFFFF',textAlign:'center', backgroundColor:'#008080', borderRadius:10, padding:2}}>Waiting</Text>
                        </View>

                        <View style={{backgroundColor:'#008080', width:20, borderRadius:10, position:'absolute', right:-5, top:-3}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{public_Order_Status.length}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            
            <Order_Status display_Order_Status={display_Order_Status} order_status_list={public_Order_Status} socketIO={socketIO} onclose={()=> setDisplay_order_status(false)} email={publicEmail}/>
            {/*Handle display order status*/}
            

        </>
    );
}

