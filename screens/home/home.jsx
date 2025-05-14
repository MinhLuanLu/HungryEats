import { StyleSheet, View, Text, ScrollView , TouchableOpacity, BackHandler} from "react-native";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import LottieView from "lottie-react-native";
import { UserContext } from "../../contextApi/user_context";
import { SocketioContext } from "../../contextApi/socketio_context";
import Maps from "./map/maps";
import SideBar from "../sideBar/sideBar";
import {io} from 'socket.io-client'
import {SOCKET_SERVER} from '@env'
import { useFocusEffect } from "@react-navigation/native";
import {SERVER_IP} from '@env';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import log from "minhluanlu-color-log";
import {config, orderStatusConfig } from "../../config";
import Animated,{withTiming, withSpring, useSharedValue, useAnimatedStyle, withSequence} from "react-native-reanimated";
import * as Notifications from 'expo-notifications';
import { CreateNotification } from "../../expo-Notification";



export default function Home(){
    const [display_sideBar, setDisplay_SideBar]                         = useState(false)
    const {publicPendingOrder, setPublicPendingOrder}                 = useContext(UserContext)
    const [display_Pending_Order, setDisplay_Pending_Order]               = useState(false)
    const {publicUser, setPublicUser}                                       = useContext(UserContext)
    const { publicSocketio, setPublicSocketio}                           = useContext(SocketioContext)
    const socketIO                                                      = useRef(null)
    const [pendingOrderTab, setPendingOrderTab]                           = useState(false)
    const navigate = useNavigation()
    const {expoPushToken, setExpoPushToken} = useContext(UserContext)
    const publicPendingOrderRef = useRef(publicPendingOrder);

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
                User: publicUser
            })
            if(pendingOrder?.data?.success){
                log.info(pendingOrder?.data?.message);
                log.info(pendingOrder?.data)
                setPublicPendingOrder(pendingOrder?.data?.data)
            }
        }, 3000);
        
    },[])

    useEffect(() => {
        // Prevent multiple connections by checking if socket already exists
        
        if (!socketIO.current) {
            socketIO.current = io(SOCKET_SERVER, {
                transports: ['websocket'], // Use WebSocket to avoid polling
                forceNew: true, // Ensures a new connection is created
            });
            setPublicSocketio(socketIO)
        
            socketIO.current.on('connect', () => {
                log.info('Connected to Socket.IO successfully.');
                log.info(`Socket ID: ${socketIO.current.id}`);

                // Emit connection event with user details
                socketIO.current.emit('connection', {
                    Socket_id: socketIO.current.id,
                    User: publicUser
                });
            
            });

            // Listen for order status updates
            socketIO.current.on(config.updateOrderStatus, (order) => {
                //alert(`get update order status event: ${order?.Order_status}`)
                setPublicPendingOrder(prevData => prevData.filter(item => item.Order_id !== order.Order_id));
                setPublicPendingOrder(preOrder => [order, ...preOrder] );

                // create notification //
                CreateNotification({
                    title: "Update order Status",
                    body: `You order is now ${order?.Order_status}`
                })
                return
            });


         
            

        }
    },[])


    useEffect(() => {
        publicPendingOrderRef.current = publicPendingOrder;
      }, [publicPendingOrder]);
      
    

    ////////////////////////////////////////////////
    // Animation ///
    const display = useSharedValue(0);
    const shake = useSharedValue(0);

    useEffect(() => {
        const interval = setInterval(() => {
            shake.value = withSequence(
                withTiming(-3, { duration: 50 }),
                withTiming(3, { duration: 50 }),
                withTiming(-3, { duration: 50 }),
                withTiming(3, { duration: 50 }),
                withTiming(0, { duration: 50 }),
            );
        }, 5000);
    
        return () => clearInterval(interval);
    }, []);


    useEffect(()=>{
        if( publicPendingOrder.length !== 0 ){
            display.value = withSpring(1)
        }
    },[publicPendingOrder])

    const pendingOrderAnimation = useAnimatedStyle(()=>{
        return{
            
            transform:[{scale: display.value},  { translateX: shake.value }, { translateY: shake.value }]
        }
    })



    return(
        <>
            <View>
                <Maps 
                    socketIO={socketIO}  
                    display_sideBar={()=> {setDisplay_SideBar(true)}} 
                />
            </View>
            
            {/*Handle display order status*/}
            <Animated.View style={[{position:'absolute', top:100, right:15}, pendingOrderAnimation]}>
                { publicPendingOrder.length > 0 &&
                    <TouchableOpacity  style={{  
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
                    }} onPress={()=> navigate.navigate('PendingOrders', {data: false})}>
                        <LottieView
                            autoPlay
                            source={require('../../assets/lottie/food.json')}
                            style={{width:'100%', height:'100%', alignSelf:'center', marginTop:-5}}
                        />
                       
                        <View style={{backgroundColor:'#008080', width:20, borderRadius:10, position:'absolute', right:-5, top:-3}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{publicPendingOrder.length}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </Animated.View>
            
            <SideBar 
                display_sideBar={display_sideBar} 
                onclose={()=> setDisplay_SideBar(false)} 
                display_Pending_Order={()=> {setDisplay_Pending_Order(true), setPendingOrderTab(false)}} 
                displayOrderHistory={()=> {setDisplay_Pending_Order(true), setPendingOrderTab(true)}}
            />
            
        </>
    );
}

