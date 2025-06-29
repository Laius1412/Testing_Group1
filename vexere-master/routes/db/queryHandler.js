const singleQueryHandler = (queue) => {
    if (!queue) {
        return "";
    }
    if (typeof queue === "string") {
        return queue;
    }
    if (Array.isArray(queue)) {
        return ((queue.length > 0) ? queue[0] : "");
    }
    return "";
};
const arrayQueryHandler = (queue) => {
    const empty = [];
    if (!queue) {
        return empty;
    }
    if (typeof queue === "string") {
        return [queue];
    }
    if (Array.isArray(queue)) {
        return queue;
    }
    return empty;
};
const singleIntQueryHandler = (queue, defaultValue = 0) => {
    if (typeof queue === "number") {
        return queue;
    }
    const query = Number.parseInt(singleQueryHandler(queue));
    return (isNaN(query)) ? defaultValue : query;
};
const arrayIntQueryHandler = (queue) => {
    const arr = [];
    const query = arrayQueryHandler(queue);
    query.forEach((value) => {
        const num = Number.parseInt(value);
        if (!isNaN(num)) {
            arr.push(num);
        }
    });
    return arr;
};
const singleFloatQueryHandler = (queue, defaultValue = 0) => {
    const query = Number.parseFloat(singleQueryHandler(queue));
    return (isNaN(query)) ? defaultValue : query;
};
const arrayFloatQueryHandler = (queue) => {
    const arr = [];
    const query = arrayQueryHandler(queue);
    query.forEach((value) => {
        const num = Number.parseFloat(value);
        if (!isNaN(num)) {
            arr.push(num);
        }
    });
    return arr;
};
export { singleQueryHandler, arrayQueryHandler, singleIntQueryHandler, arrayIntQueryHandler, singleFloatQueryHandler, arrayFloatQueryHandler };
