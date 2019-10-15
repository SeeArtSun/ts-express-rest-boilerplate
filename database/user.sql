CREATE TABLE user (
  id          VARCHAR(36)   NOT NULL,
  name        VARCHAR(20),
  phonenumber VARCHAR(15),
  birthday    VARCHAR(8),
  status      VARCHAR(15),

  CONSTRAINT USER_PK PRIMARY KEY (id)
);

INSERT INTO user
  (id, name, phonenumber, birthday, status)
VALUES
  ('user-01', 'sunmi', '01091910753', '19880518', 'verified'),
  ('user-02', 'mj', NULL, NULL, 'guest')
;
