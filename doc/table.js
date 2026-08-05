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
  employeeNo: `EMP-${String(index + 1).padStart(4, '0')}`,
  name: `员工${index + 1}`,
  department: ['技术', '产品', '设计', '运营'][index % 4],
  position: ['工程师', '经理', '专员'][index % 3],
  city: ['上海', '北京', '深圳', '杭州'][index % 4],
  email: `user${index + 1}@example.com`,
  phone: `138****${String(1000 + index).slice(-4)}`,
  joinDate: `2024-${String((index % 12) + 1).padStart(2, '0')}-15`,
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
