module.exports = {
    source: {
        include: ["./controllers"],
        exclude: ["./node_modules"]
    },
    opts: {
        destination: "./docs"
    },
    plugins: [],
    recurseDepth: 10,
    sourceType: "module",
    tags: {
        allowUnknownTags: true,
        dictionaries: ["jsdoc", "closure"]
    },
    templates: {
        cleverLinks: false,
        monospaceLinks: false
    }
};
