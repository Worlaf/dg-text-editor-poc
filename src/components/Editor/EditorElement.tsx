import * as React from "react";
import { RenderElementProps } from "slate-react";
import { LinkElement } from "./LinkElement";
import { NumberedListItem } from "./NumberedListItem";

import "./EditorElement.css";

export const EditorElement: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "numbered-list":
      return (
        <ol className="numberedList" {...attributes}>
          {children}
        </ol>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "heading":
      return <h1 {...attributes}>{children}</h1>;
    case "link":
      return <LinkElement {...props} />;
    case "numbered-list-item":
      return <NumberedListItem {...props} />;
    case "code-block":
      return (
        <div className="codeBlock" {...attributes}>
          <code>{children}</code>
        </div>
      );
    case "code-line":
      return (
        <div className="codeLine" {...attributes}>
          {children}
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
