module.exports = class StringUtil {
    static addTrailingSlash(part) {
        return part.substr(-1) != '/' ? part + '/' : part;
    }
    static addLeadingSlash(part) {
        return part.substr(0,1) != '/' ? '/' + part : part;
    }
    static equalsIgnoreCase(a, b) {
        return typeof a === 'string' && typeof b === 'string'
            ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
            : a === b;
    }
}

// module.exports = {
//     addTrailingSlash: (part) => part.substr(-1) != '/' ? part + '/' : part,
//     addLeadingSlash:  (part) => part.substr(0,1) != '/' ? '/' + part : part
// }

// module.exports.addTrailingSlash = (part) => part.substr(-1) != '/' ? part + '/' : part;
// module.exports.addLeadingSlash =  (part) => part.substr(0,1) != '/' ? '/' + part : part;