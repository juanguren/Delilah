
/* user - table query*/


/* items - table query*/
CREATE TABLE items (
	items_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(40) NOT NULL,
    photo_url varchar(250) NOT NULL,
    price int NOT NULL,
    description varchar(80) NOT NULL,
    cooking_time time NOT NULL,
    restaurants_id int,
    FOREIGN KEY (restaurants_id) REFERENCES restaurants (restaurants_id)
)

/* restaurants - table query*/
CREATE TABLE restaurants (
	restaurants_id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(20) not null,
    description varchar(100),
    address varchar(25) not null,
    category varchar(15) not null,
    state varchar(8) not null
)
