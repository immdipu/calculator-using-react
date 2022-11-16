import { ACTIONS } from "./App";

import React from "react";

const OperationButtons = ({ dispatch, operation }) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};

export default OperationButtons;
