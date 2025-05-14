import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, Dimensions, Text, Image , TouchableOpacity} from 'react-native';
import { useEffect, useState, useRef, useContext } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, useDerivedValue , useAnimatedStyle, withSpring} from 'react-native-reanimated';
import { SocketioContext } from '../contextApi/socketio_context';
import LottieView from 'lottie-react-native';  // Assuming you're using this package
import Map_Style_Light from '../mapStyle';
import { FONT } from '../fontConfig';
import { responsiveSize } from '../utils/responsive';
import { Flow } from 'react-native-animated-spinkit';
import {SERVER_IP} from '@env';
import { UserContext } from '../contextApi/user_context';
import { orderStatusConfig } from '../config';
import { useNavigation } from '@react-navigation/native';
import log from 'minhluanlu-color-log';
import NotificatonAlert from './notificationAlert';



const callIcon = require('../assets/icons/telephone_icon.png');


export default function OrderLoading({store, order,  failedClose, confirmClose, paymentIntentId}) {
    const mapRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    const navigate = useNavigation();

    
    const {publicSocketio, setPublicSocketio} = useContext(SocketioContext);
    const {publicPendingOrder, setPublicPendingOrder} = useContext(UserContext);
    

    const [latitude, setLatitude] = useState(store.Latitude);
    const [longitude, setLongitude] = useState( store.Longitude);

    const [orderConfirm, setOrderConfirm] = useState(false); // status as pending
    const [orderFailed, setOrderFailed] = useState(false)
    const [orderUnprocessing, setOrderUnprocessing] = useState(false)

    const [undefined, setUndefined] = useState(false)



    const confirmAnimationOpacity = useSharedValue(0);
    const confirmAnimationScale = useSharedValue(0)
    const pendingAnimationOpacity = useSharedValue(1)
    const pendingAnimationScale = useSharedValue(1)
  
    const region = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    useEffect(()=>{
        setUndefined(true)
        setOrderConfirm(false);
        setOrderFailed(false);
        setOrderUnprocessing(false);
    },[])

    
    //////////////////////////////////////////////////////////

    useEffect(()=>{

        if(order.Order_status == orderStatusConfig.failed){
            log.err('Order failed');
            setOrderUnprocessing(false)
            setUndefined(false)
            setOrderFailed(true)
            setTimeout(() => {
                failedClose()
                setOrderFailed(false);
            }, 4000);
        }

        if(order.Order_status == orderStatusConfig.pending){
            console.log('Order recived confirm');
            setOrderUnprocessing(false)
            setUndefined(false)
            setOrderConfirm(true)

            // display confirm animation //
            confirmAnimationOpacity.value = withTiming(1, {duration:1000});
            confirmAnimationScale.value = withSpring(1)

            // remove pending animation //
            pendingAnimationOpacity.value = withTiming(0, {duration:1000});
            pendingAnimationScale.value = withSpring(0)
            
            setTimeout(() => {
                confirmClose();
                setOrderConfirm(false)
            }, 4000);
            
        }
    },[order])

    ///////////////////////////////////////
    
    const confirmAnimation = useAnimatedStyle(()=>{
        return{
            opacity: confirmAnimationOpacity.value,
            transform: [{scale: confirmAnimationScale.value}]
        }
    })

    const pendingAnimation = useAnimatedStyle(()=>{
        return{
            opacity: pendingAnimationOpacity.value,
            transform: [{scale: pendingAnimationScale.value}]
        }
    })
    ///////////////////////////////////////////////////////

    return (
        <Modal animationType="fade" visible={true}>
            <View style={styles.container}>
                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        //showsUserLocation={true}
                        //provider={PROVIDER_GOOGLE}
                        customMapStyle={Map_Style_Light}
                        showsCompass={false}
                        toolbarEnabled={false}
                        showsMyLocationButton={false}
                        paddingAdjustmentBehavior="always"
                        region={region}
                    >
                        <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude,
                            }}
                            title="Your Marker"
                            description="This is the marker location."
                        />
                    </MapView>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'90%', alignSelf:'center'}}>
                        <View>
                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:16}}>Estimated Sending order</Text>
                            <Text style={{fontFamily:FONT.SoraExtraBold, fontSize:25}}>3 - 5 Minutes</Text>
                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:15}}>Order Status: <Text style={{fontFamily:FONT.SoraRegular, fontSize:14, color:'grey'}}>{Object.keys(order).length !== 0 ? order.Order_status : 'undefined'}</Text></Text>
                        </View>
                        <View>

                            {undefined &&
                                <Animated.View>
                                    <LottieView
                                        autoPlay
                                        source={require('../assets/lottie/store.json')}
                                        style={{ width: responsiveSize(110), height: responsiveSize(110) }}
                                    />
                                </Animated.View>
                            }

                            { orderUnprocessing &&
                                <Animated.View style={[pendingAnimation]}>
                                    <LottieView
                                        autoPlay
                                        source={require('../assets/lottie/store.json')}
                                        style={{ width: responsiveSize(110), height: responsiveSize(110) }}
                                    />
                                </Animated.View>
                            }
    
                            {orderFailed &&
                                <LottieView
                                    autoPlay
                                    source={require('../assets/lottie/failed.json')}
                                    style={{ width: responsiveSize(110), height: responsiveSize(110) }}
                                />
                            }

                            {orderConfirm &&
                                <Animated.View style={[confirmAnimation]}>
                                    <LottieView
                                        autoPlay
                                        source={require('../assets/lottie/orderConfirm.json')}
                                        style={{ width: responsiveSize(110), height: responsiveSize(110) }}
                                    />
                                </Animated.View>
                            }
                        </View>
                    </View>
                </View>

                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:responsiveSize(65), width:'90%', alignSelf:'center', backgroundColor:'#c0c0c0', borderRadius:50,shadowColor: '#000000', 
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.3, 
                        shadowRadius: 10, 
                        elevation: 10,}}>
                
                    <Image resizeMode='cover' source={{uri: `${SERVER_IP}/${store.Store_image}`}} style={{width:responsiveSize(50), height: responsiveSize(50), marginRight: responsiveSize(10), marginLeft:responsiveSize(5), borderRadius:50}}/>
                    
                    <View style={{flex:2}} >
                        <Text style={{color:'#000000', fontFamily:FONT.SoraMedium, fontSize:17}}>{store.Store_name}</Text>
                        <Text style={{color:'#000000', fontFamily:FONT.SoraRegular, fontSize:14}}>+45 {store.Phone_number}</Text>
                    </View>

                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'space-between', marginRight:10}}>
                        <TouchableOpacity style={{backgroundColor:'#e0e0e0', width:35, height:35, justifyContent:'center', alignItems:'center', borderRadius:35}}>
                            <Image resizeMode='cover' source={callIcon} style={{width:'60%', height:'60%'}}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{backgroundColor:'#e0e0e0', width:35, height:35, justifyContent:'center', alignItems:'center', borderRadius:35}}>
                            <Text style={{fontFamily:FONT.SoraExtraBold}}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{padding: responsiveSize(15)}}>
                    {order.Order_status == orderStatusConfig.unprocessing && 
                        <Flow color='grey' size={43} />
                    }
                </View>
            </View>
            
            {order.Order_status == orderStatusConfig.failed ?
                <NotificatonAlert failed={true} title="Order failed" message="Failed to send order"/>
                :
                null
            }

            {order.Order_status == orderStatusConfig.pending ?
                <NotificatonAlert success={true} title="Order success" message="Send order successfully."/>
                :
                null
            }
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor:'#ffffff'
    },

    mapContainer: {
        width: '100%',
        height: '80%',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    bottomContainer:{
        backgroundColor:'#f8f8f8',
        width:'100%',
        height: responsiveSize(245),
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        position:'absolute',
        bottom:0,
    }
});
