import Link from 'next/link';

const OrderList = ({ order }) => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row",
      padding: "10px",
    }}>
      <div style={{ width: "120px", marginRight: "20px" }}>
        <Link href={`/order/${order.order_id}`}>
          <img 
            src={ order.OrderDetails?.[0]?.Product?.ProductImages?.[0]?.src || "/order/default.jpg" }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/order/default.jpg";
            }}
            style={{ width: "100%", height: "auto" }}
          />
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
        <div>
          주문일: {new Date(order.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div>내용: {order.OrderDetails?.[0]?.Product?.product_name} {order.OrderDetails?.length > 1 && ("외")}</div>
        <div>총액: {order.total}엔</div>
        
        <div>
          상태: {
            order.status === 0 ? "주문 취소" :
            order.status === 1 ? "결제 완료" : 
            order.status === 2 ? "배송 중" : 
            order.status === 3 ? "배송 완료" :
            "알 수 없음"
          }
        </div>

      </div>

    </div>    
  )
};

export default OrderList;