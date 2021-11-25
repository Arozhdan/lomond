const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const axios = require('axios');
const glob = require('glob');

const express = require('express');
const cors = require('cors');

const getPort = require('./get-port');
const nunjucksConfigure = require('./server/nunjucksConfig.js');

const port = getPort();


const sourceFilesFolder = path.join(__dirname, 'dist');
const file404 = path.join(sourceFilesFolder, '404.html');

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.WEB_URL
}));

const env = nunjucksConfigure(sourceFilesFolder, false);

if(process.env.NODE_ENV === 'development'){
    require('./server/attachWebpackToExpress.js')(app);
} else {
    const ignoreStaticFiles = ['coach-profile.html'];
    app.use((req,res,next) => {
        const endPath = req.url.substring(req.url.lastIndexOf('/') + 1);
        if(ignoreStaticFiles.includes(endPath))
            res.sendFile(file404);
        else
            next();
    })
}

app.use(express.static(sourceFilesFolder));

app.get('/coaches/:coachName',async (req, res) => {
    const template = env.getTemplate(path.join(sourceFilesFolder, 'coach-profile.html'));

    const coachName = req.params.coachName.toLowerCase();

    const obj = await axios.get(`${process.env.REST_API_URL}/api/coaches/${coachName}`).then((response) => response.data)

    res.send(template.render(obj));
})


app.get('/api/coaches/:coachName', (req, res) => {
    const coachName = req.params.coachName.toLowerCase();
    try{
        const file =  fs.readFileSync(path.resolve(__dirname, 'api-placeholders', 'coaches', coachName + '.json'));

        res.header("Content-Type",'application/json');
        res.send(file);
    }catch(error){
        console.log(error);
        res.sendFile(file404);
    }
});

app.get('/api/latest-courses/:coachingLevel', (req, res) => {
    const coachingLevel = req.params.coachingLevel.toLowerCase();

    if(!(/(advanced|beginner|intermediate)/).test(coachingLevel)){
        res.send('Not correct request')
        return;
    }else {
        try{
            const file =  fs.readFileSync(path.resolve(__dirname, 'api-placeholders', 'choose-your-learning-path', coachingLevel + '.json'));

            res.header("Content-Type",'application/json');
            res.send(file);
        }catch(error){
            res.sendFile(file404);
        }
    }
})


app.get('*', (req, res) => {
    res.sendFile(file404);
});


const server = app.listen(port, () => {
  console.log(`3DFA listening at PORT:${port}`)
});


//Killing succesfully server
['exit','SIGINT', 'SIGTERM'].forEach(processEvent => {
    let running = true;
    process.on(processEvent, () => {
        if(running){
            server.close();
            console.log(`Gracefully terminating process 3DFA on ${port} port...`)
            running = false;
        }
    })
})
