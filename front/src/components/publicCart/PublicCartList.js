import Link from 'next/link';
import { Col, Row, Card } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
const { Meta } = Card;

// Q. '최신 순'인지 아닌지 명확하게 알기 위해, 작성 일시 표시?
// Q. 원 윗부분에 여유 공간을 넣으려면 padding을 쓰면 되나?
// Q. 모든 이미지를 같은 폭으로 보이게 하고, 나아가서 서버 쪽에서 처음부터 압축 전송시키려면?
// Q. 공개 장바구니 제목과 내용 미리보기의 글자 수를 한정시키려면?
const PublicCartList = ({ sortedPublicCarts }) => {
  const getRandomPastelColor = () => {
    const pastelColors = [
      '#fde2e4', '#f9f1f7', '#e0f7fa', '#fff1e6', '#e3f2fd',
      '#e6ee9c', '#d1c4e9', '#ffe0b2', '#f8bbd0', '#dcedc8',
    ];
    const index = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[index];
  };

  return (
    <Row>
      {sortedPublicCarts.map((sortedPublicCart) => {
        const bgColor = getRandomPastelColor();

        return (
          <Col
            key={sortedPublicCart.public_cart_id}
            xs={12}
            sm={12}
            md={8}
            lg={6}
          >
            <Card
              style={{ width: 240, height: 350 }}
              cover={
                <div style={{ 
                  position: 'relative',
                  width: '100%', 
                  // height: '240px', 
                  // overflow: 'hidden' 
                }}>
                  <Link href={`/public-cart/${sortedPublicCart.public_cart_id}`}>
                    {!sortedPublicCart?.emojis || sortedPublicCart?.emojis.length === 0 ? (
                      <img 
                        // alt="example" 
                        src="/public-cart/default.jpg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/public-cart/default.jpg";
                        }}                    
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '200px',
                          height: '200px',
                          borderRadius: '50%',
                          marginTop: 0,
                          marginRight: 'auto',
                          marginBottom: 0,
                          marginLeft: 'auto',
                          backgroundColor: bgColor,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '2.5rem',
                        }}
                      >
                        <div style={{ 
                          textAlign: 'center', 
                          // display: 'block',
                          width: '100%' 
                        }}>
                          {Array.from(sortedPublicCart.emojis?.join('') || '').slice(0, 8).join('')}
                        </div>
                      </div> 
                    )}               
                  </Link>

                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    paddingTop: '8px',
                    paddingRight: '12px',
                    paddingBottom: '8px',
                    paddingLeft: '12px',
                    color: 'red',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    zIndex: 2,
                  }}>
                    {sortedPublicCart.likeCount} <HeartOutlined />
                  </div>
                </div>
              }
            >
              <Meta
                title={sortedPublicCart.title}
                description={sortedPublicCart.content}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default PublicCartList;