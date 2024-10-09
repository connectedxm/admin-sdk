import {
  ConnectedXMClientContext,
  ConnectedXMClientContextState,
} from "@src/ConnectedXMProvider";
import React from "react";

/**
 * @category Hooks
 */
export const useConnectedXM = () => {
  const context = React.useContext<ConnectedXMClientContextState>(
    ConnectedXMClientContext
  );

  if (!context) {
    throw new Error("useConnectedXM must be used within a ConnectedXMProvider");
  }

  return context;
};
