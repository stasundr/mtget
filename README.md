# mtget
Скрипт для скачивания последовательностей митохондриальных ДНК из [GenBank](https://www.ncbi.nlm.nih.gov/genbank/).

## Installation
Для работы требуется ```git``` и [```node```](https://nodejs.org).

```
git clone https://github.com/stasundr/mtget.git
cd mtget
npm install
```

## Usage example
Чтобы скачать все последовательности из статьи [Dryomov et al., 2015](https://www.nature.com/ejhg/journal/v23/n10/pdf/ejhg2014286a.pdf) нужно запустить ```mtget``` с двумя параметрами: ```-n``` с номерами последовательностей в генном банке и ```-o``` с названием папки, в которую нужно скачать митохондриальные геномы:

```
node mtget.js -n KF874328-KF874379 -o dryomov2015
```

---
Чтобы скачать все последовательности из статьи [Margaryan et al., 2017](http://www.cell.com/current-biology/pdf/S0960-9822(17)30695-4.pdf):

```
node mtget.js -n MF362692-MF362949 -o margaryan2017
```