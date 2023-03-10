import { RenderLeafProps } from "slate-react";

export const EditorLeaf: React.FC<RenderLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.isBold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.isItalic) {
    children = <em>{children}</em>;
  }

  if (leaf.isStrikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};
