import Link from 'next/link';

const PublicCartDetailList = ({ detail }) => {

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row',
      padding: '10px',
    }}>
      <div style={{ width: '120px', marginRight: '20px' }}>
        <Link href={`/product/${detail.product_id}`}>
          <img 
            src={ detail?.Product?.ProductImages?.[0]?.src || '/order/default.jpg' }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/order/default.jpg';
            }}
            style={{ width: '100%', height: 'auto' }}
          />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
        <div>{detail.Product.product_name}</div>
        <div>{detail.purchase_price}엔</div>
        <div>{detail.quantity}개</div>
      </div>

    </div>
  )
};

export default PublicCartDetailList;