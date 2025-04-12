import { StyleSheet, View, Text , TouchableOpacity} from "react-native";
import { ReText } from "react-native-redash";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming , withSpring, useAnimatedProps, useDerivedValue} from "react-native-reanimated";
import { useEffect, useState, useContext } from "react";
import {Svg, Circle} from "react-native-svg";
import { Flow } from "react-native-animated-spinkit";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { SocketioContext } from "../contextApi/socketio_context";
import { UserContext } from "../contextApi/user_context";
import { config } from "../config";
import log from "minhluanlu-color-log";
import { FONT } from "../fontConfig";
import NotificatonAlert from "./notificationAlert";

export default function SendOrderLoading({onclose, order, cancle}) {

    const navigate = useNavigation()
    const {publicSocketio, setPublicSocketio} = useContext(SocketioContext);
    const {publicPendingOrder, setPublicPendingOrder} = useContext(UserContext);
    
    const paymentProcess = 6.3
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0)
    const process = useSharedValue(paymentProcess);
    const moveIn = useSharedValue(0);
    const paymentAnimation = useSharedValue(1)
    const precent = useSharedValue(0)


    const [paymentConfirm, setPaymentConfirm] = useState(false);
    const [orderConfirm, setOrderConfirm] = useState(false);
    const [orderFailed, setOrderFailed] = useState(false)

    const CIRCLE_RADIUS = 40;
    const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;


    const CircelAnimated = Animated.createAnimatedComponent(Circle)
    const LottieViewAnimated = Animated.createAnimatedComponent(LottieView)

    ////////////////////////////////////
    // socket Handler
    useEffect(()=>{
        // listen to unprocesing order feedback //
      
        publicSocketio.current.on(config.orderPending , (order) => {
            log.debug('recived order pending status from socketIO')
            setPaymentConfirm(true)
            setPublicPendingOrder((prevOrder) => [...prevOrder, order[0]]);
        });

        publicSocketio.current.on(config.confirmRecivedOrder, (order) => {
            setOrderConfirm(true);
            log.debug('Order confirmed');
        
            setTimeout(() => {
                console.log('Closing the process...');
                log.debug('cart cleared.')
                onclose();
            }, 3500);
        });

        publicSocketio.current.on(config.failedRecivedOrder, (order) => {
            log.debug('Failed to seding Order');
            setOrderFailed(true);
            setTimeout(() => {
                console.log('Closing the process...');
                cancle();
            }, 3500);
        });
            
        
    },[])

    ////////////////////////////////////////////////////////


    // listen the paymen and order confirm ///
    useEffect(()=>{
       if(paymentConfirm){
            process.value = withTiming(paymentProcess / 2 ,{duration:3000});
            precent.value = withTiming(50, {duration:2000})
       }
       if(orderConfirm){
            process.value = withTiming(paymentProcess / 200 ,{duration:3000});
            precent.value = withTiming(100, {duration:2000})
       }
    },[paymentConfirm, orderConfirm]);


    // Animation //////////////////////////////////////////

    useEffect(() => {
        opacity.value = withSpring(1, {duration: 300})
        scale.value = withTiming(1, {duration:500})
        moveIn.value = withTiming(1, {duration: 1000})
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value}],
            opacity: opacity.value
        };
    });

    const moveInAnimated = useAnimatedStyle(() =>{
        console.log(precent.value)
        return{
            transform:[{translateX: moveIn.value}, {scale: paymentAnimation.value}]
        }
    })


    const animatedProps = useAnimatedProps(() => ({
        
        strokeDashoffset : CIRCLE_RADIUS * process.value
    }));
    ///////////////////////////////////////////////////////////////

    const processText =useDerivedValue(()=>{
        return `${Math.floor(precent.value)}%`
    })

    

    return (
        <Animated.View style={[styles.Container, animatedStyle]}>
            <View style={[styles.animateContainer]}>
                <View style={{width: '100%', height:'100%', position:'relative', justifyContent:'center', alignItems:'center'}}>
                    <Svg width={'100%'} height={'100%'} viewBox="0 0 150 150">
                        <Circle
                            cx="75"
                            cy="75"
                            r={CIRCLE_RADIUS}
                            stroke="rgba(184, 184, 184, 0.3)"
                            strokeWidth={5}
                            fill="none"
                        />
                        <CircelAnimated
                            cx="75"
                            cy="75"
                            r={CIRCLE_RADIUS}
                            stroke="#008080"
                            strokeWidth={3}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            animatedProps={animatedProps}
                            strokeLinecap="round"
                            rotation="-90" // start from top
                            origin="75, 75"
                        />
                    </Svg>
                    <ReText text={processText} style={{position:'absolute', fontSize:26, fontFamily:FONT.SoraMedium}}/>
                </View>
                <LottieViewAnimated
                        autoPlay
                        source={require('../assets/lottie/deliveryCar.json')}
                        style={[{width:'20%', height:'30%', position:'absolute', bottom:0}, moveInAnimated]}
                    />
                
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:16, fontFamily: FONT.SoraMedium, paddingBottom:10}}>{!orderConfirm ?  "Sending order" : "Order Confirmed" }</Text>
                    <Flow size={35} color="grey"/>
                </View>
            </View>

            <View style={{flex:1, width:'100%', justifyContent:'flex-end', alignItems:'center'}}>
                {paymentConfirm && orderConfirm ?
                    <TouchableOpacity style={{width:'90%', height:60, backgroundColor:'#008080', bottom:50, justifyContent:'center', alignItems:'center', borderRadius:70}} onPress={()=> navigate.navigate('Home')}>
                        <Text style={{fontSize:16, color:'#ffffff', fontFamily: FONT.SoraMedium}}>Done</Text>
                    </TouchableOpacity>  
                    :
                    <TouchableOpacity style={{width:'90%', height:60, backgroundColor:'#008080', bottom:50, justifyContent:'center', alignItems:'center', borderRadius:30}} onPress={()=> cancle()}>
                        <Text style={{fontSize:16, color:'#ffffff',fontFamily: FONT.SoraMedium}}>Cancle</Text>
                    </TouchableOpacity>  
                }
            </View>
            {orderConfirm ?
                <NotificatonAlert success={true}/>
                :
                null
            }

            {orderFailed ?
                <NotificatonAlert failed={true}/>
                :
                null
            }
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor:'#e0e0e0'
    },

    animateContainer: {
        width: '90%',
        flex:2,
        backgroundColor: "transparent",
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
});