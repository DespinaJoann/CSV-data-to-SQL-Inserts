
# CSV data to SQL inserts with JS

This program converts CSV data to SQL `INSERT` statements and writes them to a file. It was developed as part of the 2nd university assignment for the Databases course (4th semester) at the Department of Informatics and Telematics (DIT) in Harokopio University of Athens (HUA).

#### Overview
The script processes a CSV file containing athlete event data from the Olympics, filters the data based on specified criteria, and generates SQL INSERT statements to populate several tables in a relational database. The tables include Athlete, Olympics, Sport, Game, Team, Competition, Participation, Height, and Weight.


#### Prerequisites
- Node.js installed on your machine.
- CSV file (athlete_events.csv) located in a ./data subdirectory.

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

This project is part of the 2nd university assignment for the Databases course at Harokopio University of Athens (HUA). Use it according to your course guidelines and requirements.
