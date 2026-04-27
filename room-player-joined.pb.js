/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Get the room and user details
  const roomId = e.record.get("room_id");
  const userId = e.record.get("user_id");
  
  try {
    const room = $app.findRecordById("rooms", roomId);
    const user = $app.findRecordById("users", userId);
    
    if (!room || !user) {
      e.next();
      return;
    }
    
    // Get all players in the room
    const roomPlayers = $app.findRecordsByFilter("room_players", "room_id = '" + roomId + "'", {});
    
    // Send notification to all other players in the room
    for (const player of roomPlayers) {
      const otherUserId = player.get("user_id");
      
      // Don't send notification to the player who just joined
      if (otherUserId === userId) {
        continue;
      }
      
      try {
        const otherUser = $app.findRecordById("users", otherUserId);
        if (otherUser && otherUser.get("email")) {
          const message = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName
            },
            to: [{ address: otherUser.get("email") }],
            subject: "New Player Joined: " + room.get("room_name"),
            html: "<h2>New Player Joined!</h2><p><strong>" + user.get("name") + "</strong> has joined the room <strong>" + room.get("room_name") + "</strong>.</p><p>Room Code: " + room.get("room_code") + "</p>"
          });
          $app.newMailClient().send(message);
        }
      } catch (err) {
        // Continue even if notification fails for one player
      }
    }
  } catch (err) {
    // Continue execution even if notification fails
  }
  
  e.next();
}, "room_players");
