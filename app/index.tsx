import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { Appbar, Card, Divider, Snackbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SessionFormModal } from '@/components/SessionFormModal';
import { createSession, listSessions, type Session } from '@/lib/sessions';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HomeScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState<string>(todayISO());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setSessions(await listSessions());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sessions');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sessionsByDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    for (const s of sessions) {
      (map[s.session_date] ??= []).push(s);
    }
    return map;
  }, [sessions]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = {};
    for (const date of Object.keys(sessionsByDate)) {
      marks[date] = { marked: true, dotColor: theme.colors.primary };
    }
    marks[selected] = {
      ...(marks[selected] ?? {}),
      selected: true,
      selectedColor: theme.colors.primary,
    };
    return marks;
  }, [sessionsByDate, selected, theme.colors.primary]);

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

  const sessionsForSelected = sessionsByDate[selected] ?? [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Tabletop Calendar" />
        <Appbar.Action
          icon="plus"
          accessibilityLabel="Add session"
          onPress={() => setModalOpen(true)}
        />
      </Appbar.Header>

      <Calendar
        current={selected}
        onDayPress={(day: DateData) => setSelected(day.dateString)}
        markedDates={markedDates}
        theme={calendarTheme}
      />

      <View style={styles.summary}>
        <Card mode="contained">
          <Card.Content>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Selected date
            </Text>
            <Text variant="titleLarge" style={styles.dateHeading}>
              {selected}
            </Text>
            {sessionsForSelected.length === 0 ? (
              <Text variant="bodyMedium" style={styles.placeholder}>
                No sessions scheduled. Tap + to add one.
              </Text>
            ) : (
              sessionsForSelected.map((s, idx) => (
                <View key={s.id}>
                  {idx > 0 ? <Divider style={styles.divider} /> : null}
                  <Text variant="titleMedium">{s.title}</Text>
                  {s.notes ? (
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
                    >
                      {s.notes}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </View>

      <SessionFormModal
        visible={modalOpen}
        date={selected}
        onDismiss={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await createSession(input);
          await refresh();
        }}
      />

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'Dismiss', onPress: () => setError(null) }}
      >
        {error ?? ''}
      </Snackbar>
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
  dateHeading: {
    marginBottom: 8,
  },
  placeholder: {
    opacity: 0.7,
  },
  divider: {
    marginVertical: 8,
  },
});
