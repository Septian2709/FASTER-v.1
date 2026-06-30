import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StockScreen = () => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: ''
  });

  // Data awal untuk demo
  const initialItems = [
    {
      id: '1',
      name: 'Plaster',
      quantity: 50,
      expiryDate: '2025-12-31',
      category: 'Perban & Plaster',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Betadine',
      quantity: 5,
      expiryDate: '2026-06-30',
      category: 'Antiseptik',
      status: 'low'
    },
    {
      id: '3',
      name: 'Paracetamol',
      quantity: 20,
      expiryDate: '2024-11-15',
      category: 'Obat-obatan',
      status: 'expired'
    },
    {
      id: '4',
      name: 'Kassa Steril',
      quantity: 30,
      expiryDate: '2025-09-20',
      category: 'Perban & Plaster',
      status: 'ready'
    },
    {
      id: '5',
      name: 'Masker',
      quantity: 100,
      expiryDate: '2026-12-31',
      category: 'Perlengkapan',
      status: 'ready'
    }
  ];

  useEffect(() => {
    setItems(initialItems);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return '#4caf50';
      case 'low':
        return '#ff9800';
      case 'expired':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'low':
        return 'Stok Menipis';
      case 'expired':
        return 'Kadaluarsa';
      default:
        return status;
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      quantity: '',
      expiryDate: '',
      category: ''
    });
    setModalVisible(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      expiryDate: item.expiryDate,
      category: item.category
    });
    setModalVisible(true);
  };

  const handleDeleteItem = (item) => {
    Alert.alert(
      'Hapus Item',
      `Apakah Anda yakin ingin menghapus "${item.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setItems(items.filter(i => i.id !== item.id));
            Alert.alert('Sukses', 'Item berhasil dihapus');
          }
        }
      ]
    );
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.quantity || !formData.expiryDate) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    const quantityNum = parseInt(formData.quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert('Error', 'Quantity harus berupa angka positif');
      return;
    }

    const status = quantityNum < 10 ? 'low' : 'ready';
    // Simulasi expired check
    const today = new Date();
    const expiry = new Date(formData.expiryDate);
    const finalStatus = expiry < today ? 'expired' : status;

    if (selectedItem) {
      // Edit item
      const updatedItems = items.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: formData.name,
              quantity: quantityNum,
              expiryDate: formData.expiryDate,
              category: formData.category || 'Lainnya',
              status: finalStatus
            }
          : item
      );
      setItems(updatedItems);
      Alert.alert('Sukses', 'Item berhasil diperbarui');
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        name: formData.name,
        quantity: quantityNum,
        expiryDate: formData.expiryDate,
        category: formData.category || 'Lainnya',
        status: finalStatus
      };
      setItems([...items, newItem]);
      Alert.alert('Sukses', 'Item berhasil ditambahkan');
    }

    setModalVisible(false);
    setFormData({ name: '', quantity: '', expiryDate: '', category: '' });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulasi refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Icon name="category" size={16} color="#666" />
          <Text style={styles.detailText}>{item.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="numbers" size={16} color="#666" />
          <Text style={styles.detailText}>Stok: {item.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="date-range" size={16} color="#666" />
          <Text style={styles.detailText}>Exp: {item.expiryDate}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditItem(item)}
        >
          <Icon name="edit" size={20} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteItem(item)}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari item..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Tidak ada item</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddItem}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem ? 'Edit Item' : 'Tambah Item Baru'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nama Item"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Jumlah Stok"
              keyboardType="numeric"
              value={formData.quantity}
              onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Tanggal Kadaluarsa (YYYY-MM-DD)"
              value={formData.expiryDate}
              onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Kategori (Opsional)"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveItem}
              >
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDetails: {
    gap: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#f4511e',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f4511e',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default StockScreen;
