/*globals ko*/
function AddComments(comment) {
    this.comment = comment;
}

function AppViewModel() {
    var pure = this;
    pure.comments = ko.observableArray([
        new AddComments("This is the first comment!"),
        new AddComments("Here's the second one!"),
        new AddComments("And this is one more."),
        new AddComments("Here is another one!")
    ]);
    pure.addedComment = ko.observable();

    pure.addCommentFromInputBox = function () {
        if (pure.addedComment()!=="" && pure.addedComment()!==undefined){
            pure.comments.push(new AddComments(pure.addedComment()));
            pure.addedComment("");
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