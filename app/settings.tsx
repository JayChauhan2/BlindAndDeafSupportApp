import { SettingsButton } from '@/components/SettingsButton';
import { View } from '@/components/Themed';
import { ScrollView, StyleSheet, Text } from 'react-native';
export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.section}>
        <Text style={styles.headingTitle}>
            Personalization
        </Text>
        
        <SettingsButton link="/aboutyou" title="About You" subtitle="Update your personal information"/>
        <SettingsButton title="About your AI" subtitle="Customize your AI's traits"/>
      </View>
      <View style={styles.section}>
      <Text style={styles.headingTitle}>
            asiuhdiaushd
      </Text>
      <SettingsButton title="Title" subtitle="Subtitle"/>
      </View>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  headingTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  scrollView: {
    paddingTop: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'red',
  },
});
