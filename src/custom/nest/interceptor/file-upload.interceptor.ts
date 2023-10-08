import { UPLOAD_FILES_NAME, UPLOAD_FILE_NAME } from '@app/common';
import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type FilesUploadOptions = { maxCount: number };

/**
 * 단일 파일 업로드 인터셉터
 * @param fieldName
 *  - 기본값: images
 * @returns
 */
export function FileUploadInterceptor(fieldName: string = UPLOAD_FILE_NAME) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName)));
}

/**
 * 다중 파일 업로드 인터셉터
 * @param fieldName
 *  - 기본값: images
 * @param options
 *  - 기본값: { maxCount: 5 }
 * @returns
 */
export function FilesUploadInterceptor(
  fieldName: string = UPLOAD_FILES_NAME,
  options: FilesUploadOptions = { maxCount: 5 },
) {
  const { maxCount } = options;
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount)),
  );
}
