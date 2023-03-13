import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ListElementType = "bulleted-list" | "numbered-list";
export type ElementType =
  | ListElementType
  | "paragraph"
  | "list-item"
  | "heading";

type CustomElement =
  | { type: ElementType; children: Descendant[] }
  | LinkElement;

type FormattedText = {
  isBold?: boolean;
  isItalic?: boolean;
  isStrikethrough?: boolean;
};

export type CustomText = { text: string } & FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
