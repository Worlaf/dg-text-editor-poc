import { isUndefined } from "lodash";
import * as React from "react";
import { Editor, Element } from "slate";
import { RenderElementProps, useSlate, ReactEditor } from "slate-react";

import "./NumberedListItem.css";

export const NumberedListItem: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const editor = useSlate();

  if (element.type !== "numbered-list-item") {
    console.error("unexpected numbered list item element data", element);
    return <li {...attributes}>{children}</li>;
  }

  const number = getListItemNumber(editor, element);

  return (
    <li className="numberedListItem" {...attributes}>
      <span contentEditable={false}>{number}.</span>
      {children}
    </li>
  );
};

const getListItemNumber = (editor: Editor, element: Element) => {
  if (
    element.type === "numbered-list-item" &&
    !isUndefined(element.customNumber)
  ) {
    return element.customNumber;
  }

  const path = ReactEditor.findPath(editor, element);
  const previousLiEntry = Editor.previous(editor, {
    at: path,
    match: (element) =>
      Element.isElement(element) &&
      element.type === "numbered-list-item" &&
      !isUndefined(element.customNumber),
  });

  const currentNumber = path[path.length - 1] + 1;
  if (!previousLiEntry) {
    return currentNumber;
  }

  const [prevLi, prevLiPath] = previousLiEntry;
  const prevNumberedLiNumber = prevLiPath[prevLiPath.length - 1] + 1;
  if (
    Element.isElement(prevLi) &&
    prevLi.type === "numbered-list-item" &&
    !isUndefined(prevLi.customNumber)
  ) {
    return prevLi.customNumber + (currentNumber - prevNumberedLiNumber);
  }

  return currentNumber;
};
