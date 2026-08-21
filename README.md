<!--START_SECTION:DOC_MD-->

# react-sticky-scroller

### 描述

为宽内容提供底部悬停的浮动横向滚动条

### 安装

```shell
npm i --save @kne/react-sticky-scroller
```

### 概述

@kne/react-sticky-scroller 为宽内容区域提供底部悬停的浮动横向滚动条。当内容存在横向溢出、且底部尚未完全进入视口时，会在视口或自定义滚动容器底部显示可拖动的滚动条，拖动即可同步控制原滚动节点。

#### 特点

- **按需显示**：仅在内容可横向滚动、且底部未完全露出时展示，避免干扰正常阅读
- **双定位模式**：页面滚动场景使用 `fixed` 贴视口底部；自定义滚动容器场景使用 `sticky` 贴容器底部
- **即插即用**：包裹目标内容即可工作，默认兼容 Ant Design Table 的横向滚动节点
- **可扩展**：支持自定义滚动容器、自定义横向滚动节点查找逻辑，便于接入各类宽表与看板布局


### 示例

#### 示例代码

- 基础用法
- 宽表格在页面滚动时，底部未完全露出会显示浮动横向滚动条，拖动滑块可同步横向滚动
- _ReactStickyScroller(@kne/current-lib_react-sticky-scroller)[import * as _ReactStickyScroller from "@kne/react-sticky-scroller"],(@kne/current-lib_react-sticky-scroller/dist/index.css),antd(antd)

```jsx
const { default: StickyScroller } = _ReactStickyScroller;
const { Flex, Tag, Typography } = antd;

const { Text, Paragraph } = Typography;

const COLUMNS = 16;
const ROWS = 24;

const WideTable = () => (
  <div style={{ overflowX: 'auto', border: '1px solid #f0f0f0', borderRadius: 4 }}>
    <table style={{ borderCollapse: 'collapse', minWidth: 1600, width: '100%' }}>
      <thead>
        <tr>
          {Array.from({ length: COLUMNS }, (_, index) => (
            <th
              key={index}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
                padding: '10px 12px',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                minWidth: 100
              }}
            >
              列 {index + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: ROWS }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: COLUMNS }, (_, colIndex) => (
              <td
                key={colIndex}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  padding: '10px 12px',
                  whiteSpace: 'nowrap',
                  color: '#666'
                }}
              >
                R{rowIndex + 1}-C{colIndex + 1}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BaseExample = () => {
  return (
    <Flex vertical gap={16}>
      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
        <Paragraph style={{ marginBottom: 8 }}>
          <Tag color="blue">页面滚动</Tag>
          在页面中向下滚动，当宽表格底部尚未完全露出时，视口底部会出现浮动横向滚动条。
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          <Tag color="green">拖动同步</Tag>
          拖动浮动条滑块可同步控制表格横向滚动；表格底部进入视口后浮动条自动隐藏。
        </Paragraph>
      </div>
      <StickyScroller>
        <WideTable />
      </StickyScroller>
      <Text type="secondary">继续向下滚动，观察浮动条的显示与隐藏。</Text>
    </Flex>
  );
};

render(<BaseExample />);

```

- 自定义滚动容器
- 通过 getPortalContainer 指定独立滚动容器，浮动条以 sticky 方式贴在容器底部显示
- _ReactStickyScroller(@kne/current-lib_react-sticky-scroller)[import * as _ReactStickyScroller from "@kne/react-sticky-scroller"],(@kne/current-lib_react-sticky-scroller/dist/index.css),antd(antd)

```jsx
const { default: StickyScroller } = _ReactStickyScroller;
const { Flex, Tag, Typography } = antd;
const { useRef } = React;

const { Paragraph } = Typography;

const COLUMNS = 14;
const ROWS = 30;

const WideContent = () => (
  <div style={{ overflowX: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, background: '#fff' }}>
    <div style={{ display: 'flex', minWidth: 1400 }}>
      {Array.from({ length: COLUMNS }, (_, colIndex) => (
        <div key={colIndex} style={{ flex: '0 0 100px', borderRight: '1px solid #f5f5f5' }}>
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              background: '#fafafa',
              padding: '10px 12px',
              borderBottom: '1px solid #f0f0f0',
              fontWeight: 500
            }}
          >
            字段 {colIndex + 1}
          </div>
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #f0f0f0',
                color: '#666',
                whiteSpace: 'nowrap'
              }}
            >
              {rowIndex + 1}-{colIndex + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ScrollContainerExample = () => {
  const containerRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
        <Paragraph style={{ marginBottom: 8 }}>
          <Tag color="purple">自定义滚动容器</Tag>
          通过 <code>getPortalContainer</code> 指定页面级滚动容器后，浮动条以 <code>fixed</code> 贴在该容器可视区域底部。
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          <Tag color="gold">适用场景</Tag>
          后台布局中内容区独立滚动、弹层 / Drawer 内宽表等「非 document 滚动」场景。
        </Paragraph>
      </div>
      <div
        ref={containerRef}
        style={{
          height: 420,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: 16,
          background: '#fafafa'
        }}
      >
        <StickyScroller getPortalContainer={() => containerRef.current}>
          <WideContent />
        </StickyScroller>
        <div style={{ height: 80, marginTop: 16, color: '#999', fontSize: 13 }}>滚动到此处，内容底部完全露出后浮动条会隐藏。</div>
      </div>
    </Flex>
  );
};

render(<ScrollContainerExample />);

```

- 配合 Ant Design Table
- 默认自动识别 ant-table 横向滚动节点；也可通过 getScrollElement 自定义目标元素
- _ReactStickyScroller(@kne/current-lib_react-sticky-scroller)[import * as _ReactStickyScroller from "@kne/react-sticky-scroller"],(@kne/current-lib_react-sticky-scroller/dist/index.css),antd(antd)

```jsx
const { default: StickyScroller } = _ReactStickyScroller;
const { Flex, Table, Tag, Typography } = antd;
const { useRef } = React;

const { Paragraph } = Typography;

const columns = [
  { title: '工号', dataIndex: 'employeeNo', width: 140, fixed: 'left' },
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '部门', dataIndex: 'department', width: 140 },
  { title: '职位', dataIndex: 'position', width: 120 },
  { title: '城市', dataIndex: 'city', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 220 },
  { title: '电话', dataIndex: 'phone', width: 140 },
  { title: '入职日期', dataIndex: 'joinDate', width: 120 },
  { title: '备注', dataIndex: 'remark', width: 200 }
];

const dataSource = Array.from({ length: 40 }, (_, index) => ({
  key: String(index + 1),
  employeeNo: &#96;EMP-${String(index + 1).padStart(4, '0')}&#96;,
  name: &#96;员工${index + 1}&#96;,
  department: ['技术', '产品', '设计', '运营'][index % 4],
  position: ['工程师', '经理', '专员'][index % 3],
  city: ['上海', '北京', '深圳', '杭州'][index % 4],
  email: &#96;user${index + 1}@example.com&#96;,
  phone: &#96;138****${String(1000 + index).slice(-4)}&#96;,
  joinDate: &#96;2024-${String((index % 12) + 1).padStart(2, '0')}-15&#96;,
  remark: '宽表格横向溢出时可用于验证浮动滚动条'
}));

const TableExample = () => {
  const containerRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
        <Paragraph style={{ marginBottom: 8 }}>
          <Tag color="blue">Ant Design Table</Tag>
          默认会自动识别 <code>.ant-table-body</code> / <code>.ant-table-content</code> 作为横向滚动节点，无需额外配置。
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          <Tag color="green">getScrollElement</Tag>
          如需自定义目标节点，可传入 <code>getScrollElement</code>。
        </Paragraph>
      </div>
      <div
        ref={containerRef}
        style={{
          height: 480,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: 16,
          background: '#fff'
        }}
      >
        <StickyScroller getPortalContainer={() => containerRef.current}>
          <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 1300 }} size="middle" />
        </StickyScroller>
      </div>
    </Flex>
  );
};

render(<TableExample />);

```

- SystemLayout 贴底与弹层层级(全屏)
- 参考 components-admin BizUnit system-layout-next：PureGlobal + SystemLayout + Page；验证浮动横条贴滚动容器底部，以及 components-core useModal 遮罩层级
- _ReactStickyScroller(@kne/current-lib_react-sticky-scroller)[import * as _ReactStickyScroller from "@kne/react-sticky-scroller"],(@kne/current-lib_react-sticky-scroller/dist/index.css),remoteLoader(@kne/remote-loader),_systemLayout(@kne/system-layout),(@kne/system-layout/dist/index.css),antd(antd)

```jsx
const { default: StickyScroller } = _ReactStickyScroller;
const { default: SystemLayout, Page } = _systemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { Flex, Table, Button, Tag, Typography, Space, Switch } = antd;
const { useState, useMemo } = React;
const { Paragraph, Text } = Typography;

const baseUrl = '/sticky-system-layout';

const ALL_COLUMNS = [
  { title: '编号', dataIndex: 'id', width: 160, fixed: 'left' },
  { title: '名称', dataIndex: 'name', width: 220 },
  { title: '类型', dataIndex: 'type', width: 120 },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '创建时间', dataIndex: 'createdAt', width: 140 },
  { title: '更新时间', dataIndex: 'updatedAt', width: 140 },
  { title: '负责人', dataIndex: 'owner', width: 120 },
  { title: '备注', dataIndex: 'remark', width: 280 },
  {
    title: '操作',
    key: 'action',
    width: 140,
    fixed: 'right',
    render: () => (
      <Space>
        <Button type="link" size="small">
          复制
        </Button>
        <Button type="link" size="small">
          关闭
        </Button>
      </Space>
    )
  }
];

/** 收起后仅保留少量列，总宽应小于常见内容区，用于验证浮动横条消失 */
const COMPACT_COLUMN_KEYS = ['id', 'name', 'status', 'action'];

const dataSource = Array.from({ length: 48 }, (_, index) => ({
  key: String(index + 1),
  id: &#96;808303${String(100000000 + index)}&#96;,
  name: &#96;V4_251029_软能力五选二_${index + 1}&#96;,
  type: 'AI面试',
  status: index % 3 === 0 ? '进行中' : '已关闭',
  createdAt: &#96;2025-10-${String((index % 28) + 1).padStart(2, '0')}&#96;,
  updatedAt: &#96;2025-11-${String((index % 28) + 1).padStart(2, '0')}&#96;,
  owner: ['Alice', 'Bob', 'Carol'][index % 3],
  remark: '宽表横向溢出，用于验证浮动横条贴 layout 滚动容器底部，以及弹窗遮罩层级'
}));

/**
 * 参考 components-admin BizUnit/doc/system-layout-next.js：
 * PureGlobal + SystemLayout + Page；滚动容器与弹层均走 components-core Global / Modal。
 */
const SystemLayoutExample = createWithRemoteLoader({
  modules: [
    'components-core:Global@PureGlobal',
    'components-core:Global@useScrollElement',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules }) => {
  const [PureGlobal, useScrollElement, useModal] = remoteModules;

  const VerifyPanel = () => {
    const getScrollElement = useScrollElement();
    const modal = useModal();
    const [hideExtraColumns, setHideExtraColumns] = useState(false);

    const columns = useMemo(() => {
      if (!hideExtraColumns) {
        return ALL_COLUMNS;
      }
      return ALL_COLUMNS.filter(col => COMPACT_COLUMN_KEYS.includes(col.dataIndex || col.key));
    }, [hideExtraColumns]);

    const scrollX = hideExtraColumns ? undefined : 1600;

    return (
      <Flex vertical gap={12}>
        <div style={{ color: '#666', fontSize: 13, lineHeight: 1.8 }}>
          <Paragraph style={{ marginBottom: 8 }}>
            <Tag color="blue">贴底</Tag>
            向下滚动内容区，宽表底部未完全露出时，浮动横条应贴在 SystemLayout 滚动容器底部。
          </Paragraph>
          <Paragraph style={{ marginBottom: 8 }}>
            <Tag color="purple">层级</Tag>
            使用 <Text code>components-core:Modal@useModal</Text> 打开弹窗；遮罩应盖住浮动横条。
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            <Tag color="green">溢出</Tag>
            打开「隐藏部分列」后表格不再横向溢出，浮动横条应消失；关闭后恢复宽表并再次出现横条。
          </Paragraph>
        </div>
        <Space wrap>
          <Button
            type="primary"
            onClick={() => {
              modal({
                title: '层级验证（components-core useModal）',
                size: 'small',
                children: (
                  <Paragraph style={{ marginBottom: 0 }}>
                    若修复正确：底部浮动横向滚动条应被灰色遮罩盖住。关闭后横条仍贴在内容区底部。
                  </Paragraph>
                )
              });
            }}
          >
            打开弹窗验证层级
          </Button>
          <Space>
            <Switch checked={hideExtraColumns} onChange={setHideExtraColumns} />
            <Text>隐藏部分列（验证横条消失）</Text>
          </Space>
        </Space>
        <StickyScroller getPortalContainer={getScrollElement}>
          <Table columns={columns} dataSource={dataSource} pagination={false} scroll={scrollX ? { x: scrollX } : undefined} size="middle" />
        </StickyScroller>
      </Flex>
    );
  };

  return (
    <PureGlobal>
      <SystemLayout
        userInfo={{
          name: '张明',
          description: 'HR 管理员 · Sticky 验证'
        }}
        menu={{
          base: baseUrl,
          items: [
            { path: '/', label: '宽表验证', icon: 'icon-assignment' },
            { path: '/demo', label: '示例页', icon: 'icon-groups_2' }
          ]
        }}
      >
        <Page title="StickyScroller × SystemLayout">
          <VerifyPanel />
        </Page>
      </SystemLayout>
    </PureGlobal>
  );
});

render(<SystemLayoutExample />);

```

### API

#### StickyScroller

包裹可横向滚动的内容，在内容底部未完全露出时于视口（或自定义滚动容器）底部显示浮动横向滚动条。

##### 属性

| 属性               | 类型                                         | 默认值                    | 说明                                                                                                        |
| ------------------ | -------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| children           | ReactNode                                    | -                         | 被包裹的内容，内部需存在可横向滚动的节点                                                                    |
| className          | string                                       | -                         | 外层容器 className                                                                                          |
| enabled            | boolean                                      | `true`                    | 是否启用浮动横向滚动条                                                                                      |
| getPortalContainer | `() => HTMLElement \| null`                  | -                         | 页面级滚动容器；传入后浮动条贴该容器可视区域底边。未传时贴视口底部                                          |
| getScrollElement   | `(root: HTMLElement) => HTMLElement \| null` | `getDefaultScrollElement` | 从外层容器中查找横向滚动节点；默认优先识别 `.ant-table-body` / `.ant-table-content`，其次可横向滚动的子节点 |

支持 `ref`，指向外层包裹容器 DOM。

#### 工具方法

| 方法                        | 说明                                            |
| --------------------------- | ----------------------------------------------- |
| getDefaultScrollElement     | 默认横向滚动节点查找逻辑                        |
| getViewportRect             | 获取当前可视区域矩形（兼容 `visualViewport`）   |
| getElementViewportState     | 计算元素相对视口的可见状态                      |
| isDocumentScrollContainer   | 判断是否为 document 级滚动容器                  |
| isHorizontallyOverflowing   | 判断元素是否存在真实横向溢出                    |
| shouldShowFloatingScrollbar | 根据滚动节点与视口/容器关系判断是否应显示浮动条 |
| observeViewportIntersection | 监听元素与视口交叉变化（IntersectionObserver）  |

<!--END_SECTION:DOC_MD-->
