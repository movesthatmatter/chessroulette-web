import React from 'react';
import { objectKeys } from 'src/lib/util';
import objectEquals from 'object-equals';
import { AsyncResult } from 'ts-async-results';

type BaseModel = {
  [field: string]: string;
};

type ValidationErrors<ValidationModel extends BaseModel> = {
  [k in keyof ValidationModel]?: string;
};

type SubmissionValidationErrors<ValidationModel extends BaseModel> = {
  type: 'SubmissionValidationErrors';
  content: {
    fields: ValidationErrors<ValidationModel>;
  };
};
type SubmissionGenericError = {
  type: 'SubmissionGenericError';
  content: string | undefined;
};

export type SubmissionErrors<ValidationModel extends BaseModel> =
  | SubmissionValidationErrors<ValidationModel>
  | SubmissionGenericError;

type Props<Model extends BaseModel, ValidationModel extends Model = Model> = {
  onSubmit: (model: ValidationModel) => AsyncResult<void, SubmissionErrors<ValidationModel>>;
  onValidationErrorsUpdated?: (validationErrors?: ValidationErrors<ValidationModel>) => void;
  validator?: {
    [k in keyof Partial<ValidationModel>]: [(i: string) => boolean, string];
  };
  initialModel?: Partial<Model>;
  validateOnChange: boolean;
  disableValidators?: boolean;
  render: (p: {
    model: Model;
    validate: () => void;
    validateField: (k: keyof ValidationModel) => void;
    errors: State<Model, ValidationModel>['errors'];
    hasErrors: State<Model, ValidationModel>['hasErrors'];

    canSubmit: boolean;
    submit: () => void | Promise<unknown>;
    onChange: (field: keyof ValidationModel, newValue: string) => void;
  }) => React.ReactNode;
};

type State<Model extends BaseModel, ValidationModel extends Model = Model> = {
  model: Model;
  errors: {
    validationErrors?: ValidationErrors<ValidationModel>;
    submissionValidationErrors?: SubmissionValidationErrors<ValidationModel>['content']['fields'];
    submissionGenericError?: SubmissionGenericError['content'];
  };
  hasErrors: boolean;
  hasChanges: boolean;
  canSubmit: boolean;
};

export class Form<
  Model extends BaseModel,
  ValidationModel extends Model = Model
> extends React.Component<Props<ValidationModel>, State<ValidationModel>> {
  static defaultProps: Partial<Props<{}>> = {
    validateOnChange: false,
  };

  constructor(props: Props<ValidationModel>) {
    super(props);

    this.state = this.getFreshState();

    this.validateField = this.validateField.bind(this);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  private getFreshState() {
    const model = (this.props.initialModel || {}) as ValidationModel;

    return {
      model,
      commitedModel: model,
      canSubmit: Object.keys(this.props.validator || {}).length === 0,

      errors: {},
      hasErrors: false,
      hasChanges: false,
    };
  }

  private validate() {
    return new Promise((resolve) => {
      const { validator } = this.props;

      const validationErrors = validator
        ? objectKeys(validator).reduce((prev, nextField) => {
            const [validate, message] = validator[nextField];

            const inputValue = this.state.model[nextField];

            if (!validate(inputValue)) {
              return {
                ...prev,
                [nextField]: message,
              };
            }

            return prev;
          }, {} as NonNullable<ValidationErrors<ValidationModel>>)
        : ({} as NonNullable<ValidationErrors<ValidationModel>>);

      this.setState((prev) => {
        const nextState = {
          ...prev,
          errors: {
            ...this.state.errors,
            validationErrors:
              Object.keys(validationErrors).length > 0 ? validationErrors : undefined,
          },
        };

        return {
          ...nextState,
          hasErrors: this.calculateHasErrors(nextState),
          hasChanges: this.calculateHasChanges(nextState),
          canSubmit: this.calculateCanSubmit(nextState),
        };
      }, resolve);
    });
  }

  private validateField(field: keyof ValidationModel) {
    if (!(this.props.validator && this.props.validator[field])) {
      // If the field doesn't have a validator just return!
      return;
    }

    const [validate, message] = this.props.validator[field];

    const inputValue = this.state.model[field];

    const fieldValidated = validate(inputValue);

    this.setState((prev) => {
      const { [field]: removed, ...restPrevValidationErrors } = prev.errors.validationErrors || {};

      const nextValidationErrors = {
        ...restPrevValidationErrors,
        ...(!fieldValidated && {
          [field]: message,
        }),
      };

      const nextState = {
        ...prev,
        errors: {
          ...prev.errors,
          validationErrors: nextValidationErrors,
        },
      };

      return {
        ...nextState,
        hasErrors: this.calculateHasErrors(nextState),
        hasChanges: this.calculateHasChanges(nextState),
        canSubmit: this.calculateCanSubmit(nextState),
      };
    });
  }

  private calculateHasErrors({ errors }: State<ValidationModel>) {
    const { validationErrors, submissionValidationErrors, submissionGenericError } = errors;

    return (
      !!(
        validationErrors &&
        !!objectKeys(validationErrors).find((key) => validationErrors[key] !== undefined)
      ) ||
      (submissionValidationErrors &&
        !!objectKeys(submissionValidationErrors).find(
          (key) => submissionValidationErrors[key] !== undefined
        )) ||
      submissionGenericError !== undefined
    );
  }

  private calculateHasChanges(p: State<ValidationModel>) {
    return !!objectKeys(p.model).find(
      (key) => !(this.props.initialModel && p.model[key] === this.props.initialModel[key])
    );
  }

  private calculateCanSubmit(p: State<ValidationModel>) {
    return this.calculateHasChanges(p) && !this.calculateHasErrors(p);
  }

  private onChange(field: keyof ValidationModel, newValue: string) {
    // Remove the Submission Errors
    this.setState((prev) => {
      const nextState = {
        ...prev,
        errors: {
          ...prev.errors,
          submissionValidationErrors: {
            ...prev.errors.submissionValidationErrors,
            [field]: undefined,
          },
          submissionGenericError: undefined,
        },
      };

      return {
        ...nextState,
        hasErrors: this.props.disableValidators ? true : this.calculateHasErrors(nextState),
        canSubmit: this.props.disableValidators ? true : this.calculateCanSubmit(nextState),
      };
    });

    this.setState(
      (prev) => ({
        model: {
          ...prev.model,
          [field]: newValue,
        },
      }),
      () => {
        if (this.props.validateOnChange || !this.props.disableValidators) {
          this.validateField(field);
        }
      }
    );
  }

  private submit() {
    if (this.props.disableValidators) {
      return this.submitFunction();
    }
    return this.validate().then(() => {
      if (this.state.canSubmit) {
        return this.submitFunction();
      }
    });
  }

  private submitFunction() {
    this.props
      .onSubmit(this.state.model)
      .map(
        AsyncResult.passThrough(() => {
          // Not sure if this is even needed here!
          this.setState({
            errors: {},
            hasErrors: false,
          });
        })
      )
      .mapErr(
        AsyncResult.passThrough((e) => {
          if (e.type === 'SubmissionValidationErrors') {
            this.setState((prev) => {
              const nextState = {
                ...prev,
                errors: {
                  ...prev.errors,
                  submissionValidationErrors: e.content.fields,
                },
              };

              return {
                ...nextState,
                canSubmit: this.calculateCanSubmit(nextState),
                hasChanges: this.calculateHasChanges(nextState),
                hasErrors: this.calculateHasErrors(nextState),
              };
            });
          } else if (e.type === 'SubmissionGenericError') {
            this.setState((prev) => {
              const nextState = {
                ...prev,
                errors: {
                  ...prev.errors,
                  submissionGenericError: e.content || 'Something Went Wrong',
                },
              };

              return {
                ...nextState,
                canSubmit: this.calculateCanSubmit(nextState),
                hasChanges: this.calculateHasChanges(nextState),
                hasErrors: this.calculateHasErrors(nextState),
              };
            });
          }
        })
      )
      .resolve();
  }

  componentDidUpdate(prevProps: Props<ValidationModel>, prevState: State<ValidationModel>) {
    // TODO: Does it need an dee equality check??
    //  If the initial model is stored in the state it shouldn't create another instance
    //  which means it should be ok!
    if (prevProps.initialModel !== this.props.initialModel) {
      // Reset the state if the initial model has changed
      //  The initial model in this case acts as the commited model,
      //  since on save the new resource updates
      this.setState(this.getFreshState());
    }

    if (
      this.props.onValidationErrorsUpdated &&
      !objectEquals(prevState.errors.validationErrors, this.state.errors.validationErrors)
    ) {
      this.props.onValidationErrorsUpdated(this.state.errors.validationErrors);
    }
  }

  render() {
    return this.props.render({
      model: this.state.model,
      validate: this.validate,
      validateField: this.validateField,

      errors: this.state.errors,
      hasErrors: this.state.hasErrors,

      canSubmit: this.state.canSubmit,
      submit: this.submit,
      onChange: this.onChange,
    });
  }
}
