const canvas = document.querySelector("canvas")
toolBtns = document.querySelectorAll(".tool")
fillColor = document.querySelector("#fill-color")

ctx = canvas.getContext("2d") // getContext() method returns a drawing context on the canvas

// declaring global variables with default values
let prevMouseX, prevMouseY, snapshot, 
isDrawing = false
selectedTool = "brush"
brushWidth = 5

window.addEventListener("load", () => {
    // to return viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
})

const drawRect = (e) => {
    if(!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + (prevMouseY - e.offsetY), 2)
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath() // creating new path to draw
    ctx.lineWidth = brushWidth // passing brushSize as line width
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return
    ctx.putImageData(snapshot, 0, 0) // adding copied canvas data on to this canvas

    if(selectedTool === "brush") {
        // lineTo() creates a new line.. ctx.lineTo(x-coord., y-coord.)
        // offsetX and offsetY returns x and y coordinates of the mouse pointer
        ctx.lineTo(e.offsetX, e.offsetY) // creating line according to mouse pointer
        ctx.stroke() //drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e)
    } else if (selectedTool === "circle") {
        drawCircle(e)
    }

}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // changing dynamically the active class
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(selectedTool)
    })    
});

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)