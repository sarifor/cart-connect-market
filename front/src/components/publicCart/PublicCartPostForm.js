import { Input, Select, Button, Modal } from 'antd';

const PublicCartPostForm = ({
  title,
  content,
  selectedOrderId,
  ordersForPublicCart,
  handleTitleChange,
  handleContentChange,
  handleOrderIdChange,
  handleGoBackClick,
  handlePostClick,
  isModalOpen,
}) => {

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: 600,
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', rowGap: '10px' }}>
        {/* 제목 작성란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            제목을 입력해 주세요.
          </div>
          <Input style={{ width: '100%' }} type="text" value={title} onChange={handleTitleChange} />
        </div>

        {/* 내용 작성란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            내용을 입력해 주세요.
          </div>
          <Input style={{ width: '100%' }} type="text" value={content} onChange={handleContentChange} />
        </div>

        {/* 주문 선택란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            공개하고 싶은 주문을 선택해 주세요. (이미 공개한 주문은 사용할 수 없습니다)
          </div>
          <Select
            value={selectedOrderId || undefined}
            style={{ width: '100%' }}
            onChange={handleOrderIdChange}
            options={ordersForPublicCart}
          />
        </div>

      </div>

      <div style={{ display: "flex", flexDirection: "row", padding: '10px', columnGap: "10px", marginTop: "16px" }}>
        <Button style={{ width: '100px' }} onClick={handleGoBackClick}>돌아가기</Button>
        <Button style={{ width: '100px' }} onClick={handlePostClick}>등록</Button>
        <Modal
          open={isModalOpen}
          getContainer={false}
        >
          공개 장바구니 등록이 완료되었습니다.
        </Modal>        
      </div>

    </div>
  );
};

export default PublicCartPostForm;