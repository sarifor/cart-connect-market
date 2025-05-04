const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Q. Sequelize 설정의 host란?
// A. 데이터베이스 서버의 주소를 의미합니다. MySQL이 Node.js 서버와 같은 EC2 인스턴스에 설치되어 있다면, 배포 환경에서도 host: 'localhost' 그대로 사용해도 되고, 별도의 도메인이나 퍼블릭 IP로 변경할 필요는 없습니다 (ChatGPT)
// Q. 각 모델의 필드마다 필요한 경우 comment로 보충 설명 달아놓을까? (예: Order 모델 status)
// Q. Order, OrderDetail 외엔 아직 created_at과 updated_at에 현재 시간 기본값 설정이 제대로 안 되어 있다. Sequelize.literal을 사용해서 언제쯤 수정할까?
const mysql = new Sequelize({
  database: 'testdb',
  username: 'root',
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql'
});

// Q. 모델을 별도 파일로 분리하려면? ../models/old/index.js 코드를 참고하면 해결될지도?
const Member = mysql.define(
  'Member',
  {
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    family_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,      
    },
  },
  {
    tableName: 'member_tbl',
    timestamps: false,
  },
);

const ShippingAddress = mysql.define(
  'ShippingAddress',
  {
    shipping_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'shipping_address_tbl',
    timestamps: false,
  }
);

const Category = mysql.define(
  'Category',
  {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    category_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'category_tbl',
    timestamps: false,
  }
);

// Q. product_tbl CREATE STATEMENT에 외래키 관계가 설정되어 있지 않아. CONSTRAINT~ FOREIGN KEY~ REFERENCES ~ 부분이 없어.
// A. Category → Product 순서로 define (ChatGPT)
const Product = mysql.define(
  'Product',
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    product_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'product_tbl',
    timestamps: false,
  }
);

const ProductImage = mysql.define(
  'ProductImage',
  {
    product_image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    src: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'product_image_tbl',
    timestamps: false,
  }
);

const Cart = mysql.define(
  "Cart", 
  {
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    public_cart_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, 
  {
    tableName: "cart_tbl",
    timestamps: false,
  });

const Order = mysql.define(
  "Order", 
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1: 신용카드, 2: 물건 수령 시 현금 결제, 3: 프로모션 코드, 4: 쿠폰',
    },
    receiver: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    shipping_fee: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '0: 주문 취소, 1: 결제 완료, 2: 배송 중, 3: 배송 완료',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: mysql.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: mysql.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  }, 
  {
    tableName: 'order_tbl',
    timestamps: false,
  });

  const OrderDetail = mysql.define(
    "OrderDetail",
    {
      order_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      public_cart_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      quantity: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: mysql.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: mysql.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'order_detail_tbl',
      timestamps: false,
    }
  );

/*
  Q. 모델 간 관계 정의는, 모든 모델이 로드된 뒤 한 번만 실행되면 되니까 정적 메서드 안에 정의하는 게 좋을까?

  A. 모델을 각각 파일로 나누고, models/index.js에서 전체 모델을 불러온 뒤 관계를 한 번에 설정하고 싶을 때,
  또는 유지보수, 가독성, 순환 참조 방지 같은 구조적인 측면을 고려한다면
  관계를 정적 메서드 안에 정의하는 것이 좋다.
  다만, 그렇게 하는 것이 필수는 아니며, 프로젝트 규모나 스타일에 따라 자유롭게 선택할 수 있다. (ChatGPT)
*/
// 1:N
Member.hasMany(ShippingAddress, { foreignKey: 'member_id' });
ShippingAddress.belongsTo(Member, { foreignKey: 'member_id' });

// 1:N
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// 1:N
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// 1:N 자기 참조 관계
// Q. Sequelize가 만들어준 Create statement에 보면 REFERENCES category_tbl (category_id)라고 알아서 지정되어 있어. 어떤 원리?
//    CONSTRAINT category_tbl_ibfk_1 FOREIGN KEY (parent_category_id) REFERENCES category_tbl (category_id) ON DELETE SET NULL ON UPDATE CASCADE
// A. (Sequelize는) 자식 카테고리의 parent_category_id는 부모 카테고리의 category_id를 참조한다고 판단합니다. (ChatGPT)
Category.hasMany(Category, { foreignKey: 'parent_category_id', as: 'subcategory'});
Category.belongsTo(Category, { foreignKey: 'parent_category_id', as: 'parentcategory'});

// 회원-상품 관계(N:M)
// - 회원 탈퇴나 상품 삭제 시, 연관된 장바구니 데이터도 삭제
Member.hasMany(Cart, { foreignKey: 'member_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(Member, { foreignKey: 'member_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Product.hasMany(Cart, { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// 회원-주문 관계(1:N)
// - 회원 탈퇴 시 soft delete로 처리하기 때문에 주문 데이터는 남아 있음
Member.hasMany(Order, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Order.belongsTo(Member, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// 주문-상품 관계(N:M)
// - 주문이나 상품 삭제 시 soft delete로 처리하기 때문에 주문 상세 데이터는 남아 있음
// - 단, 미완료 주문을 삭제 시에는 hard delete이기 때문에, 이 경우엔 주문 상세 데이터를 먼저 삭제하고 주문 데이터 삭제
Order.hasMany(OrderDetail, { foreignKey: 'order_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Product.hasMany(OrderDetail, { foreignKey: 'product_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

module.exports = { mysql, Member, ShippingAddress, Product, ProductImage, Category, Cart, Order, OrderDetail };