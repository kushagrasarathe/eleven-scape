import type { AppDispatch, RootState } from '@/types/redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Selector hooks for utilization
export const useAppStore = () => useAppSelector((state) => state.app);
