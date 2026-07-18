import React, { createContext, useContext } from 'react';
import type { LalaSpacing, StyleProp } from '../types';

export interface GridContextValue {
  columns: number;
  gap: StyleProp<LalaSpacing>;
  grow: boolean;
  overflow: 'visible' | 'hidden';
}

const GridCtx = createContext<GridContextValue>({
  columns: 12,
  gap: 'md',
  grow: false,
  overflow: 'visible',
});

export const GridProvider = GridCtx.Provider;
export const useGridContext = () => useContext(GridCtx);
