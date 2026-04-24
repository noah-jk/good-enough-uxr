$(document).ready(function () {
    let tasks = [
        "Find the computer science program",
        "Locate the primary address",
        "Locate the counseling page"
    ];
    let currentTaskIndex = 0;

    // Function to show tasks
    function showTask() {
        if (currentTaskIndex >= tasks.length) {
            $("#testing-area").hide();
            $("#end-screen").removeClass("hidden");
            return;
        }

        $("#task-text").text(tasks[currentTaskIndex]);
    }

    // Start Test Button Click
    $("#start-test").click(function () {
        console.log("Test Started");
        $("#intro-screen, #overlay").fadeOut(300);
        $("#testing-area").removeClass("hidden");
        showTask();
    });

    // Skip Task Button Click
    $("#skip-task").click(function () {
        console.log("Skip Task Clicked - Before:", currentTaskIndex);
        currentTaskIndex++;
        console.log("Skip Task Clicked - After:", currentTaskIndex);
        showTask();
    });

    // Task Complete Button Click - Show Rating Popup & Overlay
    $("#task-complete").click(function () {
        console.log("Task Complete Clicked");
        $("#rating-popup").fadeIn(300);
        $("#overlay").fadeIn(300);
    });

    // Handle Task Rating & Hide Popup
    $(".rate-btn").click(function () {
        console.log("Rating Submitted:", $(this).data("rating"));
        $("#rating-popup").fadeOut(300);
        $("#overlay").fadeOut(300);
        currentTaskIndex++;
        showTask();
    });
});
