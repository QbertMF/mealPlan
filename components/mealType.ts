// To parse this data:
//
//   import { Convert, MealType } from "./file";
//
//   const mealType = Convert.toMealType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface MealType {
    vegetarian:               boolean;
    vegan:                    boolean;
    glutenFree:               boolean;
    dairyFree:                boolean;
    veryHealthy:              boolean;
    cheap:                    boolean;
    veryPopular:              boolean;
    sustainable:              boolean;
    lowFodmap:                boolean;
    weightWatcherSmartPoints: number;
    gaps:                     string;
    preparationMinutes:       null;
    cookingMinutes:           null;
    aggregateLikes:           number;
    healthScore:              number;
    creditsText:              string;
    sourceName:               string;
    pricePerServing:          number;
    extendedIngredients:      ExtendedIngredient[];
    id:                       number;
    title:                    string;
    readyInMinutes:           number;
    servings:                 number;
    sourceUrl:                string;
    image:                    string;
    imageType:                string;
    summary:                  string;
    cuisines:                 any[];
    dishTypes:                string[];
    diets:                    string[];
    occasions:                any[];
    instructions:             string;
    analyzedInstructions:     AnalyzedInstruction[];
    originalId:               null;
    spoonacularScore:         number;
    spoonacularSourceUrl:     string;
}

export interface AnalyzedInstruction {
    name:  string;
    steps: Step[];
}

export interface Step {
    number:      number;
    step:        string;
    ingredients: Ent[];
    equipment:   Ent[];
    length?:     Length;
}

export interface Ent {
    id:            number;
    name:          string;
    localizedName: string;
    image:         string;
}

export interface Length {
    number: number;
    unit:   string;
}

export interface ExtendedIngredient {
    id:           number;
    aisle:        string;
    image:        null | string;
    consistency:  Consistency;
    name:         string;
    nameClean:    null | string;
    original:     string;
    originalName: string;
    amount:       number;
    unit:         string;
    meta:         string[];
    measures:     Measures;
}

export enum Consistency {
    Liquid = "LIQUID",
    Solid = "SOLID",
}

export interface Measures {
    us:     Metric;
    metric: Metric;
}

export interface Metric {
    amount:    number;
    unitShort: string;
    unitLong:  string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMealType(json: string): MealType {
        return cast(JSON.parse(json), r("MealType"));
    }

    public static mealTypeToJson(value: MealType): string {
        return JSON.stringify(uncast(value, r("MealType")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "MealType": o([
        { json: "vegetarian", js: "vegetarian", typ: true },
        { json: "vegan", js: "vegan", typ: true },
        { json: "glutenFree", js: "glutenFree", typ: true },
        { json: "dairyFree", js: "dairyFree", typ: true },
        { json: "veryHealthy", js: "veryHealthy", typ: true },
        { json: "cheap", js: "cheap", typ: true },
        { json: "veryPopular", js: "veryPopular", typ: true },
        { json: "sustainable", js: "sustainable", typ: true },
        { json: "lowFodmap", js: "lowFodmap", typ: true },
        { json: "weightWatcherSmartPoints", js: "weightWatcherSmartPoints", typ: 0 },
        { json: "gaps", js: "gaps", typ: "" },
        { json: "preparationMinutes", js: "preparationMinutes", typ: null },
        { json: "cookingMinutes", js: "cookingMinutes", typ: null },
        { json: "aggregateLikes", js: "aggregateLikes", typ: 0 },
        { json: "healthScore", js: "healthScore", typ: 0 },
        { json: "creditsText", js: "creditsText", typ: "" },
        { json: "sourceName", js: "sourceName", typ: "" },
        { json: "pricePerServing", js: "pricePerServing", typ: 3.14 },
        { json: "extendedIngredients", js: "extendedIngredients", typ: a(r("ExtendedIngredient")) },
        { json: "id", js: "id", typ: 0 },
        { json: "title", js: "title", typ: "" },
        { json: "readyInMinutes", js: "readyInMinutes", typ: 0 },
        { json: "servings", js: "servings", typ: 0 },
        { json: "sourceUrl", js: "sourceUrl", typ: "" },
        { json: "image", js: "image", typ: "" },
        { json: "imageType", js: "imageType", typ: "" },
        { json: "summary", js: "summary", typ: "" },
        { json: "cuisines", js: "cuisines", typ: a("any") },
        { json: "dishTypes", js: "dishTypes", typ: a("") },
        { json: "diets", js: "diets", typ: a("") },
        { json: "occasions", js: "occasions", typ: a("any") },
        { json: "instructions", js: "instructions", typ: "" },
        { json: "analyzedInstructions", js: "analyzedInstructions", typ: a(r("AnalyzedInstruction")) },
        { json: "originalId", js: "originalId", typ: null },
        { json: "spoonacularScore", js: "spoonacularScore", typ: 3.14 },
        { json: "spoonacularSourceUrl", js: "spoonacularSourceUrl", typ: "" },
    ], false),
    "AnalyzedInstruction": o([
        { json: "name", js: "name", typ: "" },
        { json: "steps", js: "steps", typ: a(r("Step")) },
    ], false),
    "Step": o([
        { json: "number", js: "number", typ: 0 },
        { json: "step", js: "step", typ: "" },
        { json: "ingredients", js: "ingredients", typ: a(r("Ent")) },
        { json: "equipment", js: "equipment", typ: a(r("Ent")) },
        { json: "length", js: "length", typ: u(undefined, r("Length")) },
    ], false),
    "Ent": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "localizedName", js: "localizedName", typ: "" },
        { json: "image", js: "image", typ: "" },
    ], false),
    "Length": o([
        { json: "number", js: "number", typ: 0 },
        { json: "unit", js: "unit", typ: "" },
    ], false),
    "ExtendedIngredient": o([
        { json: "id", js: "id", typ: 0 },
        { json: "aisle", js: "aisle", typ: "" },
        { json: "image", js: "image", typ: u(null, "") },
        { json: "consistency", js: "consistency", typ: r("Consistency") },
        { json: "name", js: "name", typ: "" },
        { json: "nameClean", js: "nameClean", typ: u(null, "") },
        { json: "original", js: "original", typ: "" },
        { json: "originalName", js: "originalName", typ: "" },
        { json: "amount", js: "amount", typ: 3.14 },
        { json: "unit", js: "unit", typ: "" },
        { json: "meta", js: "meta", typ: a("") },
        { json: "measures", js: "measures", typ: r("Measures") },
    ], false),
    "Measures": o([
        { json: "us", js: "us", typ: r("Metric") },
        { json: "metric", js: "metric", typ: r("Metric") },
    ], false),
    "Metric": o([
        { json: "amount", js: "amount", typ: 3.14 },
        { json: "unitShort", js: "unitShort", typ: "" },
        { json: "unitLong", js: "unitLong", typ: "" },
    ], false),
    "Consistency": [
        "LIQUID",
        "SOLID",
    ],
};
