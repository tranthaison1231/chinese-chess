# Chinese Chess Game

## List Socket Event

- connection

```
// Server
io.on("connection", socket => )
```

- disconnect

```
// Server
socket.on("disconnect", () => {
  const user = userLeave(socket.id)

  if(user){
    io.to(user.room).emit("gameStatus", {

    })

    io.to(user.roomID).emit("roomUsers", {
      roomID: user.roomID,
      users: getRoomUsers(user.roomID)
    })
  }
})
```

- joinRoom

```
// Client
socket.emit('joinRoom', { username, roomID })


// Server
socket.on("joinRoom", { username, roomID } => {
  const user = userJoin(socket.id, username, roomID);
  socket.join(user.roomID)

  io.to(user.roomID).emit("roomUsers", {
    roomID: user.roomID,
    users: getRoomUsers(user.roomID)
  })

})
- roomUsers
```

// Client
socket.on('roomUsers', () => {

})

```
-

- playing
```

// Client
socket.emit("playing", {
value: value,
id: e.id,
name: name
})

// Server
socket.on("playing, msg => {
const user = getCurrentUser(socket.id)

io.to(user.roomID).emit("playing")
})

```
- gameStatus
```

// Client
socket.emit("gameStatus", {
status: "GAME_START",
userTurn: "userID"
})

// Server
socket.on("gameStatus", msg => {
io.to(user.roomID).emit("gameStatus", {

})
})

```

- gameOver
```

// Client
socket.emit("gameOver", {
winUser: "stast"
})

// Server
socket.on("gameOver", {
io.to(user.roomID).emit("gameStatus", () => {
status: "GAME_OVER",
winUser: ""
})
})

```
## Ref

- https://www.youtube.com/watch?v=LpSvzaPsnVI
```
