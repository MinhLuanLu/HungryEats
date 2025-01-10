import { useEffect, useState, useContext } from "react";
import { StyleSheet,Text, View, Image, TouchableOpacity, TextInput, FlatList, ScrollView} from "react-native";
import { UserContext } from "../Context_API/user_context";

const marker_Icon = require('../assets/icons/location_open_icon.png')
const cart = require('../assets/icons/cart.png')
 
import {SERVER_IP} from '@env'

export default function Search({display_Payment}){
    
    const [search_value, setSearch_value] = useState('')
    const [search_Result, setSearch_Result] = useState([])

    const {public_Cart_list, setPublic_Cart_List} = useContext(UserContext)

    const renderItem  = ({item }) =>(
        <View style={styles.result_list_Container}>
            <Text style={{paddingLeft:5, fontSize:16, fontWeight:'500'}}>{item.Store_name}</Text>
            <Text style={{paddingLeft:5, fontSize:14, fontWeight:'200'}}>Adrress: {item.Address}</Text>
        </View>
    )

    useEffect(()=>{
        if (!isNaN(search_value) && search_value.trim() !== ''){
            //console.log('Serach Value is Number')
            if(search_value.length > 1){
                setTimeout(()=>{
                    HandleSearch({"PostCode": Number(search_value)})
                },200)
            }
     
        }else{
            //console.log('Serach Value is a string')
            setTimeout(()=>{
                HandleSearch({"SearchName": search_value})
            },200)
        }

    /// Clear the List when Input is Emty
      if(search_value == ''){
        console.log('clear search list')
        setSearch_Result([])
      }

        
    },[search_value])

    useEffect(()=>{
        if(search_value != '' && search_Result.length === 0){
            console.log('no result')
        }
    },[search_value, search_Result])


    async function HandleSearch(data){
        await fetch(`${SERVER_IP}/searching/api`,{
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
                        setSearch_Result(data.result)
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
        <View style={styles.Container}>
            <View style={styles.left_Section}>
                <Image style={styles.marker_Icon} source={marker_Icon}/>
                <TextInput style={styles.search_input} placeholder="Search, name, postcode" value={search_value} onChangeText={text => setSearch_value(text)}/>
                <View style={styles.search_container}>
                    {search_value != '' && search_Result.length === 0 && <Text style={{fontWeight:'500', paddingLeft:10}}>No result</Text>}
                    <View>
                        <FlatList
                            data={search_Result}
                            renderItem={renderItem}
                            keyExtractor={result => result.Store_id.toString()}
                            
                        />
                    </View>
                </View>

            </View>
            <View style={styles.right_Section}>
                <TouchableOpacity style={styles.icon_Container} onPress={()=> display_Payment()}>
                    <Image style={styles.cart_icon} source={cart}/>
                    { public_Cart_list.length != 0 &&
                    <View style={{backgroundColor:'#008080', width:18, height:18,borderRadius:10, position:'absolute', right:-8, top:-5}}>
                        <Text style={{fontSize:12,color:'#FFFFFF', textAlign:'center'}}>{public_Cart_list.length}</Text>
                    </View>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    Container:{
        backgroundColor:'#FFFFFF',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        height:45,
        width:'90%',
        alignSelf:'center',
        marginBottom:30,
        marginTop:10,
        borderRadius:50
    },

    left_Section:{
        flex:2,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },


    marker_Icon:{
        width:24,
        height:24,
        marginLeft:10
    },

    search_input:{
        height:'100%',
        width:'95%',
        borderRadius:24,
        paddingLeft:15
    },
    

    right_Section:{
        flex:0.5,
        justifyContent:'center',
        marginRight:10,
    },

    icon_Container:{
        backgroundColor:'#333333',
        borderWidth:0.2,
        width:35,
        height:35,
        alignSelf:'flex-end',
        justifyContent:'center',
        borderRadius:48,
    },

    cart_icon:{
        width:20,
        height:22,
        alignSelf:'center'
    },

    search_container:{
        position:'absolute',
        left:35,
        backgroundColor:'#F9F9F9',
        height:'auto',
        maxHeight:150,
        top:46,
        width:270,
        overflow:'hidden',
        borderRadius:3
    },

    result_list_Container:{
        backgroundColor:'#FFFFFF',
        marginBottom:3,
    }
})