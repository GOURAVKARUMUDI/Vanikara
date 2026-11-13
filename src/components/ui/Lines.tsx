import { Fragment } from "react";

/**
 * Renders text with its line breaks kept — lets admins break a heading by
 * typing a new line in the content editor. `breakClassName` controls when
 * the break applies (e.g. "hidden sm:block" for wider screens only).
 */
export default function Lines({ text, breakClassName }: { text: string; breakClassName?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br className={breakClassName} />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
