export type RegData = {
  name: string;
  password: string;
};

export type RegDataResult = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};
