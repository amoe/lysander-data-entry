export interface MyState {
    counter: number;
}

export const INCREMENT = 'INCREMENT';

// A type is mandatory, but we don't need any other info
export interface IncrementAction {
    type: typeof INCREMENT
}
