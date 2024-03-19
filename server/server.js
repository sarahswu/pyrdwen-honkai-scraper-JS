const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();

const charactersList = [];

const getCharacters = async () => {
    try {
        const { data } = await axios.get('https://www.prydwen.gg/star-rail/characters/');
        const $ = cheerio.load(data);

        // character names
        $('span.emp-name').each((i, el) => {
            const character = $(el).text();
            charactersList.push({character, 'url': ''});
        })

        // character urls
        $('div.avatar-card > span > a').each((i, el) => {
            const url = $(el).attr('href');
            charactersList[i].url = url;
        })

        return charactersList;
    } catch (error) {
        throw error;
    }
}

// const getStats = async (url) => {
//     console.log(url);
//     try {
//         const { data } = await axios.get('https://www.prydwen.gg/star-rail/characters/'+url);
//         const $ = cheerio.load(data);

//         // recommended endgame stats
//         const endGameStats = [];
//         $('div.raw > ul > li > p').each((i, el) => {
//             const stat = $(el).text();
//             endGameStats.push({stat});
//         })

//         characterStats.push(endGameStats);
//         return characterStats;
//     } catch (error) {
//         throw error;
//     }
// }

getCharacters()

app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.json(charactersList);
});

app.get('/stats', async (req, res) => {
    console.log('req.query:', req.query);
    const url = req.query.character;
    try {
        const { data } = await axios.get('https://www.prydwen.gg/star-rail/characters/'+url);
        const $ = cheerio.load(data);

        // recommended endgame stats
        const characterStats = {};
        const endGameStats = [];
        const tracesPriority = [];
        $('div.raw > ul > li').each((i, el) => {
            if (i<8) return;
            const stat = $(el).text();
            endGameStats.push(stat);
        })
        $('div.build-stats > div.row').each((i, el) => {
            if (i == 2 || i == 3) {
                const stat = $(el).text();
                tracesPriority.push(stat);
            }
        })

        characterStats.endgame = endGameStats;
        characterStats.traces = tracesPriority;
        res.json(characterStats);
    } catch (error) {
        res.json('incorrect character name')
    }
    // let selectedCharacter = req.query;
    // res.json(getStats(selectedCharacter));
})

// app.post('/stats', (req, res) => {
//     const url = req.body;
//     getStats(url.url);
//     res.send(characterStats);
// });
    
app.listen(3001, () => { console.log('server started on port 3001') })