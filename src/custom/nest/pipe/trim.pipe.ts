import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const { data } = metadata;
    const val = value.trim();
    if (!val) {
      throw new BadRequestException(`path(${data}) should not be empty`);
    }
    return val;
  }
}
