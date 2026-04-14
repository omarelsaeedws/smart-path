import { createContext } from 'react';

// Create and export the context object in its own file
// This satisfies React Fast Refresh which forbids mixing component exports (ThemeProvider)
// with non-component exports (ThemeContext) in the same file.
export const ThemeContext = createContext();
