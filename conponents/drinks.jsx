import { StyleSheet, View, TouchableOpacity, Text , Image, FlatList} from "react-native";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../contextApi/store_context";
import log from 'minhluanlu-color-log'
import {SERVER_IP} from '@env'


export default function Drink({list, food, store}){

    const [drink_list, setDrink_list]                           = useState([])

    function Handle_Add_Drink(drink) {
        list(drink)
    }

    
    const renderItem = ({item}) => (
        <TouchableOpacity style={styles.Container}  onPress={()=> Handle_Add_Drink(item)}>
                <View style={styles.image_Container}>
                    <Image style={{width:'100%', height:'100%', borderRadius:9, borderBottomLeftRadius:15, borderBottomRightRadius:15}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Drink_image}` }}/>
                </View>

                <View style={styles.text_Container}>
                    <Text style={{fontSize:13, fontWeight:'medium', marginLeft:5, color:'#FFFFFF'}}>{item.Drink_name}</Text>
                    <TouchableOpacity style={{backgroundColor:'#FF9F0D', width:18, height:18, justifyContent:'center', borderRadius:18, marginRight:5}} onPress={()=> Handle_Add_Drink(item)}>
                        <Text style={{fontSize:14, textAlign:'center', fontWeight:'bold',color:'#FFFFFF'}}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize:12, fontWeight:'medium', marginLeft:5, color:'#FFFFFF', paddingBottom:10, flex:0.5}}>{item.Drink_price}Kr</Text>
        </TouchableOpacity>
    )

    useEffect(()=>{
        async function Handle_Get_Dink() {
            await fetch(`${SERVER_IP}/drink/api`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"Store_name": store.Store_name})
            })
            .then(res =>{
                if(res.ok){
                    return res.json().then(data =>{
                        if(data.success){
                            setDrink_list(data?.data)
                            log.info(data?.message)
                        }
                    })
                }
                if(res === 400){
                    return res.json()
                }
            })
            .catch(error =>{
                console.error(error)
            })
        }   

        Handle_Get_Dink()
        setDrink_list([])

    },[food, store])

    return(
        <>
           <FlatList
                data={drink_list}
                renderItem={renderItem}
                horizontal={true}
                contentContainerStyle={styles.drink_list_Container}
           />
        </>
    )
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:'#333333',
        width:100, 
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        borderRadius:10,
        marginLeft:15,
        shadowColor: '#000000', 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 10, 
        elevation: 10
    },

    image_Container:{
        flex:2,
        borderRadius:10,
    },

    text_Container:{
        flex:0.5,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#333333',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    },

    drink_list_Container:{
        flexDirection:'row'
    }
})