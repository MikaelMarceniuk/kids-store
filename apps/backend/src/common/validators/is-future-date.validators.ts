import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isFuture } from 'date-fns';

@ValidatorConstraint()
class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: string | Date) {
    return isFuture(new Date(date));
  }

  defaultMessage(args: ValidationArguments) {
    return `A propriedade "${args.property}" deve ser uma data futura.`;
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFutureDateConstraint,
    });
  };
}
