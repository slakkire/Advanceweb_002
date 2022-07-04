var main = function (inputObjects) {
    //running in strict mode
    "use strict";

    var objectsToDo = inputObjects.map(function (toDo) {
        // this return the description of  toDoObject object
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // defining the event handler
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                //Looping over the list and adding content to DOM
                for (i = 0; i < objectsToDo.length; i++) {
                    $content.append($("<li>").text(objectsToDo[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                //appending the list
                objectsToDo.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];
                //checking for the duplicates data
                inputObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var objectsToDoWithTag = [];

                    inputObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            objectsToDoWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "objectsToDo": objectsToDoWithTag
                    };
                });

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.objectsToDo.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: ");
                $button = $("<button>").text("+");
                $input = $("<input>").addClass("description");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),

                        newToDo = {
                            "description": description,
                            "tags": tags
                        };
                    $.post("objectsToDo", newToDo, function (result) {
                        console.log(result);
                        //mapping the objects and pushing the objects
                        inputObjects.push(newToDo);
                        objectsToDo = inputObjects.map(function (toDo) {
                            return toDo.description;
                        });
                        $input.val("");
                        $tagInput.val("");
                    });
                });

                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};
//This function loads the json file data when the DOM  is ready
$(document).ready(function () {
    $.getJSON("objectsToDo.json", function (inputObjects) {
        main(inputObjects);
    });
});