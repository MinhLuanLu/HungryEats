import { StyleSheet , View} from "react-native";
import { useEffect, useState, useContext } from "react";
import MapView, { Callout, Marker,  PROVIDER_GOOGLE } from 'react-native-maps';
import Map_Style_Light from "../../../mapStyle";
import log  from "minhluanlu-color-log";
import * as Location from 'expo-location';
import { useRef } from "react";
import Search from "../../../conponents/search"
import LoadingMap from "../../../conponents/loadingMap";
import Store_Description from "../storeDescription/storeDescription";
import {SERVER_IP} from '@env';
import { StoreContext } from "../../../contextApi/store_context";
import axios from "axios";
import { config } from "../../../config";


const marker_Icon_open = require('../../../assets/icons/location_open_icon.png')
const marker_Icon_close = require('../../../assets/icons/location_close.png')


export default function Maps({socketIO, display_sideBar}){

    const mapRef                                                  = useRef(null);
    const [location, setLocation]                                 = useState(null)
    const [latitude, setLatitude]                                 = useState(null);
    const [longitude, setLongitude]                               = useState(null)
    const [marker_list, setMarker_list]                           = useState([])
    const [display_tabBar, setDisplay_TabBar]                     = useState(false)
    const [selectStore, setSelectStore]                           = useState();

    const {publicStore, setPublicStore} = useContext(StoreContext)

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
          await axios.get(`${SERVER_IP}/storeList/api`)
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
            log.info('get new location')
            setLatitude(location?.coords?.latitude)
            setLongitude(location?.coords?.longitude)     
        }

        if(location != null){
          setDisplay_TabBar(true)
        }else{
          setDisplay_TabBar(false)
        }      
    },[location])


    // hander select store inmap
    function handle_Marker_Select(store) {
      setSelectStore(store);
      setPublicStore(store);
      log.debug({message: 'User select store', store: store})
    }

    /// Handle update storeStatus [close or open] live //
    if(socketIO.current){
      socketIO.current.on(config.updateStoreState , (storeStatusList)=>{
        log.info('Update stores Status successfully..')
        setMarker_list(storeStatusList)
      })
    }
    

    if(location == null || marker_list.length === 0) return <LoadingMap/>
    
 

    return(
        <View style={styles.Container}>

          <View style={styles.search_Container} >
            <Search display_sideBar={()=> display_sideBar()}/>
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
                    onPress={()=> handle_Marker_Select(marker_list/*marker_list.Store_id, marker_list.Store_name, marker_list.Address, marker_list.Status, marker_list.Phone_number, marker_list.Store_description, marker_list.Store_image*/) }
                    
                    // handle image marker close and open
                    
                    image={marker_list.Status === 1 ? marker_Icon_open : marker_Icon_close}
                  />           
                ))}

          </MapView>
          {/* Only Display when Store is Open .*/}
          { selectStore && selectStore.Status == 1 && 
            <View style={{position:'absolute', bottom:30, width:'100%'}}>
              <Store_Description 
                store={selectStore}
              />
            </View>
          }
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