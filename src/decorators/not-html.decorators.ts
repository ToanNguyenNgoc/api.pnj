import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class NoHtmlValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return !/<[^>]*>/g.test(text);
  }

  defaultMessage() {
    return 'msg should not contain HTML tags';
  }
}

export function IsNotHtml(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoHtmlValidator,
    });
  };
}
