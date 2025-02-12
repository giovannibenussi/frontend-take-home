export function LoadingSR({
  content,
  loading,
}: {
  content?: string;
  loading: boolean;
}) {
  if (!loading) {
    return null;
  }

  return (
    <div aria-live="polite" className="sr-only">
      {content ?? "Loading..."}
    </div>
  );
}
