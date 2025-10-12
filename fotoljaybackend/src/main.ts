import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './modules/Auth/AuthRoute.js';
import userRoute from './modules/Utilisateur/UserRoute.js';
import routesProduits from './modules/produits/ProduitsRoute.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/produits', routesProduits);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;