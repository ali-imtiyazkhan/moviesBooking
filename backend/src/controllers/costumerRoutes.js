import { Router } from 'express';
import prisma from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middlewares/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const CostumerRouter = Router();



CostumerRouter.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "Account created", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Failed to register user" });
    }
});


CostumerRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Failed to login" });
    }
});


CostumerRouter.get('/movies', authenticate, async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    } catch {
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});


CostumerRouter.get('/movies/:id', authenticate, async (req, res) => {
    try {
        const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        res.json(movie);
    } catch {
        res.status(500).json({ error: "Failed to fetch movie" });
    }
});


CostumerRouter.get('/schedules/:movieId', authenticate, async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany({
            where: { movieId: req.params.movieId },
            include: { theater: true }
        });
        res.json(schedules);
    } catch {
        res.status(500).json({ error: "Failed to fetch schedules" });
    }
});

CostumerRouter.post('/theaters/:theaterId/seats', authenticate, async (req, res) => {
    const { theaterId } = req.params;
    const { rows = 5, seatsPerRow = 6, vipRows = 1 } = req.body;

    try {
        const createdSeats = [];

        for (let r = 1; r <= rows; r++) {
            for (let s = 1; s <= seatsPerRow; s++) {
                const seat = await prisma.seat.create({
                    data: {
                        theaterId,
                        row: String.fromCharCode(64 + r),
                        number: s,
                        isVip: r <= vipRows,
                    },
                });
                createdSeats.push(seat);
            }
        }

        res.status(201).json({ message: "Seats created", seats: createdSeats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create seats" });
    }
});



CostumerRouter.get('/seats/:scheduleId', authenticate, async (req, res) => {
    try {
        const { scheduleId } = req.params;

        const schedule = await prisma.schedule.findUnique({
            where: { id: scheduleId }
        });
        if (!schedule) return res.status(404).json({ error: "Schedule not found" });

        const seats = await prisma.seat.findMany({
            where: { theaterId: schedule.theaterId },
            include: { reservations: true }
        });

        const availableSeats = seats.filter(seat =>
            !seat.reservations.some(r => r.scheduleId === scheduleId)
        );

        res.json(availableSeats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch seats" });
    }
});


CostumerRouter.post('/reservations', authenticate, async (req, res) => {
    const { scheduleId, seatIds } = req.body;

    if (!scheduleId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({ error: "scheduleId and seatIds (array) are required" });
    }

    try {
        const seats = await prisma.seat.findMany({
            where: { id: { in: seatIds } }
        });

        if (seats.length !== seatIds.length) {
            return res.status(400).json({ error: "One or more seats are invalid" });
        }

        const existingReservations = await prisma.reservation.findMany({
            where: {
                scheduleId,
                seatId: { in: seatIds }
            }
        });

        if (existingReservations.length > 0) {
            const reservedSeatIds = existingReservations.map(r => r.seatId);
            return res.status(400).json({ error: "Some seats are already reserved", reservedSeatIds });
        }

        const reservations = await Promise.all(
            seatIds.map(seatId =>
                prisma.reservation.create({
                    data: {
                        userId: req.user.id,
                        scheduleId,
                        seatId,
                        status: 'CONFIRMED'
                    }
                })
            )
        );

        res.status(201).json({
            message: "Seats reserved successfully",
            reservations
        });
    } catch (err) {
        console.error("Reservation error:", err);
        res.status(500).json({ error: "Failed to reserve seat" });
    }
});


CostumerRouter.post('/payments', authenticate, async (req, res) => {
    const { amount, reservationId } = req.body;
    try {
        const transaction = await prisma.transaction.create({
            data: { userId: req.user.id, reservationId, amount, status: 'SUCCESS' }
        });
        res.json({ message: "Payment successful", transaction });
    } catch {
        res.status(500).json({ error: "Payment failed" });
    }
});

CostumerRouter.post('/tickets', authenticate, async (req, res) => {
    try {
        const { reservationId } = req.body;

        if (!reservationId) {
            return res.status(400).json({ error: "Reservation ID is required" });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { schedule: { include: { movie: true } } }
        });

        const ticket = await prisma.ticket.create({
            data: {
                userId: req.user.id,
                reservationId: reservation.id,
                scheduleId: reservation.scheduleId,
            }
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error("Ticket creation error:", error);
        res.status(500).json({ error: "Failed to create ticket" });
    }
});



CostumerRouter.post("/tickets", authenticate, async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "reservationId is required" });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { reservationId }
    });

    if (existingTicket) {
      return res.status(200).json({
        message: "Ticket already exists",
        ticket: existingTicket
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        reservationId,
        userId: reservation.userId,
        scheduleId: reservation.scheduleId,
        issuedAt: new Date(),
      }
    });

    res.status(201).json(ticket);

  } catch (err) {
  console.error("Ticket creation error full log:", JSON.stringify(err, null, 2));
  res.status(500).json({ error: "Failed to create ticket", details: err.message || err });
}
});




CostumerRouter.get('/tickets', authenticate, async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            where: { userId: req.user.id },
            include: {
                reservation: {
                    include: {
                        schedule: {
                            include: {
                                movie: true,
                                theater: true,
                            }
                        }
                    }
                }
            }
        });
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});




CostumerRouter.get('/tickets/:id', authenticate, async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: req.params.id },
            include: {
                reservation: {
                    include: {
                        schedule: {
                            include: {
                                movie: true
                            }
                        }
                    }
                }
            }
        });
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch ticket" });
    }
});

CostumerRouter.get('/getTheater', authenticate, async (req, res) => {
    try {
        const theaters = await prisma.theater.findMany();
        res.status(200).json({
            success: true,
            data: theaters
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch the theaters"
        });
    }
});

export default CostumerRouter;
