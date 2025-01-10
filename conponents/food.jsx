import { StyleSheet,View, Text, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../Context_API/user_context";
import { StoreContext } from "../Context_API/store_context";
import Food_Order from '../conponents/modal/food_order';

const favorite = require('../assets/icons/favorite.png')
const favorite_active = require('../assets/icons/favorite_active.png')
const sushi = require('../assets/images/sushi.png')
import {SERVER_IP} from '@env'

export default function Food({item, socketIO}){

    const [facvorite_button, setFacvorite_button] = useState(false)
    const { public_StoreName, setPublic_Store_Name } = useContext(StoreContext);
    const {publicEmail, setPuclicEmail} = useContext(UserContext)

    const [display_order_food, setDisplay_Order_Food] = useState(false)


    function handle_Favorite(food_id){

        if(!facvorite_button){
            setFacvorite_button(true)
        }
        if(facvorite_button){ 
            setFacvorite_button(false)
        }

        let data = {
            "Email": publicEmail,
            "Food_id": food_id,
            "Request": false
        }
        Handle_Get_Food_favorite(data)
        
    }

    
    async function Handle_Get_Food_favorite(data){
        
            await fetch(`${SERVER_IP}/food_favorite/api`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res=>{
                if(res.ok){
                    return res.json().then(data=>{
                        if(data){
                            console.log(data.message)
                            setFacvorite_button(data.Result)
                        }
                    })
                }
                if(res === 400){
                    return res.json()
                }
            })
            .catch(error=>{
                console.error(error)
            })
        }
    

        
    return(
        <>  
            {item.Quantity != 0
            ?
            <View>
                <TouchableOpacity style={styles.food_box} onPress={()=> {setDisplay_Order_Food(true)}}>
                    <View style={{flex:1, backgroundColor:'#E0E0E0', borderTopRightRadius:10, borderTopLeftRadius:10}}>
                        <Image style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderTopRightRadius:10}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                    </View>
                    <View style={{flex:1.3, paddingLeft:5}}>
                        <Text style={{fontSize:18, fontWeight:'semibold'}}>{item.Food_name}</Text>
                        <View style={{height:20, overflow:'hidden'}}>
                            <Text style={{fontSize:14}}>{item.Food_description}</Text>
                        </View>
                        <Text style={{fontSize:13, fontWeight:500, textDecorationLine:'underline'}}>See more</Text>
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                            <View style={{flex:1, marginLeft:5}}>
                                <Text style={{fontSize:18, fontWeight:'500'}}>{item.Price}Kr</Text>
                            </View>
                            <Text style={{paddingRight:10, fontSize:16, fontWeight:500}}>({item.Quantity}x)</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Food_Order socketIO={socketIO} display_food_order={display_order_food} onclose={()=> setDisplay_Order_Food(false)} price={item.Price} food_name={item.Food_name} food_description={item.Food_description}/>
                </View>
            :
            <View>
                <TouchableOpacity style={[styles.food_box_2]}>
                    <View style={{flex:1, backgroundColor:'#E0E0E0', borderTopRightRadius:10, borderTopLeftRadius:10}}>
                        <Image style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderTopRightRadius:10}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                    </View>
                    <View style={{flex:1.3, paddingLeft:5}}>
                        <Text style={{fontSize:18, fontWeight:'semibold'}}>{item.Food_name}</Text>
                        <View style={{height:20, overflow:'hidden'}}>
                            <Text style={{fontSize:14}}>{item.Food_description}</Text>
                        </View>
                        <Text style={{fontSize:13, fontWeight:500, textDecorationLine:'underline'}}>See more</Text>
                        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                            <View style={{flex:1, marginLeft:5}}>
                                <Text style={{fontSize:18, fontWeight:'500'}}>{item.Price}Kr</Text>
                            </View>
                            <Text style={{paddingRight:10, fontSize:16, fontWeight:500}}>({item.Quantity}x)</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            

    

            }
        </>
    );
}

const styles = StyleSheet.create({
    food_box:{
        backgroundColor:'#D7D7D7',
        height:220,
        minWidth:150,
        maxWidth:170,
        width:130,
        marginBottom:30,
        borderRadius:10,
        shadowColor: '#000000', // Color of the shadow
        shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
        shadowOpacity: 0.3, // Opacity of the shadow
        shadowRadius: 10, // Blur radius of the shadow
        elevation: 10

    },

    food_box_2:{
        backgroundColor:'#D7D7D7',
        opacity:0.5,
        height:220,
        minWidth:150,
        maxWidth:170,
        width:130,
        marginBottom:30,
        borderRadius:10,
        shadowColor: '#000000', // Color of the shadow
        shadowOffset: { width: 0, height: 5 }, // Offset of the shadow
        shadowOpacity: 0.3, // Opacity of the shadow
        shadowRadius: 10, // Blur radius of the shadow
        elevation: 10

    }
})