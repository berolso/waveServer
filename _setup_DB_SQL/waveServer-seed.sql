
INSERT INTO users (username, password, first_name, last_name, email, phone_number, is_admin, is_full_access)
VALUES ('testbasic',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Basicfirst',
        'Basiclast',
        'basic@basic.com',
        '(555)342-2341',
        FALSE, FALSE),
       ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Userfirst',
        'userLast!',
        'user@user.com',
        '(555)342-2345',
        FALSE, TRUE),
        ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'admin@admin.com',
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