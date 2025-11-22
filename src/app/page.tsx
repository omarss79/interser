// Home page (server component). Render a small client helper to handle
// authentication redirect codes that sometimes land on `/` (e.g. `/?code=...`).
import InitialSpinner from "@/lib/features/InitialSpinner";
import HandleCodeRedirect from "@/components/Auth/HandleCodeRedirect";

export default function HomePage() {
  return (
    <>
      {/* client helper runs only in browser */}
      <HandleCodeRedirect />

      <InitialSpinner />

      <a href="#" className="btn btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}
