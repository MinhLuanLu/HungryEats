import { FONT } from "../fontConfig";
import { StyleSheet, Text, View } from "react-native";
import Animated,{withSpring, withTiming, useSharedValue, useAnimatedStyle} from "react-native-reanimated";
import { useEffect } from "react";
import { responsiveSize } from "../utils/responsive";



export default function NotificatonAlert({success, failed, title, message}){
    const height = 50

    const moveDown = useSharedValue(-50)

    useEffect(()=>{
        moveDown.value = withSpring(responsiveSize(35))

        setTimeout(() => {
            if(moveDown.value === responsiveSize(35)){
                moveDown.value = withTiming(responsiveSize(-60), {duration:500})

            }
        }, 2500); 
    },[])

    const moveAnimateion = useAnimatedStyle(()=>{
        return{
            top: moveDown.value
        }
    })

    return(
        <Animated.View
        style={[
            {
            width: 230,
            height: height, // make sure 'height' is defined elsewhere
            backgroundColor: success ? '#a6d96a' : '#ff0505',
            borderRadius: 60,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
            alignSelf:'center'
            },
            moveAnimateion, // assuming this is an Animated style object
        ]}
        >

            { success ?
                <>
                    <Text style={{color:'#22bb33', fontSize:15, fontFamily: FONT.SoraMedium}}>{title}</Text>
                    <Text style={{color:"#22bb33", fontSize:12, fontFamily: FONT.SoraRegular}}>{message}</Text>
                </>
                :
                null      
            }
            {failed ?
                <>
                    <Text style={{color:'#f8f8f8', fontSize:15, fontFamily: FONT.SoraMedium}}>{title}</Text>
                    <Text style={{color:"#e0e0e0", fontSize:12, fontFamily: FONT.SoraRegular}}>{message}</Text>
                </>
                :
                null
            }
        </Animated.View>
    )
}