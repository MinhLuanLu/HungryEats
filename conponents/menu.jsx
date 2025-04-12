import { StyleSheet,Text,View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Food_List from "./food_list";
import { FONT } from "../fontConfig";

export default function Menu({item, socketIO, display_payment, store}){

    const [display_food_list, setDisplay_food_list] = useState(false)

    function Handle_choose_Menu(){
        setDisplay_food_list(true)
    }   

    return(
        <>
            <TouchableOpacity style={styles.menu} onPress={()=> Handle_choose_Menu()}>
                <View style={{borderTopLeftRadius:15, borderTopRightRadius:15}}>
                    <Text style={styles.menu_Name}>{item.Menu_name}</Text>
                </View>
            </TouchableOpacity>
            <Food_List socketIO={socketIO} onclose={()=> setDisplay_food_list(false)} display_food_list={display_food_list} menu_name={item.Menu_name} menu_description={item.Menu_description} menu_id={item.Menu_id} /*display_payment={()=> display_payment()}*//>
        </>
    )
}


const styles = StyleSheet.create({
    menu:{
        backgroundColor:'#008080',
        height:30,
        width:'auto',
        minWidth:90,
        borderRadius:10,
        borderWidth:0.5,
        borderColor:'#EAEDF1',
        marginRight:10,
        justifyContent:'center'
        },

    menu_Name:{
        fontSize:11,
        fontWeight:'medium',
        color:'#FFFFFF',
        textAlign:'center',
        paddingLeft:5,
        paddingRight:5,
        fontFamily:FONT.SoraRegular
    },

    Menu_description:{
        width:'100%',
        alignSelf:'center',
        paddingBottom:15,
        paddingLeft:5,
        paddingTop:5,
        paddingLeft:10,
        paddingRight:10
    }
})