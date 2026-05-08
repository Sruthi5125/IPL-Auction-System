// GlobalState.js

import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
    selectedPlayer: JSON.parse(localStorage.getItem("selectedPlayer")) || null,
  };
  
  // Reducer function
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_SELECTED_PLAYER":
        localStorage.setItem("selectedPlayer", JSON.stringify(action.payload));  // Persist in local storage
        return { ...state, selectedPlayer: action.payload };
      case "CLEAR_SELECTED_PLAYER":
        localStorage.removeItem("selectedPlayer");
        return { ...state, selectedPlayer: null };
      default:
        return state;
    }
  };

// Context setup
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);