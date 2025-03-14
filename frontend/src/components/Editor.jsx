import React, { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Editor = forwardRef(
  (
    { readOnly, defaultValue, onTextChange, onSelectionChange, placeholder },
    ref
  ) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.appendChild(
        document.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholder || "Start writing your content here...",
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
          
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
          
            ['clean']                                         // remove formatting button
          ],
        },
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) =>
        onTextChangeRef.current?.(...args)
      );
      quill.on(Quill.events.SELECTION_CHANGE, (...args) =>
        onSelectionChangeRef.current?.(...args)
      );

      return () => {
        ref.current = null;
        if (container) {
          container.innerHTML = "";
        }
      };
    }, [ref]);

    return <div ref={containerRef} style={{ height: "100%"}}/>;
  }
);

Editor.displayName = "Editor";

export default Editor;




