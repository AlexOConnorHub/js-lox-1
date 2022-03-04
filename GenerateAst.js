#!/usr/bin/env node

import { exit } from "./error";
import { writeFileSync } from 'fs';

function defineAst(outputDir, baseName, types) {
    let data = `#!/usr/bin/env node\n\nclass ${baseName} {\n    accept (visitor) {}\n};\n\n`;

    // data += `abstract class ${baseName} {\n`;
    // The AST classes.
    types.forEach(type => {
        let className = type[0];
        let fields = type[1]; 
        data += defineType(baseName, className, fields);
    });

    data += "module.exports = {\n";

    data += `    ${baseName},\n`
    types.forEach(type => {
        data += `    ${type[0]},\n`
    });

    data += "}\n"

    writeFileSync(outputDir + "/" + baseName + ".js", data);
}

function defineType(baseName, className, fieldList) {
    let data = `class ${className} extends ${baseName}{\n`;
    // let data = `class ${className} extends ${baseName} {\n`;

    // Constructor.
    data += `    constructor ( `

    for (let i = 0; i < fieldList.length - 1; i++) {
        data += `${fieldList[i]}, `;
    }
    
    data += `${fieldList[fieldList.length - 1]} ) {\n        super()\n`;

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
    exit('from "GernarateAst.js"', 64);
}

defineAst(process.argv[2], "Expr", [
    ["Binary", ["left", "operator", "right"]],
    ["Grouping", ["expression"]],
    ["Literal", ["value"]],
    ["Unary", ["operator", "right"]]
]);
