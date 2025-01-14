import { StyleSheet, View, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity , Text, Image} from "react-native";
import { useEffect , useState} from "react";

import {SERVER_IP} from'@env'

const down_arrow = require('../../../assets/icons/down_arrow.png')

export default function Order_Status({ display_Order_Status, order_status_list, socketIO, onclose, email, defineTab}) {
  
  const [tab, setTab]                                 = useState(false)
  const [order_history, setOrder_history]             = useState([])

  useEffect(()=>{
    async function Handel_Get_Order_History(data) {
      await fetch(`${SERVER_IP}/order_history/api`,{
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
              setOrder_history(data.Order_history)

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
      "Email": email
    }

    if(tab || defineTab == true){
      Handel_Get_Order_History(data)
    } 
  },[tab])


  useEffect(()=>{
    setTab(defineTab)
  },[defineTab])

  
  return (
    <Modal
      visible={display_Order_Status}
      animationType="slide"
      hardwareAccelerated={true}
    >
      <View style={styles.Container}>

        <TouchableWithoutFeedback>
          <View style={styles.top_Layer}>

            <TouchableWithoutFeedback onPress={()=> {onclose(), setTab(false)}}>
              <View style={{width:35, height:35, backgroundColor:'#d7d7d7', borderRadius:40, justifyContent:'center', alignItems:'center', position:'absolute', left:15, top:20}}>
                <Image style={{width:25, height:25}} resizeMode="cover" source={down_arrow}/>
              </View>
            </TouchableWithoutFeedback>
            
            <View style={{height:35, width:'90%',backgroundColor:'#333333', marginBottom:10, borderRadius:40, alignItems:'center', justifyContent:'center'}}>
              <View style={{height:25, width:'98%', borderRadius:40,display:'flex', flexDirection:'row', alignItems:'center' }}>
                <TouchableWithoutFeedback onPress={()=> setTab(false)}>
                  <View style={{backgroundColor: !tab ? '#d7d7d7' : '#333333', width:'50%',borderRadius:40, height:29, justifyContent:'center'}}>
                    <Text style={{textAlign:'center'}}>Active</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback  onPress={()=> setTab(true)}>
                  <View style={{backgroundColor: tab ? '#d7d7d7' : '#333333', width:'50%', borderRadius:40, height:29, justifyContent:'center'}}>
                    <Text style={{textAlign:'center'}}>History</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        { !tab ?
          <ScrollView style={styles.bottom_layer}>
            {order_status_list.map((item, index) => (
              <View key={item.Order_id} style={styles.order_Container}>
                <View style={styles.image_Conatiner}>
                  <Image style={{width:'100%', height:'100%'}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                </View>
                <View style={styles.order_detail}>
              
                    <Text style={{fontSize:15, fontWeight:500, color:'#FFFFFF'}}>{item.Order_id}. {item.Food_name} ({item.Food_quantity}x)</Text>
                    <Text style={{fontSize:13, fontWeight:500, color:'#D7D7D7'}}>Status:
                      {item.Order_status === "Accept"
                        ?<Text style={{fontSize:12, fontWeight:500, color:'#008080'}}> {item.Order_status}</Text>
                        :<Text style={{fontSize:12, fontWeight:500, color:'#FF9F0D'}}> {item.Order_status}</Text>
                      }
                    </Text>
                    <Text style={{fontSize:12, fontWeight:500,color:'#D7D7D7'}}>Pickup time:
                      <Text style={{fontSize:12, fontWeight:500, color:'#D7D7D7'}}> {item.Pickup_time}</Text>
                    </Text>

                    <Text style={{fontSize:14, fontWeight:500, color:'#D7D7D7'}}>Total: {item.Total_price}Kr</Text>

                    <TouchableOpacity style={{backgroundColor:'#008080', height:30, width:200,justifyContent:'center', borderRadius:3, marginTop:5}}>
                      <Text style={{textAlign:'center', color:'#d7d7d7'}}>View Order</Text>
                    </TouchableOpacity>
                  
                </View>
              </View>
            ))}
          </ScrollView>
        :
          <ScrollView style={styles.bottom_layer}>
            {order_history.map((item, index)=>(
              <View key={item.Order_id} style={styles.order_Container}>
                <View style={styles.image_Conatiner}>
                  <Image style={{width:'100%', height:'100%'}} resizeMode="cover" source={{uri: `${SERVER_IP}/${item.Food_image}`}}/>
                </View>

                <View style={styles.order_detail}>
                    <Text style={{fontSize:15, fontWeight:500, color:'#FFFFFF'}}>{item.Order_id}. {item.Food_name} ({item.Food_quantity}x)</Text>
                    <Text style={{fontSize:13, fontWeight:500, color:'#D7D7D7'}}>Status:
                      {item.Order_status === "Accept"
                        ?<Text style={{fontSize:12, fontWeight:500, color:'#008080'}}> {item.Order_status}</Text>
                        :<Text style={{fontSize:12, fontWeight:500, color:'#FF9F0D'}}> {item.Order_status}</Text>
                      }
                    </Text>
                    <Text style={{fontSize:12, fontWeight:500,color:'#D7D7D7'}}>Pickup time:
                      <Text style={{fontSize:12, fontWeight:500, color:'#D7D7D7'}}> {item.Pickup_time}</Text>
                    </Text>

                    <Text style={{fontSize:14, fontWeight:500, color:'#D7D7D7'}}>Total: {item.Total_price}Kr</Text>

                    <TouchableOpacity style={{backgroundColor:'#008080', height:30, width:200,justifyContent:'center', borderRadius:3, marginTop:5}}>
                      <Text style={{textAlign:'center', color:'#d7d7d7'}}>View Order</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        }
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    
  },
  top_Layer: {
    height:'20%',
    backgroundColor: '#8f8f8f',
    justifyContent:'flex-end',
    alignItems:'center'
  },

  bottom_layer:{
    height:'80%',
    backgroundColor:'#333333'
  },
  order_Container:{
    display:'flex',
    flexDirection:'row',
    marginTop:10,
    minHeight:90,
    height:'auto',
    alignItems:'center',
    width:'95%',
    borderRadius:5,
    alignSelf:'center',
    borderWidth:0.3,
    borderColor:'#d7d7d7'
  },

  image_Conatiner:{
    width:70,
    height:70,
    backgroundColor:'#FFFFFF',
    marginLeft:15,
    borderRadius:10,
    
  },

  order_detail:{
    marginLeft:15,
    paddingTop:10,
    paddingBottom:10
  }

 
});
