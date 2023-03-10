import { Editor, Transforms, Text } from "slate";
import { CustomText } from "./customTypes";

type CustomTextMarkProp = keyof Pick<
  CustomText,
  "isBold" | "isItalic" | "isStrikethrough"
>;

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
