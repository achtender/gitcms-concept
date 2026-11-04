import { ButtonLink, Container } from "@repo/ui";

export default function NotFound() {
  return (
    <Container size="narrow">
      <div className="py-24">
        <p className="heading-meta text-primary">404</p>
        <h1 className="display-section mt-3">This note is not in the archive.</h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          The page may have moved, or the link may point at an entry that was never
          published. The journal and handbook are good places to pick up the trail.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/journal" variant="secondary">
            Browse the journal
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
