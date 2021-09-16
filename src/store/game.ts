import {makeAutoObservable} from "mobx";

export const FIELD_WIDTH = 20
export const FIELD_HEIGHT = 20
const initialField: number[][] = [
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -1, 181, 182, 183, 184, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
    [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3,],
]

export enum Directions {
    top = 'top',
    bottom = 'bottom',
    right = 'right',
    left = 'left'
}

export type DirectionT = Directions.top | Directions.bottom | Directions.left | Directions.right

class Game {
    constructor() {
        makeAutoObservable(this)
    }

    field: number[][] = initialField
    length = 5
    headCords = 185
    neckCords = 184
    direction: DirectionT = Directions.right

    get nextHeadCell(): number {
        switch (this.direction) {
            case Directions.right:
                return this.headCords + 1
            case Directions.left:
                return this.headCords - 1
            case Directions.top:
                return this.headCords - FIELD_WIDTH
            case Directions.bottom:
                return this.headCords + FIELD_WIDTH
        }
    }

    moveCell(cellId: number) {
        const [firstCord, secondCord] = getCords(cellId)
        const [firstCordOfNewCell, secondCordOfNewCell] = getCords(this.field[firstCord][secondCord])
        if (this.field[firstCordOfNewCell][secondCordOfNewCell] === -1) {
            this.field[firstCordOfNewCell][secondCordOfNewCell] = -3
            this.field[firstCord][secondCord] = -1
            return;
        }
        const newValue = this.field[firstCord][secondCord]
        this.moveCell(this.field[firstCord][secondCord])
        this.field[firstCord][secondCord] = newValue
    }

     makeMove(nextHeadCellId: number) {
        const [firstCord, secondCord] = getCords(nextHeadCellId)
        if (this.field[firstCord] === undefined || this.field[firstCord][secondCord] === undefined) {
            this.gameOver()
            return
        }
        if (this.direction === Directions.right && this.nextHeadCell % 20 === 0) {
            this.gameOver()
            return
        }
        if (this.direction === Directions.left && (this.nextHeadCell + 1) % 20 === 0) {
            this.gameOver()
            return
        }
        const cellValue = this.field[firstCord][secondCord]
        this.field[firstCord][secondCord] = this.headCords
        this.neckCords = this.headCords
        this.headCords = this.nextHeadCell
        switch (cellValue) {
            case -3:
                this.moveCell(this.headCords)
                break
            case -2:
                this.length++
                if (this.length === 400) {
                    alert('win!')
                }
                this.randomizeNewFood()
                break
            default:
                this.gameOver()
        }
    }

    randomizeNewFood() {
        let [firstNewCellIdFood, secondNewCellIdFood] = getCords(Math.random() * 400)
        while (this.field[firstNewCellIdFood][secondNewCellIdFood] !== -3) {
            [firstNewCellIdFood, secondNewCellIdFood] = getCords(Math.random() * 400)
        }
        this.field[firstNewCellIdFood][secondNewCellIdFood] = -2
    }

    gameOver() {
        alert('game over!')
        this.field = initialField
        this.length = 5
        this.direction = Directions.right
        this.headCords = 185
        this.neckCords = 184
        this.randomizeNewFood()
    }

}

export const getCords = (cellId: number) => [Math.trunc(cellId / FIELD_WIDTH), cellId % FIELD_WIDTH]

export default new Game()