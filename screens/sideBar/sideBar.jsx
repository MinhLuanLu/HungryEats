import { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated , StatusBar,Platform,TouchableWithoutFeedback, SafeAreaView, Image} from 'react-native';
import { Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const activity = require('../../assets/icons/activity.png')
const history  = require('../../assets/icons/history.png')
const account  = require('../../assets/icons/account.png')
const payment  = require('../../assets/icons/payment.png')

export default function SideBar({ display_sideBar, onclose, displayOrderStatus, displayOrderStatusHistory }) {
  const [slideAnim] = useState(new Animated.Value(-300)); // Initial position off-screen to the left
  const navigate = useNavigation()

  useEffect(() => {
    if (display_sideBar) {
      // Slide the modal in
      Animated.timing(slideAnim, {
        toValue: 0, // Slide into view
        duration: 300,
        easing: Easing.ease, // Correctly imported Easing
        useNativeDriver: true,
      }).start();
    } 
    else {
      // Slide the modal out
      Animated.timing(slideAnim, {
        toValue: -300, // Slide off-screen
        duration: 300,
        easing: Easing.ease, // Correctly imported Easing
        useNativeDriver: true,
      }).start();
    }
  }, [display_sideBar, onclose]);

  
  return (
    <View style={styles.container}>
      <Modal
        transparent
        visible={display_sideBar}
        animationType="none" // Disable default modal animation
        statusBarTranslucent={true}  
        hardwareAccelerated={true}
      >
        <SafeAreaView style={styles.overlay}>
          <Animated.View
            style={[
              styles.leftSection,
              {
                transform: [{ translateX: slideAnim }], // Apply sliding animation
              },
            ]}
          >
            <View style={styles.topLayer}>
              <View style={{display:'flex', flexDirection:'row', width:'100%'}}>
                <TouchableOpacity style={styles.containerButton} onPress={()=> displayOrderStatus()}>
                  <Image resizeMode='cover' style={styles.icon} source={activity}/>
                  <Text style={styles.containerButtonText}>Activity</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.containerButton} onPress={()=> displayOrderStatusHistory()}>
                  <Image resizeMode='cover' style={styles.icon} source={history}/>
                  <Text style={styles.containerButtonText}>History</Text>
                </TouchableOpacity>
              </View>

              <View style={{display:'flex', flexDirection:'row', width:'100%', marginTop:10}}>
                <TouchableOpacity style={styles.containerButton} onPress={()=> navigate.navigate('Account')}>
                  <Image resizeMode='cover' style={styles.icon} source={account}/>
                  <Text style={styles.containerButtonText}>Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.containerButton} onPress={()=> navigate.navigate('paymentHistory')}>
                  <Image resizeMode='cover' style={styles.icon} source={payment}/>
                  <Text style={styles.containerButtonText}>Payment</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.bottomLayer}>
              <Text>bottom</Text>
            </View>
            
          </Animated.View>

          <TouchableWithoutFeedback onPress={()=> onclose()}>
            <View style={styles.rightSection}></View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    alignItems: 'flex-start', // Align to the left of the screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 30,  // Fix 'iso' to 'ios'
  },

  leftSection: {
    width:'75%',
    height: '100%',
    backgroundColor: '#d7d7d7',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  topLayer:{
    flex:1,
    alignSelf:'center',
    justifyContent:'center'
  },

  containerButton:{
    backgroundColor:'#8f8f8f', 
    height:80, 
    flex:1, 
    borderRadius:5,
    marginRight:5, 
    marginLeft:5,
    justifyContent:'center',
    alignItems:'center'
  },

  icon:{
    width:30,
    height:30
  },

  containerButtonText:{
    textAlign:'center',
    fontWeight:600,
    color:'#000000',
    fontSize:15
  },

  bottomLayer:{
    flex:2,
    backgroundColor:'green' //////
  },
  
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  rightSection:{
    width:'25%',
    height:'100%',
    backgroundColor:'transparent',
    alignSelf:'flex-end'

  },

  closeButton: {
    padding: 10,
    backgroundColor: '#FF5733',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
