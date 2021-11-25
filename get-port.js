const portsJson = require('./.github/ports.json');
/**
 * Calculate port based on env variables
 * @returns {number}
 */
module.exports = getPort = () => {
    if(process.env.PORT) return Number.parseInt(process.env.PORT);
    if(process.env.NODE_ENV === 'production') return Number.parseInt(portsJson.PRODUCTION_PORT);
    if(process.env.NODE_ENV === 'development') return Number.parseInt(portsJson.STAGING_PORT);

    // Hard coded value
    return 5110;
}