import { Button } from 'antd';

const OrderDetailSummary = ({ itemQuantityTotal, itemPriceTotal, tax, shippingFee, payment, finalTotal, handleOrderHistoryClick }) => {
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
      <div>お支払い方法：{payment}</div>

      <div style ={{ marginTop: "16px" }}>
        <Button type="primary" onClick={handleOrderHistoryClick}>一覧に戻る</Button>
      </div>
    </div>
  )
};

export default OrderDetailSummary;