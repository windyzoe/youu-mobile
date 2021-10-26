import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Redirect, Route, useLocation, useHistory } from 'react-router-dom';
import _ from 'lodash';
import { Icon, TabBar, Panel } from 'zarm';
import { pathToRegexp } from 'path-to-regexp';
import IconPro from '@/components/IconPro';
import Authorized from '@/utils/Authorized';
import { getRouterData } from '@/common/router';
import { getRoutes } from '../utils/utils';
import { getMenuData, redirectData } from '../common/menu';
import styles from './BasicLayout.less';

const { AuthorizedRoute, check } = Authorized;

export default class BasicLayout extends React.Component {
  getBaseRedirect = () => {
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const routerData = getRouterData();
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(item => check(routerData[item].authority, item) && item !== '/');
      return authorizedPath;
    }
    return redirect;
  };

  render() {
    const baseRedirect = this.getBaseRedirect();
    const { location } = this.props;
    return (
      <>
        <HelmetRoot pathname={location?.pathname} />
        <div className={styles.layout}>
          <Switch>
            {redirectData.map(item => (
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            ))}
            {getRoutes('/', getRouterData()).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            ))}
            <Redirect exact from="/" to={baseRedirect} />
            <Route render={() => <div>404，当前页面不存在，随风飘去了远方...</div>} />
          </Switch>
        </div>
        <GlobalTabBar />
      </>
    );
  }
}

const HelmetRoot = React.memo(({ pathname }) => {
  const getPageTitle = () => {
    let title = 'YouU-Zac Personal Mobile Template For React';
    const routerData = getRouterData();
    let currRouterData = null;
    // match params path
    for (const key in routerData) {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
        break;
      }
    }
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - YouU`;
    }
    return title;
  };
  return (
    <Helmet>
      <title>{getPageTitle()}</title>
    </Helmet>
  );
});

const GlobalTabBar = React.memo(() => {
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;
  const changeUrl = itemKey => {
    history.push(itemKey);
  };
  return (
    <TabBar activeKey={pathname} onChange={changeUrl}>
      <TabBar.Item itemKey="/home" title="主页" icon={<IconPro type="icon-shouye" />} />
      <TabBar.Item itemKey="/found" title="发现" icon={<IconPro type="icon-ziyuan" />} badge={{ shape: 'circle', text: '3' }} />
      <TabBar.Item itemKey="/me" title="我的" icon={<IconPro type="icon-wode" />} badge={{ shape: 'dot' }} />
    </TabBar>
  );
});
