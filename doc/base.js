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
