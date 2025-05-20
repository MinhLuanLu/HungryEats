import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSocketio } from "../../contextApi/socketio_context";

const PaymentHistory = () =>{
    const {socket} = useSocketio();

    if(socket){
        
    socket.on('test', (order) => {
        alert(4454)
    })
    }
    return(
        <View>
            <Text>Payment History</Text>
        </View>
    )

}

export default PaymentHistory;