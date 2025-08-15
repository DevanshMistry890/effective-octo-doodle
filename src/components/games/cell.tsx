const Cell = ({ value, onClick }) => {

  let icon = null;
  if (value === 'X') {
    icon = 'X';
  } else if (value === 'O') {
    icon = <i className="far fa-circle"></i>;
  }
  
  return (
    <div className="cell" onClick={onClick}>
      {icon}
    </div>
  );
};

export default Cell;