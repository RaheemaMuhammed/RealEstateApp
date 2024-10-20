import { rootReducer } from './store';  // Import from the store.js file

// Define the RootState type for TypeScript components
export type RootState = ReturnType<typeof rootReducer>;
