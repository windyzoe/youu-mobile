import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConfigProvider } from 'zarm';
import { useMount } from 'ahooks';
import { Theme } from 'zarm/types/config-provider/PropsType';
import { initI18n, getLocale } from '@/i18n';
import StoreContext, { useGlobalData } from '@/components/StoreContext';
import Authorized from '@/utils/Authorized';
import { routerConfig } from './common/router';
import 'zarm/dist/zarm.css';


const { AuthorizedRoute } = Authorized;

const RouterConfig: React.FC<{}> = () => {
  const [isReady, setReady] = useState(false);
  const { state } = useGlobalData();
  useMount(() => {
    initI18n().then(() => setReady(true));
  });

  if (!isReady) return null;
  const routerData = routerConfig();
  const UserLogin = routerData['/user/login'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <ConfigProvider locale={getLocale()} theme={state.theme as Theme}>
      <Router>
        <Switch>
          <Route path="/user/login" component={UserLogin} />
          <Route path="/" render={prop => <BasicLayout {...prop} />} />
        </Switch>
      </Router>
    </ConfigProvider>
  );
};

const Root = () => {
  return (
    <StoreContext>
      <RouterConfig />
    </StoreContext>
  );
};

export default Root;
