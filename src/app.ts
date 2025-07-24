import express from 'express';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());


const PORT = process.env.PORT
dotenv.config();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); 
});

