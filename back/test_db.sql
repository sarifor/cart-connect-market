use testdb;

-- # Insert member_tbl dummy data
INSERT INTO member_tbl (family_name, first_name, nickname, email, password, created_at, updated_at) 
VALUES
('さとう', 'たけし', 'たけちゃん', 'takeshi@example.com', 'hashed_pw1', NOW(), NOW()),
('たなか', 'あゆみ', 'あゆぴ', 'ayumi@example.com', 'hashed_pw2', NOW(), NOW()),
('みやざき', 'れん', 'れんれん', 'ren@example.com', 'hashed_pw3', NOW(), NOW());


-- # Insert shipping_address_tbl dummy data
INSERT INTO shipping_address_tbl (member_id, receiver, address, postcode, created_at, updated_at) 
VALUES
(1, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', NOW(), NOW()),
(2, '鈴木 花子', '大阪府大阪市北区梅田3-1-1', '530-0001', NOW(), NOW()),
(3, '高橋 健一', '愛知県名古屋市中村区名駅1-1-4', '450-0002', NOW(), NOW());


/* # Insert category_tbl dummy data
1 食品
├── 3 生鮮食品
│   ├── 6 野菜
│   └── 7 肉類
└── 4 加工食品
    └── 8 インスタントラーメン

2 日用品
└── 5 掃除用品
    └── 9 洗剤 */

-- ## 大カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(1, '食品', 1, NULL, NOW(), NOW()),
(2, '日用品', 1, NULL, NOW(), NOW());

-- ## 中カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(3, '生鮮食品', 2, 1, NOW(), NOW()),
(4, '加工食品', 2, 1, NOW(), NOW()),
(5, '掃除用品', 2, 2, NOW(), NOW());

-- ## 小カテゴリ
INSERT INTO category_tbl (category_id, category_name, level, parent_category_id, created_at, updated_at)
VALUES
(6, '野菜', 3, 3, NOW(), NOW()),
(7, '肉類', 3, 3, NOW(), NOW()),
(8, 'インスタントラーメン', 3, 4, NOW(), NOW()),
(9, '洗剤', 3, 5, NOW(), NOW());


/* # Insert product_tbl dummy data
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
        └── 8 ファブリーズ */

INSERT INTO product_tbl (
  product_id, product_name, description, price, stock, status,
  category_id, created_at, updated_at
)
VALUES
-- ## 野菜 (category_id = 6)
(1, 'キャベツ', '新鮮なキャベツです。', 128, 100, 1, 6, NOW(), NOW()),
(2, 'にんじん', '北海道産の甘いにんじん。', 98, 200, 1, 6, NOW(), NOW()),

-- ## 肉類 (category_id = 7)
(3, '鶏もも肉', '国産鶏のもも肉、300gパック。', 398, 50, 1, 7, NOW(), NOW()),
(4, '豚バラ肉', '厚切り豚バラスライス。', 428, 70, 1, 7, NOW(), NOW()),

-- ## インスタントラーメン (category_id = 8)
(5, '辛ラーメン', 'ピリ辛好きに人気のインスタント麺。', 148, 300, 1, 8, NOW(), NOW()),
(6, 'カップヌードル シーフード', '濃厚なシーフード味。', 198, 150, 0, 8, NOW(), NOW()),

-- ## 洗剤 (category_id = 9)
(7, 'アタックゼロ', '抗菌・消臭に優れた液体洗剤。', 298, 120, 1, 9, NOW(), NOW()),
(8, 'ファブリーズ', '衣類やカーテンに使える消臭スプレー。', 398, 80, 1, 9, NOW(), NOW());


/* # Insert product_image_tbl dummy data
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
            └── /uploads/8/10.jpg */
            
INSERT INTO product_image_tbl (
  product_image_id, src, product_id, created_at, updated_at
) 
VALUES
-- ## キャベツ (product_id = 1)
(1, '/uploads/products/1/1.jpg', 1, NOW(), NOW()),
(2, '/uploads/products/1/2.jpg', 1, NOW(), NOW()),

-- ## にんじん (product_id = 2)
(3, '/uploads/products/2/3.jpg', 2, NOW(), NOW()),

-- ## 鶏もも肉 (product_id = 3)
(4, '/uploads/products/3/4.jpg', 3, NOW(), NOW()),

-- ## 豚バラ肉 (product_id = 4)
(5, '/uploads/products/4/5.jpg', 4, NOW(), NOW()),
(6, '/uploads/products/4/6.jpg', 4, NOW(), NOW()),

-- ## 辛ラーメン (product_id = 5)
(7, '/uploads/products/5/7.jpg', 5, NOW(), NOW()),

-- ## カップヌードル シーフード (product_id = 6)
(8, '/uploads/products/6/8.jpg', 6, NOW(), NOW()),

-- ## アタックゼロ (product_id = 7)
(9, '/uploads/products/7/9.jpg', 7, NOW(), NOW()),

-- ## ファブリーズ (product_id = 8)
(10, '/uploads/products/8/10.jpg', 8, NOW(), NOW());


-- # Insert cart_tbl dummy data
INSERT INTO cart_tbl (
  member_id,
  product_id,
  quantity,
  public_cart_id,
  created_at,
  updated_at
) 
VALUES
-- ## Takeshi (회원 ID: 1) - キャベツ 2개, 鶏もも肉 1개
(1, 1, 2, NULL, NOW(), NOW()),
(1, 3, 1, NULL, NOW(), NOW()),

-- ## Ayumi (회원 ID: 2) - 辛ラーメン 5개, ファブリーズ 1개
(2, 5, 5, NULL, NOW(), NOW()),
(2, 8, 1, 2001, NOW(), NOW()),

-- ## Ren (회원 ID: 3) - にんじん 3개, アタックゼロ 2개
(3, 2, 3, NULL, NOW(), NOW()),
(3, 7, 2, NULL, NOW(), NOW());


-- # Insert order_tbl, order_detail_tbl dummy data
INSERT INTO order_tbl (order_id, member_id, payment, receiver, address, postcode, shipping_fee, total, status, created_at, updated_at) 
VALUES 
( 1, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 3270, 1, '2025-02-15 10:00:00', '2025-02-15 10:00:00' ),
( 2, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 2380, 1, '2025-02-07 10:00:00', '2025-02-07 10:00:00' ),
( 3, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 1686, 1, '2025-03-26 10:00:00', '2025-03-26 10:00:00' ),
( 4, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 2586, 1, '2025-03-25 10:00:00', '2025-03-25 10:00:00' ),
( 5, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 2222, 1, '2025-03-06 10:00:00', '2025-03-06 10:00:00' ),
( 6, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 1836, 1, '2025-04-08 10:00:00', '2025-04-08 10:00:00' ),
( 7, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 3428, 1, '2025-04-09 10:00:00', '2025-04-09 10:00:00' ),
( 8, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 2882, 1, '2025-04-17 10:00:00', '2025-04-17 10:00:00' ),
( 9, 1, 3, '佐藤 太郎', '東京都新宿区西新宿2-8-1', '160-0023', 200, 1778, 1, '2025-04-26 10:00:00', '2025-04-26 10:00:00' );

INSERT INTO order_detail_tbl (order_detail_id, order_id, product_id, public_cart_id, quantity, purchase_price, created_at, updated_at) 
VALUES 
( 1, 1, 8, NULL, 3, 398, '2025-02-15 10:00:00', '2025-02-15 10:00:00' ),
( 2, 1, 4, NULL, 3, 428, '2025-02-15 10:00:00', '2025-02-15 10:00:00' ),
( 3, 1, 5, NULL, 4, 148, '2025-02-15 10:00:00', '2025-02-15 10:00:00' ),
( 4, 2, 6, NULL, 3, 198, '2025-02-07 10:00:00', '2025-02-07 10:00:00' ),
( 5, 2, 3, NULL, 3, 398, '2025-02-07 10:00:00', '2025-02-07 10:00:00' ),
( 6, 2, 2, NULL, 4, 98, '2025-02-07 10:00:00', '2025-02-07 10:00:00' ),
( 7, 3, 7, NULL, 3, 298, '2025-03-26 10:00:00', '2025-03-26 10:00:00' ),
( 8, 3, 5, NULL, 4, 148, '2025-03-26 10:00:00', '2025-03-26 10:00:00' ),
( 9, 4, 7, NULL, 4, 298, '2025-03-25 10:00:00', '2025-03-25 10:00:00' ),
( 10, 4, 3, NULL, 3, 398, '2025-03-25 10:00:00', '2025-03-25 10:00:00' ),
( 11, 5, 1, NULL, 3, 128, '2025-03-06 10:00:00', '2025-03-06 10:00:00' ),
( 12, 5, 5, NULL, 3, 148, '2025-03-06 10:00:00', '2025-03-06 10:00:00' ),
( 13, 5, 8, NULL, 3, 398, '2025-03-06 10:00:00', '2025-03-06 10:00:00' ),
( 14, 6, 5, NULL, 3, 148, '2025-04-08 10:00:00', '2025-04-08 10:00:00' ),
( 15, 6, 7, NULL, 4, 298, '2025-04-08 10:00:00', '2025-04-08 10:00:00' ),
( 16, 7, 3, NULL, 4, 398, '2025-04-09 10:00:00', '2025-04-09 10:00:00' ),
( 17, 7, 5, NULL, 3, 148, '2025-04-09 10:00:00', '2025-04-09 10:00:00' ),
( 18, 7, 7, NULL, 4, 298, '2025-04-09 10:00:00', '2025-04-09 10:00:00' ),
( 19, 8, 6, NULL, 3, 198, '2025-04-17 10:00:00', '2025-04-17 10:00:00' ),
( 20, 8, 7, NULL, 3, 298, '2025-04-17 10:00:00', '2025-04-17 10:00:00' ),
( 21, 8, 3, NULL, 3, 398, '2025-04-17 10:00:00', '2025-04-17 10:00:00' ),
( 22, 9, 2, NULL, 3, 98, '2025-04-26 10:00:00', '2025-04-26 10:00:00' ),
( 23, 9, 4, NULL, 3, 428, '2025-04-26 10:00:00', '2025-04-26 10:00:00' );
