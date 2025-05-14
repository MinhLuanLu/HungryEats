import { useState, useEffect, useContext } from "react";
import { UserContext } from "./contextApi/user_context";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from "react-native";


import {EXPO_PROJECT_ID} from '@env'
//expoPushToken, setExpoPushToken

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: EXPO_PROJECT_ID //replace you Project ID here
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }


async function CreateNotification(content) {
    Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
    const permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== 'granted') {
        alert('Notification permissions not granted');
        return;
    }

    await Notifications.scheduleNotificationAsync({
        content: content/*{
            title: 'Look at that notification',
            body: "I'm so proud of myself!",
        }*/,
        trigger: null, // or { seconds: 5 }
    });
}



export {
    registerForPushNotificationsAsync,
    CreateNotification
}