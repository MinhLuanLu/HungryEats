import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, Dimensions, Text, Image , TouchableOpacity} from 'react-native';
import { useEffect, useState, useRef, useContext } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, useDerivedValue , useAnimatedStyle} from 'react-native-reanimated';
import { SocketioContext } from '../contextApi/socketio_context';
import LottieView from 'lottie-react-native';  // Assuming you're using this package
import Map_Style_Light from '../mapStyle';
import { FONT } from '../fontConfig';
import { responsiveSize } from '../utils/responsive';
import { Flow } from 'react-native-animated-spinkit';
import {SERVER_IP} from '@env';
import { UserContext } from '../contextApi/user_context';
import { config } from '../config';

const callIcon = require('../assets/icons/telephone_icon.png')

export default function OrderLoading({ store}) {
    const mapRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    
    const {publicSocketio, setPublicSocketio} = useContext(SocketioContext);
    const {publicPendingOrder, setPublicPendingOrder} = useContext(UserContext);
    

    const [latitude, setLatitude] = useState(store.Latitude);
    const [longitude, setLongitude] = useState( store.Longitude);

    const [orderConfirm, setOrderConfirm] = useState(false);
    const [orderFailed, setOrderFailed] = useState(false)

    const width = useSharedValue(-15)
  
    const region = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    useEffect(()=>{
        // listen to unprocesing order feedback //
      
        publicSocketio.current.on(config.orderPending , (order) => {
            log.debug('recived order pending status from socketIO')
            setPublicPendingOrder((prevOrder) => [...prevOrder, order[0]]);
        });

        publicSocketio.current.on(config.confirmRecivedOrder, (order) => {
            setOrderConfirm(true);
            log.debug('Order confirmed');
        
        });

        publicSocketio.current.on(config.failedRecivedOrder, (order) => {
            log.debug('Failed to seding Order');
            setOrderFailed(true);
        });
            
        
    },[])

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
                            <Text style={{fontFamily:FONT.SoraMedium, fontSize:15}}>Order Status: <Text style={{fontFamily:FONT.SoraRegular, fontSize:14, color:'grey'}}>Unproceess</Text></Text>
                        </View>
                        <View>
                            <LottieView
                                autoPlay
                                source={require('../assets/lottie/store.json')}
                                style={{ width: responsiveSize(110), height: responsiveSize(110) }}
                            />
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

                        <TouchableOpacity style={{backgroundColor:'#e0e0e0', width:35, height:35, justifyContent:'center', alignItems:'center', borderRadius:35}}>
                            <Text style={{fontFamily:FONT.SoraExtraBold}}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{padding: responsiveSize(15)}}>
                    <Flow color='grey' size={40}/>
                </View>
            </View>
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
