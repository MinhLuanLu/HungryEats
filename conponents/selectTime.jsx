import { useState, useEffect } from 'react';
import {Text, StyleSheet,View, TouchableOpacity, Modal} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';


export default function SelectTime({displaySelectTime, onclose, getPickupTime}){

    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedMinus, setSelectedMinus] = useState(null);
    const [period, setPeriod] = useState(null);
    const [pickupTime, setPickupTime] = useState(null)


    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const isPM = hours >= 12;
    
        // Convert to 12-hour format and set values
        setSelectedHour(`${hours < 10 && 0}${hours % 12 || 12}`); // Converts 0 to 12 for midnight
        setSelectedMinus(minutes < 10 ? `0${minutes}` : minutes);
        setPeriod(isPM ? 'PM' : 'AM');
      }, []); // Runs once when the component mounts


    const hourData = [
        {key:'00', value:'00'},
        {key:'01', value:'01'},
        {key:'02', value:'02'},
        {key:'03', value:'03'},
        {key:'04', value:'04'},
        {key:'05', value:'05'},
        {key:'06', value:'06'},
        {key:'07', value:'07'},
        {key:'08', value:'08'},
        {key:'09', value:'09'},
        {key:'10', value:'10'},
        {key:'11', value:'11'},
        {key:'12', value:'12'},
        {key:'13', value:'13'},
        {key:'14', value:'14'},
        {key:'15', value:'15'},
        {key:'16', value:'16'},
        {key:'17', value:'17'},
        {key:'18', value:'18'},
        {key:'19', value:'19'},
        {key:'20', value:'20'},
        {key:'21', value:'21'},
        {key:'22', value:'22'},
        {key:'23', value:'23'},
    ]

    const minusData = [
        {key:'05', value:'05'},
        {key:'10', value:'10'},
        {key:'15', value:'15'},
        {key:'20', value:'20'},
        {key:'25', value:'25'},
        {key:'30', value:'30'},
        {key:'35', value:'35'},
        {key:'40', value:'40'},
        {key:'45', value:'45'},
        {key:'50', value:'50'},
        {key:'55', value:'55'},
    ]

    const typeTimeData = [
        {key:'AM', value:'AM'},
        {key:'PM', value:'PM'},
    ]

    function HandlePickUptime(){
        onclose()
        getPickupTime(`${selectedHour}:${selectedMinus}`)
    }

    return(
        <Modal
            visible={displaySelectTime}
            animationType="fade"
            hardwareAccelerated={true}
            transparent={true}
        >
            <View style={styles.Container}>
            <View style={styles.selectTimeContainer}>
                    <View style={styles.topLayer}>
                        <Text style={{fontSize:30, fontWeight:500, color:'#fff', textAlign:'center'}}>{selectedHour}:{selectedMinus}</Text>
                    </View>

                    <View style={styles.middleLayer}>
                        <View style={{marginRight:2, width:90, height:50}}>
                            <SelectList 
                                setSelected={(val) => Number(selectedHour) > Number(val) ? alert('The time is not available.') : setSelectedHour(val)} 
                                data={hourData} 
                                search={false}
                                placeholder={selectedHour}
                                boxStyles={{borderRadius:10}}
                                inputStyles={{fontSize:15, fontWeight:500}}
                                dropdownTextStyles={{marginTop:-5}}
                                dropdownStyles={{borderRadius:5, backgroundColor:'#d7d7d7', marginTop:2}}
                                maxHeight={70}
                            />
                        </View>

                        <View style={{marginRight:2, width:90, height:50,}}>
                            <SelectList 
                                setSelected={(val) => setSelectedMinus(val)} 
                                data={minusData} 
                                search={false}
                                placeholder={selectedMinus}
                                boxStyles={{borderRadius:10}} // style the box
                                inputStyles={{fontSize:15, fontWeight:500}} // style text in the box
                                dropdownTextStyles={{marginTop:-5}} // style text in the dropdown box
                                dropdownStyles={{borderRadius:5, backgroundColor:'#d7d7d7', marginTop:2}} // style the dropdown box
                                maxHeight={70}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomLayer}>
                        <View style={{flex:1,display:'flex', flexDirection:'row', position:'relative'}}>
                            <TouchableOpacity style={{flex:1, position:'absolute', bottom:10, right:80}} onPress={()=> onclose()}>
                                <Text style={{fontSize:15, fontWeight:500, color:'#008080', textAlign:'center', padding:1}}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex:1, position:'absolute', bottom:10, right:25}} onPress={()=> HandlePickUptime()}>
                                <Text style={{fontSize:15, fontWeight:500, color:'#008080', textAlign:'center', padding:1}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },

    selectTimeContainer:{
        backgroundColor:'#f8f8f8',
        width:'80%',
        height:250,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        borderRadius:5
    },

    topLayer:{
        backgroundColor:'#008080',
        flex:1,
        justifyContent:'center',
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },

    middleLayer:{
        flex:2,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },

    bottomLayer:{
        flex:1,

    },

    

    
})