import { RenderLeafProps } from "slate-react";

export const EditorLeaf: React.FC<RenderLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  const style: React.CSSProperties = {
    backgroundColor: leaf.backgroundColor,
  };

  if (leaf.isBold) {
    children = <strong style={style}>{children}</strong>;
  }

  if (leaf.isItalic) {
    children = <em style={style}>{children}</em>;
  }

  if (leaf.isStrikethrough) {
    children = <s style={style}>{children}</s>;
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
