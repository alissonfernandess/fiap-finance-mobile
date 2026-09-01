import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage';

import {
    firebaseAuth,
    firebaseStorage,
} from '@/services/firebase';

interface ReceiptUpload {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

const MAXIMUM_FILE_SIZE = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(
    /[^a-zA-Z0-9._-]/g,
    '_',
  );
}

function getContentType(file: ReceiptUpload) {
  if (file.mimeType) {
    return file.mimeType;
  }

  const extension = file.name
    .split('.')
    .pop()
    ?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';

    case 'png':
      return 'image/png';

    case 'pdf':
      return 'application/pdf';

    default:
      throw new Error(
        'Tipo de comprovante não permitido.',
      );
  }
}

export async function uploadReceipt(
  file: ReceiptUpload,
) {
  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error(
      'Nenhum usuário autenticado.',
    );
  }

  if (
    file.size &&
    file.size > MAXIMUM_FILE_SIZE
  ) {
    throw new Error(
      'O comprovante deve ter no máximo 5 MB.',
    );
  }

  const contentType = getContentType(file);

  const response = await fetch(file.uri);
  const blob = await response.blob();

  if (blob.size > MAXIMUM_FILE_SIZE) {
    throw new Error(
      'O comprovante deve ter no máximo 5 MB.',
    );
  }

  const safeFileName =
    sanitizeFileName(file.name);

  const fileReference = ref(
    firebaseStorage,
    [
      'users',
      currentUser.uid,
      'receipts',
      `${Date.now()}-${safeFileName}`,
    ].join('/'),
  );

  await uploadBytes(fileReference, blob, {
    contentType,
  });

  return getDownloadURL(fileReference);
}

export async function deleteReceipt(
  receiptUrl: string,
) {
  const currentUser =
    firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error(
      'Nenhum usuário autenticado.',
    );
  }

  const fileReference = ref(
    firebaseStorage,
    receiptUrl,
  );

  await deleteObject(fileReference);
}