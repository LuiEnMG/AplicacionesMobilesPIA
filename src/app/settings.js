import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { CITIES } from '../data/cities';
import { cityById, formatDate, useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { departure, saveDeparture, orders, simulatedNow, resetDate, constants } = useApp();
  const [street, setStreet] = useState(departure.street);
  const [postalCode, setPostalCode] = useState(departure.postalCode);
  const [cityId, setCityId] = useState(departure.cityId);
  const [saved, setSaved] = useState(false);
  const pending = orders.some((order) => order.status !== 'delivered');
  const save = () => { saveDeparture({ street: street.trim(), postalCode: postalCode.trim(), cityId }); setSaved(true); };
  return <ScrollView contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Configuración</Text>
    <TextInput label="Dirección de salida" value={street} onChangeText={setStreet} mode="outlined" style={styles.input} />
    <TextInput label="Código postal" value={postalCode} onChangeText={setPostalCode} mode="outlined" keyboardType="number-pad" style={styles.input} />
    <Text variant="titleMedium" style={styles.label}>Ciudad de salida</Text>
    {CITIES.map((city) => <Button key={city.id} mode={cityId === city.id ? 'contained' : 'outlined'} onPress={() => setCityId(city.id)} style={styles.city}>{city.name}</Button>)}
    <Button mode="contained" onPress={save} style={styles.button}>Guardar dirección</Button>
    {saved && <HelperText type="info">Dirección guardada. Los nuevos pedidos partirán de {cityById(cityId)?.name}.</HelperText>}
    <Text style={styles.info}>Fecha simulada actual: {formatDate(simulatedNow)}</Text>
    <Button mode="outlined" disabled={pending} onPress={resetDate} style={styles.button}>Reiniciar fecha simulada</Button>
    <HelperText type={pending ? 'error' : 'info'}>{pending ? 'No disponible mientras existan pedidos pendientes.' : `Disponible. La fecha volverá a ${formatDate(constants.DEFAULT_DATE)}.`}</HelperText>
    <Button onPress={() => router.back()}>Volver</Button>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 20, backgroundColor: '#f6f8fb', flexGrow: 1 },
  title: { fontWeight: '700', marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: 'white' },
  label: { marginVertical: 8 },
  city: { marginBottom: 8 },
  button: { marginTop: 16 },
  info: { marginTop: 24, fontWeight: '600' },
});
