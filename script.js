$(document).ready(function () {
    let tasks = [
        "Find the computer science program",
        "Locate the primary address",
        "Locate the counseling page"
    ];
    let currentTaskIndex = 0;
    let results = [];

    function showTask() {
        if (currentTaskIndex >= tasks.length) {
            showSummary();
            return;
        }
        $("#task-text").text(tasks[currentTaskIndex]);
    }

    function showSummary() {
        $("#testing-area").hide();
        const $list = $("#summary-list").empty();
        results.forEach(function (r) {
            const badgeClass = "summary-badge--" + r.rating.toLowerCase();
            $list.append(
                $("<div>").addClass("summary-row").append(
                    $("<span>").addClass("summary-task").text(r.task),
                    $("<span>").addClass("summary-badge " + badgeClass).text(r.rating)
                )
            );
        });
        $("#end-screen").removeClass("hidden");
    }

    $("#start-test").click(function () {
        $("#intro-screen, #overlay").fadeOut(300);
        $("#testing-area").removeClass("hidden");
        showTask();
    });

    $("#skip-task").click(function () {
        results.push({ task: tasks[currentTaskIndex], rating: "Skipped" });
        currentTaskIndex++;
        showTask();
    });

    $("#task-complete").click(function () {
        $("#rating-popup").fadeIn(300);
        $("#overlay").fadeIn(300);
    });

    $(".rate-btn").click(function () {
        results.push({ task: tasks[currentTaskIndex], rating: $(this).data("rating") });
        $("#rating-popup").fadeOut(300);
        $("#overlay").fadeOut(300);
        currentTaskIndex++;
        showTask();
    });
});
