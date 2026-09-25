-- Zodiya MySQL schema. Ids stay 24-char hex so ids migrated from MongoDB
-- (and any link or token that carries one) keep working unchanged.

CREATE TABLE IF NOT EXISTS users (
    id CHAR(24) NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    notifications JSON NOT NULL DEFAULT (JSON_OBJECT('daily', TRUE, 'transits', TRUE, 'retro', FALSE, 'deliveryTime', '07:30')),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS profiles (
    id CHAR(24) NOT NULL PRIMARY KEY,
    user_id CHAR(24) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_name VARCHAR(255) NULL,
    avatar VARCHAR(32) NULL,
    birth_date CHAR(10) NOT NULL,
    birth_time CHAR(5) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    lat DOUBLE NOT NULL,
    lon DOUBLE NOT NULL,
    tzone DOUBLE NOT NULL,
    timezone_id VARCHAR(64) NOT NULL,
    zodiac_sign VARCHAR(16) NOT NULL,
    relationship VARCHAR(16) NOT NULL DEFAULT 'self',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    share_token VARCHAR(64) NULL,
    -- one primary profile per user: NULL for the rest, and NULLs never collide
    primary_user_id CHAR(24) GENERATED ALWAYS AS (IF(is_primary, user_id, NULL)) VIRTUAL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    KEY profiles_user_idx (user_id),
    UNIQUE KEY profiles_share_token_unique (share_token),
    UNIQUE KEY profiles_one_primary_per_user (primary_user_id),
    CONSTRAINT profiles_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id CHAR(24) NOT NULL PRIMARY KEY,
    user_id CHAR(24) NOT NULL,
    expires_at DATETIME(3) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    KEY refresh_tokens_user_idx (user_id),
    KEY refresh_tokens_expires_idx (expires_at),
    CONSTRAINT refresh_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- stands in for mongo's TTL index; the app already ignores expired rows
CREATE EVENT IF NOT EXISTS purge_expired_refresh_tokens
    ON SCHEDULE EVERY 1 HOUR
    DO DELETE FROM refresh_tokens WHERE expires_at < UTC_TIMESTAMP(3);
