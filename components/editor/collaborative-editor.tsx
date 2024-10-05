'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useRoom, useSelf } from '@liveblocks/react/suspense';
import { useEffect, useState } from 'react';
import { Toolbar } from './toolbar';
import { Avatars } from './user-avatars';

export function CollaborativeEditor({ isReadOnly }: { isReadOnly: boolean }) {
  console.log('CollaborativeEditor', isReadOnly);

  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return <TiptapEditor isReadOnly={isReadOnly} doc={doc} provider={provider} />;
}

function TiptapEditor({
  doc,
  provider,
  isReadOnly,
}: {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  isReadOnly: boolean;
}) {
  const userInfo = useSelf((me) => me.info);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'flex-grow w-full h-full pt-4 focus:outline-none',
      },
      editable: () => !isReadOnly,
    },
    extensions: [
      StarterKit.configure({
        history: false,
      }),

      Collaboration.configure({
        document: doc,
      }),

      CollaborationCursor.configure({
        provider: provider,
        user: userInfo,
      }),
    ],
  });

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <div className="flex justify-between items-center">
        <Toolbar editor={editor} />
        <Avatars />
      </div>
      <EditorContent
        readOnly={isReadOnly}
        editor={editor}
        className="relative h-full"
      />
    </div>
  );
}
