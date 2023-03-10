import * as React from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { ToolbarButton } from "./ToolbarButton";

import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import "./Editor.css";
import { EditorLeaf } from "./EditorLeaf";
import { toggleMark } from "./utils";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

type Props = {
  className?: string;
};

export const Editor: React.FC<Props> = ({ className }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);
  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <EditorLeaf {...props} />,
    []
  );

  return (
    <Slate editor={editor} value={initialValue}>
      <div className="toolbar">
        <ToolbarButton
          icon={solid("bold")}
          onClick={() => toggleMark(editor, "isBold")}
        />
        <ToolbarButton
          icon={solid("italic")}
          onClick={() => toggleMark(editor, "isItalic")}
        />
        <ToolbarButton
          icon={solid("strikethrough")}
          onClick={() => toggleMark(editor, "isStrikethrough")}
        />
      </div>
      <Editable className={className} renderLeaf={renderLeaf} />
    </Slate>
  );
};
