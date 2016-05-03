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
    var self = this;

    self.selectedTab = ko.observable();

    self.tabs = ko.observableArray([
        new Tab('Newest', self.selectedTab),
        new Tab('Oldest', self.selectedTab),
        new Tab('Tags', self.selectedTab),
        new Tab('Add', self.selectedTab)
    ]);
    
    self.selectedTab(self.tabs()[0]);

    self.todos = ko.observableArray([]);
    self.addedTodo_Description = ko.observable("");
    self.addedTodo_Tags = ko.observable("");
    self.tagsTabObjs = ko.observable([]);

    function formatData() {
        var tags = [];

        self.todos().forEach(function (toDo) {
            toDo.tags().forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        var tagObjects = tags.map(function (tag) {
            var toDosUsingTag = [];

            self.todos().forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosUsingTag.push(toDo.description);
                }
            });

            return { "name": tag, "toDos": toDosUsingTag };
        });
        self.tagsTabObjs(tagObjects);
    }

    $.getJSON("/todos.json", function (allData) {
        var mappedTodos = $.map(allData, function (item) { return new ToDo(item); });
        self.todos(mappedTodos);
        formatData();
    });

    self.addNewToDo = function () {
        var description = self.addedTodo_Description,
            tags = self.addedTodo_Tags,
            split_tags = tags().split(','),
            newToDo = { "description": description, "tags": split_tags };

        if (description() !== "" && tags() !== "") {
            $.post("/todos", newToDo, function (result) {
                var mappedTodos = $.map(result, function (item) { 
                    return new ToDo(item); 
                });
                self.todos(mappedTodos);
                formatData();
            });
        }else{
            window.alert("Error in adding");
        }

        self.addedTodo_Description("");
        self.addedTodo_Tags("");
    };
}

ko.applyBindings(new ToDoAppViewModel());