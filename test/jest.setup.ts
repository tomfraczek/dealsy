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

jest.mock("expo", () => ({}));
