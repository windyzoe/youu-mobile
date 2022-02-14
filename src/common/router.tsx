import { lazy, Suspense } from 'react';
import { StaticLoading } from '@/components/PageLoading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getMenuData, exampleMenuData, formatStructure, getFlatPathPatternMap, MenuRoute } from './menu';

/**
 * 路由处理
 * 1 动态加载路径\组件\modal
 * 2 结构化路由,整合成一个<Router>组件可用的数据结构
 */

// 路由和menu整合的缓存,因为路由只需要计算一次
let routerDataCache: MenuRoute[];
// router数据的map形式,key是pathPattern
let routerMapCache: { [propName: string]: MenuRoute };

/**
 * @description 动态引入路由组件,使用lazy
 * @param {*} component 组件
 */
const dynamicWrapper = (component: any) => {
  const Component = lazy(component);
  return (
    // 懒加载
    <ErrorBoundary>
      <Suspense fallback={<StaticLoading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// 实际的路由设置,目前完全按照react-router的配置
export const routerConfig = [
  {
    path: '/',
    element: dynamicWrapper(() => import('../layouts/BasicLayout')),
    children: [
      {
        index: true,
        element: dynamicWrapper(() => import('../routes/Home/Home')),
        // name: '工作台',
        // authority: 'admin',
      },
      {
        path: 'me',
        element: dynamicWrapper(() => import('../routes/Me/Me')),
        name: '我的',
      },
      {
        path: 'found',
        element: dynamicWrapper(() => import('../routes/Found/Found')),
        name: '发现',
      },
      {
        path: 'exception/404',
        element: dynamicWrapper(() => import('../routes/Exception/404')),
        name: '404',
      },
      {
        path: 'exception/todo',
        element: dynamicWrapper(() => import('../routes/Exception/Todo')),
        name: '建设中',
      },
      {
        path: 'exception/403',
        element: dynamicWrapper(() => import('../routes/Exception/403')),
        name: '403',
      },
      {
        path: '*',
        element: dynamicWrapper(() => import('../routes/Exception/Todo')),
        name: '建设中',
      },
    ],
  },
  // 登陆
  {
    path: '/user/login',
    element: dynamicWrapper(() => import('../routes/User/Login')),
  },
];

/**
 * 把路由数据和菜单数据整合起来
 * @param routerDataOrigin 路由对象
 * @param menuMap menu对象的map形式
 * @returns
 */
const generateRoutersWithMenu = (
  routerDataOrigin: MenuRoute[],
  menuMap: {
    [propName: string]: MenuRoute;
  }
) => {
  return routerDataOrigin.map(routeItem => {
    const menuItem = menuMap[routeItem.pathPattern as string];
    const result = {
      ...routeItem,
      name: routeItem.name || menuItem?.name,
      authority: routeItem.authority || menuItem?.authority,
    };
    if (routeItem.children) {
      result.children = generateRoutersWithMenu(routeItem.children, menuMap);
    }
    return result;
  });
};

/**
 * 获取路由对象,路由对象要和菜单数据匹配,原因很简单,大量的权限配置,icon\name配置应该放在后端做成配置项
 * @returns 一个可用的路由对象
 */
export const getRouterData = () => {
  if (routerDataCache) {
    return routerDataCache;
  }
  // 从menudata获取一些路由的配置name,authority,hideInBreadcrumb等,或者直接在routerConfig配置也成
  const menuDataOrigin = getMenuData(exampleMenuData as MenuRoute[]);
  const menuMap = getFlatPathPatternMap(menuDataOrigin);
  const routerDataOrigin = formatStructure(routerConfig as MenuRoute[], '');
  // 路由和菜单互相做匹配,整合成一个routeData,注意,这个是用路径去撞menu
  const routerData = generateRoutersWithMenu(routerDataOrigin, menuMap);
  if (Array.isArray(menuDataOrigin) && menuDataOrigin.length > 0) {
    routerDataCache = routerData;
    routerMapCache = getFlatPathPatternMap(routerData);
  }
  console.log('%c getRouterData', 'color: red; font-size: 24px;', routerData);
  return routerData;
};

export const getRouterMap = () => {
  return routerMapCache;
};
