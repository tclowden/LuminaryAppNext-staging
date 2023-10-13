export interface ValidationParams {
   [key: string]: {
      required?: ParamConfig | boolean;
      email?: ParamConfig | boolean;
      string?: ParamConfig | boolean;
      phone?: ParamConfig | boolean;
      url?: ParamConfig | boolean;
      number?: ParamConfig | boolean;
      time?: ParamConfig | boolean;
      date?: ParamConfig | boolean;
      datetime?: ParamConfig | boolean;
      minLength?: LengthConfig | number;
      maxLength?: LengthConfig | number;
      passwordMatch?: PasswordMatchConfig;

      // type
      object?: ParamConfig | boolean;
      // array?: ArrayConfig | boolean | ParamConfig;
   };
}

export interface ParamConfig {
   errorMessage?: string;
}

export interface LengthConfig extends ParamConfig {
   value: number;
}

export interface PasswordMatchConfig extends ParamConfig {
   ref: string;
}

export interface ArrayConfig {
   [key: string]: {
      required?: ParamConfig | boolean;
      email?: ParamConfig | boolean;
      string?: ParamConfig | boolean;
      phone?: ParamConfig | boolean;
      url?: ParamConfig | boolean;
      number?: ParamConfig | boolean;
      time?: ParamConfig | boolean;
      date?: ParamConfig | boolean;
      datetime?: ParamConfig | boolean;
      minLength?: LengthConfig | number;
      maxLength?: LengthConfig | number;
      passwordMatch?: PasswordMatchConfig;
   };
}
