import { Icon360, IconFlask, IconGlobe, IconHome } from "@tabler/icons-react";
import DiscoLogo from "./logo";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="container-fluid">
      <div className="navbar-brand navbar-brand-autodark">
        <a href="." aria-label="Tabler">
          <DiscoLogo />
        </a>
      </div>
      <div className="collapse navbar-collapse" id="sidebar-menu">
        <ul className="navbar-nav pt-lg-3">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconHome />
              </span>
              <span className="nav-link-title"> Home </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/globe" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconFlask />
              </span>
              <span className="nav-link-title"> Globe </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/statistics" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconGlobe />
              </span>
              <span className="nav-link-title"> Statistics </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/jobs" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconFlask />
              </span>
              <span className="nav-link-title"> Jobs </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
