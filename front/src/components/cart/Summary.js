import { Button } from 'antd';
import { useRouter } from 'next/router';

const Summary = ({ itemQuantityTotal, itemPriceTotal, shippingFee, tax, finalTotal, cartActionMessage }) => {
  const router = useRouter();

  const handleCheckoutClick = () => {
    router.push('/checkout');
  };

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
        <Button type="primary" onClick={handleCheckoutClick}>注文に進む</Button>
      </div>
      { cartActionMessage && (
        <div>
          {cartActionMessage}
        </div>
      )}
    </div>
  )
};

export default Summary;