export const isDocumentScrollContainer = container => {
  return !container || container === document.body || container === document.documentElement || container === document.scrollingElement;
};

export const getViewportRect = () => {
  const visualViewport = window.visualViewport;
  if (visualViewport) {
    return {
      top: visualViewport.offsetTop,
      bottom: visualViewport.offsetTop + visualViewport.height,
      left: visualViewport.offsetLeft,
      right: visualViewport.offsetLeft + visualViewport.width,
      height: visualViewport.height
    };
  }
  return {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    height: window.innerHeight
  };
};

/** 仅以真实横向溢出为准，避免 overflow:auto 空容器误命中 */
export const isHorizontallyOverflowing = element => {
  return !!element && element.scrollWidth > element.clientWidth + 1;
};

/**
 * 默认查找横向滚动节点：优先 ant Design Table 滚动容器，其次容器内真实横向溢出的子节点，最后回退到 root。
 * 不调用 getComputedStyle，避免大树扫描时的样式计算开销。
 */
export const getDefaultScrollElement = root => {
  if (!root) {
    return null;
  }
  const tableScroll = root.querySelector('.ant-table-body') || root.querySelector('.ant-table-content');
  // 表格节点即使尚未溢出也优先绑定，便于异步列宽/数据到位后立即生效
  if (tableScroll) {
    return tableScroll;
  }
  const candidates = root.querySelectorAll('*');
  for (let i = 0; i < candidates.length; i += 1) {
    if (isHorizontallyOverflowing(candidates[i])) {
      return candidates[i];
    }
  }
  return isHorizontallyOverflowing(root) ? root : null;
};

export const getElementViewportState = (element, precomputedRect) => {
  if (!element) {
    return {
      isBottomInViewport: true,
      isPartiallyInViewport: false,
      isTopInViewport: true,
      rect: null,
      viewport: getViewportRect()
    };
  }
  const rect = precomputedRect || element.getBoundingClientRect();
  const viewport = getViewportRect();
  return {
    isBottomInViewport: rect.bottom > viewport.top && rect.bottom <= viewport.bottom,
    isPartiallyInViewport: rect.top < viewport.bottom && rect.bottom > viewport.top,
    isTopInViewport: rect.top >= viewport.top && rect.top < viewport.bottom,
    rect,
    viewport
  };
};

export const shouldShowFloatingScrollbar = (scrollEl, viewportState, getScrollContainer, scrollRect) => {
  if (!isHorizontallyOverflowing(scrollEl)) {
    return false;
  }
  const explicitContainer = typeof getScrollContainer === 'function' ? getScrollContainer() : getScrollContainer || null;
  if (!isDocumentScrollContainer(explicitContainer)) {
    const rect = scrollRect || scrollEl.getBoundingClientRect();
    const containerRect = explicitContainer.getBoundingClientRect();
    return rect.top < containerRect.bottom && rect.bottom > containerRect.bottom;
  }
  const state = viewportState || getElementViewportState(scrollEl, scrollRect);
  if (!state.isPartiallyInViewport) {
    return false;
  }
  return !state.isBottomInViewport;
};

/**
 * 监听元素与视口交叉变化。
 * 仅使用 IntersectionObserver；位置类更新（滚动/resize）由调用方自行监听，避免与业务层重复挂 window 监听。
 */
export const observeViewportIntersection = (element, onChange) => {
  if (!element) {
    return () => {};
  }

  const notify = () => {
    onChange(getElementViewportState(element));
  };

  const observer = new IntersectionObserver(
    () => {
      notify();
    },
    {
      root: null,
      threshold: [0, 0.01, 0.25, 0.5, 0.75, 1]
    }
  );

  observer.observe(element);
  notify();

  return () => {
    observer.disconnect();
  };
};
