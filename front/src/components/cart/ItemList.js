import { Button } from 'antd';
import { addToCartRequest, decrementCartRequest, deleteCartRequest } from '../../reducers/cart';
import { useDispatch } from 'react-redux';

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddClick = () => {
    dispatch({
      type: addToCartRequest.type,
      data: { 
        productId: item.product_id,
        quantity: 1,
      }
    });
  };

  const handleDecrementClick = () => {
    dispatch({
      type: decrementCartRequest.type,
      data: {
        productId: item.product_id,
        quantity: 1,
      }
    });
  };

  const handleDeleteClick = () => {
    dispatch({
      type: deleteCartRequest.type,
      data: { 
        productId: item.product_id,
      }
    });
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row",
      padding: "20px",
      borderBottom: "1px solid black"
    }}>
      <div style={{ width: "120px", marginRight: "20px" }}>
        <img 
          src={item.Product.ProductImages[0].src}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
        <div>{item.Product.product_name}</div>
        <div>{item.Product.description}</div>
        <div>{item.Product.price}엔</div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Button onClick={handleDecrementClick}>-</Button>
          <div style={{ width: "40px", textAlign: "center", }}>
            {item.quantity}
          </div>
          <Button onClick={handleAddClick}>+</Button>
        </div>

        <div>
          <Button type="primary" onClick={handleDeleteClick}>삭제</Button>
        </div>
      </div>

    </div>    
  )
};

export default ItemList;