import { StyleSheet,View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { useState, useEffect, useContext } from "react";
import AddToCart from "../screens/home/addToCart/addToCart";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contextApi/user_context";
import { StoreContext } from "../contextApi/store_context";
import {SERVER_IP} from '@env';
import log  from "minhluanlu-color-log";
import {FONT} from '../fontConfig';
import { responsiveSize } from "../utils/responsive";

const { width, height } = Dimensions.get('window');

export default function Food({item, store}){
    const navigate = useNavigation();
    const {publicCart, setPublicCart} = useContext(UserContext);
    const {publicStore, setPublicStore} = useContext(StoreContext)
    const [display_addToCart, setDisplay_AddToCart] = useState(false);

    function selectFoodHandler(){
       
        if(Object.keys(publicCart).length > 0){
            if(publicCart.Store.Store_id !== publicStore.Store_id){
                alert('Please finish your order at this store before ordering from another one.');
                log.warn('Please finish your order at this store before ordering from another one.')
                return
            }
        }
        setDisplay_AddToCart(true);
        
    }
   
    return(
        <>  
            {item.Quantity != 0 ?
                <View style={styles.Container}>
                    <TouchableOpacity style={styles.food_box} onPress={()=> selectFoodHandler()}>
                        <View style={{flex:1, backgroundColor:'#E0E0E0', borderTopRightRadius:10, borderTopLeftRadius:10}}>
                            <Image style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderTopRightRadius:10}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                        </View>
                        
                        <View style={{flex:1.3, paddingLeft:5}}>
                            <Text style={{fontSize:17, fontFamily:FONT.SoraMedium}}>{item.Food_name}</Text>
                            <View style={{height:20, overflow:'hidden'}}>
                                <Text style={{fontSize:13, fontFamily:FONT.SoraRegular}}>{item.Food_description}</Text>
                            </View>
                            <Text style={{fontSize:12, fontFamily: FONT.SoraSemiBold, textDecorationLine:'underline'}}>See more</Text>
                            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                                <View style={{flex:1, marginLeft:5}}>
                                    <Text style={{fontSize:17, fontFamily:FONT.SoraSemiBold}}>{item.Price}Kr</Text>
                                </View>
                                <Text style={{paddingRight:10, fontSize:14, fontFamily:FONT.SoraSemiBold}}>({item.Quantity}x)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <AddToCart displayAddToCart={display_addToCart} item={item} onclose={()=> setDisplay_AddToCart(false)} store={store}/>
                </View>
                :
                <View>
                    <TouchableOpacity style={[styles.food_box_2]}>
                        <View style={{flex:1, backgroundColor:'#E0E0E0', borderTopRightRadius:10, borderTopLeftRadius:10}}>
                            <Image style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderTopRightRadius:10}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                        </View>
                        <View style={{flex:1.3, paddingLeft:5}}>
                            <Text style={{fontSize:17, fontFamily:FONT.SoraMedium}}>{item.Food_name}</Text>
                            <View style={{height:20, overflow:'hidden'}}>
                                <Text style={{fontSize:14, fontFamily:FONT.SoraRegular}}>{item.Food_description}</Text>
                            </View>
                            <Text style={{fontSize:12, fontFamily: FONT.SoraSemiBold, textDecorationLine:'underline'}}>See more</Text>
                            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                                <View style={{flex:1, marginLeft:5}}>
                                    <Text style={{fontSize:17, fontFamily:FONT.SoraSemiBold}}>{item.Price}Kr</Text>
                                </View>
                                <Text style={{paddingRight:10, fontSize:14, fontFamily:FONT.SoraSemiBold}}>({item.Quantity}x)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({

    Container:{
        marginTop:10
    },

    food_box:{
        backgroundColor:'#D7D7D7',
        height:responsiveSize(210),
        minWidth: width / 2.3,
        maxWidth: width / 2.2,
        marginBottom:30,
        borderRadius:10,
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10,
        

    },

    food_box_2:{
        backgroundColor:'#D7D7D7',
        opacity:0.5,
        height: responsiveSize(210),
        minWidth: width / 2.3,
        maxWidth: width / 2.2,
        marginBottom:30,
        borderRadius:10,
        shadowColor: '#000000', // Color of the shadow
        shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
        shadowOpacity: 0.3, // Opacity of the shadow
        shadowRadius: 10, // Blur radius of the shadow
        elevation: 10

    }
})