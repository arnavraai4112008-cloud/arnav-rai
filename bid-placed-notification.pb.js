/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Get bid details
  const playerId = e.record.get("player_id");
  const userId = e.record.get("user_id");
  const bidAmount = e.record.get("bid_amount");
  const roomId = e.record.get("room_id");
  
  try {
    // If room_id is not set, skip notification
    if (!roomId) {
      e.next();
      return;
    }
    
    const room = $app.findRecordById("rooms", roomId);
    const player = $app.findRecordById("players", playerId);
    const bidder = $app.findRecordById("users", userId);
    
    if (!room || !player || !bidder) {
      e.next();
      return;
    }
    
    // Get all players in the room
    const roomPlayers = $app.findRecordsByFilter("room_players", "room_id = '" + roomId + "'", {});
    
    // Send notification to all players in the room except the bidder
    for (const roomPlayer of roomPlayers) {
      const otherUserId = roomPlayer.get("user_id");
      
      // Don't send notification to the bidder themselves
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
            subject: "New Bid Placed: " + player.get("name"),
            html: "<h2>New Bid Placed!</h2><p><strong>" + bidder.get("name") + "</strong> has placed a bid of <strong>$" + bidAmount + "</strong> for <strong>" + player.get("name") + "</strong> in room <strong>" + room.get("room_name") + "</strong>.</p>"
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
}, "bids");
