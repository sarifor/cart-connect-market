import Link from 'next/link';
import { Col, Row, Card } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
const { Meta } = Card;

const PublicCartList = ({ sortedPublicCarts }) => {

  return (
    <Row>
      {sortedPublicCarts.map((sortedPublicCart) => (
        <Col key={sortedPublicCart.public_cart_id} xs={12} sm={12} md={8} lg={6} style={{backgroundColor: 'yellowgreen'}}>
          <Card
            style={{ width: 240 }}
            cover={
              <div style={{ position: 'relative' }}> 
                <Link href={`/public-cart/${sortedPublicCart.public_cart_id}`}>
                  <img 
                    // alt="example" 
                    src={ sortedPublicCart?.img_src || "/public-cart/default.jpg"} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/public-cart/default.jpg";
                    }}                    
                    style={{ width: '100%' }} />
                </Link>
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'red',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}>
                  {sortedPublicCart.likeCount} <HeartOutlined />
                </div>
              </div>
            }
          >
            <Meta title={sortedPublicCart.title} description={sortedPublicCart.content} />
          </Card>
        </Col>
      ))}
    </Row>          
  )
};

export default PublicCartList;