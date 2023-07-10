const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://Ranjith:Ranjith123@cluster0.mdzkluf.mongodb.net/crud?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));
  const customerSchema = new mongoose.Schema({
    id: {
      type: Number,
      unique: true
    },
    code: String,
    name: String,
    email: String,
    phone: String
  });
  
    
  const Customer = mongoose.model('Customer', customerSchema);
  // Get all customers
app.get('/customers', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get a specific customer by ID
  app.get('/customers/:id', async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Create a new customer
  let customerIdCounter = 0; // Counter to keep track of the last assigned customer ID

app.post('/customers', async (req, res) => {
  try {
    customerIdCounter++; // Increment the counter
    const customer = new Customer({
      id: customerIdCounter,
      code: req.body.code,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    await customer.save();
    res.status(201).json({ message: 'added', customer });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


   
  // Update a customer
  app.put('/customers/:id', async (req, res) => {
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete a customer
  app.delete('/customers/:id', async (req, res) => {
    try {
      const deletedCustomer = await Customer.findOneAndDelete({ id: req.params.id });
      if (deletedCustomer) {
        res.json({ message: 'Customer deleted successfully' });
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  const port = 3000; // Change this to the desired port number
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
    