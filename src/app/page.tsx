// "use client";

import InitialSpinner from "@/lib/features/InitialSpinner";

export default function HomePage() {
  return (
    <>
      <InitialSpinner />

      <a href="#" className="btn btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}
