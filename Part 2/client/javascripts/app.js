/*globals $*/
/*globals ko*/
function ToDo(data) {
    this.description = ko.observable(data.description);
    this.tags = ko.observableArray(data.tags);
}

var Tab = function (name, selected) {
    this.name = name;
    this.isSelected = ko.computed(function () {
        return this === selected();
    }, this);
};

function ToDoAppViewModel() {
    var pure = this;

    pure.selectedTab = ko.observable();

    pure.tabs = ko.observableArray([
        new Tab('Newest', pure.selectedTab),
        new Tab('Oldest', pure.selectedTab),
        new Tab('Tags', pure.selectedTab),
        new Tab('Add', pure.selectedTab)
    ]);
    
    pure.selectedTab(pure.tabs()[0]);

    pure.todos = ko.observableArray([]);
    pure.addedTodo_Description = ko.observable("");
    pure.addedTodo_Tags = ko.observable("");
    pure.tagsTabObjs = ko.observable([]);

    function formatData() {
        var tags = [];

        pure.todos().forEach(function (toDo) {
            toDo.tags().forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        var tagObjects = tags.map(function (tag) {
            var toDosUsingTag = [];

            pure.todos().forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosUsingTag.push(toDo.description);
                }
            });

            return { "name": tag, "toDos": toDosUsingTag };
        });
        pure.tagsTabObjs(tagObjects);
    }

    $.getJSON("/todos.json", function (allData) {
        var mappedTodos = $.map(allData, function (item) { return new ToDo(item); });
        pure.todos(mappedTodos);
        formatData();
    });

    pure.addNewToDo = function () {
        var description = pure.addedTodo_Description,
            tags = pure.addedTodo_Tags,
            split_tags = tags().split(','),
            newToDo = { "description": description, "tags": split_tags };

        if (description() !== "" && tags() !== "") {
            $.post("/todos", newToDo, function (result) {
                var mappedTodos = $.map(result, function (item) { 
                    return new ToDo(item); 
                });
                pure.todos(mappedTodos);
                formatData();
            });
        }else{
            window.alert("Error in adding");
        }

        pure.addedTodo_Description("");
        pure.addedTodo_Tags("");
    };
}

ko.applyBindings(new ToDoAppViewModel());