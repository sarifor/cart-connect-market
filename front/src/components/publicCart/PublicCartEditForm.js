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
            タイトルを編集してください。
          </div>
          <Input style={{ width: '100%' }} type="text" value={title} onChange={handleTitleChange} />
        </div>

        {/* 내용 작성란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            内容を編集してください。
          </div>
          <Input style={{ width: '100%' }} type="text" value={content} onChange={handleContentChange} />
        </div>

        {/* 주문 선택란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            注文は編集できません。
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
        <Button style={{ width: '100px' }} onClick={handleGoBackClick}>戻る</Button>
        <Button style={{ width: '100px' }} onClick={handleUpdateClick}>更新する</Button>
        <Modal
          open={isConfirmCancelModalOpen}
          onOk={handleConfirmOkClick}
          onCancel={handleConfirmCancelClick}
          getContainer={false}
        >
          このページから離れると、変更内容は保存されません。本当に移動してもよろしいですか？
        </Modal>
        <Modal
          open={isSuccessModalOpen}
          footer={[
            <Button key="ok" type="primary" onClick={handleSuccessOkClick}>
              確認
            </Button>
          ]}
          getContainer={false}
        >
          公開カートが更新されました。
        </Modal>        
      </div>

    </div>
  );
};

export default PublicCartPostForm;