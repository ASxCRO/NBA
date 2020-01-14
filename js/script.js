jQuery(document).ready(function() {
	jQuery(".loader").delay(1000).fadeOut("slow");
  jQuery("#overlayer").delay(1000).fadeOut("slow");
  $( ".nav-link" ).hover(
    function() {
      $( this ).css('background-color','#000')
    }
  );
  window.addEventListener('error', function(e) {
    console.log(e);
    alert('There is not existent data for your query, please select different year.')
  }, true);
  
   
    
  
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
    else if ((window.location.pathname == '/players.html') || (window.location.pathname == '/compare-players.html')) {
      $(document).ready(function() {
        FiltrirajIgraceKluba(2);
      });
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

var playerId = 0;
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
var inputCompareFirst = undefined;
var inputCompareSecond = undefined;
var element = undefined;
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
    var profilKlubaModal = $('#profilKlubaModal');

    $('#clubLogo').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+team.teamSitesOnly.teamTricode+'.svg');
    $('#clubLogo').attr('title', team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname);
    if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
      table = $('#games-score').DataTable();
    }
    else {
      table = $('#games-score').DataTable( {
        "scrollX": true
      });
    }
    setTimeout(() => {
      if(profilKlubaModal.css("display") !='none' && profilKlubaModal.css("visibility") != 'hidden')
      {
        FiltrirajUtakmice();
        FiltrirajIgraceKluba(1);
      }
    }, 200);

    profilKlubaModal.modal();



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
    if($( ".playerInfoHover" ).hasClass( "hvr-shutter-in-horizontal" ) == false)
    {
      $('.playerInfoHover').addClass('hvr-shutter-in-horizontal');
    }
  });
  $(document).delegate('#dpdnGodina', 'change', function()
  {
    switch(window.location.pathname) {
      case '/clubs.html':
        FiltrirajUtakmice();
        break;
      case '/players.html':
        FiltrirajSezonuIgraca();
        break;
      default:
        break;
    }

  });
  inputCompareFirst = $('#firstPlayerForComparison');
  inputCompareSecond = $('#secondPlayerForComparison');
  $(document).delegate('#buttonCompareFirst', 'click', function()
  {
    playerId = $(this).attr('personid');
    getPlayerCompare(playerId);
    if(inputCompareSecond.val() == (playerForComparison.firstName + ' ' + playerForComparison.lastName)|| inputCompareFirst.val()  == (playerForComparison.firstName + ' ' + playerForComparison.lastName))
    {
      bootbox.alert("You already selected that player for comparison.<br>Please select different player.");
    }
    else {
      inputCompareFirst.val(playerForComparison.firstName + ' ' + playerForComparison.lastName)
      inputCompareFirst.attr('personid',playerId);
      inputCompareFirst.attr('teamid',playerForComparison.teamId);
    }
  });
  $(document).delegate('#buttonCompareSecond', 'click', function()
  {
    
    playerId = $(this).attr('personid');
    getPlayerCompare(playerId);
    if(inputCompareSecond.val() == (playerForComparison.firstName + ' ' + playerForComparison.lastName)|| inputCompareFirst.val()  == (playerForComparison.firstName + ' ' + playerForComparison.lastName))
    {
     bootbox.alert("You already selected that player for comparison.<br>Please select different player.");
    }
    else {
      inputCompareSecond.val(playerForComparison.firstName + ' ' + playerForComparison.lastName)
      inputCompareSecond.attr('personid',playerId);
      inputCompareSecond.attr('teamid',playerForComparison.teamId);
    }
  });
});
var playerForComparison = undefined;



var table = undefined;
var trazenaGodinaClub = 0;
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

  table.clear().draw();
  trazenaGodinaClub = $('#dpdnGodina').val();
  if(trazenaGodinaClub == undefined)
  {
    trazenaGodinaClub = '2019';
  }

	let requestURLgame = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/'+trazenaGodinaClub+'/schedule.json';
  let requestGame = new XMLHttpRequest();
  requestGame.open('GET', requestURLgame);
  requestGame.responseType = 'json';
  requestGame.send();
  requestGame.onload = function() {
    var gamesAll = requestGame.response;
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
var tablePlayersScore = undefined;
var tablePlayers = undefined;
function FiltrirajIgraceKluba(broj)
{
 
  switch(broj) {
    case 1:
      if ( $.fn.dataTable.isDataTable( '#club-players' )  ) {  
        tablePlayers = $('#club-players').DataTable();
      }
      else {
        tablePlayers = $('#club-players').DataTable( {
          "scrollX": true
          
        });
       
      }
      
    case 2:
      if ( $.fn.dataTable.isDataTable( '#player-score' )  ) {  
        tablePlayersScore = $('#player-score').DataTable();
      }
      else {
          tablePlayersScore = $('#player-score').DataTable( {
            "scrollX": true
        });
      }
      
    default:
      break;
  }
	let requestURLplayers = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();

  requestPlayers.onload = function() {
    var playersAll = requestPlayers.response;
    players = playersAll['league']['standard'];
    switch(broj) {
      case 1:
        players.forEach(player => {
    
          if(player.teamId == team.teamId )
          {
            tablePlayers.row.add( [ player.firstName, player.lastName, player.teamSitesOnly.posFull, player.yearsPro, player.country] );
          }
        });
        tablePlayers.draw();
        tablePlayers.columns.adjust();
      case 2:
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
          var club = '';
          if(window.location.pathname == '/players.html')
          {
            var button = '<div class="btn-group"><button type = "button" class="edit btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span></span><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu"><li><a class="playerInfoHover" href="#" data-toggle="modal" data-target="#profilIgracaModal" id="prikaziProfilIgracaBtn" personid="'+player.personId+'">Player profile</a></li></ul></div>';
          }
          else
          {
            var buttonCompareFirst = '<button  personid="'+player.personId+'" id="buttonCompareFirst" type = "button" class="edit btn btn-default hvr-bounce-to-top"><span></span><i class="far fa-bookmark fa-3x" title="First Player For Comparison"></i></button>';
            var buttonCompareSecond = '<button  personid="'+player.personId+'" id="buttonCompareSecond" type = "button" class="edit btn btn-default hvr-bounce-to-top"><span></span><i title="Second Player For Comparison" class="fas fa-bookmark fa-3x"></i></button>';
          }
          NBAfranchise.forEach(team => {
            if(team.teamId == player.teamId)
            {
              club = team.fullName;
            }
          });
          if(window.location.pathname == '/players.html')
          {
            tablePlayersScore.row.add( [button, player.firstName, player.lastName,club, position, player.yearsPro, player.country] );
          }
          else
          {
            tablePlayersScore.row.add( [buttonCompareFirst, buttonCompareSecond, player.firstName, player.lastName,club, position, player.yearsPro, player.country] );
          }
        });

        tablePlayersScore.draw();
        tablePlayersScore.columns.adjust();
      default:
        break;
    }
  }
}

var PlayerCarrer = 0;
var firstPlayerCarrer = 0;
var secondPlayerCarrer = 0;
var tablePlayerScore  = 0;
var trazenaGodina = '';
var allPlayerInfo = '';
var allFirstPlayerInfo = '';
var allSecondPlayerInfo = '';
function FiltrirajProfilIgraca(playerIdpar)
{
  if ($("#dpdnGodina").children().length > 0) {
    $("#dpdnGodina").empty();
  }
  if ( $.fn.dataTable.isDataTable( '#player-score-carrer' )  ) {  
    tablePlayerScore = $('#player-score-carrer').DataTable();
  }
  else {
    tablePlayerScore = $('#player-score-carrer').DataTable( {
      "scrollX": true,
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching": false
    });
  }
  tablePlayerScore.clear();

	let requestURLplayers = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players/'+playerIdpar+'_profile.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();

  requestPlayers.onload = function() {
    allPlayerInfo = requestPlayers.response;
    PlayerCarrer = allPlayerInfo['league']['standard']['stats']['careerSummary'];

    tablePlayerScore.row.add( [ PlayerCarrer.ppg, PlayerCarrer.rpg, PlayerCarrer.bpg, PlayerCarrer.mpg, PlayerCarrer.assists,PlayerCarrer.blocks,PlayerCarrer.steals,PlayerCarrer.turnovers,PlayerCarrer.gamesPlayed] ).draw();  
  }
  tablePlayerScore.columns.adjust();
}

var AllPlayerSeasons = 0;
var tablePlayerSeasonalScore = 0;
var demandedPlayerSeasonTotal = 0;

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
  tablePlayerSeasonalScore.clear().draw();

  trazenaGodina = $('#dpdnGodina').val();
  if(trazenaGodina == null)
  {
    trazenaGodina = '2019';
  }

	let requestURLplayerSeason = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players/'+playerId+'_profile.json';
  let requestPlayerSeason = new XMLHttpRequest();
  requestPlayerSeason.open('GET', requestURLplayerSeason);
  requestPlayerSeason.responseType = 'json';
  try {
      requestPlayerSeason.send();
  }
  catch(error) {
    console.error(error.message);
    alert('Data for that certain query does not exist, view console for more.');
  }
  finally {
    requestPlayerSeason.onload = function() {
      let allPlayerInfo = requestPlayerSeason.response;
      AllPlayerSeasons = allPlayerInfo['league']['standard']['stats']['regularSeason']['season'];
      AllPlayerSeasons.forEach(season => {
        if($("#dpdnGodina").children().length < AllPlayerSeasons.length)
        {
          var optionYear = document.createElement('option', {value : season.seasonYear});
          if(season.seasonYear == '2019'){
            $(optionYear).attr('selected','selected');
          }
          optionYear.innerText = season.seasonYear;
          $('#dpdnGodina').append(optionYear);
        }
        if(season.seasonYear == trazenaGodina)
        {
          demandedPlayerSeasonTotal = season.total;
          let playerGamesPlayed = demandedPlayerSeasonTotal.gamesPlayed;
          
          if( playerGamesPlayed == undefined)
          {
            playerGamesPlayed = 'NoData';
          }
          tablePlayerSeasonalScore.row.add( [ demandedPlayerSeasonTotal.ppg, demandedPlayerSeasonTotal.rpg, demandedPlayerSeasonTotal.bpg, demandedPlayerSeasonTotal.mpg, demandedPlayerSeasonTotal.assists,demandedPlayerSeasonTotal.blocks,demandedPlayerSeasonTotal.steals,demandedPlayerSeasonTotal.turnovers,playerGamesPlayed] );  
        }
      });
      tablePlayerSeasonalScore.draw();
      tablePlayerSeasonalScore.columns.adjust();
    }
  }
}

function getPlayerCompare(playerIdcompare)
{
  players.forEach(player => {
    if(player.personId == playerIdcompare)
    {
      playerForComparison = player;
    }
  });
}

var i = 0;
function ComparePlayers()
{

  NBAfranchise.forEach(club => {
    if(club.teamId == inputCompareFirst.attr('teamid'))
    {
      $('#clubLogoLeft').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+club.tricode+'.svg');
      $('#clubLogoLeft').attr('title',club.fullName);
    }
    else if(club.teamId == inputCompareSecond.attr('teamid'))
    {
      $('#clubLogoRight').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+club.tricode+'.svg');
      $('#clubLogoRight').attr('title',club.fullName);

    }
  });

  $('#playerImageLeft').attr('src','https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+inputCompareFirst.attr('personid')+'.png');
  $('#playerImageLeft').attr('title',inputCompareFirst.val());
  $('#playerImageRight').attr('src','https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+inputCompareSecond.attr('personid')+'.png');
  $('#playerImageRight').attr('title',inputCompareSecond.val());



  let requestURLplayers = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players/'+inputCompareFirst.attr('personid')+'_profile.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();
  
  requestPlayers.onload = function() {
    allFirstPlayerInfo = requestPlayers.response;
    firstPlayerCarrer = allFirstPlayerInfo['league']['standard']['stats']['careerSummary'];
  }



  let requestURLplayersSecond = 'https://ancient-lake-18259.herokuapp.com/https://data.nba.net/data/10s/prod/v1/2019/players/'+inputCompareSecond.attr('personid')+'_profile.json';
  let requestPlayersSecond = new XMLHttpRequest();
  requestPlayersSecond.open('GET', requestURLplayersSecond);
  requestPlayersSecond.responseType = 'json';
  requestPlayersSecond.send();
  
  requestPlayersSecond.onload = function() {
    
    allSecondPlayerInfo = requestPlayersSecond.response;
    secondPlayerCarrer = allSecondPlayerInfo['league']['standard']['stats']['careerSummary'];
    setTimeout(() => {
      let traceFirstPlayerComparePerGame = {
        x: ['PPG', 'RPG', 'BPG', 'MPG'],
        y: [firstPlayerCarrer.ppg, firstPlayerCarrer.rpg, firstPlayerCarrer.bpg, firstPlayerCarrer.mpg],
        type: 'bar',
        name: inputCompareFirst.val(),
        marker: {
          color: 'rgb(49,130,189)',
          opacity: 0.7,
        }
      };
      let traceFirstPlayerCompareGeneral = {
        x: ['ASSISTS', 'BLOCKS', 'STEALS', 'TURNOVERS', 'GAMES PLAYED'],
        y: [firstPlayerCarrer.firstPlayerCarrer,firstPlayerCarrer.blocks,firstPlayerCarrer.steals,firstPlayerCarrer.turnovers,firstPlayerCarrer.gamesPlayed],
        type: 'bar',
        name: inputCompareFirst.val(),
        marker: {
          color: 'rgb(49,130,189)',
          opacity: 0.7,
        }
      };
      let traceSecondPlayerComparePerGame= {
        x: ['PPG', 'RPG', 'BPG', 'MPG'],
        y: [secondPlayerCarrer.ppg, secondPlayerCarrer.rpg, secondPlayerCarrer.bpg, secondPlayerCarrer.mpg],
        type: 'bar',
        name: inputCompareSecond.val(),
        marker: {
          color: 'rgb(204,204,204)',
          opacity: 0.5
        }
      };
      let traceSecondPlayerCompareGeneral = {
        x: ['ASSISTS', 'BLOCKS', 'STEALS', 'TURNOVERS', 'GAMES PLAYED'],
        y: [secondPlayerCarrer.assists,secondPlayerCarrer.blocks,secondPlayerCarrer.steals,secondPlayerCarrer.turnovers,secondPlayerCarrer.gamesPlayed],
        type: 'bar',
        name: inputCompareSecond.val(),
        marker: {
          color: 'rgb(204,204,204)',
          opacity: 0.5
        }
      };
      let dataGeneral = [traceFirstPlayerCompareGeneral, traceSecondPlayerCompareGeneral];
      let dataPerGame = [traceFirstPlayerComparePerGame, traceSecondPlayerComparePerGame];
      let layoutGeneral = {
        title: 'Players Comparison General (Carrer)',
        xaxis: {
          tickangle: -45
        },
        barmode: 'group'
      };
      let layOutPerGame = {
        title: 'Players Comparison Per Game (Carrer)',
        xaxis: {
          tickangle: -45
        },
        barmode: 'group'
      };
  
        Plotly.newPlot('comparePlayersModalBodyGeneral', dataGeneral, layoutGeneral,{ responsive: true });
        Plotly.newPlot('comparePlayersModalBodyPerGame', dataPerGame, layOutPerGame, { responsive: true });


    }, 200);
  }
}