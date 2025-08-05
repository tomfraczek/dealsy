import { CollapsibleSearch } from "@/src/components/common/CollapsibleSearch";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { act } from "react-test-renderer";

describe("<CollapsibleSearch />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const baseProps = () => {
    const onToggle = jest.fn();
    const setSearchQuery = jest.fn();
    const onSearch = jest.fn();
    const onClear = jest.fn();
    const onPickHistory = jest.fn();

    return {
      expanded: true,
      onToggle,
      searchQuery: "",
      setSearchQuery,
      onSearch,
      onClear,
      isSearching: false,
      lastSearches: [],
      onPickHistory,
    };
  };

  test("renders searchbar and button", () => {
    const props = baseProps();
    render(<CollapsibleSearch {...props} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByPlaceholderText("Search recipes...")).toBeTruthy();
    expect(screen.getByText("Search")).toBeTruthy();
  });

  test("typing in searchbar calls setSearchQuery", () => {
    const props = baseProps();
    render(<CollapsibleSearch {...props} />);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.changeText(
      screen.getByPlaceholderText("Search recipes..."),
      "chicken"
    );
    expect(props.setSearchQuery).toHaveBeenCalledWith("chicken");
  });

  test("pressing Search button calls onSearch", () => {
    const props = baseProps();
    render(<CollapsibleSearch {...props} />);
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.press(screen.getByText("Search"));
    expect(props.onSearch).toHaveBeenCalledTimes(1);
  });

  test('shows "Searching…" when isSearching is true', () => {
    const props = { ...baseProps(), isSearching: true };
    render(<CollapsibleSearch {...props} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Searching…")).toBeTruthy();
  });

  test("renders lastSearches chips and calls onPickHistory on press", () => {
    const props = {
      ...baseProps(),
      lastSearches: ["pizza", "pasta", "ramen"],
    };
    render(<CollapsibleSearch {...props} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText("Recent searches")).toBeTruthy();
    expect(screen.getByText("pizza")).toBeTruthy();
    expect(screen.getByText("pasta")).toBeTruthy();
    expect(screen.getByText("ramen")).toBeTruthy();

    fireEvent.press(screen.getByText("pasta"));
    expect(props.onPickHistory).toHaveBeenCalledWith("pasta");
  });
});
