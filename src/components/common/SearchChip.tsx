import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  search: string;
  onPickHistory: (search: string) => void;
};

export const SearchChip = ({ search, onPickHistory }: Props) => {
  return (
    <Chip
      key={search}
      icon="history"
      onPress={() => onPickHistory(search)}
      style={styles.chip}
      testID={`search-chip-${search}`}
    >
      {search}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginBottom: 8,
  },
});
