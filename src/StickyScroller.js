import { createPortal } from 'react-dom';
import { forwardRef, useEffect, useRef, useState } from 'react';
import useRefCallback from '@kne/use-ref-callback';
import classnames from 'classnames';
import style from './style.module.scss';
import { getDefaultScrollElement, getViewportRect, isDocumentScrollContainer, shouldShowFloatingScrollbar } from './scrollUtils';

const BAR_HEIGHT = 15;
const THUMB_MARGIN = 2;
const MUTATION_REBIND_MS = 64;

const getContainerBottomOffset = (container, borderBottom) => {
  const rect = container.getBoundingClientRect();
  // 贴容器可视区域底边（border 内侧），不受 padding 影响
  return Math.round(window.innerHeight - rect.bottom + borderBottom);
};

const readBorderBottom = container => {
  if (!container) {
    return 0;
  }
  return parseFloat(getComputedStyle(container).borderBottomWidth) || 0;
};

const computeBarMetrics = (scrollEl, getPortalContainer, borderBottom) => {
  const rect = scrollEl.getBoundingClientRect();
  const portalContainer = typeof getPortalContainer === 'function' ? getPortalContainer() : null;
  const useContainerAnchor = !isDocumentScrollContainer(portalContainer);
  const trackWidth = rect.width;
  const clientWidth = scrollEl.clientWidth;
  const scrollWidth = scrollEl.scrollWidth;
  const thumbWidth = Math.max((trackWidth * clientWidth) / scrollWidth - THUMB_MARGIN * 2, 24);
  const maxThumbOffset = trackWidth - thumbWidth - THUMB_MARGIN * 2;
  const scrollable = scrollWidth > clientWidth;
  const scrollRatio = scrollable ? scrollEl.scrollLeft / (scrollWidth - clientWidth) : 0;
  const visible = shouldShowFloatingScrollbar(scrollEl, null, portalContainer, rect);

  const bottom = useContainerAnchor ? getContainerBottomOffset(portalContainer, borderBottom) : Math.round(window.innerHeight - getViewportRect().bottom);

  return {
    left: Math.round(rect.left),
    width: Math.round(trackWidth),
    bottom,
    thumbWidth: Math.round(thumbWidth),
    thumbLeft: Math.round(THUMB_MARGIN + maxThumbOffset * scrollRatio),
    visible
  };
};

const metricsEqual = (prev, next) => {
  if (!prev || !next) {
    return prev === next;
  }
  return prev.visible === next.visible && prev.width === next.width && prev.thumbWidth === next.thumbWidth && prev.thumbLeft === next.thumbLeft && prev.left === next.left && prev.bottom === next.bottom;
};

const FloatingScrollBar = ({ metrics, onThumbDrag }) => {
  const startRef = useRef(0);
  const [moving, setMoving] = useState(false);
  const onThumbDragRef = useRef(onThumbDrag);
  onThumbDragRef.current = onThumbDrag;

  useEffect(() => {
    if (!moving) {
      return undefined;
    }
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.userSelect = previousUserSelect;
    };
  }, [moving]);

  if (!metrics?.visible) {
    return null;
  }

  const endDrag = event => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setMoving(false);
  };

  return createPortal(
    <div
      className={classnames(style['floating-scrollbar'], 'react-sticky-scroller-bar')}
      style={{
        left: metrics.left,
        width: metrics.width,
        height: BAR_HEIGHT,
        bottom: metrics.bottom
      }}
    >
      <div
        className={classnames(style['floating-scrollbar-thumb'], {
          [style['is-moving']]: moving
        })}
        style={{
          width: metrics.thumbWidth,
          left: metrics.thumbLeft
        }}
        onPointerDown={event => {
          if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
          }
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          startRef.current = event.clientX;
          setMoving(true);
        }}
        onPointerMove={event => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            return;
          }
          const deltaX = event.clientX - startRef.current;
          startRef.current = event.clientX;
          if (deltaX !== 0) {
            onThumbDragRef.current(deltaX);
          }
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>,
    document.body
  );
};

const StickyScroller = forwardRef(({ className, enabled = true, getPortalContainer, getScrollElement = getDefaultScrollElement, children }, forwardedRef) => {
  const [metrics, setMetrics] = useState(null);
  const containerRef = useRef(null);
  const scrollElRef = useRef(null);
  const metricsRef = useRef(null);
  const rafRef = useRef(null);
  const borderBottomRef = useRef(0);
  const resolveScrollElement = useRefCallback(getScrollElement);
  const resolvePortalContainer = useRefCallback(() => {
    return typeof getPortalContainer === 'function' ? getPortalContainer() : null;
  });

  const setContainerRef = useRefCallback(node => {
    containerRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  });

  const updateMetricsNow = useRefCallback(() => {
    const scrollEl = scrollElRef.current;
    if (!scrollEl) {
      if (metricsRef.current !== null) {
        metricsRef.current = null;
        setMetrics(null);
      }
      return;
    }
    const nextMetrics = computeBarMetrics(scrollEl, resolvePortalContainer, borderBottomRef.current);
    if (metricsEqual(metricsRef.current, nextMetrics)) {
      return;
    }
    metricsRef.current = nextMetrics;
    setMetrics(nextMetrics);
  });

  const scheduleUpdateMetrics = useRefCallback(() => {
    if (rafRef.current != null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateMetricsNow();
    });
  });

  const handleThumbDrag = useRefCallback(deltaX => {
    const scrollEl = scrollElRef.current;
    if (!scrollEl) {
      return;
    }
    const trackWidth = scrollEl.clientWidth;
    const scrollableWidth = scrollEl.scrollWidth - scrollEl.clientWidth;
    if (scrollableWidth <= 0) {
      return;
    }
    const thumbWidth = Math.max((trackWidth * scrollEl.clientWidth) / scrollEl.scrollWidth - THUMB_MARGIN * 2, 24);
    const thumbTravel = trackWidth - thumbWidth - THUMB_MARGIN * 2;
    if (thumbTravel <= 0) {
      return;
    }
    scrollEl.scrollLeft += (deltaX / thumbTravel) * scrollableWidth;
    // 拖动需要即时反馈，不走 rAF 合并
    updateMetricsNow();
  });

  useEffect(() => {
    if (!enabled) {
      scrollElRef.current = null;
      metricsRef.current = null;
      setMetrics(null);
      return undefined;
    }

    const root = containerRef.current;
    if (!root) {
      return undefined;
    }

    let scrollEl = null;
    let contentResizeObserver = null;
    let portalContainer = null;
    let useContainerAnchor = false;
    let portalResizeObserver = null;
    let mutationTimer = null;

    const refreshPortalAnchor = () => {
      const nextPortal = resolvePortalContainer();
      const nextUseContainerAnchor = !isDocumentScrollContainer(nextPortal);

      if (nextPortal === portalContainer && nextUseContainerAnchor === useContainerAnchor) {
        return;
      }

      if (portalContainer) {
        portalContainer.removeEventListener('scroll', scheduleUpdateMetrics);
        portalResizeObserver?.disconnect();
        portalResizeObserver = null;
      }

      portalContainer = nextPortal;
      useContainerAnchor = nextUseContainerAnchor;
      borderBottomRef.current = useContainerAnchor ? readBorderBottom(portalContainer) : 0;

      if (useContainerAnchor && portalContainer) {
        portalContainer.addEventListener('scroll', scheduleUpdateMetrics, { passive: true });
        portalResizeObserver = new ResizeObserver(() => {
          borderBottomRef.current = readBorderBottom(portalContainer);
          scheduleUpdateMetrics();
        });
        portalResizeObserver.observe(portalContainer);
      }
    };

    const detachScrollEl = () => {
      if (!scrollEl) {
        return;
      }
      scrollEl.removeEventListener('scroll', scheduleUpdateMetrics);
      contentResizeObserver?.disconnect();
      contentResizeObserver = null;
      scrollElRef.current = null;
      scrollEl = null;
    };

    const observeScrollContent = target => {
      contentResizeObserver?.disconnect();
      contentResizeObserver = new ResizeObserver(scheduleUpdateMetrics);
      contentResizeObserver.observe(target);
      const children = target.children;
      for (let i = 0; i < children.length; i += 1) {
        contentResizeObserver.observe(children[i]);
      }
    };

    const attachScrollEl = nextScrollEl => {
      if (!nextScrollEl) {
        if (scrollEl) {
          detachScrollEl();
        }
        return;
      }
      if (nextScrollEl === scrollEl) {
        return;
      }
      detachScrollEl();
      scrollEl = nextScrollEl;
      scrollElRef.current = scrollEl;
      scrollEl.addEventListener('scroll', scheduleUpdateMetrics, { passive: true });
      observeScrollContent(scrollEl);
    };

    const onLayoutChange = () => {
      refreshPortalAnchor();
      attachScrollEl(resolveScrollElement(root));
      scheduleUpdateMetrics();
    };

    const containerResizeObserver = new ResizeObserver(onLayoutChange);
    containerResizeObserver.observe(root);

    // 异步挂载表格/内容时 root 尺寸可能不变；防抖避免虚拟列表高频 mutation 拖垮主线程
    const mutationObserver = new MutationObserver(() => {
      if (mutationTimer != null) {
        return;
      }
      mutationTimer = window.setTimeout(() => {
        mutationTimer = null;
        if (!scrollEl || !scrollEl.isConnected) {
          onLayoutChange();
          return;
        }
        // 子节点增减时刷新尺寸观察，保证 scrollWidth 变化能触发更新
        observeScrollContent(scrollEl);
        scheduleUpdateMetrics();
      }, MUTATION_REBIND_MS);
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    onLayoutChange();

    // fixed 定位依赖视口坐标：页面滚动、窗口变化都要同步（单一入口，rAF 合并）
    window.addEventListener('scroll', scheduleUpdateMetrics, true);
    window.addEventListener('resize', scheduleUpdateMetrics);
    window.visualViewport?.addEventListener('resize', scheduleUpdateMetrics);
    window.visualViewport?.addEventListener('scroll', scheduleUpdateMetrics);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (mutationTimer != null) {
        window.clearTimeout(mutationTimer);
        mutationTimer = null;
      }
      detachScrollEl();
      containerResizeObserver.disconnect();
      mutationObserver.disconnect();
      portalResizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleUpdateMetrics, true);
      window.removeEventListener('resize', scheduleUpdateMetrics);
      window.visualViewport?.removeEventListener('resize', scheduleUpdateMetrics);
      window.visualViewport?.removeEventListener('scroll', scheduleUpdateMetrics);
      if (portalContainer) {
        portalContainer.removeEventListener('scroll', scheduleUpdateMetrics);
      }
    };
  }, [enabled, scheduleUpdateMetrics, resolvePortalContainer, resolveScrollElement]);

  return (
    <>
      <div ref={setContainerRef} className={className}>
        {children}
      </div>
      {enabled ? <FloatingScrollBar metrics={metrics} onThumbDrag={handleThumbDrag} /> : null}
    </>
  );
});

StickyScroller.displayName = 'StickyScroller';

export default StickyScroller;
