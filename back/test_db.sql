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