import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import formRoutes from './routes/form.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN||'').split(',') || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'src/uploads'));

app.use('/api/forms', formRoutes);
app.use('/api/forms', submissionRoutes);
app.use('/api', uploadRoutes);
app.use('/api/forms', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
