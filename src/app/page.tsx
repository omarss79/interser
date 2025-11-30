// Home page (server component). Render a small client helper to handle
// authentication redirect codes that sometimes land on `/` (e.g. `/?code=...`).
import InitialSpinner from "@/lib/features/InitialSpinner";
import HandleCodeRedirect from "@/components/Auth/HandleCodeRedirect";
import TeamSection from "@/components/TeamSection";
import ServicesSection from "@/components/ServicesSection";
import { getAllTherapists } from "@/utils/therapists";

export default async function HomePage() {
  const therapists = await getAllTherapists();

  return (
    <>
      {/* client helper runs only in browser */}
      <HandleCodeRedirect />

      <InitialSpinner />

      {/* Services Section */}
      <ServicesSection />

      {/* Team Section */}
      {therapists.length > 0 && <TeamSection therapists={therapists} />}

      <a href="#" className="btn btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  );
}
