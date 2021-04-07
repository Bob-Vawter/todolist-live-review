const deleteBtn = document.querySelectorAll('.del')
// variable to hold delete button listener
const todoItem = document.querySelectorAll('.todoItem span')
// variable to be able to add event listener over uncompleted item
const todoComplete = document.querySelectorAll('.todoItem span.completed')
// variable to be able to add event listener over completed items

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
// create an array of event listeners on delete
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
// create an array of even listeners on uncompleted items
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})
// create an array of event listensers on complete items

async function deleteTodo(){
    //function to delete an item from db
    const todoText = this.parentNode.childNodes[1].innerText
    //grab data from dom, first element in list
    try{
        const response = await fetch('deleteTodo', {
            //run call app.delete in server
            method: 'delete',
            //send method
            headers: {'Content-type': 'application/json'},
            //identify data sent is json
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            //send data from dom as a json string
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //function to update complete an item in db
    const todoText = this.parentNode.childNodes[1].innerText
    //name comes from first item in element of this.element
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            //note sending a put method
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function undo(){
    //same as put function above but in this case will call the undo put
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}
