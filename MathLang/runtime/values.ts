export type ValueTypes = "null" | "number";

export interface RuntimeValue {
    type: ValueTypes;
}

export interface Value extends RuntimeValue {
    type: ValueTypes;
    value: any;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: "null";
}

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}
