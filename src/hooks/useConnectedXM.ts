import {
  ConnectedXMClientContext,
  ConnectedXMClientContextState,
} from "@src/ConnectedXMProvider";
import React from "react";

export const useConnectedXM = () => {
  const context = React.useContext<ConnectedXMClientContextState>(
    ConnectedXMClientContext
  );

  if (!context) {
    throw new Error("useConnectedXM must be used within a ConnectedXMProvider");
  }

  return context;
};
