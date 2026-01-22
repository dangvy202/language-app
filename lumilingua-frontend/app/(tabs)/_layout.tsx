import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import { useState, useRef } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <TouchableOpacity>
        {icon !== 'menu' ? (
          <View
            style={{
              backgroundColor: 'rgb(255, 240, 200)',
            }}
            className="
              flex-row items-center justify-center
              px-1 py-2
              min-w-[95px] h-10
              rounded-full overflow-hidden"
          >
            <Ionicons name={icon} size={20} color="#FFA500" />
            <Text className="ml-2 text-[15px] font-semibold text-[#2E2A47]">
              {title}
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: 'rgb(255, 240, 200)',
            }}
            className="
              flex-row items-center justify-center
              px-1 py-2
              min-w-[95px] h-10
              rounded-full overflow-hidden"
          >
            <Ionicons name={icon} size={20} color="#FFA500" />
          </View>
        )}
      </TouchableOpacity>
    );
  }
  return (
    <View className="h-10 w-10 items-center justify-center">
      <Ionicons name={icon} size={20} color="#FFA500" />
    </View>
  );
};

export default function RootLayout() {
  const router = useRouter();
  const [isLearnSheetOpen, setIsLearnSheetOpen] = useState(false);

  const snapPoints = ['40%'];

  const handleLearnPress = () => {
    setIsLearnSheetOpen(true);
  };

  const closeSheet = () => {
    setIsLearnSheetOpen(false);
  };

  const pendingRoute = useRef<string | null>(null);

  const handleNavigate = (route: string) => {
    pendingRoute.current = route;
    closeSheet();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 80,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#FFA500',
          tabBarInactiveTintColor: '#999999',
        }}
      >
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="wallet-outline" title="Wallet" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="person-outline" title="Profile" />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home-outline" title="Home" />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="search-outline" title="Search" />,
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            headerShown: false,
            tabBarButton: () => (
              <TouchableOpacity
                onPress={handleLearnPress}
                activeOpacity={0.7}
                className="items-center flex-1"
              >
                <TabIcon focused={false} icon="book-outline" title="Learn" />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      {/* Bottom Sheet */}
      <BottomSheet
        index={isLearnSheetOpen ? 0 : -1}
        snapPoints={snapPoints}
        onClose={closeSheet}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#FFA500', width: 40, height: 5 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-4 pb-10">
          <Text className="text-2xl font-bold text-center text-[#2E2A47] mb-8">Options</Text>

          <TouchableOpacity
            className="bg-orange-50 p-5 rounded-2xl mb-5 flex-row items-center shadow-sm"
            onPress={() => {
              closeSheet();
              setTimeout(() => {
                router.push('/learn');
              }, 200);  // Delay 200ms để animation đóng sheet hoàn tất (tùy chỉnh nếu cần)
            }}
          >
            <Ionicons name="git-network-outline" size={28} color="#FFA500" />
            <Text className="ml-4 text-lg font-medium text-[#2E2A47]">Learn Process</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-50 p-5 rounded-2xl mb-5 flex-row items-center shadow-sm"
            onPress={() => {
              closeSheet();
              setTimeout(() => {
                // router.push('/learn/vocabulary');
              }, 200);
            }}
          >
            <Ionicons name="book-outline" size={28} color="#FFA500" />
            <Text className="ml-4 text-lg font-medium text-[#2E2A47]">Learn Vocabulary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-50 p-5 rounded-2xl flex-row items-center shadow-sm"
            onPress={() => {
              closeSheet();
              setTimeout(() => {
                // router.push('/learn/find-tutor');
              }, 200);
            }}
          >
            <Ionicons name="people-outline" size={28} color="#FFA500" />
            <Text className="ml-4 text-lg font-medium text-[#2E2A47]">Find Tutor</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}