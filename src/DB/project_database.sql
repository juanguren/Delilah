
/* users - table query*/
CREATE TABLE users(
    user_id int primary key AUTO_INCREMENT,
    fullName varchar(20) not null,
    email varchar(20) not null,
    phone varchar(20) not null,
    user_address varchar(20) not null,
    user_password varchar(20) not null,
    username varchar(20) not null,
    is_admin varchar(5) not null
)

/* super_admin - table query */
CREATE TABLE super_admin (
	super_id int PRIMARY KEY,
    fullName varchar(20) not null,
    super_address varchar(25) not null,
)

/* admin - table query*/
CREATE TABLE admin(

)

/* items - table query*/
CREATE TABLE items (
	item_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(40) NOT NULL,
    photo_url varchar(250) NOT NULL,
    price int NOT NULL,
    description varchar(80) NOT NULL,
    cooking_time time NOT NULL,
    quantity int NOT NULL
)

/* canceled_order - table query*/
CREATE TABLE canceled_order(
    canceled_order_id int primary key AUTO_INCREMENT,
    canceling_reason varchar(max),
    canceling_time smalldatetime
)

/* orders - table query*/
CREATE TABLE orders(
    order_id int primary key AUTO_INCREMENT,
    order_time smalldatetime not null,
    arrival_time smalldatetime not null,
    canceled_order_id int,
    user_id int,
    FOREIGN KEY user_id REFERENCES users(user_id),
    FOREIGN KEY canceled_order_id REFERENCES canceled_order(canceled_order_id)
)

/* order_items - table query*/
CREATE TABLE order_items(
    order_item_id int primary key AUTO_INCREMENT,
    order_id int,
    item_id int,
    FOREIGN KEY user_id REFERENCES users(user_id),
    FOREIGN KEY item_id REFERENCES items(item_id)
)

"The SQL EXISTS Operator
The EXISTS operator is used to test for the existence of any record in a subquery.

The EXISTS operator returns true if the subquery returns one or more records.

EXISTS Syntax
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);"



/* =============  OPTIONAL TABLES =============  */

/* pickers - table query */
CREATE TABLE pickers(
    fullName varchar(30) not null,
    email varchar(20) not null,
    phone varchar(15) not null,
    address varchar(20) not null,
    password varchar(20) not null,
    security_number int PRIMARY KEY NOT NULL,
    restaurants_id int,
    FOREIGN KEY (restaurants_id) REFERENCES restaurants (restaurants_id)
)

/* restaurant_picker - table query */
CREATE TABLE restaurant_picker(
	RP_id int PRIMARY KEY AUTO_INCREMENT,
    restaurants_id int,
    security_number int,
    FOREIGN KEY (restaurants_id) REFERENCES restaurants (restaurants_id),
	FOREIGN KEY (security_number) REFERENCES pickers (security_number)
)
