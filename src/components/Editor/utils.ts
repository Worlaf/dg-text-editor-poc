import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Editor, Transforms, Text, Element } from "slate";
import { CustomText, ElementType, ListElementType } from "./customTypes";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { isUndefined } from "lodash";

type CustomTextMarkProp = keyof Pick<
  CustomText,
  "isBold" | "isItalic" | "isStrikethrough"
>;

type HotkeyData = Partial<
  Pick<
    React.KeyboardEvent,
    "altKey" | "ctrlKey" | "shiftKey" | "metaKey" | "key"
  >
>;

type EditorFeature = {
  icon: IconDefinition;
  isAvailableInHoveringToolbar: (editor: Editor) => boolean;
  isActive: (editor: Editor) => boolean;
  onActivate: (editor: Editor) => void;
  hotkey?: HotkeyData;
};

export const EDITOR_FEATURES: readonly EditorFeature[] = [
  {
    icon: solid("heading"),
    isActive: (editor) => isBlockActive(editor, "heading"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleBlock(editor, "heading"),
  },
  {
    icon: solid("bold"),
    isActive: (editor) => isMarkActive(editor, "isBold"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleMark(editor, "isBold"),
    hotkey: { ctrlKey: true, key: "b" },
  },
  {
    icon: solid("italic"),
    isActive: (editor) => isMarkActive(editor, "isItalic"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleMark(editor, "isItalic"),
    hotkey: { ctrlKey: true, key: "i" },
  },
  {
    icon: solid("strikethrough"),
    isActive: (editor) => isMarkActive(editor, "isStrikethrough"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleMark(editor, "isStrikethrough"),
    hotkey: { ctrlKey: true, key: "s" },
  },
  {
    icon: solid("list-ul"),
    isActive: (editor) => isBlockActive(editor, "bulleted-list"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleBlock(editor, "bulleted-list"),
  },
  {
    icon: solid("list-ol"),
    isActive: (editor) => isBlockActive(editor, "numbered-list"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleBlock(editor, "numbered-list"),
  },
];

export const isMarkActive = (editor: Editor, markProp: CustomTextMarkProp) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (node) => Text.isText(node) && !!node[markProp],
      universal: true,
    })
  );

  return !isUndefined(match);
};

export const toggleMark = (editor: Editor, markProp: CustomTextMarkProp) => {
  const isActive = isMarkActive(editor, markProp);
  Transforms.setNodes(
    editor,
    { [markProp]: !isActive },
    { match: (node) => Text.isText(node), split: true }
  );
};

export const isBlockActive = (editor: Editor, blockType: ElementType) => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        node.type === blockType,
    })
  );

  return !isUndefined(match);
};

const LIST_TYPES = ["bulleted-list", "numbered-list"];

const toggleBlock = (editor: Editor, blockType: ElementType) => {
  const isActive = isBlockActive(editor, blockType);
  const isList = LIST_TYPES.includes(blockType);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      LIST_TYPES.includes(node.type),
    split: true,
  });

  Transforms.setNodes<Element>(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : blockType,
  });

  if (!isActive && isList) {
    const block = { type: blockType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
