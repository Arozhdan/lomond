class ScriptTags {
    constructor(){
        this.tags = [];
    }

    addSrc(src = "")
    {
        this.tags.push(src);
    }

    toHTML()
    {
        const scripts =  this.tags.reduce((previous, current) => previous +=`<script src="${current}"></script>`, '');

        this.clear();

        return scripts;
    }

    clear(){
        this.tags = [];
    }
}

module.exports = ScriptTags;
