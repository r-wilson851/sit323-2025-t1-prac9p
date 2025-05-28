const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

// Connect MongoDB & use password + username
mongoose.connect(`mongodb://${username}:${password}@mongo:27017/mydatabase?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("Connecting mongo as ");

// Creates item schema in Mongoose
const Item = mongoose.model('Item', new mongoose.Schema({ name: String }));

// Routes
app.post('/items', async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  res.send(item);
});

app.get('/items', async (req, res) => {

  console.log("GET test");

  const items = await Item.find();
  res.send(items);
});

// DELETE /items/:id — remove an item
app.delete('/items/:id', async (req, res) => {

  console.log("delete item received with ID: ",req.params.id )

  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send({ error: 'Not found' });
  res.send(item);
});

// UPDATE  /items/:id — update an item’s name
app.put('/items/:id', async (req, res) => {

  console.log("update/put received with ID: ",req.params.id )

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }               // return the updated doc
  );
  if (!item) return res.status(404).send({ error: 'Not found' });
  res.send(item);
});


app.listen(3000, () => console.log('app now running on port 3000'));
