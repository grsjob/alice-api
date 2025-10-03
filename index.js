const express = require('express');
const app = express();

app.use(express.json());

app.post('/alice', (req, res) => {
    const request = req.body;

    if (request.request.command.includes('гром')) {
        return res.json({
            response: {
                text: 'Гром!',
                tts: '<speaker effect="thunder"> Гррром! </speaker>',
                end_session: true
            },
            version: '1.0'
        });
    }

    res.json({
        response: {
            text: 'Скажите "гром"',
            end_session: false
        },
        version: '1.0'
    });
});

app.listen(3000);