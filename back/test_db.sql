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