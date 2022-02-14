import React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { TabBar } from 'zarm';
import IconPro from '@/components/IconPro';
import { getRouterMap } from '@/common/router';
import styles from './BasicLayout.module.less';

const HelmetRoot: React.FC<{ pathname: string }> = React.memo(({ pathname }) => {
  const routerMap = getRouterMap();
  let currRouter = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in routerMap) {
    if (matchPath(key, pathname)) {
      currRouter = routerMap[key];
      break;
    }
  }
  let title = 'YouU-Zac Personal Mobile Template For React';
  if (currRouter?.name) {
    title = `${currRouter.name} - YouU`;
  }
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
});

const GlobalTabBar = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const changeUrl = (itemKey: string | number | undefined) => {
    navigate(itemKey as string);
  };
  return (
    <TabBar activeKey={pathname} onChange={changeUrl}>
      <TabBar.Item itemKey="/" title="主页" icon={<IconPro type="icon-shouye" />} />
      <TabBar.Item itemKey="/found" title="发现" icon={<IconPro type="icon-ziyuan" />} badge={{ shape: 'circle', text: '3' }} />
      <TabBar.Item itemKey="/me" title="我的" icon={<IconPro type="icon-wode" />} badge={{ shape: 'dot' }} />
    </TabBar>
  );
});

const BasicLayout = () => {
  const location = useLocation();
  console.log('%c 🚀 xuzh BasicLayout', 'color: red; font-size: 18px;', 'render');
  return (
    <>
      <HelmetRoot pathname={location?.pathname} />
      <div className={styles.layout}>
        <Outlet />
      </div>
      <GlobalTabBar />
    </>
  );
};

export default BasicLayout;
