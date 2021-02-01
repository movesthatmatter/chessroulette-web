import React from 'react';
import { objectKeys } from 'src/lib/util';
import objectEquals from 'object-equals';

type BaseModel = {
  [field: string]: string;
}

type ValidationErrors<ValidationModel extends BaseModel> = undefined | {
  [k in keyof ValidationModel]?: string;
};

type Props<Model extends BaseModel, ValidationModel extends Model = Model> = {
  onSubmit: (model: ValidationModel) => void | Promise<unknown>;
  onValidationErrorsUpdated?: (validationErrors: ValidationErrors<ValidationModel>) => void;
  validator: {
    [k in keyof Partial<ValidationModel>]: [
      (i: string) => boolean,
      string,
    ]
  }
  initialModel?: Partial<Model>;
  validateOnChange: boolean;
  render: (p: {
    model: Model;
    validate: () => void;
    validateField: (k: keyof ValidationModel) => void;
    validationErrors: ValidationErrors<ValidationModel>;
    hasValidationErrors: boolean;
    canSubmit: boolean;
    submit: () => void | Promise<unknown>;
    onChange: (field: keyof ValidationModel, newValue: string) => void;
  }) => React.ReactNode;
};

type State<Model extends BaseModel, ValidationModel extends Model = Model> = {
  model: Model;
  validationErrors: ValidationErrors<ValidationModel>;
  hasValidationErrors: boolean;
  canSubmit: boolean;
}

export class Form<
  Model extends BaseModel,
  ValidationModel extends Model = Model
  > extends React.Component<Props<ValidationModel>, State<ValidationModel>> {

  static defaultProps: Partial<Props<{}>> = {
    validateOnChange: false,
  };

  constructor(props: Props<ValidationModel>) {
    super(props);

    this.state = {
      model: (this.props.initialModel || {}) as ValidationModel,
      validationErrors: undefined,
      hasValidationErrors: false,
      canSubmit: Object.keys(this.props.validator).length === 0,
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
          canSubmit: false,
        }, resolve);
      } else {
        this.setState({
          validationErrors: undefined,
          hasValidationErrors: false,
          canSubmit: true,
        }, resolve);
      }
    });
  }

  private validateField(field: keyof ValidationModel) {
    const [validate, message] = this.props.validator[field];

    const inputValue = this.state.model[field];

    const fieldValidated = validate(inputValue);

    this.setState((prev) => {
      const { [field]: removed, ...restPrevValidationErrors} = prev.validationErrors || {};

      const nextValidationErrors = {
        ...restPrevValidationErrors,
        ...!fieldValidated && {
          [field]: message,
        }
      };
      const nextHasValidationErrors = Object.keys(nextValidationErrors).length > 0;

      return {
        ...prev,
        validationErrors: nextValidationErrors,
        hasValidationErrors: nextHasValidationErrors,
        canSubmit: !nextHasValidationErrors,
      };
    });
  }

  private onChange(field: keyof ValidationModel, newValue: string) {
    this.setState((prev) => ({
      model: {
        ...prev.model,
        [field]: newValue,
      },
    }), () => {
      if (this.props.validateOnChange) {
        this.validateField(field);
      }
    });
  }

  private submit() {
    return this.validate().then(() => {
      if (!this.state.hasValidationErrors) {
        return this.props.onSubmit(this.state.model);
      }
    })
  }

  componentDidUpdate(_: Props<ValidationModel>, prevState: State<ValidationModel>) {
    if (
      this.props.onValidationErrorsUpdated
      && !objectEquals(prevState.validationErrors, this.state.validationErrors)
    ) {
      this.props.onValidationErrorsUpdated(this.state.validationErrors);
    }
  }

  render() {
    return this.props.render({
      model: this.state.model,
      validate: this.validate,
      validateField: this.validateField,
      validationErrors: this.state.validationErrors,
      hasValidationErrors: this.state.hasValidationErrors,
      canSubmit: this.state.canSubmit,
      submit: this.submit,
      onChange: this.onChange,
    });
  }
}