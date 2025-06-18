const ReviewItemList = ({ item }) => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "row",
      padding: "10px",
      // borderBottom: "1px solid black"
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
        <div>{item.Product.price}円</div>
        <div>{item.quantity}個</div>
      </div>

    </div>    
  )
};

export default ReviewItemList;