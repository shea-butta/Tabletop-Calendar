import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';

import type { NewSession } from '@/lib/sessions';

type Props = {
  visible: boolean;
  date: string;
  onDismiss: () => void;
  onSubmit: (input: NewSession) => Promise<void>;
};

export function SessionFormModal({ visible, date, onDismiss, onSubmit }: Props) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setTitle('');
      setNotes('');
      setError(null);
      setSaving(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        notes: notes.trim() || null,
        session_date: date,
      });
      onDismiss();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save session');
      setSaving(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="titleLarge" style={styles.heading}>
          New session
        </Text>
        <Text variant="bodyMedium" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
          {date}
        </Text>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.field}
          autoFocus
        />
        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.field}
        />
        {error ? (
          <Text variant="bodySmall" style={{ color: theme.colors.error, marginBottom: 8 }}>
            {error}
          </Text>
        ) : null}
        <View style={styles.actions}>
          <Button onPress={onDismiss} disabled={saving}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={saving}
            disabled={!title.trim() || saving}
          >
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 24,
    padding: 24,
    borderRadius: 16,
  },
  heading: {
    marginBottom: 4,
  },
  date: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
});
