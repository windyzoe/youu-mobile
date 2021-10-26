import React, { createElement } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import loadable from '@loadable/component';
import { StaticLoading } from '@/components/PageLoading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getMenuData } from './menu';

/**
 * 路由处理
 * 1 动态加载路径\组件\modal
 * 2 结构化路由,整合成一个<Router>组件可用的数据结构
 */

// 路由和menu整合的缓存,因为路由只需要计算一次
let routerDataCache;
// 路由配置缓存
let routerConfigCache;

/**
 * @description 动态引入路由组件
 * @param {*} component 组件
 */
const dynamicWrapper = component => {
  // 1---() => require('module')
  // 如果是用 babel-plugin-dynamic-import-node-sync,import会全转化为require,结果是动态加载禁用
  // 判断方式是判断组件有没有".then"
  // 把routerData放入每个页面组件的props里
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      return (
        <ErrorBoundary>
          {createElement(component().default, {
            ...props,
          })}
        </ErrorBoundary>
      );
    };
  }
  // 2---() => import('module') 动态加载走的分支
  // 把routerData放入每个页面组件的props里
  return loadable(
    () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props => (
          <ErrorBoundary>
            {createElement(Component, {
              ...props,
            })}
          </ErrorBoundary>
        );
      });
    },
    {
      fallback: <StaticLoading />,
    },
  );
};

// 扁平化menudata
function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function findMenuKey(menuData, path) {
  const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key));
  if (menuKey == null) {
    if (path === '/') {
      return null;
    }
    const lastIdx = path.lastIndexOf('/');
    if (lastIdx < 0) {
      return null;
    }
    if (lastIdx === 0) {
      return findMenuKey(menuData, '/');
    }
    // 如果没有，使用上一层的配置
    return findMenuKey(menuData, path.substr(0, lastIdx));
  }
  return menuKey;
}

export const routerConfig = () => {
  if (routerConfigCache) {
    return routerConfigCache;
  }
  const routers = {
    '/': {
      component: dynamicWrapper(() => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper(() => import('../routes/Home/Home')),
      // name: '工作台',
      // authority: 'admin',
    },
    '/me': {
      component: dynamicWrapper(() => import('../routes/Me/Me')),
    },
    '/found': {
      component: dynamicWrapper(() => import('../routes/Found/Found')),
    },
    // 登陆
    '/user/login': {
      component: dynamicWrapper(() => import('../routes/User/Login')),
    },
    '/exception/404': {
      component: dynamicWrapper(() => import('../routes/Exception/404')),
      name: '404',
    },
    '/exception/403': {
      component: dynamicWrapper(() => import('../routes/Exception/403')),
      name: '403',
    },
    '/exception/todo': {
      component: dynamicWrapper(() => import('../routes/Exception/Todo')),
      name: '建设中',
    },
  };
  routerConfigCache = routers;
  return routerConfigCache;
};

// 最核心的路由配置页面,注意要在此处配置路由哦
export const getRouterData = () => {
  if (routerDataCache) {
    return routerDataCache;
  }
  // 从menudata获取一些路由的配置name,authority,hideInBreadcrumb等,或者直接在routerConfig配置也成
  const menuDataOrigin = getMenuData();
  const menuData = getFlatMenuData(getMenuData());
  // 路由数据 {name,authority ...routerConfig }
  const routerData = {};
  // 路由和菜单互相做匹配,整合成一个routeData,注意,这个是用路径去撞menu
  Object.keys(routerConfig()).forEach(path => {
    // 通过正则匹配router的路径和menu的路径, eg.  router /user/:id === /user/chen
    let menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(`${key}`));
    const inherited = menuKey == null;
    if (menuKey == null) {
      menuKey = findMenuKey(menuData, path);
    }
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig()[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      isEnable: menuItem.isEnable,
      inherited,
    };
    routerData[path] = router;
  });
  if (Array.isArray(menuDataOrigin) && menuDataOrigin.length > 0) {
    routerDataCache = routerData;
  }
  console.log('%c getRouterData', 'color: red; font-size: 24px;', routerData);
  return routerData;
};
