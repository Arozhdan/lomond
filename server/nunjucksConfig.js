const nunjucks = require('nunjucks');
const ScriptTags = require('../nunjucks-helpers/script-tags.js');
const importTemplate = require('../nunjucks-helpers/import-template.js');
const path = require('path');


/**
 * Creates nunjucks configuration for webpack and server for SSR
 * @param {path} sourceDirectory absolute path
 * @param {boolean} useGlobalNunjucs return env variable or not
 */
const configureNunjucks = (sourceDirectory = 'src', useGlobalNunjucks = true) => {
    const nunjucksConf = {}

    if (process.env.NODE_ENV === 'development') {
        nunjucksConf.watch = true;
        nunjucksConf.dev = true;
    };

    if(!useGlobalNunjucks) {
        const env = nunjucks.configure([sourceDirectory, path.join(sourceDirectory, 'entries')], nunjucksConf)
        env
            .addGlobal('importTemplate', importTemplate)
            .addGlobal('ScriptTags', new ScriptTags());
        return env;
    } else{
        nunjucks
            .configure([path.join(sourceDirectory), path.join(sourceDirectory, 'entries')], nunjucksConf)
            .addGlobal('ScriptTags', new ScriptTags())
            .addGlobal('importTemplate', importTemplate);
    }
}

module.exports = configureNunjucks;

