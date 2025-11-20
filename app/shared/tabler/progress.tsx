export default function Progress({ percentage }) {
  return (
    <div className="progress">
      <div className="progress-bar" style={{'width': `${percentage}%`}}></div>
    </div>
  );
}
