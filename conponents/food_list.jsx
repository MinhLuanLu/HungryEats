import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Image,  } from "react-native";
import LottieView from "lottie-react-native";
import { UserContext } from "../contextApi/user_context";
import { useContext } from "react";
import { useState, useEffect } from "react";
import {SERVER_IP} from '@env';
import Food from "./food";



export default function Food_List({display_food_list, menu_name, menu_description,menu_id, onclose, socketIO, display_payment}){

    const [food_list, setFood_List]                         = useState([])
    const [no_food_list, setno_food_list]                   = useState('')
    const {publicCart, setPublicCart}                       = useContext(UserContext)

    const renderItem =({item}) =>(
        <Food item={item} socketIO={socketIO}/>
    );

    useEffect(()=>{
        async function Handle_Get_Food_List(data) {
            await fetch(`${SERVER_IP}/foodList/api`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res=>{
                if(res.ok){
                    return res.json().then(data=>{
                        if(data.success){
                            console.info(data?.message);
                            setFood_List(data?.data)
                            if (data?.data.length === 0) {
                                setno_food_list("Menu has no Food yet");
                            }                            
                        }
                    })
                }
                if(res === 400){
                    return res.json()
                }
            })
            .catch(error=>{
                console.debug(error)
            })
        }

        let data = {
            "Menu_id": menu_id,
            "Menu_name": menu_name
        }
        if(menu_id && menu_name){
            Handle_Get_Food_List(data)
        }

    },[display_food_list])



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
                        <Text style={{fontSize:22, fontWeight:'500'}}>{menu_name}</Text>
                        <Text style={{fontSize:14}}>{menu_description}</Text>
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
            <View style={{position:'absolute', bottom:25, right:25}}>
                { Object.keys(publicCart).length > 0 &&
                    <TouchableOpacity style={styles.cart_Container} onPress={()=> display_payment()}>
                        <LottieView
                            autoPlay
                            source={require('../assets/lottie/cart.json')}
                            style={{width:'100%', height:'100%'}}
                        />
                        <View style={{backgroundColor:'#008080', width:22, borderRadius:10, position:'absolute', right:-8,top:0}}>
                            <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{Object.keys(publicCart).length}</Text>
                        </View>
                        <View style={{width:'100%', borderRadius:10, position:'absolute', bottom:7}}>
                            <Text style={{fontSize:13,color:'#008080', textAlign:'center', fontWeight:500}}>Cart</Text>
                        </View>
                    </TouchableOpacity>
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