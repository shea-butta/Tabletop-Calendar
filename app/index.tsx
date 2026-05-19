import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { Appbar, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState<string>(todayISO());

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: theme.colors.background,
      calendarBackground: theme.colors.background,
      textSectionTitleColor: theme.colors.onSurfaceVariant,
      selectedDayBackgroundColor: theme.colors.primary,
      selectedDayTextColor: theme.colors.onPrimary,
      todayTextColor: theme.colors.primary,
      dayTextColor: theme.colors.onSurface,
      textDisabledColor: theme.colors.surfaceDisabled,
      monthTextColor: theme.colors.onSurface,
      arrowColor: theme.colors.primary,
    }),
    [theme]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Tabletop Calendar" />
        <Appbar.Action icon="plus" accessibilityLabel="Add event" onPress={() => {}} />
      </Appbar.Header>

      <Calendar
        current={selected}
        onDayPress={(day: DateData) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, selectedColor: theme.colors.primary },
        }}
        theme={calendarTheme}
      />

      <View style={styles.summary}>
        <Card mode="contained">
          <Card.Content>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Selected date
            </Text>
            <Text variant="titleLarge">{selected}</Text>
            <Text variant="bodyMedium" style={styles.placeholder}>
              No sessions scheduled. Tap + to add one.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    padding: 16,
  },
  placeholder: {
    marginTop: 8,
    opacity: 0.7,
  },
});
