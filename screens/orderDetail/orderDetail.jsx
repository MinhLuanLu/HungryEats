import { StyleSheet, View, Text, TouchableOpacity, Modal, Image , SafeAreaView, ScrollView, Dimensions, FlatList} from "react-native";
import { useEffect, useState, useContext } from "react";
import { FONT } from "../../fontConfig";
import { responsiveSize } from "../../utils/responsive";
import { UserContext } from "../../contextApi/user_context";
import {SERVER_IP} from '@env';
import SwipeAble from "../../conponents/swipeAble";
import Animated,{withTiming, useSharedValue, useAnimatedStyle, } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import OrderHeader from "../../conponents/orderHeader";


const downArrow = require('../../assets/icons/down_arrow.png');
const {width} = Dimensions.get('window')

//const order = {"Store":{"Store_id":1,"User_id":11,"Store_name":"Sota Sushi","Address":"Vestergade 48, Aarhus C","PostCode":8000,"Latitude":56.1578,"Longitude":10.2019,"Location":"Midtjylland","Status":1,"Store_description":"Smag på japan. Siden 2009 har vi haft vores japanske restaurant her i Vestergade 48 i Aarhus.","Phone_number":86474788,"Store_image":"Sota-Sushi.jpg","Created_at":"2024-12-09T07:06:28.000Z"},"User":{"User_id":12,"Email":"minhlu14206@gmail.com","Username":"minhlu142","Phone_number":"none","Password":"111111","Created_at":"2024-12-19T10:48:44.000Z","Role":"private"},"Food_item":[{"Food_id":1,"Menu_id":1,"Food_name":"Sushi Deluxe Platter","Food_description":" 5x Nigiri, 4x Sashimi, 8x California Roll, 4x Salmon Roll, served with soy sauce, pickled ginger, and wasabi","Quantity":-458,"Price":250,"Food_image":"Sushi_Deluxe_Platter.jpg","Created_at":"2024-12-10T10:41:29.000Z","Food_quantity":1}],"Drink_item":[{"Drink_id":1,"Drink_name":"Coca-Cola","Drink_price":15,"Drink_image":"coca_cola.jpg","Created_at":"2025-01-17T14:14:02.000Z","Drink_size":"1.5L","Store_Drink_id":1,"Store_id":1,"Drink_quantity":1}],"Total_price":265}


export default function OrderDetail({onclose, order}){

    const navigate = useNavigation()
    const {publicCart, setPublicCart} = useContext(UserContext);
    const {publicUser, setPublicUser} = useContext(UserContext);

    const [mainOrder, setMainOrder] = useState(order);

    const combinedItems = [
        ...mainOrder.Food_item.map((item, index) => ({ ...item, type: 'food', index })),
        ...mainOrder.Drink_item.map((item, index) => ({ ...item, type: 'drink', index })),
    ];

    function deleteItemHandler(type, index, item) {
        if(type == "food"){

            let foodList = publicCart.Food_item;
            foodList.splice(1, index);
            publicCart.Food_item = foodList;

            setMainOrder((prevOrder) => {
                const updatedFoodItems = prevOrder.Food_item.filter((_, i) => i !== index);
                return {
                  ...prevOrder,
                  Food_item: updatedFoodItems,
                };
              });

        }
        if(type == "drink"){

            let drinkList = publicCart.Drink_item;
            drinkList.splice(1, index);
            publicCart.Drink_item = drinkList;

            setMainOrder((prevOrder) => {
                const updatedFoodItems = prevOrder.Drink_item.filter((_, i) => i !== index);
                return {
                  ...prevOrder,
                  Drink_item: updatedFoodItems,
                };
              });
        }
       tryDeleteItem(type, index)
    }
    
    function tryDeleteItem(type, index){
        if(type == 'food'){
            publicCart.Food_item.pop(publicCart.Food_item[index]);
        };
        if(type == 'drink'){
            publicCart.Drink_item.pop(publicCart.Drink_item[index]);
        }
        if(publicCart.Food_item.length === 0 && publicCart.Drink_item.length === 0){
            setPublicCart({})
        }
    };

    //////////////////////////////////////////////

    function quantityHandler(value, type, index, item) {
        let newItemQuantity;
        
        // Update quantity for food
        if (type === "food") {
            let updatedFoodItems = [...mainOrder.Food_item]; // Copy the existing food items
            newItemQuantity = updatedFoodItems[index].Food_quantity;
    
            if (value) {
                updatedFoodItems[index].Food_quantity = newItemQuantity + 1;  // Increase quantity
            } else if (newItemQuantity > 0) { // Prevent negative quantities
                updatedFoodItems[index].Food_quantity = newItemQuantity - 1;  // Decrease quantity
            }
    
            // Set the updated food items into mainOrder state
            setMainOrder((prevOrder) => ({
                ...prevOrder,
                Food_item: updatedFoodItems, // Update the Food_item array immutably
            }));
    
            // Now update the publicCart with the new quantity
            let updatedPublicCartFood = [...publicCart.Food_item]; // Copy the existing publicCart food items
            updatedPublicCartFood[index].Food_quantity = updatedFoodItems[index].Food_quantity;
            setPublicCart((prevCart) => ({
                ...prevCart,
                Food_item: updatedPublicCartFood, // Update the Food_item array immutably
            }));
        }
    
        // Update quantity for drink
        if (type === "drink") {
            let updatedDrinkItems = [...mainOrder.Drink_item]; // Copy the existing drink items
            newItemQuantity = updatedDrinkItems[index].Drink_quantity;
    
            if (value) {
                updatedDrinkItems[index].Drink_quantity = newItemQuantity + 1;  // Increase quantity
            } else if (newItemQuantity > 0) { // Prevent negative quantities
                updatedDrinkItems[index].Drink_quantity = newItemQuantity - 1;  // Decrease quantity
            }
    
            // Set the updated drink items into mainOrder state
            setMainOrder((prevOrder) => ({
                ...prevOrder,
                Drink_item: updatedDrinkItems, // Update the Drink_item array immutably
            }));
    
            // Now update the publicCart with the new quantity
            let updatedPublicCartDrink = [...publicCart.Drink_item]; // Copy the existing publicCart drink items
            updatedPublicCartDrink[index].Drink_quantity = updatedDrinkItems[index].Drink_quantity;
            setPublicCart((prevCart) => ({
                ...prevCart,
                Drink_item: updatedPublicCartDrink, // Update the Drink_item array immutably
            }));
        }
    
        console.log('Updated Item Quantity: ', newItemQuantity);
    }
    
    

    
      

    return(
        <Modal
            visible={true}
            animationType="fade"
        >
        <GestureHandlerRootView>
            <SafeAreaView style={styles.Container}>
                <OrderHeader/>
                
                    <FlatList
                        data={combinedItems}
                        keyExtractor={(item, index) => `${item.type}-${item.Food_id || item.Drink_id}-${index}`}
                        contentContainerStyle={styles.bodyContainer}
                        onEndReachedThreshold={0.5}
                        scrollEventThrottle={16}
                        renderItem={({ item }) => (
                            <SwipeAble
                            data={item}
                            image={{ uri: `${SERVER_IP}/${item.type === 'food' ? item.Food_image : item.Drink_image}` }}
                            name={item.type === 'food' ? item.Food_name : item.Drink_name}
                            price={item.type === 'food' ? item.Price : item.Drink_price}
                            quantity={item.type === 'food' ? item.Food_quantity : item.Drink_quantity}
                            deleteHandler={() => deleteItemHandler(item.type, item.index, item)}
                            quantityHandler={(value)=> quantityHandler(value, item.type, item.index, item )}
                            />
                        )}
                />

                
            </SafeAreaView>

        </GestureHandlerRootView>
        </Modal>
    )
}

const styles = StyleSheet.create({

    Container: {
        flex:1
    },
    
    bodyContainer:{
        paddingBottom: 20, // or however much extra padding you need
      }
      

})