$(document).ready(function () {

    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append("<div class='article-block'> <p class='article-title' data-id='" + data[i]._id + "'><span class='article-intro'>Article title: </span>" + data[i].title + "</p> <a class='btn btn-light read-article-button' href='"+data[i].link + "'>Read Article</a>" + "<button class='btn btn-danger save-article-button' data-id='" + data[i]._id + "'>Save article</button>"+"<button class='btn btn-dark see-note-button' data-id='" + data[i]._id + "'>See notes</button></div>");
        }
    });

    $(document).on("click", "#scrapebutton", function () {
        event.preventDefault();
        $.get("/scrape", function (req, res) {
            // If we were able to successfully scrape and save an Article, send a message to the client
            console.log("Scrape Complete");
        });
    });


});


$(document).on("click", ".see-note-button", function () {

    // Empty the notes from the note section
    $("#note-modal").modal();
    $("#post-click-modal").empty();
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='save-note'>Save Note</button>");
            // A button to delete existing note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='delete-note'>Delete Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#save-note", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#post-click-modal").append("Note saved.");
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");

})

$(document).on("click", "#delete-note", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: "",
                // Value taken from note textarea
                body: ""
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#post-click-modal").append("Note deleted.");
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
})

$(document).on("click", ".save-article-button", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "PUT",
            url: "/saved-articles/" + thisId,
            data: {
                saved: true
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log("article saved");
            console.log(data);
            // Empty the notes section
            $("#save-article-modal").modal();
        });
});