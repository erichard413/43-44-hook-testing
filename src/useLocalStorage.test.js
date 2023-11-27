import { afterEach, describe, expect, it } from "vitest";
import { render, screen, renderHook, act } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { useLocalStorage } from "./useLocalStorage";

// 1. Test the following features of the `useLocalStorage` hook:
//    - Ensure the initial value passed to the `useLocalStorage` hook is stored in `localStorage`. This should also work with passing a function to `useLocalStorage` as well.
//    - Ensure `localStorage` is updated whenever `setValue` is called.
//    - Ensure `localStorage` is cleared whenever `setValue` is called with undefined.
//    - Ensure `useLocalStorage` uses the value from `localStorage` if it exists instead of the initial value passed to `useLocalStorage`.

describe("#useLocalStorage", () => {
  function renderLocalStorageHook(key, initialValue) {
    return renderHook(
      ({ key, initialValue }) => useLocalStorage(key, initialValue),
      {
        initialProps: { key, initialValue },
      }
    );
  }
  it("Should store initial value passed to `useLocalStorage` hook in `localStorage`", async () => {
    const key = "key";
    const initialValue = "initial";
    const { result } = renderLocalStorageHook(key, initialValue);
    //The useLocalStorage hook returns an array of [val, setVal], so check to see if VALUE is updated to initialValue.
    expect(result.current[0]).toBe(initialValue);
    //Check to see if local storage was stored.
    expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue));
  });
  it("Should store initial value passed as a function to `useLocalStorage` hook in `localStorage`", async () => {
    const key = "key";
    const initialValue = "initial";
    const { result } = renderLocalStorageHook(key, () => initialValue);
    //The useLocalStorage hook returns an array of [val, setVal], so check to see if VALUE is updated to initialValue.
    expect(result.current[0]).toBe(initialValue);
    //Check to see if local storage was stored.
    expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue));
  });
  it("should update localStorage when setValue is called", () => {
    const key = "key";
    const initialValue = "initial";
    const { result } = renderLocalStorageHook(key, initialValue);
    const newValue = "new";
    //setting value in hook. wrapped in act function to wait for state variables to change
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });
  it("should clear localStorage when setValue is called with undefined", () => {
    const key = "key";
    const initialValue = "initial";
    const { result } = renderLocalStorageHook(key, initialValue);

    //setting value in hook. wrapped in act function to wait for state variables to change
    act(() => {
      result.current[1](undefined);
    });

    expect(result.current[0]).toBeUndefined();
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("Should use the value in local storage if it exists", async () => {
    const key = "key";
    const initialValue = "initial";
    const existingValue = "existing";
    localStorage.setItem(key, JSON.stringify(existingValue));
    const { result } = renderLocalStorageHook(key, () => initialValue);
    //The useLocalStorage hook returns an array of [val, setVal], so check to see if VALUE is updated to initialValue.
    expect(result.current[0]).toBe(existingValue);
    //Check to see if local storage was stored.
    expect(localStorage.getItem(key)).toBe(JSON.stringify(existingValue));
  });

  afterEach(() => {
    localStorage.clear();
  });
});
