import React, {useEffect} from 'react';
import './App.css'
import game, {Directions, FIELD_WIDTH} from "./store/game";
import {observer} from "mobx-react-lite";
export let gameInterval: any;
const App = observer(() => {
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler)
    })

    const keyDownHandler = (e: KeyboardEvent) => {
        switch (e.key.toLowerCase()) {
            case 'a':
                if (game.headCords - 1 !== game.neckCords) game.direction = Directions.left
                return;
            case 's':
                if (game.headCords + FIELD_WIDTH !== game.neckCords) game.direction = Directions.bottom
                return;
            case 'd':
                if (game.headCords + 1 !== game.neckCords) game.direction = Directions.right
                return;
            case 'w':
                if (game.headCords - FIELD_WIDTH !== game.neckCords) game.direction = Directions.top
                return;
        }
    }


    return (
        <div className={'field-wrap'}>
            {game.field.map((arr, i) => arr.map((cell, j) => {
                let classname: string = 'cell-item'
                switch (cell) {
                    case -3:
                        break;
                    case -2:
                        classname += ' food'
                        break;
                    default:
                        classname += ' snake'
                }
                return <div key={`${i}_${j}`} className={classname}/>
            }))}
            <button onClick={() => {
                game.randomizeNewFood()
                gameInterval = setInterval(() => {
                    game.makeMove(game.nextHeadCell)
                }, 200)
            }}>start
            </button>
            <button onClick={() => {
                clearInterval(gameInterval)
            }}>stop</button>
        </div>
    )
})

export default App;
