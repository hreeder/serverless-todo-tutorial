/* Javascript Code Here */
const ROOT_URL = "https://2ekitihnsb.execute-api.eu-west-2.amazonaws.com/dev"

$('#new-item').submit(function(event) {
  event.preventDefault()

  const itemText = $('#new-item-entry').val()
  let data = {'item': itemText}
  data = JSON.stringify(data)

  $.post(`${ROOT_URL}/items`, data, function(response){
    console.log(response)
  }, 'json')
})
