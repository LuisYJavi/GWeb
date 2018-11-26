//LG probando es muy majo y se entera de todo Git


const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'gyms.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);


for (let contract in output) {TextTrackList
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':' , '') + '.json'),
        output [contract]       
    );
};


