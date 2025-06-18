import Link from 'next/link';
import { Col, Row, Card } from 'antd';
const { Meta } = Card;

// Q. return 컴포넌트 내 조건문을 case 문과 같이 바꾸려면? 예를 들어 '카테고리를 선택하세요' 메시지와 '해당하는 상품이 없습니다' 메시지가 둘 다 보이는 경우가 생기는 경우를 막고 싶음.
// Q. <Col md={18}>은 category\[[...slug]]\index.js로 이동? 그 편이 레이아웃 관리가 쉬울 것 같아서.
// Q. 상품 표지마다 제목과 내용 미리보기가 보이게 하려면?
const ProductList = (props) => {
  const { levelSelected, loadProductsLoading, loadProductsDone, loadProductsError, products } = props;

  return (
    <Col md={18}>
      {!levelSelected && (
        <Row>
          カテゴリーを選択してください。
        </Row>
      )}
      {loadProductsLoading && (
        <Row>
          商品を読み込み中...
        </Row>
      )}
      {loadProductsDone && (
        <Row>
          {products.map((product) => (
            <Col md={6} style={{backgroundColor: 'yellowgreen'}}>
              <Card
                style={{ width: 240 }}
                cover={
                  <div style={{ position: 'relative' }}> 
                    <Link href={`/product/${product.product_id}`}>
                      <img alt="example" src={product.ProductImages[0].src} style={{ width: '100%' }} />
                    </Link>
                  </div>
                }
              >
                <Meta title={product.title} description={product.description} />
              </Card>
            </Col>
          ))}
        </Row>          
      )}
      {(products && products.length === 0) && (
        <Row>
          該当する商品がありません。
        </Row>
      )}
      {loadProductsError && (
        <Row>
          商品を読み込めませんでした。
        </Row>
      )}      
    </Col>
  )
};

export default ProductList;