import { RenderElementProps } from "slate-react";

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

export const LinkElement: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  if (!("url" in element)) {
    console.error("unexpected link element data", element);
    return <p {...attributes}>{children}</p>;
  }

  return (
    <a {...attributes} className="linkElement" href={element.url}>
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};
