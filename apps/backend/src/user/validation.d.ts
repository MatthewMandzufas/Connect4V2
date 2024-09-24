export type ValidationResult = {
  isValid: boolean;
  errors?: [
    {
      message: string;
      path: string;
    }
  ];
};
