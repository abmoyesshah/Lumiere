import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

let io;
try {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
} catch (error) {
  console.log('Socket.io initialization warning:', error.message);
}

app.use(cors());
app.use(express.json());

// Store active connections
const activeUsers = new Map();
const callRooms = new Map();

// Socket.io events
if (io) {
  io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join_chat', (data) => {
    const { userId, matchId } = data;
    socket.join(`chat_${userId}_${matchId}`);
    console.log(`User ${userId} joined chat with ${matchId}`);
  });

  socket.on('send_message', (data) => {
    const { senderId, receiverId, text } = data;
    io.to(`chat_${receiverId}_${senderId}`).emit('receive_message', {
      senderId,
      text,
      timestamp: new Date(),
    });
  });

  socket.on('initiate_call', (data) => {
    const { from, to } = data;
    const callRoom = `call_${[from, to].sort().join('_')}`;
    socket.join(callRoom);
    callRooms.set(socket.id, { callRoom, from, to });

    io.to(callRoom).emit('incoming_call', {
      from,
      caller: socket.id,
    });
  });

  socket.on('call_offer', (data) => {
    const { to, offer } = data;
    const callRoom = `call_${[socket.id, to].sort().join('_')}`;
    io.to(callRoom).emit('call_offer', {
      offer,
      from: socket.id,
    });
  });

  socket.on('call_answer', (data) => {
    const { to, answer } = data;
    const callData = callRooms.get(socket.id);
    if (callData) {
      const { callRoom } = callData;
      io.to(callRoom).emit('call_answered', {
        answer,
        from: socket.id,
      });
    }
  });

  socket.on('ice_candidate', (data) => {
    const { to, candidate } = data;
    const callData = callRooms.get(socket.id);
    if (callData) {
      const { callRoom } = callData;
      io.to(callRoom).emit('ice_candidate', {
        candidate,
        from: socket.id,
      });
    }
  });

  socket.on('end_call', (data) => {
    const callData = callRooms.get(socket.id);
    if (callData) {
      const { callRoom } = callData;
      io.to(callRoom).emit('call_ended');
      socket.leave(callRoom);
      callRooms.delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const callData = callRooms.get(socket.id);
    if (callData) {
      const { callRoom } = callData;
      io.to(callRoom).emit('call_ended');
      callRooms.delete(socket.id);
    }
  });
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.SOCKET_PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
