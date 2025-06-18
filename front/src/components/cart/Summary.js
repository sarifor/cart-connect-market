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
        注文内容：{itemQuantityTotal}個
      </div>
      <div>商品合計：{itemPriceTotal}円</div>
      <div>送料：{shippingFee}円</div>

      <div style ={{ fontWeight: "bold", borderBottom: "1px solid black", marginTop: "16px" }}>
        合計：{finalTotal}円
      </div>
      <div>うち消費税：{tax}円</div>

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