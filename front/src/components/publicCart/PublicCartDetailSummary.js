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
        작성자
      </div>
      <div>닉네임: {nickname}</div>
      <div>
        주문일: {new Date(orderCreatedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div>
        공개일: {new Date(publicCartCreatedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div style={{ fontWeight: "bold", borderBottom: "1px solid black", marginTop: "16px" }}>
        주문
      </div>
      <div>구매 개수: {itemQuantityTotal}개</div>
      <div>합계: {itemPriceTotal}엔(세전)</div>
      <div>※価格および合計金額は、購入当時のものです。あらかじめご了承ください。</div>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "16px" }}>
          <Button type="primary" onClick={handlePublicCartListClick}>돌아가기</Button>

          <Button type="primary" onClick={handleLikeClick}>
            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
              {likeCount}<HeartOutlined style={{ marginTop: "2px" }} />
            </span>
          </Button>

          <Button type="primary" onClick={handleCopyClick}>복사</Button>
          <Modal
            open={isModalOpen}
            onOk={handleOkClick}
            onCancel={handleCancelClick}
            getContainer={false}
          >
            상품이 복사되었습니다. 장바구니로 이동하시겠습니까?
          </Modal>
        </div>

        <div>
          { copyCartLoading && !copyCartDone && (
            <div>복사 중...</div>
          )}
          
          { !copyCartDone && copyCartError && (
            <div>복사에 실패하였습니다.</div>
          )}

          { copyCartDone && (
            <div>복사가 완료되었습니다.</div>
          )}        
        </div>

      </div>
    </div>
  )
};

export default PublicCartDetailSummary;