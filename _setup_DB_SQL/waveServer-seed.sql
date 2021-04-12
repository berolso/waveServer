
INSERT INTO users (username, password, first_name, last_name, email, phone_number, is_admin, is_full_access)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Testfirst',
        'testlast',
        'test@gmail.com',
        '(555)342-2341',
        FALSE, FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        '(555)342-2342',
        TRUE, TRUE);

INSERT INTO sections (name, json)
VALUES ('section name',
        '{"section json": "info"}');

INSERT INTO instructionals (name, section_id, json)
VALUES ('isntructional name', 1,
        '{"isntructional json": "info"}');

INSERT INTO elements (name, section_id, instructional_id, json)
VALUES ('element name', 1, 1,
        '{"element json": "info"}');

INSERT INTO applications (section_id, application_id, instructional_id)
VALUES (1, 1, 1);