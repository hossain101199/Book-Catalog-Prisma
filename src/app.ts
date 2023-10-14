import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing
app.get('/', async (req: Request, res: Response) => {
  // throw new Error('Testing error logger')
  res.send('Hello from Book Catalog');
});

// Application routes
app.use('/api/v1', routes);

// global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [{ path: req.originalUrl, message: 'API Not Found' }],
  });
});

export default app;
