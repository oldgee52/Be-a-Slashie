/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import {
    getTheSameTitleArray,
    handleChangeForObject,
    findUniqueOutcomeWithUid,
} from "./functions";

describe("get the same title", () => {
    test("is only one object and title the same", () => {
        const array1 = [{ title: "a" }];
        const array2 = [{ title: "a" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(array1);
    });
    test("is only one object and title the same, but object of array1 has more keys", () => {
        const array1 = [{ title: "a", test: "test" }];
        const array2 = [{ title: "a" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(array1);
    });
    test("is only one object and title the same, but object of array2 has more keys", () => {
        const array1 = [{ title: "a" }];
        const array2 = [{ title: "a", test: "test" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(array1);
    });
    test("is more than one object and title completely the same", () => {
        const array1 = [
            { title: "a", test: "test" },
            { title: "b", test: "test" },
            { title: "c", test: "test" },
        ];
        const array2 = [{ title: "a" }, { title: "b" }, { title: "c" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(array1);
    });
    test("is more than one object and title partial the same, and array1.length > array2.length", () => {
        const array1 = [
            { title: "a", test: "test" },
            { title: "b", test: "test" },
            { title: "c", test: "test" },
        ];
        const array2 = [{ title: "a" }, { title: "b" }];
        const result = [
            { title: "a", test: "test" },
            { title: "b", test: "test" },
        ];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(result);
    });
    test("is more than one object and title partial the same, and array1.length < array2.length", () => {
        const array1 = [
            { title: "b", test: "test" },
            { title: "c", test: "test" },
        ];
        const array2 = [{ title: "a" }, { title: "b" }, { title: "c" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual(array1);
    });
    test("is only one object and title different,", () => {
        const array1 = [{ title: "a" }];
        const array2 = [{ title: "b" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual([]);
    });
    test("is more than one object and all title different", () => {
        const array1 = [{ title: "a" }, { title: "b" }, { title: "c" }];
        const array2 = [{ title: "d" }, { title: "e" }, { title: "f" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual([]);
    });
    test("array1 is empty array", () => {
        const array2 = [{ title: "b" }];
        expect(getTheSameTitleArray([], array2)).toStrictEqual([]);
    });
    test("array2 is empty array", () => {
        const array1 = [{ title: "1" }];
        expect(getTheSameTitleArray(array1, [])).toStrictEqual([]);
    });
    test("array1 and array2 is empty array", () => {
        expect(getTheSameTitleArray([], [])).toStrictEqual([]);
    });
    test("object in array do not have key of title", () => {
        const array1 = [{ test: "a" }];
        const array2 = [{ test: "a" }];
        expect(getTheSameTitleArray(array1, array2)).toStrictEqual([]);
    });
});

describe("handle change for object", () => {
    const mockFn = jest.fn();
    const data = {
        name: "Joe",
        age: 1,
        skills: ["jump", "run"],
        isActive: true,
    };
    test("check type of string value change and callback data", () => {
        handleChangeForObject(data, "name", "Wang", mockFn);
        expect(mockFn).toBeCalledWith({ ...data, name: "Wang" });
    });
    test("check type of boolean value change and callback data", () => {
        handleChangeForObject(data, "isActive", false, mockFn);
        expect(mockFn).toBeCalledWith({ ...data, isActive: false });
    });
    test("check type of number value change and callback data", () => {
        handleChangeForObject(data, "age", 12, mockFn);
        expect(mockFn).toBeCalledWith({ ...data, age: 12 });
    });

    test("key is not exist", () => {
        handleChangeForObject(data, "test", 12, mockFn);
        expect(mockFn).toBeCalledWith({ ...data, test: 12 });
    });
    test("data is not object", () => {
        const data = [1, 2, 3];
        handleChangeForObject(data, "age", 12, mockFn);
        expect(mockFn).not.toBeCalled();
    });
    xtest("check type of array value change and callback data", () => {
        handleChangeForObject(data, "skills", "sit", mockFn);
        expect(mockFn).toBeCalledWith({
            ...data,
            skills: [...data.skills, "sit"],
        });
    });
});

describe("find unique outcome in array with uid", () => {
    test("has the same uid in object of array", () => {
        const array = [{ uid: 1 }, { uid: 1 }, { uid: 2 }, { uid: 2 }];
        const expectArray = [{ uid: 1 }, { uid: 2 }];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });
    test("do not have the same uid in object of array", () => {
        const array = [{ uid: 1 }, { uid: 2 }, { uid: 3 }];
        const expectArray = [];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });
    test("array is empty", () => {
        const array = [];
        const expectArray = [];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });

    test("object in array do not have key of uid", () => {
        const array = [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 3 }];
        const expectArray = [];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });
    test("object in array some have key of uid", () => {
        const array = [
            { uid: 1 },
            { uid: 1 },
            { uid: 2 },
            { test: 3 },
            { test: 3 },
        ];
        const expectArray = [{ uid: 1 }];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });

    xtest("has the same uid(more than two) in object of array", () => {
        const array = [
            { uid: 1 },
            { uid: 2 },
            { uid: 2 },
            { uid: 1 },
            { uid: 1 },
        ];
        const expectArray = [{ uid: 2 }, { uid: 1 }];
        expect(findUniqueOutcomeWithUid(array)).toStrictEqual(expectArray);
    });
});
