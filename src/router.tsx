import { useState } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'zarm';
import { useMount } from 'ahooks';
import { Theme } from 'zarm/types/config-provider/PropsType';
import { initI18n, getLocale } from '@/i18n';
import StoreContext, { useGlobalData } from '@/components/StoreContext';
import { getRouterData } from './common/router';
import 'zarm/dist/zarm.css';

const RouterConfig = () => {
  return useRoutes(getRouterData());
};

const Root = () => {
  const [isReady, setReady] = useState(false);
  const { state } = useGlobalData();
  useMount(() => {
    initI18n().then(() => setReady(true));
  });
  return (
    <ConfigProvider locale={getLocale()} theme={state.theme as Theme}>
      <StoreContext>
        <BrowserRouter>{isReady ? <RouterConfig /> : <div />}</BrowserRouter>
      </StoreContext>
    </ConfigProvider>
  );
};

export default Root;
