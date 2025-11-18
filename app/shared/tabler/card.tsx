import { IconArrowUp } from "@tabler/icons-react";

export default function Card({ subheader, content, icon }) {
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
