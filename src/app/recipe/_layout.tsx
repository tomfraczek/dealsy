import { HeaderBackButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";

export default function QuoteLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Recipe",
          headerLeft: () => <HeaderBackButton onPress={() => router.back()} />,
        }}
      />
    </Stack>
  );
}
