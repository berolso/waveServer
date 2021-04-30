
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
VALUES ('Starter Title', 1,
        '{"title":"This is The Title","date":"July 13, 2021","description":"Here''s some sample description of the instructional","image_url":"https://files.slack.com/files-pri/T01T4PK83QD-F02059B2ZU7/screen_shot_2019-12-20_at_8.46.04_pm.png?pub_secret=29411b058b","url_private_download":"https://files.slack.com/files-pri/T01T4PK83QD-F02059B2ZU7/download/screen_shot_2019-12-20_at_8.46.04_pm.png","permalink_public":"https://slack-files.com/T01T4PK83QD-F02059B2ZU7-29411b058b"}');

INSERT INTO elements (name, section_id, instructional_id, json)
VALUES ('element name', 1, 1,
        '{"element json": "info"}');

INSERT INTO applications (section_id, application_id, instructional_id)
VALUES (1, 1, 1);