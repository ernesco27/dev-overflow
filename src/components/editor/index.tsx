"use client";
// InitializedMDXEditor.tsx
import { forwardRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  // BlockTypeSelect,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import "@mdxeditor/editor/style.css";

import "./dark-editor.css";
import { useTheme } from "next-themes";

interface EditorProps {
  value: string;
  fieldChange: (value: string) => void;
  // editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = forwardRef<MDXEditorMethods, EditorProps>(
  ({ value, fieldChange, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? [basicDark] : [];

    return (
      <MDXEditor
        key={resolvedTheme}
        // ref={editorRef}
        ref={ref}
        markdown={value}
        onChange={fieldChange}
        className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border grid "
        plugins={[
          // Example Plugin Usage

          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              txt: "txt",
              sql: "sql",
              html: "html",
              saas: "saas",
              scss: "scss",
              bash: "bash",
              json: "json",
              js: "javascript",
              ts: "typescript",
              jsx: "JavaScript (React)",
              tsx: "TypeScript (React)",
              "": "unspecified",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),

          toolbarPlugin({
            toolbarContents: () => {
              return (
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <Separator />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <Separator />
                          <InsertImage />
                          <Separator />
                          <InsertTable />
                          <InsertThematicBreak />
                          <InsertCodeBlock />
                        </>
                      ),
                    },
                  ]}
                />
              );
            },
          }),
        ]}
        {...props}
      />
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
