let numberOfTodo = 0;
document.getElementById('myForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  numberOfTodo += 1;

  try {
    const response = await fetch('/addtodo', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // Handle the response data
      console.log('Response:', data);
      displayOnDOM(data);
    } else {
      console.error('Error: inn Response');
    }
  } catch (error) {
    console.error('Error:', error);
  }

});

function displayOnDOM(data) {
  document.getElementById('myForm').reset();
  let displayTodo = document.getElementById('displayTodo');
  let todoNode = document.createElement('div');
  todoNode.setAttribute('id', data.fileName);
  todoNode.setAttribute('class', 'todoNode')
  let todoNodeChild = `
                            <input type="checkbox" name=${data.fileName} class=${data.fileName}>
                            <label for=${data.fileName}>${data.data.todoText}</label>
                            <img src='${data.fileName}' class=${data.fileName}>
                            <img src="/delete.png" class='${data.fileName}'>
                        
                    `
  todoNode.innerHTML = todoNodeChild;
  displayTodo.appendChild(todoNode);
  const delBtn = document.querySelector(`img[src="/delete.png"]`);
  delBtn.addEventListener('click', deleteTodo);
  const checkbox = document.querySelector(`input[type='checkbox']`);
  checkbox.addEventListener('change', updateTodo);
}

function deleteTodo() {
  const sendData = {
    idd: this.className
  };

  fetch('/deleteTodo', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  }).then(function (response) {
    if (response.status === 200) {
      deleteFromUI(sendData.idd);
    }
    else {
      alert('Something weird happened')
    }
  }).catch(function (err) {
    console.log('Error in deleting Node ', err);
  })
}
function deleteFromUI(id){
  const element = document.getElementById(id);
  element.remove();
}


function updateTodo(){
  const checked = this.checked;
  const sendData = {
    idd: this.className
  };
  console.log(this.checked);
  console.log(sendData)

  fetch('/updatetodo', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  }).then(function (response) {
    if (response.status === 200) {
      if(checked)
        alert("To-do Complete");
      else
        alert("To-do Incomplete");
    }
    else {
      alert('Something weird happened')
    }
  }).catch(function (err) {
    console.log('Error in deleting Node ', err);
  })
}

