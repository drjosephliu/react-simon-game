import React, { Component } from 'react';

import ColorButton from './colorbutton';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      powerOn: false,
      start: false,
      myTurn: false,
      compMoves: [],
      count: null,
      strict: false
    };
    this.colors = ['green', 'red', 'yellow', 'blue'];
    this.powerOn = this.powerOn.bind(this);
    this.startGame = this.startGame.bind(this);
    this.highlightBtn = this.highlightBtn.bind(this);
    this.computerMove = this.computerMove.bind(this);
    this.repeatMoves = this.repeatMoves.bind(this);
    this.reset = this.reset.bind(this);
    this.strictOn = this.strictOn.bind(this);
    this.error = this.error.bind(this);
    this.myIndex = 0;
    this.myMoves = [];
    this.repeatSequence;
  }

  startGame() {
    const { powerOn } = this.state;
    if (powerOn) {
      this.setState({ start: true }, this.computerMove);
    }
  }

  repeatMoves() {
    if (!this.state.myTurn) {
      const { compMoves } = this.state;
      var i=0;
      this.repeatSequence = setInterval(() => {
        if (i < compMoves.length) {
          this.highlightBtn(compMoves[i]);
          i++;
        }
        else if (i >= compMoves.length) {
          clearInterval(this.repeatSequence);
          this.myIndex = 0;
          this.myMoves = [];
          this.setState({
            myTurn: true,
          });
        }
      }, 600);
    }
  }

  computerMove(){
    if (!this.state.myTurn) {
      const randNum = Math.floor(Math.random() * 4);
      const randColor = this.colors[randNum];
      const count = this.state.count;

      const {compMoves} = this.state;
      this.setState({
        count: count + 1,
        compMoves: compMoves.concat(randColor)
      }, this.repeatMoves);
    }
  }

  highlightBtn(color) {
    const { myTurn, strict } = this.state;

    const audio = document.getElementById(color+'Sound');
    audio.play();

    const selectColor = document.getElementById(color);
    selectColor.style.opacity = 0.5;

    setTimeout(() =>{ selectColor.style.opacity = 1}, 100);

    if (myTurn) {
      const compMoves = this.state.compMoves;

      this.myMoves.push(color);

      if (this.myMoves[this.myIndex] == compMoves[this.myIndex] && this.myIndex < compMoves.length) {
        this.myIndex++;
        if (this.myIndex == compMoves.length) {
          this.setState({ myTurn: false }, this.computerMove);
        }
      }
      else if (this.myMoves[this.myIndex] != compMoves[this.myIndex]) {
        this.error();
      }
    }
  }

  error() {
    const error = document.getElementById('errorSound');
    const count = this.state.count;
    const { strict } = this.state;

    error.play();
    this.setState({ count: '!!'});
    if (strict) {
      setTimeout(() => {
        this.reset();
      }, 500);
    }
    else {
      this.setState({ myTurn: false }, this.repeatMoves);
      setTimeout(() => {
        this.setState({ count: count });
      }, 500);
    }
  }

  powerOn(event) {
    const { powerOn } = this.state;
    if (!powerOn) { this.setState({ powerOn: true }) }
    else { this.setState({ powerOn: false }, this.reset) }
  }

  strictOn() {
    if (this.state.powerOn && !this.state.start) {
      this.setState({ strict: true });
    }
  }

  reset() {
    clearTimeout(this.repeatSequence);
    this.setState({
      powerOn: false,
      start: false,
      myTurn: false,
      compMoves: [],
      count: null,
      strict: false
    });
    this.myIndex = 0;
    this.myMoves = [];
  }

  render() {
    console.log('comp moves:', this.state.compMoves);
    console.log('my moves:', this.myMoves);
    console.log('my index:', this.myIndex);
    const { count, strict, start, powerOn } = this.state;

    return(
      <div className='container'>
        <div className='outer-circle'>
          <ColorButton
            color='green'
            disabled={!this.state.myTurn}
            handleClick={() => this.highlightBtn('green')}
          />
          <ColorButton
            color='red'
            disabled={!this.state.myTurn}
            handleClick={() => this.highlightBtn('red')}
           />
          <ColorButton
            color='yellow'
            disabled={!this.state.myTurn}
            handleClick={() => this.highlightBtn('yellow')}
          />
          <ColorButton
            color='blue'
            disabled={!this.state.myTurn}
            handleClick={() => this.highlightBtn('blue')}
          />
          <div className='inner-circle'>
            <h2>Simon®</h2>
            <div className='count-box'>
              <div className='count-display'>{count ? count : '--'}</div>
              <div className='small-text'>Count</div>
            </div>
          </div>
        </div>
        <div className='controls'>
          <div className='power-box'>
            <div className='power-text'>OFF</div>
            <label className="switch">
              <input type="checkbox" onChange={this.powerOn} checked={powerOn}/>
              <div className="slider round"></div>
            </label>
            <div className='power-text'>ON</div>
          </div>
          <div className='buttons'>
            <div className='start-box'>
              <div
                className='start-button'
                onClick={this.startGame}
                style={{ backgroundColor: start ? '#89DA59' : '#FF0000',
              pointerEvents: powerOn ? 'auto' : 'none' }}
              ></div>
              <div className='small-text'>Start</div>
            </div>
            <div className='strict-box'>
              <div
                className='strict-button'
                onClick={this.strictOn}
                style={{ backgroundColor: strict ? '#89DA59' : '#EFB509',
              pointerEvents: powerOn ? 'auto' : 'none' }}
              ></div>
              <div className='small-text'>Strict</div>
            </div>
          </div>
        </div>

        <p className='footer'>
          Source code on <a href='https://github.com/drhectapus/react-simon-game'>Github</a>
        </p>
      </div>
    )
  }
}
