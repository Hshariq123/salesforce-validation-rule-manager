const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const jsforce = require('jsforce');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let accessToken = '';
let instanceUrl = '';
let conn;
let codeVerifier = '';

app.get('/login', (req, res) => {

    codeVerifier = crypto.randomBytes(64).toString('hex');

    const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');

    const loginUrl =
        `${process.env.LOGIN_URL}/services/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${process.env.CLIENT_ID}` +
        `&redirect_uri=${process.env.REDIRECT_URI}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

    res.redirect(loginUrl);
});

app.get('/auth/callback', async (req, res) => {

    const code = req.query.code;

    try {

        const response = await axios.post(
            `${process.env.LOGIN_URL}/services/oauth2/token`,
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    redirect_uri: process.env.REDIRECT_URI,
                    code,
                    code_verifier: codeVerifier
                }
            }
        );

        accessToken = response.data.access_token;
        instanceUrl = response.data.instance_url;
        conn = new jsforce.Connection({
            instanceUrl,
            accessToken
        });
        console.log("Access Token:", accessToken);
        console.log("Instance URL:", instanceUrl);

        res.send('Salesforce Login Successful');

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.send('OAuth Error');
    }
});
app.get('/validation-rules', async (req, res) => {

    try {

        const query = `
    SELECT Id,
           ValidationName,
           Active,
           EntityDefinition.QualifiedApiName
    FROM ValidationRule
`;
        const response = await axios.get(

            `${instanceUrl}/services/data/v60.0/tooling/query`,

            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },

                params: {
                    q: query
                }
            }
        );

       const cleanedRules = response.data.records.map(rule => ({
    Id: rule.Id,
    ValidationName: rule.ValidationName,
    Active: rule.Active,

    FullName:
      `${rule.EntityDefinition.QualifiedApiName}.${rule.ValidationName}`
}));

        res.json(cleanedRules);
    } catch (error) {

        console.log(error.response?.data || error.message);

        res.status(500).json({
            error: 'Failed to fetch validation rules'
        });
    }
});
app.post('/toggle-rule', async (req, res) => {

    try {

        const { fullName, active } = req.body;

        const metadata = await conn.metadata.read(
            'ValidationRule',
            fullName
        );

        metadata.active = active;

        const result = await conn.metadata.update(
            'ValidationRule',
            metadata
        );

        res.json(result);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'Failed to toggle validation rule'
        });
    }
});
app.post('/toggle-all', async (req, res) => {

    try {

        const { active } = req.body;

        const query = `
            SELECT Id,
                   ValidationName,
                   Active,
                   EntityDefinition.QualifiedApiName
            FROM ValidationRule
        `;

        const response = await axios.get(

            `${instanceUrl}/services/data/v60.0/tooling/query`,

            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },

                params: {
                    q: query
                }
            }
        );

        const rules = response.data.records;

        for (const rule of rules) {

            const fullName =
                `${rule.EntityDefinition.QualifiedApiName}.${rule.ValidationName}`;

            const metadata = await conn.metadata.read(
                'ValidationRule',
                fullName
            );

            metadata.active = active;

            await conn.metadata.update(
                'ValidationRule',
                metadata
            );
        }

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'Failed to toggle all rules'
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});