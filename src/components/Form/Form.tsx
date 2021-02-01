import React from 'react';
import { objectKeys } from 'src/lib/util';

type BaseModel = {
  [field: string]: string;
}

type ValidationErrors<ValidationModel extends BaseModel> = undefined | {
  [k in keyof ValidationModel]?: string;
};

type Props<Model extends BaseModel, ValidationModel extends (Partial<Model> & BaseModel) = Model> = {
  onSubmit: (model: ValidationModel) => void | Promise<unknown>;
  validator: {
    [k in keyof ValidationModel]: [
      (i: string) => boolean,
      string,
    ]
  }
  render: (p: {
    model: Model;
    validate: () => void;
    validateField: (k: keyof ValidationModel) => void;
    validationErrors: ValidationErrors<ValidationModel>;
    canSubmit: boolean;
    submit: () => void | Promise<unknown>;
    onChange: (field: keyof ValidationModel, newValue: string) => void;
  }) => React.ReactNode;
};

type State<Model extends BaseModel, ValidationModel extends Model = Model> = {
  model: Model;
  validationErrors: ValidationErrors<ValidationModel>;
  hasValidationErrors: boolean;
}

export class Form<ValidationModel extends BaseModel> extends React.Component<Props<ValidationModel>, State<ValidationModel>> {
  constructor(props: Props<ValidationModel>) {
    super(props);

    this.state = {
      model: {} as ValidationModel,
      validationErrors: undefined,
      hasValidationErrors: false,
    };

    this.validateField = this.validateField.bind(this);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  private async validate() {
    const validationErrors = objectKeys(this.props.validator).reduce((prev, nextField) => {
      const [validate, message] = this.props.validator[nextField];

      const inputValue = this.state.model[nextField];

      if (!validate(inputValue)) {
        return {
          ...prev,
          [nextField]: message,
        }
      }

      return prev;
    }, {} as NonNullable<ValidationErrors<ValidationModel>>);

    return new Promise((resolve) => {
      if (Object.keys(validationErrors).length > 0) {
        this.setState({
          validationErrors,
          hasValidationErrors: true,
        }, resolve);
      } else {
        this.setState({
          validationErrors: undefined,
          hasValidationErrors: false,
        }, resolve);
      }
    });
  }

  private validateField(field: keyof ValidationModel) {
    const [validate, message] = this.props.validator[field];

    const inputValue = this.state.model[field];

    const fieldValidated = validate(inputValue);

    this.setState((prev) => ({
      validationErrors: {
        ...prev.validationErrors,
        [field]: fieldValidated ? undefined : message,
      },
      hasValidationErrors: prev.hasValidationErrors || !fieldValidated,
    }));
  }

  private onChange(field: keyof ValidationModel, newValue: string) {
    this.setState((prev) => ({
      model: {
        ...prev.model,
        [field]: newValue,
      },
    }));
  }

  private submit() {
    return this.validate().then(() => {
      if (!this.state.hasValidationErrors) {
        return this.props.onSubmit(this.state.model);
      }
    })
  }

  render() {
    return this.props.render({
      model: this.state.model,
      validate: this.validate,
      validateField: this.validateField,
      validationErrors: this.state.validationErrors,
      canSubmit: false,
      submit: this.submit,
      onChange: this.onChange,
    });
  }
}
