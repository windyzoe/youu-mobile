import React, { useEffect, useRef } from 'react';
import { useLockFn, usePersistFn } from 'ahooks';

const overflowScrollReg = /scroll|auto/i;

function isElement(node: HTMLElement) {
  const ELEMENT_NODE_TYPE = 1;
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE;
} 
// https://github.com/youzan/vant/issues/3823
function getScrollParent(el: HTMLDivElement, root = window) {
  let node: any = el;
  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode;
  }
  return root;
}

function isWindow(element: any) {
  return element === window;
}

export const InfiniteScroll: React.FC<{ hasMore: boolean; loadMore: Function; threshold?: number }> = ({
  children,
  hasMore,
  loadMore,
  threshold = 250,
}) => {
  const doLoadMore = useLockFn(async () => {
    await loadMore();
  });

  const elementRef = useRef<HTMLDivElement>(null);

  const check = usePersistFn(() => {
    if (!hasMore) return;
    const element = elementRef.current;
    if (!element) return;
    const parent = getScrollParent(element);
    if (!parent) return;
    const elementBottom = element?.getBoundingClientRect()?.bottom;
    const current = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom;
    if (current >= elementBottom - threshold) {
      doLoadMore();
    }
  });

  // 确保在内容不足时会自动触发加载事件
  useEffect(() => {
    check();
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const parent = getScrollParent(element);
    if (!parent) return;
    function onScroll() {
      check();
    }
    parent.addEventListener('scroll', onScroll);
    return () => {
      parent.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={elementRef}>
      {children}
      {!children && <>{hasMore ? <span>加载中</span> : <span>没有更多了</span>}</>}
    </div>
  );
};
