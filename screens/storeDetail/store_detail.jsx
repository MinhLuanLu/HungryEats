import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Modal, FlatList} from "react-native";
import { useContext, useEffect, useState, useRef } from "react";
import { StoreContext } from "../../contextApi/store_context";
import { UserContext } from "../../contextApi/user_context";
import { SocketioContext } from "../../contextApi/socketio_context";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import Menu from "../../conponents/menu";
import Food from "../../conponents/food";
import axios from "axios";
import log from 'minhluanlu-color-log'
import {SERVER_IP} from '@env';
import Animated,{
    useAnimatedRef,
    withTiming,
    useSharedValue,
    useScrollViewOffset,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate
} from "react-native-reanimated";


const left_arrow = require('../../assets/icons/left_arrow.png')
const favorite = require('../../assets/icons/favorite.png')
const favorite_active = require('../../assets/icons/favorite_active.png')
const addressIcon = require('../../assets/icons/location_open_icon.png')
const telefon_number = require('../../assets/icons/telephone_icon.png')


export default function Store_Detail({route}){
    const navigate = useNavigation();
    const {store} = route.params;
    
    const { publicSocketio, setPublicSocketio}   = useContext(SocketioContext)
    const {publicCart, setPublicCart} = useContext(UserContext)
    const {publicUser, setPublicUser} = useContext(UserContext)

    const [menu, setMenu] = useState([])
    const [food_list, setFood_list]= useState([])
    const [store_favorite, setStore_Favorite] = useState(false)
    const [emty_menu, setEmty_menu] = useState('')
    
    
    const renderItem = ({item}) => (
        <Menu item={item} store={store} display_payment={()=> display_payment()}/>
    );

    const renderFood = ({item}) =>(
        <Food item={item} store={store}/>
    );
    
    useEffect(()=>{
        async function getMenu(){
            try{
                const menuResponse = await axios.post(`${SERVER_IP}/menu/api`,{
                    "Store_name": store.Store_name, 
                    "Store_id": store.Store_id
                })
                log.info(menuResponse)
                if(menuResponse.data.success){
                    log.info(menuResponse?.data.message)
                    setMenu(menuResponse?.data?.data)
                }else{
                    setEmty_menu("Store has no menu.")
                }
            }catch(error){
                log.warn('store_Detaie: Failed to recived menu.')
            }
        }

        if(store){
            getMenu()
            storeFavoriteHandler()
        }else{
            alert('ERROR: failed to recived menu')
        }
    },[store])

    useEffect(()=>{
        async function getFoodListHandler() {
            try{
                const getFood = await axios.post(`${SERVER_IP}/foodList/api`,{
                    "Request": true,
                    "Store_name": store.Store_name
                })
                if(getFood.data.success){
                    log.info(getFood.data.message);
                    setFood_list(getFood.data.data)
                }
            }catch(error){
                log.warn('store detail: ERROR failed to recived food list')
            }
        }
        if(store){
            getFoodListHandler()
        }else{
            alert('ERROR: failed to recived Food list.')
        }
    },[menu, store])

    
////// Handle Store Favorite //////////////////////// ***************************** need to check ***********************
    
    async function storeFavoriteHandler(){
        if(store_favorite){
            setStore_Favorite(false)
        }if(!store_favorite){
            setStore_Favorite(true)
        }
        try{
            const fetchStoreFavorite = await axios.post(`${SERVER_IP}/storeFavorite/api`,{
                Email: publicUser.Email,
                Store_name: store.Store_name,
                Request: store_favorite
            })
            if(fetchStoreFavorite.data.success){
                log.info(fetchStoreFavorite.data.message);
                setStore_Favorite(fetchStoreFavorite.data.data);
                log.debug(`get favorite store: ${store.Store_name} is ${fetchStoreFavorite.data.data} `)
            }
        }catch(error){
            log.warn('store_Detail: fialed to fetch store favorite.')
        }
        
      
    }

// Update food quantity ////
// Listen for food quantity updates
if(publicSocketio.current){
    publicSocketio.current.on('update_food_quantity', (food_list) => {
        console.log('Updated food quantity successfully.');
        setFood_list(food_list)
    });
}
    

/////// Animation ///
    const scrollRef = useAnimatedRef()
    const scrollY = useSharedValue(0);
    const height = useSharedValue(60)
    const opacity = useSharedValue(1)

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
        height.value = interpolate(
            scrollY.value, 
            [100, 500], // Input range (start growing at 100, reach max at 300)
            [60, 100],   // Output range (60% to 70%)
            "clamp"     // Prevent values outside range
        );
        opacity.value = interpolate(
            scrollY.value,
            [10, 400],
            [1, 0]
        )
        
	});

	const animationScroolStyle = useAnimatedStyle(() => {
    	return {
            height: `${height.value}%`
        }
	});

    const animationOpactity = useAnimatedStyle(()=>{
        return{
            opacity: opacity.value
        }
    })

    return(
        <View>
            <Modal
                visible={true}
                animationType="slide"
            >
                <View style={styles.Conatiner}>
                    <View style={styles.image_Container}>
                        <Image style={styles.cover_Image}  source={{uri: `${SERVER_IP}/${store.Store_image}`}} resizeMode="cover"/>
                    </View>

                    <TouchableOpacity onPress={()=> navigate.navigate('Home')} style={{backgroundColor:'#F9F9F9', width:40, height:40, alignItems:'center', justifyContent:'center', position:'absolute', top:30, left:20, borderWidth:0.2, borderRadius:35}}>
                        <Image style={styles.icon} source={left_arrow}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> storeFavoriteHandler()} style={{backgroundColor:'#F9F9F9', width:40, height:40, alignItems:'center', justifyContent:'center', position:'absolute', top:30, right:20, borderWidth:0.2, borderRadius:35}}>
                        { store_favorite == false
                            ? <Image style={styles.icon} source={favorite}/>
                            : <Image style={styles.icon} source={favorite_active}/>
                        }
                    </TouchableOpacity>

                    <View style={styles.info_Container}>
                        
                        <Animated.View style={[styles.Store_info_Container, animationOpactity]}>
                            <Text style={{fontSize:24, textDecorationLine:'underline'}}>{store.Store_name}</Text>

                            <View style={{display:'flex', flexDirection:'row', marginBottom:5}}>
                                <Image style={{width:16, height:16}} resizeMode="cover" source={telefon_number}/>
                                <Text style={{fontWeight:'medium'}}> {store.Phone_number}</Text>
                            </View>

                            <View style={{display:'flex', flexDirection:'row'}}>
                                <Image style={{width:20, height:20}} resizeMode="cover" source={addressIcon}/>
                                <Text style={{fontSize:15, fontWeight:'500'}}> {store.Address}</Text>
                            </View>

                            <View style={{marginTop:10, maxHeight:100, overflow:'hidden'}}>
                                <Text style={{fontSize:14}} >
                                    {store.Store_description}
                                </Text>
                            </View>

                        </Animated.View>
                        {emty_menu &&
                            <Text>{emty_menu}</Text>
                        }
                        <Text style={{paddingBottom:5, marginLeft:5, fontSize:22, fontWeight:'500', textDecorationLine:'underline', backgroundColor:'#D7D7D7'}}>Menu</Text>
                        <Animated.View style={[{overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'space-between', backgroundColor:'#D7D7D7'}, animationScroolStyle]}>
                            <View style={styles.menu_Container}>
                                <FlatList
                                    data={menu}
                                    renderItem={renderItem}
                                    horizontal={true}
                                    contentContainerStyle={styles.listContainer}
                                />         
                            </View>

                            <View style={styles.food_Container}>
                                <Animated.FlatList
                                    data={food_list}
                                    renderItem={renderFood}
                                    keyExtractor={item => item.Food_id.toString()}
                                    numColumns={2}
                                    columnWrapperStyle={{justifyContent:'space-between'}}
                                    contentContainerStyle={{paddingLeft:5}}
                                    ref={scrollRef}
                                    onScroll={scrollHandler}
                                    scrollEventThrottle={16}
                                />  
                            </View>
                            
                        </Animated.View>
                    </View>
                </View>

                <View style={{position:'absolute', bottom:25, right:25}}>
                    {Object.keys(publicCart).length > 0 &&
                        <TouchableOpacity style={styles.cart_Container} onPress={()=> navigate.navigate('Cart')}>
                            <LottieView
                                autoPlay
                                source={require('../../assets/lottie/cart.json')}
                                style={{width:'100%', height:'100%'}}
                            />
                            <View style={{backgroundColor:'#008080', width:22, borderRadius:10, position:'absolute', right:-8,top:0}}>
                                <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{Object.keys(publicCart.Food_item).length}</Text>
                            </View>
                            <View style={{width:'100%', borderRadius:10, position:'absolute', bottom:7}}>
                                <Text style={{fontSize:13,color:'#008080', textAlign:'center', fontWeight:500}}>Cart</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    Conatiner:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        backgroundColor:'transparent',
        flex:1,
        backgroundColor:'#D7D7D7'
    },

    image_Container:{
        backgroundColor:'#D7D7D7',
        flex:1,
        display:'flex',
        flexDirection:'column'
    },

    cover_Image:{
        width:'100%',
        height:'100%',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30
    },
    
    icon:{
        width:20,
        height:20
    },

    info_Container:{
        backgroundColor:'#D7D7D7',
        flex:1.3,
        width:'93%',
        alignSelf:'center'
    },

    Store_info_Container:{
        flex:1,
        alignSelf:'center'
    },

    menu_Container:{
        height:'auto',
        marginBottom:10,
        backgroundColor:'#D7D7D7'
    },

    food_Container:{
        flex:2,
        height:'auto',
        overflow:'hidden',
        width:'100%',
    },
    
    listContainer: {
        flexDirection:'row',
        alignSelf:'center',
      },

      cart_Container:{
        backgroundColor:'#FF9F0D',
        width:60,
        height:60,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:48,
        borderWidth:0.1,
        marginTop:-50,
        padding:10
    }
})




