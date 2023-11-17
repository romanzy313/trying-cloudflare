-- Migration number: 0001 	 2023-11-16T22:51:00.454Z
DROP TABLE IF EXISTS Business;

CREATE TABLE
    IF NOT EXISTS Business (id INTEGER PRIMARY KEY, name TEXT);

INSERT INTO
    Business (id, name)
VALUES
    (1, 'Alfreds Futterkiste'),
    (2, 'Around the Horn'),
    (3, 'Bs Beverages');

-- messes up here 
DROP TABLE IF EXISTS Customers;

CREATE TABLE
    IF NOT EXISTS Customer (
        id INTEGER PRIMARY KEY,
        companyId INT,
        contactName TEXT,
        FOREIGN KEY (companyId) REFERENCES Business (id)
    );

INSERT INTO
    Customer (id, companyId, contactName)
VALUES
    (1, 1, 'Maria Anders'),
    (4, 2, 'Thomas Hardy'),
    (11, 3, 'Victoria Ashworth'),
    (13, 3, 'Random Name');