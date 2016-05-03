/*globals ko*/
function AddComments(comment) {
    this.comment = comment;
}

function AppViewModel() {
    var self = this;
    self.comments = ko.observableArray([
        new AddComments("This is the first comment!"),
        new AddComments("Here's the second one!"),
        new AddComments("And this is one more."),
        new AddComments("Here is another one!")
    ]);
    self.addedComment = ko.observable();

    self.addCommentFromInputBox = function () {
        if (self.addedComment()!=="" && self.addedComment()!==undefined){
            self.comments.push(new AddComments(self.addedComment()));
            self.addedComment("");
        }

    };

    ko.bindingHandlers.enterKey = {
        init: function (element, valueAccessor, allBindings, data, context) {
            var wrapper = function (data, event) {
                if (event.keyCode === 13) {
                    valueAccessor().call(this, data, event);
                }
            };
            ko.applyBindingsToNode(element, { event: { keyup: wrapper } }, context);
        }
    };
    
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());