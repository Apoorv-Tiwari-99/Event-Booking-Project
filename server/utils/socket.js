// utils/socket.js
export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join event room for real-time updates
    socket.on('join-event', (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`Socket ${socket.id} joined event-${eventId}`);
    });

    // Leave event room
    socket.on('leave-event', (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`Socket ${socket.id} left event-${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export const emitSeatUpdate = (io, eventId, eventData) => {
  io.to(`event-${eventId}`).emit('seat-update', {
    eventId,
    ...eventData
  });
  console.log(`Emitted seat update for event ${eventId}`);
};