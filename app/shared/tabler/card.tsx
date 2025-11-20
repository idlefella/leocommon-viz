import { IconArrowUp } from "@tabler/icons-react";

export default function Card({ subheader, content, icon, children }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="subheader">{subheader}</div>
        <div className="d-flex align-items-baseline mb-2">
          <div className="h1 mb-0 me-2">{content}</div>
          <div className="me-auto">
            <span className="d-inline-flex align-items-center lh-1">
              {icon}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Card2({ title, children }) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h3 className="card-titel">{title}</h3>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
