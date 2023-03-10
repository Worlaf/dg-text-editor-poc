import * as React from "react";
import { useState } from "react";

// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

type Props = {
  className?: string;
};

export const Editor: React.FC<Props> = ({ className }) => {
  const [editor] = useState(() => withReact(createEditor()));
  // Render the Slate context.
  return (
    <Slate editor={editor} value={initialValue}>
      <Editable className={className} />
    </Slate>
  );
};
