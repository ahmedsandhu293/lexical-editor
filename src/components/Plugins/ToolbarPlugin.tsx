import {
    HEADINGS,
    LOW_PRIORIRTY,
    RichTextAction,
    RICH_TEXT_OPTIONS,
  } from "../../constants";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
  import { $isHeadingNode } from "@lexical/rich-text";

  import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
  } from "lexical";
  import { $setBlocksType } from "@lexical/selection";

  import { useEffect, useState } from "react";
  import { mergeRegister } from "@lexical/utils";
  import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
  import { useKeyBindings } from "../../hooks/useKeyBindings";
  
  export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [currentHeading, setCurrentHeading] = useState<HeadingTagType | "">("");

    const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
      [RichTextAction.Undo]: true,
      [RichTextAction.Redo]: true,
    });
    const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
      {}
    );
  


    const updateToolbar = () => {
      const selection = $getSelection();
    
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
    
        if (parent && $isHeadingNode(parent)) {
          setCurrentHeading(parent.getTag());
        } else {
          setCurrentHeading(""); 
        }
    
        const newSelectionMap = {
          [RichTextAction.Bold]: selection.hasFormat("bold"),
          [RichTextAction.Italics]: selection.hasFormat("italic"),
          [RichTextAction.Underline]: selection.hasFormat("underline"),
          [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
          [RichTextAction.Superscript]: selection.hasFormat("superscript"),
          [RichTextAction.Subscript]: selection.hasFormat("subscript"),
          [RichTextAction.Code]: selection.hasFormat("code"),
          [RichTextAction.Highlight]: selection.hasFormat("highlight"),
        };
    
        setSelectionMap(newSelectionMap);
      }
    };
    
    
  
    useEffect(() => {
      return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            updateToolbar();
          });
        }),
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            updateToolbar();
            return false;
          },
          LOW_PRIORIRTY
        ),
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setDisableMap((prevDisableMap) => ({
              ...prevDisableMap,
              [RichTextAction.Undo]: !payload,
            }));
            return false;
          },
          LOW_PRIORIRTY
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setDisableMap((prevDisableMap) => ({
              ...prevDisableMap,
              [RichTextAction.Redo]: !payload,
            }));
            return false;
          },
          LOW_PRIORIRTY
        )
      );
    }, [editor]);
  
    const onAction = (id: RichTextAction) => {
      switch (id) {
        case RichTextAction.Bold:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          break;
        case RichTextAction.Italics:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          break;
        case RichTextAction.Underline:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          break;
        case RichTextAction.Strikethrough:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          break;
        case RichTextAction.Superscript:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          break;
        case RichTextAction.Subscript:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          break;
        case RichTextAction.Code:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          break;
        case RichTextAction.Highlight:
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
          break;
    
        case RichTextAction.LeftAlign:
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          break;
        case RichTextAction.RightAlign:
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          break;
        case RichTextAction.CenterAlign:
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          break;
        case RichTextAction.JustifyAlign:
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          break;
    
        case RichTextAction.Undo:
          editor.dispatchCommand(UNDO_COMMAND, undefined);
          break;
        case RichTextAction.Redo:
          editor.dispatchCommand(REDO_COMMAND, undefined);
          break;
      }
    };
    
    useKeyBindings({ onAction });
  
    const updateHeading = (heading: HeadingTagType) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(heading));
        }
      });
    };
    
  
    return (
      <div className="flex flex-wrap items-center gap-2 mb-4">
       {/* <select
  className="border rounded px-2 py-1 text-sm"
  onChange={(e) => updateHeading(e.target.value as HeadingTagType)}
  value={currentHeading}
>
  <option value="">Select Heading</option>
  {HEADINGS.map((heading) => (
    <option key={heading} value={heading}>
      {heading.toUpperCase()}
    </option>
  ))}
</select> */}


  
        <div className="flex flex-wrap gap-1">
          {RICH_TEXT_OPTIONS.map(({ id, label, icon, fontSize }) =>
            id === RichTextAction.Divider ? (
              <div key={id} className="w-px h-5 bg-gray-400 mx-2" />
            ) : (
              <button
                key={id}
                onClick={() => onAction(id)}
                disabled={disableMap[id]}
                className={`p-1 border rounded text-xs flex items-center justify-center transition ${
                  selectionMap[id]
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                style={{ fontSize: fontSize || 14 }}
                aria-label={label as string}
                title={label as string}
              >
                {icon}
              </button>
            )
          )}
        </div>
      </div>
    );
  }
  