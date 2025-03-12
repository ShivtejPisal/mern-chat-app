const socketIo = (io) => {
  //Store connected users with their room information using socket.io as their key
  const connectedUsers = new Map();
  //HAndle new socket connections
  io.on("connection", (socket) => {
    //Get user from authentication
    const user = socket.handshake.auth.user;
    console.log("User connected", user?.username);

    //!START: Join room Header
    socket.on("join room", (groupId) => {
      //Add socket to the specified room
      socket.join(groupId);
      //Store user and room info in connectedUsers map
      connectedUsers.set(socket.id, { user, room: groupId });
      //Get kist of all users currently in the room
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((u) => u.room === groupId)
        .map((u) => u.user);
      //Emit updated users list to all clients in the room
      io.in(groupId).emit("users in room", usersInRoom);
      //Broadcast join notification to all other users in the room
      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user?.username} has joined`,
        user: user,
      });
    });
    //!END: Join Room Header

    //!START: Leave room Header
    //!END: Leave Room Header

    //!START: New Message room Header
    //!END: New Message Room Header

    //!START: Disconnect room Header
    //!END: Disconnect Room Header

    //!START: Typing Indicator
    //!END: Typing Indicator
  });
};

module.exports = socketIo;
