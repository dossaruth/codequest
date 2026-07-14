import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>MVP Mobile</Text>
      </View>
      <Text style={styles.title}>CodeQuest</Text>
      <Text style={styles.subtitle}>
        Apprendre, s'evaluer et progresser vers la reussite du code de la route.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    backgroundColor: '#D9F99D',
    borderRadius: 6,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#31511E',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 17,
    lineHeight: 24,
    maxWidth: 320,
    textAlign: 'center',
  },
});
