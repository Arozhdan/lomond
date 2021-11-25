const importTemplate = (templatePath, asWhat = "") => {
    if(asWhat !== ""){
        return `
            {% import "${templatePath}" as ${asWhat} %}
        `;
    } else {
        return `
            {% include "${templatePath}" %}
        `;
    }
}

module.exports = importTemplate;
