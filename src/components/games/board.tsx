import Cell from './cell';

const Board = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Cell key={index} value={value} onClick={() => onClick(index)} />
      ))}
    </div>
  );
};

export default Board;