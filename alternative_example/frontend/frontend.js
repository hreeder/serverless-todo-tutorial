/* Javascript Code Here */
const ROOT_URL = "https://2ekitihnsb.execute-api.eu-west-2.amazonaws.com/dev"
const todoTemplate = Handlebars.compile($('#todo-template').html())
const footerTemplate = Handlebars.compile($('#footer-template').html())

const ENTER_KEY = 13
const ESCAPE_KEY = 27

Handlebars.registerHelper('eq', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
})

var todos = []

$(document).ready(function() {
  getTodos()

  $('.new-todo').on('keyup', createTodo)

  $('.todo-list')
    .on('change', '.toggle', toggleCompletion)
    .on('dblclick', 'label', editingMode)
    .on('keyup', '.edit', editKeyup)
    .on('focusout', '.edit', update)
    .on('click', '.destroy', destroy)
})

function getTodos() {
  $.getJSON(`${ROOT_URL}/items`, function(response){
    let items = response.items
    items.sort(function(a, b) {
      return parseInt(a.created_at) - parseInt(b.created_at)
    })
    todos = items

    $('.todo-list').html(todoTemplate(items))
    $('.main').toggle(items.length > 0)
    $('.toggle-all').prop('checked', getActiveTodos().length === 0)
    renderFooter()
    $('.new-todo').focus()
  })
}

function renderFooter() {
  let todoCount = todos.length
  let activeTodoCount = getActiveTodos().length

  var template = footerTemplate({
    activeTodoCount: activeTodoCount,
    activeTodoWord: pluralize(activeTodoCount, 'item'),
    completeTodos: todoCount - activeTodoCount,
    filter: getFilterState()
  })
  $('.footer').toggle(todoCount > 0).html(template)
}

function pluralize(count, word) {
  return count === 1 ? word : word + 's';
}

function getFilterState() {
  let state = "all"
  if (window.location.hash) {
    state = window.location.hash.substring(2)
  }
  return state
}

function getActiveTodos() {
  return todos.filter(function(todo) {
    return !todo.complete
  })
}

function getCompleteTodos() {
  return todos.filter(function(todo) {
    return todo.complete
  })
}

function getFilteredTodos() {
  if (getFilterState() === 'active') return getActiveTodos()
  if (getFilterState() === 'complete') return getCompleteTodos()

  return todos
}

function getIndexFromEl(el) {
  let id = $(el).closest('li').data('id')
  let i = todos.length

  while (i--) {
    if (todos[i].id === id) return i
  }
}

function createTodo(event) {
  let $input = $(event.target)
  let val = $input.val().trim()

  if (event.which !== ENTER_KEY || !val) return

  data = JSON.stringify({
    title: val
  })
  $.post(`${ROOT_URL}/items`, data, function(response) {
    $input.val('')
    getTodos()
  }, 'json')
}

function toggleCompletion(event) {
  let index = getIndexFromEl(event.target)
  todos[index].completed = !todos[index].completed
  $.ajax({
    type: "PUT",
    url: `${ROOT_URL}/items/${todos[index].id}`,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({ completed: todos[index].completed }),
    complete: function(jqXHR, textStatus) {
      getTodos()
    }
  })
}

function editingMode(event) {
  let $input = $(event.target).closest('li').addClass('editing').find('.edit')
  let tmpStr = $input.val()
  $input.val('')
  $input.val(tmpStr)
  $input.focus()
}

function editKeyup(event) {
  if (event.which === ENTER_KEY) event.target.blur()
  if (event.which === ESCAPE_KEY) $(event.target).data('abort', true).blur()
}

function update(event) {
  let el = event.target
  let $el = $(el)
  let val = $el.val().trim()

  if ($el.data('abort')) {
    $el.data('abort', false)
  } else if (!val) {
    destroy(event)
    return
  } else {
    idx = getIndexFromEl(el)
    todos[idx].title = val
    $.ajax({
      type: "PUT",
      url: `${ROOT_URL}/items/${todos[idx].id}`,
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify({ title: todos[idx].title }),
      complete: function(jqXHR, textStatus) {
        getTodos()
      }
    })
  }
}

function destroy(event) {
  let idx = getIndexFromEl(event.target)
  let item_id = todos[idx].id
  todos.splice(idx, 1)
  $.ajax({
    type: "DELETE",
    url: `${ROOT_URL}/items/${item_id}`,
    complete: function(jqXHR, textStatus) {
      getTodos()
    }
  })
}

// $('#new-item').submit(function(event) {
//   event.preventDefault()

//   const itemText = $('#new-item-entry').val()
//   let data = {'item': itemText}
//   data = JSON.stringify(data)

//   $.post(`${ROOT_URL}/items`, data, function(response){
//     console.log(response)
//     getTodoItems()
//   }, 'json')
// })

// function getTodoItems() {
//   $.getJSON(`${ROOT_URL}/items`, function(response){
//     $('#todo-list').empty()

//     let items = response.items
//     items.sort(function(a, b) {
//       return parseInt(a.created_at) - parseInt(b.created_at)
//     })

//     items.forEach(item => {
//       $('#todo-list').append(`<li data-id="${item.id}">${item.text}</li>`)
//     });
//   })
// }
