import { ButtonLink, Container } from "@repo/ui";

export default function NotFound() {
  return (
    <Container size="narrow">
      <div className="py-24">
        <p className="heading-meta text-primary">404</p>
        <h1 className="display-section mt-3">There is nothing on this table.</h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          The page may have moved, or it may never have been on the menu. Start with
          today&apos;s menu, or find one of the two rooms.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/menu" variant="secondary">
            See the menu
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
