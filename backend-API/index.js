require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const gameListRoutes = require('./routes/gameListRoutes');
const genreRoutes = require('./routes/genreRoutes');

const app = express();
const port = 3000;

//middlewares
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/gamelist', gameListRoutes);
app.use('/api/genre', genreRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});



app.listen (port, () => {
    console.log(`Serveur online at http://localhost:${port}`);
});
