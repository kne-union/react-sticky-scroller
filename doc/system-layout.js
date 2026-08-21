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
  id: `808303${String(100000000 + index)}`,
  name: `V4_251029_软能力五选二_${index + 1}`,
  type: 'AI面试',
  status: index % 3 === 0 ? '进行中' : '已关闭',
  createdAt: `2025-10-${String((index % 28) + 1).padStart(2, '0')}`,
  updatedAt: `2025-11-${String((index % 28) + 1).padStart(2, '0')}`,
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
