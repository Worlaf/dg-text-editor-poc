import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { useFocused, useSlate } from "slate-react";
import { ToolbarButton } from "./ToolbarButton";
import { EDITOR_FEATURES, getSelectedLink, unwrapLink } from "./utils";

import "./HoveringToolbar.css";
import { Editor, Range } from "slate";
import { LinkElement } from "./customTypes";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

export const HoveringToolbar: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  const link = getSelectedLink(editor);

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();

    if (!domSelection) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <div className="hoveringToolbar" ref={ref}>
        {!!link ? (
          <LinkContent editor={editor} link={link} />
        ) : (
          <CommonContent editor={editor} />
        )}
      </div>
    </Portal>
  );
};

export const Portal: React.FC<{ children: ReactNode }> = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

const CommonContent: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      {EDITOR_FEATURES.filter((feature) =>
        feature.isAvailableInHoveringToolbar(editor)
      ).map((feature, index) => (
        <ToolbarButton
          icon={feature.icon}
          onClick={() => feature.onActivate(editor)}
          key={index}
          isActive={feature.isActive(editor)}
        />
      ))}
    </>
  );
};

const LinkContent: React.FC<{ editor: Editor; link: LinkElement }> = ({
  editor,
  link,
}) => {
  return (
    <>
      <a href={link.url}>{link.url}</a>
      {/* Todo: move some features to separate variables and provide helper to create button? */}
      <ToolbarButton
        icon={solid("link-slash")}
        onClick={() => unwrapLink(editor)}
      />
    </>
  );
};
