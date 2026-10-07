import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDatabase,
  saveAnalysisToDb,
  getAllAnalysesFromDb,
  getAnalysisByIdFromDb,
  deleteAnalysisFromDb,
  getAdminStatsFromDb,
  AnalysisRecord
} from './server/db';
import { analyzeMedicalTextWithGemini } from './server/gemini';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize SQLite database
  await getDatabase();
  console.log('✅ SQLite database initialized.');

  // 1. Health check endpoint
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const stats = await getAdminStatsFromDb();
      res.json({
        status: 'ok',
        service: 'MedExplain API',
        timestamp: new Date().toISOString(),
        database: 'SQLite',
        totalAnalyses: stats.totalAnalyses,
        hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // 2. Analyze medical text endpoint
  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      const { text, explanationLevel = 'simple', language = 'English', saveToHistory = true } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Please provide medical text or a report to analyze.' });
      }

      if (text.trim().length < 10) {
        return res.status(400).json({ error: 'The provided medical text is too short. Please provide a more detailed excerpt.' });
      }

      // Call Gemini 3.8 Flash
      const aiResult = await analyzeMedicalTextWithGemini({
        text,
        explanationLevel: explanationLevel === 'detailed' ? 'detailed' : 'simple',
        language: language || 'English',
      });

      const record: AnalysisRecord = {
        id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: aiResult.title,
        original_text: text,
        explanation_level: explanationLevel === 'detailed' ? 'detailed' : 'simple',
        language: language || 'English',
        category: aiResult.category,
        simple_explanation: aiResult.simpleExplanation,
        key_information: aiResult.keyInformation,
        medical_terms: aiResult.medicalTerms,
        doctor_questions: aiResult.doctorQuestions,
        created_at: new Date().toISOString(),
      };

      if (saveToHistory) {
        await saveAnalysisToDb(record);
      }

      res.json({
        success: true,
        data: record,
      });
    } catch (err: any) {
      console.error('Error in /api/analyze:', err);
      res.status(500).json({
        error: 'Failed to analyze medical text',
        details: err?.message || 'Internal AI service error'
      });
    }
  });

  // 3. Save analysis endpoint
  app.post('/api/save', async (req: Request, res: Response) => {
    try {
      const record: AnalysisRecord = req.body;
      if (!record || !record.id || !record.original_text) {
        return res.status(400).json({ error: 'Invalid analysis record data' });
      }
      await saveAnalysisToDb(record);
      res.json({ success: true, id: record.id });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save analysis', details: err.message });
    }
  });

  // 4. Get history endpoint
  app.get('/api/history', async (_req: Request, res: Response) => {
    try {
      const list = await getAllAnalysesFromDb();
      res.json({ success: true, count: list.length, data: list });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
  });

  // 5. Get analysis by ID endpoint
  app.get('/api/history/:id', async (req: Request, res: Response) => {
    try {
      const record = await getAnalysisByIdFromDb(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Analysis record not found' });
      }
      res.json({ success: true, data: record });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch record', details: err.message });
    }
  });

  // 6. Delete analysis by ID endpoint
  app.delete('/api/history/:id', async (req: Request, res: Response) => {
    try {
      await deleteAnalysisFromDb(req.params.id);
      res.json({ success: true, message: 'Record deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete record', details: err.message });
    }
  });

  // 7. Admin / Demo statistics endpoint
  app.get('/api/admin/stats', async (_req: Request, res: Response) => {
    try {
      const stats = await getAdminStatsFromDb();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MedExplain server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start MedExplain server:', err);
});
