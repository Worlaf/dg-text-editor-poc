import * as React from "react";
import { RenderElementProps } from "slate-react";
import { LinkElement } from "./LinkElement";

export const EditorElement: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "heading":
      return <h1 {...attributes}>{children}</h1>;
    case "link":
      return <LinkElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
