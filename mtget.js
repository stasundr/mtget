const fs = require('fs');
const request = require('superagent');
const yargs = require('yargs');
const { queue } = require('async');

function getUrlByGenbankId(id) {
  return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&amp;id=${id}&amp;rettype=fasta`;
}

async function getFastaByGenbankId(id) {
  try {
    const response = await request.get(getUrlByGenbankId(id));
    return response.text;
  } catch (error) {
    console.log(error);
    return '';
  }
}

const argv = yargs
  .option('numbers', {
    alias: 'n',
    describe: 'Genbank accession numbers (IDs)'
  })
  .option('out', {
    alias: 'o',
    describe: 'provide a path to output folder'
  })
  .demandOption(
    ['numbers', 'out'],
    'Please provide both GenBank accession numbers and output folder to work with mtget'
  )
  .help().argv;

function getGenbankIds() {
  if (argv.numbers.match(/^\w+\d+\.*\d*$/)) {
    return [argv.numbers];
  }

  if (argv.numbers.match(/^\w+\d+\.*\d*\-\w+\d+\.*\d*$/)) {
    const ids = [];
    const raw = argv.numbers;
    const prefix = raw.match(/^[A-Za-z]+/)[0];

    let start = parseInt(raw.match(/^\w+\d+\.*\d*/)[0].replace(prefix, ''), 10);
    let end = parseInt(raw.match(/\w+\d+\.*\d*$/)[0].replace(prefix, ''), 10);

    start = Math.min(start, end);
    end = Math.max(start, end);

    const pack = [];
    const originalLength = raw.match(/^\w+\d+\.*\d*/)[0].replace(prefix, '')
      .length;
    for (let i = start; i <= end; i += 1) {
      let zeroes = '';
      for (let j = 0; j < originalLength - `${i}`.length; j += 1) zeroes += '0';

      pack.push(`${prefix}${zeroes}${i}`);
    }

    return ids.concat(pack);
  }

  return [];
}

if (!fs.existsSync(argv.out)) fs.mkdirSync(argv.out);

const genbankQueue = queue((id, callback) => {
  getFastaByGenbankId(id).then(data => {
    const label = data
      .split('\n')[0]
      .replace(/[>,;]/g, '')
      .replace(/\s.*:/, ' ')
      .replace(
        /(homo|sapiens|isolate|DNA|region|sequence|D-loop|complete|partial|mt|genome|mitochondrion|mitochondrial|mitochondria)/gi,
        ''
      )
      .replace(/(\s|_)+/g, '_')
      .replace(/_$/, '');

    console.log(`${id} -> ${argv.out}/${label}.fasta`);

    fs.writeFileSync(`${argv.out}/${label}.fasta`, data, 'ascii');

    callback();
  });
}, 8);

genbankQueue.push(getGenbankIds());
