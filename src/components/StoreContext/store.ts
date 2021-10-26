import { createContext } from 'react';

export interface State {
  theme: string;
}

export const DEFAULT_STATE = {
  theme: localStorage.theme || 'light',
};
const StoreContext = createContext<{ state: State; dispatch: any }>({
  state: DEFAULT_STATE, // Your default state.
  dispatch: () => {}, // Stubbed. Will be replaced.
});

export default StoreContext;
