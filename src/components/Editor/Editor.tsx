import * as React from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { ToolbarButton } from "./ToolbarButton";

import "./Editor.css";
import { EditorLeaf } from "./EditorLeaf";
import { EDITOR_FEATURES } from "./utils";
import { HoveringToolbar } from "./HoveringToolbar";

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
        {EDITOR_FEATURES.map((feature, index) => (
          <ToolbarButton
            icon={feature.icon}
            onClick={() => feature.onClick(editor)}
            key={index}
          />
        ))}
      </div>
      <HoveringToolbar />
      <Editable className={className} renderLeaf={renderLeaf} />
    </Slate>
  );
};
