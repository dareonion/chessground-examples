import { Api } from 'chessground/api';
import * as cg from 'chessground/types';

export function toDests(chess: any): Map<cg.Key, cg.Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach(s => {
    const ms = chess.moves({square: s, verbose: true});
    if (ms.length) dests.set(s, ms.map(m => m.to));
  });
  return dests;
}

export function toColor(chess: any): cg.Color {
  return (chess.turn() === 'w') ? 'white' : 'black';

}

export function playOtherSide(cg: Api, chess) {
  return (orig, dest, _metadata, promotedTo) => {
    if (promotedTo === null) {
      chess.move({from: orig, to: dest});
    } else {
      chess.move({from: orig, to: dest, promotion: promotedTo[0]});
    }
    cg.set({
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      }
    });
  };
}

export function aiPlay(cg: Api, chess, delay: number, firstMove: boolean) {
  return (orig: cg.Key, dest: cg.Key, _metadata: cg.MoveMetadata, promotedTo: cg.Role | null) => {
    if (promotedTo === null) {
      chess.move({from: orig, to: dest});
    } else {
      chess.move({from: orig, to: dest, promotion: promotedTo[0]});
    }
    setTimeout(() => {
      const moves = chess.moves({verbose:true});
      const move = firstMove ? moves[0] : moves[Math.floor(Math.random() * moves.length)];
      chess.move(move.san);
      cg.move(move.from, move.to);
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        }
      });
      cg.playPremove();
    }, delay);
  };
}
