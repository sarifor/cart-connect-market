-- # カート

INSERT INTO cart_tbl (member_id, product_id, quantity, public_cart_id, created_at, updated_at) VALUES
-- アスパラガス、キャベツ、サバ、ジェラート、ソーセージ、ボロネーゼ
(1, 52, 3, NULL, '2025-02-01 09:00:00', '2025-02-01 09:00:00'),
(1, 1, 2, NULL, '2025-02-01 09:03:00', '2025-02-01 09:03:00'),
(1, 5, 1, NULL, '2025-02-01 09:06:00', '2025-02-01 09:06:00'),
(1, 30, 1, NULL, '2025-02-01 09:09:00', '2025-02-01 09:09:00'),
(1, 44, 1, NULL, '2025-02-01 09:12:00', '2025-02-01 09:12:00'),
(1, 54, 1, NULL, '2025-02-01 09:15:00', '2025-02-01 09:15:00'),

-- バナナ、卵、春雨
(2, 24, 1, NULL, '2025-02-01 09:18:00', '2025-02-01 09:18:00'),
(2, 66, 1, NULL, '2025-02-01 09:21:00', '2025-02-01 09:21:00'),
(2, 45, 1, NULL, '2025-02-01 09:24:00', '2025-02-01 09:24:00'),

-- うどん麺、れんこん、エリンギ、パスタ麵
(3, 64, 1, NULL, '2025-02-01 09:27:00', '2025-02-01 09:27:00'),
(3, 65, 1, NULL, '2025-02-01 09:30:00', '2025-02-01 09:30:00'),
(3, 15, 1, NULL, '2025-02-01 09:33:00', '2025-02-01 09:33:00'),
(3, 9, 2, NULL, '2025-02-01 09:36:00', '2025-02-01 09:36:00'),

-- きゅうり、キャンディー、ハンバーグ、ホルモン、春雨
(4, 39, 1, NULL, '2025-02-01 09:39:00', '2025-02-01 09:39:00'),
(4, 38, 1, NULL, '2025-02-01 09:42:00', '2025-02-01 09:42:00'),
(4, 7, 1, NULL, '2025-02-01 09:45:00', '2025-02-01 09:45:00'),
(4, 84, 2, NULL, '2025-02-01 09:48:00', '2025-02-01 09:48:00'),
(4, 66, 2, NULL, '2025-02-01 09:51:00', '2025-02-01 09:51:00'),

-- いちご、ゼリー、メロンパン
(5, 20, 2, NULL, '2025-02-01 09:54:00', '2025-02-01 09:54:00'),
(5, 58, 1, NULL, '2025-02-01 09:57:00', '2025-02-01 09:57:00'),
(5, 81, 1, NULL, '2025-02-01 10:00:00', '2025-02-01 10:00:00');