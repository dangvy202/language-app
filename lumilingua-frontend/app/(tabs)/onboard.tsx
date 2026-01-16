// App.tsx hoặc HomeScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>
          Search for lessons, topics, or teachers
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>LumiLingua</Text>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Ionicons name="book-outline" size={24} color="#FFA500" />
          <Text style={styles.activeTabText}>Grammar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#666" />
          <Text style={styles.tabText}>Vocabulary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="chatbubbles-outline" size={24} color="#666" />
          <Text style={styles.tabText}>Phrases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="mic-outline" size={24} color="#666" />
          <Text style={styles.tabText}>Pronu...</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Cat Card */}
      <View style={styles.catContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x300/FFD700/FFFFFF?text=🐱' }} // Thay bằng link ảnh mèo cam 2D thật của mày
          style={styles.catImage}
          resizeMode="cover"
        />
        <View style={styles.catButtons}>
          <TouchableOpacity style={styles.catButtonLeft}>
            <Ionicons name="person-outline" size={20} color="#FFF" />
            <Text style={styles.catButtonText}>Spoken lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catButtonRight}>
            <Ionicons name="leaf-outline" size={20} color="#FFF" />
            <Text style={styles.catButtonText}>Pigeon Vocabulary</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="book-outline" size={24} color="#999" />
          <Text style={styles.navText}>Grammar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text-outline" size={24} color="#999" />
          <Text style={styles.navText}>Spoken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.activeNavIcon}>
            <Ionicons name="home" size={28} color="#FFA500" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="mic-outline" size={24} color="#999" />
          <Text style={styles.navText}>Pronunciation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="globe-outline" size={24} color="#999" />
          <Text style={styles.navText}>Culture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  tabs: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: '#FFF8E1',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTabText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#FFA500',
  },
  tabText: {
    marginLeft: 8,
    color: '#666',
  },
  catContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  catImage: {
    width: '100%',
    height: 350,
    borderRadius: 30,
    backgroundColor: '#FFD700',
  },
  catButtons: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    justifyContent: 'space-between',
  },
  catButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  catButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  catButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {
    marginBottom: 10,
  },
  activeNavIcon: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default HomeScreen;