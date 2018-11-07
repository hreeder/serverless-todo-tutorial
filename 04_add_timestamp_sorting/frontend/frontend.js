/* Javascript Code Here */
const ROOT_URL = "https://2ekitihnsb.execute-api.eu-west-2.amazonaws.com/dev"

$('#new-item').submit(function(event) {
  event.preventDefault()

  const itemText = $('#new-item-entry').val()
  let data = {'item': itemText}
  data = JSON.stringify(data)

  $.post(`${ROOT_URL}/items`, data, function(response){
    console.log(response)
    getTodoItems()
  }, 'json')
})

function getTodoItems() {
  $.getJSON(`${ROOT_URL}/items`, function(response){
    $('#todo-list').empty()

    let items = response.items
    items.sort(function(a, b) {
      return parseInt(a.created_at) - parseInt(b.created_at)
    })

    items.forEach(item => {
      $('#todo-list').append(`<li data-id="${item.id}">${item.text}</li>`)
    });
  })
}

$(document).ready(function() {
  getTodoItems()
})
