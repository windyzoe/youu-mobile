import { pathToRegexp } from 'path-to-regexp';
import { urlToList } from '@/components/_utils/pathTools';
import { isUrl } from '../utils/utils';

export interface MenuRoute {
  name?: string;
  icon?: string;
  path: string;
  pathPattern?: string;
  element: React.ReactNode;
  authority: undefined | string | string[] | null;
  children?: MenuRoute[];
}

let menuDataCache: MenuRoute[];
let allMenuKeys: string[];
export const redirectData: { from: string; to: string }[] = [];

/**
 * 获取重定向
 * @param {MenuRoute} item
 */
const getRedirect = (item: MenuRoute) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].pathPattern) {
      redirectData.push({
        from: `${item.pathPattern}`,
        to: `${item.children[0].pathPattern}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

/**
 * 获取所有的pathPattern
 * @param menu
 * @returns
 */
export const getAllKeys = (menu: MenuRoute[]): string[] => {
  if (allMenuKeys) return allMenuKeys;
  return menu.reduce((keys: string[], item) => {
    keys.push(item.pathPattern as string);
    if (item.children) {
      return keys.concat(getAllKeys(item.children as MenuRoute[]));
    }
    return keys;
  }, []);
};

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (pathname: string) => {
  const paths: string[] = urlToList(pathname);
  return paths.reduce(
    (matchKeys: string[], path) => matchKeys.concat(allMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );
};

// 扁平化menudata
export function getFlatPathPatternMap(data: MenuRoute[]) {
  let keys: { [propName: string]: MenuRoute } = {};
  data.forEach(item => {
    if (item.children) {
      keys[item.pathPattern as string] = { ...item };
      keys = { ...keys, ...getFlatPathPatternMap(item.children) };
    } else {
      keys[item.pathPattern as string] = { ...item };
    }
  });
  return keys;
}

// 优化架构,添加level和key字段
// key: list上一级example=>/example/list
export function formatStructure(data: MenuRoute[], parentPath = '/', level = 1) {
  return data.map(item => {
    const { path } = item;
    let pathPattern = path;
    // 支持直接的http的url
    if (!isUrl(pathPattern)) {
      pathPattern = parentPath + path;
    }
    const result = {
      ...item,
      pathPattern,
      level,
    };
    if (item.children) {
      const newParentPath = pathPattern === '/' ? '/' : `${pathPattern}/`;
      result.children = formatStructure(item.children, newParentPath, level + 1);
    }
    return result;
  });
}

// 显式传入就重新设置menuData,防止重新登陆的权限没刷新
export const getMenuData = (menuData: MenuRoute[]) => {
  if (menuDataCache && !menuData) {
    return menuDataCache;
  }
  if (Array.isArray(menuData) && menuData.length > 0) {
    menuDataCache = formatStructure(menuData);
    // 生成所有的menuKey
    allMenuKeys = getAllKeys(menuDataCache);
    // 生成所有菜单重定向
    menuDataCache.forEach(getRedirect);
    return menuDataCache;
  }
  return [];
};

/**
 * 菜单后端实际结构示例,与ReactRouter的配置一致
 */
export const exampleMenuData = [
  {
    name: '样例',
    icon: 'example',
    path: 'example',
    children: [
      {
        name: '列表',
        path: 'list',
        // authority:[""], //什么角色可以看
      },
    ],
  },
  {
    name: '菜单一级',
    icon: 'example',
    path: '1',
    children: [
      {
        name: '菜单二级',
        icon: 'example',
        path: '2',
      },
      {
        name: '菜单二',
        icon: 'example',
        path: '22',
        children: [
          {
            name: '菜单三级',
            icon: 'example',
            path: '33',
          },
          {
            name: '菜单三级',
            icon: 'example',
            path: '333',
          },
          {
            name: '菜单三级',
            icon: 'example',
            path: '3',
          },
        ],
      },
    ],
  },
];
