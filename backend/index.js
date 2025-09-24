import express from 'express';
import router from './src/routes/users.js';
import moviesRouter from './src/controllers/moviesRoutes.js';


const app = express();
app.use(express.json());

app.use('/users', router);
app.use('/api', moviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
