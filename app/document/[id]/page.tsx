'use client';

import { getResourcePermissions, PermissionType } from '@/app/actions';
import { Document } from '@/app/dashboard/page';
import { DeleteDocument } from '@/components/delete-document';
import { CollaborativeEditor } from '@/components/editor/collaborative-editor';
import LiveblocksWrapper from '@/components/editor/liveblocks-wrapper';
import Loader from '@/components/loader';
import { ShareDocument } from '@/components/share-document';
import { Button } from '@/components/ui/button';
import { APPWRITE_CLIENT } from '@/lib/appwrite';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();

  const router = useRouter();

  const [permissions, setPermissions] =
    useState<Record<PermissionType, boolean>>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);

  const fetchDocument = async () => {
    try {
      const document = await APPWRITE_CLIENT.databases.getDocument<Document>(
        '66fad2d0001b08997cb9',
        '66fad37e0033c987cf4d',
        params.id
      );

      setDocument(document);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setIsLoading(true);
    const isPermitted = await getResourcePermissions({
      permissions: ['read', 'update', 'delete'],
      resource_instance: `document:${params.id}`,
      user: user?.email ?? '',
    });

    setPermissions(isPermitted);

    if (isPermitted.read) {
      fetchDocument();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!permissions?.read || !user) {
    return (
      <section className="h-screen flex justify-center items-center flex-col gap-4">
        <p>You do not have permission to view this document</p>
        <Button
          onClick={() =>
            router.push(
              user ? '/dashboard' : `/login?next=/document/${params.id}`
            )
          }
        >
          {user ? 'Dashboard' : 'Login'}
        </Button>
      </section>
    );
  }

  if (!document) {
    return (
      <section className="h-screen flex justify-center items-center">
        <p>Document not found</p>
      </section>
    );
  }

  return (
    <LiveblocksWrapper permissions={permissions} roomId={document.roomId}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{document.title}</h1>
          <div className="flex gap-4">
            <ShareDocument
              permission={permissions.update}
              documentId={params.id}
            />
            <DeleteDocument
              documentId={params.id}
              permission={permissions.delete}
            />
          </div>
        </div>

        <CollaborativeEditor isReadOnly={!permissions.update} />
      </div>
    </LiveblocksWrapper>
  );
}
