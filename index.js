const csvFilePath='./data/athlete_events.csv'
const csv = require('csvtojson')


const fs = require('node:fs');

// filter data to insert (per year, Sport and NOC)
let validYears = '1896,1972,1976,1980,2012,2016'.split(',');    // -> 19908 lines
let validSports = [ 'Athletics', 'Gymnastics', 'Bobsleigh' ];
let validNOC = 'NOR,FRA,RUS,URS,GRE,SUD,EGY,ALG,AUS,USA,NGR,BLR,GER,CMR,GDR,ITA,ROU,GHA,GBR,CUB,ARG,LTU,MAR,TCH,RSA,BUL,LAT,CZE,SVK,IRL,ALB,TPE'.split(',');

var inserts = {     // temporary lists to keep unique values
    athleteIDs: [],
    athlete: [],
    olympics: [],
    sports: [],
    participation: [],
    competition: [],
    game: [],
    team: [],
    height: [],
    weight: []
}

let sql = [];

// data of tables (will be exported to SQL inserts)
var athlete_ = [];
var competition_ = [];
var participation_ = [];
var olympics_ = [];
var game_ = [];
var sport_ = [];
var team_ = [];
var height_ = [];
var weight_ = [];


function randInt(max) {
    return Math.floor(Math.random() * max);
}

function idFromPattern(arr, pattern) {
    let result = false;
    arr.forEach(it => {
        if (it.pattern == pattern) {
            result = arr.id;
        }
    })
    return result;
}


csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    // console.log(jsonObj.slice(0, 100));

    var i = 0;
    jsonObj.forEach( rec => {
        let nameParts = rec.Name.split(' ');
        let firstName = nameParts.shift();
        let lastName = nameParts.join(' ');
        
        
        if (validYears.includes(rec.Year) && validSports.includes(rec.Sport)
        && validNOC.includes(rec.NOC) && rec.Height != 'NA' && rec.Weight != 'NA') {

            // console.log(rec);
            // if (rec.ID == '135501') console.log(rec);

            if (!inserts.athleteIDs.includes(rec.ID)) {
                inserts.athleteIDs.push(rec.ID);
                // inserts.athlete.push(
                // `INSERT INTO Athlete (athleteId, firstName, lastName, sex, birthdate, NOC) VALUES ( ${rec.ID}, '${firstName}', '${lastName}', '${rec.Sex}', '${randInt(18)+10}-${randInt(2)+10}-${rec.Year - rec.Age}');`
                // )
                athlete_.push({
                    id: rec.ID,
                    firstName: firstName,
                    lastName: lastName,
                    sex: rec.Sex,
                    birthdate: `${rec.Year - rec.Age}-${randInt(2)+10}-${randInt(18)+10}`,  // fake date based on birthyear
                    noc: rec.NOC
                })
            }
            
            let olympiad = `${rec.Year}*${rec.Season}*${rec.City}`;
            if (!inserts.olympics.includes(olympiad)) {
                inserts.olympics.push(olympiad);
            }

            let competition = `${olympiad}!${rec.Event}`;
            if (!inserts.competition.includes(competition)) {
                inserts.competition.push(competition);
            }

            let sport = rec.Sport;
            if (!inserts.sports.includes(sport)) {
                inserts.sports.push(sport);
            }

            let game = `${rec.Sport}#${rec.Event}`;
            if (!inserts.game.includes(game)) {
                inserts.game.push(game);
            }

            if (!inserts.team.includes(rec.NOC)) {
                inserts.team.push(rec.NOC);
                team_.push({
                    noc: rec.NOC,
                    country: rec.Team
                })
            }

            let participation = `${rec.ID}^${competition}^${rec.Medal}^${rec.Height}^${rec.Weight}`
            if (!inserts.participation.includes(participation)) {
                inserts.participation.push(participation);
            }

        }

    })
    // console.log(inserts.athlete.join('\n'));


    inserts.olympics.forEach( (oly, index) => {
        let olyArr = oly.split('*');
        // olys.push(
        //     `INSERT INTO Olympics (olympicId, olympicYear, olympicHostTown, olympicPeriod) VALUES (${index+1}, ${olyArr[0]}, '${olyArr[2]}', '${olyArr[1]}');`
        // )
        olympics_.push({
            id: index+1,
            year: olyArr[0],
            town: olyArr[2],
            period: olyArr[1],
            pattern: oly
        })
    })


    inserts.sports.forEach((sp, index) => {
        sport_.push({
            id: index +1,
            name: sp,
            pattern: sp
        })
    })


    inserts.game.forEach( (g, index) => {
        let gameParts = g.split('#');
        let sportPattern = gameParts[0];
        let name = gameParts[1];
        game_.push({
            id: index + 1,
            sportId: sport_.find((sp) => sp.pattern === sportPattern).id,
            name: name,
            pattern: g
        })
    })


    inserts.competition.forEach( (c, index) => {
        let compParts = c.split('!');
        let olyPattern = compParts[0];
        let gamePattern = compParts[1];

        let gameRec = game_.find((g) => g.name === gamePattern);
        let gameId = (gameRec === undefined) ? false : gameRec.id;

        // console.log(gamePattern);

        competition_.push({
            id: index +1,
            olympicId: olympics_.find((o) => o.pattern === olyPattern).id,
            gameId: gameId,
            pattern: c
        })
    })

    inserts.participation.forEach( (p, index) => {
        let pParts = p.split('^');
        let medal = pParts[2];
        let athleteId = pParts[0];
        let competition = pParts[1];
        let height = pParts[3];
        let weight = pParts[4];

        participation_.push({
            id: index+1,
            athleteId: athleteId,
            competitionId: competition_.find((c) => c.pattern === competition).id,
            medal: medal,
            pattern: p
        })

        height_.push({
            participationId: index+1,
            height: height
        })
        weight_.push({
            participationId: index+1,
            weight: weight
        })
    })




    // sql inserts

    sql.push(`
    -- olympics records`);
    olympics_.forEach(o => {
        sql.push(`INSERT INTO Olympics (olympicId, olympicYear, olympicHostTown, olympicPeriod) VALUES (${o.id}, ${o.year}, '${o.town.replaceAll("'", "''")}', '${o.period}');`)
    })

    sql.push(`
    -- sports data`);
    sport_.forEach(sp => {
        sql.push(`INSERT INTO Sport (sportId, sportName) VALUES (${sp.id}, '${sp.name.replaceAll("'", "''")}');`)
    })

    sql.push(`
    -- game data`);
    game_.forEach(g => {
        sql.push(`INSERT INTO Game (gameId, gameName, sportId) VALUES (${g.id}, '${g.name.replaceAll("'", "''")}', ${g.sportId});`)
    })

    sql.push(`
    -- teams data`);
    team_.forEach(t => {
        sql.push(`INSERT INTO Team (NOC, country) VALUES ('${t.noc}', '${t.country.replaceAll("'", "''")}');`)
    })

    sql.push(`
    -- competitions data`);
    competition_.forEach(c => {
        sql.push(`INSERT INTO Competition (competitionId, olympicId, gameId) VALUES (${c.id}, ${c.olympicId}, ${c.gameId});`)
    })

    sql.push(`
    -- athletes records`);
    athlete_.forEach( a => {
        sql.push(
            `INSERT INTO Athlete (athleteId, firstName, lastName, sex, birthdate, NOC) VALUES ( ${a.id}, '${a.firstName.replaceAll("'", "''")}', '${a.lastName.replaceAll("'", "''")}', '${a.sex}', '${a.birthdate}', '${a.noc}');`
        )
    });

    sql.push(`
    -- participation data`);
    participation_.forEach(p => {
        sql.push(`INSERT INTO Participation (participationId, athleteId, competitionId, medalType) VALUES (${p.id}, ${p.athleteId}, ${p.competitionId}, '${p.medal}');`)
    })

    sql.push(`
    -- height data`);
    height_.forEach(p => {
        sql.push(`INSERT INTO Height (participationId, heightValue) VALUES (${p.participationId}, ${p.height});`)
    })

    sql.push(`
    -- weight data`);
    weight_.forEach(p => {
        sql.push(`INSERT INTO MassWeight (participationId, weightValue) VALUES (${p.participationId}, ${p.weight});`)
    })


    fs.writeFile('./insert.sql', sql.join('\n'), err => {
        if (err) {
          console.error(err);
        } else {
          console.log('file written successfully');
        }
    });
    
})
 


// Async / await usage
// const jsonArray=await csv().fromFile(csvFilePath);