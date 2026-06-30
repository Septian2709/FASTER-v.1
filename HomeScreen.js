import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    expired: 0,
    lowStock: 0
  });

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('username');
      if (user) setUsername(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Simulasi data statistik
      // Dalam implementasi nyata, ini akan mengambil dari database
      setStats({
        total: 25,
        expired: 3,
        lowStock: 5
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userLoggedIn');
              await AsyncStorage.removeItem('username');
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Gagal logout');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={30} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Selamat Datang,</Text>
          <Text style={styles.userName}>{username || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#f4511e" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="inventory"
          label="Total Item"
          value={stats.total}
          color="#2196F3"
        />
        <StatCard
          icon="warning"
          label="Kadaluarsa"
          value={stats.expired}
          color="#f44336"
        />
        <StatCard
          icon="error-outline"
          label="Stok Menipis"
          value={stats.lowStock}
          color="#FF9800"
        />
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Stock')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#e3f2fd' }]}>
            <Icon name="medical-services" size={30} color="#1976d2" />
          </View>
          <Text style={styles.menuText}>Kelola Stok</Text>
          <Text style={styles.menuSubText}>Lihat & edit stok P3K</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Fitur dalam pengembangan')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#f3e5f5' }]}>
            <Icon name="add" size={30} color="#7b1fa2" />
          </View>
          <Text style={styles.menuText}>Tambah Item</Text>
          <Text style={styles.menuSubText}>Tambah stok baru</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Fitur dalam pengembangan')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#e8f5e9' }]}>
            <Icon name="history" size={30} color="#2e7d32" />
          </View>
          <Text style={styles.menuText}>Riwayat</Text>
          <Text style={styles.menuSubText}>Lihat riwayat transaksi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Aplikasi Stok P3K v1.0</Text>
        <Text style={styles.footerSubText}>© 2024 - Semua Hak Dilindungi</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderLeftWidth: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuContainer: {
    padding: 10,
    marginTop: 10,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  menuSubText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default HomeScreen;
