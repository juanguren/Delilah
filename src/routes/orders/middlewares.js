
const uuid = require("uuid");
const { sequelize, Sequelize } = require("../../../server");
const { orderTime, generateArrivalTime } = require("../../utils/methods");

const isUserLoggedIn = (req, res, next) =>{
    const username = req.params.loggedUser;
    sequelize.query('SELECT username from users WHERE username = :username AND isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username
        }
    }).then((response) =>{
        if (response[0].username === username) {
            next();
        } else{
            res.status(400).json({err: "Incorrect user credentials"});
        }
    }).catch(err => res.status(400).json(err))
}

const checkStock = (req, res, next) =>{ // ! TODO: Check its behaviour with multiple items
    const order = req.body;

    order.items.map((all) =>{
        let id = all.id;
        let ordered_quantity = all.quantity;
        sequelize.query('SELECT quantity FROM items WHERE item_id = :id', {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { id }
        }).then((res) =>{
            res.map((values) =>{
                let { quantity } = values;
                let finalQuantity = quantity - ordered_quantity;
                if (finalQuantity <= 0) {
                    res.status(404).json({err: 'Item is out of stock'});
                } else {
                    sequelize.query('UPDATE items SET quantity = :finalQuantity WHERE item_id = :id', {
                        replacements: { finalQuantity, id }
                    }).then(() =>{
                        next();
                    }).catch(e => res.status(400).json(e))
                }
            })
        }).catch(e => res.status(400).json(e))
    })
}

const makeOrder = (req, res, next) =>{
    const user = req.params.loggedUser;
    sequelize.query('SELECT user_id FROM users WHERE username = :user',{
        type: Sequelize.QueryTypes.SELECT,
        replacements:{
            user
        }
    }).then((res) =>{
        const {user_id} = res[0];
        const order_uuid = uuid.v4();
        
        if (user_id) {
            sequelize.query('INSERT INTO orders VALUES(NULL, :order_time, :arrival_time, :order_status, NULL, :user_id, :order_uuid)',{
                replacements: {
                    order_time: orderTime(),
                    arrival_time: generateArrivalTime(),
                    order_status: "PENDING",
                    user_id,
                    order_uuid
                }
            }).then((res) =>{
                req.params.orderId = order_uuid;
                next();
            })
        }
    }).catch(err => res.status(400).json(err));
}

const sendOrderItems = (req, res, next) =>{
    const order = req.body;
    const order_uuid = req.params.orderId;

    sequelize.query('SELECT order_id FROM orders WHERE order_uuid = :order_id',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: { order_id: order_uuid }
    }).then((response) =>{
        const {order_id} = response[0];

        order.items.map((all) =>{
            let item_id = all.id;
            let ordered_quantity = all.quantity;

            sequelize.query('INSERT INTO order_items VALUES(NULL, :order_id, :item_id, :ordered_quantity)',{
                replacements: {
                    order_id,
                    item_id,
                    ordered_quantity
                }
            }).then((response) =>{
                try {
                    next();
                } catch (error) {
                    res.status(400).json(error)
                }
            }).catch(err => res.status(400).json(err))
        })
    }).catch(err => res.status(400).json(err))
}

const isAdminLoggedIn = (req, res, next) =>{
    const username = req.params.loggedUser;
    sequelize.query('SELECT username from admin WHERE username = :username AND isLogged = "true"',{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            username
        }
    }).then((response) =>{
        if (response[0].username === username) {
            next();
        } else{
            res.status(400).json({err: "Incorrect user credentials"});
        }
    }).catch(err => res.status(400).json({msg: "No admin authenticated"}));
}

const orderbyID = (req, res, next) => {
    let ID = req.params.id;

    sequelize.query(`SELECT order_id FROM orders where order_uuid = :id`,{
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            id: ID
        }
    }).then((orders) =>{
        const { order_id } = orders[0];
        sequelize.query(
        `SELECT items.name as Items, items.price, items.photo_url, o.*
        FROM items
        INNER JOIN order_items ON items.item_id = order_items.item_id
        INNER JOIN orders o ON o.order_id = order_items.order_id
        WHERE o.order_id = :order_id`, 
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { order_id }
        }).then((order) =>{
            req.params.found = order;
            next();
        })
        .catch(() => res.status(400).json({err: 'Order not found'}))
    }).catch(() => res.status(400).json({err: 'Order not found'}));
}

const cancelOrder = (req, res, next) =>{
    const id = req.params.id;
    const { reason } = req.body;

    if(reason){
        sequelize.query('SELECT order_id FROM orders WHERE order_uuid = :order_id', {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { order_id : id }
        }).then((response) =>{
            const { order_id } = response[0];
            sequelize.query('INSERT INTO canceled_order VALUES(:order_id, :reason, :time)',{
                replacements: {
                    order_id,
                    reason,
                    time: orderTime()
                }
            }).then(() => { next(); })
        }).catch((error) => res.status(400).json({msg: 'Couldn´t update order as cancelled', error}))

    } else { res.status(404).json({msg: 'No reason provided'}) }
}

const updateOrderStatus = (req, res, next) =>{
    const order_status = req.params.status;
    order_status.toUpperCase();

    const acceptedStatus = [
        'PENDING',
        'IN_PROGRESS'
    ]
    acceptedStatus.includes(order_status) ? next() : res.status(400).json({msg: 'Incorrect status entry. Please input a valid one', acceptedStatus});
}

module.exports = 
{
    isUserLoggedIn,
    checkStock,
    makeOrder,
    sendOrderItems,
    isAdminLoggedIn,
    orderbyID,
    cancelOrder,
    updateOrderStatus
}