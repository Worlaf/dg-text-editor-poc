import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };

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
