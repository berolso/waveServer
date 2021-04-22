

CREATE TABLE users (
  username VARCHAR(25),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1) PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_full_access BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  json JSON NOT NULL
);

CREATE TABLE instructionals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  section_id INTEGER REFERENCES sections ON DELETE SET NULL,
  json JSON NOT NULL
);

CREATE TABLE elements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  instructional_id INTEGER REFERENCES instructionals ON DELETE CASCADE,
  section_id INTEGER REFERENCES sections ON DELETE SET NULL,
  json JSON NOT NULL
);

Create TABLE applications (
  application_id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections ON DELETE SET NULL,
  element_id INTEGER REFERENCES elements ON DELETE SET NULL,
  instructional_id INTEGER REFERENCES instructionals ON DELETE SET NULL
)