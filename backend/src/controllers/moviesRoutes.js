
import { Router } from 'express';
import prisma from '../prisma.js';
import { authenticate } from '../middlewares/auth.js';

const moviesRouter = Router();


const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};


moviesRouter.post('/movies', authenticate, adminOnly, async (req, res) => {
  const { title, description, duration, rating } = req.body;
  try {
    const movie = await prisma.movie.create({ data: { title, description, duration, rating } });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie' });
  }
});


moviesRouter.put('/movies/:id', authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, rating } = req.body;
  try {
    const movie = await prisma.movie.update({ where: { id }, data: { title, description, duration, rating } });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});


moviesRouter.delete('/movies/:id', authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.movie.delete({ where: { id } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});


moviesRouter.post('/theaters', authenticate, adminOnly, async (req, res) => {
  const { name, location } = req.body;
  try {
    const theater = await prisma.theater.create({ data: { name, location } });
    res.status(201).json(theater);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add theater' });
  }
});


moviesRouter.post('/schedules', authenticate, adminOnly, async (req, res) => {
  const { movieId, theaterId, startTime, endTime } = req.body;
  try {
    const schedule = await prisma.schedule.create({ data: { movieId, theaterId, startTime: new Date(startTime), endTime: new Date(endTime) } });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});


moviesRouter.get('/admin/reservations', authenticate, adminOnly, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { user: true, seat: true, schedule: true, ticket: true }
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

moviesRouter.put('/admin/reservations/:id/cancel', authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.update({ where: { id }, data: { status: 'CANCELLED' } });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

moviesRouter.get('/admin/transactions', authenticate, adminOnly, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({ include: { user: true, ticket: true } });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

moviesRouter.post('/admin/refunds', authenticate, adminOnly, async (req, res) => {
  const { transactionId, reason } = req.body;
  try {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'FAILED' }
    });
    res.json({ message: 'Refund issued', transaction, reason });
  } catch (err) {
    res.status(500).json({ error: 'Failed to issue refund' });
  }
});

// Example analytics dashboard
moviesRouter.get('/admin/reports', authenticate, adminOnly, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalMovies = await prisma.movie.count();
    const totalReservations = await prisma.reservation.count();
    const totalTransactions = await prisma.transaction.count();
    const totalRevenue = await prisma.transaction.aggregate({ _sum: { amount: true } });

    res.json({
      totalUsers,
      totalMovies,
      totalReservations,
      totalTransactions,
      totalRevenue: totalRevenue._sum.amount || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default moviesRouter;
