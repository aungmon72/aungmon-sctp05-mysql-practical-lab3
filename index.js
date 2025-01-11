//  2.0 Creating the Express App

const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();

//  4.0 Connecting to the Database using MySQL2

const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// require in handlebars and their helpers
const helpers = require('handlebars-helpers');
// tell handlebars-helpers where to find handlebars
helpers({
    'handlebars': hbs.handlebars
})

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    const [customers] = await connection.execute({
        'sql':`
        SELECT * from Customers
            JOIN Companies ON Customers.company_id = Companies.company_id;
        `,
        nestTables: true

    });

    app.get('/', (req,res) => {
        res.send('Hello, World!');
    });

    //  5.1 Creating the route to view all the customers
    app.get('/customers', async (req, res) => {
        let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
        console.log(customers);
        res.render('customers/index', {
            'customers': customers
        })
    })

    // app.get('/customers/create', async(req,res)=>{
    //     let [companies] = await connection.execute('SELECT * from Companies');
    //     console.log(companies);
    //     res.render('customers/add', {
    //         'companies': companies
    //     })
    // })
    


    // app.get('/customers/create', async(req,res)=>{
    //     let [companies] = await connection.execute('SELECT * from Companies');
    //     res.render('customers', {
    //         'companies': companies
    //     })
    // })

    //  6. Creating Many to Many Relationship
    app.get('/customers/create', async(req,res)=>{
        let [companies] = await connection.execute('SELECT * from Companies');
        let [employees] = await connection.execute('SELECT * from Employees');
        console.log(companies);
        console.log(employees);
        res.render('customers/add', {
            'companies': companies,
            'employees': employees
        })
    })    

    app.post('/customers/create', async(req,res)=>{
        let {first_name, last_name, rating, company_id} = req.body;
        let query = 'INSERT INTO Customers (first_name, last_name, rating, company_id) VALUES (?, ?, ?, ?)';
        let bindings = [first_name, last_name, rating, company_id];
        await connection.execute(query, bindings);
        res.redirect('/customers');
    })

    app.get('/customers/:customer_id/edit', async (req, res) => {
        let [customers] = await connection.execute('SELECT * from Customers WHERE customer_id = ?', [req.params.customer_id]);
        let [companies] = await connection.execute('SELECT * from Companies');
        let customer = customers[0];
        console.log(customers);
        console.log(companies);
        console.log(customer);
        res.render('customers/edit', {
            'customer': customer,
            'companies': companies
        })
    })

    // app.post('/customers/:customer_id/edit', async (req, res) => {
    //     let {first_name, last_name, rating, company_id} = req.body;
    //     let query = 'UPDATE Customers SET first_name=?, last_name=?, rating=?, company_id=? WHERE customer_id=?';
    //     let bindings = [first_name, last_name, rating, company_id, req.params.customer_id];
    //     await connection.execute(query, bindings);
    //     res.redirect('/customers');
    // })

    // 5.5  Processing the Update
    app.post('/customers/:customer_id/edit', async (req, res) => {
        let {first_name, last_name, rating, company_id} = req.body;
        let query = 'UPDATE Customers SET first_name=?, last_name=?, rating=?, company_id=? WHERE customer_id=?';
        let bindings = [first_name, last_name, parseInt(rating), company_id, req.params.customer_id];
        await connection.execute(query, bindings);
        res.redirect('/customers');
    })
    
    //  8.1 Implement a Route to Show a Confirmation Form
    app.get('/customers/:customer_id/delete', async function(req,res){
        // display a confirmation form 
        const [customers] = await connection.execute(
            "SELECT * FROM Customers WHERE customer_id =?", [req.params.customer_id]
        );
        const customer = customers[0];
        console.log(customers);
        console.log(customer);
        res.render('customers/delete', {
            customer
        })

    })

    //  8.2 Process the Delete
    app.post('/customers/:customer_id/delete', async function(req, res){
        await connection.execute(`DELETE FROM Customers WHERE customer_id = ?`, [req.params.customer_id]);
        res.redirect('/customers');
    })

    app.listen(3000, ()=>{
        
        console.log('Server is running')
    });
}

main();
