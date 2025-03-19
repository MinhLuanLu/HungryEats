import { StyleSheet, View, Text, TouchableOpacity, Modal,Image } from "react-native";
import log from 'minhluanlu-color-log';
import {SERVER_IP} from '@env'
import { useEffect, useState, useContext } from "react";
import Drink from "../../../conponents/drinks";
import { UserContext } from "../../../contextApi/user_context";


const left_arrow = require('../../../assets/icons/left_arrow.png')

export default function AddToCart({displayAddToCart, onclose, item, store}){

    const [foodQuantity, setFood_Quantity] = useState(1);
    const [totalPrice, settotalPrice] = useState(item.Price);
    const [selectDrink, setSelectDrink] = useState([])
    const [foodPrice, setFoodPrice] = useState(item.Price);

    const {public_User_id, setPublic_Userid} = useContext(UserContext);
    const {publicCart, setPublicCart} = useContext(UserContext)

    useEffect(()=>{
        settotalPrice(foodPrice) // listen to foodPrice  and update to total proce
    },[foodPrice])

    
    function foodQuantityHandler (event){
        if(event){
            setFood_Quantity(foodQuantity + 1);
            setFoodPrice(totalPrice + item.Price)
            settotalPrice(foodPrice)
        }
        else{
            if(foodQuantity != 1){
                setFood_Quantity(foodQuantity - 1)
                setFoodPrice(totalPrice - item.Price)
                settotalPrice(foodPrice)
            }
        }
    }

    function addDrinkHandler(drink){
        if(selectDrink.length == 0){
            drink.Drink_quantity = 1 // add drink_quantity to 1
            selectDrink.push(drink)
            log.debug('add first drink to list.');
            calDrinkPrice(selectDrink)
            return
            
        }
        if(selectDrink.length > 0){
            // check if drink is in list //
            for(const item of selectDrink){
                if(item === drink){
                    log.debug('drink: drink exists, update drink quantity.')
                    item.Drink_quantity = item.Drink_quantity + 1 // update drink quantity 1 up
                    calDrinkPrice(selectDrink)
                    return
                }                
            }
            //if drink not exist in list add it to list
            drink.Drink_quantity = 1
            selectDrink.push(drink)
            log.debug('add drink to list');
            calDrinkPrice(selectDrink)
        }
    }

    function calDrinkPrice(list){
        let drinkPriceList = []
        if(list.length > 0){
            for (const item of list){
                const drinkPrice = item.Drink_price;
                const drinkQuantity = item.Drink_quantity;
                drinkPriceList.push(drinkPrice * drinkQuantity)
            }
        }
        const sumDrinkPrice = drinkPriceList.reduce((acc, num) => acc + num, 0)
        // add drink price to total price //// settotalPrice(totalPrice + sumDrinkPrice)
        settotalPrice(foodPrice + sumDrinkPrice)
    }

    function addToCartHandler(){
        let foodList = []
        let foodExist;
        const foodData = {Food_image: item.Food_image, Food_id: item.Food_id, Food_name: item.Food_name, Food_quantity: foodQuantity};

        foodList.push(foodData)
        const order = {
            Store_id: store.Store_id,
            User_id: public_User_id,
            Food_item: foodList,
            Drink_item: selectDrink,
        }

        // check if cart is emty or not
        if(Object.keys(publicCart).length > 0){
            const Food_item = publicCart.Food_item;

            for(const food of Food_item){
                const Food_id = food.Food_id;
                
                if(Food_id == item.Food_id){
                    food.Food_quantity = food.Food_quantity + foodQuantity // update the food quantity
                    log.debug('Update the food quantity.');
                    //console.log(Food_item)
                    foodExist = true
                    break
                }
                
                foodExist = false 
                
            }
            // if no food in the cart set food to the Food_item
            if(!foodExist){
                log.debug('no match food was found.')
                Food_item.push(foodData)
                //console.log(Food_item)
            }
        }
        else if(Object.keys(publicCart).length == 0){
            setPublicCart(order)
            log.debug('Add food to cart')
        }
        onclose()
    }
   
    return(
        <Modal
            visible={displayAddToCart}
            animationType="slide"
        >
           
            <View style={styles.Container}>
                <TouchableOpacity onPress={()=> {onclose();}} style={{backgroundColor:'#F8F8F8', width:40, height:40, borderRadius:40, justifyContent:'center', position:'absolute', zIndex:1111, left:10, top:10}}>
                    <Image style={{width:18, height:18, alignSelf:'center'}} resizeMode="cover" source={left_arrow}/>
                </TouchableOpacity>
                <Image resizeMode="cover" style={styles.storeImage} source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>

                <View style={styles.middleContainer}>
                    <View style={{flex:1, display:'flex', flexDirection:'row'}}>
                        <View style={{flex:1.5}}>
                            <Text style={{padding:10, fontSize:18, fontWeight:500}}>{item.Food_name}</Text>
                        </View>

                        <View style={{flex:1, justifyContent:'center'}}>
                            <View style={{width:'80%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', alignSelf:'center'}}>
                                <TouchableOpacity onPress={()=> foodQuantityHandler(false)} style={[styles.addQuantityButton, {backgroundColor:'#ffffff'}]}>
                                    <Text style={{fontSize:30, fontWeight:'thin'}}>-</Text>
                                </TouchableOpacity>

                                <Text style={{fontSize:15,fontWeight:500}}>{foodQuantity}</Text>

                                <TouchableOpacity onPress={()=> foodQuantityHandler(true)} style={[styles.addQuantityButton, {backgroundColor:'#008080'}]}>
                                    <Text style={{fontSize:20, fontWeight:'thin', color:'#ffffff'}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{padding:10, color:'grey'}}>{item.Food_description}</Text>
                    </View>
                    
                </View>

                <View style={styles.drinkContainer}>
                    <Drink food={item} store={store} list={(drink) => addDrinkHandler(drink) }/>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={{flex:1, position: 'relative'}}>
                        <View style={{position:'absolute', bottom:30, left:20}}>
                            <Text style={{fontSize:15, color:'grey'}}>Total amount</Text>
                            <Text style={{fontSize:25, fontWeight:'500'}}>{totalPrice} Kr</Text>
                        </View>
                    </View>

                    <View style={{flex:1.5, position: 'relative'}}>
                        <TouchableOpacity onPress={()=> addToCartHandler()} style={{width:'95%', height:50, position:'absolute', bottom:30, borderRadius:25, justifyContent:'center', alignItems:'center', backgroundColor:'#008080'}}>
                            <Text style={{color:'#ffffff', fontSize:18}}>Add to cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
                
          
            
        </Modal>
    )
}

const styles = StyleSheet.create({
    Container:{
        flex:1
    },

    topContainer:{
        flex:1,
    },

    storeImage:{
        flex:2,
        width:'100%',
        height: 200
    },

    middleContainer:{
        flex:1,
    },

    addQuantityButton:{
        width:45,
        height:45,
        borderRadius:45,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:0.5
    },

    drinkContainer:{
        flex:1
    },

    bottomContainer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
    }
    
    
})