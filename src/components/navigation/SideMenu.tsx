import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/theme';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

function MenuItem({
  icon,
  label,
  onPress,
  color = colors.textPrimary,
}: MenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={color}
      />

      <AppText color={color} style={styles.menuLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function SideMenu({
  visible,
  onClose,
}: SideMenuProps) {
  const router = useRouter();

  function navigateToDashboard() {
    onClose();
    router.replace('/(private)/dashboard');
  }

  function navigateToStatement() {
    onClose();
    router.push('/(private)/extrato');
  }

  function navigateToNewTransaction() {
    onClose();
    router.push('/(private)/transacao/nova');
  }

  function handleLogout() {
    onClose();
    router.replace('/(auth)/cadastro');
  }

  function navigateToAnalysis() {
  onClose();
  router.push('/(private)/analise');
}

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
          onPress={onClose}
          style={styles.overlay}
        />

        <View style={styles.drawer}>
          <View style={styles.header}>
            <View>
              <AppText variant="headline">
                Finance Mobile
              </AppText>

              <AppText
                color={colors.textSecondary}
                style={styles.subtitle}
              >
                Menu principal
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar menu"
              hitSlop={12}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="close-outline"
                size={28}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

         <View style={styles.navigation}>
          <MenuItem
            icon="home-outline"
            label="Início"
            onPress={navigateToDashboard}
          />

          <MenuItem
            icon="receipt-outline"
            label="Extrato"
            onPress={navigateToStatement}
          />

          <MenuItem
            icon="stats-chart-outline"
            label="Análise financeira"
            onPress={navigateToAnalysis}
          />

          <MenuItem
            icon="add-circle-outline"
            label="Nova transação"
            onPress={navigateToNewTransaction}
          />
        </View>
          <View style={styles.footer}>
            <MenuItem
              icon="log-out-outline"
              label="Sair"
              color={colors.expense}
              onPress={handleLogout}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },

  drawer: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },

  subtitle: {
    marginTop: 4,
  },

  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navigation: {
    flex: 1,
    marginTop: 24,
    gap: 8,
  },

  menuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  menuLabel: {
    marginLeft: 14,
  },

  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },

  pressed: {
    opacity: 0.65,
  },
});