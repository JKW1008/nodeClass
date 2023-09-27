CREATE TABLE people (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(100) NOT NULL DEFAULT '',
    user_password VARCHAR(1000) NULL DEFAULT '',
    user_name VARCHAR(50) NULL DEFAULT '',
    user_image VARCHAR(1000) NULL DEFAULT '',
    user_provider VARCHAR(50) NULL DEFAULT '',
    PRIMARY KEY (user_id),
    UNIQUE INDEX user_email (user_email)
)
COLLATE='utf8mb4_general_ci';
