import express from 'express';
import router from './src/routes/users.js';
import moviesRouter from './src/controllers/moviesRoutes.js';
import CostumerRouter from './src/controllers/costumerRoutes.js';
import cors from "cors"



const app = express(); 
app.use(cors());
app.use(express.json());

app.use('/users', router);
app.use('/api', moviesRouter);
app.use('/api/custumer', CostumerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
