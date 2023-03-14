import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type NumberedListItem = {
  type: "numbered-list-item";
  customNumber?: number;
  children: Descendant[];
};

export type ListElementType = "bulleted-list" | "numbered-list";
export type SimpleElementType =
  | "paragraph"
  | "list-item"
  | "heading"
  | "code-block"
  | "code-line"
  | ListElementType;

type CustomElement =
  | { type: SimpleElementType; children: Descendant[] }
  | LinkElement
  | NumberedListItem;

export type ElementType = CustomElement["type"];

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

export const INLINE_ELEMENT_TYPES: ReadonlyArray<ElementType> = ["link"];
export const VOID_ELEMENT_TYPES: ReadonlyArray<ElementType> = [];
