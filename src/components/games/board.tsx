import Cell from './cell';
interface BoardProps {
  board: (string | null)[];
  onClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  return (
    <>
      {board.map((value, index) => (
        <Cell key={index} value={value} onClick={() => onClick(index)} />
      ))}
    </>
  );
};

export default Board;