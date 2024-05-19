import {
  Injectable,
  ArgumentMetadata,
  ValidationPipe,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const response = e.getResponse();
        const message = response['message'] || response;
        throw new UnprocessableEntityException(this.handleError(message));
      }
    }
  }

  private handleError(errors: any[]) {
    return errors.map((error) => {
      if (typeof error === 'string') {
        return error;
      }
      return Object.values(error.constraints).join(', ');
    });
  }
}
