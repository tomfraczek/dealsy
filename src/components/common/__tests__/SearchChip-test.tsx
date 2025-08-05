import { SearchChip } from "@/src/components/common/SearchChip";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("<SearchChip />", () => {
  test("renders chip with label", () => {
    render(<SearchChip search="pizza" onPickHistory={() => {}} />);
    expect(screen.getByText("pizza")).toBeTruthy();
  });

  test("calls onPickHistory when pressed", () => {
    const onPickHistory = jest.fn();
    render(<SearchChip search="pasta" onPickHistory={onPickHistory} />);

    const byRole = screen.queryByRole?.("button", { name: "pasta" });
    if (byRole) {
      fireEvent.press(byRole);
    } else {
      fireEvent.press(screen.getByText("pasta"));
    }

    expect(onPickHistory).toHaveBeenCalledTimes(1);
    expect(onPickHistory).toHaveBeenCalledWith("pasta");
  });
});
