import { StyleSheet, View,Text, TouchableOpacity, Image } from "react-native";
import { useContext } from "react";
import { UserContext } from "../Context_API/user_context";
import LottieView from "lottie-react-native";


const home = require('../assets/icons/home.png')
const order_icon = require('../assets/icons/order_icon.png')
const profile = require('../assets/icons/profile.png')
const favorite = require('../assets/icons/favorite.png')
const cart = require('../assets/icons/cart.png')

export default function TabBar({display_Payment}){

    const {public_Cart_list, setPublic_Cart_List} = useContext(UserContext)

    return(
        <View style={styles.Container}>
            <View style={styles.tabBar_Container}>
                <TouchableOpacity style={styles.icon_Container}>
                    <Image style={styles.Icon} source={home}/>
                    <Text style={styles.text}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icon_Container}>
                    <Image style={[styles.Icon, {width:23, height:23}]} source={order_icon}/>
                    <Text style={styles.text}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cart_Container} onPress={()=> display_Payment()}>
                    { public_Cart_list.length != 0
                        ?<LottieView
                            autoPlay
                            source={require('../assets/lottie/cart_active.json')}
                            style={styles.cart_Icon}
                          />
                        : <Image style={[styles.cart_Icon]} source={cart}/>
                    }
                </TouchableOpacity>

                <TouchableOpacity style={styles.icon_Container}>
                    <Image style={styles.Icon} source={favorite}/>
                    <Text style={styles.text}>Favorite</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icon_Container}>
                    <Image style={[styles.Icon, {width:22, height:22}]} source={profile}/>
                    <Text style={styles.text}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    Container:{
        height:66,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#FFFFFF'

    },

    tabBar_Container:{
        height:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'85%',
    },

    Icon:{
        width:24,
        height:24
    },

    cart_Icon:{
        width:40,
        height:40
    },

    icon_Container:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },

    text:{
        fontSize:12,
        fontWeight:'semibold',
        color:'#0D0D12'
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
        padding:10
    }
})