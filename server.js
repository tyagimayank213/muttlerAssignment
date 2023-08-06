const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const upload = multer({ dest: 'uploads/' })
app.use(upload.single("fileUpload"))
app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/todoView/index.html');
});
app.post('/addtodo', function (req, res) {
    console.log("add")
    let todoData = {};
    todoData['todoText'] = req.body.todoText;
    let file = req.file;
    todoData['fileUpload'] = file.filename;
    saveTodoInFile(todoData, function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send({ data: data, fileName: file.filename });
        return;
    })

});
app.post('/deletetodo', function (req, res) {
    console.log("delete")
    deleteToddoFromFile(req.body.idd, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send("Deleted Successfully");
        return;
    });

});
app.post('/updatetodo', function (req, res) {
    console.log("update")
    updateTodoInFile(req.body.idd, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send("Updated Successfully");
        return;
    });

});

// style
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/todoView/style/style.css');
});
// script
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/todoView/script/script.js');
});
// delete image
app.get('/delete.png', (req, res) => {
    res.sendFile(__dirname + '/images/delete.png');
});

app.listen(4000, function () {
    console.log("server is running on 4000 prt")
})



// functions



// addTodo Function
function saveTodoInFile(todoData, callback) {
    readFileData(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        let obj = {
            todoText: todoData.todoText,
            fileName: todoData.fileUpload,
            completed: false
        };
        data[todoData.fileUpload] = obj;
        fs.writeFile('todoDataFile.json', JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, obj);
            return;
        });
    });
}

function readFileData(callback) {
    fs.readFile('todoDataFile.json', 'utf-8', function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = '{}';
        }
        try {
            data = JSON.parse(data);
            callback(null, data);
            return;
        } catch (err) {
            callback(err);
            return;
        }
    })
}

function deleteToddoFromFile(id, callback) {
    readFileData(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        delete data[id];
        fs.writeFile('todoDataFile.json', JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
        });
        const filename = id;
        const filePath = path.join(__dirname, 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                callback(err)
                return ;
            }
            callback(null);
            return;
        })
        return;
    })
}

function updateTodoInFile(id, callback){
    readFileData(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data[id].completed = !data[id].completed;
        fs.writeFile('todoDataFile.json', JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
            return;
        });
    });
}