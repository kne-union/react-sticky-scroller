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
