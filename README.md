
# CSV data to SQL inserts with JS

This program converts CSV data to SQL `INSERT` statements and writes them to a file. It was developed as part of the 2nd university assignment for the Databases course (4th semester) at the Department of Informatics and Telematics (DIT) in Harokopio University of Athens (HUA).

#### Overview
The script processes a CSV file containing athlete event data from the Olympics, filters the data based on specified criteria, and generates SQL INSERT statements to populate several tables in a relational database. The tables include Athlete, Olympics, Sport, Game, Team, Competition, Participation, Height, and Weight.


#### Prerequisites
- Node.js installed on your machine.
- CSV file (athlete_events.csv) located in a ./data subdirectory ([Install athlete_events.csv](https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results)).


#### Installation

- Clone the repository.
- Navigate to the project directory.
- Install the required Node.js modules by running:

```bash
$ npm install csvtojson
```

#### Run the code

```bash
$ node index.js
```


#### License

This side project is part of the 2nd university assignment for the Databases course at Harokopio University of Athens (HUA) by Team 89 (Chalkiadaki Despina Ioanna, Koutsi Vasiliki Maria). Anyone is free to use it for their own modifications, experiments, and feel free to extend and improve it. This project is licensed under the ISC License, which permits open use, modification, and distribution.
