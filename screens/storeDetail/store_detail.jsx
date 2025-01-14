import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Modal, FlatList} from "react-native";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contextApi/store_context";
import { UserContext } from "../../contextApi/user_context";
import LottieView from "lottie-react-native";
import Menu from "../../conponents/menu";
import Food from "../../conponents/food";
import {SERVER_IP} from '@env'

const left_arrow = require('../../assets/icons/left_arrow.png')
const favorite = require('../../assets/icons/favorite.png')
const favorite_active = require('../../assets/icons/favorite_active.png')
const addressIcon = require('../../assets/icons/location_open_icon.png')
const telefon_number = require('../../assets/icons/telephone_icon.png')


export default function Store_Detail({display_store_detail, onclose, socketIO, display_payment, update_food_quantity}){

    const { public_StoreName, setPublic_Store_Name } = useContext(StoreContext);
    const { public_Address, setPublic_Address } = useContext(StoreContext);
    const {  public_Phone_Number, setPublic_Phone_Number} = useContext(StoreContext);
    const {public_store_image, setPublic_store_image} = useContext(StoreContext)

    const {publicEmail, setPuclicEmail} = useContext(UserContext)

    const {public_Cart_list, setPublic_Cart_List} = useContext(UserContext)

    const [menu, setMenu] = useState([])
    const [food_list, setFood_list]= useState([])
    const [store_favorite, setStore_Favorite] = useState(false)

    const [emty_menu, setEmty_menu] = useState('')
    const renderItem = ({item}) => (
        <Menu item={item} socketIO={socketIO} display_payment={()=> display_payment()}/>
    )

    const renderFood = ({item}) =>(
        <Food item={item} socketIO={socketIO}/>
    )

    useEffect(()=>{
        setFood_list(update_food_quantity)
    },[update_food_quantity])

    useEffect(()=>{
        async function Handle_Get_Menu(send_data) {
            await fetch(`${SERVER_IP}/menu/api`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(send_data)
              })
            .then(res=>{
                if(res.ok){
                  return res.json().then(data=>{
                    if(data){
                      console.log(data.message)
                      setMenu(data.menu)
                      setEmty_menu('')

                      if(data.menu.length == 0){
                        setEmty_menu("Store has no menu.")
                      }

                    }
                  })
                }
                if(res === 400){
                  return res.json()
                }
              })
              .catch(error=>{
                console.log(error)
              })
        }    
    
        if(public_StoreName != ''){
            Handle_Get_Menu({"Store_Name": public_StoreName})
        }
        
    },[public_StoreName])


////// Handle Favorite ////////////////////////
    
    async function handle_Favorite(){
        if(store_favorite){
            setStore_Favorite(false)
        }if(!store_favorite){
            setStore_Favorite(true)
        }
        let data = {
            "Email": publicEmail,
            "Store_name": public_StoreName,
            "Request": false
        }
        Handle_Get_favorite(data)
      
    }
    
    async function Handle_Get_favorite(data){
    
        await fetch(`${SERVER_IP}/store_favorite/api`,{
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
                        setStore_Favorite(data.Result)
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

/////////////////////////////////////////////

    useEffect(()=>{
        async function Handle_Get_Food_List(data) {
            await fetch(`${SERVER_IP}/food_list/api`,{
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
                            console.log(data.message);
                            setFood_list(data.food_list)                           
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
        let data = {
            "Request": "Get_Food_List",
            "Store_Name": public_StoreName
        }

        Handle_Get_Food_List(data)
    },[menu])


    useEffect(()=>{
        let data = {
            "Email": publicEmail,
            "Store_name": public_StoreName,
            "Request": true
        }
        if(public_StoreName != ""){
            Handle_Get_favorite(data)
        }
    },[public_StoreName])



    return(
        <ScrollView>
            <Modal
                visible={display_store_detail}
                animationType="slide"
            >
                <View style={styles.Conatiner}>
                    <View style={styles.image_Container}>
                        <Image style={styles.cover_Image}  source={{uri: `${SERVER_IP}/${public_store_image}`}} resizeMode="cover"/>
                    </View>

                    <TouchableOpacity onPress={()=> onclose()} style={{backgroundColor:'#F9F9F9', width:40, height:40, alignItems:'center', justifyContent:'center', position:'absolute', top:30, left:20, borderWidth:0.2, borderRadius:35}}>
                        <Image style={styles.icon} source={left_arrow}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> handle_Favorite()} style={{backgroundColor:'#F9F9F9', width:40, height:40, alignItems:'center', justifyContent:'center', position:'absolute', top:30, right:20, borderWidth:0.2, borderRadius:35}}>
                        { store_favorite == false
                            ? <Image style={styles.icon} source={favorite}/>
                            : <Image style={styles.icon} source={favorite_active}/>
                        }
                    </TouchableOpacity>

                    <View style={styles.info_Container}>
                        
                        <View style={styles.Store_info_Container}>
                            <Text style={{fontSize:24, textDecorationLine:'underline'}}>{public_StoreName}</Text>

                            <View style={{display:'flex', flexDirection:'row', marginBottom:5}}>
                                <Image style={{width:16, height:16}} resizeMode="cover" source={telefon_number}/>
                                <Text style={{fontWeight:'medium'}}> {public_Phone_Number}</Text>
                            </View>

                            <View style={{display:'flex', flexDirection:'row'}}>
                                <Image style={{width:20, height:20}} resizeMode="cover" source={addressIcon}/>
                                <Text style={{fontSize:15, fontWeight:'500'}}> {public_Address}</Text>
                            </View>

                            <View style={{marginTop:10, maxHeight:100, overflow:'hidden'}}>
                                <Text style={{fontSize:14}} >Lorem ipsum dolor sit amet, consectetur adipisc
                                      ing elit. Quis scelerisque sit eu read more
                                </Text>
                            </View>

                        </View>
                        {emty_menu &&
                            <Text>{emty_menu}</Text>
                        }
                        <Text style={{marginBottom:5, marginLeft:5, fontSize:22, fontWeight:'500', textDecorationLine:'underline'}}>Menu</Text>
                        <View style={{flex:2, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <View style={styles.menu_Container}>
                                <FlatList
                                    data={menu}
                                    renderItem={renderItem}
                                    horizontal={true}
                                    contentContainerStyle={styles.listContainer}
                                />         
                            </View>

                            <View style={styles.food_Container}>
                                <FlatList
                                        data={food_list}
                                        renderItem={renderFood}
                                        keyExtractor={item => item.Food_id.toString()}
                                        numColumns={2}
                                        columnWrapperStyle={{justifyContent:'space-between'}}
                                        contentContainerStyle={{paddingLeft:5}}
                                />  
                            </View>
                            
                        </View>
                    </View>
                </View>

                <View style={{position:'absolute', bottom:25, right:25}}>
                    { public_Cart_list.length != 0 &&
                        <TouchableOpacity style={styles.cart_Container} onPress={()=> display_payment()}>
                            <LottieView
                                autoPlay
                                source={require('../../assets/lottie/cart.json')}
                                style={{width:'100%', height:'100%'}}
                            />
                            <View style={{backgroundColor:'#008080', width:22, borderRadius:10, position:'absolute', right:-8,top:0}}>
                                <Text style={{fontSize:15,color:'#FFFFFF', textAlign:'center'}}>{public_Cart_list.length}</Text>
                            </View>
                            <View style={{width:'100%', borderRadius:10, position:'absolute', bottom:7}}>
                                <Text style={{fontSize:13,color:'#008080', textAlign:'center', fontWeight:500}}>Cart</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>

            </Modal>
        </ScrollView>
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
    },

    food_Container:{
        flex:2,
        height:'auto',
        overflow:'hidden',
        width:'100%'
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