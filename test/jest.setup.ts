jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  return Reanimated;
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Image = ({ style }: any) =>
    React.createElement(View, {
      style,
      accessibilityRole: "image",
      testID: "recipe-image",
    });
  return { Image, default: Image };
});

// (opcjonalnie) jeśli coś wciąga `expo` i odpala winter runtime
jest.mock("expo", () => ({}));

// Wycisz znane warningi
const originalError = console.error;
console.error = (...args: any[]) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("useNativeDriver") || msg.includes("Animated")) return;
  originalError(...args);
};
