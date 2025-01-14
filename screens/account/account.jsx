import { useEffect, useState } from "react";
import { StyleSheet,View, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback } from "react-native";
import { UserContext } from "../../contextApi/user_context";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

const rightArrow = require('../../assets/icons/right_arrow.png')
const editIcon = require('../../assets/icons/editIcon.png')
const logoutIcon = require('../../assets/icons/logoutIcon.png')
const saveIcon = require('../../assets/icons/saveIcon.png')
const leftArrow = require('../../assets/icons/left_arrow.png')


const Account = () =>{

    const navigate = useNavigation()
    const {publicEmail, setPuclicEmail}                     = useContext(UserContext)
    const {public_Username, setPublic_Username}             = useContext(UserContext)
    const [inputActive, setInputActive]                     = useState(false)
    const [editable, setEdiTable]                           = useState(false)

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    function handleSaveProfile(){
        setEdiTable(false)
    }

    return(
        <View style={styles.Container}>
            <View style={styles.topLayer}>
                <TouchableOpacity style={{backgroundColor:'#fff', height:35, width:35, justifyContent:'center', alignItems:'center', borderRadius:35, position:'absolute', top:10, left:10}} onPress={()=> navigate.navigate('Home')}>
                    <Image resizeMode="cover" style={{width:20, height:20}} source={leftArrow}/>
                </TouchableOpacity>
                <View style={{width:120, height:120, backgroundColor:'#000', marginBottom:-20, borderWidth:2, borderColor:'#008080', borderRadius:5}}>
                    <TouchableOpacity style={{position:'absolute', bottom:5, right:0}}>
                        <Image resizeMode="cover" style={{width:20, height:20}} source={editIcon}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottomLayer}>
                <View style={{flex:1, marginTop:30}}>
                    <Text style={styles.inputInfoText}>Email</Text>
                    <TextInput  style={styles.inputInfo} 
                                placeholder={publicEmail} 
                                editable={editable} 
                                onFocus={()=> setInputActive(true)} 
                                onBlur={()=> setInputActive(false)}
                                value={email}
                                onChangeText={text => setEmail(text)}
                    />

                    <Text style={styles.inputInfoText}>Username</Text>
                    <TextInput  style={styles.inputInfo} 
                                placeholder={public_Username} 
                                editable={editable} 
                                onFocus={()=> setInputActive(true)} 
                                onBlur={()=> setInputActive(false)} 
                                value={username}
                                onChangeText={text => setUsername(text)}
                    />

                    <Text style={styles.inputInfoText}>Password</Text>
                    <TextInput  style={styles.inputInfo} 
                                placeholder={!editable ? "**************" : "New Password"} 
                                editable={editable} 
                                onFocus={()=> setInputActive(true)} 
                                onBlur={()=> setInputActive(false)}
                                value={password}
                                onChangeText={text => setPassword(text)}
                    />
                </View>
                { !inputActive &&
                <View style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                    <View style={styles.infoBox}>
                        <TouchableOpacity style={styles.infoButton}>
                            <Text style={{flex:2, paddingLeft:5, color:'#808080'}}>Payment Detail</Text>
                            <Image resizeMode="cover" style={styles.arrowIcon} source={rightArrow}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.infoButton}>
                            <Text style={{flex:2, paddingLeft:5, color:'#808080'}}>Order History</Text>
                            <Image resizeMode="cover" style={styles.arrowIcon} source={rightArrow}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'85%', alignSelf:'center'}}>
                        { !editable
                            ?<TouchableOpacity style={styles.editButton} onPress={()=> setEdiTable(true)}>
                                <Text style={[styles.buttonText, {color:'#fff'}]}>Edit Profile</Text>
                                <Image resizeMode="cover" style={styles.buttonIcon} source={editIcon}/>
                            </TouchableOpacity>
                            
                            :<TouchableOpacity style={styles.editButton} onPress={()=> handleSaveProfile()}>
                                <Text style={[styles.buttonText, {color:'#fff', marginLeft:15}]}>Save</Text>
                                <Image resizeMode="cover" style={styles.buttonIcon} source={saveIcon}/>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={[styles.editButton, {backgroundColor:'transparent', borderWidth:1.2, borderColor:'#008080'}]} onPress={()=> navigate.navigate("launch_screen")}>
                            <Text style={styles.buttonText}>Logout</Text>
                            <Image resizeMode="cover" style={styles.buttonIcon} source={logoutIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Container:{
        flex:1
    },

    topLayer:{
        flex:0.8,
        backgroundColor:'#008080',
        justifyContent:'flex-end',
        alignItems:'center'
    },

    bottomLayer:{
        flex:2,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
    },

    inputInfo:{
        borderWidth:0.5,
        width:'90%',
        alignSelf:'center',
        paddingLeft:10,
        borderRadius:20,
        fontSize:14,
        marginBottom:5,
        marginTop:5,
        paddingTop:12,
        paddingBottom:12
    },

    inputInfoText:{
        marginLeft:15,
        fontSize:15,
        fontWeight:500
    },

    infoBox:{
        flex:1, 
        backgroundColor:'transparent', 
        width:'82%', 
        alignSelf:'center', 
        justifyContent:'center', 
        borderWidth:0.2, 
        borderRadius:10
    },

    infoButton:{
        height:30,
        marginBottom:5,
        marginTop:5,
        width:'90%',
        alignSelf:'center',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:0.2,
    },

    arrowIcon:{
        width:20,
        height:15,
    },

    editButton:{
        backgroundColor:'#008080',
        width:130,
        height:55,
        backgroundColor:'#333333',
        borderRadius:10,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    },

    buttonText:{
        flex:1,
        fontSize:15,
        fontWeight:500,
    },

    buttonIcon:{
        width:20,
        height:20
    }
})

export default Account;