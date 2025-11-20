import { IconRocket, IconSatellite } from "@tabler/icons-react";
import Link from "next/link";
import Body from "./shared/tabler/body";
import Header from "./shared/tabler/header";

export default function Home() {
  return (
    <>
      <Header title="Home" pretitle="LeoCommon Explorer" />
      <Body>
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="card card-md sticky-top">
              <div className="card-stamp card-stamp-lg">
                <div className="card-stamp-icon bg-primary">
                  <IconSatellite className="icon icon-1" />
                </div>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-10">
                    <h3 className="h1">LeoCommon Explorer</h3>
                    <div className="markdown">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </div>
                    <div className="mt-3">
                      <Link href="/globe" className="btn btn-primary">
                        <IconRocket />
                        &nbsp; Get started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}
