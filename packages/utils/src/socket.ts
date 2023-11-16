export const ACTIONS = {
  ROOM: {
    ME: "room.me",
    INFO: "room.info",
    ENTER: "room.enter",
    LEAVE: "room.leave",
    MESSAGE: "room.message",
  },
  GAME: {
    START: "game.start",
    SIT: "game.sit",
    END: "game.end",
    REMOVE_SIT: "game.remove_sit",
    TAKE_BACK: "game.take_back",
    ENTER: "game.enter",
    MOVE: "game.move",
  },
  VOICE: {
    MAKE_CALL: "voice.make_call",
    INCOMING_CALL: "voice.incoming_call",
    ACCEPT_CALL: "voice.accepted_call",
    DISCONNECT: "void.disconnect",
    NEGOTIATION: "voice.negotiation",
    NEGOTIATING: "voice.negotiating",
    NEGOTIATION_DONE: "voice.negotiation-done",
    ICE_CANDIDATE: "voice.ice-candidate",
  },
};
