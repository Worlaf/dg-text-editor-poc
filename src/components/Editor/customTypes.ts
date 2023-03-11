import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type ListElementType = "bulleted-list" | "numbered-list";
export type ElementType =
  | ListElementType
  | "paragraph"
  | "list-item"
  | "heading";
type CustomElement = { type: ElementType; children: Descendant[] };

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
