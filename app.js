class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movesMap: ['','','','','','','','',''],
      movesMapPlayer: [0,1,2,3,4,5,6,7,8],
      myTurn: null,
      gameOver: false,
      whoWon: null,
      player: null,
      comp: null,
      playerText: null,
      compText: null,
      score: null
    }
    this.handleReset = this.handleReset.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handlePlayer = this.handlePlayer.bind(this)
    this.handleTurn = this.handleTurn.bind(this)
    this.handleComp = this.handleComp.bind(this)
    this.handleGameOver = this.handleGameOver.bind(this)
  }
  handleReset() {
    this.setState({
      movesMap: ['','','','','','','','',''],
      movesMapPlayer: [0,1,2,3,4,5,6,7,8],
      myTurn: null,
      gameOver: false,
      whoWon: null,
      player: null,
      comp: null,
      playerText: null,
      compText: null,
      score: null
    })
  }
  handleClick(event) {    
    if (!this.state.gameOver && !this.state.myTurn) {
      var tempMap = [...this.state.movesMap]
      tempMap[event.target.id] = this.state.player
      var tempMapText = [...this.state.movesMapPlayer]
      tempMapText[event.target.id] = this.state.playerText
      this.setState({
        movesMap: [...tempMap],
        movesMapPlayer: [...tempMapText],
        myTurn: true
      })
    }
  }
  componentDidUpdate() {
    setTimeout(()=>{
      if (this.state.myTurn && !this.state.gameOver) {
        this.handleComp()
      }
    }, 1500)
  }
  handleComp() {        
    var index = Minimax(this.state.movesMapPlayer, this.state.compText, this.state.playerText, this.state.compText)
    var newMovesMapPlayer = [...this.state.movesMapPlayer]
    newMovesMapPlayer[index.index] = this.state.compText
    var newMovesMap = [...this.state.movesMap]
    newMovesMap[index.index] = this.state.comp
    this.setState({
      movesMap: [...newMovesMap],
      movesMapPlayer: [...newMovesMapPlayer],
      myTurn: false
    }, ()=>this.handleGameOver(Minimax(this.state.movesMapPlayer, this.state.compText, this.state.playerText, this.state.compText)))
  }
  handleGameOver(index) {
    if (index.index == null) {  
      if (index.score == 0) {
        this.setState({
          gameOver: true,
          whoWon: "Game over! It's a tie"
        })
      }
      else if (index.score > 0) {
        this.setState({
          gameOver: true,
          whoWon: "Game over! I won!"
        })
      }
      else if (index.score < 0) {
        this.setState({
          gameOver: true,
          whoWon: "Game over! You won!"
        })
      }
    }
  }
  handlePlayer(event) {
    if (event.target.id == 'X') {
      this.setState({
        player: <i id='X' class="fas fa-times"></i>,
        comp: <i id='O' class="far fa-circle"></i>,
        playerText: 'X',
        compText: 'O'
      })
    }
    else {
      this.setState({
        player: <i id='O' class="far fa-circle"></i>,
        comp: <i id='X' class="fas fa-times"></i>,
        playerText: 'O',
        compText: 'X'
      })
    }
  }
  handleTurn(event) {
    if (event.target.innerHTML == '1st') {
      this.setState({
        myTurn: false
      })
    }
    else {
      this.setState({
        myTurn: true
      })
      this.handleComp()
    }
  }
  render() {
    return (
      <div>
        <h1>Tic Tac Toe!</h1>
        <Game 
          movesMap={this.state.movesMap} 
          handleClick={this.handleClick} 
          player={this.state.player} 
          handlePlayer={this.handlePlayer} 
          handleTurn={this.handleTurn} 
          myTurn={this.state.myTurn}/>
        <TurnChecker 
          myTurn={this.state.myTurn} 
          gameOver={this.state.gameOver} 
          player={this.state.player} 
          myTurn={this.state.myTurn}
          whoWon={this.state.whoWon}/>
        <Reset 
          handleReset={this.handleReset} 
          player={this.state.player} 
          myTurn={this.state.myTurn}/>
      </div>
    )
  }
}
function Game(props) {
  if (props.player != null && props.myTurn != null) {  
    return (
      <div id='container'>
        <div id='grid'>
          {props.movesMap.map((item, i)=>
            <div id={i} class='section' onClick={props.handleClick}>{props.movesMap[i]}</div>
          )}
        </div>
        <div id='line-vertical-left'></div>
        <div id='line-vertical-right'></div>
        <div id='line-horizontal-top'></div>
        <div id='line-horizontal-bottom'></div>
      </div>
    )
  }
  else if (props.player == null && props.myTurn == null) {
    return (
      <div id='container'>
        <div id='start'>
          <h2>Choose Player</h2>
          <div id='player-list'>
            <i id='X' class="fas fa-times" onClick={props.handlePlayer}></i>
            <i id='O' class="far fa-circle" onClick={props.handlePlayer}></i>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div id='container'>
        <div id='start'>
          <h2>Choose Turn</h2>
          <div id='turn-list'>
            <h3 onClick={props.handleTurn}>1st</h3>
            <h3 onClick={props.handleTurn}>2nd</h3>
          </div>
        </div>
      </div>
    )
  }
}

function TurnChecker(props) {
  if (props.player != null && props.myTurn != null) {
    return (
      <div>
        {props.gameOver ? (<h2>{props.whoWon}</h2>):(props.myTurn ? (<h2>My turn!</h2>):(<h2>Your turn!</h2>))}
      </div>
    )
  }
  else {
    return null;
  }
}
function Reset(props) {
  if (props.player != null && props.myTurn != null) {  
    return (
      <div id='logo'>
        <i class="fa fa-retweet" id="reset" onClick={props.handleReset}></i>
      </div>
    )
  }
  else {
    return null;
  }
}

// MINIMAX ALGORITHM STARTS HERE
function Minimax(newBoard, player, playerText, compText) {
  var availSpots = emptyIndexes(newBoard)
  if (arrMatch(newBoard, playerText)) {
    return {score: -10}
  }
  else if (arrMatch(newBoard, compText)) {
    return {score: 10}
  }
  else if (availSpots.length == 0) {
    return {score: 0}
  }
  var moves = []
  for (var i = 0; i < availSpots.length; i++) {
    var move = {}
      move.index = newBoard[availSpots[i]]

    newBoard[availSpots[i]] = player
    
    if (player == playerText) {
      var result = Minimax(newBoard, compText, playerText, compText)
      move.score = result.score
    }
    else {
      var result = Minimax(newBoard, playerText, playerText, compText)
      move.score = result.score
    }

    newBoard[availSpots[i]] = move.index
    moves.push(move)
  }
  var bestMove;
  if (player == playerText) {
    var newArr = []
    for (i = 0; i < moves.length; i++) {
      newArr.push(moves[i].score)
    }
    bestMove = newArr.indexOf(Math.min(...newArr))
  }
  else if (player == compText) {
    var newArr = []
    for (i = 0; i < moves.length; i++) {
      newArr.push(moves[i].score)
    }
    bestMove = newArr.indexOf(Math.max(...newArr))
  }

  return moves[bestMove]
}
function emptyIndexes(arr) {
  return arr.filter(item=>item!="X" && item!="O")
}
function arrMatch(arr, player) {
  if (
      (arr[0] == player && arr[1] == player && arr[2] == player) ||
      (arr[3] == player && arr[4] == player && arr[5] == player) ||
      (arr[6] == player && arr[7] == player && arr[8] == player) ||
      (arr[0] == player && arr[3] == player && arr[6] == player) ||
      (arr[1] == player && arr[4] == player && arr[7] == player) ||
      (arr[2] == player && arr[5] == player && arr[8] == player) ||
      (arr[0] == player && arr[4] == player && arr[8] == player) ||
      (arr[2] == player && arr[4] == player && arr[6] == player)){
        return true;
    }
  else {
    return false;
  }
}

ReactDOM.render(<Application/>, document.getElementById('app'))
