const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Q. Sequelize 설정의 host란?
// A. 데이터베이스 서버의 주소를 의미합니다. MySQL이 Node.js 서버와 같은 EC2 인스턴스에 설치되어 있다면, 배포 환경에서도 host: 'localhost' 그대로 사용해도 되고, 별도의 도메인이나 퍼블릭 IP로 변경할 필요는 없습니다 (ChatGPT)
// Q. 각 모델의 필드마다 필요한 경우 comment로 보충 설명 달아놓을까? (예: Order 모델 status)
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
  },
  {
    tableName: 'member_tbl',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
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
  },
  {
    tableName: 'shipping_address_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
  },
  {
    tableName: 'category_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
    emoji: {
      type: DataTypes.STRING(4),
      allowNull: true,
      defaultValue: null,
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
  },
  {
    tableName: 'product_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
  },
  {
    tableName: 'product_image_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',    
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
  }, 
  {
    tableName: "cart_tbl",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',    
  }
);

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
  }, 
  {
    tableName: 'order_tbl',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',    
    deletedAt: 'deleted_at',
  }
);

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
  },
  {
    tableName: 'order_detail_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',      
  }
);

const PublicCart = mysql.define(
  'PublicCart', 
  {
    public_cart_id: {
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
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  }, 
  {
    tableName: 'public_cart_tbl',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

const Like = mysql.define(
  'Like', 
  {
    like_id: {
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
    public_cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '1：いいね、0：キャンセル',
    },
  }, 
  {
    tableName: 'like_tbl',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['member_id', 'public_cart_id'],
      },
    ],
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

// 주문-공개장바구니 관계(1:1)
// - 주문이 soft delete 될 때 공개 장바구니는 soft delete 됨
// - 공개 장바구니가 soft delete 될 때 주문은 아무 영향 없음
Order.hasOne(PublicCart, { foreignKey: 'order_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
PublicCart.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// 회원(작성자)-공개장바구니 관계(1:N)
// - 회원 탈퇴 시 공개 장바구니는 soft delete 됨
// - 공개 장바구니가 soft delete 될 때 회원은 아무 영향 없음
Member.hasMany(PublicCart, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
PublicCart.belongsTo(Member, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

// 회원(열람자)-공개장바구니 관계(N:M)
// - 회원(열람자) soft delete 시 공개 장바구니는 영향 없으며, 좋아요는 controller에서 직접 삭제(hard delete)
// - 공개 장바구니 soft delete 시 회원(열람자)는 영향 없으며, 좋아요는 controller에서 직접 삭제(hard delete)
Member.hasMany(Like, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Like.belongsTo(Member, { foreignKey: 'member_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
PublicCart.hasMany(Like, { foreignKey: 'public_cart_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Like.belongsTo(PublicCart, { foreignKey: 'public_cart_id', onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });

module.exports = { mysql, Member, ShippingAddress, Product, ProductImage, Category, Cart, Order, OrderDetail, PublicCart, Like };