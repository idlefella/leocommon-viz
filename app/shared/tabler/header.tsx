export default function Header({ title, pretitle, children}) {
  return (
    <div className="page-header d-print-none" aria-label="Page header">
      <div className="container-xl">
        <div className="row g-2 align-items-center">
          <div className="col">
            <div className="page-pretitle">{pretitle}</div>
            <h2 className="page-title">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
