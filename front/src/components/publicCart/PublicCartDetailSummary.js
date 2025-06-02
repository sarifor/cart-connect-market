import { Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const PublicCartDetailSummary = ({ 
  itemQuantityTotal, itemPriceTotal, 
  handlePublicCartListClick, handleLikeClick, handleCopyClick,
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

      <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginTop: "16px" }}>
        <Button type="primary" onClick={handlePublicCartListClick}>돌아가기</Button>
        <Button type="primary" onClick={handleLikeClick}>
          <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
            {likeCount}<HeartOutlined style={{ marginTop: "2px" }} />
          </span>
        </Button>
        <Button type="primary" onClick={handleCopyClick}>복사</Button>
      </div>
    </div>
  )
};

export default PublicCartDetailSummary;