import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text, useTheme } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

export default function ProductsScreen() {
  const { products, hydrated } = useApp();
  const theme = useTheme();
  if (!hydrated) return <View style={styles.center}><Text>Cargando datos locales...</Text></View>;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Tus productos</Text>
        <Text style={styles.subtitle}>Crea productos y reutilízalos en tus pedidos.</Text>
        {!products.length && <Card style={styles.card}><Card.Content><Text>Aún no tienes productos.</Text><Button onPress={() => router.push('/product/new')}>Crear el primero</Button></Card.Content></Card>}
        {products.map((product) => (
          <Card key={product.id} style={styles.card}>
            {product.photos?.[0] && <Card.Cover source={{ uri: product.photos[0] }} />}
            <Card.Title title={product.name} subtitle={product.description} />
            <Card.Actions><Button mode="contained" onPress={() => router.push({ pathname: '/order/new', params: { productId: product.id } })}>Crear pedido</Button></Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <FAB icon="plus" color="white" style={[styles.fab, { backgroundColor: theme.colors.primary }]} onPress={() => router.push('/product/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700' },
  subtitle: { marginTop: 4, marginBottom: 16, color: '#52606d' },
  card: { marginBottom: 12, backgroundColor: 'white' },
  fab: { position: 'absolute', right: 20, bottom: 20 },
});
