### StickyScroller

包裹可横向滚动的内容，在内容底部未完全露出时于视口（或自定义滚动容器）底部显示浮动横向滚动条。

#### 属性

| 属性               | 类型                                         | 默认值                    | 说明                                                                                                        |
| ------------------ | -------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| children           | ReactNode                                    | -                         | 被包裹的内容，内部需存在可横向滚动的节点                                                                    |
| className          | string                                       | -                         | 外层容器 className                                                                                          |
| enabled            | boolean                                      | `true`                    | 是否启用浮动横向滚动条                                                                                      |
| getPortalContainer | `() => HTMLElement \| null`                  | -                         | 页面级滚动容器；传入后浮动条贴该容器可视区域底边。未传时贴视口底部                                          |
| getScrollElement   | `(root: HTMLElement) => HTMLElement \| null` | `getDefaultScrollElement` | 从外层容器中查找横向滚动节点；默认优先识别 `.ant-table-body` / `.ant-table-content`，其次可横向滚动的子节点 |

支持 `ref`，指向外层包裹容器 DOM。

### 工具方法

| 方法                        | 说明                                            |
| --------------------------- | ----------------------------------------------- |
| getDefaultScrollElement     | 默认横向滚动节点查找逻辑                        |
| getViewportRect             | 获取当前可视区域矩形（兼容 `visualViewport`）   |
| getElementViewportState     | 计算元素相对视口的可见状态                      |
| isDocumentScrollContainer   | 判断是否为 document 级滚动容器                  |
| isHorizontallyOverflowing   | 判断元素是否存在真实横向溢出                    |
| shouldShowFloatingScrollbar | 根据滚动节点与视口/容器关系判断是否应显示浮动条 |
| observeViewportIntersection | 监听元素与视口交叉变化（IntersectionObserver）  |
