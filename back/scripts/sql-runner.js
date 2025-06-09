const fs = require('fs');
const path = require('path');

const executeSQL = async(mysql) => {
  // SQL 파일
  const sqlFiles = [
    'sqls/member-data.sql',
    'sqls/shipping-address-data.sql',
    'sqls/category-data.sql',
    'sqls/product-data.sql',
    'sqls/product-image-data.sql',
    'sqls/cart-data.sql',
    'sqls/order-data.sql',
    'sqls/order-detail-data.sql',
    'sqls/public-cart-data.sql',
    'sqls/like-data.sql',
  ];

  try {  
    // 트랜잭션 수동 시작
    const transaction = await mysql.transaction();

    // SQL을 차례로 실행하기
    for (const sqlPath of sqlFiles) {
      const fullSqlPath = path.join(__dirname, "..", sqlPath);
      
      const sql = fs.readFileSync(fullSqlPath, 'utf8');
      
      await mysql.query(sql, { transaction });
    }
    
    // 모든 SQL 삽입이 성공하면 수동 커밋  
    await transaction.commit();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { executeSQL };