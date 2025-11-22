'use client'

import { IconDeviceDesktopAnalytics, IconFlask, IconGlobe, IconHome, IconWorld } from "@tabler/icons-react";
import Link from "next/link";
import DiscoLogo from "./logo";
import { usePathname } from 'next/navigation'


export function Sidebar() {

  const pathname = usePathname();

  return (
    <div className="container-fluid">
      <div className="navbar-brand navbar-brand-autodark">
        <a href="." aria-label="Tabler">
          <DiscoLogo />
        </a>
      </div>
      <div className="collapse navbar-collapse" id="sidebar-menu">
        <ul className="navbar-nav pt-lg-3">
          <li className={`nav-item ${pathname == "/" ? "active": ""}`}>
            <Link href="/" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconHome />
              </span>
              <span className="nav-link-title"> Home </span>
            </Link>
          </li>
          <li className={`nav-item ${pathname == "/globe" ? "active": ""}`}>
            <Link href="/globe" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconWorld />
              </span>
              <span className="nav-link-title"> Globe </span>
            </Link>
          </li>
          <li className={`nav-item ${pathname == "/statistics" ? "active": ""}`}>
            <Link href="/statistics" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconDeviceDesktopAnalytics />
              </span>
              <span className="nav-link-title"> Statistics </span>
            </Link>
          </li>
          <li className={`nav-item ${pathname.startsWith('/jobs') ? "active": ""}`}>
            <Link href="/jobs" className="nav-link">
              <span className="nav-link-icon d-md-none d-lg-inline-block">
                <IconFlask />
              </span>
              <span className="nav-link-title"> Jobs </span>
            </Link>
          </li>
        </ul>
      </div>
      <img src="/coreb-logo.svg" style={{'backgroundColor': "rgb(0,0,0,0)", 'marginBottom': '80px', 'marginLeft': '6px'}} />
    </div>
  );
}
