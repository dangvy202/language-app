import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

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
  return  (
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          height: 72,
          backgroundColor: '#ffffff',
          position: 'absolute',
          overflow: 'hidden'
        }
      }}
    >
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
                focused={focused} 
                icon="wallet" 
                title="Wallet"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='profile'options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
                focused={focused} 
                icon="person"
                title="Profile"
            />
          )
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
                focused={focused} 
                icon="home" 
                title="Home"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='search'options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
                focused={focused} 
                icon="search"
                title="Search"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='saved'options={{
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
                focused={focused} 
                icon="book"
                title="Saved"
            />
          )
        }}
      />
    </Tabs>
  )
}
