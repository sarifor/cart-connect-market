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
          注文日：{new Date(order.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div>内容：{order.OrderDetails?.[0]?.Product?.product_name} {order.OrderDetails?.length > 1 && ("他")}</div>
        <div>合計：{order.total}円</div>
        
        <div>
          状態：{
            order.status === 0 ? "キャンセル済み" :
            order.status === 1 ? "決済済み" : 
            order.status === 2 ? "配送中" : 
            order.status === 3 ? "配送済み" :
            "不明"
          }
        </div>

      </div>

    </div>    
  )
};

export default OrderList;