import { pipe } from "fp-ts/function";
import produce from "immer";

type Blocks = boolean[][];

type PieceBlock = Readonly<{ x: number; y: number }>;
type Piece = Readonly<[PieceBlock, PieceBlock, PieceBlock, PieceBlock]>;

const LongPiece = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
] as const;

const TPiece = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
] as const;

const typecheck: Piece = TPiece;

type ActualPiece = typeof TPiece | typeof LongPiece;

type State = {
  settled: Blocks;
  activePiece: {
    pieces: ActualPiece;
    location: { x: number; y: number };
    rotation: "n" | "s" | "e" | "w";
  };
};

const activePieceToBlocks = (activePiece: State["activePiece"]): Blocks => {
  const blocks: Blocks = new Array(10)
    .fill(undefined)
    .map((x) => new Array(10).fill(undefined).map((x) => false));
  activePiece.pieces.forEach((piece) => {
    blocks[piece.y + activePiece.location.y][piece.x + activePiece.location.x] =
      true;
  });
  return blocks;
};

const blocksToString = (blocks: Blocks) =>
  blocks.map((row) => row.map((space) => (space ? "X" : " "))).join("\n");

const mergeBlocks = (blocksA: Blocks, blocksB: Blocks) =>
  blocksA.map((row, i) => row.map((space, j) => space || blocksB[i][j]));

const stringifyState = (state: State) => {
  const activePieceBlocks = pipe(state.activePiece, activePieceToBlocks);
  const merged = mergeBlocks(state.settled, activePieceBlocks);
  return blocksToString(merged);
};

const initializeState = (): State => ({
  settled: new Array(10).fill(new Array(10).fill(false)),
  activePiece: {
    pieces: TPiece,
    location: { x: 6, y: 0 },
    rotation: "n",
  },
});

const stepState = (state: State) =>
  produce(state, (nextState) => {
    nextState.activePiece.location.x -= 1;
  });

type Action = "proceed";

const eventLoop = (state: State, action: Action): State => {};

console.log(stringifyState(initializeState()));
