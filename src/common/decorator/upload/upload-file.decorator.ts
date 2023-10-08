import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile as NestUploadedFile,
  UploadedFiles as NestUploadedFiles,
} from '@nestjs/common';

type ValidationOptions = {
  maxSize?: number;
  fileType?: string | RegExp;
  isOption?: boolean;
};

const MB = 1 * 1024 * 1024;
const defaultOptions = {
  maxSize: MB,
  fileType: /^image\/(jpeg|jpg|png|gif|bmp|svg\+xml)$/i,
  isOption: false,
};

const uploadedFile = (options: ValidationOptions) =>
  NestUploadedFile(
    !options.isOption &&
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: options.maxSize }),
          new FileTypeValidator({ fileType: options.fileType }),
        ],
      }),
  );
const uploadedFiles = (options: ValidationOptions) =>
  NestUploadedFiles(
    !options.isOption &&
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: options.maxSize }),
          new FileTypeValidator({ fileType: options.fileType }),
        ],
      }),
  );

/**
 * 단일 파일 업로드
 * @param options
 * - { maxSize: 1MB, fileType: /^image\/(jpeg|jpg|png|gif|bmp|svg\+xml)$/i }
 * @returns
 */
export function UploadedFile(
  options: ValidationOptions = defaultOptions,
): ParameterDecorator {
  return uploadedFile(options);
}

/**
 * 옵셔널 단일 파일 업로드
 * @param options
 * - { maxSize: 1MB, fileType: /^image\/(jpeg|jpg|png|gif|bmp|svg\+xml)$/i }
 * @returns
 */
export function UploadedFileOptional(
  options: ValidationOptions = defaultOptions,
): ParameterDecorator {
  return uploadedFile({ ...options, isOption: true });
}

/**
 * 다중 파일 업로드
 * @param options
 * - { maxSize: 1MB, fileType: /^image\/(jpeg|jpg|png|gif|bmp|svg\+xml)$/i }
 * @returns
 */
export function UploadedFiles(
  options: ValidationOptions = defaultOptions,
): ParameterDecorator {
  return uploadedFiles(options);
}
/**
 * 옵셔널 다중 파일 업로드
 * @param options
 * - { maxSize: 1MB, fileType: /^image\/(jpeg|jpg|png|gif|bmp|svg\+xml)$/i }
 * @returns
 */
export function UploadedFilesOptional(
  options: ValidationOptions = defaultOptions,
): ParameterDecorator {
  return uploadedFiles({ ...options, isOption: true });
}
