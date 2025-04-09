# Q. MySQL Shell for VS Code에서 사용할 수 있는 파일 형식?

use testdb;

CREATE TABLE food (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Insert
INSERT INTO food (name, price) VALUES ('Candy', 200);
INSERT INTO food (name, price) VALUES ('Sundae', 2000);


# Select
SELECT * FROM food;


# Update
UPDATE food SET name = 'DeliCandy' WHERE name = 'Candy';


# DELETE
DELETE from food WHERE name = 'Sundae';


# Insert member_tbl dummy data
INSERT INTO member_tbl (family_name, first_name, nickname, email, password, created_at, updated_at) VALUES
('さとう', 'たけし', 'たけちゃん', 'takeshi@example.com', 'hashed_pw1', NOW(), NOW()),
('たなか', 'あゆみ', 'あゆぴ', 'ayumi@example.com', 'hashed_pw2', NOW(), NOW()),
('みやざき', 'れん', 'れんれん', 'ren@example.com', 'hashed_pw3', NOW(), NOW());


# Insert shipping_address_tbl dummy data
INSERT INTO shipping_address_tbl (member_id, receiver, address, postcode, created_at, updated_at) VALUES
(1, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', NOW(), NOW()),
(2, '鈴木 花子', '大阪府大阪市北区梅田3-1-1', '530-0001', NOW(), NOW()),
(3, '高橋 健一', '愛知県名古屋市中村区名駅1-1-4', '450-0002', NOW(), NOW());


# Insert category_tbl dummy data
1 食品
├── 3 生鮮食品
│   ├── 6 野菜
│   └── 7 肉類
└── 4 加工食品
    └── 8 インスタントラーメン

2 日用品
└── 5 掃除用品
    └── 9 洗剤

## 大カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(1, '食品', 1, NULL, NOW(), NOW()),
(2, '日用品', 1, NULL, NOW(), NOW());

## 中カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(3, '生鮮食品', 2, 1, NOW(), NOW()),
(4, '加工食品', 2, 1, NOW(), NOW()),
(5, '掃除用品', 2, 2, NOW(), NOW());

## 小カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(6, '野菜', 3, 3, NOW(), NOW()),
(7, '肉類', 3, 3, NOW(), NOW()),
(8, 'インスタントラーメン', 3, 4, NOW(), NOW()),
(9, '洗剤', 3, 5, NOW(), NOW());


# Insert product_tbl dummy data
1 食品
├── 3 生鮮食品
│   ├── 6 野菜
│   │   ├── 1 キャベツ
│   │   └── 2 にんじん
│   └── 7 肉類
│       ├── 3 鶏もも肉
│       └── 4 豚バラ肉
└── 4 加工食品
    └── 8 インスタントラーメン
        ├── 5 辛ラーメン
        └── 6 カップヌードル シーフード

2 日用品
└── 5 掃除用品
    └── 9 洗剤
        ├── 7 アタックゼロ
        └── 8 ファブリーズ

INSERT INTO product_tbl (
  product_id, product_name, description, price, stock, status,
  category_id, created_at, updated_at
)
VALUES
-- 野菜 (category_id = 6)
(1, 'キャベツ', '新鮮なキャベツです。', 128, 100, 1, 6, NOW(), NOW()),
(2, 'にんじん', '北海道産の甘いにんじん。', 98, 200, 1, 6, NOW(), NOW()),

-- 肉類 (category_id = 7)
(3, '鶏もも肉', '国産鶏のもも肉、300gパック。', 398, 50, 1, 7, NOW(), NOW()),
(4, '豚バラ肉', '厚切り豚バラスライス。', 428, 70, 1, 7, NOW(), NOW()),

-- インスタントラーメン (category_id = 8)
(5, '辛ラーメン', 'ピリ辛好きに人気のインスタント麺。', 148, 300, 1, 8, NOW(), NOW()),
(6, 'カップヌードル シーフード', '濃厚なシーフード味。', 198, 150, 1, 8, NOW(), NOW()),

-- 洗剤 (category_id = 9)
(7, 'アタックゼロ', '抗菌・消臭に優れた液体洗剤。', 298, 120, 1, 9, NOW(), NOW()),
(8, 'ファブリーズ', '衣類やカーテンに使える消臭スプレー。', 398, 80, 1, 9, NOW(), NOW());


# Insert product_image_tbl dummy data
1 食品
├── 3 生鮮食品
│   ├── 6 野菜
│   │   ├── キャベツ (product_id = 1)
│   │   │   ├── /uploads/1/1.jpg
│   │   │   └── /uploads/1/2.jpg
│   │   └── にんじん (product_id = 2)
│   │       └── /uploads/2/3.jpg
│   └── 7 肉類
│       ├── 鶏もも肉 (product_id = 3)
│       │   └── /uploads/3/4.jpg
│       └── 豚バラ肉 (product_id = 4)
│           ├── /uploads/4/5.jpg
│           └── /uploads/4/6.jpg
└── 4 加工食品
    └── 8 インスタントラーメン
        ├── 辛ラーメン (product_id = 5)
        │   └── /uploads/5/7.jpg
        └── カップヌードル シーフード (product_id = 6)
            └── /uploads/6/8.jpg

2 日用品
└── 5 掃除用品
    └── 9 洗剤
        ├── アタックゼロ (product_id = 7)
        │   └── /uploads/7/9.jpg
        └── ファブリーズ (product_id = 8)
            └── /uploads/8/10.jpg
            
INSERT INTO product_image_tbl (
  product_image_id, src, product_id, created_at, updated_at
)
VALUES
-- キャベツ (product_id = 1)
(1, '/uploads/products/1/1.jpg', 1, NOW(), NOW()),
(2, '/uploads/products/1/2.jpg', 1, NOW(), NOW()),

-- にんじん (product_id = 2)
(3, '/uploads/products/2/3.jpg', 2, NOW(), NOW()),

-- 鶏もも肉 (product_id = 3)
(4, '/uploads/products/3/4.jpg', 3, NOW(), NOW()),

-- 豚バラ肉 (product_id = 4)
(5, '/uploads/products/4/5.jpg', 4, NOW(), NOW()),
(6, '/uploads/products/4/6.jpg', 4, NOW(), NOW()),

-- 辛ラーメン (product_id = 5)
(7, '/uploads/products/5/7.jpg', 5, NOW(), NOW()),

-- カップヌードル シーフード (product_id = 6)
(8, '/uploads/products/6/8.jpg', 6, NOW(), NOW()),

-- アタックゼロ (product_id = 7)
(9, '/uploads/products/7/9.jpg', 7, NOW(), NOW()),

-- ファブリーズ (product_id = 8)
(10, '/uploads/products/8/10.jpg', 8, NOW(), NOW());
