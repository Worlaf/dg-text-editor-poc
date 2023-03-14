import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Editor, Transforms, Text, Element, Range } from "slate";
import {
  CustomText,
  ElementType,
  INLINE_ELEMENT_TYPES,
  LinkElement,
  SimpleElementType,
  VOID_ELEMENT_TYPES,
} from "./customTypes";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { isUndefined } from "lodash";
import { isUrl } from "../../utils/isUrl";

type ToggleableTextMarkProp = keyof Pick<
  CustomText,
  "isBold" | "isItalic" | "isStrikethrough"
>;

type StringTextMarkProp = keyof Pick<CustomText, "backgroundColor">;

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
    icon: solid("droplet"),
    isActive: () => false,
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => setMarkTextValue(editor, "backgroundColor", "red"),
  },
  {
    icon: solid("droplet"),
    isActive: () => false,
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => setMarkTextValue(editor, "backgroundColor", "blue"),
  },
  {
    icon: solid("droplet-slash"),
    isActive: () => false,
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => setMarkTextValue(editor, "backgroundColor", ""),
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
    icon: solid("code"),
    isActive: (editor) => isBlockActive(editor, "code-block"),
    isAvailableInHoveringToolbar: () => true,
    onActivate: (editor) => toggleBlock(editor, "code-block"),
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

export const isMarkActive = (
  editor: Editor,
  markProp: ToggleableTextMarkProp
) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (node) => Text.isText(node) && !!node[markProp],
      universal: true,
    })
  );

  return !isUndefined(match);
};

export const toggleMark = (
  editor: Editor,
  markProp: ToggleableTextMarkProp
) => {
  const isActive = isMarkActive(editor, markProp);
  Transforms.setNodes(
    editor,
    { [markProp]: !isActive },
    { match: (node) => Text.isText(node), split: true }
  );
};

export const setMarkTextValue = (
  editor: Editor,
  markProp: StringTextMarkProp,
  value: string
) => {
  Transforms.setNodes(
    editor,
    { [markProp]: value },
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

const toggleBlock = (editor: Editor, blockType: SimpleElementType) => {
  const isActive = isBlockActive(editor, blockType);
  const isList = LIST_TYPES.includes(blockType);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      (LIST_TYPES.includes(node.type) || node.type === "code-block"),
    split: true,
  });

  const resolveElementType = (): ElementType => {
    if (isActive) {
      return "paragraph";
    }

    if (blockType === "code-block") {
      return "code-line";
    }

    if (isList) {
      return blockType === "numbered-list" ? "numbered-list-item" : "list-item";
    }

    return blockType;
  };

  Transforms.setNodes<Element>(editor, {
    type: resolveElementType(),
  });

  if (!isActive && (isList || blockType === "code-block")) {
    const block = { type: blockType, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const withCustomInlineElements = (editor: Editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    INLINE_ELEMENT_TYPES.includes(element.type) || isInline(element);

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

export const withCustomVoidElements = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) =>
    VOID_ELEMENT_TYPES.includes(element.type) || isVoid(element);

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
