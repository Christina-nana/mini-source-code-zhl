declare function effect(fn: any): void;

declare function reactive(obj: any): any;

declare function ref(value: any): RefImpl;
declare class RefImpl {
    _val: any;
    constructor(value: any);
    get value(): any;
    set value(newValue: any);
}

declare const res: boolean;

export { res as default, effect, reactive, ref };
