jQuery(document).ready(function() {
	jQuery(".loader").delay(1000).fadeOut("slow");
  jQuery("#overlayer").delay(1000).fadeOut("slow");
  $( ".nav-link" ).hover(
    function() {
      $( this ).css('background-color','#000')
    }
  );

});

if(window.location.pathname == ( '/clubs.html') || ('/players.html') || ('/compare-players.html'))
{
  var NBAfranchise = [];
  var broj = 1;
  $.getJSON('https://api.allorigins.win/get?url=https%3A//data.nba.net/data/10s/prod/v1/2019/teams.json&callback=?', function (json) {
    const allClubs = JSON.parse(json.contents);
    const nbaClubs = allClubs.league.standard;
    listOnlyNBAfranchise(nbaClubs);
    if (window.location.pathname == '/clubs.html') {
      NBAfranchise.forEach(element => {
        var teamDiv = document.createElement('div');
        teamDiv.setAttribute('class','team'); 
        if(element.confName == 'East')
        {
          teamDiv.className += ' ' + element.confName.toLowerCase();
        }
        else
        {
          teamDiv.className += ' ' + element.confName.toLowerCase();
        }
        teamDiv.setAttribute('id',element.tricode)
        var imgWrapper = document.createElement('div');
        imgWrapper.setAttribute('class', 'img-wrapper');
        var linkToModal = document.createElement('a')
        linkToModal.setAttribute('href','#');
        linkToModal.setAttribute('data-toggle','modal');
        linkToModal.setAttribute('data-target','profilKlubaModal');
        linkToModal.setAttribute('id',element.tricode);
    
        var clubImage = document.createElement('img');
        clubImage.setAttribute('src','https://www.nba.com/assets/logos/teams/primary/web/'+element.tricode+'.svg');
        teamDiv.append(imgWrapper);
        teamDiv.append(linkToModal);
        imgWrapper.append(linkToModal);
        linkToModal.append(clubImage);
        
        var textBellowImg = document.createElement('a');
        textBellowImg.setAttribute('href','#');
        textBellowImg.setAttribute('data-toggle','modal');
        textBellowImg.setAttribute('data-target','profilKlubaModal');
        textBellowImg.innerText = element.fullName;
        textBellowImg.setAttribute('id',element.tricode);
    
        teamDiv.append(textBellowImg);
        jQuery('.p-clubs-list').append(teamDiv);
      });
    }
    else if (window.location.pathname == '/players.html') {
          FiltrirajIgraceKluba(2);
    }
    else if (window.location.pathname == '/compare-players.html') {

    }
  });
}

function listOnlyNBAfranchise(jsonObj) {

  for (let i = 0; i < jsonObj.length; i++) {
    if(jsonObj[i]['isNBAFranchise'] == true){
      NBAfranchise.push(jsonObj[i]);
    }
  }
}

if (window.location.pathname == '/clubs.html') {
  var team = 0;
  var teamStandingsEast = [];
  var teamStandingsWest = [];
  var teamStandingsAll = [];
  let requestURLstandings = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/current/standings_conference.json';
  let requestStandings = new XMLHttpRequest();
  requestStandings.open('GET', requestURLstandings);
  requestStandings.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  requestStandings.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  requestStandings.responseType = 'json';
  requestStandings.send();

  requestStandings.onload = function() {
    var standingsAll = requestStandings.response;
    teamStandingsEast = standingsAll['league']['standard']['conference']['east'];
    teamStandingsWest = standingsAll['league']['standard']['conference']['west'];
    teamStandingsAll = teamStandingsAll.concat(teamStandingsEast,teamStandingsWest);
  }

  var games = [];
  var playerId = 0;


  let requestURLgames = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/schedule.json';
  var requestGames = new XMLHttpRequest();
  requestGames.open('GET', requestURLgames);
  requestGames.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  requestGames.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  requestGames.responseType = 'json';
  requestGames.send();

  requestGames.onload = function() {
    var gamesAll = requestGames.response;
    games = gamesAll['league']['standard'];
  }
}

window.addEventListener("load", function(){
  $('.team a').click(function () {
    teamStandingsAll.forEach(element => {
      if($(this).attr('id') == element.teamSitesOnly.teamTricode)
      {
        team = element;
        $('#overall-score tbody').empty();
        $('#overall-score').css("margin-bottom","2rem");
        $('h4#profilKlubaLabel').text(team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname);

        var sRedak='<tr>';
        sRedak += '<td>'+ team.confRank +'</td>';
        sRedak += '<td>'+ team.win +'</td>';
        sRedak += '<td>'+ team.loss +'</td>';
        sRedak += '<td>'+ team.winPctV2 +'</td>';
        sRedak += '<td>'+ team.lossPctV2 +'</td>';
        sRedak += '<td>'+ team.homeWin +'</td>';
        sRedak += '<td>'+ team.homeLoss +'</td>';
        sRedak += '<td>'+ team.awayWin +'</td>';
        sRedak += '<td>'+ team.awayLoss +'</td>';
        sRedak += '</tr>';
      
        $('#overall-score tbody').append(sRedak);

      }
    });
    var Redak='<tr>';
    if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
      var table = $('#games-score').DataTable();
    }
    else {
      var table = $('#games-score').DataTable( {
        "scrollX": true
      });
    }

    table.clear();
    FiltrirajUtakmice();
    FiltrirajIgraceKluba(1);

    $('#clubLogo').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+team.teamSitesOnly.teamTricode+'.svg');
    $('#clubLogo').attr('title', team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname);

    $('#profilKlubaModal').modal();
  });
  
  $(document).delegate('#prikaziProfilIgracaBtn', 'click', function()
  {
    playerId = $(this).attr('personid');
    players.forEach(player => {
      if(player.personId == playerId)
      {
        $('h4#profilIgracaLabel').text(player.firstName + ' ' + player.lastName);
        NBAfranchise.forEach(club => {
          if(club.teamId == player.teamId)
          {
            $('#clubLogo').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+club.tricode+'.svg');
            $('#clubLogo').attr('title', club.fullName);
            $('#playerImage').attr('src','https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+playerId+'.png');
            $('#playerImage').attr('title', player.firstName + ' ' + player.lastName);

          }
        
        });
      }
    });
    FiltrirajProfilIgraca(playerId);
    FiltrirajSezonuIgraca();
  });
  $(document).delegate('.edit', 'click', function()
  {
    if($( ".playerInfoHover" ).hasClass( "draw-outline" ) == false)
    {
      $('.playerInfoHover').addClass('draw-outline');
    }
  });
});

function FiltrirajUtakmice()
{
  if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
    table = $('#games-score').DataTable();
  }
  else {
    table = $('#games-score').DataTable( {
      "scrollX": true
    });
  }

  table.clear();
  var trazenaGodina = $('#dpdnGodina').val();
  if(trazenaGodina == undefined)
  {
    trazenaGodina = '2019';
  }

	let requestURLgame = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/'+trazenaGodina+'/schedule.json';
  let requestGame = new XMLHttpRequest();
  requestGame.open('GET', requestURLgame);
  requestGame.responseType = 'json';
  requestGame.send();


  requestGame.onload = function() {
    var gamesAll = requestGames.response;
    games = gamesAll['league']['standard'];

    var homeClub = '';
    var visitorClub = '';
    games.forEach(game => {
      if(game.hTeam.teamId == team.teamId || game.vTeam.teamId == team.teamId)
      {
        NBAfranchise.forEach(club => {
          if(club.teamId == game.hTeam.teamId)
          {
            homeClub = club.fullName;
          }
          else if(club.teamId == game.vTeam.teamId )
          {
            visitorClub = club.fullName;
          }
        });
        table.row.add( [ homeClub, visitorClub, game.hTeam.score, game.vTeam.score ] );
      }
    });
    table.draw();
    table.columns.adjust();
  }
}

var players = [];
function FiltrirajIgraceKluba(broj)
{
  var tablePlayersScore = undefined;
  if(broj == 1)
  {
    if ( $.fn.dataTable.isDataTable( '#club-players' )  ) {  
      var tablePlayers = $('#club-players').DataTable();
    }
    else {
      var tablePlayers = $('#club-players').DataTable( {
        "scrollX": true
      });
    }
    tablePlayers.clear();

  }
  else if(broj == 2)
  {
    if ( $.fn.dataTable.isDataTable( '#player-score' )  ) {  
        tablePlayersScore = $('#player-score').DataTable();
    }
    else {
        tablePlayersScore = $('#player-score').DataTable( {
          "scrollX": true,
        
      });
    }

  }

	let requestURLplayers = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();


  requestPlayers.onload = function() {
    var playersAll = requestPlayers.response;
    players = playersAll['league']['standard'];
    if(broj == 1)
    {
      players.forEach(player => {
    
        if(player.teamId == team.teamId )
        {
          tablePlayers.row.add( [ player.firstName, player.lastName, player.teamSitesOnly.posFull, player.yearsPro, player.country] );
        }
      });
      tablePlayers.draw();
      tablePlayers.columns.adjust();
    }
    else if(broj == 2)
    {
      var position = '';
      players.forEach(player => {
        if(player.teamSitesOnly == undefined)
        {
          position = 'Center';
        }
        else
        {
          position = player.teamSitesOnly.posFull;
        }
        var button = '<div class="btn-group"><button type = "button" class="edit btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span></span><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu"><li><a class="playerInfoHover" href="#" data-toggle="modal" data-target="#profilIgracaModal" id="prikaziProfilIgracaBtn" personid="'+player.personId+'">Player profile</a></li></ul></div>';
        tablePlayersScore.row.add( [button, player.firstName, player.lastName, position, player.yearsPro, player.country] );

      });
      tablePlayersScore.draw();
      tablePlayersScore.columns.adjust();
      
    }
  }
}

var PlayerCarrer = 0;
var tablePlayerScore  = 0;

function FiltrirajProfilIgraca(playerIdpar)
{

  if ( $.fn.dataTable.isDataTable( '#player-score-carrer' )  ) {  
    tablePlayerScore = $('#player-score-carrer').DataTable();
  }
  else {
    tablePlayerScore = $('#player-score-carrer').DataTable( {
      "scrollX": true,
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching": false,
    });
  }
  tablePlayerScore.clear();

	let requestURLplayers = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players/'+playerIdpar+'_profile.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();

  requestPlayers.onload = function() {
    let allPlayerInfo = requestPlayers.response;
    PlayerCarrer = allPlayerInfo['league']['standard']['stats']['careerSummary'];

    tablePlayerScore.row.add( [ PlayerCarrer.ppg, PlayerCarrer.rpg, PlayerCarrer.bpg, PlayerCarrer.mpg, PlayerCarrer.assists,PlayerCarrer.blocks,PlayerCarrer.steals,PlayerCarrer.turnovers,PlayerCarrer.gamesPlayed] ).draw();  
  }
  tablePlayerScore.columns.adjust();
}

var AllPlayerSeasons = 0;
var tablePlayerSeasonalScore = 0;

function FiltrirajSezonuIgraca() {
  if ( $.fn.dataTable.isDataTable( '#player-score-season' )  ) {  
    tablePlayerSeasonalScore = $('#player-score-season').DataTable();
  }
  else {
    tablePlayerSeasonalScore = $('#player-score-season').DataTable( {
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching": false,
      "scrollX": true
    });
  }
  tablePlayerSeasonalScore.clear();

  var trazenaGodina = $('#dpdnGodina').val();
  if(trazenaGodina == undefined)
  {
    trazenaGodina = '2019';
  }

	let requestURLplayerSeason = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/'+trazenaGodina+'/players/'+playerId+'_profile.json';
  let requestPlayerSeason = new XMLHttpRequest();
  requestPlayerSeason.open('GET', requestURLplayerSeason);
  requestPlayerSeason.responseType = 'json';
  requestPlayerSeason.send();

  requestPlayerSeason.onload = function() {
    let allPlayerInfo = requestPlayerSeason.response;
    AllPlayerSeasons = allPlayerInfo['league']['standard']['stats']['regularSeason']['season'];
    AllPlayerSeasons.forEach(season => {
      if(season.seasonYear == trazenaGodina)
      {
        let demandedPlayerSeasonTotal = season.total;
        tablePlayerSeasonalScore.row.add( [ demandedPlayerSeasonTotal.ppg, demandedPlayerSeasonTotal.rpg, demandedPlayerSeasonTotal.bpg, demandedPlayerSeasonTotal.mpg, demandedPlayerSeasonTotal.assists,demandedPlayerSeasonTotal.blocks,demandedPlayerSeasonTotal.steals,demandedPlayerSeasonTotal.turnovers,demandedPlayerSeasonTotal.gamesPlayed] );  
      }
    });
    tablePlayerSeasonalScore.draw();
    tablePlayerSeasonalScore.columns.adjust();
  }
}

