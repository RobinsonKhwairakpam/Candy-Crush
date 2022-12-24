import colors from "../utilities/colors"
import React, { useEffect, useState } from 'react'
import Scoreboard from "./Scoreboard"
import Title from "./Title"

const width = 6

const Board = () => {
    //states
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [blockBeingDragged, setBlockBeingDragged] = useState(null)
    const [blockBeingReplaced, setBlockBeingReplaced] = useState(null)
    const [score, setScore] = useState(0)

    //creating the board
    const createBoard = () => {
        let initialColorArrangement = []
        for(let i = 0 ; i < width * width ; i++){
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            initialColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(initialColorArrangement)
    }
    
    useEffect(() => {
        createBoard()
    }, [])

    //checking for matches
    const checkForRowOfFour = () => {
        for(let i = 0 ; i < 36 ; i++){
            const notValid = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23, 27, 28, 29, 33, 34, 35]
            const rowOfFour = [i, i+1, i+2, i+3]
            const isBlank = currentColorArrangement[i] === "white"
            const decidedColor = currentColorArrangement[i]
            if(notValid.includes(i)) continue
            if(rowOfFour.every(ind => currentColorArrangement[ind] === decidedColor && !isBlank)){
                setScore( prevScore => prevScore + 4)
                rowOfFour.forEach(ind => currentColorArrangement[ind] = "white")
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        const notValid = [4, 5, 10, 11, 16, 17, 22, 23, 28, 29, 34, 35]
        for(let i = 0 ; i < 36 ; i++){
            if(notValid.includes(i))
                continue
            const rowOfThree = [i, i+1, i+2]
            const isBlank = currentColorArrangement[i] === "white"
            const decidedColor = currentColorArrangement[i]
            if(rowOfThree.every(ind => currentColorArrangement[ind] === decidedColor && !isBlank)){
                setScore( prevScore => prevScore + 3)
                rowOfThree.forEach(ind => currentColorArrangement[ind] = "white")
                return true
            }
        }
    }

    const checkForColumnOfThree = () => {
        for(let i = 0 ; i < 36 - 2*width ; i++){
            const columnOfThree = [i, i+width, i+2*width]
            const isBlank = currentColorArrangement[i] === "white"
            const decidedColor = currentColorArrangement[i]
            if(columnOfThree.every(ind => currentColorArrangement[ind] === decidedColor && !isBlank)){
                setScore( prevScore => prevScore + 3)
                columnOfThree.forEach(ind => currentColorArrangement[ind] = "white")
                return true
            }
        }
    }

    const checkForColumnOfFour = () => {
        for(let i = 0 ; i < 36 - 3*width ; i++){
            const columnOfFour = [i, i+width, i+2*width, i+3*width]
            const isBlank = currentColorArrangement[i] === "white"
            const decidedColor = currentColorArrangement[i]
            if(columnOfFour.every(ind => currentColorArrangement[ind] === decidedColor && !isBlank)){
                setScore( prevScore => prevScore + 4)
                columnOfFour.forEach(ind => currentColorArrangement[ind] = "white")
                return true
            }
        }
    }

    //moving blocks below and generating new one if it is first row
    const moveIntoBlockBelow = () => {
        for(let i = 0 ; i < 36 - width ; i++){
            const firstRow = [0, 1, 2, 3, 4, 5]
            const isFirstRow = firstRow.includes(i)

            if(isFirstRow && currentColorArrangement[i] === "white"){
                currentColorArrangement[i] = colors[Math.floor(Math.random() * colors.length)]
            }

            if(currentColorArrangement[i+width] === "white"){
                currentColorArrangement[i+width] = currentColorArrangement[i]
                currentColorArrangement[i] = "white"
            }
        }
    }

    //drag and drop events
    const dragStart = (e) => {
        setBlockBeingDragged(e.target)

    }
    const dragDrop = (e) => {
        setBlockBeingReplaced(e.target)
    }
    const dragEnd = () => {
        const blockBeingDraggedId = parseInt(blockBeingDragged.getAttribute("data-id"))
        const blockBeingReplacedId = parseInt(blockBeingReplaced.getAttribute("data-id"))

        const validMoves = [
            blockBeingDraggedId - width,
            blockBeingDraggedId + width,
            blockBeingDraggedId + 1,
            blockBeingDraggedId - 1
        ]

        const isValidMOve = validMoves.includes(blockBeingReplacedId)

        if(isValidMOve){

        currentColorArrangement[blockBeingReplacedId] = blockBeingDragged.style.backgroundColor
        currentColorArrangement[blockBeingDraggedId] = blockBeingReplaced.style.backgroundColor

        const isAColumnOfFour = checkForColumnOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfFour = checkForRowOfFour()
        const isARowOfThree = checkForRowOfThree()

        //console.log(blockBeingReplacedId)
        //console.log(isValidMOve)
        //console.log(isAColumnOfFour || isAColumnOfThree || isARowOfThree || isARowOfFour)

        if(blockBeingReplacedId && isValidMOve && (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree))
        {
            setBlockBeingDragged(null)
            setBlockBeingReplaced(null)
        }
        else 
        {
            currentColorArrangement[blockBeingReplacedId] = blockBeingReplaced.style.backgroundColor
            currentColorArrangement[blockBeingDraggedId] = blockBeingDragged.style.backgroundColor
            setCurrentColorArrangement([...currentColorArrangement])
        }
        }
    }

    //checking the board each interval after every update
    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoBlockBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, 
        [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree,
        moveIntoBlockBelow, currentColorArrangement])
    return (
    <div className="game">
    <Title />
    <div className="board">
        {currentColorArrangement.map((color, ind) => 
            <div className="block" 
                id={ind} 
                style={{backgroundColor: color}}
                data-id = {ind}
                draggable = {true}
                onDragStart = {dragStart}
                onDragOver = {e => e.preventDefault()}
                onDragEnter = {e => e.preventDefault()}
                onDragLeave = {e => e.preventDefault()}
                onDrop = {dragDrop}
                onDragEnd = {dragEnd}
            >
            </div>
        )}
    </div>
    <Scoreboard score = {score} />
    </div>
 );
}
 
export default Board;