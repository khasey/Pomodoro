import React, { Suspense, useEffect, useState } from 'react'
import { Button, View, XGroup, XStack, YStack, Text } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import config from './tamagui.config'
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import notifee from '@notifee/react-native';
// import { LinearGradient } from 'tamagui/linear-gradient'


const WORK_TIME = 25 * 60;  // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

export default function App() {

  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      onDisplayNotification('Enjoy your work time with Pomodoro, you can do it!');
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (isWorkMode) {
              onDisplayNotification('Your can take a break!');
              setIsWorkMode(false);
              return BREAK_TIME;
            } else {
              onDisplayNotification('Your work time has started!');
              setIsWorkMode(true);
              return WORK_TIME;
            }
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isWorkMode, isRunning]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  async function onDisplayNotification(message: string) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'POMODORO',
      body: message,
      android: {
        channelId,
        largeIcon: './assets/logo-pomodoro.png', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <TamaguiProvider config={config}>
      <Suspense>
        <SafeAreaView style={[styles.container,
        { backgroundColor: isWorkMode ? 'red' : 'green' }
        ]}>
          <YStack justifyContent="center" alignItems="center" flex={1} space>
            <YStack flex={1} justifyContent="center" alignItems="center" space>
              <TouchableOpacity 
                style={[
                    styles.circle, 
                    { backgroundColor: isWorkMode ? 'red' : 'green' }  // style conditionnel ici
                ]}
                onPress={() => {
                    if (isRunning) {
                        setSeconds(WORK_TIME);
                    }
                    setIsRunning(prevIsRunning => !prevIsRunning);
                }}
            >
                {isRunning ? (
                    <Text style={styles.timerText}>
                        {`${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`}
                    </Text>
                ) : (
                    <Text style={styles.startText}>START</Text>
                )}
              </TouchableOpacity>
            </YStack>
          </YStack>
        </SafeAreaView>
      </Suspense>
    </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
    borderRadius: Dimensions.get('window').width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.20,
    shadowRadius: 19,
    elevation: 12,  // pour Android
  },
  timerText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  startText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '800',
  },
  work: {
    backgroundColor: 'red',
  },
  break: {
    backgroundColor: 'green',
  },
  
});
