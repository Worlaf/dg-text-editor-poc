import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Editor, Transforms, Text } from "slate";
import { CustomText } from "./customTypes";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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
];

export const isMarkActive = (editor: Editor, markProp: CustomTextMarkProp) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (node) => Text.isText(node) && !!node[markProp],
      universal: true,
    })
  );

  return !!match;
};

export const toggleMark = (editor: Editor, markProp: CustomTextMarkProp) => {
  const isActive = isMarkActive(editor, markProp);
  Transforms.setNodes(
    editor,
    { [markProp]: !isActive },
    { match: (node) => Text.isText(node), split: true }
  );
};
