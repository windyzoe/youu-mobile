import React, { useReducer, useContext, useMemo } from 'react';
import StoreContext, { DEFAULT_STATE } from './store';

// ------封装一下useContext------

const useGlobalData = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};
export { useGlobalData };

export interface Action {
  type: string;
  payload: any;
}

// ------Reducer--------
const RootReducer = (state: any, action: Action) => {
  switch (action.type) {
    case 'changeData':
      return { ...state, ...action.payload };
    default:
      break;
  }
  return state;
};

const StoreRoot: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(RootReducer, DEFAULT_STATE);
  const store = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreRoot;
