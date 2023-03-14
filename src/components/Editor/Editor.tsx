import * as React from "react";
import { createEditor, Descendant, Transforms, Range } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import { ToolbarButton } from "./ToolbarButton";

import "./Editor.css";
import { EditorLeaf } from "./EditorLeaf";
import {
  EDITOR_FEATURES,
  withCustomInlineElements,
  withCustomVoidElements,
} from "./utils";
import { HoveringToolbar } from "./HoveringToolbar";
import { isUndefined } from "lodash";
import { EditorElement } from "./EditorElement";

const initialValue: Descendant[] = [
  { type: "heading", children: [{ text: "Heading" }] },
  {
    type: "paragraph",
    children: [
      {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    ],
  },
  {
    type: "bulleted-list",
    children: [
      {
        type: "list-item",
        children: [{ text: "list item 1" }],
      },
      {
        type: "list-item",
        children: [{ text: "list item 2" }],
      },
      {
        type: "list-item",
        children: [{ text: "list item 3" }],
      },
    ],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "numbered-list-item",
        children: [{ text: "list item 1" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 2" }],
      },
      {
        customNumber: 7,
        type: "numbered-list-item",
        children: [{ text: "list item 3 [7]" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 3" }],
      },
      {
        customNumber: 13,
        type: "numbered-list-item",
        children: [{ text: "list item 3 [13]" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 3" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 3" }],
      },
      {
        customNumber: 124,
        type: "numbered-list-item",
        children: [{ text: "list item 3 [124]" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 3" }],
      },
      {
        type: "numbered-list-item",
        children: [{ text: "list item 3" }],
      },
    ],
  },
];

type Props = {
  className?: string;
};

export const Editor: React.FC<Props> = ({ className }) => {
  const editor = React.useMemo(
    () =>
      withCustomVoidElements(
        withCustomInlineElements(withReact(createEditor()))
      ),
    []
  );
  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <EditorLeaf {...props} />,
    []
  );
  const renderElement = React.useCallback(
    (props: RenderElementProps) => <EditorElement {...props} />,
    []
  );

  const handleEditableKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { selection } = editor;

    // Default left/right behavior is unit:'character'.
    // This fails to distinguish between two cursor positions, such as
    // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
    // Here we modify the behavior to unit:'offset'.
    // This lets the user step into and out of the inline without stepping over characters.
    // You may wish to customize this further to only use unit:'offset' in specific cases.
    if (selection && Range.isCollapsed(selection)) {
      if (event.key === "left") {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }
      if (event.key === "right") {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset" });
        return;
      }
    }

    EDITOR_FEATURES.forEach((feature) => {
      const { hotkey } = feature;
      if (!isUndefined(hotkey)) {
        if (
          !!hotkey.altKey === event.altKey &&
          !!hotkey.ctrlKey === event.ctrlKey &&
          !!hotkey.metaKey === event.metaKey &&
          !!hotkey.shiftKey === event.shiftKey &&
          hotkey.key === event.key
        ) {
          event.preventDefault();
          feature.onActivate(editor);
        }
      }
    });
  };

  return (
    <Slate editor={editor} value={initialValue}>
      <div className="toolbar">
        {EDITOR_FEATURES.map((feature, index) => (
          <ToolbarButton
            icon={feature.icon}
            onClick={() => feature.onActivate(editor)}
            key={index}
            isActive={feature.isActive(editor)}
          />
        ))}
      </div>
      <HoveringToolbar />
      <Editable
        className={className}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onKeyDown={handleEditableKeyDown}
      />
    </Slate>
  );
};
