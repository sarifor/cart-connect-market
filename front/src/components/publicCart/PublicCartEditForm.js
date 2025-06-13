import { Input, Select, Button, Modal } from 'antd';

// Q. loadOrdersForPublicCartLoading, ~Done, ~Error 상태별 렌더링 추가?
const PublicCartPostForm = ({
  title, content, selectedOrder,
  handleTitleChange, handleContentChange,
  handleGoBackClick, handleUpdateClick,
  handleSuccessOkClick, handleConfirmOkClick, handleConfirmCancelClick, 
  isConfirmCancelModalOpen, isSuccessModalOpen,
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
        {/* 제목 수정란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            제목을 수정해 주세요.
          </div>
          <Input style={{ width: '100%' }} type="text" value={title} onChange={handleTitleChange} />
        </div>

        {/* 내용 작성란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            내용을 수정해 주세요.
          </div>
          <Input style={{ width: '100%' }} type="text" value={content} onChange={handleContentChange} />
        </div>

        {/* 주문 선택란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            주문은 수정할 수 없습니다.
          </div>
          {selectedOrder?.length > 0 && (
            <Select
              value={selectedOrder[0]?.value}
              style={{ width: '100%' }}
              options={selectedOrder}
              disabled
            />
          )}

        </div>

      </div>

      <div style={{ display: "flex", flexDirection: "row", padding: '10px', columnGap: "10px", marginTop: "16px" }}>
        <Button style={{ width: '100px' }} onClick={handleGoBackClick}>돌아가기</Button>
        <Button style={{ width: '100px' }} onClick={handleUpdateClick}>수정</Button>
        <Modal
          open={isConfirmCancelModalOpen}
          onOk={handleConfirmOkClick}
          onCancel={handleConfirmCancelClick}
          getContainer={false}
        >
          화면을 벗어나면 수정 내용이 저장되지 않습니다. 그래도 이동하시겠습니까?
        </Modal>
        <Modal
          open={isSuccessModalOpen}
          footer={[
            <Button key="ok" type="primary" onClick={handleSuccessOkClick}>
              확인
            </Button>
          ]}
          getContainer={false}
        >
          공개 장바구니가 수정되었습니다.
        </Modal>        
      </div>

    </div>
  );
};

export default PublicCartPostForm;