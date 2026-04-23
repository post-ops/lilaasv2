import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container-x text-center">
        <p className="eyebrow mb-6">404 · not found</p>
        <h1 className="font-display text-display-lg text-fog mb-8 text-balance max-w-2xl mx-auto">
          That route didn't match any drawing we have on file.
        </h1>
        <Link href="/">
          <Button variant="primary" arrow>Back to home</Button>
        </Link>
      </div>
    </section>
  );
}
