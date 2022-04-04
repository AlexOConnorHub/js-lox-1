#!/usr/bin/env node

const { jsLoxError } = require("./error");
const { writeFileSync } = require('fs');

function defineAst(outputDir, baseName, types) {
    let data = ``;

    // data += `abstract class ${baseName} {\n`;
    // The AST classes.
    types.forEach(type => {
        let className = type[0];
        let fields = type[1]; 
        data += defineType(baseName, className, fields);
    });

    data += "module.exports = {\n";

    types.forEach(type => {
        data += `    ${type[0]},\n`
    });

    data += "}\n"

    writeFileSync(outputDir + "/" + baseName + ".js", data, "");
}

function defineType(baseName, className, fieldList) {
    let data = `class ${className} {\n`;

    // Constructor.
    data += `    constructor ( `

    for (let i = 0; i < fieldList.length - 1; i++) {
        data += `${fieldList[i]}, `;
    }
    
    data += `${fieldList[fieldList.length - 1]} ) {\n`;

    // Store parameters in fields.
    fieldList.forEach(field => {
        data += `        this.${field} = ${field};\n`;
    });

    data += `    }\n`;
    data += `    accept (visitor) {\n`;
    data += `        return visitor.visit${className}${baseName}(this);\n`
    data += `    }\n`;
    data += `}\n\n`;
    
    return data;
} 

if (process.argv.length != 3) {
    let err = new jsLoxError('from "GernarateAst.js"', 64);
    jsLoxError.exit(err.exitCode, err.message);
}

defineAst(process.argv[2], "Expr", [
    ["Binary", ["left", "operator", "right"]],
    ["Grouping", ["expression"]],
    ["Literal", ["value"]],
    ["Unary", ["operator", "right"]]
]);
