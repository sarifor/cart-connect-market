import { Button } from 'antd';

const ReviewSummary = ({ itemQuantityTotal, itemPriceTotal, shippingFee, tax, finalTotal, handleOrderClick }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "20px", rowGap: "5px" }}>
      <div style ={{ fontWeight: "bold", borderBottom: "1px solid black" }}>
        주문 내용: {itemQuantityTotal}개
      </div>
      <div>상품 합계: {itemPriceTotal}엔</div>
      <div>송료: {shippingFee}엔</div>

      <div style ={{ fontWeight: "bold", borderBottom: "1px solid black", marginTop: "16px" }}>
        합계: {finalTotal}엔
      </div>
      <div>그 중 세금: {tax}엔</div>

      <div style ={{ marginTop: "16px" }}>
        <Button type="primary" onClick={handleOrderClick}>注文する</Button>
      </div>
    </div>
  )
};

export default ReviewSummary;