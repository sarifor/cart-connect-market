import { Button, Modal } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

// Q. Modal을 포탈 방식(부모 스타일에 영향 안 받음)으로 수정하려면?
// Q. 결과 메시지 3초 뒤에 사라지게 하는 효과 추가? (useEffect 사용)
// Q. 구매할 수 없는 상품일 때 안내 메시지 표시?
const PublicCartDetailSummary = ({ 
  itemQuantityTotal, itemPriceTotal, isModalOpen,
  copyCartLoading, copyCartDone, copyCartError,
  handlePublicCartListClick, handleLikeClick, handleCopyClick,
  handleOkClick, handleCancelClick,
  nickname, orderCreatedAt, publicCartCreatedAt,
  likeCount,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "20px", rowGap: "5px" }}>
      <div style={{ fontWeight: "bold", borderBottom: "1px solid black" }}>
        投稿者
      </div>
      <div>ニックネーム：{nickname}</div>
      <div>
        注文日：{new Date(orderCreatedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div>
        公開日：{new Date(publicCartCreatedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div style={{ fontWeight: "bold", borderBottom: "1px solid black", marginTop: "16px" }}>
        注文内容
      </div>
      <div>購入点数：{itemQuantityTotal}個</div>
      <div>合計金額：{itemPriceTotal}円（税抜）</div>
      <div>※価格および合計金額は、購入当時のものです。あらかじめご了承ください。</div>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "16px" }}>
          <Button type="primary" onClick={handlePublicCartListClick}>戻る</Button>

          <Button type="primary" onClick={handleLikeClick}>
            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
              {likeCount}<HeartOutlined style={{ marginTop: "2px" }} />
            </span>
          </Button>

          <Button type="primary" onClick={handleCopyClick}>コピー</Button>
          <Modal
            open={isModalOpen}
            onOk={handleOkClick}
            onCancel={handleCancelClick}
            getContainer={false}
          >
            商品がコピーされました。カートに移動しますか？
          </Modal>
        </div>

        <div>
          { copyCartLoading && !copyCartDone && (
            <div>コピー中...</div>
          )}
          
          { !copyCartDone && copyCartError && (
            <div>コピーに失敗しました。</div>
          )}

          { copyCartDone && (
            <div>コピーが完了しました。</div>
          )}        
        </div>

      </div>
    </div>
  )
};

export default PublicCartDetailSummary;