import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Image,  } from "react-native";
import LottieView from "lottie-react-native";
import { UserContext } from "../contextApi/user_context";
import { useContext } from "react";
import { useState, useEffect } from "react";
import {SERVER_IP} from '@env';
import Food from "./food";
import {FONT} from '../fontConfig';
import { useNavigation } from "@react-navigation/native";
import { responsiveSize } from "../utils/responsive";
import axios from "axios";

export default function Food_List({store, display_food_list, menu_name, menu_description,menu_id, onclose, socketIO}){

    const navigate = useNavigation()
    const [food_list, setFood_List]                         = useState([])
    const [no_food_list, setno_food_list]                   = useState('')
    const {publicCart, setPublicCart}                       = useContext(UserContext)

    const renderItem =({item}) =>(
        <Food item={item} socketIO={socketIO} store={store}/>
    );

    useEffect(()=>{
        async function Handle_Get_Food_List() {
            try{

                const getFoodByMenu = await axios.post(`${SERVER_IP}/foodList/api`,{
                    Menu_id: menu_id,
                    Menu_name: menu_name
                })
                if(getFoodByMenu.data.success){
                    console.log(getFoodByMenu.data.message);
                    setFood_List(getFoodByMenu.data.data);
                    return
                }
                setno_food_list("Menu has no Food yet");

            }catch(err){
                console.log(err)
            }
        }

        Handle_Get_Food_List()

    },[display_food_list]);



    return(
        <Modal
            animationType="slide"
            visible={display_food_list}
            statusBarTranslucent={true}
            transparent={true}
            hardwareAccelerated={true}
        >
            <View style={styles.Container}>
                <TouchableOpacity onPress={()=>{onclose()}} style={{flex:1}}></TouchableOpacity>
                <View style={styles.food_Container}>
                    <View style={styles.menu_info}>
                        <Text style={{fontSize:20, fontFamily: FONT.SoraSemiBold}}>{menu_name}</Text>
                        <Text style={{fontSize:13, fontFamily: FONT.SoraRegular}}>{menu_description}</Text>
                    </View>

                    <View style={styles.food_info_Container}>
                        <Text>{no_food_list}</Text>
                        <FlatList
                            data={food_list}
                            renderItem={renderItem}
                            keyExtractor={item => item.Food_id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{justifyContent:'space-between'}}
                            contentContainerStyle={{paddingHorizontal:15}}
                        />
                    </View>
                </View>
            </View>
            <View style={{position:'absolute', bottom:responsiveSize(25), right: responsiveSize(20)}}>
                {Object.keys(publicCart).length !== 0 ?
                    <TouchableOpacity style={styles.cart_Container} onPress={()=> {navigate.navigate('Cart')}}>
                        <LottieView
                            autoPlay
                            source={require('../assets/lottie/cart.json')}
                            style={{width:'100%', height:'100%'}}
                        />
                        <View style={{backgroundColor:'#008080', width:22, borderRadius:10, position:'absolute', right:-8,top:0}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{Object.keys(publicCart.Food_item).length}</Text>
                        </View>
                        <View style={{width:'100%', borderRadius:10, position:'absolute', bottom:7}}>
                            <Text style={{fontSize:13,color:'#008080', textAlign:'center', fontWeight:500}}>Cart</Text>
                        </View>
                    </TouchableOpacity>
                    : null
                }
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'flex-end'
    },
    food_Container:{
        backgroundColor:'#FFFFFF',
        flex:1.3,
        width:'100%',
        borderRadius:15
    },

    menu_info:{
        flex:0.5,
        width:'95%',
        alignSelf:'center',
        marginTop:10,
        marginBottom:10
    },

    food_info_Container:{
        flex:2,
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
    },

    cart_Button_Conatiner:{
        position:'absolute',
        right:20,
        backgroundColor:'#FF9F0D',
        width:65,
        height:65,
        bottom:20,
        borderRadius:65,
        justifyContent:'center',
        borderWidth:0.2
    }
})