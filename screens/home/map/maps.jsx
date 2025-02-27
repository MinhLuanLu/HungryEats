import { StyleSheet , View} from "react-native";
import { useEffect, useState } from "react";
import MapView, { Callout, Marker,  PROVIDER_GOOGLE } from 'react-native-maps';
import Map_Style_Light from "../../../mapStyle";

import * as Location from 'expo-location';
import { useRef } from "react";
import { useContext } from "react";
import { StoreContext } from "../../../contextApi/store_context";
import Search from "../../../conponents/search"
import Loading from "../../../conponents/loading";
import Store_Description from "../storeDescription/storeDescription";
import {SERVER_IP} from '@env';
import axios from "axios";


const marker_Icon_open = require('../../../assets/icons/location_open_icon.png')
const marker_Icon_close = require('../../../assets/icons/location_close.png')


export default function Maps({socketIO, display_store_detail, display_Payment, display_sideBar, sendStore_id}){

    const mapRef                                                  = useRef(null);
    const [location, setLocation]                                 = useState(null)
    const [latitude, setLatitude]                                 = useState(null);
    const [longitude, setLongitude]                               = useState(null)
    const [marker_list, setMarker_list]                           = useState([])

    const { public_StoreName, setPublic_Store_Name }              = useContext(StoreContext);
    const { public_Address, setPublic_Address }                   = useContext(StoreContext);
    const { public_Store_Status, setPublic_Store_Status}          = useContext(StoreContext);
    const { public_Phone_Number, setPublic_Phone_Number}         = useContext(StoreContext);
    const {public_store_image, setPublic_store_image}             = useContext(StoreContext)

    const [store_Description, setStore_Description]               = useState()
    const [display_tabBar, setDisplay_TabBar]                     = useState(false)
    const [store_id, setStore_id] = useState()

    // Handle fetching necessary data that is used in the map.
    useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let getlocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          
          if(getlocation){     
            setLocation(getlocation)
          }
        }

        async function StoreList() {
          const StoreList = await axios.get(`${SERVER_IP}/storeList/api`)
          .then(response => {
            console.log(response?.data?.message); 
            setMarker_list(response?.data?.data)
  
        })
        }
       
        getCurrentLocation();
        StoreList()
      }, []);

      
    // Handle listening to get the location.
    useEffect(()=>{
        if(location != null){
            console.log('get new location')
            setLatitude(location?.coords?.latitude)
            setLongitude(location?.coords?.longitude)     
        }

        if(location != null){
          setDisplay_TabBar(true)
        }else{
          setDisplay_TabBar(false)
        }      
    },[location])


    function handle_Marker_Select(store_id, Name, Address, Status, Phone, store_description, store_image) {
      setPublic_Store_Name(Name)
      setPublic_Address(Address)
      setPublic_Phone_Number(Phone)
      setStore_Description(store_description)
      setPublic_store_image(store_image)
      setStore_id(store_id)
      sendStore_id(store_id)
      
      // ================== Handle update store Status on socketio check if store is open/close so the store description will show up or not ========================= //
      socketIO.current.emit('Store_status', {Store_name: Name})
      socketIO.current.on('Store_status', (data)=>{
        setPublic_Store_Status(data?.Status)
        
      });
      // ==================================================================================== //
    }

    /// Handle update storeStatus [close or open]
    if(socketIO.current){
      socketIO.current.on('updateStoreStatus', (storeStatusList)=>{
        console.info('Update stores Status successfully..')
        setMarker_list(storeStatusList)
      })
    }
    

    if(location == null || marker_list.length === 0) return <Loading/>
    
 

    return(
        <View style={styles.Container}>

          <View style={styles.search_Container} >
            <Search display_Payment={display_Payment} display_sideBar={()=> display_sideBar()}/>
          </View>

          <MapView 
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            customMapStyle={Map_Style_Light}
            showsCompass={false}
            toolbarEnabled={false}
            showsMyLocationButton={false}
            paddingAdjustmentBehavior="always"
            mapPadding={{
            ////
            }}
            
            initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
          >

                {marker_list.map(marker_list =>(
                  <Marker
                    key={marker_list.Store_id}
                    coordinate={{
                      latitude: parseFloat(marker_list.Latitude),
                      longitude: parseFloat(marker_list.Longitude)
                    }}

                    title={`${marker_list.Store_name} (+45${marker_list.Phone_number})`}
                    description={`${marker_list.Address}`}
                    onPress={()=> handle_Marker_Select(marker_list.Store_id, marker_list.Store_name, marker_list.Address, marker_list.Status, marker_list.Phone_number, marker_list.Store_description, marker_list.Store_image) }
                    
                    // handle image marker close and open
                    
                    image={marker_list.Status === 1 ? marker_Icon_open : marker_Icon_close}
                  />           
                ))}

          </MapView>
                
            <View style={{position:'absolute', bottom:30, width:'100%'}}>
              <Store_Description 
                store_status={public_Store_Status} 
                display_store_detail={()=> display_store_detail()} 
                store_description={store_Description}
                store_id={store_id}
              />
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    Container:{
        height:'100%',
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'center',
        position:'relative'
        
    },

    map:{
        ...StyleSheet.absoluteFillObject
    },

    search_Container:{
      zIndex:999,
      marginTop:20
    }
})