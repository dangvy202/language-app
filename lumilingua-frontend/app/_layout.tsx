import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: '' }}
          />
          <Stack.Screen name="login" />
          <Stack.Screen
            name="course/topic/[topic]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="course/level/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}