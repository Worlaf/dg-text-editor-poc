import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Editor, Transforms, Text } from "slate";
import { CustomText } from "./customTypes";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

type CustomTextMarkProp = keyof Pick<
  CustomText,
  "isBold" | "isItalic" | "isStrikethrough"
>;

type EditorFeature = {
  icon: IconDefinition;
  isAvailableInHoveringToolbar: (editor: Editor) => boolean;
  isActive: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
};

export const EDITOR_FEATURES: readonly EditorFeature[] = [
  {
    icon: solid("bold"),
    isActive: (editor) => isMarkActive(editor, "isBold"),
    isAvailableInHoveringToolbar: () => true,
    onClick: (editor) => toggleMark(editor, "isBold"),
  },
  {
    icon: solid("italic"),
    isActive: (editor) => isMarkActive(editor, "isItalic"),
    isAvailableInHoveringToolbar: () => true,
    onClick: (editor) => toggleMark(editor, "isItalic"),
  },
  {
    icon: solid("strikethrough"),
    isActive: (editor) => isMarkActive(editor, "isStrikethrough"),
    isAvailableInHoveringToolbar: () => true,
    onClick: (editor) => toggleMark(editor, "isStrikethrough"),
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
