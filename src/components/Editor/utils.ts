import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Editor, Transforms, Text, Element, Range } from "slate";
import { CustomText, ElementType, LinkElement } from "./customTypes";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { isUndefined } from "lodash";
import { isUrl } from "../../utils/isUrl";

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
  {
    icon: solid("link"),
    isActive: (editor) => isLinkActive(editor),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => {
      const url = window.prompt("Enter the URL of the link:");

      if (url && editor.selection) {
        wrapLink(editor, url);
      }
    },
  },
  {
    icon: solid("link-slash"),
    isActive: () => false,
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => unwrapLink(editor),
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

export const withCustomInlineElements = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    ["link"].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const getSelectedLink = (editor: Editor): LinkElement | undefined => {
  const [linkEntry] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
    })
  );

  if (!linkEntry) {
    return undefined;
  }

  const [link] = linkEntry;
  if (Element.isElement(link) && link.type === "link") {
    return link;
  }

  return undefined;
};

export const isLinkActive = (editor: Editor) => !!getSelectedLink(editor);

export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
