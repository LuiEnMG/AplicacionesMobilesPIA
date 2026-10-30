import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { copyImageToApp, useApp } from '../../context/AppContext';

export default function NewProductScreen() {
  const { addProduct } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const addPhoto = async (fromCamera) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, quality: 0.7 });
    if (result.canceled) return;
    const copied = await Promise.all(result.assets.map((asset) => copyImageToApp(asset.uri)));
    setPhotos((current) => [...current, ...copied]);
  };
  const save = () => {
    if (!name.trim() || !description.trim()) return setError('El nombre y la descripción son obligatorios.');
    addProduct({ id: `product-${Date.now()}`, name: name.trim(), description: description.trim(), photos });
    router.back();
  };
  return <ScrollView contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Nuevo producto</Text>
    <TextInput label="Nombre" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
    <TextInput label="Descripción" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
    <View style={styles.actions}><Button mode="outlined" icon="image" onPress={() => addPhoto(false)}>Galería</Button><Button mode="outlined" icon="camera" onPress={() => addPhoto(true)}>Cámara</Button></View>
    <View style={styles.photos}>{photos.map((uri) => <Image key={uri} source={{ uri }} style={styles.photo} />)}</View>
    <HelperText type="error" visible={Boolean(error)}>{error}</HelperText>
    <Button mode="contained" onPress={save}>Guardar producto</Button>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: '#f6f8fb', flexGrow: 1 },
  title: { marginBottom: 20, fontWeight: '700' },
  input: { marginBottom: 12, backgroundColor: 'white' },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  photo: { width: 84, height: 84, borderRadius: 8 },
});
