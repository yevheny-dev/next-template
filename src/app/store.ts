import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore } from 'redux-persist';

import { persistedTokenSaleReducer } from '@/widgets/sale/model/persisted';
import { saleApi } from '@/widgets/sale/utils/api';

import { gtmMainMetaReducer, gtmMainMiddleware } from './analytics/gtag';

const rootReducer = combineReducers({
  sale: persistedTokenSaleReducer,
  gaMainMeta: gtmMainMetaReducer,
  [saleApi.reducerPath]: saleApi.reducer,
});

export const setupStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }).concat(
        saleApi.middleware,
        gtmMainMiddleware,
      ),
  });
  const persistor = persistStore(store);
  return { persistor, store };
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// @ts-ignore
export type AppDispatch = AppStore['dispatch'];
