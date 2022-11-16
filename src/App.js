
import { useReducer } from 'react';
import DigitButtons from './DigitButtons';
import OperationButtons from './OperationButtons';


export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  OPERATION: "operation",
  DELETE: "delete",
  CLEAR: "clear",
  EVALUATE: "evaluate"

}


function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }


    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) return { ...state, currentOperand: null }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)

      }

    case ACTIONS.OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOperand == null ||
        state.currentOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    default:
      return state


  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "÷":
      computation = prev / current
      break
    case "*":
      computation = prev * current
      break

    default:
      computation = ""

  }

  return computation.toString()
}


function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <>
      <div className="grid grid-cols-[repeat(4,6rem)] grid-rows-[minmax(7rem,auto)repeat(5,6rem)] justify-center mt-3">
        <div className="output col-span-full bg-gray-900 flex flex-col items-end justify-around">
          <div className="previousOperand text-white">{previousOperand}{operation}</div>
          <div className="currentOperand text-white">{currentOperand}</div>
        </div>
        <button className="col-span-2" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
        <OperationButtons operation="÷" dispatch={dispatch} />
        <DigitButtons digit="1" dispatch={dispatch} />
        <DigitButtons digit="2" dispatch={dispatch} />
        <DigitButtons digit="3" dispatch={dispatch} />
        <OperationButtons operation="*" dispatch={dispatch} />
        <DigitButtons digit="4" dispatch={dispatch} />
        <DigitButtons digit="5" dispatch={dispatch} />
        <DigitButtons digit="6" dispatch={dispatch} />
        <OperationButtons operation="+" dispatch={dispatch} />
        <DigitButtons digit="7" dispatch={dispatch} />
        <DigitButtons digit="8" dispatch={dispatch} />
        <DigitButtons digit="9" dispatch={dispatch} />
        <OperationButtons operation="-" dispatch={dispatch} />
        <DigitButtons digit="." dispatch={dispatch} />
        <DigitButtons digit="0" dispatch={dispatch} />
        <button className="col-span-2" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  );
}

export default App;
