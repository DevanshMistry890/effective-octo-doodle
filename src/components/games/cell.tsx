interface CellProps {
  value: string | null;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  const cellClassName = `square ${value ? 'filled' : ''}`;

  return (
    <div className={cellClassName} onClick={onClick}>
      {value}
    </div>
  );
};

export default Cell;