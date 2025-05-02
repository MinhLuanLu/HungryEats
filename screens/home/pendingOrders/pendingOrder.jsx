import { StyleSheet, View, Modal, SafeAreaView,TouchableWithoutFeedback, ScrollView, TouchableOpacity , Text, Image} from "react-native";
import LottieView from "lottie-react-native";
import { useEffect , useState, useContext} from "react";
import axios from "axios";
import log  from "minhluanlu-color-log";
import { config, orderStatusConfig } from "../../../config";
import {SERVER_IP} from'@env';
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../../contextApi/user_context";
import CustomOrder from "../../customOrder/customOrder";
import Orders from "../../../conponents/orders";
import OrderHeader from "../../../conponents/orderHeader";
import { responsiveSize } from "../../../utils/responsive";

const down_arrow = require('../../../assets/icons/down_arrow.png')

export default function PendingOrders({route}) {
  
  const [tab, setTab]                                 = useState(false)
  const [order_history, setOrder_history]             = useState([]);
  const [selectOrder, setSelectOrder] = useState({})
  const [viewOrder, setViewOrder] = useState(false)
  const navigate = useNavigation()
  const {publicPendingOrder, setPublicPendingOrder}    = useContext(UserContext);
  const {publicUser, setPublicUser} = useContext(UserContext);
  const [orderList, setOrderList] = useState([])

  const {data} = route.params
 

  useEffect(()=>{
    if(data){
      orderHistoryHandler()
    }
  },[data])


  const orderHistoryHandler = async () => {
    setTab(true);
    try{
      const orderHistory = await axios.post(`${SERVER_IP}/orderHistory/api`,{
        User: publicUser
      })

      if(orderHistory?.data?.success){
        console.log(orderHistory?.data?.message);
        setOrder_history(orderHistory?.data?.data);
        return
      }

    }
    catch(error){
      log.warn(error)
    }
  }

  useEffect(()=>{
    if(tab){
      const orderHistoryHandler = async () => {
        try{
          const orderHistory = await axios.post(`${SERVER_IP}/orderHistory/api`,{
            User: publicUser
          })
    
          if(orderHistory?.data?.success){
            console.log(orderHistory?.data?.message);
            setOrderList(orderHistory?.data?.data);
            console.log(orderHistory?.data?.data)
            return
          }
    
        }
        catch(error){
          log.warn(error)
        }
      }
      
      orderHistoryHandler()
    }
  },[tab])


  function viewOrderHandler(order){
    let orderObject = {...order}
    setSelectOrder(orderObject);
    setViewOrder(true)
  }

  if(viewOrder) return <CustomOrder onclose={()=> setViewOrder(false)} order={selectOrder}/>
  
  return (
    <Modal
      visible={true}
      animationType="slide"
      hardwareAccelerated={true}
    >
      <SafeAreaView style={styles.Container}>

        <TouchableWithoutFeedback>
          <View style={styles.top_Layer}>

            <TouchableWithoutFeedback onPress={()=> navigate.navigate('Home') }>
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

                <TouchableWithoutFeedback  onPress={()=> orderHistoryHandler()}>
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
            {publicPendingOrder.length != 0 ?
              <Orders orderList={publicPendingOrder} backgroundColor="grey"/>
              :
              <Text>No Pending order...</Text>
            }
          </ScrollView>
        :
        <View style={{flex:1, backgroundColor:'#333333'}}>
          <Orders backgroundColor="grey" orderList={orderList}/>
        </View>
      }
        
      </SafeAreaView>
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
    justifyContent:'center',
    alignItems:'center'
    
  },

  order_detail:{
    marginLeft:15,
    paddingTop:10,
    paddingBottom:10
  }

 
});
