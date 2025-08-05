import { Stack } from "expo-router";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { ReactQueryProvider } from "../context/ReactQueryProvider";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export default function RootLayout() {
  return (
    <ReactQueryProvider>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </ReactQueryProvider>
  );
}
