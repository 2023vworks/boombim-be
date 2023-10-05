import { UPLOAD_FILES_NAME, UPLOAD_FILE_NAME } from '@app/common';
import {
  UnsupportedMediaTypeException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type Options = {
  /** Max field value size (Default: 1MB) */
  fileType?: 'image' | string;
  fieldSize?: number;
};
type FileUploadOptions = Options;
type FilesUploadOptions = Options & { maxCount: number };
const MB = 1 * 1024 * 1024;

const fileUploadOptions = {
  fieldSize: MB,
  fileType: 'image',
};
const filesUploadOptions = {
  maxCount: 5,
  fieldSize: MB,
  fileType: 'image',
};

/**
 * 단일 파일 업로드 인터셉터
 * @param fieldName
 *  - 기본값: images
 * @param options
 *  - 기본값: { fieldSize: 1MB, fileType: 'image' }
 * @returns
 */
export function FileUploadInterceptor(
  fieldName: string = UPLOAD_FILE_NAME,
  options: FileUploadOptions = fileUploadOptions,
) {
  const { fieldSize, fileType } = options;
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        limits: { fieldSize },
        fileFilter: fileMimetypeFilter(fileType),
      }),
    ),
  );
}

/**
 * 다중 파일 업로드 인터셉터
 * @param fieldName
 *  - 기본값: images
 * @param options
 *  - 기본값: { maxCount: 5, fieldSize: 1MB, fileType: 'image' }
 * @returns
 */
export function FilesUploadInterceptor(
  fieldName: string = UPLOAD_FILES_NAME,
  options: FilesUploadOptions = filesUploadOptions,
) {
  const { maxCount, fieldSize, fileType } = options;
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        limits: { fieldSize },
        fileFilter: fileMimetypeFilter(fileType),
      }),
    ),
  );
}

function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    return mimetypes.some((m) => file.mimetype.includes(m))
      ? callback(null, true)
      : callback(
          new UnsupportedMediaTypeException(
            `File mimetypes is not support: ${mimetypes.join(', ')}`,
          ),
          false,
        );
  };
}
