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
  handleSuccessOkClick,
  isSuccessModalOpen,
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
            タイトルを入力してください。
          </div>
          <Input style={{ width: '100%' }} type="text" value={title} onChange={handleTitleChange} />
        </div>

        {/* 내용 작성란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            内容を入力してください。
          </div>
          <Input style={{ width: '100%' }} type="text" value={content} onChange={handleContentChange} />
        </div>

        {/* 주문 선택란 */}
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <div>
            公開したい注文を選択してください。（すでに公開済みの注文は選択できません）
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
        <Button style={{ width: '100px' }} onClick={handleGoBackClick}>戻る</Button>
        <Button style={{ width: '100px' }} onClick={handlePostClick}>投稿する</Button>
        <Modal
          open={isSuccessModalOpen}
          footer={[
            <Button key="ok" type="primary" onClick={handleSuccessOkClick}>
              確認
            </Button>
          ]}
          getContainer={false}
        >
          公開カートの投稿が完了しました。
        </Modal>        
      </div>

    </div>
  );
};

export default PublicCartPostForm;